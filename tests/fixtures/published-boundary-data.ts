import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { evaluateResponse } from '../../src/learning/evaluate';
import type { ActivityResponse, LearningRouteIntent, TaskDefinition } from '../../src/learning/contracts';
import { decodeBackup, exportBackup, validateSave } from '../../src/state/backup';
import type { CommitChanges, CommittedSnapshot, EncounterSave, SaveDataV1, StateCommand, StoredRoot, TransitionContext } from '../../src/state/contracts';
import { createInitialSave, reduceCommand, sameValue } from '../../src/state/transition';

/** Controlled producer data for normal adult-UI import. No browser/global clock,
 * repository write, alternate catalogue, reward injection or production hook. */
export const PUBLISHED_BOUNDARY_BUILD = 'b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1';
export const BOUNDARY_CLOCKS = {
  cap: '2026-07-01T11:00:00.000Z',
  sunday: '2026-07-05T22:59:59.000Z',
  mondayBoundary: '2026-07-05T23:00:00.000Z',
  priorSuccess: '2026-07-03T11:00:00.000Z',
  plus3: '2026-07-06T11:00:00.000Z',
  plus7: '2026-07-13T11:00:00.000Z',
} as const;
export const boundaryCatalogue = listTasks();
export type BoundaryTrace = {
  clock: string; command: StateCommand; allocatedIds: TransitionContext['allocatedIds'];
  status: 'changed' | 'already-applied'; changes: CommitChanges | null;
  resultingToken: CommittedSnapshot['token'];
};

/** The root envelope is fixture-local transaction metadata. Every save change
 * below is the output of the real synchronous composition/validation boundary. */
