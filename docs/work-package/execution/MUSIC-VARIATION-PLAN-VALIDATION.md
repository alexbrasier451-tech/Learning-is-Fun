# Music variation — independent bounded plan review

11 October 2026. **PROCEED with private A+B prototypes; no schema expansion or
new user confirmation is needed.** Preserve both approved A themes and try one
complete Sleep Talking interlude per existing theme. Acoustic status remains
UNVERIFIED under [the human continuation authority](CONTINUATION-AND-MUSIC-VARIATION.md).
This is permission/prototype-plan support, not acceptance of an unheard arrangement.
No production/register lease is conferred by this review.

Reviewed [MUSIC-VARIATION-ASSESSMENT](MUSIC-VARIATION-ASSESSMENT.md), SHA-256
`84ce040472e8e29d55f1a57fb8d9ad45eb4c80cec12b336678d5a38bd577bbfc`, the current
permission DTO/schema, relevant renderer/QA guards, cache cap and credits code.
The prior independent checks of approved recordings remain valid.

## 1. Represent the component rights without changing the schema

**Yes, the complete existing row can represent this honestly; the single tuple
alone cannot describe both component licences.** Keep the village tuple as the
actual CC BY 3.0 obligation for Market on the Sea. Explicitly scope it in the
visible attribution/modification text and retained component-rights document.
Do not invent a combined licence/version, claim CC BY grants rights in CC0
material, relabel the entire village export CC0, or assert a new project-owned
copyright in the arrangement.

