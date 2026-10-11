import { describe, expect, it } from 'vitest';
import { INITIAL_CREATIVE_STATE as INITIAL_CREATIVE, INITIAL_WORLD_PROGRESS as INITIAL_WORLD } from '../../src/experience/catalogue';
import { committedResultIds, requiredProgress, resolveWorldView } from '../../src/experience/world';
import { toActivityTaskView } from '../../src/experience/activityAdapter';
import { listTasks } from '../../src/content/catalogue';
import type { CommittedActivityProjection } from '../../src/state/contracts';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { QUESTS, SCENES } from '../../src/experience/catalogue';
import { SKILLS } from '../../src/content/skills';
import type { QuestId } from '../../src/experience/types';

describe('M1 acknowledged world projection', () => {
  it('opens the crossing first, then the library and market without a score lock', () => {
    const input = { world: INITIAL_WORLD, creative: INITIAL_CREATIVE, entitlements: [], sceneId: 'river-bridge' as const, milestone: 'M1' as const };
    const fresh = resolveWorldView(input);
    expect(fresh.availableQuestIds).toEqual(['Q1']);
    expect(fresh.hotspots.some(h => h.intent.kind === 'navigate' && h.intent.sceneId === 'whispering-library')).toBe(false);
    expect(fresh.hotspots.some(h => h.intent.kind === 'practice' && h.intent.route.kind === 'optional-transfer')).toBe(false);
    const world = { completedQuestIds: ['Q1' as const], completedStoryBindingIds: ['q1-story-m01'] };
    expect(resolveWorldView({ ...input, world }).availableQuestIds).toEqual(['Q2']);
    expect(committedResultIds(world)).toEqual(['bridge-restored', 'route-to-library-market']);
    expect(requiredProgress(world, 'Q1')).toEqual({ completed: 1, total: 1 });
  });
  it('uses permanent sets with no retained encounter/history dependency and keeps creative play open', () => {
    const world = { completedQuestIds: ['Q1', 'Q2', 'Q3'] as const, completedStoryBindingIds: ['q1-story-m01', 'q2-story-e06', 'q3-story-m04'] };
    const view = resolveWorldView({ world, creative: { ...INITIAL_CREATIVE, flowerColourId: 'gold', placements: { ...INITIAL_CREATIVE.placements, 'plot-2': 'planter' } },
      entitlements: [], sceneId: 'village-green', milestone: 'M1' });
    expect(view.availableQuestIds).toEqual([]);
    expect(view.visibleAssetIds).toContain('flowers-gold');
    expect(view.hotspots.some(h => h.intent.kind === 'creative')).toBe(true);
    expect(committedResultIds(world)).toContain('village-welcome');
    for (const [sceneId, bindingId] of [['river-bridge', 'q1-transfer-m01'], ['whispering-library', 'q2-transfer-e06'], ['market-square', 'q3-transfer-m04']] as const) {
      const destination = resolveWorldView({ world, creative: INITIAL_CREATIVE, entitlements: [], sceneId, milestone: 'M1' });
      expect(destination.hotspots.filter(h => h.intent.kind === 'practice' && h.intent.route.kind === 'optional-transfer').map(h => h.intent))
        .toEqual([{ kind: 'practice', route: { kind: 'optional-transfer', bindingId } }]);
    }
    expect(() => resolveWorldView({ world, creative: INITIAL_CREATIVE, entitlements: [], sceneId: 'clockwork-castle', milestone: 'M1' })).toThrow();
  });
  it('never promotes optional binding facts to story completion', () => {
    const world = { completedQuestIds: [], completedStoryBindingIds: ['q1-transfer-m01'] };
    expect(requiredProgress(world, 'Q1')).toEqual({ completed: 0, total: 1 });
    expect(committedResultIds(world)).toEqual([]);
    const view = resolveWorldView({ world: { ...world, completedQuestIds: ['Q1'] }, creative: INITIAL_CREATIVE, entitlements: [], sceneId: 'river-bridge', milestone: 'M1' });
    expect(view.hotspots.some(h => h.intent.kind === 'practice' && h.intent.route.kind === 'optional-transfer')).toBe(false);
  });
  it('adapts only authorized help and supplied reward facts, leaving nullable answers unsubmitted', () => {
    const task = listTasks().find(t => t.canonicalQuestionId === 'lif.math.bridge.r1.total-12')!;
    const activity: CommittedActivityProjection = { token: { epoch: 'epoch', revision: 1 }, profileId: 'player', encounterId: 'encounter',
      learningEpisodeOrdinal: 1, nextCheckSequence: 1, episodeStatus: 'open', task, responseDraft: null, lastCheck: null, lastEvaluation: null,
      revealedAssistanceIds: [], bindingProvenance: { bindingId: 'q1-story-m01', questId: 'Q1', role: 'story' }, selectionReason: 'story-anchor', familiar: false,
      reviewReference: null, rewardDisplay: { eligibility: { kind: 'eligible-first', reason: 'first-encounter' }, earningWeek: null, slot: null,
        earningWeekOpen: false, components: null, lastCommittedDelta: null } };
    const before = toActivityTaskView(activity);
    expect(before.responseDraft).toBeNull(); expect(before.help).toEqual([]); expect(before.rewardLabel).toContain('not started');
    expect(before).not.toHaveProperty('answerRule');
    expect(toActivityTaskView({ ...activity, revealedAssistanceIds: [task.hints[0].id] }).help).toEqual([task.hints[0]]);
  });
});

