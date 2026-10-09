# WP02-06A — StrictMode lifecycle correction

9 October 2026. Author correction for the newly established WP01-02A integration condition. Both original integrated D1 root-app paths now pass, as recorded below. Independent correction review and changed-candidate D3 remain pending. Prior whole-child acceptance at `5f6d877` remains the baseline; this report does not claim shell acceptance.

## Earliest divergence and narrow correction

The shell's unchanged root StrictMode path creates River, selects River, opens Q1, places 6+6 and chooses Check. No successful feedback appears; the companion two-profile case observes dirty=false after placement. Original evidence: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d/results-d1-trace.json` and `output-d1-trace` traces/error contexts.

`createActivitySession` subscribed during useMemo's render-time calculation. StrictMode could discard one such subscribed instance, then effect cleanup permanently disposed the retained instance. Replayed effect setup registered that same disposed object. The first incorrect semantic checkpoint was a live panel registration backed by a disposed session: editing returned before draft mutation, so Check could not reach the facade. The evaluator, repository and shell routing were downstream of the defect.

Session construction is now render-pure. Effect setup connects the session to the actual facade and synchronizes its projection; cleanup disconnects that subscription, stops reading and unregisters its panel. Replay reconnects the same captured profile/epoch/encounter/episode session. React owns store-listener cleanup. Draft, retry envelope and stable lifecycle identity survive effect replay; a true remount creates a new session. Disconnected sessions neither publish to listeners nor process completion callbacks. A queued command checks the binding before dispatch; an already-dispatched command may finish for its captured owner, but its detached panel cannot produce a celebration or mutate the replacement view. Pending flags settle even on the detached path.

No StrictMode removal, downstream production remount workaround, new runtime, grading or reward logic. No shell/root configuration edits by this author.

## Exact changed files

- `src/experience/QuestActivity.tsx`: reversible effect-owned session connection and detached-operation settlement.
- `tests/fixtures/adventure.tsx`: actual producer fixture now uses StrictMode; pass-through facade subscription counting and an explicit test-only forced world remount.
- `tests/fixtures/adventure-api.ts`: erased diagnostics for those counts and forced disposal.
- `tests/browser/experience.spec.ts`: extends the existing two-profile case, leaving the suite at six cases.
- This correction report.

The forced-remount hook bypasses leave only for a disposal test; it changes no saved data. Subscription instrumentation delegates to the same actual facade. All commands still use native IndexedDB and the accepted controller/catalogue/validator. No solution or progression hook was added.

## Verification and retained attempts

Evidence root **E**: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a11fd0-2521-7fc1-87cc-43d4c52e7995`.

- Initial six-case D1 StrictMode regression: 6 passed (`E/results-strictmode-d1.json`).
- Focused extended two-profile case: passed (`E/results-strictmode-remount-fixed.json`). Three actual leave/resume cycles preserve the saved two-metre plank, add exactly one session subscription while active and return to baseline after unmount. Held Check plus forced unmount leaves no active panel, returns subscriptions to baseline, commits only for its captured child, settles facade readiness and shows no stale celebration.
- First focused attempt used a singular prose expectation against the existing widget's plural label. Its DOM showed the correct saved plank and count; the assertion now checks the placed-plank control. Retained `E/results-strictmode-remount.json` and its trace. No widget copy/producer change.
- Initial full run (`E/results-strictmode-final.json`): D1/D2/T1 each 6/6, T2 5/6. The new T2 subscription assertion ran after heading visibility but before passive-effect connection (2 versus 3 subscriptions). It now waits for the actual connection/cleanup count; original whole extended T2 scenario passed in `E/results-strictmode-remount-webkit.json`. Full T2 rerun **6/6 passed**, zero retries/skips (`E/results-strictmode-webkit-closure.json`). All six cases have passing coverage on all four projects; the initial failed attempt remains retained.
- Both strict source/host and Node-only test typechecks pass. The first host typecheck caught an overly narrow diagnostic wrapper annotation (StateController lacks facade preferences/ready/prepareCommand/dispose); `typeof facade` preserves the actual facade type. No runtime behavior change.
- Existing pure world suite: 4/4 passed, no cache/filesystem module cache, one worker.
- First corrected root-app run on 5195, executed by the shell owner: **causal checkpoints recovered**, but this attempt was not a full scenario pass. The same 6+6 input reaches “Your idea worked!”, and placement reports dirty=true. `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d/results-d1-producer-correction.json` retains both scenarios: they advance past the original failures and then fail at later checkpoints. The first reaches Help-close focus restoration. The second reaches retry after Silence all has committed a newer revision: exact retry correctly conflicts. These historical failures remain retained; final integrated results follow.
- **Integrated D1 closure, verified from shell-owner JSON reports:** `real shell keyboard, help focus, Hall, adult barrier and supported reflow` is expected/passed with retry=0 and no errors in `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d/results-d1-layout.json`. `two-profile suspension failure, exact retry, safe discard and live readiness` is expected/passed with retry=0 and no errors in the same directory's `results-d1-shell-correction.json`. The passes are in two reports, not a single two-pass report. The latter also retains the first scenario's intermediate ambiguous Hall locator failure; the final layout report closes that whole scenario after the shell owner's focus/locator correction. Thus both original complete root-app paths are green, including bridge edit/Check and suspension failure/retry/discard. This author inspected both reports, changed no frozen source and did not use or start 5195.
- Independent reviewer is probing held assistance across remount on its 5194 session. That review result is pending; this author has not changed frozen source or taken the port back.

The four source/test files are frozen for the coordinated root rerun and independent review. `E/strictmode-hashes.json` records their exact bytes and lowercase SHA-256 plus this report's current snapshot. Private port **5194 is released**, verified after stopping the identity-checked private server. Only this report will be updated when the Controller supplies original root-app results. D3 correction review/CI remains Controller-owned. No physical-device or acoustic claim, shell acceptance, staging or commit.
