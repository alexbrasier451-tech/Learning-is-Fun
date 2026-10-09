# D3 runner native audio-output diagnosis and repair

## Actual-run closure — 37889547310

9 October 2026. Controller run `37889547310`, candidate `18f08b01e7ffc839b0fb14d686ff8341d3fd362e`, job `113687120938`, completed the unchanged ten-case flow. Artifact `11597771163` (38,454,512 bytes) and job log are retained at `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37889547310`.

Actual readiness is true. PulseAudio 16.1's native short-list output reports module **0** as `module-null-sink` and module **1** as `module-native-protocol-unix`. The default `d3_output` sink has index 0 and `owner_module: 0`, matching the reported null-sink identity; its driver is `module-null-sink.c`, format is `s16le 2ch 44100Hz`, channels are front-left/front-right, state is IDLE, and mute is false. The private socket `unix:/home/runner/work/_temp/d3-pulse-uoz06J/native` belongs to runner UID 1001. This verifies the corrected identity query using actual output rather than fixtures.

The post-case host snapshot retains that private route and PulseAudio PID 4666 under UID 1001 in both process observations. ALSA hardware remains absent and standard user units remain inactive; the provisioned native software output uses the private server instead.

All result files independently satisfy the existing gate: **3 adult + 3 Hall + 2 audio + 2 creative = 10 actual passes**, each with one passed result, no failures, skips, flaky results, or report errors. Discovery counts also match. The job log records all four actual-pass gate messages. Targeted cleanup returned exit code 0 with no error or signal; its daemon log is empty and untruncated.

This closes the selected D3 CI provisioning/readiness failure through the original complete flow. Native software output was exercised; heard audio quality was not measured. Broader browser/M1 acceptance and the separate independent audio/creative evidence reviews remain controller-owned.

Read-only validation is retained at `C:/Users/alexb/AppData/Local/Temp/d3-audio-closure-CQCk1L/actual-run-validation.json`. The workflow and all 157 frozen source/test/dependency/config files remain unchanged. Earlier attempts and their pre-closure conclusions are retained below.

## Prior investigation record

9 October 2026. **Native CI output provisioning succeeded in the actual repair run. A readiness schema defect blocked browser execution and is now narrowly corrected; the Firefox causal loop remains open until the controller reruns the unchanged cases.** No product behavior, browser security, native AudioContext, or assertions were changed.

## Retained original evidence

Diagnostic run `37885535995`, candidate `ffd1d39f103f8b2b694f2db203a6acc160e40dfd`, failed both original audio inputs on Firefox 157.0. Each input reached a trusted click with active user activation, visible/loaded settings, consent enabled, and silence unlatched. Exactly one native context was constructed and native `resume()` was called once. No fulfillment, rejection, throw, or statechange was captured; the controller's post-await continuation never ran. Failure-time state was suspended, current time 0, sample rate 44100, base latency 0, destination channel count 2, and maximum channel count 0. Detailed checkpoints remain in `FIREFOX-AUDIO-DIAGNOSIS.md`; originals are under `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37885535995`.

Passive host run `37887423464`, candidate `307885b493857655635924adcad8c056ac59562c`, again passed adult 3/Hall 3 and failed audio 2, with no skipped/flaky results. Creative was not reached. Read evidence under `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37887423464`, specifically `artifact/audio-host.json`, `artifact/audio/browser.log`, original results, and `job.log`.

The host snapshot at `2026-10-09T05:13:27.862Z` records:

| Observation | Actual result |
|---|---|
| ALSA devices/cards/PCM metadata | `/dev/snd`, `/proc/asound/cards`, and `/proc/asound/pcm` missing with ENOENT |
| Audio process lists | Both probes succeeded; zero matching audio processes |
| Standard server sockets | Pulse/PipeWire socket files missing; successfully read, untruncated Unix-socket listing has no matches |
| Relevant user/system units | Queries succeeded; all named units not-found, inactive/dead, service PIDs 0 |
| Executables | pulseaudio, pactl, pw-cli, wpctl, aplay absent |
| Exact package query | libasound2t64 installed; alsa-utils not-installed; named Pulse/PipeWire packages not found |

