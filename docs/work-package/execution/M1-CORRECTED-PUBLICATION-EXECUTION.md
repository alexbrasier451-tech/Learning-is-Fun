# Corrected M1 C publication — publisher execution

11 October 2026. **Publisher checks PASS; C is freeze-ready. Independent review,
Controller's freeze/candidate replacement and affected observer retests remain
pending.** This is the execution of the finite
[preparation handoff](M1-CORRECTED-PUBLICATION-HANDOFF.md). Shared
[CANDIDATE.json](../../release/M1/CANDIDATE.json) still names B and is unchanged.

## Exact source, deployment and retained files

Controller accepted the changed-candidate seven-case actual Linux Firefox run
after original review, then dispatched C from the exact tested commit
`4ce77058e60f8f87285e5b8f63c7630fdaffb188`. That commit includes reviewed audio
`06244196ee353c0975dafab32f18628a0d5029db` and journey
`a5ab6e6744b16208ff013aeb95b79d81868ff1a7`. The read-only comparison from the
reviewed journey commit to CI/C found no src, media/register/source assets,
platform, persistence, dependency, Vite, TypeScript or Pages workflow change.
The unchanged native failure/two-client/source-media proof remains applicable
as scoped in the preparation; it was not rerun or used to claim C bytes.

| Actual C record | Value |
| --- | --- |
| Successful deployment | [Pages run 38121872059](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38121872059), attempt 1 |
| Build identity | `4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1` |
| Build/deploy jobs | `114418082476` / `114418141314` |
| Evidence artifact | `11695418701`, 9,946,190 bytes |
| Pages artifact | `11695318808`, 10,030,106 bytes |
| Actual deploy output/verified entry | `https://alexbrasier451-tech.github.io/Learning-is-Fun/` |
| Base / namespace | `/Learning-is-Fun/` / `learning-is-fun:/Learning-is-Fun/` |

