# Music variation — bounded read-only assessment

11 October 2026. **Recommendation: retain both approved themes and prototype one
short, creator-composed contrasting movement in each existing WAV, rendered
offline. Do not merely double the recordings or alter pitch/speed.** The smallest
new-source candidate is Kilua Boy's complete 30.72-second **Sleep Talking** loop.
This is a production recommendation, not an acoustically accepted arrangement.
Controller must release audio writer ownership and resolve the duration/cache
and composite-credit details below before implementation.

Only this assessment and two private numerical JSON reports were written.
No source, media, catalogue, register, runtime, controls, configuration, Git or
deployment changes were made. No workers or other-chat messages were sent.

## Human evidence and scope

The human previously approved Market on the Sea / Sunset Walk: “Much better—use
these tracks.” The new feedback is: “Sounds work, I've not heard any bad ones
but the loops are very short and whilst catchy probably could do with some
variations adding in? You are authorised to continue.”

This is positive general listening evidence and a request for more musical
variety. It does not identify a broken cue, an exact short-loop timestamp, device,
player or volume, nor certify two joins per theme. Preserve the approved pair,
five effects and controls. Controller has deferred detailed acoustic acceptance
to final release; no new human question/listening request is needed now.

Read starting authorities: [WP02-03A handoff](WP02-03A-HANDOFF.md),
[audio direction](../../audio-direction.md), [provenance](../../../assets/source/audio/PROVENANCE.md),
the two active recipes, retained original/decode metadata and the current WAVs.
Bounded additional reads of audio/controller.ts, renderer/QA and vite.config.ts
were needed to distinguish music repetition from buffer length and identify
the actual constraints on a longer export. They did not authorize changes there.

## What is actually looping

| Theme | Current decoded loop | Retained original | Consequence |
|---|---:|---:|---|
| Market on the Sea | 3,086,846 frames / 69.996508 s | 6,445,440 frames / 146.155102 s MP3 decode | Approximately two passes of the same musical period plus 6.162086 s of ending material. The longer file is not an unused new movement. |
| Sunset Walk | 3,386,880 frames / 76.8 s | The same complete 76.8 s stereo WAV | Nothing longer has been trimmed away; the export already uses the full supplied loop. |

Fresh read-only decoding compared **every corresponding five-second window**
across the village original's two 69.996508-second passes: normalized waveform
correlation was 0.98085 for the opening window and 0.99491–0.99871 thereafter.
This strongly supports repeated recorded material, with onset/tail/encoding
differences, rather than a hidden distinct B arrangement. No source was played.
The existing second-pass extraction avoids the initial missing prior-cycle tail.
Using the full original would add repetition and an ending/tail, not meaningful
phrase variety, and would require a different wrap treatment.

The library original's data chunk is 13,547,520 bytes of stereo PCM16 at 44.1 kHz.
Its sampler start 0 / inclusive end 3,386,879 spans the whole file. A one-second
window at source 30 s has waveform correlation **0.94593, 0.97538 and 0.96420**
against offsets +4.8, +9.6 and +19.2 s. Other probed windows differ considerably.
This demonstrates at least some short repeating recorded material inside a
longer changing arrangement; it is not a full musical transcription or proof
of the exact phrase the human found repetitive. Quarter-file RMS also varies,
so neither export is literally one tiny identical audio fragment tiled throughout.

The controller takes loop endpoints from AUDIO_ASSETS, yielding the full 70/77 s
periods. An active same-theme track is retained. A genuine switch between village
and library starts the newly selected buffer from its beginning. Frequent theme
switching could therefore emphasize opening phrases even with longer files; this
is a code-path observation, **not** a diagnosis of the user's session. Leave that
behavior and all controls unchanged in the musical improvement.

Private numerical evidence (not runtime/source artifacts):

- `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11de7-98e9-7c21-9cb6-d174fabaa1bf/music-variation-original-repeat.json`
- `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11de7-98e9-7c21-9cb6-d174fabaa1bf/music-variation-analysis.json`

## Smallest credible musical improvement

