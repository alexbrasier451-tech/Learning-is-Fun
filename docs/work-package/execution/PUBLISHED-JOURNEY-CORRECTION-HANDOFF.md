# Published M1 journey corrections — J-01, J-02, J-03

11 October 2026. Original WP02-06A producer correction, scoped to experience presentation. Local source is frozen and author verification is complete. Independent review, changed-candidate D3, republishing and original observer retests remain Controller-owned. Frozen deployed B has not changed.

## Original evidence and causal findings

Reviewed `docs/playtests/M1/JOURNEY.md` and the original native checkpoints under `artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/journey/`, particularly D1 Q1 resume/retry-draft and T2 enlarged punctuation. The original resume screenshot and accessible DOM show Village Green plus its bridge invitation above the saved bridge task; the edited retry DOM shows 12 metres and changed-since-Check feedback beside “Saved on this device.”

**J-01:** the session correctly marks the draft dirty, and the committed projection still contains the saved six-metre Check. The earliest incorrect checkpoint is presentation: a retained acknowledgement message takes precedence over the current dirty state. A saved notice is now separate from operation/error messages and is displayed only while the current draft matches its acknowledged baseline. Pending/error/retry messages retain priority. Editing after Check/help says the idea is not saved; Undo back to the saved baseline may truthfully show the acknowledgement again. No dispatch, scoring, dirty-state calculation or persistence policy changed.

**J-02:** accepted encounter selection resumes the correct binding, draft, opportunity and episode, but `open()` previously left the local scene at the remounted default Village Green. This is required coherence under WP02-06A's mission-specific composition and visible committed restoration contract, not an optional redesign. After a ready acknowledged selection, AdventureView resolves its quest binding through the existing M1 QUESTS registry and selects that scene. This covers story, optional-transfer and bound revisit routes without inventing a scene for unbound practice. No scene change precedes a successful open, and no saved record or shell route changes.

**J-03:** the exact retained observer method is `journey/private/text-resize.mjs`: snapshot computed sizes for `body *` HTMLElement descendants, then double those inline, leaving the root font unchanged. In native WebKit at 1024×768 after portrait punctuation entry/rotation, the local original reproduces the published measurements exactly: document 1148px in a 1024px viewport; heading scroll 513px in a 358px box. The two-column scene layout above 950px had no long-word wrapping provision. The scene h1 now uses `overflow-wrap: anywhere`, retaining existing font size, layout and complete heading text. After repair the same mechanism fits within the viewport and heading box. Original inline styles are restored before checking the separate 200% root-text enlargement at landscape and portrait widths.

## Exact author-owned changes

- `src/experience/QuestActivity.tsx`: separate saved acknowledgement from live/error status; show it only for a clean draft.
- `src/experience/AdventureView.tsx`: choose the acknowledged bound activity's M1 quest scene when opening/resuming.
- `src/experience/experience.css`: allow scene h1 long-word wrapping.
- `tests/browser/experience.spec.ts`: one new actual-root journey case, bringing this spec to **seven cases**; existing six remain intact. Uses only normal UI actions and read-only access to the actual root runtime snapshot. No new fixture API, answer, completion or reward hook.
- This handoff.

No shell/audio/source-asset/state-policy/root-configuration changes, Git mutation, delegation, deployment, observer/ledger write or review claim. Existing concurrent audio-owner files and unrelated work were preserved.

## Verification and retained attempts

Private evidence root **E**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11fd0-2521-7fc1-87cc-43d4c52e7995`.

Private dev host: port **5203**, `/playtest/`, build identity `local-published-journey`, private cache/output, one browser worker, zero retries. Configs: `E/journey-server.mjs` and `E/journey.config.mjs`. Actual root is `index.html` → main StrictMode/App/shell → actual adventure/facade/native IndexedDB. Existing six cases retain their actual producer fixture. No frozen published data was injected locally.

The new full journey creates a fresh player; places 6m; leaves; visits Hall and returns; resumes the same bridge encounter; makes the wrong Check; requests a committed hint; edits to 12m without checking; asserts truthful draft status while the saved draft remains 6m and the sequence/opportunity remain unchanged; undoes to the saved baseline; edits/checks successfully; reloads and verifies the committed world. It continues through punctuation and merchant wrong-Check/hint/edit/Check variants, each with Hall/back/resume and the correct scene. Exactly three quest receipts remain. Punctuation also traverses the original text-only enlargement, original-style restoration and independent root-text landscape/portrait variant, with its selected question mark retained.

| Evidence | Result |
|---|---|
| `E/results-journey-before.json` | Original root journey reproduces both J-01 and J-02, including punctuation/merchant variants; native trace and snapshot retained. |
| `E/results-journey-fixed-d1.json` | Full repaired original D1 root journey passes. |
| `E/results-journey-final.json` | J-01/J-02 candidate: all seven cases × four projects = 28 passed, no retries/skips. |
| `E/results-journey-reflow-exact-before.json` | J-03 original body-descendant mechanism reproduces 1148/1024 document and 513/358 heading overflow exactly; full journey continues through saved success. |
| `E/results-journey-reflow-fixed.json` | Full T2 root journey, exact J-03 mechanism and independent root-text variant pass after the h1 rule. |
| `E/results-journey-closure.json`, final seven-case four-project regression | **28/28 passed**, zero retries/skips: D1 Chrome, D2 Edge, T1 Chromium touch, T2 WebKit touch. Enlarged library document/client width is 1024/1024 and heading scroll/client width is 358/358 in all four projects. |
| Strict source/fixture typecheck and separate Node-only browser/pure-test typecheck | Passed after final test/CSS changes; no emitted or shared build cache. |
| Pure world suite | 4/4 passed, no cache/filesystem module cache, one worker; no pure world source changed. |
| Owned `git diff --check` | Passed. |

Two test-development attempts remain honestly retained: `results-journey-reflow-before.json` did not invoke its evaluation function, so yielded no measurement; `results-journey-reflow-repro.json` doubled the root too and passed because rem columns widened. Neither establishes the reported J-03 reproduction. The exact retained observer helper then resolved that mechanism mismatch, producing the measurements above before the CSS fix.

Actual screenshot/JSON extracts are under `E/journey-images/`, including `T2-WebKit-touch-library-text-200.png` and `T2-WebKit-touch-published-bridge-dirty.png`. The enlarged scene was visually inspected: heading text wraps within its column, and the artwork remains intact. No clipped-overflow workaround or reduced font size.

Exact final byte lengths and lowercase SHA-256 for the four source/test files plus this handoff are in `E/journey-hashes.json`. **Port 5203 is released**, verified after stopping the identity-checked private server. No further source changes are planned before independent review.

Blank WebKit illustration remains separate: Controller reports observer localization to a failed native fetch before SVG parsing, recovered by ordinary reload on frozen B. This correction changes no media loading and claims no resolution of network or acoustic observations. No physical tablet, child-use, offline/service-worker, publication or final M1 acceptance claim.
