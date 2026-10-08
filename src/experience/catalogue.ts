import type {
  AvatarDefinition, CosmeticDefinition, CreativeOption, CreativeState, DecorationId,
  DerivedStoryDisplay, QuestDefinition, SceneDefinition, SocketId, WorldProgress,
  WorldResultDefinition,
} from './types';

/** Immutable compatibility IDs. M2 rows are staged contracts, not M1 playability. */
export const SCENES = [
  { id: 'village-green', title: 'Village Green', milestone: 'M1', landmarkAssetId: 'scene-village-green', theme: 'village', discoveryId: 'discovery-green' },
  { id: 'river-bridge', title: 'River Bridge', milestone: 'M1', landmarkAssetId: 'scene-river-bridge', theme: 'village', discoveryId: 'discovery-bridge' },
  { id: 'whispering-library', title: 'Whispering Library', milestone: 'M1', landmarkAssetId: 'scene-whispering-library', theme: 'library', discoveryId: 'discovery-library' },
  { id: 'market-square', title: 'Market Square', milestone: 'M1', landmarkAssetId: 'scene-market-square', theme: 'village', discoveryId: 'discovery-market' },
  { id: 'tinkers-workshop', title: "Tinker's Workshop", milestone: 'M2', landmarkAssetId: 'scene-tinkers-workshop', theme: 'village', discoveryId: 'discovery-workshop' },
  { id: 'storywood-forest', title: 'Storywood Forest', milestone: 'M2', landmarkAssetId: 'scene-storywood-forest', theme: 'library', discoveryId: 'discovery-forest' },
  { id: 'clockwork-castle', title: 'Clockwork Castle', milestone: 'M2', landmarkAssetId: 'scene-clockwork-castle', theme: 'village', discoveryId: 'discovery-castle' },
] as const satisfies readonly SceneDefinition[];

export const QUESTS = [
  { id: 'Q1', sceneId: 'river-bridge', milestone: 'M1', requiresAll: [], resultIds: ['bridge-restored', 'route-to-library-market'] },
  { id: 'Q2', sceneId: 'whispering-library', milestone: 'M1', requiresAll: ['Q1'], resultIds: ['library-restored', 'market-instructions'] },
  { id: 'Q3', sceneId: 'market-square', milestone: 'M1', requiresAll: ['Q2'], resultIds: ['market-stocked', 'village-welcome', 'planter-available'] },
  { id: 'Q4', sceneId: 'tinkers-workshop', milestone: 'M2', requiresAll: ['Q3'], resultIds: ['sawmill-restored', 'invention-available'] },
  { id: 'Q5', sceneId: 'village-green', milestone: 'M2', requiresAll: ['Q4'], resultIds: ['garden-restored', 'forest-marker'] },
  { id: 'Q6', sceneId: 'whispering-library', milestone: 'M2', requiresAll: ['Q3'], resultIds: ['books-shelved', 'forest-story-map'] },
  { id: 'Q7', sceneId: 'storywood-forest', milestone: 'M2', requiresAll: ['Q5', 'Q6'], resultIds: ['forest-path-restored'] },
  { id: 'Q8', sceneId: 'storywood-forest', milestone: 'M2', requiresAll: ['Q7'], resultIds: ['castle-gear-recovered'] },
  { id: 'Q9', sceneId: 'clockwork-castle', milestone: 'M2', requiresAll: ['Q8'], resultIds: ['castle-clock-restored', 'castle-open'] },
  { id: 'Q10', sceneId: 'village-green', milestone: 'M2', requiresAll: ['Q9'], resultIds: ['kingdom-finale'] },
] as const satisfies readonly QuestDefinition[];

/** Result facts are derived ONLY from committed quest membership. These are
 * descriptions for projection, never independent saved flags or mutations. */
