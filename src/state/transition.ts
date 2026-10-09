import type { ActivityResponse, LearningAssistance, LearningObservation, ResolvedSelectionIntent, SelectionEncounter, TaskDefinition } from '../learning/contracts';
import type { CanonicalRewardTrack, RewardSelectionFacts, ScoreDelta } from '../rewards/contracts';
import type { CreativeOption, Milestone } from '../experience/types';
import { AVATARS, COSMETICS, CREATIVE_CHOICES, INITIAL_CREATIVE_STATE, INITIAL_WORLD_PROGRESS, QUESTS } from '../experience/catalogue';
import { areRequiredBindingsComplete } from '../content/quest-bindings';
import { evaluateResponse } from '../learning/evaluate';
import { canonicalQuestionId } from '../learning/identity';
import { applyLearningObservation, usedAnswerHelp } from '../learning/evidence';
import { resolveBindingIntent, selectNextActivity } from '../learning/select';
import { addCalendarDays, reconcileCompetitionWeek } from '../rewards/calendar';
import { applyCheckRewards, applyQuestReward, classifyRewardEligibility } from '../rewards/scoring';
import { SUPPORTED_CONTENT_VERSION, SUPPORTED_REWARD_POLICY_VERSION, validateSave } from './backup';
import { INITIAL_AUDIO_PREFERENCES, INITIAL_PROFILE_PREFERENCES, SAVE_LIMITS } from './contracts';
import type { CommitChanges, EncounterSave, ProfileSave, ReduceCommand, SaveDataV1, StateCommand, StateReasonCode, TransitionDecision, TransitionContext } from './contracts';
import type { RecognizeDuplicate } from './repository';

export const zeroDelta = (): ScoreDelta => ({ lifetimeDelta: 0, competitiveDelta: 0, consumedSlot: null, newReceiptKeys: [], newEntitlementIds: [] });
export const noChanges = (): CommitChanges => ({ earnedPoints: zeroDelta(), unlockedIds: [], restorationIds: [], closedWeekIds: [] });
const noHelp = (): LearningAssistance => ({ answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' });
const emptyTrack = (): CanonicalRewardTrack => ({ lastAllocatedOrdinal: 0, completedThroughOrdinal: 0, closedAwardTotal: 0, freePractice: { validChecks: 0, answerHintUsed: false } });
const own = <T>(map: Readonly<Record<string, T>>, key: string): T | undefined => Object.hasOwn(map, key) ? map[key] : undefined;
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
const id = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= SAVE_LIMITS.idCharacters && !['__proto__', 'prototype', 'constructor'].includes(v);
const positive = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
const fields = (v: unknown, required: string[], optional: string[] = []): v is Record<string, unknown> => record(v)
  && required.every(k => Object.hasOwn(v, k)) && Object.keys(v).every(k => required.includes(k) || optional.includes(k));
export function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => sameValue(v, b[i]));
  if (!record(a) || !record(b)) return false;
  return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && sameValue(a[k], b[k]));
}
const stop = (code: StateReasonCode, message = 'This action is unavailable. Keep your work and try again.', status: 'invalid' | 'unsupported' | 'already-applied' = 'invalid'): TransitionDecision => ({ status, reason: { code, message } });
const applied = () => stop('already-applied', 'This action is already saved.', 'already-applied');

