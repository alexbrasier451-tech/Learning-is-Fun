# Firefox audio diagnostics — independent review

9 October 2026. Report-only review of the fixture instrumentation for the existing active Logic-Flow investigation.

**Current verdict: the two original D3 audio smoke cases PASS on actual Ubuntu Firefox 157 after native CI output provisioning, independently inspected in run `37889547310`.** The addendum below closes the original activation-stall check for this provisioned runner and records the supported environmental cause. It does not claim a product-code repair, full audio matrix, published playback or acoustic acceptance.

The initial diagnostic-readiness review below is preserved as historical evidence. Its unresolved-failure statements describe that earlier checkpoint and are superseded by the final remote-results addendum.

## Original failure remains the decision gate

Reviewed [FIREFOX-AUDIO-DIAGNOSIS.md](FIREFOX-AUDIO-DIAGNOSIS.md), the three changed fixture/spec files, the retained original audio error contexts and relevant job log, and the local instrumented Chromium result/attachment. The retained evidence is under `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37884581632/` (`job.log` is the parent log's actual filename).

Run `37884581632`, candidate `b0b36714b0c545173be952d44c445a474b4579d8`, failed both original explicit-Enable inputs on Ubuntu Firefox 157:

- `first visit is silent; keyboard controls preserve independent choices under Silence all` — fake preference-writer mode.
- `real facade profiles and visibility hook clear transient speech and cues without changing installation choices` — actual facade/native IndexedDB mode.

Both retained failures require activation `ready`, observe `inactive`, and expire at the original five-second polling limit. The error contexts show loaded controls, saved consent, Retry sound and the waiting-for-permission notice. They do not establish whether native resume was called, stayed pending, or had its continuation invalidated. Adult/Hall passes do not close this audio failure. No cause is inferred merely from the fact that both preference modes fail.

## Exact delta and behavior preservation

Without using Git, reversed only the inspected diagnostic additions in memory and compared their exact SHA-256 values with this validator's prior accepted binding hashes. All three match:

| Path | Exact inspection result |
|---|---|
| `tests/fixtures/audio.tsx` | Removing the new telemetry helpers, handoff/context/resume/status/click observations, diagnostics getter, visibility checkpoint and corresponding teardown removals reproduces `b15f1190bd5aa3d33848d8f12b2c1b743358771e5e985152e1135dfd2eaf409a`. Existing native media calls, fixture modes, real facade wiring and lifecycle actions are unchanged. |
| `tests/fixtures/audio-api.ts` | Removing only the erased `diagnostics(): Record<string, unknown>` member reproduces `3c89bf42fbbd69bdccae1eec03b49782c1d89bbe313915de218c61cfb9f38b3d`. No browser implementation crosses the Node type boundary. |
| `tests/browser/audio-controls.spec.ts` | Removing only the new afterEach attachment hook reproduces `0bd2dd675c1f8f17a5d4ab76178cb2cbe1f9a9401721695c581b2ea69560e737`. All original test names, actions, assertions, polling behavior and expected outcomes are byte-identical. |

Production audio controller and speech hashes remain the independently accepted `f28b0eb87ae862221bb1404a528d1b2c4868f054822f97d9be69b99ba376bdb1` and `1c3a7e89e2975f6f1b20c7c3bbfc3befd8660da4bb7e33df449ec575a49c8e78`. No activation/policy change is hidden in those paths.

The instrumented resume method calls the saved native method bound to the created context synchronously, exactly once, then returns the original promise. It does not await an alternative promise, inject a timeout, settle/retry the native operation, resume another context, or assign public activation. Native state telemetry uses `addEventListener`; it does not replace the controller's `onstatechange`. Click capture reads label/trust/activation and neither cancels the event nor issues a command. Status subscriptions only read snapshots and append records. Visibility forwarding adds a read-only checkpoint before the existing unchanged `setVisible` call. Teardown removes new listeners before disposing the existing owner.

The failure hook runs only when actual status differs from expected status. It attaches the actual browser version and serialized fixture observations, with a capture-error fallback. It does not change expected status, invoke Enable/Retry, or replace the failing assertion. Both original failures occur before their test bodies tear down the fixture, so this hook can inspect the original failed state. Existing Playwright failure artifacts remain available alongside the new attachment.

## Narrow independent observer check

Executed the actual observer assignment extracted from the current fixture in a private Node probe. The probe supplies a controlled native-method boundary; it is an instrumentation check, not substitute browser/product evidence.

| Native boundary case | Independent result |
|---|---|
| Pending promise | Correct context `this`, one synchronous native call, strict identity with the returned promise, no settlement after microtasks and only the call checkpoint. |
| Fulfilled promise | Same original promise and fulfillment value; one call and one fulfillment checkpoint; no context-state mutation. |
| Rejected promise | Same original promise and exact rejection object; one call and one rejection checkpoint; no retry or conversion to fulfillment. |
| Synchronous throw | Same exact thrown error object reaches the caller; one call and one throw checkpoint. |

**All four cases and all three exact-delta checks passed, exit 0.** Private evidence is `C:/Users/alexb/AppData/Local/Temp/firefox-audio-diag-review-60d0ee8fc92f4ca1af788a4895803773/` (`review.mjs`, `results.json`). An initial private baseline reconstruction assumed an extra trailing newline; that probe-only assumption was corrected, after which exact byte matching passed. No source correction was needed.

As with any synchronous telemetry and promise observer, this adds observation work and a microtask reaction; it is not a claim of zero timing perturbation. The observed fulfillment checkpoint is registered before the controller's await continuation, so an `inactive` public snapshot at that checkpoint alone is expected and must be interpreted with the following `audio-status` records. It does not by itself prove that a fulfilled native resume failed to activate the runtime.

## Reused local evidence and limits

Reused the author's strict Node-only and separate DOM/JSX fixture typechecks from the diagnosis report. Inspected local result root `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-audio-d35ff05717c343a18072374dbd08be06/`: **2 expected, 0 unexpected/skipped/flaky**, covering both unchanged original inputs on Chromium.

Decoded its actual profile/visibility JSON attachment. Sequence 19 records a trusted, visible, user-active Enable click; sequence 26 records a running 48kHz native context; 27 records native resume entry, 28 its fulfillment, and 33 a native statechange. This demonstrates usable observations on the local passing path. It does not resolve the Linux failing path or prove environmental equivalence. No browser server, new matrix run, local Firefox install, workflow edit or external action was performed by this reviewer.

Reviewed diagnostic hashes:

- Fixture: `606019b8f1d6ede9d46015077877a5d7f5a536d373f453d3f0111f42b9384fd5`.
- Pure API: `a8c9c4d1ec2f2e81c0d2af1d90574079b7234841cd84e5051270355fe4eed9d5`.
- Browser spec: `51b93b9951a130a954c0228d680951da8ce5d4d9cc7e80aadfd3db8b062b80d0`.

## Handoff

Controller may commit/push/dispatch these observations through the existing bounded ten-case remote workflow with unchanged original inputs and expectations. This reviewer has performed none of those external actions and requests no new workflow. On returned Linux evidence, continue the same diagnosis at the earliest divergent visibility/policy/context/resume/continuation checkpoint. A local pass or a newly instrumented remote pass alone does not retrospectively establish the original cause; preserve the failed run and assess the new observations honestly.

The original Firefox cases must traverse the complete intended flow on the required target before that failure can close. No timeout extension, skip, alternative engine, synthetic ready state or product repair is accepted by this review. Published and actual-listening obligations remain separately owned. The diagnosis report's phrase “physical-device gates” should be read only as a limit on unsupported claims: physical-device and child testing are separate future activities, not new mandatory completion requirements.

Only this validation report and private probes were written. No production/configuration/Git/shared-status change, delegation or other-chat message was made.

## Original remote inputs now green — independently inspected results

9 October 2026. Candidate `18f08b01e7ffc839b0fb14d686ff8341d3fd362e`, run `37889547310`, attempt 1. Evidence root: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37889547310/`. Read `artifact/run.json`, the four results files, audio JSON attachment and both trace ZIPs, relevant rendered trace frames, `audio/browser.log`, `job.log`, `audio-output/readiness.json`, native configuration, daemon log and cleanup record. Also inspected the earlier diagnostic failure attachments from runs `37885535995` and `37887423464` and the latter's passive host snapshot to assess causality rather than infer it solely from the latest pass.

### Exact original-input outcomes

Both audio results identify project `D3-Firefox`, expectedStatus=passed, actual status=passed, retry=0 and errors=[]. The real-facade/profile/visibility case took 6,893ms; the first-visit/keyboard/independent-silence case took 2,487ms. Audio totals are **2 expected, 0 unexpected, 0 skipped, 0 flaky**. The other result files report adult 3, Hall 3 and creative 2 expected passes with zero unexpected/skipped/flaky; the job's ten-actual-pass gate also completed. Those counts are corroborating suite evidence, not a renewed substantive review of the other components.

The retained trace's complete spec source SHA-256 is `51b93b9951a130a954c0228d680951da8ce5d4d9cc7e80aadfd3db8b062b80d0`, exactly the previously reviewed diagnostic spec. Original inputs, assertions and polling limits therefore remain unchanged. Current production controller/speech hashes also remain the previously accepted values. The provided candidate/run identity is retained in `run.json`; no Git or external action was needed for this review.

The real-facade attachment identifies Firefox **157.0**, one context, acknowledged native/facade state, installation enabled/unlatched at .25/.50, two real profiles with instructionReadAloud=false, no media/persistence error, speaking=false, and fully clean readiness. Its ordered telemetry is:

| Checkpoint | Recorded result |
|---|---|
| Enable click, sequence 19, 1449ms | Trusted; visible; active user activation; loaded settings. |
| Context construction, sequence 26, 1455ms | Native context suspended, 44,100Hz, currentTime=0, destinationChannels=2 and maxChannels=2. |
| Native resume, sequence 27, 1455ms | Original native call under enabled, unlatched policy. |
| Fulfillment, sequence 40, 3095ms | Native state running and currentTime≈.0203s. The observer still sees inactive before the controller's subsequent continuation, as expected. |
| Native statechange, sequence 42, 3102ms | Running context and public activation=ready. |
| Downstream original lifecycle | Native restoration source starts; injected hide cancels speech/sources; foreground starts only permitted library music; profile change clears output. Final one-context and unchanged-installation assertions pass. |

The first-visit trace independently records the actual activation poll changing from inactive to ready. After explicit Silence all, channel edits and explicit exit, the original music-source poll changes from zero to one; effects volume remains zero and music 26%, with one context and no queued utterance. Intermediate unsuccessful poll iterations appear as inner assertion entries in the trace; the outer original assertions succeed before their unchanged deadline. They are not skipped or accepted failures.

### Native environment and supported causal conclusion

Before the cases, readiness at `2026-10-09T05:39:31.210Z` reports successful installation/startup of PulseAudio 16.1 and successful native server/sink/module queries. It validates the private runner-owned Unix endpoint, authenticated native protocol, default `d3_output`, and a real clocked `module-null-sink` with stereo `s16le 2ch 44100Hz`, front-left/front-right, unmuted and IDLE. Explicit routing reaches the browser steps; client autospawn is disabled. This is native output provisioning, not a JavaScript context mock or forced activation result. The virtual sink consumes audio and supplies no evidence that anyone heard it.

The instrumented predecessor runs `37885535995` and `37887423464` show both original inputs reaching trusted, active, visible Enable, constructing one context and calling resume once. At failure, each native context remains suspended at time zero with maxChannels=0; no resume fulfillment/rejection/throw is recorded. The passive host snapshot in `37887423464` reports missing ALSA device/card/PCM paths, zero matching audio processes in two successful snapshots, and no matching standard Pulse/PipeWire socket in a successfully read, untruncated Unix-socket listing. Its sinks were explicitly not probed. Those observations are bounded host evidence, not a universal proof that every possible output mechanism was absent.

**Supported causal conclusion:** the runner lacked the usable native output path needed for these Firefox activation cases; provisioning that path resolves the native resume stall and allows the unchanged original flows to finish. This is a CI-environment correction at the native output boundary, not an established application consent/generation defect. The combined failing native checkpoints, passive host evidence, explicit readiness and successful unchanged rerun support this attribution. They do not isolate which individual library/server/sink/routing element was independently necessary, reveal an internal Cubeb error not present in the logs, or prove all Firefox/device environments behave identically. The original uninstrumented run alone would not have supported this conclusion.

### Cleanup, warnings and residual scope

`audio-output/cleanup.json` records the targeted native server-exit command succeeding with exitCode=0, no signal/error/stderr, and untruncated daemon log; the retained daemon log is empty. Browser logging records Firefox process exitCode=0 and completed temporary-directory cleanup. Both explicit fixture `cleanup()`/`teardown()` evaluations have successful return records in their traces.

The native browser log is **not warning-free**: it includes the existing namespace/service-settings messages, one `Script terminated by timeout` warning in the fixture's pagehide teardown listener, and Juggler progress-listener removal errors. Retain these observations. They occur around closing the test pages; the explicit cleanup evaluations return, both original test results contain no errors, and the browser/server cleanup records succeed. They do not contradict the observed resume/playback pass or establish a new activation defect. This review does not claim every page-close internal callback completed cleanly.

The final test screenshots are blank after fixture unmount, so they are not used as rendered-control proof. Independently viewed pre-teardown screencast frames from both trace archives: the first-visit panel shows active choices with music 26% and effects zero; the profile case shows Another explorer with settings preserved. These are technical rendered evidence, not auditory observations.

**Disposition:** accept the two original D3 audio smoke outcomes on this actual provisioned Ubuntu/Firefox candidate. The missing-backend activation blocker is resolved for this workflow. Reuse the unchanged component/race/type/layout evidence; no new runtime fix or rerun was needed for this inspection. Broader D3 coverage remains exactly the defined selected smoke scope, not every audio case. No D1, published URL, full-shell/update, real-voice/local-network, heard-quality, physical-device or child-testing claim is made. Physical/child sessions remain separate future activities, not newly imposed gates.

Only this report and `WP02-05A-VALIDATION.md` were updated in this follow-up. No source, workflow, private artifact, Git, external service or browser execution was changed or initiated.