The mixed package query exited 1 and only addresses its exact Ubuntu package names; its partial output is not a blanket inventory claim. Server sinks were deliberately unprobed to avoid activating services. No audio service was started in this passive run.

The retained browser log is untruncated and contains no specific Cubeb/Pulse/ALSA error. It includes a user-namespace sandbox warning and teardown warnings after failed assertions. Those messages do not establish a different causal owner or justify weakening the sandbox. The combined native-context and host evidence establishes a missing standard output path; whether supplying it closes the activation stall must be proved by the original end-to-end cases.

## Actual provisioning attempt and readiness correction

Run `37888549520`, candidate `159137b46f21099d7a4c766159ff13828154fdcb`, artifact `11596764569` (11,078 bytes), is preserved under `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37888549520`. Its readiness report at `2026-10-09T05:27:27.412Z` confirms Ubuntu PulseAudio 16.1 packages installed, daemon startup succeeded, the private socket belongs to UID 1001, and native pactl connections succeeded. The default `d3_output` sink is IDLE, unmuted, `s16le 2ch 44100Hz`, front-left/front-right, driver `module-null-sink.c`, with `owner_module: 0`. Cleanup succeeded; the retained daemon log is empty and untruncated. Browser cases did not run.

The earliest divergence is the CI readiness producer's module identity check: it searched `report.modules` for `item.index === sink.owner_module`, but actual PulseAudio 16.1 module JSON omits `index`. The resulting missing module falsely rejected otherwise matching readiness data. Initial mocks incorrectly supplied that field and missed the defect; their passing result did not establish this real schema contract.

