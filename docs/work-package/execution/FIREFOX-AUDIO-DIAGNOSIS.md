# Firefox audio activation — original native-host loop closed

9 October 2026. **Run 37889547310 passes both original audio cases on actual
Linux Firefox 157.0 after foundation-owned native output provisioning.** The
retained real-facade checkpoints show native resume fulfillment, running context
with advancing time, and public ready status. This closes the narrow original
native-startup loop. Production audio and the diagnostic fixture/spec remain
unchanged; broader acceptance gates remain separate.

## Green original-flow rerun 37889547310

Candidate `18f08b01e7ffc839b0fb14d686ff8341d3fd362e`, attempt 1. Evidence root:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37889547310`.
Inspected retained `artifact/run.json`, `artifact/audio-output/readiness.json`,
`artifact/audio-output/cleanup.json`, all four suite `results.json` files,
the real-profile JSON attachment, the first-visit trace, and `job.log`.
This update changes only this report; no source change, test rerun, Git operation
or external call was made.

The run records Linux, Node 24.21.0 and 1280×720; the job log identifies matched
Firefox 157.0/build 1555 for Ubuntu 24.04. Each selected D3-Firefox project used
one actual worker, zero retries and one repetition.

| Original bounded selection | Passed | Skipped / flaky / unexpected |
|---|---:|---|
| Adult | 3 | 0 / 0 / 0 |
| Hall | 3 | 0 / 0 / 0 |
| Audio | 2 | 0 / 0 / 0 |
| Creative | 2 | 0 / 0 / 0 |
| Total | 10 | 0 / 0 / 0 |

Both original audio titles preserved below have `status=expected` and an actual
`passed` result. The complete selected real-facade profile/visibility flow and
first-visit keyboard/Silence-all flow completed, beyond the previously failing
explicit-enable assertion. This is the bounded ten-case run, not the entire
audio regression suite or every D3 acceptance check.

### Observed native host and activation checkpoints

Before browser cases, readiness at `2026-10-09T05:39:31.210Z` is true:
PulseAudio 16.1 is reachable through the configured native Unix socket;
module ID 0 is `module-null-sink`, module ID 1 is
`module-native-protocol-unix`; default sink `d3_output` belongs to module 0,
is unmuted at 100% on both channels and reports stereo 44100Hz. The native
server and sink are software output infrastructure. Cleanup at
`2026-10-09T05:40:13.387Z` records exit code 0, no signal/error/stderr and no
log truncation; this records the cleanup command's success.

The successful `real-profile-and-visibility-forwarding.json` attachment reports
actual browser version 157.0 and binding `real`. Its fixture-clock checkpoints:

| Checkpoint | Retained observation |
|---|---|
| Explicit Enable | Sequence 19, 1449ms; trusted, visible, active user gesture. |
| Native context | Sequence 26, 1455ms; suspended/time 0, 44100Hz, destination channels 2 and maximum channels 2. Exactly one context. |
| Native resume call | Sequence 27, 1455ms; loaded, enabled, unlatched, visible and active user gesture. Exactly one call. |
| Native fulfillment | Sequence 40, 3095ms; running, currentTime 0.0203174603s, maximum channels 2. Exactly one fulfillment; no rejection/throw event. |
| Public continuation | Sequence 41, 3096ms; activation ready. |
| Native statechange | Sequence 42, 3102ms; running and public ready. |
| Subsequent progression | Sequence 43, 3392ms: currentTime 0.3018594104s; sequence 106, 4380ms: 1.3032199546s, still running/ready. |
| Later flow | Two source-start events; final sources empty, one context, readiness true with no pending/failed command or preference flags. Speech is explicitly fixture-simulated. |

The first-visit trace independently records Enable click `nnum@248` at trace
time 9982.413ms and native public activation evaluation `nnum@254` returning
`ready` at 10183.397ms. That successful case has no failure-checkpoint attachment;
do not infer a separate complete native event ledger for it from the real case.

### Bounded causal conclusion and limits

The earlier captured native resume never settled, the context clock stayed zero
and maximum output channels were zero despite correct gesture/policy inputs.
With a verified native server and usable software sink, the same original
audio inputs now traverse native fulfillment and the unchanged public
continuation successfully. This supports **runner native-output provisioning
as the cause of this captured startup failure**, and the foundation-owned
provisioning as the sufficient repair for the original bounded flow. It does
not establish the exact internal Firefox/backend failure mechanism or prove
that one particular service setting alone was necessary. No product activation
workaround is indicated by these observations.

Read-only hashes of the current controller, speech adapter, fixture, fixture
API and browser spec still match the earlier source hashes below. There was
no audio source, expectation, timeout, retry, skip or browser substitution in
this report update. The prior failed runs remain evidence, not overwritten
successes.

The job log also retains a Firefox `Script terminated by timeout` warning at
`05:40:03.037Z`, naming audio fixture `teardown` at served line 512. The audio
results nevertheless report both cases passed. The warning's cause was not
investigated in this documentation-only update; neither the pass nor native
daemon cleanup exit 0 establishes warning-free fixture teardown.

Software sink readiness, native graph progression and browser assertions do
not establish heard audio quality, actual local speech quality, physical-device
behavior, published-environment behavior or D1 acceptance. No fresh additional
case or full audio regression rerun is claimed here. Broader validation remains
with its existing owners; this closure is limited to the original native-host
startup failure and returned bounded regression selection.

| Green-run artifact | Lowercase SHA-256 |
|---|---|
| `artifact/audio/results.json` | `ce520fd034ad803d11bf56772b91b6a88d283a4270a584d2b872aad0cbffdc3b` |
| `artifact/audio-output/readiness.json` | `f599508bf70ae2038f5d0e9565ce39e89a9e7b9a08d5d3ff6197c242d831287d` |
| `artifact/audio-output/cleanup.json` | `9912e27e407ebc427b376442aecee70978d14a1ad1c6f4acb2a17bc1343d6679` |

## Preserved investigation history

The sections below record the earlier failed runs, instrumentation and proposals
as they stood before the green rerun. Their red-status statements and requested
next steps are historical; the outcome and limits above supersede them.

## Diagnostic rerun 37885535995 — native boundary localized

Controller returned complete evidence for candidate
`ffd1d39f103f8b2b694f2db203a6acc160e40dfd`, artifact ID `11596108124`, at
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37885535995`.
Both original audio assertions again fail `inactive` versus `ready` on actual
Firefox 157.0. Adult/Hall pass; creative is not reached. Read the new audio
result failure attachments and job log without executing external actions.

