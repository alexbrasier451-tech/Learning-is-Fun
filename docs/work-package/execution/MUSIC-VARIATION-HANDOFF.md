# Music variation — frozen private candidate

11 October 2026. Original audio owner. Base: 6b5834953b56b4f2ce33c099700b1090805b6144. Candidate: C:\Users\alexb\.codex\visualizations\2026\10\08\01a11de7-98e9-7c21-9cb6-d174fabaa1bf\music-variation-6b583495\candidate\.

Technical source delivery is complete. **A+B acoustic acceptance remains UNVERIFIED.** Prior A approval and positive general feedback are preserved; no interim human audition, agent listening or published acceptance is claimed. No commit, deployment, shared configuration, shell or controller change is included.

## Exact runtime contract for WP01

| Export | Frames / exclusive end | Seconds | Bytes | SHA-256 |
|---|---:|---:|---:|---|
| village-loop | 4397498 | 99.71650793650794 | 8795040 | 5506aca739cb60aa265ae32823f4444e966fb6179ef27416d271c7e0de55e6a6 |
| library-loop | 4697532 | 106.52 | 9395108 | cfb28bbd7ac9c6b9241873df2a05691dff6c4387d2df916d79102eccf015acd4 |

Both files are mono 44.1 kHz PCM16 with loop start 0. Seven runtime WAVs total **19,067,958 bytes**; largest **9,395,108**. They fit individually below the proposed 10 MiB (10,485,760-byte) cap. WP01 must make and verify its independent cache-cap patch; existing cache/config files were not changed. Decoded float32 music samples total 36,380,120 bytes before overhead.

Complete approved A periods/gains: village 3,086,846 frames / 0.35; library 3,386,880 / 0.16. B is the complete 1,354,752-frame (30.72 s) Sleep Talking recording, gains 0.40 / 0.25. Each pair has 22,050-frame complementary raised-cosine overlaps at A→B and B→A. Total duration = A+B−44,100 frames; no tempo/pitch change or inserted silence. Fade endpoints may have zero weight; the full source timelines are traversed.

A interior [22,050, 3,064,796) village and [22,050, 3,364,830) library is PCM-identical to approved A. A→B windows are [3,064,796, 3,086,846) / [3,364,830, 3,386,880); B→A is [0, 22,050) in both. Wrap steps 17/11 PCM units are measurements, not audible-seam approval. Both entire B interiors independently match source downmix/gain. Five cues retain their exact prior bytes/hashes and catalogue/register records.

## Exact credits for shell owner

Use composite headings “Market on the Sea / Sleep Talking” and “Sunset Walk / Sleep Talking”. Show combined authors as plain text; do not link all village authors to Jonathan Shaw. Label the existing source/licence links as primary. The complete attribution and modification text must remain visible.

### village-loop

Author: Jonathan Shaw (Market on the Sea); Kilua Boy / KiluaBoy (Sleep Talking)

Attribution: Includes “Market on the Sea”, composed by Jonathan Shaw (https://www.jshaw.co.uk/), CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/), and “Sleep Talking” by Kilua Boy / KiluaBoy, CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/). Sleep Talking source: https://opengameart.org/content/sleep-talking-loop-fantasy-rpg-sci-fi. The CC BY tuple applies to Market on the Sea; Sleep Talking retains its CC0 dedication. Neither creator endorses this adaptation.

Modifications: Offline A+B arrangement of separately licensed recordings; complete approved A period followed by complete Sleep Talking B period, downmixed to mono 44.1 kHz PCM16. Original component rights are unchanged. A gain 0.35, retained source frames [3086846, 6173692); B gain 0.4, source frames [0, 1354752). Each component has complementary raised-cosine fade-in/fade-out over 22050 frames (0.5 s). A output starts at 0; B starts at 3064796; B final 22050 frames wrap into A first 22050 frames. A interior [22050, 3064796) is unchanged. No pitch/speed change or inserted silence.

Primary source: https://opengameart.org/content/market-on-the-sea-rpg-orchestral-essentials-village-music

Retained component rights: assets/source/audio/licensed/village-variation-RIGHTS.md

### library-loop

Author: Kilua Boy / KiluaBoy (Sunset Walk; Sleep Talking)

Attribution: Includes “Sunset Walk” and “Sleep Talking” by Kilua Boy / KiluaBoy, CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/). Sunset Walk source: https://opengameart.org/content/sunset-walk-ambient-quiet-sweet-loop. Sleep Talking source: https://opengameart.org/content/sleep-talking-loop-fantasy-rpg-sci-fi. The existing source dedications are retained. No creator endorsement or new dedication of other project work is implied.

Modifications: Offline A+B arrangement of separately licensed recordings; complete approved A period followed by complete Sleep Talking B period, downmixed to mono 44.1 kHz PCM16. Original component rights are unchanged. A gain 0.16, retained source frames [0, 3386880); B gain 0.25, source frames [0, 1354752). Each component has complementary raised-cosine fade-in/fade-out over 22050 frames (0.5 s). A output starts at 0; B starts at 3364830; B final 22050 frames wrap into A first 22050 frames. A interior [22050, 3364830) is unchanged. No pitch/speed change or inserted silence.

Primary source: https://opengameart.org/content/sunset-walk-ambient-quiet-sweet-loop

Retained component rights: assets/source/audio/licensed/library-variation-RIGHTS.md


The village primary CC BY 3.0 tuple applies to Market on the Sea, while Sleep Talking remains CC0. Library retains CC0 1.0. No combined village CC0, relicensing or endorsement is asserted. The two register rows contain these exact strings; shell changes are outside this candidate.

## Exact new raw acquisition evidence

All paths below start at candidate root. Preserve response bytes when copying/staging; Controller owns any narrow .gitattributes -text entries. This candidate does not edit .gitattributes.