Use the existing approved recording as **A**, then one complete short contrasting
recording as **B**, with the repeating static export ordered **A → B → A…**.
There is only one A and one B in each exported buffer; the next A is its ordinary
wrap. This retains the full approved theme and delays its return with genuinely
different authored material. It adds arrangement contrast, not a newly composed
variation of the original melody. Existing short motives inside A remain.

First bounded candidate: **Sleep Talking — Kilua Boy / KiluaBoy**, the same creator
as Sunset Walk. The creator describes a dreamy fantasy loop; its tags identify
piano/children/toy/background uses. The creator-posted page explicitly offers CC0
and makes credit optional. Suitability as a quiet contrast to the village is an
inference from that description, **not a listening endorsement**.
[Creator source](https://opengameart.org/content/sleep-talking-loop-fantasy-rpg-sci-fi),
[linked CC0 1.0 terms](https://creativecommons.org/publicdomain/zero/1.0/).

A read-only HTTP range request on 11 October returned the first 512 bytes of the
published SleepTalking.wav (206 response). Header: PCM16 stereo, 44,100 Hz,
176,400 bytes/s; data chunk 5,419,008 bytes = **1,354,752 frames / 30.72 s**.
No candidate media was saved, decoded or listened to. This verifies duration and
format only, not complete-file integrity, harmonic compatibility or loop quality.

After writer release, acquire/retain the exact complete WAV and licence evidence,
inspect its entire period, and make one offline A+B prototype per role. Use native
cadences and retained/reconstructed source tails at both transitions. Where needed,
use only a short explicitly measured tail overlap between complete sections; do
not cut mid-phrase, stretch, transpose, splice arbitrary bars, introduce a silence
gap or add synthetic accompaniment. If the complete-section transitions are
musically awkward, reject that prototype rather than force the join. No shuffled
playlist, timer, additional public file or runtime scheduler is needed.

The approved A material remains roughly 69.5% of the village cycle and 71.4% of
the library cycle before overlaps. A common short B provides a shared quiet
interlude while the approved scene identities dominate. Tradeoff: both roles
would share that interlude, and 30.72 s of extra contrast is a modest improvement,
not a promise to remove all motif repetition or supply several minutes of new music.

## Concrete options and cost

| Option | Nominal cycle | Decision / tradeoff |
|---|---|---|
| Keep current pair | 69.997 / 76.8 s | Lowest risk, but does not address the variation request. |
| Use full village original / duplicate library | 146.155 / 153.6 s | Reject: mostly more copies of the same material, extra bytes and an awkward village ending, not new musical development. |
| **Approved A + complete Sleep Talking B** | **100.716508 / 107.52 s**, before any small overlaps | **Recommended bounded first prototype.** One new recording, genuine contrast, same two runtime assets. Musical compatibility remains to be checked. |
| Separate same-creator companion for each role | Village e.g. 69.997 + ~103.66 s; library 76.8 + 30.72 s | More distinct scene arrangements; two acquisitions and larger payload. Fallback if the shared interlude does not fit village, not an automatic scope expansion. |

The bounded village fallback is Jonathan Shaw's **A Tale of Peace** (CC BY 3.0),
described by its creator as calm orchestral/dialog music. The prior source
investigation measured a roughly 103.66-second repeat in its 214.23-second file;
that retained observation is not a fresh full-file measurement here. A complete
period would give a roughly 173.66-second village cycle, subject to source/cadence
reverification. This keeps village component authorship/licence homogeneous but
allows the companion to occupy more time than the approved village theme.
[Creator source](https://opengameart.org/content/a-tale-of-peace-rpg-orchestral-essentials-peace-music).
Do not trim it arbitrarily to satisfy a duration target. No further source search
is needed unless these explicitly bounded candidates fail musical assessment.

## Producer and platform decisions before any write

For the recommended A+B option, simple concatenation with no overlap would be:

| Export | Frames | PCM WAV bytes (44-byte header) |
|---|---:|---:|
| village | 4,441,598 | 8,883,240 |
| library | 4,741,632 | 9,483,308 |

These are **calculated planning values**, not generated assets or final loop points.
Total seven-file runtime audio would be 19,244,358 bytes; decoded float32 samples
for both loops would be 36,732,920 bytes at 44.1 kHz, excluding overhead. A final
overlap changes those counts; measure rather than copy these into the register.

1. The source renderer and verifier currently reject loops over **90 seconds**.
   Controller must record the bounded duration amendment for the selected plan
   (e.g. maximum 110 s for this prototype); source owner then updates those guards.
   This is not permission to remove all duration bounds.
2. Vite/Workbox currently caps precached files at **8,388,608 bytes**, equivalent
   to only 95.108435 s for this PCM format. Both proposed files exceed it.
   **WP01 owns** a measured cache-cap change and precache/Ready-offline checks.
   A 10 MiB cap would cover these nominal files, but actual files and device/cache
   behavior must be checked. Audio owner must not silently edit shared config.
3. One export still means one asset-register row and the same two catalogue keys.
   List both components in sourcePaths/author/attribution/modifications and retain
   their precise permissions in the row's retained rights document. Library
   components are both CC0. Village combines **CC BY 3.0 and CC0 1.0**; the current
   permission DTO has one licence/version/link tuple. Controller must settle an
   honest composite description using that contract, or choose the homogeneous
   CC-BY village fallback. Do not label the entire source family CC0, erase the
   original CC0 status, imply the original composers endorsed the game, or invent
   a second runtime/rights inventory to evade this decision.
4. Controller must schedule the exclusive two-audio-row register delta around
   M2 art's ownership. No registry claim or reservation was made by this assessment.

## Exact smallest implementation ownership

If Controller releases the recommended prototype, the audio owner's delta is:

- `assets/source/audio/licensed/`: the one acquired Sleep Talking WAV, creator/
  licence evidence and acquisition metadata; per-export component-rights note.
- `assets/source/audio/village.json`, `library.json`, `tools/render-audio.mjs`:
  finite offline A+B recipes and rendering, with declared source/tail boundaries.
  Existing MP3 import changes only if a retained native village ending is needed.
- `public/assets/audio/village-loop.wav`, `library-loop.wav` only; five effect
  WAVs and effects.json unchanged and hash-checked.
- `src/audio/catalogue.ts`: two measured metadata entries only; no interface change.
- `assets/asset-register.json`: two audio rows only, after explicit writer release.
- `assets/source/audio/verify-audio.mjs`, measurements/audition artifacts and,
  if its assertions require it, check-browser.mjs/browser-decode.json; retain the
  approved current A-only WAVs/recipes as the comparison baseline.
- `docs/audio-direction.md`, source `PROVENANCE.md`, WP02-03A-HANDOFF.md and the
  source listening record: revised composition, provenance, metrics and limits.

Separate **WP01** delta: `vite.config.ts` precache maximum only as supported by
final measured bytes, plus its owned offline/cache verification/evidence. Controls,
audio/controller.ts, preferences, state, scene mappings and deployment behavior
are outside the proposed audio-author patch. Controller owns shared decisions
and status updates. No extra public soundtrack asset is proposed.

## Verification and final listening boundary

Retain original hashes/licences and prove the approved A interior was not altered
except declared gain/transition treatment. Verify full candidate download/headers,
exact mono44.1kHz16bit frames/bytes/bounds, both A→B and B→A seams, deterministic
reproduction, clipping/DC and the two-theme/four-effect mix bound. Check a fresh
browser decode, catalogue/register consistency, unchanged five effects and credits
for every component. WP01 must prove both larger files really enter the precache,
offline reload works, failed/omitted assets cannot yield Ready offline, and source
review files stay out of the runtime inventory.

At the Controller's final release acoustic gate, an audio-capable reviewer should
hear the complete arrangements, two complete cycle wraps, every new internal
transition, the cues and speech at intended/max supported levels. Specifically
judge whether B brings welcome contrast without a jarring key/tempo/energy change
or an overlong quiet section; ensure the quieter library role survives. Record
the actual device/player and observations then. The new general human feedback
is positive evidence, not a substitute for those detailed checks. Do not ask for
another interim human audition now. No acoustic pass is claimed by this analysis.

**Return to Controller and idle:** no implementation or registry write has begun.