Exact retained browser-trace identifiers (trace clock milliseconds, distinct
from fixture `performance.now()` below):

| Run / case | Enable click call ID / start | First inactive poll / end | Last inactive poll / end |
|---|---|---|---|
| Original 37884581632 / real | `kewe@56` / 2340.125 | `kewe@59` / 2416.461 | `kewe@80` / 7301.853 |
| Original 37884581632 / fake | `zlvh@67` / 9559.227 | `zlvh@70` / 9624.969 | `zlvh@91` / 14507.288 |
| Diagnostic 37885535995 / real | `hrro@56` / 3978.282 | `hrro@59` / 4109.264 | `hrro@80` / 9014.201 |
| Diagnostic 37885535995 / fake | `myml@67` / 12981.022 | `myml@70` / 13069.271 | `myml@91` / 17969.087 |

Each trace records eight inactive polls. Diagnostic fixture event IDs are the
`sequence` values in `audio-failure-checkpoints.json`, included in results.json.

| Ordered checkpoint | Real facade case | Fake-writer case | Interpretation |
|---|---|---|---|
| Actual explicit click | Sequence 19, 1050ms; trusted=true | Sequence 55, 985ms; trusted=true | Both inputs reached the intended activation gesture. |
| Native context constructed | Sequence 26, 1053ms | Sequence 60, 988ms | Exactly one context in each host; no construction exception. |
| Native resume invoked | Sequence 27, 1054ms | Sequence 61, 988ms | Actual native call, once; visible document, active user activation, loaded settings, soundEnabled=true, silenceAll=false. |
| Subsequent preference status | 5 public status updates; generation/savedGeneration ends 1/1 | 4 updates; generations end 3/3 | All subsequent live snapshots remain visible/loaded/enabled/unlatched; no policy violation or failure. |
| Native settlement/statechange | Zero fulfillment/rejection/throw records; zero statechanges | Same | The returned native promise has not settled. The controller's post-await continuation has not run; it was not an observed discarded ready continuation. |
| Failure-time native context | suspended, currentTime=0, 44100Hz, baseLatency=0, destination channelCount=2 but maxChannelCount=0 | Identical | Native processing never starts and no usable maximum output capacity is exposed. Public inactive follows the still-pending native resume. |

This rules out the hypothesized lost click, missing consent, failed preference
save, hidden page, cleared user activation at the call, constructor throw, and
an observed fulfilled-resume continuation bug for these two captured inputs.
It localizes investigation ownership to Firefox/native audio plus the Linux
runner's output provisioning. **Missing/unusable native output is the leading
environment hypothesis, not yet a proved PulseAudio configuration defect.**
The artifact does not inventory the audio server/sinks or retain native browser
stderr. No production repair is justified yet. Relabelling inactive, relaxing
the assertion, or adding a timeout would not make the native graph run.

