/** Measured offline PCM exports. Resolve path with platform assetUrl at use.
 * Loop end is exclusive; Web Audio seconds = frame / sampleRate.
 * Ready source files do not imply acoustic or published-playback acceptance.
 */
export type AudioAsset = Readonly<{
  assetId: string;
  path: string;
  kind: 'loop' | 'effect';
  sampleRate: number;
  frameCount: number;
  bytes: number;
  loopStartFrame?: number;
  loopEndFrame?: number;
}>;

export const AUDIO_ASSETS = {
  village: { assetId: 'village-loop', path: 'assets/audio/village-loop.wav', kind: 'loop',
    sampleRate: 44100, frameCount: 3086846, bytes: 6173736, loopStartFrame: 0, loopEndFrame: 3086846 },
  library: { assetId: 'library-loop', path: 'assets/audio/library-loop.wav', kind: 'loop',
    sampleRate: 44100, frameCount: 3386880, bytes: 6773804, loopStartFrame: 0, loopEndFrame: 3386880 },
  pickup: { assetId: 'pickup', path: 'assets/audio/pickup.wav', kind: 'effect',
    sampleRate: 44100, frameCount: 37485, bytes: 75014 },
  placement: { assetId: 'placement', path: 'assets/audio/placement.wav', kind: 'effect',
    sampleRate: 44100, frameCount: 35280, bytes: 70604 },
  support: { assetId: 'support', path: 'assets/audio/support.wav', kind: 'effect',
    sampleRate: 44100, frameCount: 72765, bytes: 145574 },
  success: { assetId: 'success', path: 'assets/audio/success.wav', kind: 'effect',
    sampleRate: 44100, frameCount: 94815, bytes: 189674 },
  restoration: { assetId: 'restoration', path: 'assets/audio/restoration.wav', kind: 'effect',
    sampleRate: 44100, frameCount: 198450, bytes: 396944 },
} as const satisfies Readonly<Record<'village' | 'library' | 'pickup' | 'placement' | 'support' | 'success' | 'restoration', AudioAsset>>;
