import type { CommittedSnapshot, SaveDataV1, SaveToken, ValidationIssue, ValidationResult, TransitionContext, StateController, UpdateReadiness } from './contracts';
import { SAVE_LIMITS } from './contracts';
import type { ActivityResponse, TaskDefinition, LearningAssistance, BandEvidence, CompletedLearningEpisode, ActiveLearningEpisode } from '../learning/contracts';
import { canonicalQuestionId } from '../learning/identity';
import { evaluateResponse } from '../learning/evaluate';
import { isIndependentEpisode, usedAnswerHelp } from '../learning/evidence';
import { listTasks, validateCatalogue } from '../content/catalogue';
import { SKILLS } from '../content/skills';
import { QUEST_ACTIVITY_BINDINGS, areRequiredBindingsComplete } from '../content/quest-bindings';
import { AVATARS, COSMETICS, CREATIVE_CHOICES, QUESTS } from '../experience/catalogue';
import { weekKeyFor } from '../rewards/calendar';
import { validateRewardState } from '../rewards/scoring';
import { validateCompetitionState } from '../rewards/standings';

/** These are portable format policies, independent of IndexedDB/build versions.
 * M2 must register its compatible content/binding path explicitly. */
export const BACKUP_FORMAT = 'learning-is-fun-save' as const;
export const SUPPORTED_CONTENT_VERSION = 'm1';
export const SUPPORTED_REWARD_POLICY_VERSION = '1';
export type BackupEnvelopeV1 = Readonly<{ format: typeof BACKUP_FORMAT; schemaVersion: 1; exportedAt: string; save: SaveDataV1 }>;
export type DecodeResult = Readonly<{ status: 'valid'; envelope: BackupEnvelopeV1 }>
  | Readonly<{ status: 'invalid' | 'unsupported'; issues: readonly ValidationIssue[] }>;