export class BoundaryHistory {
  private value: StoredRoot;
  private sequence = 0;
  readonly trace: BoundaryTrace[] = [];
  readonly profileId: string;
  readonly otherProfileId: string;
  constructor(readonly group: string, public clock: string, seed?: SaveDataV1) {
    this.value = { epoch: `${seed ? 'imported' : 'producer'}-${group}`, revision: 0, save: structuredClone(seed ?? createInitialSave()) };
    this.profileId = `boundary-${group}`; this.otherProfileId = `boundary-${group}-other`;
  }
  get snapshot(): CommittedSnapshot { return { token: { epoch: this.value.epoch, revision: this.value.revision }, save: this.value.save }; }
  get profile() { return this.value.save.profiles[this.profileId]; }
  act(kind: StateCommand['kind'], payload: unknown, profileId?: string) {
    const n = ++this.sequence;
    const command = { actionId: `${this.value.epoch}-action-${n}`, expected: this.snapshot.token, kind, payload,
      ...(profileId ? { profileId } : {}) } as StateCommand;
    const allocatedIds = { encounterId: `${this.group}-encounter-${n}`, opportunityId: `${this.group}-opportunity-${n}` };
    const before = JSON.stringify(this.value);
    const result = reduceCommand(this.value, command, { nowEpochMs: Date.parse(this.clock), catalogue: boundaryCatalogue,
      questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1', allocatedIds });
    if (JSON.stringify(this.value) !== before) throw new Error('Producer mutated the input root');
    if (result.status !== 'changed' && result.status !== 'already-applied') throw new Error(`${kind}: ${JSON.stringify(result)}`);
    if (result.status === 'changed') {
      const checked = validateSave(result.save, boundaryCatalogue);
      if (checked.status !== 'valid') throw new Error(JSON.stringify(checked));
      this.value = { ...this.value, revision: this.value.revision + 1, save: result.save };
    }
    this.trace.push(structuredClone({ clock: this.clock, command, allocatedIds, status: result.status,
      changes: result.status === 'changed' ? result.changes : null, resultingToken: this.snapshot.token }));
    return result;
  }
  createProfiles(nickname: string) {
    this.act('CreateProfile', { newProfileId: this.profileId, nickname, avatarId: 'pip' });
    this.act('CreateProfile', { newProfileId: this.otherProfileId, nickname: 'Other Explorer', avatarId: 'iona' });
  }
  open(route: LearningRouteIntent, suppressDueReviewForVisit = false): EncounterSave {
    const id = `${this.group}-encounter-${this.sequence + 1}`;
    this.act('OpenEncounter', { route, suppressDueReviewForVisit }, this.profileId);
    const encounter = this.profile.encounters[id];
    if (!encounter) throw new Error(`Expected a fresh selected activity for ${JSON.stringify(route)}`);
    return encounter;
  }
  resume(encounterId: string): EncounterSave {
    this.act('OpenEncounter', { resumeEncounterId: encounterId, suppressDueReviewForVisit: false }, this.profileId);
    return this.profile.encounters[encounterId];
  }
  suspend(encounterId: string) {
    const e = this.profile.encounters[encounterId];
    this.act('SuspendEncounter', { encounterId, learningEpisodeOrdinal: e.learningEpisode.ordinal }, this.profileId);
  }
  check(encounter: EncounterSave, response = correctBoundaryAnswer(taskFor(encounter))) {
    const e = this.profile.encounters[encounter.encounterId];
    return this.act('SubmitCheck', { encounterId: e.encounterId, learningEpisodeOrdinal: e.learningEpisode.ordinal,
      submissionId: `${this.group}-submission-${this.sequence + 1}`, checkSequence: e.validChecks + 1, response }, this.profileId);
  }
  starterQuests() { for (const questId of ['Q1', 'Q2', 'Q3']) this.check(this.open({ kind: 'quest', questId })); }
}

export function taskFor(encounter: EncounterSave): TaskDefinition {
  const task = boundaryCatalogue.find(t => t.canonicalQuestionId === encounter.canonicalQuestionId);
  if (!task) throw new Error('Only delivered tasks can enter boundary data');
  return task;
}
/** Use a declared valid response to construct history; tests pin independent
 * literal answers and arithmetic for the actual observed boundary tasks. */
export function correctBoundaryAnswer(task: TaskDefinition): ActivityResponse {
  const rule = task.answerRule;
  const response: ActivityResponse = rule.kind === 'bridge-total'
    ? { kind: 'bridge', planks: [...Array(Math.floor(rule.target / 6)).fill(6), ...(rule.target % 6 ? [rule.target % 6] : [])] }
    : rule.kind === 'merchant-constraints'
      ? { kind: 'merchant', pears: rule.total / (rule.multiplier + 1), apples: rule.total * rule.multiplier / (rule.multiplier + 1) }
      : structuredClone(rule.responses[0]);
  const evaluated = evaluateResponse(task, response);
  if (evaluated.status !== 'judged' || !evaluated.correct) throw new Error('The supplied answer must be judged correct by its producer');
  return response;
}

export type PublishedBoundaryFixture = {
  id: string; group: 'cap' | 'summer' | 'review'; filename: string; importClock: string;
  profileId: string; otherProfileId: string; snapshot: CommittedSnapshot;
  json: string; byteLength: number; trace: BoundaryTrace[];
  next: { clock: string; encounterId?: string; route?: LearningRouteIntent; canonicalQuestionId: string;
    response: ActivityResponse; expectedDelta: { lifetime: number; competitive: number; slot: number | null } };
};
function capture(h: BoundaryHistory, id: string, group: PublishedBoundaryFixture['group'], next: PublishedBoundaryFixture['next']): PublishedBoundaryFixture {
  const snapshot = structuredClone(h.snapshot), backup = exportBackup(snapshot, h.clock, boundaryCatalogue);
  const decoded = decodeBackup(backup.json, boundaryCatalogue);
  if (decoded.status !== 'valid' || !sameValue(decoded.envelope.save, snapshot.save)) throw new Error('Whole-save export must round-trip through the ordinary importer');
  return { id, group, filename: `${id}.json`, importClock: h.clock, profileId: h.profileId, otherProfileId: h.otherProfileId,
    snapshot, json: backup.json, byteLength: backup.byteLength, trace: structuredClone(h.trace), next };
}

export function buildPublishedBoundaryFixtures(): PublishedBoundaryFixture[] {
  const fixtures: PublishedBoundaryFixture[] = [];
  const cap = new BoundaryHistory('cap', BOUNDARY_CLOCKS.cap); cap.createProfiles('Cap Explorer'); cap.starterQuests();
  // All three anchors first, then every remaining maths question and four
  // distinct English questions. The selector chooses the real canonical IDs.
  for (const [bindingId, count] of [['q1-revisit-m01', 11], ['q3-revisit-m04', 11], ['q2-revisit-e06', 4]] as const) {
    for (let i = 0; i < count; i++) cap.check(cap.open({ kind: 'revisit', bindingId }));
  }
  for (const slot of [30, 31]) {
    const e = cap.open({ kind: 'revisit', bindingId: 'q2-revisit-e06' }); cap.suspend(e.encounterId);
    fixtures.push(capture(cap, `cap-before-${slot}`, 'cap', { clock: cap.clock, encounterId: e.encounterId,
      canonicalQuestionId: e.canonicalQuestionId, response: correctBoundaryAnswer(taskFor(e)),
      expectedDelta: { lifetime: 20, competitive: slot === 30 ? 20 : 0, slot: slot === 30 ? 30 : null } }));
    cap.check(cap.resume(e.encounterId));
  }

  const summer = new BoundaryHistory('summer', BOUNDARY_CLOCKS.sunday); summer.createProfiles('Sunday Explorer');
  const sunday = summer.open({ kind: 'quest', questId: 'Q1' }); summer.suspend(sunday.encounterId);
  fixtures.push(capture(summer, 'summer-sunday-before-check', 'summer', { clock: BOUNDARY_CLOCKS.sunday,
    encounterId: sunday.encounterId, canonicalQuestionId: sunday.canonicalQuestionId, response: { kind: 'bridge', planks: [1] },
    expectedDelta: { lifetime: 5, competitive: 5, slot: 1 } }));
  summer.check(summer.resume(sunday.encounterId), { kind: 'bridge', planks: [1] }); summer.suspend(sunday.encounterId);
  fixtures.push(capture(summer, 'summer-sunday-wrong', 'summer', { clock: BOUNDARY_CLOCKS.mondayBoundary,
    encounterId: sunday.encounterId, canonicalQuestionId: sunday.canonicalQuestionId, response: { kind: 'bridge', planks: [6, 6] },
    expectedDelta: { lifetime: 25, competitive: 0, slot: null } }));

  const review = new BoundaryHistory('review', BOUNDARY_CLOCKS.priorSuccess); review.createProfiles('Review Explorer'); review.starterQuests();
  const reviewNext = (clock: string): PublishedBoundaryFixture['next'] => ({ clock, route: { kind: 'practice', mode: 'suggested' },
    canonicalQuestionId: 'lif.math.bridge.r1.total-12', response: { kind: 'bridge', planks: [6, 6] },
    expectedDelta: { lifetime: 20, competitive: 20, slot: 1 } });
  review.clock = BOUNDARY_CLOCKS.plus3; review.act('ReconcileCalendar', {});
  fixtures.push(capture(review, 'review-plus-3-ready', 'review', reviewNext(review.clock)));
  // Ordinary unbound suggested practice offers all three due skills in order.
  // Complete them so no overdue different skill masks the next Monday's +7.
  for (let i = 0; i < 3; i++) review.check(review.open({ kind: 'practice', mode: 'suggested' }));
  review.clock = BOUNDARY_CLOCKS.plus7; review.act('ReconcileCalendar', {});
  fixtures.push(capture(review, 'review-plus-7-ready', 'review', reviewNext(review.clock)));
  return fixtures;
}

/** Replays an imported backup at its observer clock through the same producers.
 * Import's local epoch is deliberately fresh; portable JSON contains no token. */
export function exercisePublishedBoundary(fixture: PublishedBoundaryFixture) {
  const decoded = decodeBackup(fixture.json, boundaryCatalogue);
  if (decoded.status !== 'valid') throw new Error('Cannot exercise an invalid import');
  const h = new BoundaryHistory(fixture.group, fixture.next.clock, decoded.envelope.save);
  const e = fixture.next.encounterId ? h.resume(fixture.next.encounterId) : h.open(fixture.next.route!);
  const result = h.check(e, fixture.next.response);
  return { selected: e, result, snapshot: h.snapshot, trace: h.trace };
}
