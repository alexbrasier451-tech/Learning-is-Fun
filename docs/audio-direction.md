# Soundtrack direction — A+B variation candidate

11 October 2026. Keep the approved A tracks and gains. Add one complete Sleep Talking B period to each theme with half-second complementary raised-cosine A→B and B→A transitions. New arrangements remain **acoustically UNVERIFIED**. Prior A approval is historical; final integrated listening is deferred.

| Theme | A / gain | B / gain | Frames | Seconds | Runtime bytes |
|---|---|---|---:|---:|---:|
| Village | Market on the Sea / 0.35 | Sleep Talking / 0.40 | 4,397,498 | 99.7165079365 | 8,795,040 |
| Library | Sunset Walk / 0.16 | Sleep Talking / 0.25 | 4,697,532 | 106.52 | 9,395,108 |

Village serves green/bridge/market and later workshop/castle; library serves library/forest. No theme-switch, preference or runtime controller edits are included.

The complete A periods are 3,086,846 and 3,386,880 frames. Village's A uses retained decoded original frames [3,086,846, 6,173,692); library uses the full original [0, 3,386,880). B uses full [0, 1,354,752), exactly 30.72 seconds. Every period is traversed without speed/pitch change. Fade endpoints may receive zero weight.

All runtime files remain mono 44.1 kHz PCM16, 44-byte headers, with exclusive loop end equal to frame count. A starts at output 0; B starts at A length minus 22,050 frames; B tail wraps into A head. Total = A + B − 44,100 frames. A interiors [22,050, 3,064,796) village and [22,050, 3,364,830) library are exactly unchanged. The renderer's loop maximum is 110 seconds; effect maximum remains 90 and all other guards remain.

| Transition | Village output frames | Library output frames |
|---|---|---|
| A→B | [3,064,796, 3,086,846) | [3,364,830, 3,386,880) |
| B→A | [0, 22,050) | [0, 22,050) |

Wrap steps are 17 / 11 PCM units; peaks are 7,526 / 4,395; whole-file RMS is −31.278 / −35.605 dBFS. These measurements do not establish musical fit or inaudible transitions. Detailed windows, source checks and unchanged A/B interiors are in [variation-checks.json](../assets/source/audio/variation-checks.json).

The five cue WAVs and metadata remain unchanged. Seven runtime files total **19,067,958 bytes**; largest is **9,395,108 bytes**. Both themes are below 10 MiB individually; WP01 owns the separate cache-size contract and integration. Decoded float32 theme samples total **36,380,120 bytes**, before overhead. No cache/config change is included.

Keep initial gains music 25%, effects 50%. Conservative source peak bound for both themes plus four loudest effect voices is 0.954376220703125 at unity, 0.38623809814453125 at default gains. Speech, resampler overshoot and device processing are excluded. Integrated voice limiting, ducking, mute restoration and published listening remain downstream responsibilities.

## Rights and review

Village contains separately licensed CC BY 3.0 and CC0 components; library contains two CC0 components. Use [village rights](../assets/source/audio/licensed/village-variation-RIGHTS.md) and [library rights](../assets/source/audio/licensed/library-variation-RIGHTS.md) for exact complete credits, changes and retained source evidence. Composite headings and correctly labelled primary links remain shell-owner work.

[Audition page](../assets/source/audio/audition.html) includes full themes/cues, a 51-second preview crossing A→B at 12–12.5 / 38–38.5 seconds, and a 143.9-second reel presenting each transition type twice per theme, then cues alone/mixed. Review derivatives have outer ramps and labelled pauses; runtime files do not gain padding. They are prepared for later integrated review, with no interim human audition requested.

## Reproduction

Use Node v24.19.0 from candidate root:

    node tools/render-audio.mjs --check
    node assets/source/audio/verify-variation.mjs
    node assets/source/audio/verify-audio.mjs
    node assets/source/audio/check-browser.mjs
    node assets/source/audio/licensed/decode-sources.mjs

Browser scripts accept AUDIO_QA_PACKAGE_JSON pointing to existing dependency package.json; TEMP/TMP were private for this candidate. No dependency install or main build/cache write is needed. Rebuild source review derivatives with verify-audio.mjs --write-evidence. Original MP3 master checking uses the pinned Chromium version. See [new handoff](work-package/execution/MUSIC-VARIATION-HANDOFF.md) for executed checks, exact file list and outstanding integration; prior handoffs remain intact.