export const WORLD_RESULTS = [
  { id: 'bridge-restored', questId: 'Q1', sceneIds: ['river-bridge'], assetIds: ['scene-river-bridge'], meaning: 'Broken timbers become a usable bridge.' },
  { id: 'route-to-library-market', questId: 'Q1', sceneIds: ['river-bridge', 'whispering-library', 'market-square'], assetIds: ['world-map'], meaning: 'Library and market can be explored; activity prerequisites still apply.' },
  { id: 'library-restored', questId: 'Q2', sceneIds: ['whispering-library'], assetIds: ['scene-whispering-library', 'spellbook'], meaning: 'Windows light, door opens and the spellbook unfurls.' },
  { id: 'market-instructions', questId: 'Q2', sceneIds: ['whispering-library', 'market-square'], assetIds: ['market-instructions'], meaning: 'Recovered instructions lead to Nessa.' },
  { id: 'market-stocked', questId: 'Q3', sceneIds: ['market-square'], assetIds: ['scene-market-square'], meaning: 'The empty stall becomes stocked.' },
  { id: 'village-welcome', questId: 'Q3', sceneIds: ['village-green'], assetIds: ['scene-village-green'], meaning: 'Bunting and a skippable welcome mark the M1 ending.' },
  { id: 'planter-available', questId: 'Q3', sceneIds: ['village-green'], assetIds: ['decoration-planter'], meaning: 'Free planter and flower choices become available.' },
  { id: 'sawmill-restored', questId: 'Q4', sceneIds: ['tinkers-workshop'], assetIds: ['scene-tinkers-workshop'], meaning: 'The sawmill works and workshop supplies are restored.' },
  { id: 'invention-available', questId: 'Q4', sceneIds: ['tinkers-workshop'], assetIds: ['sawmill-model'], meaning: 'One sawmill-model invention is displayed; no inventory award.' },
  { id: 'garden-restored', questId: 'Q5', sceneIds: ['village-green'], assetIds: ['green-garden'], meaning: 'The village garden revives.' },
  { id: 'forest-marker', questId: 'Q5', sceneIds: ['village-green'], assetIds: ['forest-marker'], meaning: 'A grown route marker points toward Storywood.' },
  { id: 'books-shelved', questId: 'Q6', sceneIds: ['whispering-library'], assetIds: ['library-shelf'], meaning: 'Recovered stories occupy the shelf.' },
  { id: 'forest-story-map', questId: 'Q6', sceneIds: ['whispering-library'], assetIds: ['forest-story-map'], meaning: 'The assembled story map supplies the forest handoff.' },
  { id: 'forest-path-restored', questId: 'Q7', sceneIds: ['storywood-forest'], assetIds: ['scene-storywood-forest', 'forest-tale'], meaning: 'The ordered tale reveals a woodland path.' },
  { id: 'castle-gear-recovered', questId: 'Q8', sceneIds: ['storywood-forest'], assetIds: ['castle-gear'], meaning: 'Following the hidden map recovers the missing castle gear.' },
  { id: 'castle-clock-restored', questId: 'Q9', sceneIds: ['clockwork-castle'], assetIds: ['scene-clockwork-castle'], meaning: 'The clock runs after committed repair.' },
  { id: 'castle-open', questId: 'Q9', sceneIds: ['clockwork-castle'], assetIds: ['scene-clockwork-castle'], meaning: 'The castle entrance opens.' },
  { id: 'kingdom-finale', questId: 'Q10', sceneIds: ['village-green', 'clockwork-castle'], assetIds: ['green-finale', 'castle-finale'], meaning: 'Green and castle enter their final state, independent of weekly results.' },
] as const satisfies readonly WorldResultDefinition[];

/** Entitlement strings equal their choice IDs, but are separate semantic fields.
 * WP05 owns 20/60/150/300 derivation; no point arithmetic or gates occur here. */