/** Clean-first-run/reset data only. Never use this as a fallback for failed reads. */
export function createInitialSave(): SaveDataV1 {
  return structuredClone({ schemaVersion: 1, contentVersion: SUPPORTED_CONTENT_VERSION, rewardPolicyVersion: SUPPORTED_REWARD_POLICY_VERSION,
    installation: { timezone: 'Europe/London', audio: INITIAL_AUDIO_PREFERENCES }, profiles: {},
    competition: { timezone: 'Europe/London', latestOpenedWeek: null, currentScores: {}, currentSlots: {}, archives: [], policyVersion: SUPPORTED_REWARD_POLICY_VERSION } });
}
function newProfile(payload: Extract<StateCommand, { kind: 'CreateProfile' }>['payload']): ProfileSave {
  return structuredClone({ identity: { profileId: payload.newProfileId, nickname: payload.nickname, avatarId: payload.avatarId },
    preferences: INITIAL_PROFILE_PREFERENCES, learning: { evidence: {}, canonicalHistory: [] }, encounters: {},
    world: INITIAL_WORLD_PROGRESS, creative: INITIAL_CREATIVE_STATE,
    rewards: { lifetimePoints: 0, tracksByCanonical: {}, questReceipts: [], entitlementIds: [] }, personalRecords: { best: null, medals: { gold: 0, silver: 0, bronze: 0 } } });
}
/** Runtime boundary: typed UI inputs still cannot smuggle a role, grant or route. */
export function validCommand(command: unknown): command is StateCommand {
  if (!record(command) || !id(command.actionId) || !fields(command.expected, ['epoch', 'revision']) || !id(command.expected.epoch)
    || typeof command.expected.revision !== 'number' || !Number.isSafeInteger(command.expected.revision) || command.expected.revision < 0) return false;
  if (typeof command.kind !== 'string') return false;
  const installation = ['CreateProfile', 'SetAudioPreferences', 'ResetSave', 'ReplaceSave', 'ReconcileCalendar'].includes(command.kind);
  if (!fields(command, ['actionId', 'expected', 'kind', 'payload', ...(!installation ? ['profileId'] : [])]) || (!installation && !id(command.profileId))) return false;
  const p = command.payload;
  const name = (n: unknown) => typeof n === 'string' && n.trim().length > 0 && n.length <= SAVE_LIMITS.nicknameCharacters;
  const avatar = (a: unknown) => AVATARS.some(v => v.id === a);
  switch (command.kind) {
    case 'CreateProfile': case 'StartOver': return fields(p, ['newProfileId', 'nickname', 'avatarId']) && id(p.newProfileId) && name(p.nickname) && avatar(p.avatarId);
    case 'RenameProfile': return fields(p, ['nickname']) && name(p.nickname);
    case 'SetAvatar': return fields(p, ['avatarId']) && avatar(p.avatarId);
    case 'ChooseCosmetic': return fields(p, ['choice']) && fields(p.choice, ['kind', 'value']) && p.choice.kind === 'appearance'
      && fields(p.choice.value, ['scarfColourId', 'scarfPatternId', 'flowerColourId', 'planterRimId', 'facadeTrimId', 'placements'])
      && fields(p.choice.value.placements, Object.keys(INITIAL_CREATIVE_STATE.placements));
    case 'SetProfilePreferences': return fields(p, ['patch']) && fields(p.patch, [], ['instructionReadAloud', 'motion'])
      && (!Object.hasOwn(p.patch, 'instructionReadAloud') || typeof p.patch.instructionReadAloud === 'boolean')
      && (!Object.hasOwn(p.patch, 'motion') || p.patch.motion === 'system' || p.patch.motion === 'reduced');
    case 'SetAudioPreferences': {
      if (!fields(p, ['patch']) || !fields(p.patch, [], ['soundEnabled', 'silenceAll', 'music', 'effects'])) return false;
      return Object.entries(p.patch).every(([k, v]) => k === 'soundEnabled' || k === 'silenceAll' ? typeof v === 'boolean'
        : fields(v, [], ['muted', 'volume']) && Object.entries(v).every(([leaf, value]) => leaf === 'muted' ? typeof value === 'boolean'
          : typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1));
    }
    case 'OpenEncounter': {
      if (!record(p) || typeof p.suppressDueReviewForVisit !== 'boolean') return false;
      if ('resumeEncounterId' in p) return fields(p, ['resumeEncounterId', 'suppressDueReviewForVisit']) && id(p.resumeEncounterId);
      if (!fields(p, ['route', 'suppressDueReviewForVisit']) || !record(p.route)) return false;
      const r = p.route;
      switch (r.kind) {
        case 'quest': return fields(r, ['kind', 'questId'], ['bindingId']) && id(r.questId) && (!('bindingId' in r) || id(r.bindingId));
        case 'optional-transfer': case 'revisit': return fields(r, ['kind', 'bindingId']) && id(r.bindingId);
        case 'practice': return fields(r, ['kind', 'mode'], ['skillId']) && typeof r.mode === 'string' && ['suggested', 'easier', 'repeat'].includes(r.mode) && (!('skillId' in r) || id(r.skillId));
        default: return false;
      }
    }
    case 'RecordAssistance': return fields(p, ['encounterId', 'assistanceKind'], ['hintId']) && id(p.encounterId)
      && (p.assistanceKind === 'answer-hint' || p.assistanceKind === 'worked-support' ? id(p.hintId)
        : typeof p.assistanceKind === 'string' && ['instruction-read-aloud', 'assessed-text-read-aloud'].includes(p.assistanceKind) && !Object.hasOwn(p, 'hintId'));
    case 'SaveDraft': return fields(p, ['encounterId', 'responseDraft']) && id(p.encounterId);
    case 'SubmitCheck': return fields(p, ['encounterId', 'learningEpisodeOrdinal', 'submissionId', 'checkSequence', 'response'])
      && id(p.encounterId) && id(p.submissionId) && positive(p.learningEpisodeOrdinal) && positive(p.checkSequence);
    case 'SuspendEncounter': return fields(p, ['encounterId', 'learningEpisodeOrdinal'], ['responseDraft']) && id(p.encounterId) && positive(p.learningEpisodeOrdinal);
    case 'FinishPractice': return fields(p, ['encounterId', 'learningEpisodeOrdinal']) && id(p.encounterId) && positive(p.learningEpisodeOrdinal);
    case 'ReplaceSave': return fields(p, ['preparedImportId']) && id(p.preparedImportId);
    case 'ResetSave': case 'ReconcileCalendar': case 'DeleteProfile': return fields(p, []);
    default: return false;
  }
}

