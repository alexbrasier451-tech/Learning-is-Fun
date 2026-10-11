# Corrected M1 publication — preparation checkpoint

11 October 2026. **Preparation and actual C publisher checks complete;
independent review, Controller freeze/candidate replacement and affected
observer retests pending.** See the actual
[C execution receipt](M1-CORRECTED-PUBLICATION-EXECUTION.md). The B checkpoint and
signal instructions below retain the historical preparation boundary; session
72085 completed the native C transition and closed normally.
Controller owns the accepted CI commit, dispatch, deployment, freeze barrier,
candidate replacement and integration acceptance. This document prepares a
finite replacement check; it does not authorize or record an executed deployment.
The current [CANDIDATE.json](../../release/M1/CANDIDATE.json) still names frozen B.
After the finite plan was saved, Controller explicitly released the bounded B
retention preparation. One disposable native browser context was retained until
the C transition completed; no publisher build or server was launched.

## Accepted baseline and reviewed runtime delta

Original publication accepted at `1576a6c` remains valid for its actual A/B
bytes and observations. Both deployments built
`b158e2b3de86d119c1650996977201264563abde`; final B is
`b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1`,
[run 38116364473](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38116364473),
frozen at 06:01:58 UTC / 07:01:58 BST. The entry remains
`https://alexbrasier451-tech.github.io/Learning-is-Fun/`, base
`/Learning-is-Fun/`, namespace `learning-is-fun:/Learning-is-Fun/`.
Controller reports both B observers finished their frozen sessions and closed
their processes. Preserve all B evidence and original failed observations.

Read the existing [publication contract](../../release/PUBLISHING.md), candidate,
retained A/B inventories and native publication receipts, plus both correction
handoffs and independent validations:

| Reviewed correction | Exact production delta | Retained local acceptance |
| --- | --- | --- |
| Audio `06244196ee353c0975dafab32f18628a0d5029db` — [handoff](PUBLISHED-AUDIO-RETRY-HANDOFF.md), [validation](PUBLISHED-AUDIO-RETRY-VALIDATION.md) | `AudioControls.tsx` exposes **Retry saving sound choices** only for loaded, failed, pending preferences with a binding. `App.tsx` and `AppShell.tsx` bind the existing preference `retry()`. No new writer, automatic retry, unmute or playback activation. | Producer original/fresh/epoch cases, 15 audio browser cases and 73 units; independent two full-app native cases, including latest edits during a held retry. Published F01 remains open. |
| Journey `a5ab6e6744b16208ff013aeb95b79d81868ff1a7` — [handoff](PUBLISHED-JOURNEY-CORRECTION-HANDOFF.md), [validation](PUBLISHED-JOURNEY-CORRECTION-VALIDATION.md) | `QuestActivity.tsx` separates saved acknowledgement from live/error messages and suppresses it for a dirty draft. `AdventureView.tsx` restores an acknowledged M1 quest binding's scene after successful selection. `experience.css` adds h1 `overflow-wrap: anywhere`. No persistence, scoring, binding or route-policy change. | Producer 28/28 adventure cases (seven per D1/D2/T1/T2); independent complete Chrome and WebKit journeys and exact enlargement. Changed-candidate Linux Firefox and published J-01/J-02/J-03 remain open. |

The audio fixture now uses the production retry button; three focused full-app
retry tests were added. Adventure coverage preserves the original six cases and
adds one actual-root journey, giving seven. Controller subsequently supplied
tested/pushed commit `4ce77058e60f8f87285e5b8f63c7630fdaffb188` as the planned
exact C build source: [adventure seven-case run 38121464433](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38121464433)
PASS, and [published B one-case run 38121488407](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38121488407)
PASS with independent acceptance. Controller subsequently accepted the original
adventure review before dispatching actual C. These run statuses and acceptance
are supplied by Controller; this publisher does not independently grant CI
acceptance.

## Read-only applicability evidence

