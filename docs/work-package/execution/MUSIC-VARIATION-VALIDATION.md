# Music variation — independent producer validation

11 October 2026. **TECHNICAL PRODUCER PASS for the frozen private A+B candidate.**
No producer correction is required by this review. This supports coordinated
integration under [the human continuation authority](CONTINUATION-AND-MUSIC-VARIATION.md)
and [accepted plan](MUSIC-VARIATION-PLAN-VALIDATION.md). New A+B acoustic acceptance
remains **UNVERIFIED**. This is not a production, offline-readiness or final-release
acceptance, and does not confer a register-write lease.

## Frozen identity and scope

Candidate root:
`C:/Users/alexb/.codex/visualizations/2026/10/08/01a11de7-98e9-7c21-9cb6-d174fabaa1bf/music-variation-6b583495/candidate`.
Base: `6b5834953b56b4f2ce33c099700b1090805b6144`.

Parent `candidate-files.json` SHA-256:
`fd5a4f0455a73e3673ed506cd864f881fe77d2288307fba0cb83002f5539c185`.
Parent `base-files.json` SHA-256:
`f7a6d01b82c0651d542de4849f33baf714620070ab52199c8e4c419a01062fc6`.
Candidate handoff SHA-256:
`aff835d030830a9bd7a27ca0d9d279732cf702d563575ebf08c5bd57a6169544`.

Independently enumerated and hashed all 659 candidate files against the 644-file
base inventory: exactly the declared 32 changed/added paths, 627 unchanged base
files, 17 modified base files, 15 additions and no deletions. Every frozen path's
byte count and SHA-256 matches the manifest. Runtime controller, controls,
preferences, shell, cache configuration, schema, other media and historical
handoffs are unchanged. Exactly two existing theme files and keys remain.

Read the relevant original files directly from `base.zip`, confirming their
bytes against the base hashes. Parsed register comparison confirms only
`village-loop` and `library-loop` changed: the other 70 rows, ordering and
top-level contract are preserved. Reversing only the two themes' measured
frame/byte values in `src/audio/catalogue.ts` reproduces its exact base text.
Controller must integrate these two rows into the then-current register, not
overwrite subsequent art work with this whole private register.

## Source, rights and baseline preservation

The retained Sleep Talking creator page names KiluaBoy, explicitly identifies
CC0 and links the exact 5,419,154-byte WAV. Its acquisition manifest covers the
original WAV, creator HTML and full CC0 legal-code HTML. All new and original
acquisition entries pass exact byte-length and SHA-256 checks. Existing raw
creator/licence HTML, Jonathan Shaw evidence/PDF, source recordings and selected
float master also remain identical to the base. No raw-response normalization
was accepted. This review checked retained acquisition evidence; it did not
claim a fresh network acquisition.

Sleep Talking source SHA-256:
`790cfd5ae94db0460031cf81f653758c921f4a37aec284251767d8026099130d`.
The complete stereo PCM16 data contains 1,354,752 frames at 44,100 Hz, exactly
30.72 seconds. Both recipes use the whole period once, with mono downmix and
declared gains of 0.40 village / 0.25 library.

Both A recipes are semantically identical to their approved originals, including
source ranges and gains. The retained A-only recipes, WAVs and measurements
are byte-identical to their corresponding base files. Approved WAV hashes:

- Village: `d7c1512a10eec6c26cd351136ed299f5ac0d4d58e49c2b99361fc2cd9cf26d0a`.
- Library: `3ca0ea4bfd638d6fd2ab3d98b305c90c65ca0cbecbbd1713ecacb555d0bb8e64`.

All five cues and their source/metadata remain unchanged. Verified cue hashes:

| Cue | SHA-256 |
|---|---|
| pickup | `c5f6ee2b39abed7c1e773925e45ab0ef1137277fd658563526c5fdb41e7db1ad` |
| placement | `479c83f90df5e741808783ba60903fa08ead34f1c6fa355ce1ccb92c2a8699ba` |
| support | `cd01e9f619d909c75fcf9ce6ca4192c1bdfa94d30b2a2291cc670908cc079427` |
| success | `b78976b285f354b20c34fdd81997244266b5057d05e9813a7edc7f0b53357630` |
| restoration | `29b0dbdff31a83bccc9d3b22e3848e834603e20ea53cb15d59a2f804eb92d7b2` |

The two register rows and retained component-rights documents implement the
accepted representation: village's CC BY 3.0 tuple is explicitly scoped to
Market on the Sea, while Sleep Talking retains CC0; library names both CC0
recordings. Authors, component source/licence URLs, modification ranges, gains
and both overlaps are disclosed. No blanket village CC0 claim, invented
combined licence, endorsement or schema expansion was introduced. Original
rights are retained. This is conformity to the already-reviewed rights plan.

The MP3 decoder now compares generated metadata as parsed JSON, so checkout
CRLF/LF differences do not invalidate identical values. Decoded master bytes,
original MP3 hash and acquisition-response bytes still require exact equality;
the adjustment does not relax raw evidence integrity.

## Independent PCM and transition verification

