# Published journey corrections — independent local validation

11 October 2026. **Local technical review PASS for J-01, J-02 and J-03; no actionable findings. Changed-candidate D3 and original observers' corrected published-candidate retests remain pending.** This review does not change frozen B's failed observations or grant publication/M1 acceptance.

## Scope and identity

Reviewed the handoff, `docs/playtests/M1/JOURNEY.md`, retained original checkpoints/helper, and the four-file diff against current accepted HEAD `06244196ee353c0975dafab32f18628a0d5029db` (accepted audio correction). Reviewed source remained frozen throughout. Repository writes by this reviewer are limited to this report; probes and extracted evidence are private. No production/test/observer/configuration/ledger/Git/deployment changes, workers or other-chat messages.

Frozen published **B** remains `b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1`, commit `b158e2b3de86d119c1650996977201264563abde`, at `https://alexbrasier451-tech.github.io/Learning-is-Fun/`. Its evidence under `artifacts/playtests/M1/<B>/journey/` was read, not rewritten. In particular, D1 `M1-Q1-RETRY-DRAFT/step-11/visible-state.txt` records the 12m edited draft, changed-since-Check feedback and contradictory saved notice beneath Village Green. T2 `M1-ACCESS-LIBRARY-HEADING-200/step-27/checkpoint.json` records WebKit 27.2, 1024×768, document 1148px and heading client/scroll 358/513px, with successful scene-art transport. The exact observer method in `journey/private/text-resize.mjs` was inspected.

## Causal review

| Finding | Earliest incorrect checkpoint and correction | Local verdict |
| --- | --- | --- |
| J-01 | The session's dirty state was already true; retained acknowledgement text overrode it in presentation. `savedNotice` is now separate from live/error `message`, and appears only when the draft matches its saved baseline. Undo may restore the acknowledgement truthfully. Pending, failure and retry messages retain priority. No draft, dispatch, identity, scoring or persistence calculation changed. | PASS |
| J-02 | The acknowledged selection already identified the right saved encounter; the remounted local scene still defaulted to Village Green. `open()` now derives an M1 quest scene from that ready selection's binding provenance, after successful acknowledgement and existing captured-binding checks. Failed/unavailable opens cannot select a success scene; unbound practice does not acquire an invented quest context. | PASS |
| J-03 | The enlarged library h1's unbreakable text overflowed its two-column container. `overflow-wrap: anywhere` fixes the producing heading rule, preserving complete text, font size and layout rather than hiding overflow. The original root-unchanged enlargement and a nearby variant both fit. | PASS |

J-02's correction follows WP02-06A's mission-specific composition and visible committed restoration contract. It does not alter saved provenance or shell routing. Existing captured profile/epoch/encounter/episode safeguards remain intact. The small CSS change also applies consistently to adventure h1 headings.

## Author evidence independently inspected

Author root **A**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11fd0-2521-7fc1-87cc-43d4c52e7995`.

`A/results-journey-before.json` retains the original wrong scene and saved-wording failures across bridge/punctuation/merchant. `A/results-journey-reflow-exact-before.json` reproduces document 1148/1024 and heading 513/358 with the correct body-descendant enlargement. These are genuine retained red checkpoints; the handoff's earlier non-invoked function and root-doubling development attempts are not counted as J-03 reproduction.

`A/results-journey-closure.json` contains **28/28 passes**, seven cases each on D1 Chrome, D2 Edge, T1 Chromium touch and T2 WebKit touch; zero retries/skips/unexpected/flaky results. Each final root journey's enlarged-library attachment reports document 1024/1024 and heading 358/358. The original six cases remain present, including native failure/retry, captured-owner/remount and optional-transfer coverage. The seventh case exercises the real root application. The author records passing source/host and Node-only typechecks plus four pure world tests; these unchanged checks were not rerun by this reviewer.

## Independent fresh complete journeys

Reviewer root **R**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11ff1-b321-7d32-898b-4aad7a6c65b7`.

Created private `journey-review-server.mjs`, `journey-review.config.mjs` and `journey-review.spec.mjs`. Verified port 5203 had no listener before starting the owned host. Local identity is `local-independent-journey-correction`, `/playtest/`, actual `index.html` → root StrictMode/App → adventure/facade/native IndexedDB. Fresh Rowan profiles used normal UI actions; runtime access only read snapshots/readiness until final disposal. No saved-state, answer or progression injection.