CC BY 3.0 permits adaptations/distribution, requires identifying changes and
retaining the original credit/licence, and does not permit sublicensing the
original work or imposing additional restrictions. CC0 permits incorporation
and adaptation under its waiver/fallback; its original status is preserved.
These support the proposed component treatment, without needing to classify
every transition as a legally distinct collection versus adaptation.
[CC BY 3.0 §§3–4,8](https://creativecommons.org/licenses/by/3.0/legalcode.en),
[CC0 §§2–3](https://creativecommons.org/publicdomain/zero/1.0/legalcode.en).

Use the following exact planned values for the village row:

```json
{
  "author": "Jonathan Shaw (Market on the Sea); Kilua Boy / KiluaBoy (Sleep Talking)",
  "permission": {
    "kind": "reused",
    "licence": "CC BY",
    "version": "3.0",
    "licenceUrl": "https://creativecommons.org/licenses/by/3.0/",
    "retainedLicencePath": "assets/source/audio/licensed/village-variation-RIGHTS.md"
  }
}
```

Keep `sourceUrl` pointing to the [Market on the Sea creator page](https://opengameart.org/content/market-on-the-sea-rpg-orchestral-essentials-village-music).
Use this attribution text, with the URLs written as actual text in the string
(not Markdown syntax that the current React renderer would print literally):

> Includes “Market on the Sea”, composed by Jonathan Shaw (https://www.jshaw.co.uk/),
> CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/), and “Sleep Talking” by
> Kilua Boy / KiluaBoy, CC0 1.0
> (https://creativecommons.org/publicdomain/zero/1.0/). Sleep Talking source:
> https://opengameart.org/content/sleep-talking-loop-fantasy-rpg-sci-fi.
> The CC BY tuple applies to Market on the Sea; Sleep Talking retains its CC0
> dedication. Neither creator endorses this adaptation.

`modifications` should begin exactly:

> Offline A+B arrangement of separately licensed recordings; complete approved
> A period followed by complete Sleep Talking B period, downmixed to mono
> 44.1 kHz PCM16. Original component rights are unchanged.

Then append **actual measured** component gains, source-frame ranges and any
transition overlap/envelope treatment. Do not assert “no crossfade” if one was
used. The rights document must identify both source URLs, original licence
versions/legal-code copies, acquisition hashes, source-to-output segment map,
credits and modifications; retain the existing Jonathan Shaw/EULA evidence.

For the library row, use author `Kilua Boy / KiluaBoy (Sunset Walk; Sleep Talking)`,
permission `reused / CC0 / 1.0 / https://creativecommons.org/publicdomain/zero/1.0/`,
and proposed retained path `assets/source/audio/licensed/library-variation-RIGHTS.md`.
Keep its primary [Sunset Walk source URL](https://opengameart.org/content/sunset-walk-ambient-quiet-sweet-loop).
Attribution should name **both** tracks, Kilua Boy, CC0 1.0 and both creator-page
URLs, explicitly saying the existing source dedications are retained. Use the
same truthful transformation description. This records source permissions, not
a new dedication of other project work.

In both rows, preserve existing component sourcePaths and append the retained
Sleep Talking original, recipe/processing inputs and per-export rights document.
The proposed paths above do not yet exist; the producer creates them after its
authorized acquisition. Keep exactly one register row per runtime WAV.

**Small concrete integration finding:** `src/app/AppShell.tsx:213–215` currently
hardcodes a single-track title and links the entire village `author` string to
Jonathan Shaw. With two creators, that would misdirect Kilua Boy's name and hide
the composite title. Before publishing the composites, the shell owner should
use role/composite headings, render the combined author plainly (or link each
creator correctly), and label the existing source/licence links as the **primary
component** links. The visible attribution must carry the second source and
licence URLs. Plain readable URLs are sufficient for this bounded representation;
native links are preferable. No DTO expansion, new rights inventory or audio
controller change is needed. This is not a blocker to private media prototypes.

## 2. Prototype recommendation and musical limits

The [Sleep Talking creator page](https://opengameart.org/content/sleep-talking-loop-fantasy-rpg-sci-fi)
explicitly offers CC0 and the named WAV. The assessment's 30.72-second header
measurement is planning evidence only: acquire and hash the complete source,
check actual chunks/frames/decode and retain creator/licence evidence before use.
No candidate download, decode or hearing was performed in this review.

A complete contrasting B inside each static A+B buffer is a defensible small
experiment: one acquisition, no runtime scheduler, unchanged two theme keys and
five effects. It delays return to A and introduces different recorded material.
It does **not** alter A's internal repetitive motifs. Shared B reduces scene
distinctiveness for that interval, and frequent scene switches may still expose
A's opening more often. Do not alter theme-switch behaviour in this prototype.

Tags, common authorship, correlations and waveforms establish neither harmonic
fit nor compatible tempo, energy, cadence or perceived loudness. A full loop is
not automatically a natural transition into a different recording. Preserve A
interiors and B's full phrase; document any bounded tail overlap at **both A→B
and B→A**. A short fade is not evidence that a musical mismatch is solved.
Retain the approved A-only baseline; prepare the candidate with acoustic status
unverified. Do not demand an interim audition or mark musical compatibility PASS.
At final release, hear complete cycles, both transitions, two wraps, cues and
speech at intended/max supported levels. An awkward result can then return to
the producer; do not force a new fallback acquisition now.

## 3. Smallest duration/cache support and release boundaries

Independent arithmetic confirms the nominal no-overlap plan:

| Theme | Frames | Seconds | PCM WAV bytes |
|---|---:|---:|---:|
| Village A+B | 4,441,598 | 100.716508 | 8,883,240 |
| Library A+B | 4,741,632 | 107.52 | 9,483,308 |

Seven-file audio total: **19,244,358 bytes**. Combined 44.1 kHz float32 loop
samples: **36,732,920 bytes**, excluding overhead. These are calculated values,
not measured outputs; actual overlaps/tails require fresh frame/byte records.

- **Audio owner:** amend the loop upper bound from 90 to **110 seconds** in
  `tools/render-audio.mjs:59` and `assets/source/audio/verify-audio.mjs:60`;
  retain the lower bound, positive/integer frames, PCM format and exclusive-loop
  checks. Scope the wider maximum to loops, leaving effect bounds unchanged.
  Recipes/rendering, measured two-row catalogue/register changes and private
  comparison evidence belong to that producer. Verify rejection above 110 s,
  deterministic rendering, new seam measurements, unchanged cues and the actual
  two-theme/four-effect mix bound, especially overlapping tails.
- **WP01 owner:** later change only Workbox's file cap in `vite.config.ts` from
  8 MiB to **10 MiB = 10,485,760 bytes**, with measured precache/Ready-offline
  verification. A 110-second mono PCM16 WAV is **9,702,044 bytes**, so this cap
  covers the entire bounded format range. The nominal files exceed the current
  8 MiB cap; publishing unchanged cap is not acceptable. Prove both outputs are
  included, offline reload works and omissions cannot report Ready. The cap is
  not a device/storage performance guarantee or a general budget relaxation.
- **Controller/shell owner:** record the bounded duration amendment, schedule
  the exclusive two-audio-row register delta separately from M2 art, and route
  the small composite-credit correction above. Preserve approved originals,
  controls/state and deployed C until coordinated integration.

**No real blocker to preparing private prototypes:** the human already authorized
variation, mixed permissions have a truthful representation, the duration fits
a bounded 110-second allowance, and the cache increase is small and owner-scoped.
Private candidate outputs need neither a production register write nor a live
cache-cap change. Complete source acquisition/integrity and technical validation
are normal producer steps. Production integration still needs its exclusive lease;
final acoustic acceptance remains deferred, not waived.

## Review evidence and scope

Read the bounded assessment/authority and identified source lines; reopened only
the named candidate creator page and official CC legal texts. Checked the exact
DTO/schema strings and actual credits rendering; computed frames/bytes/cap with
a read-only Node program. No broader music search, production mutation, media
generation/listening, browser/game run, build/test audit, Git operation, worker
or other-chat message. Only this plan-validation report was written.