The correction retains full JSON module metadata and additionally requests `pactl --format=text list short modules` from the same private server. That supported text output prints each numeric module ID and name; the [PulseAudio 16.1 producer implementation](https://raw.githubusercontent.com/pulseaudio/pulseaudio/v16.1/src/utils/pactl.c) shows the JSON omission and text identity format. The workflow parses tab-separated identities, rejects malformed or duplicate IDs, and joins the actual numeric ID to the sink's `owner_module`. It never infers IDs from array order. All existing ownership/default-sink/format/channel-map/mute/state checks remain, with an explicit check for the captured null-sink driver. Raw command output and parsed `moduleIdentities` are retained in readiness evidence. Service setup, cleanup, browser behavior, and tests are unchanged by this correction.

## Narrow CI environment repair

The concrete requirement is a native PulseAudio client library, a reachable runner-user server, and a clocked stereo output sink that Firefox can use without hardware. The workflow installs only Ubuntu `pulseaudio` and `pulseaudio-utils` with no recommended packages; their dependencies supply libpulse0. No project dependency or broad package upgrade is introduced. See the [Ubuntu package dependency listing](https://packages.ubuntu.com/noble/pulseaudio-utils).

A private mode-0700 runtime directory contains the Unix socket, PID, authentication cookie, and daemon log. The runner user starts PulseAudio with its own startup script, default-script loading disabled, startup errors fatal, and idle exit disabled. The script loads a real `module-null-sink` at 44100 Hz with two front-left/front-right channels, loads the authenticated Unix native protocol, and makes `d3_output` default. This is a clocked native sink; it consumes actual native audio without requiring physical speakers. See [PulseAudio daemon options](https://raw.githubusercontent.com/pulseaudio/pulseaudio/master/man/pulseaudio.1.xml.in) and the [clocked null-sink implementation](https://raw.githubusercontent.com/pulseaudio/pulseaudio/v16.1/src/modules/module-null-sink.c).

Explicit PULSE_SERVER/PULSE_SINK routing and a private client config with autospawn disabled reach subsequent workflow steps through GITHUB_ENV. Authentication stays enabled; no TCP listener, browser preference, autoplay override, sandbox flag, fake context, or activation substitute is added.

Before any original browser case, bounded native queries must establish the owned socket's UID/type, a successful server connection, the expected server/default sink, null-sink module ownership, stereo format/channel map, unmuted output, and IDLE or RUNNING state. Failure fails the setup step and prevents browser execution. No readiness polling or browser retry is added. Query semantics and JSON support are documented in [Ubuntu pactl](https://manpages.ubuntu.com/manpages/noble/man1/pactl.1.html).

`audio-output/readiness.json` retains exact startup arguments, versions, package statuses, routing, command results, socket metadata, server/sink/module responses, and readiness/failure. Startup is bounded to ten seconds; other commands to three seconds and 32 KiB buffers. The setup step is bounded to two minutes; package installation to five. Existing passive host and bounded native-browser logs remain. After host observation and the original pass gate, an always-run cleanup targets only the explicitly recorded private runtime, asks that server to exit, and retains cleanup results plus at most 32 KiB of daemon log. An unset ownership marker causes no connection. Authentication-cookie bytes are outside artifact paths. Artifacts retain the two config files, readiness, cleanup, and daemon log for one day.

## Validation and pending decision gate

The owned changes are the existing workflow and this handoff. Current YAML parsing and inline Node syntax passed. Regression replay of the real captured server/sink/module JSON reproduces the original guard failure. The corrected producer passes that captured schema with explicit source-format short-list fixtures; reordered rows and numeric ID 42 also pass, demonstrating that identity comes from the reported ID rather than row position. Wrong owner/module name/driver, suspended or muted output, wrong format/channel map/default/server/socket UID, missing/malformed/unsafe/duplicate IDs, and a failed identity query remain red. All 19 replay checks produced their expected outcomes. Short-list output was not captured in the failed run: these added identity rows are declared fixtures, and the next native run must supply actual identity output. No real Windows service, Linux package install, daemon, or browser was run by this worker.

Initial repair scope comparison confirmed that every original workflow step was identical except added artifact paths. The repair added package setup, private startup/readiness, and cleanup steps. This correction changes only the readiness producer within that workflow; all other steps remain identical to the actual attempted candidate. All 157 frozen source/test/dependency/config files remain identical, including discovery 3/3/2/2, original case selectors, serial failure behavior, and the ten-actual-pass gate. The existing workflow stays manual-dispatch-only on one standard Ubuntu 24.04 runner with read-only repository permissions.

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-pulse-repair-041vNP`. The passive predecessor workflow SHA-256 was `91c943f02eea8c19875fda25bce8284a327cbb85545798c8a650f100b36190ca`; final repair hashes and checks are in `final-validation.json`. Earlier passive mock/scope evidence remains at `C:/Users/alexb/AppData/Local/Temp/d3-audio-host-validation-Bs24no`.

Current schema-correction evidence: `C:/Users/alexb/AppData/Local/Temp/d3-pactl-schema-rJtPGT`, including preserved before files, unmodified original readiness data, before/after producer sources, replay reports, and validation. Workflow SHA-256 before: `67347dce0259814819f48625b074c05fb70904f618506fc35b939a0f428bca72`; after: `280668f6cba300cb5e5bca69adcd104e21dd942551f56e169a5bd00af43de031`. Original readiness SHA-256: `6bdc6af081ae807c98296fc225f034d385203b2a9689832924ef1b99bfbeecfd`. Final handoff hash is retained in this evidence directory's `final-validation.json`.

The controller must independently review, commit, push, and manually dispatch this candidate, then return readiness/host/native-log evidence and the original results. Acceptance requires all ten unchanged cases to pass, including audio 2 and creative 2, with no failures, skips, or flaky results. A setup success alone cannot close the loop. Any red original result requires tracing the new complete evidence before another repair.