`R/journey-review-results.json`: **2/2 complete journeys pass**, first attempt, no skipped/unexpected/flaky results, 20.910 seconds total. Chrome **155.0.8059.40** used keyboard activity controls; WebKit **27.2** used touch controls with reduced motion. Shell Hall navigation also used ordinary click. Retained full traces, screenshots and separate `D1-Chrome-journey-checkpoints.json` / `T2-WebKit-touch-journey-checkpoints.json` contain the evidence.

Both journeys reproduce the original sequence: save a six-metre bridge draft, leave, Hall/back, resume the same encounter, wrong Check, committed hint, edit to twelve without checking. The UI now says the idea is unsaved; native saved draft remains `[6]`, Check count 1, and original opportunity/episode identity is retained. Undo restores the saved acknowledgement. A fresh related variant requests another committed hint while the edited draft is dirty: it remains visibly unsaved and does not replace the saved six-metre response. A successful Check then saves/restores the bridge, and reload preserves its world result.

Both continue through punctuation and merchant wrong-Check/hint/edit/Check paths, each with leave/Hall/back/resume. Dirty draft wording agrees with actual panel readiness and saved response; scenes are respectively River Bridge, Whispering Library and Market Square. Full completion and reload retain exactly Q1/Q2/Q3 and three quest receipts. A further bound optional bridge challenge is saved, resumed through Hall in the bridge scene with unchanged opportunity, and completed without adding a story quest receipt.

The punctuation path places `?` in portrait before rotating to 1024×768. It snapshots all computed sizes before doubling `body *` HTMLElement descendants; root and body remain **16px**, heading becomes **90.112px**. Both engines give:

| Enlargement/viewport | Document scroll/client | Heading scroll/client |
| --- | --- | --- |
| Exact observer 200%, 1024×768 | 1024/1024 | 358/358 |
| Same enlarged text, nearby 1000×768 | 1000/1000 | 349/349 |
| Original styles restored, 1000×768 | 1000/1000 | 349/349 |
| Separate root 200%, 1000×768 | 1000/1000 | 544/544 |
| Separate root 200%, 768×1024 | 768/768 | 704/704 |

The original style attributes are restored before root enlargement; the question mark survives both mechanisms, subsequent edits and saved completion. Inspected the retained WebKit scene capture: heading wraps within its column and the illustration is present. The sticky sound bar overlaps part of this scrolled element capture, so the capture alone is not claimed to prove unobscured visibility at every scroll position; native width measurements and retained text support the scoped J-03 result.

Both test contexts disposed their root runtime. The private server's close returned HTTP 200, its process exited 0, and no listener remained on 5203. Console output contains the routine NO_COLOR/FORCE_COLOR warning; no test failures were hidden or retried.

## Exact reviewed files and remaining gates

All final bytes/hashes below were recomputed after the independent journeys and match `A/journey-hashes.json`. Owned source diff whitespace check passed.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/experience/AdventureView.tsx` | 25419 | `1b535d6770ec0840c165a61b56bd2350d676ec409352c0d49e2c9f5887f14f79` |
| `src/experience/QuestActivity.tsx` | 18710 | `a3f8547679f61dc6ed6c88d7a6c7e0fafa5f520972b78468c233d0770effb59c` |
| `src/experience/experience.css` | 6903 | `5ed2be3ac72c3e741448ded05346804d6dfcc86bfe187bd97c2b88e9b2a1381b` |
| `tests/browser/experience.spec.ts` | 35452 | `bbc2181c33af8dba5f7372b3b0586a8d7d352b85480a818b78bc829567146642` |
| `docs/work-package/execution/PUBLISHED-JOURNEY-CORRECTION-HANDOFF.md` | 7993 | `1ca5a4a677dcc043136a8317a68cd84b38ab6868a940d68204de865764a90bdd` |

Controller/foundation must update the D3 adventure discovery/run/result expectations from **six to seven** and run the exact changed candidate on real Linux Firefox. Discovery must retain the six existing cases and include the new actual-root journey; execution must show seven first-attempt passes, original/related receipt evidence and appropriate fixture/root cleanup. A six-case historical D3 result cannot close this correction. Runner changes and CI dispatch are outside this review's write scope.

After Controller-owned publication, the original observers must retest J-01/J-02's complete saved journeys and J-03's exact enlargement on the identified corrected published build, preserving B's original failures and recording replacement identity. This local PASS does not cover deployment/service-worker/offline behavior, network-dependent illustration failures, acoustics, physical tablets, child play or final M1 acceptance. The separately accepted audio correction is a baseline dependency, not re-reviewed here.
