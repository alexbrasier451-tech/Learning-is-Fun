/** Pure synchronous gating port. WP04 owns the full saved preference snapshot,
 * requested generations, queue and retries. WP02-05A supplies real playback.
 * Gate before persistence; failed/delayed saves cannot undo live silence. */
export type AudioPreferenceIntent =
  | Readonly<{ kind: 'enable' | 'exit-silence' | 'silence-all' }>
  | Readonly<{ kind: 'channel-mute'; channel: 'music' | 'effects'; muted: boolean }>
  | Readonly<{ kind: 'channel-volume'; channel: 'music' | 'effects'; volume: number }>;
/** Volume is finite in [0,1], validated by the preference/runtime owners.
 * Exit-silence preserves channel mutes/volumes; first use requires enable.
 * Silence-all cancels music, effects and speech immediately. Only English
 * localService voices are permitted later; absent voices retain visible text. */
export type LiveAudioGate = Readonly<{ applyLiveIntent(intent: AudioPreferenceIntent): void }>;