describe('M2 permanent story and real assessed routes', () => {
  const view = (completedQuestIds: readonly QuestId[], sceneId = 'village-green' as typeof SCENES[number]['id'], completedStoryBindingIds: string[] = []) =>
    resolveWorldView({ world: { completedQuestIds, completedStoryBindingIds }, creative: INITIAL_CREATIVE, entitlements: [], sceneId, milestone: 'M2' });
  it('keeps both branch orders and the forest join exact', () => {
    for (const order of [['Q4', 'Q5', 'Q6'], ['Q6', 'Q4', 'Q5']] as const) {
      const done: QuestId[] = ['Q1', 'Q2', 'Q3'];
      expect(view(done).availableQuestIds).toEqual(['Q4', 'Q6']);
      for (const next of order) {
        expect(view(done).availableQuestIds).toContain(next);
        expect(view(done).hotspots.some(h => h.intent.kind === 'navigate' && h.intent.sceneId === 'storywood-forest')).toBe(false);
        done.push(next);
      }
      for (const id of ['Q7', 'Q8', 'Q9', 'Q10'] as const) { expect(view(done).availableQuestIds).toEqual([id]); done.push(id); }
      expect(view(done).availableQuestIds).toEqual([]);
      expect(committedResultIds({ completedQuestIds: done, completedStoryBindingIds: [] })).toContain('kingdom-finale');
    }
  });
  it('keeps every multibeat requirement after encounter compaction and ignores revisit IDs', () => {
    for (const id of ['Q6', 'Q8', 'Q9', 'Q10'] as const) {
      const required = QUEST_ACTIVITY_BINDINGS.filter(b => b.questId === id && b.role === 'story');
      const world = { completedQuestIds: [] as QuestId[], completedStoryBindingIds: [required[0].bindingId, ...QUEST_ACTIVITY_BINDINGS.filter(b => b.questId === id && b.role === 'revisit').map(b => b.bindingId)] };
      expect(requiredProgress(world, id)).toEqual({ completed: 1, total: required.length });
      expect(committedResultIds(world)).toEqual([]);
    }
  });
  it('offers actual nonempty reviewed pools for all 20 assessed skills, six mechanics and nine response forms', () => {
    const tasks = listTasks(), routed = new Set<string>();
    for (const scene of SCENES) {
      const world = view(QUESTS.map(q => q.id), scene.id, QUEST_ACTIVITY_BINDINGS.filter(b => b.role === 'story').map(b => b.bindingId));
      expect(world.hotspots.some(h => h.intent.kind === 'discovery')).toBe(true);
      for (const h of world.hotspots) if (h.intent.kind === 'practice' && h.intent.route.kind !== 'practice') routed.add(h.intent.route.bindingId);
    }
    const bindings = QUEST_ACTIVITY_BINDINGS.filter(b => b.role === 'story' || routed.has(b.bindingId));
    expect(bindings).toHaveLength(57);
    expect(bindings.filter(b => b.availability === 'M1')).toHaveLength(9);
    expect(bindings.filter(b => b.availability === 'M2' && b.role === 'story')).toHaveLength(12);
    expect(new Set(bindings.map(b => b.skillId))).toEqual(new Set(SKILLS.map(s => s.skillId)));
    expect(new Set(bindings.map(b => b.mechanic)).size).toBe(6);
    expect(new Set(bindings.map(b => b.responseKind)).size).toBe(9);
    for (const b of bindings) { expect(b.taskIds.length).toBeGreaterThan(0); for (const id of b.taskIds) expect(tasks.find(t => t.canonicalQuestionId === id)).toMatchObject({ skillId: b.skillId, responseSpec: { kind: b.responseKind } }); }
  });
});