Private evidence root **E**:
`C:/Users/alexb/.codex/visualizations/2026/10/11/01a1296c-853f-73d1-9788-f757198f484b`.
`E/corrected-publication-compare.mjs` is a small read-only comparison;
`E/corrected-publication-applicability.json` records its passing result.
It compares frozen B's built commit with reviewed `a5ab6e6`, uses Git object
bytes for the reviewed media, and also checks current working media bytes and
tracked runtime/build changes. HEAD at comparison was the full journey commit
above. The six production files in the table are the complete `src` delta.

| Prior proof | Applicability to the reviewed corrections | Fresh C obligation |
| --- | --- | --- |
| Platform, native worker lifecycle, failure/retry and two-client waiting | `src/platform`, `src/sw.ts`, checker, platform tests and offline fixture producer/server unchanged. Accepted WP01-03A local/native matrix, Linux D3 offline execution and actual published A→B failed-install/two-client proof remain applicable to this causal surface. | Actual C identity, complete cache, normal B→C retention/activation and disconnected use. Old proof does not establish C bytes. |
| Saved-state compatibility and unrelated-storage isolation | Entire `src/state` unchanged; base, namespace, schema, migration and save-root contracts unchanged. No cross-origin/path migration is introduced. | Compare the exact last committed B root, epoch and revision with first C launch in the same context, before C gameplay writes. Check scoped cache cleanup and an unrelated sentinel in the bounded transition. |
| Audio producers and immediate silence | Controller, speech, catalogue, contracts, controls CSS and runtime producer unchanged. Existing cancellation, native abort, epoch and readiness guards remain consumed evidence. | Original observer repeats F01 through the new production UI; publication retention verifies remembered mutes/Silence all and no native playback start on cold muted C launch. |
| Source-media and revision proof | All 44 approved runtime media (37 SVG, two loop WAVs and five cue WAVs) have equal byte counts/SHA-256 across retained A/B, reviewed Git source and current working source; zero mismatches. Retained A/B injected content revisions agree. `assets` source/provenance/register, public assets, scripts, Vite, dependencies/lockfile, TypeScript configs and Pages workflow unchanged. Accepted local changed-media revision proof remains applicable. | Recheck all 44 against actual C files/cache and compare actual injected C media revisions with B. This preparation cannot verify an unbuilt C artifact. |
| Pages packaging and project-path entry | Existing manual workflow, single production build, report/mapping outside dist and official Pages upload contract unchanged. Original B has 49 publishable files and 48 unique required URLs. | Actual successful C metadata/artifacts and all-file origin hashes; fresh visible identity, worker identity, real save/reload/resume and Ready offline. |

No tracked working runtime/public/assets/build/platform changes were present at
comparison. D3 workflow/config edits and other owners' untracked evidence were
preserved. A subsequent read-only `a5ab6e6` → `4ce7705` comparison found zero
changes in src/public/assets/scripts, Vite/dependencies/lockfile/TypeScript
configuration, Pages workflow or platform tests. Thus the runtime/source-media
applicability above also applies to the planned exact CI/C commit. Its changes
are D3 discovery/workflow, starter test and evidence/ledger documentation, not
production bytes. Recheck if Controller changes the planned SHA. A newly
changed worker, storage, namespace, media, dependency or packaging surface
requires its specific affected checks to be reconsidered.

## Finite execution after Controller supplies the release inputs

1. **Accept the exact inputs.** Controller supplies the reviewed D3 runner
   commit, accepted actual Linux Firefox run with seven first-attempt adventure
   passes (original six plus root journey and retained native receipts), exact
   accepted CI commit, and the exact Pages ref/SHA to build. Record any
   evidence-only difference between CI and publication commits explicitly.
   Recheck correction inclusion and unchanged applicability against that SHA.
   Controller has confirmed B observer closure and granted the bounded publisher
   preparation window; no observer retest spans the upcoming deployment.

