# D3 runner native audio-output diagnosis and repair

9 October 2026. **The actual runner lacks the standard native audio-output provisioning needed by the original audio cases. A narrow CI repair is authored; the Firefox causal loop remains open until the controller reruns the unchanged cases.** No product behavior, browser security, native AudioContext, or assertions were changed.

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

## Narrow CI environment repair

The concrete requirement is a native PulseAudio client library, a reachable runner-user server, and a clocked stereo output sink that Firefox can use without hardware. The workflow installs only Ubuntu `pulseaudio` and `pulseaudio-utils` with no recommended packages; their dependencies supply libpulse0. No project dependency or broad package upgrade is introduced. See the [Ubuntu package dependency listing](https://packages.ubuntu.com/noble/pulseaudio-utils).

A private mode-0700 runtime directory contains the Unix socket, PID, authentication cookie, and daemon log. The runner user starts PulseAudio with its own startup script, default-script loading disabled, startup errors fatal, and idle exit disabled. The script loads a real `module-null-sink` at 44100 Hz with two front-left/front-right channels, loads the authenticated Unix native protocol, and makes `d3_output` default. This is a clocked native sink; it consumes actual native audio without requiring physical speakers. See [PulseAudio daemon options](https://raw.githubusercontent.com/pulseaudio/pulseaudio/master/man/pulseaudio.1.xml.in) and the [clocked null-sink implementation](https://raw.githubusercontent.com/pulseaudio/pulseaudio/v16.1/src/modules/module-null-sink.c).

Explicit PULSE_SERVER/PULSE_SINK routing and a private client config with autospawn disabled reach subsequent workflow steps through GITHUB_ENV. Authentication stays enabled; no TCP listener, browser preference, autoplay override, sandbox flag, fake context, or activation substitute is added.

Before any original browser case, bounded native queries must establish the owned socket's UID/type, a successful server connection, the expected server/default sink, null-sink module ownership, stereo format/channel map, unmuted output, and IDLE or RUNNING state. Failure fails the setup step and prevents browser execution. No readiness polling or browser retry is added. Query semantics and JSON support are documented in [Ubuntu pactl](https://manpages.ubuntu.com/manpages/noble/man1/pactl.1.html).

`audio-output/readiness.json` retains exact startup arguments, versions, package statuses, routing, command results, socket metadata, server/sink/module responses, and readiness/failure. Startup is bounded to ten seconds; other commands to three seconds and 32 KiB buffers. The setup step is bounded to two minutes; package installation to five. Existing passive host and bounded native-browser logs remain. After host observation and the original pass gate, an always-run cleanup targets only the explicitly recorded private runtime, asks that server to exit, and retains cleanup results plus at most 32 KiB of daemon log. An unset ownership marker causes no connection. Authentication-cookie bytes are outside artifact paths. Artifacts retain the two config files, readiness, cleanup, and daemon log for one day.

## Validation and pending decision gate

The owned changes are the existing workflow and this handoff. YAML parsing and inline Node syntax passed. Private mocked checks passed readiness and rejected wrong default/server, suspended/muted output, wrong format/module, missing sink, startup/connection failure, timeout, oversized output, malformed JSON, wrong socket owner/type; targeted cleanup and an unset route also passed. No real Windows service, Linux package install, daemon, or browser was run by this worker.

Scope comparison confirmed that every original workflow step is identical except the added artifact paths. The repair adds package setup, private startup/readiness, and cleanup steps. All 157 frozen source/test/dependency/config files remain identical, including discovery 3/3/2/2, original case selectors, serial failure behavior, and the ten-actual-pass gate. The existing workflow stays manual-dispatch-only on one standard Ubuntu 24.04 runner with read-only repository permissions.

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-pulse-repair-041vNP`. The passive predecessor workflow SHA-256 was `91c943f02eea8c19875fda25bce8284a327cbb85545798c8a650f100b36190ca`; final repair hashes and checks are in `final-validation.json`. Earlier passive mock/scope evidence remains at `C:/Users/alexb/AppData/Local/Temp/d3-audio-host-validation-Bs24no`.

The controller must independently review, commit, push, and manually dispatch this candidate, then return readiness/host/native-log evidence and the original results. Acceptance requires all ten unchanged cases to pass, including audio 2 and creative 2, with no failures, skips, or flaky results. A setup success alone cannot close the loop. Any red original result requires tracing the new complete evidence before another repair.