class DecodeError extends Error {
  constructor(readonly issue: ValidationIssue, readonly status: 'invalid' | 'unsupported' = 'invalid') { super(issue.message); }
}
function fail(path: string, message: string, code: ValidationIssue['code'] = 'invalid-save', status: 'invalid' | 'unsupported' = 'invalid'): never {
  throw new DecodeError({ path, code, message }, status);
}
function requireFact(ok: unknown, path: string, message: string): asserts ok { if (!ok) fail(path, message); }
const forbidden = new Set(['__proto__', 'prototype', 'constructor']);
const bytes = (text: string) => new TextEncoder().encode(text).byteLength;
const byteLimit = (length: number) => { if (length > SAVE_LIMITS.backupBytes) fail('$', 'This save exceeds the supported 16 MiB budget. Keep the last committed backup and recover without truncating data.', 'capacity-exceeded'); };
type Reader<T> = (value: unknown, path: string) => T;
type Fields = Readonly<Record<string, Reader<unknown>>>;
type ReadFields<F extends Fields> = { [K in keyof F]: F[K] extends Reader<infer T> ? T : never };
function object<R extends Fields, O extends Fields = Record<never, never>>(required: R, optional?: O): Reader<ReadFields<R> & Partial<ReadFields<O>>> {
  return (value, path) => {
    requireFact(value !== null && typeof value === 'object' && !Array.isArray(value), path, 'Expected a plain record.');
    const input = value as Record<string, unknown>;
    for (const key of Object.keys(input)) requireFact(Object.hasOwn(required, key) || !!optional && Object.hasOwn(optional, key), `${path}.${key}`, 'Unexpected field in this format.');
    const output: Record<string, unknown> = {};
    for (const [key, read] of Object.entries(required)) {
      requireFact(Object.hasOwn(input, key), `${path}.${key}`, 'Required field is missing.');
      output[key] = read(input[key], `${path}.${key}`);
    }
    for (const [key, read] of Object.entries(optional ?? {})) if (Object.hasOwn(input, key)) output[key] = read(input[key], `${path}.${key}`);
    // The only cast in the record builder: every output field is explicitly decoded.
    return output as ReadFields<R> & Partial<ReadFields<O>>;
  };
}
const text: Reader<string> = (v, p) => { requireFact(typeof v === 'string' && v.length <= SAVE_LIMITS.textCharacters, p, 'Expected text of at most 4096 characters.'); return v; };
const id: Reader<string> = (v, p) => { const s = text(v, p); requireFact(s.length > 0 && s.length <= SAVE_LIMITS.idCharacters, p, 'Expected an ID of 1–160 characters.'); return s; };
const nickname: Reader<string> = (v, p) => { const s = text(v, p); requireFact(s.trim().length > 0 && s.length <= SAVE_LIMITS.nicknameCharacters, p, 'Nickname must contain 1–24 characters.'); return s; };
const bool: Reader<boolean> = (v, p) => { requireFact(typeof v === 'boolean', p, 'Expected a boolean.'); return v; };
const integer = (min = 0, max = Number.MAX_SAFE_INTEGER): Reader<number> => (v, p) => { requireFact(typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max, p, `Expected a whole number from ${min} to ${max}.`); return v; };
const counter = integer();
function enumeration<const T extends readonly (string | number | boolean)[]>(values: T): Reader<T[number]> {
  return (v, p) => { requireFact(values.includes(v as T[number]), p, 'Unknown value in this format.'); return v as T[number]; };
}
const nullable = <T>(read: Reader<T>): Reader<T | null> => (v, p) => v === null ? null : read(v, p);
const array = <T>(read: Reader<T>, max: number = SAVE_LIMITS.visitedValues): Reader<T[]> => (v, p) => {
  requireFact(Array.isArray(v), p, 'Expected an array.');
  if (v.length > max) fail(p, `Array exceeds the supported ${max} entries.`, 'capacity-exceeded');
  return v.map((item, i) => read(item, `${p}[${i}]`));
};
const dictionary = <T>(read: Reader<T>, keyReader: Reader<string> = id, max: number = SAVE_LIMITS.visitedValues): Reader<Record<string, T>> => (v, p) => {
  requireFact(v !== null && typeof v === 'object' && !Array.isArray(v), p, 'Expected an ID map.');
  const entries = Object.entries(v); if (entries.length > max) fail(p, `Map exceeds the supported ${max} entries.`, 'capacity-exceeded');
  const result: Record<string, T> = {};
  for (const [key, value] of entries) { keyReader(key, `${p}.${key}`); result[key] = read(value, `${p}.${key}`); }
  return result;
};
const unique = <T>(read: Reader<T>, max?: number): Reader<T[]> => (v, p) => { const a = array(read, max)(v, p); requireFact(new Set(a).size === a.length, p, 'Duplicate identity.'); return a; };
const date: Reader<string> = (v, p) => { const s = text(v, p); try { weekKeyFor(s); } catch { fail(p, 'Expected a valid Gregorian date.'); } return s; };
const week: Reader<string> = (v, p) => { const s = date(v, p); requireFact(weekKeyFor(s) === s, p, 'Expected a Monday competition week.'); return s; };
const timestamp: Reader<string> = (v, p) => { const s = text(v, p); requireFact(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString() === s && !s.startsWith('0000'), p, 'Expected an ISO UTC backup date.'); return s; };
const band = enumeration(['support', 'core', 'stretch']);
const skill = enumeration(SKILLS.map(s => s.skillId));
const selectionReason = enumeration(['story-anchor', 'transfer', 'adaptive-practice', 'due-review', 'child-easier', 'repeat-practice']);
const help = object({ answerHintUsed: bool, workedSupportUsed: bool, assessedTextReadAloud: bool, evidenceMode: enumeration(['independent', 'listening-supported', 'mixed']) });
const reviewReference = nullable(object({ canonicalQuestionId: id, dueLocalDate: date, previousSuccessWeek: week }));
const feedbackIssue = object({ code: id, observed: text, explanation: text, slotId: nullable(id), constraintId: nullable(id) });
const feedbackIssues = array(feedbackIssue);
const descriptor = object({ familyId: id, equivalenceVersion: id, authoredKey: nullable(id), parameters: dictionary((v, p) => typeof v === 'string' ? text(v, p) : integer(Number.MIN_SAFE_INTEGER)(v, p)) });
const eligibility: Reader<import('../rewards/contracts').EligibilityResult> = (v, p) => {
  const r = object({ kind: id, reason: id })(v, p);
  const reasons: Record<string, readonly string[]> = { 'eligible-first': ['first-encounter'], 'eligible-review': ['selected-due-review'], 'resume-existing': ['unfinished-opportunity'], 'practice-only': ['same-week-used', 'child-practice', 'not-due', 'unfinished-free-practice', 'familiar-repeat'] };
  requireFact(Object.hasOwn(reasons, r.kind) && reasons[r.kind].includes(r.reason), p, 'Invalid reward classification.');
  return r as import('../rewards/contracts').EligibilityResult;
};
const selection = object({ profileId: id, canonicalQuestionId: id, encounterId: id, selectionReason: enumeration(['story', 'adaptive', 'due-review', 'child-practice']), candidate: enumeration(['first-encounter', 'later-week-due-review', 'none']), band }, { dueLocalDate: date, previousSuccessWeek: week });
const opportunity = object({ opportunityId: id, profileId: id, canonicalQuestionId: id, ordinal: integer(1), selectionFacts: selection, earningWeek: nullable(week), slot: nullable(integer(1, 30)), validChecks: counter, answerHintUsed: bool, components: object({ answer: bool, independentSuccess: bool, supportedSuccess: bool }) }, { firstSuccessWeek: week, firstSuccessLocalDate: date });
const track = object({ lastAllocatedOrdinal: counter, completedThroughOrdinal: counter, closedAwardTotal: counter, freePractice: object({ validChecks: counter, answerHintUsed: bool }, { latestWeek: week, unfinishedEncounterId: id }) }, { lastSuccessWeek: week, lastSuccessLocalDate: date, currentOpportunity: opportunity, recentCompletedOpportunity: opportunity });
const receipt: Reader<import('../rewards/contracts').RewardReceiptKey> = (v, p) => {
  requireFact(v !== null && typeof v === 'object', p, 'Expected a receipt key.');
  return Object.hasOwn(v, 'opportunityId') ? object({ opportunityId: id, component: enumeration(['answer', 'independent-success', 'supported-success']) })(v, p) : object({ profileId: id, questId: id })(v, p);
};
const delta = object({ lifetimeDelta: integer(0, 40), competitiveDelta: integer(0, 20), consumedSlot: nullable(integer(1, 30)), newReceiptKeys: array(receipt, 3), newEntitlementIds: unique(id, 5) });
const evaluation = object({ status: enumeration(['judged']), correct: bool, canonicalQuestionId: id, skillId: skill, objectiveId: id, band, feedback: object({ explanation: text, issues: feedbackIssues }) });
const response: Reader<ActivityResponse> = (v, p) => {
  requireFact(v !== null && typeof v === 'object', p, 'Expected a response.');
  switch ((v as { kind?: unknown }).kind) {
    case 'bridge': return object({ kind: enumeration(['bridge']), planks: array(integer(1, 6), 6) })(v, p);
    case 'merchant': return object({ kind: enumeration(['merchant']), apples: nullable(counter), pears: nullable(counter) })(v, p);
    case 'punctuation': return object({ kind: enumeration(['punctuation']), slots: dictionary(nullable(text)) })(v, p);
    default: return fail(p, 'This response family is unavailable in M1.', 'unsupported-content', 'unsupported');
  }
};
const episode = object({ ordinal: integer(1), validChecks: counter, firstCheckSequence: nullable(integer(1)), status: enumeration(['open', 'suspended', 'completed-success', 'completed-unsuccessful']), completionActionId: nullable(id) });
const encounter = object({ encounterId: id, opportunityId: nullable(id), canonicalQuestionId: id, descriptor, taskContentRevision: id, skillId: skill, band, selectionReason, bindingProvenance: nullable(object({ bindingId: id, questId: id, role: enumeration(['story', 'optional-transfer', 'revisit']) })), familiar: bool, reviewReference, validChecks: counter, firstCheckCorrect: nullable(bool), assistance: help, learningEpisode: episode, responseDraft: nullable(response), revealedAssistanceIds: unique(id, 3), eligibility, lastCommittedCheck: nullable(object({ submissionId: id, checkSequence: integer(1), learningEpisodeOrdinal: integer(1), response, evaluation, delta })) });
const history = object({ canonicalQuestionId: id, pendingEncounterId: nullable(id), everChecked: bool, previousSuccessLocalDate: nullable(date), previousSuccessWeek: nullable(week), checkedCompetitionWeekIds: unique(week), assistance: help });
const episodeFacts = { encounterId: id, learningEpisodeOrdinal: integer(1), canonicalQuestionId: id, objectiveId: id, band, validChecks: integer(1), encounterCheckIndex: integer(1), firstCheckCorrect: bool, assistance: help, issues: feedbackIssues };
const activeEpisode = object(episodeFacts);
const completedEpisode = object({ ...episodeFacts, outcome: enumeration(['success', 'deliberate-unsuccessful']), localDate: date, competitionWeekId: week, familiar: bool, reviewReference });
const bandEvidence = object({ validChecks: counter, correctChecks: counter, answerHelpChecks: counter, completedEpisodes: counter, independentSuccesses: counter, supportedSuccesses: counter, retrySuccesses: counter, laterDistinctSuccesses: counter, distinctSuccessfulCanonicalQuestionIds: unique(id, 4), recentCompletedEpisodes: array(completedEpisode, 4), reviewResults: array(object({ canonicalQuestionId: id, localDate: date, competitionWeekId: week, outcome: enumeration(['independent-success', 'supported-success', 'unsuccessful']), familiar: bool }), 4), reviewDueLocalDate: nullable(date) });
const evidence = dictionary(object({ skillId: skill, bands: object({ support: bandEvidence, core: bandEvidence, stretch: bandEvidence }), activeEpisodes: dictionary(activeEpisode) }), skill, 20);
const creative = object({ scarfColourId: enumeration(['teal', 'amber', 'plum']), scarfPatternId: nullable(id), flowerColourId: enumeration(['coral', 'gold', 'violet']), planterRimId: nullable(id), facadeTrimId: nullable(id), placements: object({ 'plot-1': nullable(enumeration(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'])), 'plot-2': nullable(enumeration(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'])), 'plot-3': nullable(enumeration(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'])), 'plot-4': nullable(enumeration(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'])), 'plot-5': nullable(enumeration(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'])), 'plot-6': nullable(enumeration(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'])) }) });
const medals = object({ gold: counter, silver: counter, bronze: counter });
const profile = object({ identity: object({ profileId: id, nickname, avatarId: enumeration(AVATARS.map(a => a.id)) }), preferences: object({ instructionReadAloud: bool, motion: enumeration(['system', 'reduced']) }), learning: object({ evidence, canonicalHistory: array(history) }), encounters: dictionary(encounter), world: object({ completedQuestIds: unique(enumeration(QUESTS.map(q => q.id)), 10), completedStoryBindingIds: unique(id, 10) }), creative, rewards: object({ lifetimePoints: counter, tracksByCanonical: dictionary(track), questReceipts: array(object({ profileId: id, questId: id }), 10), entitlementIds: unique(id, 5) }), personalRecords: object({ best: nullable(object({ points: integer(1, 600), week })), medals }) });
const channel = object({ muted: bool, volume: (v: unknown, p: string) => { requireFact(typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1, p, 'Volume must be between 0 and 1.'); return v; } });
const competition = object({ timezone: enumeration(['Europe/London']), latestOpenedWeek: nullable(week), currentScores: dictionary(integer(0, 600), id, 16), currentSlots: dictionary(array(object({ slot: integer(1, 30), opportunityId: id, canonicalQuestionId: id, points: integer(0, 20) }), 30), id, 16), archives: array(object({ week, timezone: enumeration(['Europe/London']), policyVersion: id, entries: array(object({ profileId: id, nickname, avatarId: enumeration(AVATARS.map(a => a.id)), points: integer(1, 600), rank: integer(1, 16), medal: nullable(enumeration(['gold', 'silver', 'bronze'])) }), 16), omittedDeletedProfiles: bool }), 52), policyVersion: id });
const saveShape = object({ schemaVersion: enumeration([1]), contentVersion: id, rewardPolicyVersion: id, installation: object({ timezone: enumeration(['Europe/London']), audio: object({ soundEnabled: bool, silenceAll: bool, music: channel, effects: channel }) }), profiles: dictionary(profile, id, 16), competition });