Read-only lowercase SHA-256 observations for evidence/source reproducibility:

| File | SHA-256 |
|---|---|
| Original run `artifact/audio/results.json` | `03ab3eec190e7d21595768f9e79a0738c8cc3e33c024bc4b22724cf12b904d03` |
| Diagnostic run `artifact/audio/results.json` | `a4ac10b767913f3687b3fb801aa2956884479f7273a6fa1d84aaf15792386f17` |
| `src/audio/controller.ts` | `f28b0eb87ae862221bb1404a528d1b2c4868f054822f97d9be69b99ba376bdb1` |
| `src/audio/speech.ts` | `1c3a7e89e2975f6f1b20c7c3bbfc3befd8660da4bb7e33df449ec575a49c8e78` |
| `tests/fixtures/audio.tsx` | `606019b8f1d6ede9d46015077877a5d7f5a536d373f453d3f0111f42b9384fd5` |
| `tests/fixtures/audio-api.ts` | `a8c9c4d1ec2f2e81c0d2af1d90574079b7234841cd84e5051270355fe4eed9d5` |
| `tests/browser/audio-controls.spec.ts` | `51b93b9951a130a954c0228d680951da8ce5d4d9cc7e80aadfd3db8b062b80d0` |

### Concrete next observation / minimal foundation-owned proposal

No further product instrumentation or browser-spec changes are needed now.
Foundation/Controller should add a bounded native-output inventory immediately
before the existing serial test step and retain it alongside the existing
artifact (or print it into the retained job log):

```sh
probe() {
  printf '\ncommand:'; printf ' %s' "$@"; printf '\n'
  if "$@"; then printf 'exit=0\n'; else printf 'exit=%s\n' "$?"; fi
}
{
  probe command -v pulseaudio
  probe command -v pactl
  if command -v pactl >/dev/null 2>&1; then
    probe pactl info
    probe pactl list short sinks
  fi
  probe ls -ld /dev/snd
  if test -r /proc/asound/cards; then probe cat /proc/asound/cards;
  else printf '/proc/asound/cards absent or unreadable\n'; fi
  printf 'PULSE_SERVER=%s\nPULSE_SINK=%s\nXDG_RUNTIME_DIR=%s\n' \
    "${PULSE_SERVER-<unset>}" "${PULSE_SINK-<unset>}" "${XDG_RUNTIME_DIR-<unset>}"
} > "$AUDIO_VERIFY_ROOT/native-output-before.txt" 2>&1
cat "$AUDIO_VERIFY_ROOT/native-output-before.txt"
```

Also set `DEBUG=pw:browser` on the existing test step to retain actual browser
stderr in `job.log`. This logging namespace is supported by the installed
Playwright 1.64.0 browser logger; no browser preference/autoplay/security override
is proposed. Add `native-output-*.txt` to artifact retention if files are used.

Per Controller's follow-up, the next run is **read-only observation only**. Do
not start/reconfigure an audio service, add a null sink, install a package or
change a browser preference yet. Zero maximum channels alone is not sufficient
to prove a missing PulseAudio service.

The minimal required observations are:

1. Whether `pactl`/`pulseaudio` are installed, whether a native audio server is
   reachable, and the actual sink/default-output list (`pactl info` and
   `pactl list short sinks`, preserving failures).
2. Kernel-device presence (`/proc/asound/cards` and `ls -ld /dev/snd`), recording
   absence explicitly. This distinguishes a headless runner without a physical
   device from an inaccessible or misconfigured service; it does not require
   physical hardware if a valid native server output exists.
3. Only relevant endpoint variables, if set: `PULSE_SERVER`, `PULSE_SINK`,
   `XDG_RUNTIME_DIR`; do not dump the full CI environment.
4. Actual Firefox launch/native stderr using `DEBUG=pw:browser` on the unchanged
   bounded test step, plus the already-retained fixture failure checkpoints.

Capture the inventory immediately before audio testing and again on audio
failure in the same job, preserving command exit statuses in the text. The
foundation/CI owner can implement this in the existing workflow without a new
framework or test oracle. Controller returns that evidence to this audio owner.
If it confirms a missing/unusable service or sink, propose the smallest
foundation-owned provisioning correction then. If a usable sink already exists,
follow the native backend errors instead. No environment repair is claimed now.

The decisive rerun must show, on actual Firefox/Linux, native resume fulfillment,
running context with time progression and usable output capacity, then the
original end-to-end control/profile assertions passing. If still red, retain
the attempt and continue this same loop from the new earliest divergence.
Only this report changed in this follow-up; no source, CI, environment or local
test rerun was made because there is no newly changed local executable input.

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