/** Only retained receipt facts are inspected. No calendar, evaluator, selector,
 * reducer or write runs here. Repository checks epoch before calling this port. */
export const recognizeDuplicate: RecognizeDuplicate = (root, command) => {
  if (!validCommand(command) || !command.profileId) return false;
  const profile = own(root.save.profiles, command.profileId);
  if (!profile || !('encounterId' in command.payload)) return false;
  const encounter = own(profile.encounters, command.payload.encounterId);
  if (!encounter) return false;
  if (command.kind === 'SubmitCheck') {
    const last = encounter.lastCommittedCheck, p = command.payload;
    return !!last && last.submissionId === p.submissionId && last.checkSequence === p.checkSequence
      && last.learningEpisodeOrdinal === p.learningEpisodeOrdinal && sameValue(last.response, p.response);
  }
  return command.kind === 'FinishPractice' && encounter.learningEpisode.ordinal === command.payload.learningEpisodeOrdinal
    && encounter.learningEpisode.status === 'completed-unsuccessful' && encounter.learningEpisode.completionActionId === command.actionId;
};

export function retainedTask(encounter: EncounterSave, catalogue: readonly TaskDefinition[]): TaskDefinition | undefined {
  const matches = catalogue.filter(t => t.review.status === 'approved' && t.canonicalQuestionId === encounter.canonicalQuestionId
    && t.contentRevision === encounter.taskContentRevision && t.skillId === encounter.skillId && t.band === encounter.band && sameValue(t.descriptor, encounter.descriptor));
  try { return matches.length === 1 && canonicalQuestionId(encounter.descriptor) === encounter.canonicalQuestionId ? matches[0] : undefined; }
  catch { return undefined; }
}
const selectionEncounter = (e: EncounterSave): SelectionEncounter => ({ ...e, contentRevision: e.taskContentRevision,
  learningEpisodeOrdinal: e.learningEpisode.ordinal, episodeStatus: e.learningEpisode.status });
const reasonForReward = (reason: EncounterSave['selectionReason']): RewardSelectionFacts['selectionReason'] => reason === 'story-anchor' ? 'story'
  : reason === 'due-review' ? 'due-review' : reason === 'child-easier' || reason === 'repeat-practice' ? 'child-practice' : 'adaptive';
const admitted = (value: { milestone: Milestone }, milestone: Milestone) => value.milestone === 'M1' || milestone === 'M2';
function bindingValid(e: EncounterSave, p: ProfileSave, c: TransitionContext): boolean {
  const b = e.bindingProvenance;
  if (!b) return e.selectionReason !== 'story-anchor' && e.selectionReason !== 'transfer';
  const definition = c.questBindings.find(row => row.bindingId === b.bindingId);
  const quest = QUESTS.find(q => q.id === b.questId);
  const task = retainedTask(e, c.catalogue);
  if (!definition || !quest || !task || !admitted(quest, c.milestone) || (definition.availability === 'M2' && c.milestone !== 'M2')
    || definition.role !== b.role || definition.questId !== b.questId || definition.skillId !== task.skillId
    || definition.responseKind !== task.responseSpec.kind || !definition.taskIds.includes(task.canonicalQuestionId)
    || !quest.requiresAll.every(q => p.world.completedQuestIds.includes(q))) return false;
  if (b.role === 'revisit') return p.world.completedQuestIds.includes(quest.id);
  if (b.role === 'optional-transfer') {
    const source = c.questBindings.find(row => row.bindingId === definition.sourceBindingId);
    return !!source && source.role === 'story' && source.taskIds.length === 1 && p.world.completedStoryBindingIds.includes(source.bindingId);
  }
  return true;
}
function choiceProblem(profile: ProfileSave, command: Extract<StateCommand, { kind: 'ChooseCosmetic' }>, milestone: Milestone): StateReasonCode | null {
  const v = command.payload.choice.value, old = profile.creative;
  const available = (option: CreativeOption | undefined) => !!option && admitted(option, milestone) && option.requiresAll.every(q => profile.world.completedQuestIds.includes(q));
  if (!available(CREATIVE_CHOICES.scarfColours.find(c => c.id === v.scarfColourId))) return 'choice-unavailable';
  if (!CREATIVE_CHOICES.flowerColours.some(c => c.id === v.flowerColourId)
    || v.flowerColourId !== old.flowerColourId && !available(CREATIVE_CHOICES.flowerColours.find(c => c.id === v.flowerColourId))) return 'choice-unavailable';
  for (const key of ['scarfPatternId', 'planterRimId', 'facadeTrimId'] as const) {
    if (v[key] === null) continue;
    const option = COSMETICS.find(c => c.id === v[key] && c.target === key);
    if (!available(option)) return 'choice-unavailable';
    if (!profile.rewards.entitlementIds.includes(option!.entitlementId!)) return 'not-entitled';
  }
  const limits = CREATIVE_CHOICES.placementLimits[milestone];
  const placed = Object.entries(v.placements).filter(([, item]) => item !== null);
  if (placed.length > limits.maxPlaced || (!limits.reusableTypes && new Set(placed.map(([, value]) => value)).size !== placed.length)) return 'choice-unavailable';
  if (placed.some(([socket, item]) => !(limits.socketIds as readonly string[]).includes(socket)
    || !(limits.allowedDecorationIds as readonly string[]).includes(item!) || !available(CREATIVE_CHOICES.decorations.find(d => d.id === item)))) return 'choice-unavailable';
  return null;
}
const combine = (a: ScoreDelta, b: ScoreDelta): ScoreDelta => ({ lifetimeDelta: a.lifetimeDelta + b.lifetimeDelta,
  competitiveDelta: a.competitiveDelta + b.competitiveDelta, consumedSlot: a.consumedSlot ?? b.consumedSlot ?? null,
  newReceiptKeys: [...a.newReceiptKeys, ...b.newReceiptKeys], newEntitlementIds: [...new Set([...a.newEntitlementIds, ...b.newEntitlementIds])] });

