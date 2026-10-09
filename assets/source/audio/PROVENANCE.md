# Soundtrack provenance — licensed music revision

9 October 2026. The human listened to and rejected the initial synthesized music,
then explicitly requested existing properly licensed free music from online
sources. Controller released the same runtime/catalogue/register ownership for
this replacement. The original-only theme requirement is superseded by that
instruction; the five original effects remain byte-identical.

## Reused music

- **Market on the Sea**, composed by **Jonathan Shaw (InspectorJ)**, is offered
  by the creator under **CC BY 3.0 Unported**. The register identifies the actual
  author, source URL, exact licence/version/link, retained licence evidence and
  modifications. See [the complete reuse/credit record](licensed/market-on-the-sea-LICENSE.md).
- **Sunset Walk**, by **Kilua Boy / KiluaBoy**, is offered by the creator under
  **CC0 1.0 Universal**. The project also credits the creator voluntarily.
  See [the complete reuse/credit record](licensed/sunset-walk-LICENSE.md).

These recordings are not Codex compositions or project-owned originals.
The project does not relicense either recording. Required credits and source/
licence links must remain visible through the product's register-driven credits.
No external paid service, account, trial, ripped commercial song or downloaded
instrument pack was used.

Retained originals are the unmodified Market on the Sea ZIP/MP3 and Sunset Walk
WAV. Saved creator pages, full Creative Commons legal code and the composer's
included PDF licence preserve the source evidence. Exact bytes/hashes and URLs
are recorded in [acquisition-manifest.json](licensed/acquisition-manifest.json).

[village.json](village.json) and [library.json](library.json) now describe
reproducible recording transformations, not invented note scores. Village uses
one full repeated phrase in the source's second pass; library retains the entire
supplied loop. Both are downmixed to mono, gain-reduced and quantized to 44.1 kHz
16-bit PCM. No tempo/pitch change, inserted join silence, seam crossfade or new
instrument is added. Original names remain in attribution. See the exact frame
boundaries and gains in the recipes.

## Unchanged original effects

Author: OpenAI Codex, original score and offline synthesis for the project
requester. Project-use holder: the Learning is Fun project requester, for this
commissioned AI-generated output. The original human instruction authorizes use,
editing and distribution in the project; this record does not assert human
authorship, copyright eligibility, exclusivity or a third-party copyright grant.

The pickup, placement, support, success and restoration note events, envelopes,
partials and noise seeds in [effects.json](effects.json) were authored in this
task. No samples, existing song, recording or SoundFont was reused in those
effects. They retain their original project-use permission, with no CC0/GPL
dedication. Hash comparisons against the rejected first delivery prove all five
WAVs are unchanged; the human's criticism addressed music.

## Tooling, history and honest acceptance

Existing Node v24.19.0 renders the seven runtime WAVs without dependencies beyond
built-ins. Existing @playwright/test / Chromium 156.0.8078.4 decodes the retained
village MP3 only during source import. The retained selected float master allows
normal offline rendering without a browser. The original lossless library WAV
is read directly. No dependency/configuration file or runtime synthesizer changed.

The [rejected-synthesis](rejected-synthesis/README.md) archive preserves the old
theme WAVs, original audition, scores, renderer and historical documents. It is
not active runtime inventory. The current audition and measurements are generated
from the new licensed exports and unchanged cues.

**The human approved the chosen pair on 9 October 2026 after hearing the replacement
comparison: “Much better—use these tracks.”** This is preference/selection acceptance.
No device/player, complete-theme, two-join or cue observations were supplied.
Technical decoding, sample metrics and reproduction do not fill those gaps.
Retain the selected tracks; no further selection approval is requested now.
Controller retains the named WP02-03A-SOURCE-LISTENING evidence boundary; detailed
integrated and published acoustic checks remain WP02-05A / WP06 responsibilities.
