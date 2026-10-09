import { COSMETICS, QUESTS } from '../experience/catalogue';
import type { CosmeticDefinition } from '../experience/types';
import { weekKeyFor } from './calendar';
import type {
  CalendarContext, CanonicalRewardTrack, CompetitionState, CompetitiveSlot,
  EligibilityResult, RewardCheckInput, RewardCheckResult, RewardOpportunity,
  RewardReceiptKey, RewardSelectionFacts, RewardState, ScoreDelta,
} from './contracts';

export type RewardValidationIssue = Readonly<{ path: string; message: string }>;
type Catalogue = readonly CosmeticDefinition[];
const thresholds: Readonly<Record<string, number>> = {
  'scarf-leaf': 20, 'planter-rim': 60, 'home-trim': 150, 'scarf-star': 300, 'scarf-wave': 300,
};
const own = <T>(map: Readonly<Record<string, T>>, key: string): T | undefined =>
  Object.hasOwn(map, key) ? map[key] : undefined;
const integer = (n: unknown): n is number => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0;
const id = (s: unknown): s is string => typeof s === 'string' && s.length > 0;
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const date = (v: unknown): v is string => {
  try { return typeof v === 'string' && !!weekKeyFor(v); } catch { return false; }
};
const week = (v: unknown): v is string => date(v) && weekKeyFor(v) === v;
const success = (o: RewardOpportunity): boolean => o.components.independentSuccess || o.components.supportedSuccess;
const points = (o: RewardOpportunity): number => (o.components.answer ? 5 : 0)
  + (o.components.independentSuccess ? 15 : 0) + (o.components.supportedSuccess ? 5 : 0);
const emptyTrack = (): CanonicalRewardTrack => ({ lastAllocatedOrdinal: 0, completedThroughOrdinal: 0,
  closedAwardTotal: 0, freePractice: { validChecks: 0, answerHintUsed: false } });
const zero = (): ScoreDelta => ({ lifetimeDelta: 0, competitiveDelta: 0,
  consumedSlot: null, newReceiptKeys: [], newEntitlementIds: [] });