Private evidence root **E**:
`C:/Users/alexb/.codex/visualizations/2026/10/11/01a1296c-853f-73d1-9788-f757198f484b`.
Controller's originals remain at
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-pages-C-38121872059/`.
Copied C evidence is retained under **T**: `E/retained-C-38121872059`.
T contains build.json, files.json, precache-report.json, dist.tar.gz,
vite/manifest.json, pages/artifact.tar, both downloaded zip archives and the
actual build/deploy logs. `T/retention-receipt.json` fingerprints every retained
input and verifies both tar trees against all 49 measured file hashes/lengths.
The trees contain exactly those files, with no source/test/helper/report bulk.
Actual worker injection has 49 rows, 48 unique required project URLs and the
existing duplicate manifest. Checker passed with no missing, oversized or
out-of-scope URL; largest asset 6,773,804 bytes, bound 8,388,608.

Metadata, source compatibility and uploaded-file validation completed before
the private observe-c signal. No replacement build was made. Actual CI Node
is v24.21.0. Logs retain the configure-pages@v5 Node20-to-24 warning; it did not
prevent the successful deployment. Artifact/job IDs and zip sizes were supplied
by Controller; downloaded bytes and actual success/URL/build log values were
independently checked here.

## Single native B→C retention result

Private harness `E/corrected-native-retention.mjs`, SHA-256
`661ea3344975640c2defefaf5091fbed9738f874d26a09ea796b8b44d5972164`,
consumed the accepted observer/probe/UI methods without a hosted support endpoint.
Normal-user Chrome **155.0.8059.40**, Windows, 1366×768, one controlled game client,
context `5a6af434-28a6-4bc0-907d-d642e2a4efd5`, execution session **72085**.
Evidence directory **R**: `E/corrected-native-B-38116364473-1`.

The existing B-ready checkpoint at 07:31:26.722 UTC retained real UI-created
River, completed Q1/40 points and an unsolved Q2 draft
`{question:"?", discovery:null}`. A real reload independently retained enabled
sound, Music muted/.31, Effects muted/.73 and Silence all, with cold B native
contexts/decoded/starts 0/0/0. All 49 B origin files and 48 native cache bodies
matched its retained artifact. No state/progress/answer injection was used.

| Ordered actual C checkpoint | Result / retained receipt |
| --- | --- |
| Origin/artifact identity | `R/C-origin.json`: all 49 actual HTTPS files match T's bytes/SHA-256; actual injected revisions retained. |
| C waits while B remains usable, 07:40:17.532 UTC | `complete-C-waits-one-B.json/png`: active B complete/activated, waiting C complete/installed, no installing worker, same B page identity and real library controls usable. `waiting-new-active-old-cached.json` and `waiting-new-complete-cached.json` verify both required native caches. |
| Successful save before last B closes, 07:40:17.918 UTC | `last-B-saved-before-close.json`: real Update on next launch path succeeds; epoch `4d27d821-262d-40c0-bf02-de3f3d1012ce`, revision 72. |
| Native activation after last controlled B closes | `native-C-activated.json`: activated complete C, no waiting worker. The same-origin root observer has no controller and is outside game scope; its native provenance and close events are retained. No skipWaiting, clientsClaim, activation command or forced mid-play reload. |
| Actual next launch, 07:40:20.081 UTC | `pre-existing-context-C.json/png` and visible Help C capture: exact full committed root, epoch and revision **72→72** survive. River's Q1, score, draft and sound preferences survive. Old exact B cache is removed, C cache exists; unrelated/near-prefix cache bodies and unrelated-store sentinel remain `keep`/`near-keep`/`keep`. `next-launch-C-cached.json` verifies all 48 C cache bodies. Cold C contexts/decoded/starts 0/0/0. |
| Disconnected real C resume/help, 07:40:20.753 UTC | `C-disconnected-muted-resume-and-hint.json/png`: resume the saved unfinished library, retain `?`, obtain written help, show Ready offline and correct library artwork/scene. Both channel mutes remain through Exit Silence all; Silence all is restored. Native audio available, contexts/decoded/starts **1/0/0**; no source starts. Render visually inspected. |
| Approved media | `published-approved-media-comparison.json`: all 44 files, including both loops/five cues, have equal actual B/C byte lengths/SHA-256 and injected content revisions. Accepted local changed-media revision proof remains consumed evidence. |
| Cleanup, 07:40:21.667 UTC | `cleanup.json`: finished=true, stage=verified-C, browserClosed=true; owned process exited 0. Awaited context/browser closure and both page-close receipts retained; `published-update-trace.zip` archived. No server was launched. |

Native events contain zero pageerrors and zero requestfailed events; no forced
failed-install was introduced. Transient activity opens settled through their
original native operations, with those events retained. The exact B→C
preservation assertion compares the full root, including epoch/revision, before
C gameplay writes. Offline hint and preference interactions occur afterwards.

## Independent fresh C entry/save/reload check

Existing `tests/platform/base-path.spec.ts` explicitly selected by private
`E/published-base-path.config.ts`, with actual C build/inventory/files and HTTPS
entry, service workers enabled, no local host/fallback. Actual Chrome
**155.0.8059.40**, fresh isolated context, 1366×768, one worker, retries 0.

`E/published-base-path-C-38121872059-1.json`: **1 passed**, zero skipped,
unexpected, flaky, retries or report errors. Started 07:41:20.110 UTC;
runner duration **10.214 seconds**, test approximately 9.3 seconds. All 49 origin
files independently fetched outside the page worker and matched T's hashes/bytes.
Visible Help Game version and active complete worker both name actual C;
Ready offline is visible. Normal UI creates Publication, saves a real six-metre
bridge draft, reloads the project entry, reselects the explorer and resumes its
saved bridge with usable controls. No out-of-project runtime request or failed
page response. C's native bodies were separately checked in the retained context
above; this fresh context provides independent visible/worker/entry identity.

`E/published-C-base-path-receipt.json` extracts native worker, browser and all-file
request/hash receipts. `E/published-C-entry.png` extracts the actual resumed
render; original screenshot/trace remain alongside the JSON report. The resumed
render was visually inspected, including its saved six-metre plank and restored
River Bridge scene. The visible actual C Help identity was also inspected.

A first launcher command incorrectly assumed a top-level
`node_modules/playwright/cli.js`; it failed before browser launch or test output.
`E/C-entry-launcher-failure.json` preserves that infrastructure attempt.
Using the installed package-manager CLI path then ran the unchanged config/spec
and passed on its first browser attempt. The runner retains the routine
NO_COLOR/FORCE_COLOR warning. No product repair or extra deployment occurred.

## Freeze-ready handoff and remaining release gates

Publisher verification completed and was observed freeze-ready at
**07:41:57 UTC / 08:41:57 BST (Europe/London)**. This is an observation checkpoint,
not Controller's final freeze time. `E/corrected-final-publication-receipt.json`
pins actual C metadata, source/artifact validation, native root/cache/media and
cleanup observations, fresh entry results and owned/protected file fingerprints.
Session 72085 is complete and closed; fresh runner session 95847 also exited 0.
No live publisher browser, private server or pending handshake remains.

After independent review, Controller can set the existing seven candidate fields
to these actual values, then record its freeze barrier and release affected
original observers:

```json
{
  "release": "M1",
  "url": "https://alexbrasier451-tech.github.io/Learning-is-Fun/",
  "basePath": "/Learning-is-Fun/",
  "buildId": "4ce77058e60f8f87285e5b8f63c7630fdaffb188-pages-38121872059-1",
  "commit": "4ce77058e60f8f87285e5b8f63c7630fdaffb188",
  "deploymentRun": "https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38121872059",
  "requiredInventoryLocation": "C:/Users/alexb/.codex/visualizations/2026/10/11/01a1296c-853f-73d1-9788-f757198f484b/retained-C-38121872059/precache-report.json"
}
```

Publisher did not change CANDIDATE.json or the original PUBLISHING.md; their
hashes still match the preparation checkpoint. B's accepted A/B publication
and all original observer failures remain intact. Repository changes in this
continuation are limited to the owned prep handoff and this execution document;
private helpers/evidence stay in E. No Git, API, deployment, shared source/config,
observer, ledger or other-chat mutation was performed by this publisher.

Original observers must still repeat F01 and J-01/J-02/J-03 on Controller-frozen
C as scoped in the preparation. This publication does not close those gameplay
findings or establish final M1 acceptance. Human listening remains pending;
media identity, native silence and decoding observations do not establish
acoustic quality, physical tablets or child-use acceptance.
