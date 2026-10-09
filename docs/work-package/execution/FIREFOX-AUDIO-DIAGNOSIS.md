# Firefox audio activation — active diagnosis

9 October 2026. **Cause not yet established; fixture-only checkpoints are ready
for independent review and the original Linux Firefox rerun.** Production
activation/policy/scoring/state is unchanged. A local Chromium pass does not
close this investigation.

## Original failing input and preserved evidence

- Candidate `b0b36714b0c545173be952d44c445a474b4579d8`, accepted audio component
  `24fb54`, GitHub run `37884581632` (Controller-provided retained artifact).
- Ubuntu 24.04, Node 24.21.0, Playwright 1.64.0, matched Firefox 157.0 / build
  1555, desktop 1280×720, one worker, no retries.
- Exact two smoke inputs: `first visit is silent; keyboard controls preserve
  independent choices under Silence all` (fake preference writer), and
  `real facade profiles and visibility hook clear transient speech and cues
  without changing installation choices` (accepted real facade/IndexedDB).
- Both click the real **Enable sound** button after settings load. Required:
  explicit consent → native activation → ready → permitted sound/lifecycle
  checks. Observed: consent is saved, Enable becomes Retry sound, the UI says
  waiting for permission, and activation polling stays `inactive` for five
  seconds. Both assertions fail; no expectation was weakened.
- Evidence root:
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37884581632`.
  Read `job.log`, `artifact/audio/results.json`, both retained error contexts,
  and both trace ZIPs directly. Setup/typecheck/discovery/install passed. The
  trace console entries contain Vite/React messages but no recorded native
  AudioContext state, resume settlement, device error or page error.

Logic-Flow Diagnosis was invoked once for this new investigation. Existing
implementation machinery remains in context; no redelegation, Git/external
action or broad package run was performed.

## Ordered checkpoint ledger

| Checkpoint | Expected | Original Firefox evidence | Verdict |
|---|---|---|---|
| Fixture/module load and control discovery | Actual host/control code, loaded settings | Both pages load and the click locators complete. | Correct at the observed boundary. |
| Explicit button activation | Enable action reaches runtime | Click completes; resulting UI reflects sound enabled and offers Retry. | Action delivery evidenced. |
| Preference handoff/acknowledgement | Consent true, loaded, no silence latch; saved state reported accurately | Both rendered panels say sound choices saved; first-run levels and channel choices remain correct. | Consent/save boundary evidenced; exact native-call timing not captured. |
| Visibility/live policy at native call | Visible, loaded, enabled, not latched | Visibility/user-activation and native-call checkpoint were not retained. | Unknown. |
| Native context construction and `resume()` | One context; actual native promise settles; state becomes running | No context/resume telemetry in retained traces. | Unknown; cannot assign product/fixture/device cause. |
| Resume continuation/generation check | Current permitted continuation publishes ready | Public activation remains inactive in both hosts. | Earliest **observed** failure is the missing activation transition; causal owner inside the preceding boundary remains unlocalized. |
| Playback and later lifecycle | Real source start, then requested control behavior | Neither test reaches that stage. | Downstream, untested on this run. |

The failure also occurs with the fake writer, so it is not exclusive to the
real durable facade. This does not prove the preference path universally
correct or prove Firefox unsupported. Source inspection shows `inactive` can
remain when policy prevents entry, a native resume remains pending, or a
continuation is invalidated. Constructor/settled-resume failure has other
branches, but the old trace does not identify which native path occurred.
No timeout extension, automatic retry, ready relabelling, fake native context,
skip, browser switch or device workaround has been applied.

## Exact diagnostic delta

Only these paths changed in this diagnostic pass:

1. `tests/fixtures/audio.tsx`
   - Ordered `sequence`/`performance.now()` checkpoints for capture-phase
     Enable/Retry/Exit clicks (including isTrusted and user activation),
     preference handoff, visibility forwarding, public audio snapshots,
     native context construction/state changes and native resume call/
     fulfillment/rejection/synchronous throw.
   - Context snapshots expose state, currentTime, sampleRate, baseLatency and
     destination channel capability. `diagnostics()` returns these with live
     audio/preference status, browser visibility/user agent and existing events.
   - The resume observer calls the same bound native method synchronously,
     returns its **original promise**, and observes fulfillment/rejection without
     resolving/rejecting/retrying/timing it out or setting activation. The
     statechange listener uses `addEventListener`, preserving the controller's
     own handler. Capture/status listeners do not issue commands. Teardown
     removes added listeners before disposing the existing owner.
2. `tests/fixtures/audio-api.ts`
   - Adds only erased `diagnostics(): Record<string, unknown>` to the shared
     Node-safe fixture contract. No DOM/TSX implementation import.
3. `tests/browser/audio-controls.spec.ts`
   - Adds an afterEach failure attachment, `audio-failure-checkpoints.json`,
     containing actual browser version and fixture diagnostics. If capture
     itself fails it records that error instead. No test input, expectation,
     timeout, discovery name or pass/skip policy changes.
4. This diagnosis report.

No production file, shared configuration, CI workflow, dependency, scoring or
state-producer edit. Source is stable for independent diagnostic-diff review.

## Local instrumentation checks

- Exact strict Node-only spec typecheck (ES2023, Node types, no JSX/DOM) passes.
- Separate browser fixture/API typecheck (ES2022/DOM/React JSX) passes.
- `./tests/fixtures/audio-run.ps1 -Project audio-chromium -Filter 'first visit is silent; keyboard controls|real facade profiles and visibility hook'`
  — **2 passed** with unchanged original inputs/expectations. Evidence root:
  `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-d35ff05717c343a18072374dbd08be06`.
- Inspected the existing real-profile JSON attachment: click sequence 19 is
  trusted, visible and user-activated; context sequence 26 is running/48kHz;
  native-resume call 27 and fulfillment 28 preserve running; native statechange
  33 is recorded. The test subsequently exercises the real facade/profile/
  visibility path and passes. This establishes useful observational telemetry
  and supporting local compatibility, not Linux Firefox correctness.
- Port 5184 only, one worker, private cache/output, normal server teardown.
  No local Firefox install or launch was attempted against the known Windows
  limitation. No unit/fake-race suite was rerun because runtime behavior did not
  change.

## Controlled remote next step

Controller should review/commit these diagnostic paths and rerun the **existing
manual D3 workflow with the same bounded ten cases and unchanged expectations**.
No new workflow, input, framework or shared CI edit is required: the existing
audio results/Playwright artifact retention includes the new failure attachment.
The same audio selection still discovers exactly two original tests.

On returned Linux evidence, continue this same diagnostic loop:

- No `native-resume-call`: inspect the captured visibility/live policy and
  context-construction boundary before deciding a repair owner.
- Call with no settlement/state progress: inspect actual native/device/runner
  evidence next; do not infer unsupported browser from a pending promise.
- Rejection or throw: use the actual error, context state and user-activation
  checkpoint to distinguish policy/native/fixture causes.
- Native fulfillment/running but inactive public state: trace cancellation and
  policy snapshots around the continuation to locate the invalidation owner.

Only after that evidence establishes a defect should a narrow causal repair be
made. The original explicit-enable input must then traverse actual Firefox 157
on Linux end to end; supporting local evidence cannot close the loop. After a
green original run, run relevant variants/regressions and a fresh case. Acoustic,
published and physical-device gates remain separate.