| Theme | Frames / exclusive end | Seconds | Bytes | Runtime SHA-256 |
|---|---:|---:|---:|---|
| Village | 4,397,498 | 99.7165079365 | 8,795,040 | `5506aca739cb60aa265ae32823f4444e966fb6179ef27416d271c7e0de55e6a6` |
| Library | 4,697,532 | 106.52 | 9,395,108 | `cfb28bbd7ac9c6b9241873df2a05691dff6c4387d2df916d79102eccf015acd4` |

Both exports are mono 44.1 kHz PCM16 with exact 44-byte headers, start frame 0
and exclusive end equal to frame count. Catalogue/register measurements agree.
Each arrangement is A + B minus two 22,050-frame overlaps: one full A and one
full B are traversed without pitch/speed change or inserted padding. Envelope
endpoints can receive zero weight; the period-completeness claim does not mean
every endpoint sample is audible at its original gain.

Independently reconstructed **all 9,095,030 output samples** using separate
piecewise source-to-output arithmetic, without calling the candidate renderer:
A-only interior, complementary raised-cosine A→B, B-only interior and wrapped
B→A. Every quantized sample matched. This checks the full B contribution and
both overlap maps, not just renderer self-consistency.

| Region | Village output frames | Library output frames |
|---|---|---|
| Unchanged A interior | [22,050, 3,064,796) | [22,050, 3,364,830) |
| A→B overlap | [3,064,796, 3,086,846) | [3,364,830, 3,386,880) |
| B→A overlap | [0, 22,050) | [0, 22,050) |

B source interior [22,050, 1,332,702) also matches the declared downmix/gain.
Wrap steps are 17 / 11 PCM units. These are numerical transition checks, not
evidence of harmonic compatibility, natural cadence or inaudible joins.

Independently reran, read-only, with Node v24.19.0:

- `node assets/source/audio/verify-variation.mjs`: PASS, including preservation,
  source hashes, interior comparisons, transition measurements and rejection of
  loops above 110 seconds, below 60 seconds, wrong sample rate and invalid
  exclusive endpoint. Effects above 90 seconds remain rejected.
- `node assets/source/audio/verify-audio.mjs`: PASS. This invokes
  `renderAll({check:true})` and reproduces all seven runtime WAVs byte-for-byte;
  it also checks on-disk headers, metadata, peaks, mix bound and all generated
  review derivatives against fresh results.
- Independent inventory, base-ZIP semantic comparison and complete piecewise
  PCM reconstruction described above: PASS.

Seven runtime files total 19,067,958 bytes; largest is 9,395,108 bytes. Combined
decoded float32 theme samples require 36,380,120 bytes before overhead. The
conservative source peak bound is 0.954376220703125 for both themes plus four
loudest cue voices at unity, 0.38623809814453125 at default gains. Speech,
resampler overshoot and device processing are excluded.

## Browser evidence, review media and remaining integration

Inspected the native-check script and frozen Chromium 156.0.8078.4 receipt.
All seven reported rates, frame counts, durations and mono channels match the
current files; decoded peaks agree within PCM quantization. Nine source-page
players report paused, no autoplay/error and expected initial gains. The
retained original-MP3 decode recipe/evidence still checks the selected float
master exactly. These browser results are **producer evidence inspected for
consistency**, not a newly executed independent browser session or hearing.

Fresh verification reproduces the 143.9-second join/cue reel and 51-second
preview. The reel presents both transition types twice per theme, then cues
alone/mixed; the preview crosses A→B. Derivative outer ramps and labelled pauses
do not modify runtime WAVs. The page exposes complete themes and cues, but
excerpts and decode success cannot establish complete-cycle musical fit,
speech masking, fatigue or level comfort. No interim human audition was requested.

Required downstream work is concrete and unchanged from the accepted plan:

1. **WP01:** candidate `vite.config.ts:47` still has the 8 MiB cap. Both themes
   exceed it. Raise only the permitted per-file cap to 10 MiB (10,485,760 bytes)
   and prove both actual files are precached, offline reload works and omitted
   assets cannot produce Ready. This review supplies no such integration proof.
2. **Shell owner:** candidate `AppShell.tsx:213–214` still uses single-track
   headings and links the entire village author to Jonathan Shaw. Before
   publication, name both recordings, render combined authors plainly or link
   each correctly, label primary-component links and retain full readable
   attribution/modification text with secondary source/licence URLs.
3. **Controller:** integrate only the reviewed two-row audio delta under the
   exclusive register lease. Preserve raw source/licence bytes through checkout
   and rerun acquisition hashes; any narrow line-ending protection belongs to
   integration. Preserve existing M2 work, approved baselines and historical C.
4. **Final integrated acceptance:** hear complete cycles, A→B and B→A, repeated
   wraps, all cues and speech at intended/max supported levels; verify ducking,
   restoration and controls. Human approval of A and general positive feedback
   are retained, but do not constitute new A+B acoustic approval.

Only this validation report was written in the main checkout. Candidate files
were read or checked without mutation. No broad game/build audit, deployment,
Git operation, new worker, other-chat message or acoustic PASS occurred.