export const COSMETICS = [
  { id: 'scarf-leaf', label: 'Leaf scarf pattern', target: 'scarfPatternId', assetId: 'scarf-leaf', milestone: 'M1', entitlementId: 'scarf-leaf', requiresAll: [] },
  { id: 'planter-rim', label: 'Decorated planter rim', target: 'planterRimId', assetId: 'planter-rim', milestone: 'M1', entitlementId: 'planter-rim', requiresAll: ['Q3'] },
  { id: 'home-trim', label: 'Home facade trim', target: 'facadeTrimId', assetId: 'home-trim', milestone: 'M2', entitlementId: 'home-trim', requiresAll: [] },
  { id: 'scarf-star', label: 'Star scarf pattern', target: 'scarfPatternId', assetId: 'scarf-star', milestone: 'M2', entitlementId: 'scarf-star', requiresAll: [] },
  { id: 'scarf-wave', label: 'Wave scarf pattern', target: 'scarfPatternId', assetId: 'scarf-wave', milestone: 'M2', entitlementId: 'scarf-wave', requiresAll: [] },
] as const satisfies readonly CosmeticDefinition[];

export const CREATIVE_CHOICES = {
  scarfColours: [
    { id: 'teal', label: 'Teal', target: 'scarfColourId', assetId: 'scarf-teal', milestone: 'M1', entitlementId: null, requiresAll: [] },
    { id: 'amber', label: 'Amber', target: 'scarfColourId', assetId: 'scarf-amber', milestone: 'M1', entitlementId: null, requiresAll: [] },
    { id: 'plum', label: 'Plum', target: 'scarfColourId', assetId: 'scarf-plum', milestone: 'M1', entitlementId: null, requiresAll: [] },
  ] as const satisfies readonly CreativeOption[],
  flowerColours: [
    { id: 'coral', label: 'Coral flowers', target: 'flowerColourId', assetId: 'flowers-coral', milestone: 'M1', entitlementId: null, requiresAll: ['Q3'] },
    { id: 'gold', label: 'Gold flowers', target: 'flowerColourId', assetId: 'flowers-gold', milestone: 'M1', entitlementId: null, requiresAll: ['Q3'] },
    { id: 'violet', label: 'Violet flowers', target: 'flowerColourId', assetId: 'flowers-violet', milestone: 'M1', entitlementId: null, requiresAll: ['Q3'] },
  ] as const satisfies readonly CreativeOption[],
  sockets: [
    { id: 'plot-1', milestone: 'M1' }, { id: 'plot-2', milestone: 'M1' }, { id: 'plot-3', milestone: 'M1' },
    { id: 'plot-4', milestone: 'M2' }, { id: 'plot-5', milestone: 'M2' }, { id: 'plot-6', milestone: 'M2' },
  ] as const satisfies readonly Readonly<{ id: SocketId; milestone: 'M1' | 'M2' }>[],
  decorations: [
    { id: 'planter', label: 'Flower planter', target: 'placements', assetId: 'decoration-planter', milestone: 'M1', entitlementId: null, requiresAll: ['Q3'] },
    { id: 'tree', label: 'Little tree', target: 'placements', assetId: 'decoration-tree', milestone: 'M2', entitlementId: null, requiresAll: ['Q3'] },
    { id: 'bench', label: 'Curved bench', target: 'placements', assetId: 'decoration-bench', milestone: 'M2', entitlementId: null, requiresAll: ['Q3'] },
    { id: 'lantern', label: 'Warm lantern', target: 'placements', assetId: 'decoration-lantern', milestone: 'M2', entitlementId: null, requiresAll: ['Q3'] },
    { id: 'banner', label: 'Village banner', target: 'placements', assetId: 'decoration-banner', milestone: 'M2', entitlementId: null, requiresAll: ['Q3'] },
    { id: 'pond', label: 'Small pond', target: 'placements', assetId: 'decoration-pond', milestone: 'M2', entitlementId: null, requiresAll: ['Q3'] },
  ] as const satisfies readonly (CreativeOption & Readonly<{ id: DecorationId }>)[],
  cosmetics: COSMETICS,
  placementLimits: {
    M1: { socketIds: ['plot-1', 'plot-2', 'plot-3'], allowedDecorationIds: ['planter'], maxPlaced: 1, reusableTypes: false },
    M2: { socketIds: ['plot-1', 'plot-2', 'plot-3', 'plot-4', 'plot-5', 'plot-6'], allowedDecorationIds: ['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'], maxPlaced: 6, reusableTypes: true },
  },
} as const;