/** Synchronous candidate construction. The full-root decoder is the last gate;
 * the repository owns the token, transaction and acknowledgement. */
export const reduceCommand: ReduceCommand = (root, command, context) => {
  if (!validCommand(command)) return stop('invalid-command');
  if (recognizeDuplicate(root, command, context)) return applied();
  if (command.kind === 'ReplaceSave' || command.kind === 'ResetSave') return stop('invalid-command', 'Replacement requires the atomic replacement port.');
  const original = root.save;
  let profile = command.profileId ? own(original.profiles, command.profileId) : undefined;
  if (command.profileId && !profile) return stop('profile-missing');
  const reconciliation = reconcileCompetitionWeek({ competition: original.competition,
    profiles: Object.values(original.profiles).map(p => ({ ...p.identity, lifetimePoints: p.rewards.lifetimePoints, personalRecords: p.personalRecords })) }, context.nowEpochMs);
  const calendar = reconciliation.context;
  let save: SaveDataV1 = { ...original, competition: reconciliation.nextCompetition,
    profiles: Object.fromEntries(Object.entries(original.profiles).map(([key, p]) => [key, { ...p, personalRecords: reconciliation.nextPersonalRecordsByProfile[key] }])) };
  if (command.profileId) profile = save.profiles[command.profileId];
  let changes: CommitChanges = { ...noChanges(), closedWeekIds: reconciliation.closedWeekChanges.map(c => c.week) };
  const putProfile = (p: ProfileSave) => { profile = p; save = { ...save, profiles: { ...save.profiles, [p.identity.profileId]: p } }; };
  const putEncounter = (e: EncounterSave) => putProfile({ ...profile!, encounters: { ...profile!.encounters, [e.encounterId]: e } });
  const historyFor = (e: EncounterSave) => profile!.learning.canonicalHistory.find(h => h.canonicalQuestionId === e.canonicalQuestionId)!;
  const putHistory = (h: ProfileSave['learning']['canonicalHistory'][number]) => putProfile({ ...profile!, learning: { ...profile!.learning,
    canonicalHistory: [...profile!.learning.canonicalHistory.filter(old => old.canonicalQuestionId !== h.canonicalQuestionId), h] } });
  const learningCalendar = { todayDate: calendar.observedLocalDate, competitionWeekId: calendar.activeWeek,
    reviewIn3DaysDate: addCalendarDays(calendar.observedLocalDate, 3), reviewIn7DaysDate: addCalendarDays(calendar.observedLocalDate, 7) };
  const removeProfile = (profileId: string) => {
    const profiles = { ...save.profiles }, currentScores = { ...save.competition.currentScores }, currentSlots = { ...save.competition.currentSlots };
    delete profiles[profileId]; delete currentScores[profileId]; delete currentSlots[profileId];
    save = { ...save, profiles, competition: { ...save.competition, currentScores, currentSlots,
      archives: save.competition.archives.map(a => a.entries.some(e => e.profileId === profileId)
        ? { ...a, entries: a.entries.filter(e => e.profileId !== profileId), omittedDeletedProfiles: true } : a) } };
  };

  switch (command.kind) {
    case 'CreateProfile': case 'StartOver': {
      if (own(save.profiles, command.payload.newProfileId)) return stop('profile-exists');
      if (command.kind === 'CreateProfile' && Object.keys(save.profiles).length >= SAVE_LIMITS.profiles) return stop('capacity-exceeded');
      if (command.kind === 'StartOver') removeProfile(command.profileId);
      putProfile(newProfile(command.payload)); break;
    }
    case 'DeleteProfile': removeProfile(command.profileId); break;
    case 'RenameProfile': putProfile({ ...profile!, identity: { ...profile!.identity, nickname: command.payload.nickname } }); break;
    case 'SetAvatar': putProfile({ ...profile!, identity: { ...profile!.identity, avatarId: command.payload.avatarId } }); break;
    case 'ChooseCosmetic': {
      const problem = choiceProblem(profile!, command, context.milestone); if (problem) return stop(problem);
      putProfile({ ...profile!, creative: structuredClone(command.payload.choice.value) }); break;
    }
    case 'SetProfilePreferences': putProfile({ ...profile!, preferences: { ...profile!.preferences, ...command.payload.patch } }); break;
    case 'SetAudioPreferences': {
      const old = save.installation.audio, patch = command.payload.patch;
      save = { ...save, installation: { ...save.installation, audio: { ...old, ...patch, music: { ...old.music, ...patch.music }, effects: { ...old.effects, ...patch.effects } } } }; break;
    }
    case 'ReconcileCalendar': break;
    case 'OpenEncounter': {
      const payload = command.payload;
      let active: EncounterSave | undefined;
      let intent: ResolvedSelectionIntent;
      if ('resumeEncounterId' in payload) {
        active = own(profile!.encounters, payload.resumeEncounterId!);
        if (!active) return stop(Object.values(save.profiles).some(p => own(p.encounters, payload.resumeEncounterId!)) ? 'cross-profile-encounter' : 'encounter-expired');
        if (!retainedTask(active, context.catalogue) || !bindingValid(active, profile!, context)) return stop('content-unavailable');
        if (active.learningEpisode.status === 'completed-success') return stop('already-completed');
        intent = { kind: 'resume', skillId: active.skillId, binding: active.bindingProvenance ? context.questBindings.find(b => b.bindingId === active!.bindingProvenance!.bindingId)! : null,
          provenance: active.bindingProvenance, previousCanonicalQuestionId: null };
      } else {
        if (payload.route.kind === 'revisit') {
          const route = payload.route;
          const binding = context.questBindings.find(b => b.bindingId === route.bindingId);
          if (!binding || !profile!.world.completedQuestIds.some(q => q === binding.questId)) return stop('quest-unavailable');
        }
        const resolved = resolveBindingIntent({ route: payload.route, milestone: context.milestone, bindings: context.questBindings, catalogue: context.catalogue,
          accessibleQuestIds: QUESTS.filter(q => admitted(q, context.milestone) && q.requiresAll.every(r => profile!.world.completedQuestIds.includes(r))).map(q => q.id),
          completedStoryBindingIds: profile!.world.completedStoryBindingIds });
        if (resolved.status === 'unavailable') return stop(resolved.reason);
        intent = resolved.intent;
      }
      const selected = selectNextActivity({ catalogue: context.catalogue, intent, evidence: profile!.learning.evidence,
        activeEncounter: active ? selectionEncounter(active) : null,
        canonicalHistory: profile!.learning.canonicalHistory.map(h => ({ ...h, pendingEncounter: h.pendingEncounterId ? selectionEncounter(profile!.encounters[h.pendingEncounterId]) : null })),
        calendar: learningCalendar, suppressDueReviewForVisit: payload.suppressDueReviewForVisit });
      if (selected.status !== 'selected') return stop('no-suitable-task', selected.reason);
      if (selected.resumeEncounterId) {
        const e = own(profile!.encounters, selected.resumeEncounterId);
        if (!e || !retainedTask(e, context.catalogue) || !bindingValid(e, profile!, context)) return stop('content-unavailable');
        const episode = e.learningEpisode;
        if (episode.status === 'completed-success') return stop('already-completed');
        putEncounter({ ...e, learningEpisode: episode.status === 'completed-unsuccessful'
          ? { ordinal: episode.ordinal + 1, status: 'open', validChecks: 0, firstCheckSequence: null, completionActionId: null }
          : { ...episode, status: 'open', completionActionId: null } });
        break;
      }
      const task = context.catalogue.find(t => t.canonicalQuestionId === selected.canonicalQuestionId && t.review.status === 'approved');
      if (!task || (intent.binding && (!intent.binding.taskIds.includes(task.canonicalQuestionId) || intent.binding.responseKind !== task.responseSpec.kind))) return stop('content-unavailable');
      const encounterId = context.allocatedIds.encounterId, opportunityId = context.allocatedIds.opportunityId;
      if (!id(encounterId) || !id(opportunityId) || Object.values(save.profiles).some(p => own(p.encounters, encounterId)
        || Object.values(p.rewards.tracksByCanonical).some(t => [t.currentOpportunity, t.recentCompletedOpportunity].some(o => o?.opportunityId === opportunityId)))) return stop('invalid-command');
      const selection: RewardSelectionFacts = { profileId: command.profileId, canonicalQuestionId: task.canonicalQuestionId, encounterId,
        selectionReason: reasonForReward(selected.reason), candidate: selected.rewardCandidate, band: task.band,
        ...(selected.reviewReference ? { dueLocalDate: selected.reviewReference.dueLocalDate, previousSuccessWeek: selected.reviewReference.previousSuccessWeek } : {}) };
      const oldTrack = own(profile!.rewards.tracksByCanonical, task.canonicalQuestionId) ?? null;
      const eligibility = classifyRewardEligibility({ track: oldTrack, selection, context: calendar });
      if (eligibility.kind === 'resume-existing' || oldTrack?.freePractice.unfinishedEncounterId) return stop('invalid-save');
      const assigned = eligibility.kind !== 'practice-only';
      if (assigned) {
        const track = oldTrack ?? emptyTrack();
        putProfile({ ...profile!, rewards: { ...profile!.rewards, tracksByCanonical: { ...profile!.rewards.tracksByCanonical, [task.canonicalQuestionId]: {
          ...track, lastAllocatedOrdinal: track.lastAllocatedOrdinal + 1, currentOpportunity: { opportunityId, profileId: command.profileId,
            canonicalQuestionId: task.canonicalQuestionId, ordinal: track.lastAllocatedOrdinal + 1, selectionFacts: selection,
            earningWeek: null, slot: null, validChecks: 0, answerHintUsed: false, components: { answer: false, independentSuccess: false, supportedSuccess: false } },
        } } } });
      }
      const e: EncounterSave = { encounterId, opportunityId: assigned ? opportunityId : null, canonicalQuestionId: task.canonicalQuestionId,
        descriptor: task.descriptor, taskContentRevision: task.contentRevision, skillId: task.skillId, band: task.band,
        selectionReason: selected.reason, bindingProvenance: selected.bindingProvenance, familiar: selected.familiar, reviewReference: selected.reviewReference,
        validChecks: 0, firstCheckCorrect: null, assistance: noHelp(), learningEpisode: { ordinal: 1, status: 'open', validChecks: 0, firstCheckSequence: null, completionActionId: null },
        responseDraft: null, revealedAssistanceIds: [], eligibility, lastCommittedCheck: null };
      if (!bindingValid(e, profile!, context)) return stop('invalid-binding');
      const previous = profile!.learning.canonicalHistory.find(h => h.canonicalQuestionId === e.canonicalQuestionId);
      putHistory({ canonicalQuestionId: e.canonicalQuestionId, pendingEncounterId: encounterId, everChecked: previous?.everChecked ?? false,
        previousSuccessLocalDate: previous?.previousSuccessLocalDate ?? null, previousSuccessWeek: previous?.previousSuccessWeek ?? null,
        checkedCompetitionWeekIds: previous?.checkedCompetitionWeekIds ?? [], assistance: e.assistance });
      putEncounter(e); break;
    }
    default: {
      const payload = command.payload;
      const e = own(profile!.encounters, payload.encounterId);
      if (!e) return stop(Object.values(save.profiles).some(p => own(p.encounters, payload.encounterId)) ? 'cross-profile-encounter' : 'encounter-expired');
      const task = retainedTask(e, context.catalogue);
      if (!task || !bindingValid(e, profile!, context)) return stop('content-unavailable');
      if (command.kind === 'SubmitCheck') {
        const last = e.lastCommittedCheck;
        if (last && (last.submissionId === command.payload.submissionId || last.checkSequence === command.payload.checkSequence)) return stop('submission-mismatch');
        if (command.payload.checkSequence < e.validChecks) return stop('encounter-expired');
        if (command.payload.checkSequence !== e.validChecks + 1) return stop('invalid-sequence');
        if (Object.values(save.profiles).some(p => Object.values(p.encounters).some(other => other.lastCommittedCheck?.submissionId === command.payload.submissionId))) return stop('submission-mismatch');
      }
      if ('learningEpisodeOrdinal' in payload && payload.learningEpisodeOrdinal !== e.learningEpisode.ordinal) return stop('stale-episode');
      if (command.kind === 'FinishPractice' && e.learningEpisode.status === 'completed-unsuccessful') return applied();
      if (e.learningEpisode.status.startsWith('completed-')) return stop('stale-episode');
      const draft = command.kind === 'SaveDraft' ? command.payload.responseDraft : command.kind === 'SuspendEncounter' ? command.payload.responseDraft : undefined;
      if (draft !== undefined) {
        const result = evaluateResponse(task, draft);
        if (result.status !== 'judged' && result.status !== 'incomplete') return stop('invalid-response');
      }
      const observation = (eventId: string) => ({ eventId, profileId: command.profileId, encounterId: e.encounterId,
        learningEpisodeOrdinal: e.learningEpisode.ordinal, canonicalQuestionId: e.canonicalQuestionId, skillId: e.skillId, objectiveId: task.objectiveId,
        band: e.band, selectionReason: e.selectionReason, localDate: calendar.observedLocalDate, competitionWeekId: calendar.activeWeek,
        familiar: e.familiar, reviewReference: e.reviewReference, assistance: e.assistance });
      if (command.kind === 'SaveDraft' || command.kind === 'SuspendEncounter') {
        putEncounter({ ...e, responseDraft: draft ?? e.responseDraft, learningEpisode: command.kind === 'SuspendEncounter'
          ? { ...e.learningEpisode, status: 'suspended', completionActionId: null } : e.learningEpisode });
      } else if (command.kind === 'RecordAssistance') {
        const help = command.payload;
        if (help.assistanceKind === 'answer-hint' && !task.hints.some(h => h.id === help.hintId)
          || help.assistanceKind === 'worked-support' && task.workedSupport.id !== help.hintId) return stop('invalid-command');
        if (help.assistanceKind === 'assessed-text-read-aloud' && !task.narration.assessedTextMayBeSpokenBeforeCheck) return stop('invalid-command');
        const assistance: LearningAssistance = { ...e.assistance,
          answerHintUsed: e.assistance.answerHintUsed || help.assistanceKind === 'answer-hint',
          workedSupportUsed: e.assistance.workedSupportUsed || help.assistanceKind === 'worked-support',
          assessedTextReadAloud: e.assistance.assessedTextReadAloud || help.assistanceKind === 'assessed-text-read-aloud',
          evidenceMode: e.assistance.evidenceMode };
        // M1 punctuation assesses punctuation, not independent reading; neutral
        // instructions/assessed narration are never answer-help reward flags.
        const track = own(profile!.rewards.tracksByCanonical, e.canonicalQuestionId);
        if (track) putProfile({ ...profile!, rewards: { ...profile!.rewards, tracksByCanonical: { ...profile!.rewards.tracksByCanonical,
          [e.canonicalQuestionId]: { ...track,
            ...(track.currentOpportunity ? { currentOpportunity: { ...track.currentOpportunity, answerHintUsed: usedAnswerHelp(assistance) } } : {}),
            ...(track.freePractice.unfinishedEncounterId === e.encounterId ? { freePractice: { ...track.freePractice, answerHintUsed: usedAnswerHelp(assistance) } } : {}),
          } } } });
        putHistory({ ...historyFor(e), assistance });
        putEncounter({ ...e, assistance, revealedAssistanceIds: 'hintId' in help ? [...new Set([...e.revealedAssistanceIds, help.hintId!])] : e.revealedAssistanceIds });
      } else if (command.kind === 'FinishPractice') {
        if (e.learningEpisode.validChecks === 0) return stop('episode-not-finishable');
        const evidence = applyLearningObservation(profile!.learning.evidence, { ...observation(command.actionId), kind: 'finished-unsuccessfully', episodeCompletion: 'deliberate-unsuccessful' });
        putProfile({ ...profile!, learning: { ...profile!.learning, evidence } });
        putEncounter({ ...e, learningEpisode: { ...e.learningEpisode, status: 'completed-unsuccessful', completionActionId: command.actionId } });
      } else if (command.kind === 'SubmitCheck') {
        if (e.learningEpisode.status !== 'open') return stop('stale-episode');
        const p = command.payload;
        const evaluation = evaluateResponse(task, p.response);
        if (evaluation.status !== 'judged') return stop(evaluation.status === 'incomplete' ? 'incomplete-response' : evaluation.status === 'unavailable-content' ? 'content-unavailable' : 'invalid-response');
        const track = own(profile!.rewards.tracksByCanonical, e.canonicalQuestionId) ?? null;
        const selection: RewardSelectionFacts = track?.currentOpportunity?.selectionFacts ?? { profileId: command.profileId,
          encounterId: e.encounterId, canonicalQuestionId: e.canonicalQuestionId, selectionReason: reasonForReward(e.selectionReason), candidate: 'none', band: e.band };
        const eligibility = classifyRewardEligibility({ track, selection, context: calendar });
        const scored = applyCheckRewards({ profileId: command.profileId, encounterId: e.encounterId, opportunityId: e.opportunityId,
          submissionId: p.submissionId, checkSequence: p.checkSequence, validChecks: e.validChecks, track, rewards: profile!.rewards,
          evaluation, assistance: e.assistance, selection, competition: save.competition, context: calendar });
        const o: LearningObservation = { ...observation(p.submissionId), kind: 'check', submissionId: p.submissionId,
          episodeCheckIndex: e.learningEpisode.validChecks + 1, encounterCheckIndex: p.checkSequence,
          firstCheckCorrect: e.firstCheckCorrect ?? evaluation.correct, issues: evaluation.feedback.issues,
          ...(evaluation.correct ? { correct: true, episodeCompletion: 'success' } : { correct: false, episodeCompletion: null }) };
        putProfile({ ...profile!, rewards: scored.nextRewards, learning: { ...profile!.learning, evidence: applyLearningObservation(profile!.learning.evidence, o) } });
        save = { ...save, competition: scored.nextCompetition };
        let delta = scored.delta;
        if (evaluation.correct && e.bindingProvenance?.role === 'story') {
          const binding = e.bindingProvenance;
          const completedStoryBindingIds = [...new Set([...profile!.world.completedStoryBindingIds, binding.bindingId])];
          const quest = QUESTS.find(q => q.id === binding.questId)!;
          const complete = areRequiredBindingsComplete({ bindings: context.questBindings, questId: quest.id, milestone: context.milestone, completedStoryBindingIds })
            && quest.requiresAll.every(q => profile!.world.completedQuestIds.includes(q));
          const newlyComplete = complete && !profile!.world.completedQuestIds.includes(quest.id);
          const award = applyQuestReward({ profileId: command.profileId, questId: quest.id, questCompleted: complete, rewards: profile!.rewards });
          delta = combine(delta, award.delta);
          putProfile({ ...profile!, rewards: award.nextRewards, world: { completedStoryBindingIds,
            completedQuestIds: newlyComplete ? [...profile!.world.completedQuestIds, quest.id] : profile!.world.completedQuestIds } });
          if (newlyComplete) changes = { ...changes, restorationIds: quest.resultIds };
        }
        const oldHistory = historyFor(e);
        putHistory({ ...oldHistory, everChecked: true, pendingEncounterId: evaluation.correct ? null : e.encounterId,
          checkedCompetitionWeekIds: [...new Set([...oldHistory.checkedCompetitionWeekIds, calendar.activeWeek])].sort(),
          ...(evaluation.correct ? { previousSuccessLocalDate: calendar.observedLocalDate, previousSuccessWeek: calendar.activeWeek } : {}) });
        // Bounded per-canonical retention: keep unresolved work and the newest
        // successful encounter. Permanent bindings/evidence/ordinal totals survive.
        if (evaluation.correct) putProfile({ ...profile!, encounters: Object.fromEntries(Object.entries(profile!.encounters)
          .filter(([, old]) => old.canonicalQuestionId !== e.canonicalQuestionId || old.learningEpisode.status !== 'completed-success')) });
        const opportunityId = eligibility.kind === 'practice-only' ? null : e.opportunityId;
        putEncounter({ ...e, opportunityId, eligibility, validChecks: p.checkSequence, firstCheckCorrect: e.firstCheckCorrect ?? evaluation.correct,
          responseDraft: structuredClone(p.response), lastCommittedCheck: { submissionId: p.submissionId, checkSequence: p.checkSequence,
            learningEpisodeOrdinal: p.learningEpisodeOrdinal, response: structuredClone(p.response), evaluation, delta },
          learningEpisode: { ...e.learningEpisode, validChecks: e.learningEpisode.validChecks + 1,
            firstCheckSequence: e.learningEpisode.firstCheckSequence ?? p.checkSequence,
            ...(evaluation.correct ? { status: 'completed-success', completionActionId: command.actionId } : { status: 'open', completionActionId: null }) } });
        changes = { ...changes, earnedPoints: delta, unlockedIds: delta.newEntitlementIds };
      }
    }
  }
  if (sameValue(original, save)) return applied();
  const validation = validateSave(save, context.catalogue);
  if (validation.status !== 'valid') return stop(validation.issues[0]?.code ?? 'invalid-save', validation.issues[0]?.message, validation.status);
  return { status: 'changed', save: validation.save, changes };
};