/** Pre-parse container scan observes quoted escapes and duplicate member names.
 * JSON.parse remains the syntax authority. No object is built before depth is bounded. */
function scanJson(source: string) {
  const stack: (Set<string> | null)[] = [];
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"') {
      const start = i; let closed = false;
      for (i++; i < source.length; i++) {
        if (source[i] === '\\') { i++; continue; }
        if (source[i] === '"') { closed = true; break; }
      }
      if (!closed) fail('$', 'The JSON is truncated.');
      let next = i + 1; while (/\s/.test(source[next] ?? '') && next < source.length) next++;
      if (source[next] === ':' && stack.at(-1) instanceof Set) {
        const key: unknown = JSON.parse(source.slice(start, i + 1));
        requireFact(typeof key === 'string' && !forbidden.has(key), '$', 'Dangerous property name.');
        const keys = stack.at(-1)! as Set<string>;
        requireFact(!keys.has(key), '$', 'Duplicate JSON property name.'); keys.add(key);
      }
    } else if (ch === '{' || ch === '[') {
      stack.push(ch === '{' ? new Set() : null);
      if (stack.length > SAVE_LIMITS.nesting) fail('$', 'JSON nesting exceeds 32.', 'capacity-exceeded');
    } else if (ch === '}' || ch === ']') stack.pop();
  }
}
export type BackupBudget = Readonly<{ byteLength: number; visitedValues: number; nesting: number }>;
/** Same iterative budget for object callers; rejects getters, cycles, exotic
 * objects, sparse arrays and values JSON would silently omit/coerce. */
