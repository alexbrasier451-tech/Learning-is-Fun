import { COSMETICS, DISCOVERIES, QUESTS, SCENES, WORLD_RESULTS } from './catalogue';
import { getRequiredBindingIds, QUEST_ACTIVITY_BINDINGS } from '../content/quest-bindings';
import type { CreativeState, Milestone, QuestId, SceneId, WorldHotspot, WorldProgress, WorldView } from './types';

export const QUEST_TITLES: Readonly<Partial<Record<QuestId, string>>> = {
  Q1: 'A Bridge Back Home', Q2: 'Wake the Whispering Library', Q3: "The Merchant’s Welcome",
};

export function committedResultIds(world: WorldProgress) {
  return WORLD_RESULTS.filter(result => world.completedQuestIds.includes(result.questId)).map(result => result.id);
}

export function requiredProgress(world: WorldProgress, questId: QuestId) {
  const required = getRequiredBindingIds(QUEST_ACTIVITY_BINDINGS, questId, 'M1');
  return { completed: required.filter(id => world.completedStoryBindingIds.includes(id)).length, total: required.length };
}

/** Pure presentation of the acknowledged permanent sets. No history, grading or awards. */
export function resolveWorldView({ world, creative, entitlements, sceneId, milestone }: {
  world: WorldProgress; creative: CreativeState; entitlements: readonly string[]; sceneId: SceneId; milestone: Milestone;
}): WorldView {
  const scenes = SCENES.filter(scene => scene.milestone === 'M1' || milestone === 'M2');
  const scene = scenes.find(scene => scene.id === sceneId);
  if (!scene) throw new Error('This destination is not part of the delivered adventure.');
  const quests = QUESTS.filter(quest => quest.milestone === 'M1' || milestone === 'M2');
  const available = quests.filter(quest => !world.completedQuestIds.includes(quest.id)
    && quest.requiresAll.every(id => world.completedQuestIds.includes(id)));
  const reachable = scenes.filter(s => s.id === 'village-green' || s.id === 'river-bridge' || world.completedQuestIds.includes('Q1'));
  const hotspots: WorldHotspot[] = reachable.filter(s => s.id !== sceneId).map(s => ({
    id: `visit-${s.id}`, label: s.title, intent: { kind: 'navigate', sceneId: s.id },
  }));
  available.filter(q => q.sceneId === sceneId).forEach(q => hotspots.push({ id: q.id, label: QUEST_TITLES[q.id] ?? q.id, intent: { kind: 'quest', questId: q.id } }));
  QUEST_ACTIVITY_BINDINGS.filter(b => b.role === 'optional-transfer' && b.sourceBindingId !== null
    && world.completedStoryBindingIds.includes(b.sourceBindingId) && world.completedQuestIds.includes(b.questId as QuestId)
    && quests.some(q => q.id === b.questId && q.sceneId === sceneId)).forEach(b => hotspots.push({
    id: b.bindingId, label: 'Try the optional challenge', intent: { kind: 'practice', route: { kind: 'optional-transfer', bindingId: b.bindingId } },
  }));
  QUEST_ACTIVITY_BINDINGS.filter(b => b.role === 'revisit' && world.completedQuestIds.includes(b.questId as QuestId)
    && quests.some(q => q.id === b.questId && q.sceneId === sceneId)).forEach(b => hotspots.push({
    id: b.bindingId, label: 'Try some practice', intent: { kind: 'practice', route: { kind: 'revisit', bindingId: b.bindingId } },
  }));
  hotspots.push({ id: 'creative', label: 'Your little corner', intent: { kind: 'creative' } }, { id: 'hall', label: 'Hall of Champions', intent: { kind: 'hall' } });
  const discovery = DISCOVERIES.find(d => d.id === scene.discoveryId);
  if (discovery) hotspots.push({ id: discovery.id, label: 'Look a little closer', intent: { kind: 'discovery', discoveryId: discovery.id } });
  const assets = new Set<string>([scene.landmarkAssetId]);
  WORLD_RESULTS.filter(r => world.completedQuestIds.includes(r.questId) && (r.sceneIds as readonly SceneId[]).includes(sceneId))
    .forEach(r => r.assetIds.forEach(id => assets.add(id)));
  if (sceneId === 'village-green' && world.completedQuestIds.includes('Q3') && Object.values(creative.placements).includes('planter')) {
    assets.add('decoration-planter'); assets.add(`flowers-${creative.flowerColourId}`);
    if (creative.planterRimId && COSMETICS.some(c => c.id === creative.planterRimId && entitlements.includes(c.entitlementId))) assets.add(creative.planterRimId);
  }
  return { sceneId, visibleAssetIds: [...assets], hotspots, completedQuestIds: quests.filter(q => world.completedQuestIds.includes(q.id)).map(q => q.id), availableQuestIds: available.map(q => q.id) };
}