function requireFact(ok: unknown, message: string): asserts ok {
  if (!ok) throw new RangeError(message);
}
function equal(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (!record(a) || !record(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && equal(a[k], b[k]));
}

/** Provisional classification allocates neither a token nor a competitive slot.
 * A bound unfinished opportunity wins over new route/selection suggestions. */
export function classifyRewardEligibility({ track, selection, context }: Readonly<{
  track: CanonicalRewardTrack | null; selection: RewardSelectionFacts; context: CalendarContext;
}>): EligibilityResult {
  const practice = (reason: Extract<EligibilityResult, { kind: 'practice-only' }>['reason']): EligibilityResult =>
    ({ kind: 'practice-only', reason });
  const facts = track?.currentOpportunity?.selectionFacts ?? selection;
  const eligible = (first: boolean): EligibilityResult => track?.currentOpportunity !== undefined
    ? { kind: 'resume-existing', reason: 'unfinished-opportunity' }
    : first ? { kind: 'eligible-first', reason: 'first-encounter' }
      : { kind: 'eligible-review', reason: 'selected-due-review' };
  if (track?.currentOpportunity !== undefined && track.currentOpportunity.earningWeek !== null) {
    return { kind: 'resume-existing', reason: 'unfinished-opportunity' };
  }
  if (track?.freePractice.unfinishedEncounterId !== undefined) return practice('unfinished-free-practice');
  if (track?.lastSuccessWeek !== undefined && track.lastSuccessWeek >= context.activeWeek
    || track?.freePractice.latestWeek !== undefined && track.freePractice.latestWeek >= context.activeWeek
    || track?.recentCompletedOpportunity?.earningWeek === context.activeWeek) return practice('same-week-used');
  if (facts.selectionReason === 'child-practice') return practice('child-practice');
  const familiar = track !== null && (track.lastSuccessWeek !== undefined || track.closedAwardTotal > 0
    || track.completedThroughOrdinal > 0
    || track.recentCompletedOpportunity !== undefined || track.freePractice.validChecks > 0);
  if (facts.candidate === 'first-encounter' && !familiar
    && (facts.selectionReason === 'story' || facts.selectionReason === 'adaptive')) {
    return eligible(true);
  }
  if (facts.candidate === 'later-week-due-review' && facts.selectionReason === 'due-review') {
    if (track?.lastSuccessWeek !== undefined && track.lastSuccessWeek < context.activeWeek
      && facts.previousSuccessWeek === track.lastSuccessWeek
      && date(facts.dueLocalDate) && facts.dueLocalDate <= context.observedLocalDate) {
      return eligible(false);
    }
    return practice('not-due');
  }
  return practice(familiar ? 'familiar-repeat' : 'not-due');
}

/** Thresholds bind stable choice IDs, independent of asset/presentation readiness. */
export function deriveCosmeticEntitlements(lifetimePoints: number, catalogue: Catalogue): readonly string[] {
  requireFact(integer(lifetimePoints), 'Lifetime points must be a nonnegative safe integer');
  return [...new Set(catalogue.flatMap(c => c.entitlementId !== null
    && own(thresholds, c.entitlementId) !== undefined && lifetimePoints >= thresholds[c.entitlementId]
    ? [c.entitlementId] : []))];
}

/** Keep the latest completion for exact retries and all unresolved facts. Only
 * an older completion may fold; its active-week slot must remain inspectable. */
export function compactCompletedOpportunity(track: CanonicalRewardTrack, activeWeek: string): CanonicalRewardTrack {
  requireFact(week(activeWeek), 'Compaction requires an active Monday');
  const current = track.currentOpportunity;
  if (current === undefined || !success(current)) return track;
  requireFact(current.ordinal > track.completedThroughOrdinal, 'Completed ordinal cannot reopen');
  const previous = track.recentCompletedOpportunity;
  requireFact(previous === undefined || previous.ordinal < current.ordinal, 'Completion ordinals must increase');
  requireFact(previous === undefined || previous.earningWeek !== activeWeek, 'Cannot compact an active-week completion');
  const total = track.closedAwardTotal + (previous === undefined ? 0 : points(previous));
  requireFact(integer(total), 'Compacted total overflow');
  const { currentOpportunity: _current, ...rest } = track;
  return { ...rest, closedAwardTotal: total,
    completedThroughOrdinal: previous?.ordinal ?? track.completedThroughOrdinal,
    recentCompletedOpportunity: current };
}

function withPoints(rewards: RewardState, amount: number): Pick<RewardState, 'lifetimePoints' | 'entitlementIds'> {
  const lifetimePoints = rewards.lifetimePoints + amount;
  requireFact(integer(lifetimePoints), 'Lifetime total overflow');
  return { lifetimePoints, entitlementIds: [...new Set([...rewards.entitlementIds,
    ...deriveCosmeticEntitlements(lifetimePoints, COSMETICS)])] };
}

/** questCompleted is WP04's derived prerequisite/result fact, never a UI claim. */
export function applyQuestReward({ profileId, questId, questCompleted, rewards }: Readonly<{
  profileId: string; questId: string; questCompleted: boolean; rewards: RewardState;
}>): Readonly<{ nextRewards: RewardState; delta: ScoreDelta }> {
  requireFact(id(profileId) && QUESTS.some(q => q.id === questId), 'Unknown profile or quest');
  requireFact(typeof questCompleted === 'boolean', 'Quest completion must be a derived boolean');
  requireFact(rewards.questReceipts.every(r => r.profileId === profileId), 'Foreign quest receipt');
  if (!questCompleted || rewards.questReceipts.some(r => r.questId === questId)) return { nextRewards: rewards, delta: zero() };
  const key = { profileId, questId };
  const nextRewards = { ...rewards, ...withPoints(rewards, 20), questReceipts: [...rewards.questReceipts, key] };
  return { nextRewards, delta: { ...zero(), lifetimeDelta: 20, newReceiptKeys: [key],
    newEntitlementIds: nextRewards.entitlementIds.filter(e => !rewards.entitlementIds.includes(e)) } };
}

/** One judged Check over stored pre-Check state. WP04 owns submission replay
 * filtering; inconsistent/stale sequences throw without producing any state. */
export function applyCheckRewards(input: RewardCheckInput): RewardCheckResult {
  const { profileId, selection, evaluation, rewards, competition, context } = input;
  const canonical = selection.canonicalQuestionId;
  const stored = own(rewards.tracksByCanonical, canonical) ?? null;
  requireFact(equal(input.track, stored), 'Pre-Check track differs from stored reward state');
  requireFact(id(profileId) && id(input.encounterId) && id(input.submissionId)
    && id(canonical) && selection.profileId === profileId && selection.encounterId === input.encounterId
    && evaluation.status === 'judged' && typeof evaluation.correct === 'boolean'
    && evaluation.canonicalQuestionId === canonical && evaluation.band === selection.band, 'Mismatched Check identity/evaluation');
  requireFact(week(context.activeWeek) && date(context.observedLocalDate)
    && competition.latestOpenedWeek === context.activeWeek
    && (context.clockRollback ? weekKeyFor(context.observedLocalDate) < context.activeWeek
      : weekKeyFor(context.observedLocalDate) === context.activeWeek), 'Calendar must be reconciled before Check');
  const issues = validateRewardState(rewards, competition, profileId, COSMETICS);
  requireFact(issues.length === 0, `Invalid reward state: ${issues[0]?.path}: ${issues[0]?.message}`);
  requireFact(integer(input.validChecks) && integer(input.checkSequence)
    && input.checkSequence === input.validChecks + 1, 'Expected next cumulative Check sequence');
  requireFact(typeof input.assistance.answerHintUsed === 'boolean'
    && typeof input.assistance.workedSupportUsed === 'boolean', 'Expected cumulative assistance flags');
  const track = stored ?? emptyTrack();
  const current = track.currentOpportunity;
  const retained = input.opportunityId === null ? undefined
    : current?.opportunityId === input.opportunityId ? current
      : track.recentCompletedOpportunity?.opportunityId === input.opportunityId ? track.recentCompletedOpportunity : undefined;
  requireFact(input.opportunityId === null || retained !== undefined, 'Unknown or compacted opportunity');
  requireFact(retained === undefined || retained.profileId === profileId && retained.canonicalQuestionId === canonical
    && retained.selectionFacts.encounterId === input.encounterId && equal(retained.selectionFacts, selection)
    && retained.ordinal > track.completedThroughOrdinal, 'Mismatched opportunity facts');
  if (retained !== undefined && success(retained)) {
    requireFact(input.validChecks === retained.validChecks, 'Stale completed Check sequence');
    return { nextRewards: rewards, nextCompetition: competition, delta: zero() };
  }
  requireFact(current === undefined || retained === current, 'Unfinished opportunity must be resumed');
  const eligibility = classifyRewardEligibility({ track, selection, context });
  const answerHintUsed = input.assistance.answerHintUsed || input.assistance.workedSupportUsed;
  if (eligibility.kind === 'practice-only') {
    requireFact(current === undefined || current.earningWeek === null, 'Bound opportunity cannot become free practice');
    requireFact(track.freePractice.unfinishedEncounterId === undefined
      || track.freePractice.unfinishedEncounterId === input.encounterId, 'Unfinished free practice must resume its encounter');
    // Completion permits a new practice encounter. Unsuccessful episodes never
    // do: their exact encounter/count/help must continue until success.
    requireFact(input.validChecks === track.freePractice.validChecks
      || track.freePractice.unfinishedEncounterId === undefined && input.validChecks === 0,
    'Free-practice cumulative count mismatch');
    const { currentOpportunity: _provisional, ...rest } = track;
    const nextTrack: CanonicalRewardTrack = { ...rest,
      freePractice: { latestWeek: context.activeWeek, validChecks: input.checkSequence,
        answerHintUsed: (input.validChecks > 0 && track.freePractice.answerHintUsed) || !!current?.answerHintUsed || answerHintUsed,
        ...(!evaluation.correct ? { unfinishedEncounterId: input.encounterId } : {}) },
      ...(evaluation.correct ? { lastSuccessWeek: context.activeWeek, lastSuccessLocalDate: context.observedLocalDate } : {}),
    };
    return { nextRewards: { ...rewards, tracksByCanonical: { ...rewards.tracksByCanonical, [canonical]: nextTrack } },
      nextCompetition: competition, delta: zero() };
  }
  requireFact(current !== undefined && retained === current, 'WP04 must persist an assigned opportunity before scoring');
  requireFact(input.validChecks === current.validChecks, 'Opportunity cumulative count mismatch');
  const first = current.validChecks === 0;
  const slots = own(competition.currentSlots, profileId) ?? [];
  const slot = first ? (slots.length < 30 ? slots.length + 1 as CompetitiveSlot : null) : current.slot;
  const earningWeek = first ? context.activeWeek : current.earningWeek;
  const hinted = current.answerHintUsed || answerHintUsed;
  const independent = evaluation.correct && first && !hinted;
  const supported = evaluation.correct && !independent;
  const lifetimeDelta = (first ? 5 : 0) + (independent ? 15 : supported ? 5 : 0);
  const competitiveDelta = earningWeek === context.activeWeek && slot !== null ? lifetimeDelta : 0;
  const keys: RewardReceiptKey[] = [];
  if (first) keys.push({ opportunityId: current.opportunityId, component: 'answer' });
  if (evaluation.correct) keys.push({ opportunityId: current.opportunityId, component: independent ? 'independent-success' : 'supported-success' });
  const nextOpportunity: RewardOpportunity = { ...current, earningWeek, slot, validChecks: input.checkSequence,
    answerHintUsed: hinted, components: independent
      ? { answer: true, independentSuccess: true, supportedSuccess: false }
      : { answer: true, independentSuccess: false, supportedSuccess: supported },
    ...(evaluation.correct ? { firstSuccessWeek: context.activeWeek, firstSuccessLocalDate: context.observedLocalDate } : {}),
  };
  const nextTrack = compactCompletedOpportunity({ ...track, currentOpportunity: nextOpportunity,
    ...(evaluation.correct ? { lastSuccessWeek: context.activeWeek, lastSuccessLocalDate: context.observedLocalDate } : {}),
  }, context.activeWeek);
  const nextRewards = { ...rewards, ...withPoints(rewards, lifetimeDelta),
    tracksByCanonical: { ...rewards.tracksByCanonical, [canonical]: nextTrack } };
  const nextCompetition: CompetitionState = competitiveDelta === 0 ? competition : { ...competition,
    currentScores: { ...competition.currentScores, [profileId]: (own(competition.currentScores, profileId) ?? 0) + competitiveDelta },
    currentSlots: { ...competition.currentSlots, [profileId]: first
      ? [...slots, { slot: slot!, opportunityId: current.opportunityId, canonicalQuestionId: canonical, points: competitiveDelta }]
      : slots.map(s => s.opportunityId === current.opportunityId ? { ...s, points: s.points + competitiveDelta } : s) },
  };
  return { nextRewards, nextCompetition, delta: { lifetimeDelta, competitiveDelta,
    consumedSlot: first ? slot : null, newReceiptKeys: keys,
    newEntitlementIds: nextRewards.entitlementIds.filter(e => !rewards.entitlementIds.includes(e)) } };
}

/** Reward-specific decoder invariants. Shape failures return issues, not throws.
 * Calendar/archives/rank validation remains with validateCompetitionState. */
export function validateRewardState(rewards: RewardState, competition: CompetitionState,
  profileId: string, catalogue: Catalogue): readonly RewardValidationIssue[] {
  const issues: RewardValidationIssue[] = [];
  const check = (ok: unknown, path: string, message: string): boolean => {
    if (!ok) issues.push({ path, message });
    return !!ok;
  };
  if (!check(record(rewards) && record(rewards.tracksByCanonical) && Array.isArray(rewards.questReceipts)
    && Array.isArray(rewards.entitlementIds), 'rewards', 'Expected reward object, tracks and receipt/entitlement arrays')) return issues;
  if (!check(record(competition) && record(competition.currentSlots) && record(competition.currentScores),
    'competition', 'Expected competition maps')) return issues;
  if (!check(id(profileId), 'profileId', 'Expected profile ID')) return issues;
  if (!check(competition.latestOpenedWeek === null || week(competition.latestOpenedWeek),
    'competition.latestOpenedWeek', 'Expected null or an active Monday')) return issues;
  let total = 0;
  const opportunities = new Map<string, RewardOpportunity>();
  const boundKeys = new Set<string>();
  for (const [canonical, t] of Object.entries(rewards.tracksByCanonical)) {
    const path = `tracksByCanonical.${canonical}`;
    if (!check(id(canonical) && record(t) && record(t.freePractice), path, 'Expected canonical track')) continue;
    // Establish numeric shape before *any* comparison or accumulation. JSON
    // objects may have non-callable valueOf/toString properties.
    if (!check(integer(t.lastAllocatedOrdinal) && integer(t.completedThroughOrdinal)
      && integer(t.closedAwardTotal), path, 'Expected safe integer ordinal/contribution facts')) continue;
    check(t.completedThroughOrdinal <= t.lastAllocatedOrdinal, path, 'Invalid ordinal high-water');
    check(t.closedAwardTotal % 10 === 0
      && t.closedAwardTotal <= t.completedThroughOrdinal * 20, path, 'Invalid compacted contributions');
    total += t.closedAwardTotal;
    // Only completed contributions advance the completion mark. Retired
    // provisional allocations may create gaps, but never a completion mark.
    check((t.completedThroughOrdinal === 0) === (t.closedAwardTotal === 0)
      && (t.completedThroughOrdinal === 0 || t.closedAwardTotal >= 10
        && record(t.recentCompletedOpportunity) && week(t.lastSuccessWeek)),
    path, 'Compaction mark requires earned contributions and retained completion/success history');
    check((t.lastSuccessWeek === undefined) === (t.lastSuccessLocalDate === undefined)
      && (t.lastSuccessWeek === undefined || week(t.lastSuccessWeek) && date(t.lastSuccessLocalDate)
        && weekKeyFor(t.lastSuccessLocalDate) <= t.lastSuccessWeek
        && competition.latestOpenedWeek !== null && t.lastSuccessWeek <= competition.latestOpenedWeek), path, 'Invalid actual-success date/week');
    const f = t.freePractice;
    check(integer(f.validChecks) && typeof f.answerHintUsed === 'boolean'
      && (f.latestWeek === undefined || week(f.latestWeek)
        && competition.latestOpenedWeek !== null && f.latestWeek <= competition.latestOpenedWeek)
      && (f.validChecks === 0 || f.latestWeek !== undefined)
      && (f.unfinishedEncounterId === undefined || id(f.unfinishedEncounterId))
      && (f.validChecks === 0 || f.unfinishedEncounterId !== undefined || t.lastSuccessWeek !== undefined), `${path}.freePractice`, 'Invalid retained practice facts');
    const ordinals = new Set<number>();
    for (const key of ['recentCompletedOpportunity', 'currentOpportunity'] as const) {
      const o = t[key];
      if (o === undefined) continue;
      const p = `${path}.${key}`;
      if (!check(record(o) && record(o.components) && record(o.selectionFacts), p, 'Expected opportunity facts')) continue;
      const c = o.components;
      if (!check(integer(o.ordinal) && integer(o.validChecks) && typeof o.answerHintUsed === 'boolean'
        && typeof c.answer === 'boolean' && typeof c.independentSuccess === 'boolean'
        && typeof c.supportedSuccess === 'boolean', p, 'Invalid numeric/boolean opportunity facts')) continue;
      check(id(o.opportunityId) && o.profileId === profileId && o.canonicalQuestionId === canonical
        && !opportunities.has(o.opportunityId), p, 'Invalid/duplicate opportunity identity');
      opportunities.set(o.opportunityId, o);
      check(o.ordinal > t.completedThroughOrdinal && o.ordinal <= t.lastAllocatedOrdinal
        && !ordinals.has(o.ordinal), p, 'Expired/duplicate/unallocated ordinal');
      ordinals.add(o.ordinal);
      check(!(c.independentSuccess && c.supportedSuccess) && (!success(o) || c.answer)
        && c.answer === (o.validChecks > 0), p, 'Invalid receipt components');
      check(!c.independentSuccess || o.validChecks === 1 && !o.answerHintUsed, p, 'Independent award contradicts assistance/count');
      check(!c.supportedSuccess || o.validChecks > 1 || o.answerHintUsed, p, 'Supported award requires assistance/retry');
      check((o.earningWeek === null) === (o.validChecks === 0)
        && (o.earningWeek === null || week(o.earningWeek) && competition.latestOpenedWeek !== null
          && o.earningWeek <= competition.latestOpenedWeek)
        && (o.slot === null || integer(o.slot) && o.slot >= 1 && o.slot <= 30 && o.earningWeek !== null), p, 'Invalid earning week/slot');
      const s = o.selectionFacts;
      check(s.profileId === profileId && s.canonicalQuestionId === canonical && id(s.encounterId)
        && ['support', 'core', 'stretch'].includes(s.band)
        && ['story', 'adaptive', 'due-review', 'child-practice'].includes(s.selectionReason)
        && ['first-encounter', 'later-week-due-review', 'none'].includes(s.candidate), p, 'Invalid selection facts');
      check(o.earningWeek === null || s.selectionReason !== 'child-practice' && s.candidate !== 'none'
        && (s.candidate !== 'first-encounter' || s.selectionReason === 'story' || s.selectionReason === 'adaptive')
        && (s.candidate !== 'later-week-due-review' || s.selectionReason === 'due-review'
          && week(s.previousSuccessWeek) && week(o.earningWeek)
          && s.previousSuccessWeek < o.earningWeek && date(s.dueLocalDate)), p, 'Bound opportunity lacks eligible selection');
      if (o.earningWeek !== null) {
        check(s.candidate !== 'first-encounter' || t.completedThroughOrdinal === 0,
          p, 'First encounter cannot follow compacted completions');
        if (key === 'currentOpportunity') {
          // While unfinished, lastSuccess is the preceding actual success,
          // including late/free-practice success, not the prior earning week.
          const priorSuccess = t.lastSuccessWeek !== undefined || t.recentCompletedOpportunity !== undefined;
          check(f.unfinishedEncounterId === undefined && (priorSuccess
            ? s.selectionReason === 'due-review' && s.candidate === 'later-week-due-review'
              && week(t.lastSuccessWeek) && week(o.earningWeek) && t.lastSuccessWeek < o.earningWeek
              && s.previousSuccessWeek === t.lastSuccessWeek
            : s.candidate === 'first-encounter'), p, 'Bound current opportunity contradicts retained prior success');
        }
      }
      check(success(o) === (o.firstSuccessWeek !== undefined && o.firstSuccessLocalDate !== undefined)
        && (success(o) || o.firstSuccessWeek === undefined && o.firstSuccessLocalDate === undefined)
        && (!success(o) || week(o.firstSuccessWeek) && date(o.firstSuccessLocalDate)
          && weekKeyFor(o.firstSuccessLocalDate) <= o.firstSuccessWeek
          && week(o.earningWeek) && o.firstSuccessWeek >= o.earningWeek
          && week(t.lastSuccessWeek) && t.lastSuccessWeek >= o.firstSuccessWeek), p, 'Invalid completion facts');
      check(key === 'recentCompletedOpportunity' ? success(o) : !success(o), p, 'Completion stored in wrong position');
      if (o.earningWeek !== null) {
        const bound = JSON.stringify([profileId, canonical, o.earningWeek]);
        check(!boundKeys.has(bound), p, 'Duplicate canonical earning week');
        boundKeys.add(bound);
      }
      total += points(o);
    }
    check(t.currentOpportunity === undefined || t.recentCompletedOpportunity === undefined
      || record(t.currentOpportunity) && record(t.recentCompletedOpportunity)
        && integer(t.currentOpportunity.ordinal) && integer(t.recentCompletedOpportunity.ordinal)
        && t.currentOpportunity.ordinal > t.recentCompletedOpportunity.ordinal, path, 'Current ordinal must follow completion');
  }
  const questIds = new Set<string>();
  for (const receipt of rewards.questReceipts) {
    if (!check(record(receipt), 'questReceipts', 'Expected quest receipt')) continue;
    check(receipt.profileId === profileId && QUESTS.some(q => q.id === receipt.questId)
      && !questIds.has(receipt.questId), 'questReceipts', 'Foreign, unknown or duplicate quest receipt');
    questIds.add(receipt.questId);
    total += 20;
  }
  check(integer(rewards.lifetimePoints) && integer(total) && total === rewards.lifetimePoints,
    'lifetimePoints', 'Lifetime must equal compacted totals, retained components and quest receipts');
  if (integer(rewards.lifetimePoints)) {
    const expected = deriveCosmeticEntitlements(rewards.lifetimePoints, catalogue);
    check(new Set(rewards.entitlementIds).size === rewards.entitlementIds.length
      && rewards.entitlementIds.length === expected.length && expected.every(e => rewards.entitlementIds.includes(e)),
    'entitlementIds', 'Entitlements must match permanent threshold choices');
  }
  const storedSlots = own(competition.currentSlots, profileId);
  const slots = storedSlots === undefined ? [] : storedSlots;
  if (!check(Array.isArray(slots) && slots.length <= 30, 'currentSlots', 'Expected at most 30 ordered slots')) return issues;
  let competitive = 0;
  const seen = new Set<string>();
  for (const [i, slot] of slots.entries()) {
    if (!check(record(slot), `currentSlots.${i}`, 'Expected slot')) continue;
    if (!check(integer(slot.points), `currentSlots.${i}.points`, 'Expected nonnegative safe integer points')) continue;
    const o = opportunities.get(slot.opportunityId);
    check(slot.slot === i + 1 && !seen.has(slot.opportunityId) && o !== undefined
      && o.canonicalQuestionId === slot.canonicalQuestionId && o.slot === slot.slot
      && o.earningWeek === competition.latestOpenedWeek && points(o) === slot.points,
    `currentSlots.${i}`, 'Slot must match unique retained current-week opportunity/components');
    seen.add(slot.opportunityId);
    competitive += slot.points;
  }
  for (const o of opportunities.values()) {
    check(o.earningWeek !== competition.latestOpenedWeek || o.slot === null || seen.has(o.opportunityId),
      'currentSlots', 'Missing reserved slot');
    check(o.earningWeek !== competition.latestOpenedWeek || o.slot !== null || slots.length === 30,
      'currentSlots', 'Unslotted eligible Check requires an exhausted weekly cap');
  }
  const score = own(competition.currentScores, profileId);
  check(integer(competitive) && (score === undefined || integer(score)) && competitive === (score === undefined ? 0 : score),
    'currentScores', 'Competitive score must equal slot sum');
  return issues;
}