| Path | Bytes | SHA-256 | Original URL |
|---|---:|---|---|
| assets/source/audio/licensed/sleep-talking.wav | 5419154 | 790cfd5ae94db0460031cf81f653758c921f4a37aec284251767d8026099130d | https://opengameart.org/sites/default/files/SleepTalking.wav |
| assets/source/audio/licensed/sleep-talking-source.html | 43518 | 99deabae6b754614bd49887188fd76a0be459c7fde57483b2ba298b0e019fc38 | https://opengameart.org/content/sleep-talking-loop-fantasy-rpg-sci-fi |
| assets/source/audio/licensed/sleep-talking-cc0-legalcode.html | 32223 | b43732f4c1463b087cf10d4daf8d8766514b2bf8f21bc5ef50905f95be227726 | https://creativecommons.org/publicdomain/zero/1.0/legalcode.en |

Manifest: assets/source/audio/licensed/sleep-talking-acquisition.json. Existing raw source, licence HTML/PDF and acquisition manifest are unchanged and revalidated byte-for-byte. Neither old nor new evidence was normalized.

## Completed technical checks

- Node v24.19.0 renderer --check: all seven runtime outputs reproduce byte-for-byte.
- verify-variation.mjs: exact A interiors, complete B interior/source mapping, both transition measurements, original/new raw acquisition hashes, 70 unchanged register rows. >110-second loop is rejected; <60-second loop, wrong rate and invalid exclusive end are rejected; >90-second effect remains rejected.
- verify-audio.mjs: independent RIFF/PCM/header sizes, catalogue/register agreement, effect hashes, source peak bound and current review derivatives pass. Peak bounds: 0.954376220703125 unity / 0.38623809814453125 default, excluding speech/device/resampler effects.
- Fresh headless Chromium 156.0.8078.4: native decode of all seven actual WAVs, exact mono/44.1 kHz/frame counts; nine paused/no-autoplay review players with expected gains. No acoustic inference.
- Original retained MP3 freshly decoded to the exact prior selected float master/hash; original repeat alignment metadata matches.
- Focused catalogue TypeScript no-emit check passes with strict/skipLibCheck/ES2022/ESNext/Bundler and incremental disabled.
- Final base-file allowlist check and semantic scope check: only owned paths; exactly two changed register rows and catalogue entries; old handoffs, five cues, controller/shell/config and historical source evidence preserved.

Commands are in docs/audio-direction.md. Existing main dependency binaries were read only through AUDIO_QA_PACKAGE_JSON / explicit TypeScript path; TEMP/TMP were private browser-temp beside candidate. No server, main build, dependency installation or shared cache write was used. No broad experience suite was rerun or claimed for this private source-only delivery.

QA corrections retained as evidence: initial B-interior assertion distinguished numeric 0 from −0; normalizing only the expected integer zero fixed that assertion, with no WAV change. Original MP3 master check initially passed bytes/hash then failed generated JSON LF versus retained CRLF; comparison now checks parsed metadata, leaving raw acquisition and master comparisons exact. Both complete relevant checks were rerun green. These were fixture/report issues, not acoustic failures.

## File scope and integration

The exact changed/new file list is below. Copy only this owned delta into integration, **merge only village-loop and library-loop rows** from the register rather than replacing other owners' rows. Approved-a-only files are retained source QA fixtures required by verify-variation.mjs, never runtime inventory. Private parent files, base ZIP, logs and browser-temp are not integration files.

- assets/asset-register.json
- assets/source/audio/PROVENANCE.md
- assets/source/audio/approved-a-only/library-loop.wav
- assets/source/audio/approved-a-only/library.json
- assets/source/audio/approved-a-only/measurements.json
- assets/source/audio/approved-a-only/village-loop.wav
- assets/source/audio/approved-a-only/village.json
- assets/source/audio/audition.html
- assets/source/audio/audition.wav
- assets/source/audio/browser-decode.json
- assets/source/audio/check-browser.mjs
- assets/source/audio/library.json
- assets/source/audio/licensed/decode-sources.mjs
- assets/source/audio/licensed/library-variation-RIGHTS.md
- assets/source/audio/licensed/sleep-talking-acquisition.json
- assets/source/audio/licensed/sleep-talking-cc0-legalcode.html
- assets/source/audio/licensed/sleep-talking-source.html
- assets/source/audio/licensed/sleep-talking.wav
- assets/source/audio/licensed/village-variation-RIGHTS.md
- assets/source/audio/measurements.json
- assets/source/audio/music-preview.wav
- assets/source/audio/variation-checks.json
- assets/source/audio/variation-registry-preservation.json
- assets/source/audio/verify-audio.mjs
- assets/source/audio/verify-variation.mjs
- assets/source/audio/village.json
- docs/audio-direction.md
- docs/work-package/execution/MUSIC-VARIATION-HANDOFF.md
- public/assets/audio/library-loop.wav
- public/assets/audio/village-loop.wav
- src/audio/catalogue.ts
- tools/render-audio.mjs

The sibling private parent candidate-files.json contains exact bytes/SHA-256 for this frozen delta, including this handoff; base-files.json records all 644 baseline files. Prior approved handoffs are unchanged historical records. [Audio direction](../../audio-direction.md), [provenance](../../../assets/source/audio/PROVENANCE.md) and [variation evidence](../../../assets/source/audio/variation-checks.json) describe this candidate.

Remaining integration: Controller preserves raw evidence bytes and merges the bounded audio delta; WP01 owns cache-cap verification; shell owner owns composite credits; final integrated/published review owns full arrangements, both transition types, cues, speech duck/restoration and real-device comfort. No further source mutation is planned; candidate frozen and owner idle.