2. **Establish one disposable real B retention context before C dispatch.**
   Use the existing actual HTTPS entry and actual installed browser, record
   browser/version/context provenance, visible B identity, active complete B
   worker and B cache bytes. Through normal UI create a real explorer, complete
   Q1 for retained score/receipt, save an unsolved Q2 draft and committed sound
   preferences with both channel mutes and Silence all. Capture native root,
   epoch/revision and usable render; keep one controlled B game client open.
   Use a read-only outside-scope observer when needed, retaining proof it is not
   a controlled B client. Retain an unrelated/near-prefix cache or store sentinel.
   Release this checkpoint to Controller before its single C dispatch.

3. **Retain actual C deployment and artifacts.** Controller supplies successful
   run/attempt, head SHA, build/deploy job and artifact metadata, deployment output
   URL, logs, downloaded evidence and official Pages archive. Retain a new
   C-specific directory with build.json, files.json, matching checker report,
   Vite mapping and exact dist/archive byte/hash receipts. The built SHA must
   match the agreed ref; build identity must be the actual
   `<SHA>-pages-<run>-<attempt>`, distinct from B. Compare uploaded and retained
   runtime trees. Expected unchanged contract: 49 published files, 48 unique
   required URLs, 49 injected rows including the existing duplicate manifest;
   no missing/oversized/out-of-scope entries or source/test/helper/report bulk.
   Reconcile any count or packaging difference before acceptance.

4. **Prove normal B→C native retention once.** With the single B activity still
   open, request normal offline preparation/update and require complete waiting
   C while active B stays complete and usable. Probe both identities and cache
   bytes; verify retained B draft/score/preferences and no mixed runtime.
   Use the real save/update-on-next-launch path, capture the exact last committed
   B root, then close the last B client after successful readiness. Observe
   native C activation, no waiting worker, without skipWaiting, clientsClaim,
   activation command or forced mid-play reload. Reopen the actual game in the
   same browser context: visible/active C, complete inventory/Ready offline,
   exact preserved root/epoch/revision before further gameplay, unrelated
   sentinel intact, exact old B cache removed and C cache present. Disconnect,
   resume the real saved library draft, use written help, check remembered
   channel mutes and Silence all (including exit/re-entry preserving mutes), and
   retain native audio observations. Cold muted C must not start playback;
   unavailable native observation is reported honestly. Close this context and
   retain awaited cleanup. Do not manufacture a failed C install or repeat the
   full two-client/device matrix: their producing causes are unchanged.

5. **Verify fresh final C independently of B retention.** Run the existing
   `tests/platform/base-path.spec.ts` once with the assigned private published
   runner and C's actual PLAYTEST_BUILD_ID/INVENTORY/FILES/BASE_URL. It explicitly
   selects this spec, with no local host/fallback; preserve the root published
   discovery contract. Fetch every one of C's 49 origin files outside the page
   worker and match exact bytes/SHA-256. Require visible Help Game version,
   native active C/complete inventory, Ready offline, actual bridge save,
   project-entry reload and real resume, usable controls, no failed page
   responses/out-of-project runtime requests. Separately compare all required
   native cached bodies with C's artifact and all 44 media/revisions with B.
   Retain trace, screenshots, browser provenance, requests and first-attempt
   result. A/C or B/C source equality cannot substitute for these C observations.

6. **Freeze and release affected original observer retests.** Supply publication
   receipts and cleanup to Controller. Only after its C freeze barrier may the
   candidate be replaced, using its existing seven fields and actual C values,
   and original observers released on that recorded identity. The boundary
   observer repeats F01's abort → immediate silence → storage restoration →
   explicit retry → latest native commit → reload, including affected
   preference/silence/readiness variants. The journey observer repeats complete
   J-01/J-02 saved journeys across bridge/library/merchant and applicable bound
   optional/revisit routes, plus J-03's exact body-descendant 200% enlargement
   after portrait entry/rotation, restored styles and related root enlargement.
   Require truthful dirty/Undo/hint/retry status, saved identity/receipts and
   correct scenes. Preserve B reports; record C replacement evidence separately.
   Any red result returns through Controller to its causal owner and prevents
   closure; scope the ensuing rerun to the identified change and original flow.

