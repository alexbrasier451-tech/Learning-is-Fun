import { describe, expect, it } from 'vitest';
import { INITIAL_CREATIVE_STATE as INITIAL_CREATIVE, INITIAL_WORLD_PROGRESS as INITIAL_WORLD } from '../../src/experience/catalogue';
import { committedResultIds, requiredProgress, resolveWorldView } from '../../src/experience/world';
import { toActivityTaskView } from '../../src/experience/activityAdapter';
import { listTasks } from '../../src/content/catalogue';
import type { CommittedActivityProjection } from '../../src/state/contracts';

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
