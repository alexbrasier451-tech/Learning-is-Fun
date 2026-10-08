import { readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  AVATARS, COSMETICS, CREATIVE_CHOICES, DISCOVERIES, INITIAL_CREATIVE_STATE,
  INITIAL_WORLD_PROGRESS, QUESTS, SCENES, STORY_DISPLAYS, WORLD_RESULTS,
} from '../../src/experience/catalogue';
import type {
  AssetRecord, CreativeChoice, QuestDefinition, WorldProgress, WorldView,
} from '../../src/experience/types';
import type { QuestActivityBinding } from '../../src/learning/contracts';
import type { RewardState } from '../../src/rewards/contracts';
import type { AudioPreferenceIntent, LiveAudioGate } from '../../src/audio/contracts';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const register = JSON.parse(read('assets/asset-register.json'));
const assets: readonly AssetRecord[] = register.assets;
const artDirection = read('docs/art-direction.md');
const ids = (rows: readonly Readonly<{ id: string }>[]) => rows.map(row => row.id);
const roundTrip = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const unique = (values: readonly string[]) => new Set(values).size === values.length;
const appRelative = (path: string) => /^assets\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(svg|wav)$/.test(path);

describe('frozen experience catalogue', () => {
  it('pins exactly seven scenes and their delivered availability/themes', () => {
    expect(SCENES.map(s => [s.id, s.milestone, s.theme])).toEqual([
      ['village-green', 'M1', 'village'], ['river-bridge', 'M1', 'village'],
      ['whispering-library', 'M1', 'library'], ['market-square', 'M1', 'village'],
      ['tinkers-workshop', 'M2', 'village'], ['storywood-forest', 'M2', 'library'],
      ['clockwork-castle', 'M2', 'village'],
    ]);
    expect(unique(ids(SCENES))).toBe(true);
    expect(SCENES.every(s => s.title && assets.some(a => a.id === s.landmarkAssetId && a.milestone === s.milestone))).toBe(true);
  });

  it('pins every quest prerequisite, result and scene, including M2 revisits', () => {
    expect(QUESTS.map(q => [q.id, q.sceneId, q.milestone, [...q.requiresAll], [...q.resultIds]])).toEqual([
      ['Q1', 'river-bridge', 'M1', [], ['bridge-restored', 'route-to-library-market']],
      ['Q2', 'whispering-library', 'M1', ['Q1'], ['library-restored', 'market-instructions']],
      ['Q3', 'market-square', 'M1', ['Q2'], ['market-stocked', 'village-welcome', 'planter-available']],
      ['Q4', 'tinkers-workshop', 'M2', ['Q3'], ['sawmill-restored', 'invention-available']],
      ['Q5', 'village-green', 'M2', ['Q4'], ['garden-restored', 'forest-marker']],
      ['Q6', 'whispering-library', 'M2', ['Q3'], ['books-shelved', 'forest-story-map']],
      ['Q7', 'storywood-forest', 'M2', ['Q5', 'Q6'], ['forest-path-restored']],
      ['Q8', 'storywood-forest', 'M2', ['Q7'], ['castle-gear-recovered']],
      ['Q9', 'clockwork-castle', 'M2', ['Q8'], ['castle-clock-restored', 'castle-open']],
      ['Q10', 'village-green', 'M2', ['Q9'], ['kingdom-finale']],
    ]);
    const finished = new Set<string>();
    const visit = (id: string, visiting = new Set<string>()): void => {
      expect(visiting.has(id)).toBe(false);
      if (finished.has(id)) return;
      const quest = QUESTS.find(q => q.id === id) as QuestDefinition | undefined;
      expect(quest, `unresolved prerequisite ${id}`).toBeDefined();
      expect(SCENES.some(s => s.id === quest!.sceneId)).toBe(true);
      for (const parent of quest!.requiresAll) visit(parent, new Set([...visiting, id]));
      finished.add(id);
    };
    QUESTS.forEach(q => visit(q.id));
    expect(finished.size).toBe(10);
    expect(unique(ids(QUESTS))).toBe(true);
    expect(QUESTS.filter(q => q.requiresAll.length === 0).map(q => q.id)).toEqual(['Q1']);
  });

  it('gives all eighteen restoration facts exactly one producer and resolvable staged assets', () => {
    const declared = QUESTS.flatMap(q => [...q.resultIds]);
    expect(declared).toEqual(ids(WORLD_RESULTS));
    expect(unique(declared)).toBe(true);
    for (const result of WORLD_RESULTS) {
      const quest = QUESTS.find(q => q.id === result.questId)!;
      expect((quest.resultIds as readonly string[]).includes(result.id)).toBe(true);
      expect(result.meaning.length).toBeGreaterThan(20);
      expect(result.sceneIds.every(id => SCENES.some(s => s.id === id))).toBe(true);
      expect(result.assetIds.every(id => assets.some(a => a.id === id && (a.milestone === 'M1' || quest.milestone === 'M2')))).toBe(true);
    }
  });

  it('preserves finite free choices and the exact cosmetic associations without reward policy', () => {
    expect(COSMETICS.map(c => [c.id, c.target, c.milestone, c.entitlementId])).toEqual([
      ['scarf-leaf', 'scarfPatternId', 'M1', 'scarf-leaf'],
      ['planter-rim', 'planterRimId', 'M1', 'planter-rim'],
      ['home-trim', 'facadeTrimId', 'M2', 'home-trim'],
      ['scarf-star', 'scarfPatternId', 'M2', 'scarf-star'],
      ['scarf-wave', 'scarfPatternId', 'M2', 'scarf-wave'],
    ]);
    expect(ids(CREATIVE_CHOICES.scarfColours)).toEqual(['teal', 'amber', 'plum']);
    expect(ids(CREATIVE_CHOICES.flowerColours)).toEqual(['coral', 'gold', 'violet']);
    expect(ids(CREATIVE_CHOICES.sockets)).toEqual(['plot-1', 'plot-2', 'plot-3', 'plot-4', 'plot-5', 'plot-6']);
    expect(ids(CREATIVE_CHOICES.decorations)).toEqual(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond']);
    expect(CREATIVE_CHOICES.placementLimits).toEqual({
      M1: { socketIds: ['plot-1', 'plot-2', 'plot-3'], allowedDecorationIds: ['planter'], maxPlaced: 1, reusableTypes: false },
      M2: { socketIds: ['plot-1', 'plot-2', 'plot-3', 'plot-4', 'plot-5', 'plot-6'], allowedDecorationIds: ['planter', 'tree', 'bench', 'lantern', 'banner', 'pond'], maxPlaced: 6, reusableTypes: true },
    });
    for (const option of [...CREATIVE_CHOICES.scarfColours, ...CREATIVE_CHOICES.flowerColours, ...CREATIVE_CHOICES.decorations, ...COSMETICS]) {
      expect(assets.some(a => a.id === option.assetId && a.milestone === option.milestone)).toBe(true);
      expect(option.requiresAll.every(id => QUESTS.some(q => q.id === id))).toBe(true);
      expect(option).not.toHaveProperty('threshold');
    }
    expect([...CREATIVE_CHOICES.scarfColours, ...CREATIVE_CHOICES.flowerColours, ...CREATIVE_CHOICES.decorations].every(o => o.entitlementId === null)).toBe(true);
    expect(CREATIVE_CHOICES.decorations.every(o => o.requiresAll[0] === 'Q3')).toBe(true);
    expect(COSMETICS.find(c => c.id === 'planter-rim')!.requiresAll).toEqual(['Q3']);
    for (const [id, points] of [['scarf-leaf', 20], ['planter-rim', 60], ['home-trim', 150], ['scarf-star, scarf-wave', 300]]) {
      expect(artDirection).toMatch(new RegExp(`\\| ${id} \\|[^\\n]+\\| ${points}\\b`));
    }
  });

  it('derives shelf/invention facts and keeps discoveries transient with reused avatar art', () => {
    expect(STORY_DISPLAYS.map(d => [d.id, d.kind, [...d.requiresAll], d.milestone])).toEqual([
      ['spellbook', 'shelf', ['Q2'], 'M2'], ['forest-story-map', 'shelf', ['Q6'], 'M2'],
      ['forest-tale', 'shelf', ['Q7'], 'M2'], ['sawmill-model', 'invention', ['Q4'], 'M2'],
    ]);
    expect(STORY_DISPLAYS.every(d => assets.some(a => a.id === d.assetId))).toBe(true);
    expect(DISCOVERIES.length).toBe(7);
    expect(unique(ids(DISCOVERIES))).toBe(true);
    for (const scene of SCENES) {
      const discovery = DISCOVERIES.find(d => d.id === scene.discoveryId)!;
      expect([discovery.sceneId, discovery.milestone]).toEqual([scene.id, scene.milestone]);
      expect(assets.some(a => a.id === discovery.assetId)).toBe(true);
    }
    expect(ids(AVATARS)).toEqual(['pip', 'rowan', 'iona', 'nessa', 'flower', 'apple']);
    expect(AVATARS.every(a => a.milestone === 'M1' && assets.some(exported => exported.id === a.assetId && exported.milestone === 'M1'))).toBe(true);
    expect(Object.keys(INITIAL_WORLD_PROGRESS).sort()).toEqual(['completedQuestIds', 'completedStoryBindingIds']);
    expect(INITIAL_WORLD_PROGRESS).toEqual({ completedQuestIds: [], completedStoryBindingIds: [] });
  });
});

describe('pure consumer fixtures', () => {
  it('round-trips imported story/reward/appearance/projection DTOs without a state module', () => {
    const story: QuestActivityBinding = { bindingId: 'q1-bridge', questId: 'Q1', availability: 'M1', role: 'story', skillId: 'M01', taskIds: ['lif.math.bridge.r1.total-12'], mechanic: 'drag', responseKind: 'bridge', sourceBindingId: null };
    const progress: WorldProgress = { completedQuestIds: ['Q1'], completedStoryBindingIds: [story.bindingId] };
    const rewards: Pick<RewardState, 'entitlementIds'> = { entitlementIds: ['scarf-leaf'] };
    const choice: CreativeChoice = { kind: 'appearance', value: { ...INITIAL_CREATIVE_STATE, scarfPatternId: 'scarf-leaf' } };
    const view: WorldView = {
      sceneId: 'village-green', visibleAssetIds: ['scene-village-green', 'pip-idle'],
      completedQuestIds: progress.completedQuestIds, availableQuestIds: ['Q2'],
      hotspots: [
        { id: 'go-bridge', label: 'Visit the river bridge', intent: { kind: 'navigate', sceneId: 'river-bridge' } },
        { id: 'wake-library', label: 'Wake the library', intent: { kind: 'quest', questId: 'Q2' } },
        { id: 'practice', label: 'Choose practice', intent: { kind: 'practice', route: { kind: 'practice', mode: 'suggested' } } },
        { id: 'hall', label: 'Visit the Hall', intent: { kind: 'hall' } },
        { id: 'creative', label: 'Arrange your plot', intent: { kind: 'creative' } },
        { id: 'petal', label: 'Watch a petal drift', intent: { kind: 'discovery', discoveryId: 'discovery-green' } },
      ],
    };
    expect(roundTrip({ progress, rewards, choice, view })).toEqual({ progress, rewards, choice, view });
    expect(Object.values(choice.value.placements)).toEqual([null, null, null, null, null, null]);
    // A fixture is not a save validator, binding resolver, award or world projector.
    expect(progress).not.toHaveProperty('encounterHistory');
    expect(progress).not.toHaveProperty('bridgeRestored');
  });

  it('supports the synchronous gate fixture with the exact intent vocabulary', () => {
    const calls: AudioPreferenceIntent[] = [];
    const gate: LiveAudioGate = { applyLiveIntent(intent) { calls.push(intent); } };
    const intents: readonly AudioPreferenceIntent[] = [
      { kind: 'enable' }, { kind: 'exit-silence' }, { kind: 'silence-all' },
      { kind: 'channel-mute', channel: 'music', muted: true },
      { kind: 'channel-volume', channel: 'effects', volume: .5 },
    ];
    intents.forEach(intent => expect(gate.applyLiveIntent(intent)).toBeUndefined());
    expect(roundTrip(calls)).toEqual(intents);
  });

  it('keeps one-way type imports and excludes runtime/second-owner dependencies', () => {
    for (const path of ['src/experience/types.ts', 'src/experience/catalogue.ts', 'src/audio/contracts.ts']) {
      const code = read(path).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
      const imports = [...code.matchAll(/import[\s\S]*?from\s+['"]([^'"]+)['"]/g)];
      expect(imports.every(m => m[0].startsWith('import type'))).toBe(true);
      expect(imports.every(m => ['../learning/contracts', '../rewards/contracts', './types'].includes(m[1]))).toBe(true);
      expect(code).not.toMatch(/\b(window|document|indexedDB|localStorage|fetch|React|AudioContext|Date|createStateController)\b/);
      expect(code).not.toMatch(/\bInstallationAudioPreferences\b/);
    }
    expect(read('src/learning/contracts.ts')).not.toContain('../experience');
    expect(read('src/rewards/contracts.ts')).not.toContain('../experience');
  });
});

describe('per-export inventory lifecycle', () => {
  it('resolves all referenced assets with unique IDs and safe base-relative paths', () => {
    expect(assets.length).toBe(71);
    expect(unique(ids(assets))).toBe(true);
    expect(unique(assets.map(a => a.runtimePath))).toBe(true);
    expect(assets.every(a => appRelative(a.runtimePath))).toBe(true);
    for (const bad of ['/assets/apple.svg', 'https://example.test/apple.svg', 'assets/../apple.svg', 'assets//apple.svg', 'assets/%2e/apple.svg', 'assets/apple.svg?x=1']) expect(appRelative(bad)).toBe(false);
    for (const asset of assets) {
      expect(asset.sourcePaths.length).toBeGreaterThan(0);
      expect(asset.sourcePaths.every(p => /^(assets\/source\/(art\/(m1|m2)\/|audio\/)|tools\/render-audio\.mjs$)/.test(p) && !p.includes('..'))).toBe(true);
      expect(['planned', 'ready']).toContain(asset.status);
      if (asset.status === 'planned') {
        if (asset.permission.kind === 'original') expect(asset.permission.status).toBe('pending');
        for (const field of ['bytes', 'width', 'height', 'sampleRate', 'frameCount', 'loopStartFrame', 'loopEndFrame']) expect(asset).not.toHaveProperty(field);
        continue;
      }

      // Ready is an export lifecycle state, not independent art/audio acceptance.
      // Check concrete inventory evidence without rendering or decoding media.
      const existingFile = (path: string) => {
        expect(path).not.toMatch(/(?:^|\/)\.{1,2}(?:\/|$)|^[\/\\]|[\\:%?#\u0000-\u001f\u007f]/);
        const url = new URL(`../../${path}`, import.meta.url);
        expect(statSync(url).isFile(), `${asset.id}: ${path}`).toBe(true);
        const bytes = readFileSync(url);
        expect(bytes.length, `${asset.id}: empty ${path}`).toBeGreaterThan(0);
        return bytes;
      };
      asset.sourcePaths.forEach(existingFile);
      const runtime = existingFile(`public/${asset.runtimePath}`);
      expect(Number.isSafeInteger(asset.bytes)).toBe(true);
      expect(asset.bytes).toBe(runtime.length);
      expect(asset.author.trim()).not.toMatch(/^$|^unassigned\b/i);
      if (asset.permission.kind === 'original') {
        expect(asset.permission.status).toBe('confirmed');
        expect(asset.permission.holder.trim()).not.toBe('');
        expect(asset.permission.statement.trim()).not.toBe('');
        expect(asset.permission.evidencePath).toBeTruthy();
        existingFile(asset.permission.evidencePath!);
      } else {
        expect(asset.permission.kind).toBe('reused');
        expect(asset.permission.licence.trim()).not.toBe('');
        expect(asset.permission.version.trim()).not.toBe('');
        expect(asset.permission.licenceUrl).toMatch(/^https?:\/\//);
        existingFile(asset.permission.retainedLicencePath);
      }
      if (asset.kind === 'svg') {
        expect(Number.isSafeInteger(asset.width) && asset.width! > 0).toBe(true);
        expect(Number.isSafeInteger(asset.height) && asset.height! > 0).toBe(true);
        const root = runtime.toString('utf8').match(/<svg\b[^>]*>/)?.[0] ?? '';
        const viewBox = root.match(/\bviewBox=["']([^"']+)["']/)?.[1].trim().split(/[\s,]+/).map(Number);
        expect(viewBox, `${asset.id}: export viewBox`).toHaveLength(4);
        expect(viewBox!.every(Number.isFinite)).toBe(true);
        expect(viewBox!.slice(2)).toEqual([asset.width, asset.height]);
      } else {
        expect(asset.sampleRate).toBe(44100);
        expect(Number.isSafeInteger(asset.frameCount) && asset.frameCount! > 0).toBe(true);
        if (asset.kind === 'audio-loop') {
          expect(Number.isSafeInteger(asset.loopStartFrame) && asset.loopStartFrame! >= 0).toBe(true);
          expect(Number.isSafeInteger(asset.loopEndFrame)).toBe(true);
          expect(asset.loopEndFrame!).toBeGreaterThan(asset.loopStartFrame!);
          expect(asset.loopEndFrame!).toBeLessThanOrEqual(asset.frameCount!);
        }
      }
    }
  });

  it('retains exact audio outputs and staged M2 metadata, not fabricated readiness', () => {
    const audio = assets.filter(a => a.kind !== 'svg');
    expect(ids(audio)).toEqual(['village-loop', 'library-loop', 'pickup', 'placement', 'support', 'success', 'restoration']);
    expect(audio.map(a => a.runtimePath)).toEqual(['village-loop', 'library-loop', 'pickup', 'placement', 'support', 'success', 'restoration'].map(n => `assets/audio/${n}.wav`));
    expect(audio.every(a => a.milestone === 'M1')).toBe(true);
    expect(audio.filter(a => a.kind === 'audio-loop').length).toBe(2);
    expect(assets.filter(a => a.milestone === 'M2').length).toBe(28);
    expect(assets.filter(a => a.kind === 'svg' && a.milestone === 'M1').length).toBe(36);
  });

  it('describes ready measurements and exact rights fields in the embedded record schema', () => {
    const schema = register.recordSchema;
    expect(register.schemaVersion).toBe(1);
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.additionalProperties).toBe(false);
    expect(schema.required).toEqual(['id', 'kind', 'milestone', 'status', 'sourcePaths', 'runtimePath', 'author', 'permission']);
    expect(schema.allOf[0].then.required).toEqual(['bytes']);
    expect(schema.allOf[0].then.allOf.map((r: { then: { required?: string[] } }) => r.then.required ?? [])).toEqual([
      ['width', 'height'], ['sampleRate', 'frameCount'], ['loopStartFrame', 'loopEndFrame'], [],
    ]);
    expect(schema.$defs.permission.oneOf[1].required).toEqual(['kind', 'licence', 'version', 'licenceUrl', 'retainedLicencePath']);
    expect(register.readyChecks.join(' ')).toContain('loopEndFrame <= frameCount');
    expect(register.readyChecks.join(' ')).toContain('exclusive end');
  });
});

const luminance = (hex: string) => {
  const channels = hex.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255)
    .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
};
const contrast = (a: string, b: string) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
describe('concrete visual reference contract', () => {
  it.each([
    ['ink', 'paper', '#263D38', '#FFF6E5', 4.5, '10.83'],
    ['secondary', 'paper', '#52645F', '#FFF6E5', 4.5, '5.85'],
    ['paper', 'teal', '#FFF6E5', '#24665E', 4.5, '6.24'],
    ['ink', 'amber', '#263D38', '#F4B85A', 4.5, '6.56'],
    ['plum', 'paper', '#70536F', '#FFF6E5', 4.5, '6.20'],
    ['forest', 'success-paper', '#244D42', '#E1EEE2', 4.5, '7.91'],
    ['ink', 'support-paper', '#263D38', '#F8E6DC', 4.5, '9.60'],
    ['teal', 'amber', '#24665E', '#F4B85A', 3, '3.78'],
  ])('%s / %s meets its target and matches the measured brief', (nameA, nameB, a, b, minimum, expected) => {
    expect(contrast(a as string, b as string)).toBeGreaterThanOrEqual(minimum as number);
    expect(contrast(a as string, b as string).toFixed(2)).toBe(expected);
    expect(artDirection).toContain(`| ${nameA} / ${nameB} | ${expected}:1 |`);
    expect(artDirection).toContain(a as string);
    expect(artDirection).toContain(b as string);
  });

  it('retains a self-contained reference and explicit producer acceptance boundaries', () => {
    const svg = read('docs/art-direction-reference.svg');
    expect(svg).not.toMatch(/<script|<foreignObject|href="https?:|font-size="(?:[0-9]|1[0-5])"/);
    expect(svg).toContain('id="ref-background"');
    expect(svg).toContain('id="ref-middle"');
    expect(svg).toContain('id="ref-foreground"');
    for (const text of ['Silence all', 'Selected', 'Focus: Check', 'Bridge restored', 'Try another arrangement']) expect(svg).toContain(text);
    for (const target of ['44×44px', '200%', '18px', '16px', 'tap/click', 'Move before/after', 'Escape/', 'localService', 'WP04-05A', 'WP03', 'DEC-005', 'not authentication', 'WP06']) expect(artDirection).toContain(target);
    expect(assets.some(a => a.runtimePath.includes('reference'))).toBe(false);
  });
});

/** Compile-only negative probes. Never invoked or used as runtime validation. */
function readonlyContracts(progress: WorldProgress, choice: CreativeChoice): void {
  // @ts-expect-error permanent progress is readonly
  progress.completedQuestIds.push('Q1');
  // @ts-expect-error appearance replacement is readonly
  choice.value.placements['plot-1'] = 'tree';
  // @ts-expect-error scene identity is finite
  const wrongScene: WorldView['sceneId'] = 'unknown-place';
  // @ts-expect-error music/effects are the only channel preference intents
  const wrongChannel: AudioPreferenceIntent = { kind: 'channel-mute', channel: 'speech', muted: true };
  void wrongScene; void wrongChannel;
}
void readonlyContracts;