## Actual single-B checkpoint and next signal

**B ready at 07:31:26.722 UTC / 08:31:26.722 BST**, Chrome **155.0.8059.40**,
Windows, 1366×768. Private native Playwright runner
`E/corrected-native-retention.mjs`, SHA-256
`661ea3344975640c2defefaf5091fbed9738f874d26a09ea796b8b44d5972164`,
owns execution session **72085**, context
`5a6af434-28a6-4bc0-907d-d642e2a4efd5`, and exactly one controlled game page.
It passed Node syntax validation and all seven browser-expression parse checks.
This is the supported normal-user native browser route; stdin is not used.

Evidence directory **R**: `E/corrected-native-B-38116364473-1`.
`R/B-origin.json` verifies all 49 current origin files against retained B, including
actual injected revisions. `R/B-single-client-cached.json` verifies all 48 native
required cache bodies. Visible Help identity captures name exact B; native active
B is activated/complete, with no waiting/installing worker and a controlled page.
`R/B-single-client-ready.json/png` and `R/B-READY.json` retain the checkpoint and
exact committed native root. The activity render was visually inspected.

Normal UI created River (profile `247b9471-0767-49f8-8c81-ae4c0a838b27`), completed
Q1 with two six-metre planks, and saved an unfinished Q2 punctuation draft
`{question:"?", discovery:null}` with zero Q2 Checks. Q1 and 40 lifetime points
remain. Epoch `4d27d821-262d-40c0-bf02-de3f3d1012ce`, revision **71** identify
the current saved root; final pre-close B save is captured separately later.
Native audio preferences are enabled, Silence all on, Music muted/.31 and
Effects muted/.73. A real B reload independently retained those exact settings
and draft, then resumed the actual library activity. Reloaded B's native audio
observer reports available=true, contexts/decoded/starts **0/0/0**; earlier
explicit sound enablement is not claimed to have had zero starts.
Unrelated-cache/near-prefix/other-store sentinels are present for later retention
comparison. No save/progress/answer injection, storage fault or second game
client was introduced. The transient native open settled through its original
operation; the retained event does not claim a product repair.

**Keep session 72085 alive.** Trace recording remains active in this exact
context; the runner writes its trace archive and awaited cleanup after the C
transition or an explicit stop. It is polling only this private local path:

`R/controller-command.json`

After accepted CI and successful Controller C publication, the next safe signal
is an **atomic local file write** containing
`{"command":"observe-c","artifact":"<absolute retained actual C artifact directory>"}`.
The directory must contain build.json, matching precache-report.json, files.json
and dist.tar.gz from that deployment. This signal performs only the finite
native observation/retention continuation; it cannot dispatch or activate a
worker by command. `{"command":"stop"}` instead closes the owned context,
archives the incomplete trace and records a stopped, unaccepted result. Neither
signal is a hosted endpoint. Do not send observe-c before actual C metadata and
artifact retention are available. Fresh C entry verification and affected
observer retests still follow separately.

## Remaining gates and clean handoff

Actual C artifacts and publisher checks are complete in the linked execution
receipt, for exact commit `4ce77058e60f8f87285e5b8f63c7630fdaffb188`, build
`4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1`,
[run 38121872059](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38121872059).
Independent review and Controller's C freeze barrier/candidate replacement are
the next gates. No Controller freeze time is invented here. The candidate and
original publication documentation remain
unchanged; this lane writes only this new handoff and private comparison files.
No Git mutation, API mutation, dispatch, deployment, observer/ledger/report
overwrite, worker or other-chat message was performed.

Human listening to the approved media remains pending. Unchanged media hashes,
native decoding/stopping and muted playback counts do not establish heard
silence, acoustic quality, physical-tablet or child-use acceptance. Controller
retains the single final publication/M1 acceptance claim.