function inspectTree(value: unknown): Omit<BackupBudget, 'byteLength'> {
  const pending: { value: unknown; depth: number; path: string; exit?: boolean }[] = [{ value, depth: 0, path: '$' }]; const ancestors = new Set<object>();
  let visitedValues = 0, nesting = 0;
  let serializedBytes = 0;
  const addBytes = (amount: number) => { serializedBytes += amount; byteLimit(serializedBytes); };
  while (pending.length) {
    const item = pending.pop()!; const v = item.value;
    if (item.exit) { ancestors.delete(v as object); continue; }
    if (++visitedValues > SAVE_LIMITS.visitedValues) fail(item.path, 'The save exceeds 250,000 values.', 'capacity-exceeded');
    if (typeof v === 'string') { text(v, item.path); addBytes(bytes(JSON.stringify(v))); continue; }
    if (v === null || typeof v === 'boolean') { addBytes(v === null ? 4 : v ? 4 : 5); continue; }
    if (typeof v === 'number') { requireFact(Number.isFinite(v), item.path, 'Expected a finite JSON number.'); addBytes(JSON.stringify(v).length); continue; }
    requireFact(typeof v === 'object', item.path, 'Expected a JSON value.');
    requireFact(!ancestors.has(v), item.path, 'Cycles are not portable JSON.'); ancestors.add(v);
    pending.push({ value: v, depth: item.depth, path: item.path, exit: true });
    const depth = item.depth + 1; nesting = Math.max(nesting, depth);
    if (depth > SAVE_LIMITS.nesting) fail(item.path, 'Save nesting exceeds 32.', 'capacity-exceeded');
    requireFact(Array.isArray(v) ? Object.getPrototypeOf(v) === Array.prototype : Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null, item.path, 'Expected a plain JSON object.');
    const keys = Reflect.ownKeys(v);
    if (keys.length + visitedValues > SAVE_LIMITS.visitedValues + (Array.isArray(v) ? 1 : 0)) fail(item.path, 'The save exceeds 250,000 values.', 'capacity-exceeded');
    if (Array.isArray(v)) requireFact(keys.length === v.length + 1, item.path, 'Expected a dense plain array.');
    const members = Array.isArray(v) ? v.length : keys.length;
    addBytes(2 + Math.max(0, members - 1)); // Brackets/braces and commas.
    for (const key of keys) {
      if (Array.isArray(v) && key === 'length') continue;
      requireFact(typeof key === 'string' && !forbidden.has(key) && key.length <= SAVE_LIMITS.idCharacters, item.path, 'Dangerous or oversized property name.');
      if (Array.isArray(v)) requireFact(/^(0|[1-9]\d*)$/.test(key) && Number(key) < v.length, item.path, 'Arrays may contain only their dense indexed values.');
      const property = Object.getOwnPropertyDescriptor(v, key)!;
      requireFact(Object.hasOwn(property, 'value') && property.enumerable, `${item.path}.${key}`, 'Accessors and hidden fields are not JSON data.');
      if (!Array.isArray(v)) addBytes(bytes(JSON.stringify(key)) + 1); // Quoted key + colon.
      pending.push({ value: property.value, depth, path: `${item.path}.${key}` });
    }
  }
  return { visitedValues, nesting };
}
export function measureBackupBudget(envelope: BackupEnvelopeV1): BackupBudget {
  const budget = inspectTree(envelope); const byteLength = bytes(JSON.stringify(envelope)); byteLimit(byteLength);
  return { ...budget, byteLength };
}
const equal = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const left = Object.keys(a), right = Object.keys(b);
  return left.length === right.length && left.every(k => Object.hasOwn(b, k) && equal((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
};
function freeze<T>(value: T): T { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
function semantic(save: SaveDataV1, catalogue: readonly TaskDefinition[]) {
  if (save.contentVersion !== SUPPORTED_CONTENT_VERSION) fail('save.contentVersion', 'This content version requires a compatible application.', 'unsupported-content', 'unsupported');
  if (save.rewardPolicyVersion !== SUPPORTED_REWARD_POLICY_VERSION || save.competition.policyVersion !== SUPPORTED_REWARD_POLICY_VERSION || save.competition.archives.some(a => a.policyVersion !== SUPPORTED_REWARD_POLICY_VERSION)) fail('save.rewardPolicyVersion', 'This reward policy requires a compatible application.', 'unsupported-policy', 'unsupported');
  if (validateCatalogue(catalogue).length) fail('catalogue', 'A valid approved compatible catalogue is required.', 'unsupported-content', 'unsupported');
  const tasks = new Map(catalogue.map(t => [t.canonicalQuestionId, t]));
  const taskAt = (canonical: string, p: string) => { const task = tasks.get(canonical); if (!task) fail(p, 'Unknown canonical task; no compatibility mapping is registered.', 'unsupported-content', 'unsupported'); return task; };
  const checkDateWeek = (local: string, active: string, p: string) => { requireFact(weekKeyFor(local) <= active && save.competition.latestOpenedWeek !== null && active <= save.competition.latestOpenedWeek, p, 'Date/week is later than the retained competition context.'); };
  const globalEncounters = new Set<string>(), globalOpportunities = new Set<string>(), globalSubmissions = new Set<string>(), encounterOpportunityIds = new Set<string>();
  const availableOpportunities = new Map(Object.values(save.profiles).flatMap(p => Object.values(p.rewards.tracksByCanonical)
    .flatMap(t => [t.currentOpportunity, t.recentCompletedOpportunity].filter(o => o !== undefined).map(o => [o.opportunityId, o] as const))));
  const issueFacts = (issues: readonly import('../learning/contracts').FeedbackIssue[], task: TaskDefinition, p: string) => {
    for (const issue of issues) {
      requireFact(issue.slotId !== null || issue.constraintId !== null, p, 'Feedback needs a slot or constraint identity.');
      if (issue.slotId !== null) {
        const spec = task.responseSpec;
        requireFact('slots' in spec && spec.slots.some(s => s.id === issue.slotId), p, 'Feedback references an unknown response slot.');
      }
    }
  };
  const episodeFact = (e: CompletedLearningEpisode | ActiveLearningEpisode, skillId: string, p: string) => {
    const task = taskAt(e.canonicalQuestionId, `${p}.canonicalQuestionId`);
    requireFact(task.skillId === skillId && task.objectiveId === e.objectiveId && task.band === e.band && e.validChecks <= e.encounterCheckIndex && (!e.firstCheckCorrect || e.encounterCheckIndex === 1), p, 'Episode task/count/first-success facts are inconsistent.');
    issueFacts(e.issues, task, p);
    if ('localDate' in e) {
      checkDateWeek(e.localDate, e.competitionWeekId, p);
      // Educational review may be due within the success week. The separate
      // reward opportunity validator retains its strict later-week condition.
      if (e.reviewReference) requireFact(e.reviewReference.canonicalQuestionId === e.canonicalQuestionId && e.reviewReference.previousSuccessWeek <= e.competitionWeekId, p, 'Completed review provenance has a mismatched identity/week.');
      if (e.outcome === 'deliberate-unsuccessful') requireFact(!e.firstCheckCorrect, p, 'An unsuccessful episode cannot have a first-Check success.');
    }
  };
  const helpContains = (outer: LearningAssistance, inner: LearningAssistance) => (!inner.answerHintUsed || outer.answerHintUsed) && (!inner.workedSupportUsed || outer.workedSupportUsed) && (!inner.assessedTextReadAloud || outer.assessedTextReadAloud);
  for (const [profileId, profile] of Object.entries(save.profiles)) {
    const p = `save.profiles.${profileId}`;
    requireFact(profile.identity.profileId === profileId, `${p}.identity.profileId`, 'Profile map identity mismatch.');
    const quests = profile.world.completedQuestIds, bindings = profile.world.completedStoryBindingIds;
    for (const bindingId of bindings) requireFact(QUEST_ACTIVITY_BINDINGS.some(b => b.bindingId === bindingId && b.role === 'story'), `${p}.world.completedStoryBindingIds`, 'Only retained story binding IDs may be permanent.');
    for (const questId of quests) {
      const quest = QUESTS.find(q => q.id === questId)!;
      requireFact(quest.milestone === 'M1' && quest.requiresAll.every(q => quests.includes(q)) && areRequiredBindingsComplete({ bindings: QUEST_ACTIVITY_BINDINGS, questId, milestone: 'M1', completedStoryBindingIds: bindings }), `${p}.world.completedQuestIds`, 'Completed quest lacks its prerequisites or permanent required bindings.');
    }
    for (const b of QUEST_ACTIVITY_BINDINGS.filter(b => b.role === 'story' && bindings.includes(b.bindingId))) {
      for (const canonical of b.taskIds) taskAt(canonical, `${p}.world.completedStoryBindingIds`);
      const quest = QUESTS.find(q => q.id === b.questId)!;
      requireFact(quest.requiresAll.every(q => quests.includes(q)), `${p}.world`, 'Story binding lacks quest prerequisites.');
      if (areRequiredBindingsComplete({ bindings: QUEST_ACTIVITY_BINDINGS, questId: b.questId, milestone: 'M1', completedStoryBindingIds: bindings })) requireFact(quests.includes(quest.id), `${p}.world`, 'All required story bindings must atomically complete the quest.');
    }
    requireFact(profile.rewards.questReceipts.length === quests.length && profile.rewards.questReceipts.every(r => quests.includes(r.questId as typeof quests[number])), `${p}.rewards.questReceipts`, 'Quest receipts must exactly match permanent completed quests.');
    const appearance = profile.creative;
    for (const field of ['scarfPatternId', 'planterRimId', 'facadeTrimId'] as const) {
      const chosen = appearance[field]; if (chosen === null) continue;
      const option = COSMETICS.find(c => c.id === chosen && c.target === field);
      requireFact(option && option.milestone === 'M1' && profile.rewards.entitlementIds.includes(chosen) && option.requiresAll.every(q => quests.includes(q)), `${p}.creative.${field}`, 'Cosmetic is unavailable or not entitled.');
    }
    let placed = 0;
    for (const [socket, decoration] of Object.entries(appearance.placements)) if (decoration !== null) {
      placed++; requireFact(CREATIVE_CHOICES.placementLimits.M1.socketIds.some(s => s === socket) && decoration === 'planter' && quests.includes('Q3'), `${p}.creative.placements.${socket}`, 'Decoration/socket is unavailable.');
    }
    requireFact(placed <= 1, `${p}.creative.placements`, 'M1 permits at most one planter.');
    const histories = new Map(profile.learning.canonicalHistory.map(h => [h.canonicalQuestionId, h]));
    requireFact(histories.size === profile.learning.canonicalHistory.length, `${p}.learning.canonicalHistory`, 'Duplicate canonical history.');
    for (const h of histories.values()) {
      taskAt(h.canonicalQuestionId, `${p}.learning.canonicalHistory`);
      requireFact((h.previousSuccessLocalDate === null) === (h.previousSuccessWeek === null) && (h.everChecked || h.checkedCompetitionWeekIds.length === 0 && h.previousSuccessWeek === null), `${p}.learning.canonicalHistory`, 'Inconsistent canonical Check/success history.');
      if (h.previousSuccessWeek !== null) checkDateWeek(h.previousSuccessLocalDate!, h.previousSuccessWeek, `${p}.learning.canonicalHistory`);
      requireFact(h.checkedCompetitionWeekIds.every((w, i, a) => (i === 0 || a[i - 1] < w) && save.competition.latestOpenedWeek !== null && w <= save.competition.latestOpenedWeek), `${p}.learning.canonicalHistory`, 'Checked weeks must be ordered and no later than the active week.');
      if (h.pendingEncounterId !== null) { const e = profile.encounters[h.pendingEncounterId]; requireFact(e && e.canonicalQuestionId === h.canonicalQuestionId && e.learningEpisode.status !== 'completed-success', `${p}.learning.canonicalHistory`, 'Pending history must reference unresolved captured-profile work.'); }
    }
    for (const [key, e] of Object.entries(profile.encounters)) {
      const ep = `${p}.encounters.${key}`; const task = taskAt(e.canonicalQuestionId, `${ep}.canonicalQuestionId`);
      requireFact(e.encounterId === key && !globalEncounters.has(key), ep, 'Duplicate or mismatched encounter identity.'); globalEncounters.add(key);
      requireFact(e.taskContentRevision === task.contentRevision && e.skillId === task.skillId && e.band === task.band && canonicalQuestionId(e.descriptor) === e.canonicalQuestionId && equal(e.descriptor, task.descriptor), ep, 'Encounter descriptor/revision does not resolve to the approved task.');
      const h = histories.get(e.canonicalQuestionId); requireFact(h && (e.learningEpisode.status === 'completed-success' || helpContains(h.assistance, e.assistance)) && (e.validChecks === 0 || h.everChecked), ep, 'Unresolved encounter lacks its cumulative canonical history.');
      if (e.opportunityId !== null) {
        const available = availableOpportunities.get(e.opportunityId);
        requireFact(!encounterOpportunityIds.has(e.opportunityId) && (!available || available.profileId === profileId && available.canonicalQuestionId === e.canonicalQuestionId && available.selectionFacts.encounterId === key), ep, 'Opportunity reference is duplicated or belongs to different work.');
        encounterOpportunityIds.add(e.opportunityId);
      }
      const b = e.bindingProvenance;
      if (b) {
        const definition = QUEST_ACTIVITY_BINDINGS.find(row => row.bindingId === b.bindingId);
        requireFact(definition && definition.questId === b.questId && definition.role === b.role && definition.skillId === task.skillId && definition.responseKind === task.responseSpec.kind && definition.taskIds.includes(task.canonicalQuestionId), `${ep}.bindingProvenance`, 'Binding role/quest/task mismatch.');
        const quest = QUESTS.find(q => q.id === b.questId)!;
        requireFact(quest.requiresAll.every(q => quests.includes(q)), `${ep}.bindingProvenance`, 'Binding quest is inaccessible.');
        if (b.role === 'optional-transfer') { const source = QUEST_ACTIVITY_BINDINGS.find(row => row.bindingId === definition.sourceBindingId); requireFact(source && source.role === 'story' && source.taskIds.length === 1 && bindings.includes(source.bindingId), `${ep}.bindingProvenance`, 'Transfer requires the retained singleton source and permanent completion.'); taskAt(source.taskIds[0], `${ep}.bindingProvenance`); }
        if (b.role === 'revisit') requireFact(quests.includes(quest.id), `${ep}.bindingProvenance`, 'Revisit requires completed quest.');
        requireFact(e.selectionReason === (b.role === 'story' ? 'story-anchor' : b.role === 'optional-transfer' ? 'transfer' : 'adaptive-practice'), ep, 'Selection reason contradicts saved binding.');
        if (b.role === 'story' && e.learningEpisode.status === 'completed-success') requireFact(bindings.includes(b.bindingId), ep, 'Successful required work needs permanent completion.');
      } else requireFact(e.selectionReason !== 'story-anchor' && e.selectionReason !== 'transfer', ep, 'Bound selection needs saved provenance.');
      requireFact((e.selectionReason === 'due-review') === (e.reviewReference !== null), ep, 'Review reason/reference mismatch.');
      if (e.reviewReference) { taskAt(e.reviewReference.canonicalQuestionId, ep); requireFact(e.reviewReference.canonicalQuestionId === e.canonicalQuestionId, ep, 'Review identity mismatch.'); }
      const currentEpisode = e.learningEpisode; const closed = currentEpisode.status.startsWith('completed-');
      requireFact((e.firstCheckCorrect === null) === (e.validChecks === 0) && (!e.firstCheckCorrect || e.validChecks === 1 && currentEpisode.status === 'completed-success'), ep, 'First Check facts are inconsistent.');
      requireFact(currentEpisode.validChecks <= e.validChecks && (currentEpisode.firstCheckSequence === null) === (currentEpisode.validChecks === 0) && (currentEpisode.validChecks === 0 || currentEpisode.firstCheckSequence === e.validChecks - currentEpisode.validChecks + 1) && (currentEpisode.completionActionId !== null) === closed && (!closed || currentEpisode.validChecks > 0), ep, 'Episode counters/closure are inconsistent.');
      requireFact(currentEpisode.ordinal <= e.validChecks + 1 && (currentEpisode.ordinal !== 1 || currentEpisode.validChecks === e.validChecks), ep, 'Episode ordinal contradicts cumulative Checks.');
      if (currentEpisode.status !== 'completed-success') requireFact(h.pendingEncounterId === key, ep, 'Unresolved encounter must remain pending.');
      const revealIds = [...task.hints.map(h => h.id), task.workedSupport.id];
      requireFact(e.revealedAssistanceIds.every(a => revealIds.includes(a)) && (!e.revealedAssistanceIds.some(a => task.hints.some(h => h.id === a)) || e.assistance.answerHintUsed) && (!e.revealedAssistanceIds.includes(task.workedSupport.id) || e.assistance.workedSupportUsed), `${ep}.revealedAssistanceIds`, 'Assistance reference/flag mismatch.');
      if (e.responseDraft !== null) { const result = evaluateResponse(task, e.responseDraft); requireFact(result.status === 'incomplete' || result.status === 'judged', `${ep}.responseDraft`, 'Draft violates the task response bounds.'); }
      requireFact((e.lastCommittedCheck === null) === (e.validChecks === 0), `${ep}.lastCommittedCheck`, 'Last Check must retain the cumulative high-water.');
      if (e.lastCommittedCheck) {
        const last = e.lastCommittedCheck;
        requireFact(!globalSubmissions.has(last.submissionId) && last.checkSequence === e.validChecks && last.learningEpisodeOrdinal <= currentEpisode.ordinal && last.learningEpisodeOrdinal >= currentEpisode.ordinal - 1 && (currentEpisode.validChecks === 0 ? last.learningEpisodeOrdinal < currentEpisode.ordinal : last.learningEpisodeOrdinal === currentEpisode.ordinal), `${ep}.lastCommittedCheck`, 'Last Check attribution is inconsistent.'); globalSubmissions.add(last.submissionId);
        const actual = evaluateResponse(task, last.response);
        requireFact(actual.status === 'judged' && equal(actual, last.evaluation), `${ep}.lastCommittedCheck.evaluation`, 'Saved judgement does not match the approved retained task/response.');
        requireFact(currentEpisode.status === 'completed-success' ? last.evaluation.correct : !last.evaluation.correct, ep, 'Episode status contradicts last Check.');
        requireFact(last.delta.competitiveDelta <= last.delta.lifetimeDelta && [0, 5, 10, 20].includes(last.delta.competitiveDelta) && (last.delta.consumedSlot === null || last.checkSequence === 1), `${ep}.lastCommittedCheck.delta`, 'Invalid Check delta.');
        const components = last.delta.newReceiptKeys.map(r => 'component' in r ? r.component : 'quest');
        requireFact(new Set(components).size === components.length && !(components.includes('independent-success') && components.includes('supported-success'))
          && last.delta.newReceiptKeys.every(r => 'opportunityId' in r ? r.opportunityId === e.opportunityId
            : r.profileId === profileId && b?.role === 'story' && r.questId === b.questId && quests.includes(r.questId as typeof quests[number]))
          && components.reduce((sum, c) => sum + (c === 'quest' ? 20 : c === 'independent-success' ? 15 : 5), 0) === last.delta.lifetimeDelta
          && (last.evaluation.correct || !components.some(c => c !== 'answer')) && (last.checkSequence === 1 || !components.includes('answer'))
          && (!components.includes('independent-success') || last.checkSequence === 1 && !usedAnswerHelp(e.assistance))
          && (!components.includes('supported-success') || last.checkSequence > 1 || usedAnswerHelp(e.assistance))
          && last.delta.newEntitlementIds.every(a => profile.rewards.entitlementIds.includes(a)), `${ep}.lastCommittedCheck.delta`, 'Receipt components/delta are inconsistent.');
        const firstAnswer = e.opportunityId !== null && last.checkSequence === 1;
        const independent = e.opportunityId !== null && last.evaluation.correct && last.checkSequence === 1 && !usedAnswerHelp(e.assistance);
        const supported = e.opportunityId !== null && last.evaluation.correct && !independent;
        requireFact(components.includes('answer') === firstAnswer && components.includes('independent-success') === independent
          && components.includes('supported-success') === supported, `${ep}.lastCommittedCheck.delta`, 'Last Check must retain its actual newly awarded components.');
        const available = e.opportunityId === null ? undefined : availableOpportunities.get(e.opportunityId);
        const checkPoints = (firstAnswer ? 5 : 0) + (independent ? 15 : supported ? 5 : 0);
        requireFact(e.opportunityId !== null || last.delta.competitiveDelta === 0 && last.delta.consumedSlot === null,
          `${ep}.lastCommittedCheck.delta`, 'Free practice cannot retain competitive awards.');
        if (available) requireFact((last.checkSequence !== 1 || last.delta.consumedSlot === available.slot)
          && (available.earningWeek !== save.competition.latestOpenedWeek || last.delta.competitiveDelta === (available.slot === null ? 0 : checkPoints)),
        `${ep}.lastCommittedCheck.delta`, 'Last Check slot/current-week delta contradicts its retained opportunity.');
      }
      const t = profile.rewards.tracksByCanonical[e.canonicalQuestionId];
      requireFact(t || e.opportunityId === null && e.validChecks === 0 && e.eligibility.kind === 'practice-only', ep, 'Checked or assigned work lacks its reward/practice track.');
      if (e.opportunityId !== null) {
        requireFact(t, ep, 'Assigned encounter lacks its reward track.');
        const o = [t.currentOpportunity, t.recentCompletedOpportunity].find(o => o?.opportunityId === e.opportunityId);
        requireFact(o || currentEpisode.status === 'completed-success', ep, 'Unresolved encounter needs its retained opportunity.');
        if (o) {
          requireFact(o.selectionFacts.encounterId === key && o.validChecks === e.validChecks && o.answerHintUsed === usedAnswerHelp(e.assistance) && o.selectionFacts.band === e.band, ep, 'Encounter opportunity/Check/help identity mismatch.');
          const reason = e.selectionReason === 'story-anchor' ? 'story' : e.selectionReason === 'due-review' ? 'due-review'
            : e.selectionReason === 'child-easier' || e.selectionReason === 'repeat-practice' ? 'child-practice' : 'adaptive';
          requireFact(o.selectionFacts.selectionReason === reason, ep, 'Saved learning and reward selection reasons disagree.');
          requireFact((currentEpisode.status === 'completed-success') === (o === t.recentCompletedOpportunity), ep, 'Unresolved/completed opportunity mismatch.');
        }
      } else if (currentEpisode.status !== 'completed-success') {
        requireFact(e.eligibility.kind === 'practice-only', ep, 'Unbound work must retain practice classification.');
        // WP05 creates/binds free-practice counters at its first valid Check.
        // A new zero-Check practice draft need not reset older completed facts.
        if (e.validChecks > 0 || t?.freePractice.unfinishedEncounterId !== undefined) requireFact(t && t.freePractice.unfinishedEncounterId === key && t.freePractice.validChecks === e.validChecks
          && t.freePractice.answerHintUsed === usedAnswerHelp(e.assistance), ep, 'Checked unresolved free practice facts mismatch.');
      }
    }
    for (const [canonical, t] of Object.entries(profile.rewards.tracksByCanonical)) {
      taskAt(canonical, `${p}.rewards.tracksByCanonical.${canonical}`);
      const history = histories.get(canonical);
      requireFact(history && (t.lastSuccessWeek === undefined ? history.previousSuccessWeek === null
        : history.previousSuccessWeek === t.lastSuccessWeek && history.previousSuccessLocalDate === t.lastSuccessLocalDate), p, 'Reward success must match retained canonical success history.');
      for (const o of [t.currentOpportunity, t.recentCompletedOpportunity]) if (o) {
        requireFact(!globalOpportunities.has(o.opportunityId), p, 'Duplicate household opportunity identity.'); globalOpportunities.add(o.opportunityId);
        requireFact(o.selectionFacts.band === taskAt(canonical, p).band, p, 'Opportunity task band mismatch.');
        if (o === t.currentOpportunity) { const e = profile.encounters[o.selectionFacts.encounterId]; requireFact(e && e.opportunityId === o.opportunityId, p, 'Unresolved opportunity requires its encounter.'); }
        // A compacted completed encounter is intentionally not a live FK.
      }
      if (t.freePractice.unfinishedEncounterId) requireFact(profile.encounters[t.freePractice.unfinishedEncounterId]?.opportunityId === null, p, 'Unfinished practice reference is dangling.');
    }
    for (const [key, s] of Object.entries(profile.learning.evidence)) {
      requireFact(s.skillId === key, `${p}.learning.evidence.${key}`, 'Skill map identity mismatch.');
      for (const [bandKey, b] of Object.entries(s.bands)) validateBand(b, key, bandKey, `${p}.learning.evidence.${key}.bands.${bandKey}`);
      for (const [encounterId, active] of Object.entries(s.activeEpisodes)) {
        episodeFact(active, key, p); const e = profile.encounters[encounterId];
        requireFact(active.encounterId === encounterId && e && (e.learningEpisode.status === 'open' || e.learningEpisode.status === 'suspended') && active.learningEpisodeOrdinal === e.learningEpisode.ordinal && active.validChecks === e.learningEpisode.validChecks && active.encounterCheckIndex === e.validChecks && active.firstCheckCorrect === e.firstCheckCorrect && active.canonicalQuestionId === e.canonicalQuestionId && helpContains(e.assistance, active.assistance), p, 'Active evidence must match unresolved encounter episode.');
      }
      for (const [bandKey, b] of Object.entries(s.bands)) {
        requireFact(b.validChecks >= b.recentCompletedEpisodes.reduce((sum, e) => sum + e.validChecks, 0)
          + Object.values(s.activeEpisodes).filter(e => e.band === bandKey).reduce((sum, e) => sum + e.validChecks, 0), p, 'Band Check aggregates omit retained active/completed evidence.');
        for (const completed of b.recentCompletedEpisodes) {
          const e = profile.encounters[completed.encounterId]; if (!e) continue;
          requireFact(completed.canonicalQuestionId === e.canonicalQuestionId && completed.learningEpisodeOrdinal <= e.learningEpisode.ordinal
            && completed.encounterCheckIndex <= e.validChecks && completed.firstCheckCorrect === e.firstCheckCorrect && helpContains(e.assistance, completed.assistance), p, 'Retained completion contradicts its encounter provenance.');
          if (completed.learningEpisodeOrdinal === e.learningEpisode.ordinal) requireFact(e.learningEpisode.status === (completed.outcome === 'success' ? 'completed-success' : 'completed-unsuccessful')
            && completed.validChecks === e.learningEpisode.validChecks && completed.encounterCheckIndex === e.validChecks, p, 'Retained completion contradicts current episode closure.');
        }
      }
    }
    for (const e of Object.values(profile.encounters)) {
      if ((e.learningEpisode.status === 'open' || e.learningEpisode.status === 'suspended') && e.learningEpisode.validChecks > 0) requireFact(profile.learning.evidence[e.skillId]?.activeEpisodes[e.encounterId], p, 'Checked open/suspended episode lacks active evidence.');
      // Recent completion can have expired through the producer's four-item window.
    }
    const rewardIssues = validateRewardState(profile.rewards, save.competition, profileId, COSMETICS);
    if (rewardIssues.length) fail(`${p}.rewards.${rewardIssues[0].path}`, rewardIssues[0].message);
  }
  for (const slots of Object.values(save.competition.currentSlots)) for (const slot of slots) taskAt(slot.canonicalQuestionId, 'save.competition.currentSlots');
  const competitionIssues = validateCompetitionState(save.competition, Object.values(save.profiles).map(p => ({ ...p.identity, lifetimePoints: p.rewards.lifetimePoints, personalRecords: p.personalRecords })));
  if (competitionIssues.length) fail(`save.${competitionIssues[0].path}`, competitionIssues[0].message);

  function validateBand(b: BandEvidence, skillId: string, bandKey: string, p: string) {
    const successes = b.independentSuccesses + b.supportedSuccesses;
    // Later-distinct success is a factual producer count, including helped
    // successes. Each such event needs an earlier success of either kind;
    // that prior fact may have expired from the four-completion display window.
    requireFact(b.correctChecks <= b.validChecks && b.answerHelpChecks <= b.validChecks && successes === b.correctChecks && successes <= b.completedEpisodes && b.completedEpisodes <= b.validChecks && b.retrySuccesses <= b.supportedSuccesses && b.laterDistinctSuccesses <= Math.max(0, successes - 1), p, 'Evidence aggregate counters are inconsistent.');
    const completed = b.recentCompletedEpisodes; const tuples = new Set<string>();
    for (const e of completed) { episodeFact(e, skillId, p); const tuple = JSON.stringify([e.encounterId, e.learningEpisodeOrdinal]); requireFact(e.band === bandKey && !tuples.has(tuple), p, 'Duplicate or misfiled completed episode.'); tuples.add(tuple); }
    requireFact(b.completedEpisodes >= completed.length && b.validChecks >= completed.reduce((n, e) => n + e.validChecks, 0) && b.independentSuccesses >= completed.filter(isIndependentEpisode).length && b.supportedSuccesses >= completed.filter(e => e.outcome === 'success' && !isIndependentEpisode(e)).length && b.retrySuccesses >= completed.filter(e => e.outcome === 'success' && e.encounterCheckIndex > 1).length, p, 'Aggregates contradict retained completion provenance.');
    const distinct = new Set(completed.filter(e => e.outcome === 'success').map(e => e.canonicalQuestionId));
    requireFact(distinct.size === b.distinctSuccessfulCanonicalQuestionIds.length && b.distinctSuccessfulCanonicalQuestionIds.every(c => distinct.has(c)), p, 'Distinct success set must match the bounded recent evidence window.');
    for (const r of b.reviewResults) { const task = taskAt(r.canonicalQuestionId, p); requireFact(task.skillId === skillId && task.band === bandKey, p, 'Review task mismatch.'); checkDateWeek(r.localDate, r.competitionWeekId, p); }
    requireFact(b.reviewResults.length <= b.completedEpisodes, p, 'Review history exceeds completed episodes.');
  }
}

function failed(error: unknown): Exclude<ValidationResult, { status: 'valid' }> {
  if (error instanceof DecodeError) return { status: error.status, issues: [error.issue] };
  return { status: 'invalid', issues: [{ path: '$', code: 'invalid-save', message: 'The backup is malformed or truncated.' }] };
}
export function validateSave(candidate: unknown, catalogue: readonly TaskDefinition[]): ValidationResult {
  try {
    const wrapped = { format: BACKUP_FORMAT, schemaVersion: 1, exportedAt: '2000-01-01T00:00:00.000Z', save: candidate };
    inspectTree(wrapped); byteLimit(bytes(JSON.stringify(wrapped)));
    if (candidate && typeof candidate === 'object' && Object.hasOwn(candidate, 'schemaVersion')) {
      const version = counter((candidate as { schemaVersion?: unknown }).schemaVersion, 'save.schemaVersion');
      if (version !== 1) fail('save.schemaVersion', 'This save schema is unsupported. Recover with a compatible application.', 'unsupported-schema', 'unsupported');
    }
    // Structural component unions are narrowed by the owning semantic validator.
    const save = saveShape(candidate, 'save') as SaveDataV1;
    semantic(save, catalogue); return { status: 'valid', save: freeze(save) };
  } catch (error) { return failed(error); }
}
const validatedEnvelopes = new WeakSet<object>();
export function decodeBackup(source: string, catalogue: readonly TaskDefinition[]): DecodeResult {
  try {
    requireFact(typeof source === 'string', '$', 'Expected JSON text.'); byteLimit(bytes(source)); scanJson(source);
    const candidate: unknown = JSON.parse(source); inspectTree(candidate);
    const envelope = object({ format: enumeration([BACKUP_FORMAT]), schemaVersion: counter, exportedAt: timestamp, save: (v: unknown) => v })(candidate, '$');
    if (envelope.schemaVersion !== 1) fail('schemaVersion', 'This backup format version is unsupported. Keep the original file for recovery.', 'unsupported-schema', 'unsupported');
    const checked = validateSave(envelope.save, catalogue);
    if (checked.status !== 'valid') return checked;
    const result: BackupEnvelopeV1 = freeze({ format: BACKUP_FORMAT, schemaVersion: 1, exportedAt: envelope.exportedAt, save: checked.save });
    validatedEnvelopes.add(result); return { status: 'valid', envelope: result };
  } catch (error) { return failed(error); }
}
/** File size is checked before invoking text(), including non-browser adapters. */
export async function decodeBackupFile(file: Pick<File, 'size' | 'text'>, catalogue: readonly TaskDefinition[]): Promise<DecodeResult> {
  try { requireFact(Number.isSafeInteger(file.size) && file.size >= 0, '$', 'Invalid file size.'); byteLimit(file.size); return decodeBackup(await file.text(), catalogue); }
  catch (error) { return failed(error); }
}
export function exportBackup(snapshot: CommittedSnapshot, exportedAt: string, catalogue: readonly TaskDefinition[] = listTasks()): Readonly<{ filename: string; json: string; byteLength: number }> {
  timestamp(exportedAt, 'exportedAt');
  const checked = validateSave(snapshot.save, catalogue);
  if (checked.status !== 'valid') throw new DecodeError(checked.issues[0], checked.status);
  const envelope: BackupEnvelopeV1 = { format: BACKUP_FORMAT, schemaVersion: 1, exportedAt, save: checked.save };
  const json = JSON.stringify(envelope); const budget = measureBackupBudget(envelope);
  return { filename: `learning-is-fun-${exportedAt.replace(/[:.]/g, '-')}.json`, json, byteLength: budget.byteLength };
}

export type ImportPreview = Readonly<{ preparedImportId: string; expected: SaveToken; exportedAt: string; profileNames: readonly string[]; profileCount: number }>;
type PreparedImport = NonNullable<TransitionContext['preparedImport']>;
type Confirmation = Readonly<{ status: 'ready'; preparedImport: PreparedImport }> | Readonly<{ status: 'conflict' | 'expired' }>;
const preparedByPreview = new WeakMap<ImportPreview, PreparedImport>();
/** Public preview has no save. Its weak private pairing requires the exact
 * decoder-issued envelope and cannot be reconstructed from a caller's ID. */
export function prepareImport(envelope: BackupEnvelopeV1, current: CommittedSnapshot): ImportPreview {
  requireFact(validatedEnvelopes.has(envelope), '$', 'Prepare requires the exact validated decoder result.');
  id(current.token.epoch, 'expected.epoch'); counter(current.token.revision, 'expected.revision');
  const preparedImportId = crypto.randomUUID(), expected = freeze({ epoch: current.token.epoch, revision: current.token.revision });
  const preview = freeze({ preparedImportId, expected, exportedAt: envelope.exportedAt, profileNames: Object.values(envelope.save.profiles).map(p => p.identity.nickname), profileCount: Object.keys(envelope.save.profiles).length });
  preparedByPreview.set(preview, freeze({ preparedImportId, expected, save: envelope.save }));
  return preview;
}
export function confirmPreparedImport(preview: ImportPreview, current: CommittedSnapshot): Confirmation {
  const prepared = preparedByPreview.get(preview); preparedByPreview.delete(preview);
  if (!prepared) return { status: 'expired' };
  if (prepared.expected.epoch !== current.token.epoch || prepared.expected.revision !== current.token.revision) return { status: 'conflict' };
  return { status: 'ready', preparedImport: prepared };
}
/** Create one private session per facade. No module-global import payload store,
 * writer or automatic confirmation. Dispose/reload invalidates every preview. */
export function createImportSession() {
  const pending = new Map<string, ImportPreview>();
  const cancel = (id: string) => { const preview = pending.get(id); if (preview) preparedByPreview.delete(preview); pending.delete(id); };
  const clear = () => { for (const id of pending.keys()) cancel(id); };
  return {
    prepareImport(envelope: BackupEnvelopeV1, current: CommittedSnapshot) { clear(); const preview = prepareImport(envelope, current); pending.set(preview.preparedImportId, preview); return preview; },
    /** Called only by the facade handling explicit Replace. Consume once and
     * pass the ready value to repository.replaceSave; its in-tx token check is
     * still authoritative. Conflict requires a fresh decode-result preview. */
    confirmImport(preparedImportId: string, current: CommittedSnapshot): Confirmation {
      const preview = pending.get(preparedImportId); pending.delete(preparedImportId);
      return preview ? confirmPreparedImport(preview, current) : { status: 'expired' };
    },
    cancelImport: cancel, clear,
  };
}

export type ControllerBackupExport = Readonly<{ status: 'ready'; source: 'committed' | 'last-committed-recovery'; backup: ReturnType<typeof exportBackup> }>
  | Readonly<{ status: 'blocked'; readiness: UpdateReadiness; message: string }>;
/** Ordinary export drains preferences/commands before reading the acknowledged
 * snapshot. A failed/pending export offers recovery without calling it fresh.
 * Recovery mode requires the caller's explicit labelled recovery choice. */
export async function exportFromController(controller: Pick<StateController, 'flush' | 'getSnapshot'>, exportedAt: string,
  mode: 'ordinary' | 'last-committed-recovery' = 'ordinary', catalogue: readonly TaskDefinition[] = listTasks()): Promise<ControllerBackupExport> {
  if (mode === 'ordinary') {
    const readiness = await controller.flush();
    if (!readiness.ready || readiness.pendingCommands > 0 || readiness.pendingPreferences || readiness.failedCommand || readiness.failedPreferences || readiness.unsavedTransition) return {
      status: 'blocked', readiness, message: 'Some changes are not saved. Retry saving, or explicitly download the last committed recovery backup.',
    };
  }
  return { status: 'ready', source: mode === 'ordinary' ? 'committed' : 'last-committed-recovery', backup: exportBackup(controller.getSnapshot(), exportedAt, catalogue) };
}
