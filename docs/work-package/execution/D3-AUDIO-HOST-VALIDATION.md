# D3 audio-host diagnostics — independent validation

9 October 2026. Reviewed the completed [author handoff](D3-AUDIO-HOST-DIAGNOSIS.md), the current workflow against the accepted initialization repair, and the existing [native-audio diagnosis](FIREFOX-AUDIO-DIAGNOSIS.md). This continues the investigation following Firefox run `37885535995` on `ffd1d39f103f8b2b694f2db203a6acc160e40dfd`.

**Verdict: PASS for this bounded local diagnostic change. Blocking findings: NONE.** This review establishes the observation boundary and local checks. It establishes neither a Linux audio-host cause nor a Firefox pass. Controller retains commit, push, dispatch and interpretation of the actual runner evidence.

## Passive observation boundary

The actual program executes only two process snapshots, user/system `systemctl show` queries, the fixed `dpkg-query -W` query, and `aplay -l`. `pulseaudio`, `pactl`, `pw-cli` and `wpctl` receive filesystem availability checks only. Socket inspection uses file metadata and a bounded `/proc/net/unix` read; it opens no audio socket. No service start/install, playback, browser preference, product code or activation substitute is introduced. The service queries retrieve properties rather than start units; the ALSA hardware-list branch uses hardware controls and returns before the playback PCM-open branch. [systemctl source documentation](https://raw.githubusercontent.com/systemd/systemd/v255/man/systemctl.xml), [ALSA implementation](https://raw.githubusercontent.com/alsa-project/alsa-utils/v1.2.10/aplay/aplay.c).

`serverSinks.status` remains explicitly `not-probed`. Command availability, socket presence, active units or absent hardware cannot establish a usable sink. Missing or failed queries remain incomplete observations. The timestamp and phase describe a snapshot after the original tests or an earlier job failure, so these records cannot establish host state at the exact native `resume()` call.

Subprocesses have three-second timeouts, `SIGKILL` and a 32 KiB `maxBuffer`; retained strings also have a 32,768-character cap. These are distinct byte/character limits, as the handoff states. Text-file reads retain at most 32 KiB with a truncation flag; device records are limited to 64 with a truncation flag. The step has a two-minute ceiling. Missing, inaccessible, timeout, output-limit, spawn-failed and nonzero-exit statuses remain distinct; incomplete process snapshots use `matchingCount: null`. [Node subprocess bounds](https://r2.nodejs.org/docs/latest-v24.x/api/child_process.html#child_processspawnsynccommand-args-options).

## Original execution and evidence

The test command, original inputs and serial order remain adult → Hall → audio → creative. `DEBUG=pw:browser` records native browser diagnostics; `LC_ALL=C` makes the filter's per-line limit a byte limit. The filter prints the first 256 lines at 1,024 bytes each plus a truncation marker and continues consuming input. It contains no early exit that could introduce a producer SIGPIPE.

Explicit `shell: bash` selects GitHub's `bash --noprofile --norc -eo pipefail {0}`. With successful logging commands, a failing Playwright exit remains the pipeline exit and stops the original serial loop; a logging failure also fails the step. There is no exit suppression or `continue-on-error`. The later observation step's `!cancelled()` condition permits evidence after failure without clearing that failure. This exit-status conclusion is a static review against documented Bash invocation; a complete Bash pipeline was not executed locally because Bash is unavailable. [GitHub shell behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsshell).

Parsed-object comparison proves the only existing-step changes are browser logging and two added artifact paths, plus the new observation step. Manual dispatch, permissions, installation, fixture adapter, discovery expectations of 3/3/2/2, ten-single-attempt-actual-pass gate, existing failure artifacts, upload condition and one-day retention are identical. All 157 owner-frozen source/test/dependency/configuration files independently match their captured hashes. Prior accepted CI/adapter and guard evidence was reused; no broad test or browser rerun was needed.

## Private verification and final identity

The actual YAML parsed successfully and the extracted Node program passed syntax checking. Four independent synthetic scenarios passed: missing tools/files, inaccessible tools/files, observed metadata with truncation, and bounded probe failures. Spies verified exact command families/arguments, timeout/output settings, absence of audio-client calls, null counts on incomplete snapshots, missing-runtime handling and distinct errors. These scenarios observe no real Linux host.

The actual extracted awk expression also ran successfully with the installed awk binary: 500 input lines of 2,048 bytes became 256 data lines of exactly 1,024 bytes plus one marker. This verifies the filter separately, not GitHub, Bash, native audio or Firefox.

Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-audio-host-validation-FQPkuo`, explicitly labelled `LOCAL-SYNTHETIC-NOT-LINUX-OR-FIREFOX`. Final reviewed SHA-256 values agree with the completed author's snapshot:

| File | SHA-256 |
|---|---|
| `.github/workflows/d3-firefox-smoke.yml` | `91c943f02eea8c19875fda25bce8284a327cbb85545798c8a650f100b36190ca` |
| `tests/fixtures/d3-firefox.config.ts` | `6c6db0b3a798e255b1f98105e45a207bbdbae568540a9355db59a796d7c2d191` |
| `docs/work-package/execution/D3-AUDIO-HOST-DIAGNOSIS.md` | `693ac27215efe560b61fd20cb0275da368a399653820b1d5ad5b6bf512615162` |

Only this report and private checks/output were authored. No source/configuration/shared-status/Git mutation, delegation, other-chat message, external action, service launch or browser execution occurred. The next actual runner evidence must be reviewed before choosing a causal repair; existing D1 and broader acceptance boundaries remain unchanged.

## Continuation — private native-output provisioning repair

9 October 2026. Reviewed the completed revised [diagnosis and repair handoff](D3-AUDIO-HOST-DIAGNOSIS.md), actual `artifact/audio-host.json` from run `37887423464` on `307885b493857655635924adcad8c056ac59562c`, and the final workflow against its passive predecessor.

**Repair verdict: PASS for bounded local readiness to dispatch. Blocking findings: NONE.** The runner snapshot supports provisioning the missing standard output path: successful process probes found zero audio matches; the untruncated Unix-socket listing had no matches; standard socket paths and ALSA metadata were missing; named user/system units were not-found/inactive/dead. The mixed package query exited 1, reporting `libasound2t64` installed, `alsa-utils` not-installed, and the named Pulse/PipeWire packages not found. These are specific partial package observations, not a complete inventory. Sink state was unprobed. Supplying a native backend is causally appropriate to this evidence; whether it resolves the pending native resume remains an inference requiring the original cases.

The repair installs only standard Ubuntu `pulseaudio` and `pulseaudio-utils` plus their dependencies, with no recommended packages or broad upgrade. The latter depends on the native `libpulse0` client library. It then starts one private runner-user PulseAudio instance, with a mode-0700 temporary runtime, authenticated Unix socket and a 44,100 Hz stereo `module-null-sink`. That module renders and consumes native samples against a real-time clock. This supplies a real software audio backend without physical speakers; it grants no heard-audio or physical-device evidence. [Ubuntu dependencies](https://packages.ubuntu.com/noble/pulseaudio-utils), [native null-sink implementation](https://raw.githubusercontent.com/pulseaudio/pulseaudio/v16.1/src/modules/module-null-sink.c).

Root startup is rejected. Default-script loading is disabled; startup-script errors are fatal and idle exit is disabled. There is no TCP listener, anonymous authentication, browser preference, sandbox/autoplay override, fake AudioContext or activation substitute. Explicit server/sink/cookie/client/runtime routing is used by the setup process and exported through `GITHUB_ENV` for subsequent steps. The private client configuration disables autospawn. Native PulseAudio recognizes these client variables; its version-16.1 JSON fields and types match the gate's server, sink and owner-module checks. [Daemon options](https://raw.githubusercontent.com/pulseaudio/pulseaudio/v16.1/man/pulseaudio.1.xml.in), [client configuration implementation](https://raw.githubusercontent.com/pulseaudio/pulseaudio/v16.1/src/pulse/client-conf.c), [pactl JSON implementation](https://raw.githubusercontent.com/pulseaudio/pulseaudio/v16.1/src/utils/pactl.c).

Before browser execution, setup requires a socket owned by the runner UID, an actual successful client connection to the exact private server, the expected default sink and null-sink owner module, correct stereo format/channel map, unmuted output and IDLE/RUNNING state. Errors, nonzero exits, malformed responses or mismatches throw; `ready` remains false and evidence is written in `finally`. Normal success conditions prevent the original cases from running after failed installation/readiness. No retry, failure suppression or replacement assertion is introduced.

Package installation/setup/cleanup have five/two/one-minute limits. Daemon startup has ten seconds; other native commands have three seconds, 32 KiB buffers and 32,768-character retained-stream caps. Cleanup runs with `always()` after host observation and the pass gate. It derives its exact socket and runtime from the setup-owned `D3_PULSE_RUNTIME` marker, rather than ambient Pulse routing, and issues only targeted `pactl ... exit`; it uses no global kill or recursive deletion. Unset markers cause no connection. Failed shutdown remains a failed step, while cleanup records survive for upload. Retained daemon logs are capped at 32 KiB. Authentication-cookie bytes remain outside the artifact paths.

Independent parsed-object comparison proves only three added steps and five added artifact paths. Every original step—including serial browser logging, passive host observation, discovery 3/3/2/2, ten-actual-pass gate and failure-artifact upload—is otherwise identical. All 157 frozen source/test/dependency/configuration files independently match, including the native-audio code and original fixture assertions. Prior unchanged checks were reused.

The actual extracted setup and cleanup programs passed syntax checks and private execution with spies: one valid readiness scenario accepted; 17 adverse readiness scenarios rejected, covering root/path bounds, startup/connection errors, timeout/output limits, socket ownership/type, malformed JSON, wrong server/default/module/format/channel map, missing sink, suspension and mute. Seven cleanup scenarios passed, including absent ownership markers, unrelated ambient routes, conflicting routing, shutdown errors and bounded/missing logs. These are synthetic program checks, not native Linux, package-install or Firefox execution. Private evidence: `C:/Users/alexb/AppData/Local/Temp/d3-pulse-independent-0c23101cf8a34539aa9cc42dad9e1d65`.

Final hashes, captured after the author's final checks and matching that completed snapshot:

| File | SHA-256 |
|---|---|
| `.github/workflows/d3-firefox-smoke.yml` | `67347dce0259814819f48625b074c05fb70904f618506fc35b939a0f428bca72` |
| `tests/fixtures/d3-firefox.config.ts` | `6c6db0b3a798e255b1f98105e45a207bbdbae568540a9355db59a796d7c2d191` |
| `docs/work-package/execution/D3-AUDIO-HOST-DIAGNOSIS.md` | `cfbca3838064dc48bc9e96af840331d8c9981762e09e629a9463e6ff1a5e56ba` |

Only this addendum and private checks/output were authored. No other file, Git state, external system or chat was changed; no agent, service or browser was started. **Actual Firefox success remains unverified.** Controller must run the complete original flow and review readiness, host/native logs and all ten unchanged results. Setup success alone cannot close the causal loop; any red original result requires tracing the new complete evidence. D1 and broader acceptance boundaries remain unchanged.
