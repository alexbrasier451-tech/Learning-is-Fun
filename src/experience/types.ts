import type { ActivityBindingId, LearningRouteIntent } from '../learning/contracts';
import type { ScoreDelta } from '../rewards/contracts';

/** Pure, readonly JSON contracts. Availability is delivery, never score eligibility. */
export type Milestone = 'M1' | 'M2';
export type SceneId = 'village-green' | 'river-bridge' | 'whispering-library'
  | 'market-square' | 'tinkers-workshop' | 'storywood-forest' | 'clockwork-castle';
export type QuestId = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7' | 'Q8' | 'Q9' | 'Q10';
export type WorldResultId = 'bridge-restored' | 'route-to-library-market'
  | 'library-restored' | 'market-instructions' | 'market-stocked' | 'village-welcome'
  | 'planter-available' | 'sawmill-restored' | 'invention-available' | 'garden-restored'
  | 'forest-marker' | 'books-shelved' | 'forest-story-map' | 'forest-path-restored'
  | 'castle-gear-recovered' | 'castle-clock-restored' | 'castle-open' | 'kingdom-finale';
export type SceneDefinition = Readonly<{
  id: SceneId; title: string; milestone: Milestone; landmarkAssetId: string;
  theme: 'village' | 'library'; discoveryId: string;
}>;
export type QuestDefinition = Readonly<{
  id: QuestId; sceneId: SceneId; milestone: Milestone;
  requiresAll: readonly QuestId[]; resultIds: readonly WorldResultId[];
}>;
/** Permanent unique sets, initially empty. WP03 owns binding identity/required
 * success; WP04 validates and commits both sets atomically. Optional work cannot
 * complete story bindings. Never reconstruct these sets from compactable history. */
export type WorldProgress = Readonly<{
  completedQuestIds: readonly QuestId[];
  completedStoryBindingIds: readonly ActivityBindingId[];
}>;
export type HotspotIntent =
  | Readonly<{ kind: 'navigate'; sceneId: SceneId }>
  | Readonly<{ kind: 'quest'; questId: QuestId }>
  | Readonly<{ kind: 'practice'; route: Extract<LearningRouteIntent,
      { kind: 'practice' | 'revisit' | 'optional-transfer' }> }>
  | Readonly<{ kind: 'hall' }>
  | Readonly<{ kind: 'creative' }>
  | Readonly<{ kind: 'discovery'; discoveryId: string }>;
export type WorldHotspot = Readonly<{ id: string; label: string; intent: HotspotIntent }>;
/** A downstream pure projection, with no callbacks or persisted restoration flags. */
export type WorldView = Readonly<{
  sceneId: SceneId; visibleAssetIds: readonly string[]; hotspots: readonly WorldHotspot[];
  completedQuestIds: readonly QuestId[]; availableQuestIds: readonly QuestId[];
}>;
export type SocketId = 'plot-1' | 'plot-2' | 'plot-3' | 'plot-4' | 'plot-5' | 'plot-6';
export type DecorationId = 'planter' | 'tree' | 'bench' | 'lantern' | 'banner' | 'pond';
export type ScarfColourId = 'teal' | 'amber' | 'plum';
export type FlowerColourId = 'coral' | 'gold' | 'violet';
export type CosmeticId = 'scarf-leaf' | 'planter-rim' | 'home-trim' | 'scarf-star' | 'scarf-wave';
export type CreativeState = Readonly<{
  scarfColourId: ScarfColourId; scarfPatternId: string | null;
  flowerColourId: FlowerColourId; planterRimId: string | null; facadeTrimId: string | null;
  placements: Readonly<Record<SocketId, DecorationId | null>>;
}>;
/** Complete appearance replacement. No points, grants, coordinates or partial patches. */
export type CreativeChoice = Readonly<{ kind: 'appearance'; value: CreativeState }>;
export type AppearanceProperty = 'scarfColourId' | 'scarfPatternId' | 'flowerColourId'
  | 'planterRimId' | 'facadeTrimId' | 'placements';
export type CreativeOption = Readonly<{
  id: string; label: string; target: AppearanceProperty; assetId: string;
  milestone: Milestone; entitlementId: ScoreDelta['newEntitlementIds'][number] | null;
  requiresAll: readonly QuestId[];
}>;
export type CosmeticDefinition = CreativeOption & Readonly<{ id: CosmeticId }>;
export type WorldResultDefinition = Readonly<{
  id: WorldResultId; questId: QuestId; sceneIds: readonly SceneId[];
  assetIds: readonly string[]; meaning: string;
}>;
export type DerivedStoryDisplay = Readonly<{
  id: 'spellbook' | 'forest-story-map' | 'forest-tale' | 'sawmill-model';
  kind: 'shelf' | 'invention'; milestone: Milestone;
  requiresAll: readonly QuestId[]; assetId: string;
}>;
export type AvatarDefinition = Readonly<{
  id: string; label: string; assetId: string; milestone: Milestone;
}>;

/** Exact third-party evidence is retained before reuse. Original rights are not
 * silently converted to CC0/GPL; planned permission is not a ready-rights claim. */
export type AssetPermission =
  | Readonly<{ kind: 'original'; status: 'pending' | 'confirmed'; holder: string;
      statement: string; evidencePath?: string }>
  | Readonly<{ kind: 'reused'; licence: string; version: string; licenceUrl: string;
      retainedLicencePath: string }>;
export type AssetRecord = Readonly<{
  id: string; kind: 'svg' | 'audio-loop' | 'audio-effect'; milestone: Milestone;
  status: 'planned' | 'ready'; sourcePaths: readonly string[]; runtimePath: string;
  author: string; sourceUrl?: string; permission: AssetPermission;
  attribution?: string; modifications?: string;
  width?: number; height?: number; sampleRate?: number; frameCount?: number;
  loopStartFrame?: number; loopEndFrame?: number; bytes?: number;
}>;