export const INITIAL_WORLD_PROGRESS = {
  completedQuestIds: [], completedStoryBindingIds: [],
} as const satisfies WorldProgress;
/** Unavailable sockets still exist as null keys for a complete atomic replacement.
 * Pre-Q3 flower selection is dormant; no planter is initially placed. */
export const INITIAL_CREATIVE_STATE = {
  scarfColourId: 'teal', scarfPatternId: null, flowerColourId: 'coral',
  planterRimId: null, facadeTrimId: null,
  placements: { 'plot-1': null, 'plot-2': null, 'plot-3': null, 'plot-4': null, 'plot-5': null, 'plot-6': null },
} as const satisfies CreativeState;

export const STORY_DISPLAYS = [
  { id: 'spellbook', kind: 'shelf', milestone: 'M2', requiresAll: ['Q2'], assetId: 'spellbook' },
  { id: 'forest-story-map', kind: 'shelf', milestone: 'M2', requiresAll: ['Q6'], assetId: 'forest-story-map' },
  { id: 'forest-tale', kind: 'shelf', milestone: 'M2', requiresAll: ['Q7'], assetId: 'forest-tale' },
  { id: 'sawmill-model', kind: 'invention', milestone: 'M2', requiresAll: ['Q4'], assetId: 'sawmill-model' },
] as const satisfies readonly DerivedStoryDisplay[];

export const DISCOVERIES = [
  { id: 'discovery-green', sceneId: 'village-green', milestone: 'M1', assetId: 'flowers-coral', label: 'Watch a petal drift' },
  { id: 'discovery-bridge', sceneId: 'river-bridge', milestone: 'M1', assetId: 'river-fish', label: 'Spot the river fish' },
  { id: 'discovery-library', sceneId: 'whispering-library', milestone: 'M1', assetId: 'spellbook', label: 'Watch a book flutter' },
  { id: 'discovery-market', sceneId: 'market-square', milestone: 'M1', assetId: 'apple', label: 'Peek beneath the apple crate' },
  { id: 'discovery-workshop', sceneId: 'tinkers-workshop', milestone: 'M2', assetId: 'sawmill-model', label: 'Inspect the little invention' },
  { id: 'discovery-forest', sceneId: 'storywood-forest', milestone: 'M2', assetId: 'forest-moth', label: 'Spot a woodland moth' },
  { id: 'discovery-castle', sceneId: 'clockwork-castle', milestone: 'M2', assetId: 'castle-gear', label: 'Watch the little gear turn' },
] as const;

/** Chooser crops reuse the M1 cast/props; no separate avatar image exports. */
export const AVATARS = [
  { id: 'pip', label: 'Pip the leaf-tailed fox', assetId: 'pip-idle', milestone: 'M1' },
  { id: 'rowan', label: 'Rowan the village maker', assetId: 'rowan', milestone: 'M1' },
  { id: 'iona', label: 'Iona the librarian', assetId: 'iona', milestone: 'M1' },
  { id: 'nessa', label: 'Nessa the merchant', assetId: 'nessa', milestone: 'M1' },
  { id: 'flower', label: 'A coral flower', assetId: 'flowers-coral', milestone: 'M1' },
  { id: 'apple', label: 'A market apple', assetId: 'apple', milestone: 'M1' },
] as const satisfies readonly AvatarDefinition[];
