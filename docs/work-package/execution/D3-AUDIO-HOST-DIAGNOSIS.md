# D3 runner audio-host observation

9 October 2026. Observation is authored and privately checked; the Linux host hypothesis remains unconfirmed. The controller owns review, commit, push, manual dispatch, and interpretation of the returned run. This worker performed no external action or browser rerun.

Run `37885535995`, candidate `ffd1d39f103f8b2b694f2db203a6acc160e40dfd`, failed both original audio inputs on Firefox 157.0. Each input reached a trusted click with active user activation, visible/loaded settings, consent enabled, and silence unlatched. Exactly one native context was constructed and its native `resume()` was called once. No fulfillment, rejection, throw, or statechange was captured; the controller's post-await continuation never ran. Failure-time state was `suspended`, current time `0`, sample rate `44100`, base latency `0`, destination channel count `2`, and maximum channel count `0`. Missing or unusable native output is the leading hypothesis, rather than an established audio-service defect. Adult/Hall passed; creative was not reached.

Original evidence: `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37885535995`, including the audio result attachments. The detailed checkpoint interpretation remains in `FIREFOX-AUDIO-DIAGNOSIS.md`.

## Authored observation

Only `.github/workflows/d3-firefox-smoke.yml` and this handoff are owned by this change. Product code, fixture APIs, original assertions, dependencies, discovery and acceptance gates are unchanged. The workflow still uses manual dispatch, one Ubuntu 24.04 job, read-only repository permissions, the matched Playwright Firefox, and the original serial cases.

The new step retains `audio-host.json` after the original tests, including their failure path. Its timestamp and phase identify a later host snapshot, not an observation at the exact native call. It records:

- Availability of eight audio/observation commands; selected routing environment variables, with unset values distinct from empty strings.
- Audio process names/PIDs/UIDs before and after the probes; limited user/system service and socket properties; fixed package statuses and versions.
- ALSA cards/PCM metadata, `/dev/snd` device permissions, matching Unix-socket metadata, and runtime socket-file metadata.
- `aplay -l` hardware output listings when available. No playback or default-plugin enumeration runs.

Executed commands are restricted to `ps`, `systemctl ... show`, `dpkg-query`, and `aplay -l`. PulseAudio/PipeWire clients and daemons are checked for executable availability only. No service installation/start, socket connection, playback, preference change, or activation substitute is introduced. `serverSinks.status` is explicitly `not-probed`: PulseAudio clients can autospawn, and disabling autospawn alone does not prevent systemd socket activation. See the [PulseAudio client configuration source](https://raw.githubusercontent.com/pulseaudio/pulseaudio/master/man/pulse-client.conf.5.xml.in).

Each subprocess has a three-second timeout, a 32 KiB output buffer, and retained streams capped at 32,768 characters. Files are capped at 32 KiB, device entries at 64, and the observation step at two minutes. Missing commands/files, inaccessible paths, nonzero exits, timeouts, spawn errors, and output limits remain distinguishable. Failed or truncated observations cannot establish absence.

The original test step now enables `DEBUG=pw:browser` and retains each fixture's `browser.log`, limited to the first 256 lines and 1,024 bytes per line under `LC_ALL=C`, plus a truncation marker. The filter drains input. Explicit `shell: bash` supplies GitHub's `-eo pipefail` behavior, so logging preserves a failing test exit and the original stopping order. Existing failure artifacts remain; the new files share their one-day retention. See [GitHub shell behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsshell).

## Interpretation and validation

Correlate native browser stderr with process ownership, service `LoadState`/`ActiveState`/`SubState`/`MainPID`/`Listen`, socket presence, routing variables, and ALSA device visibility/access. Command availability alone says nothing about a running server; absent hardware alone does not exclude a virtual sink; active units or socket files alone do not establish usable output. A failed user-manager query is an unavailable observation. Server sink availability remains unknown in this deliberately passive snapshot. Relevant field semantics are documented in [systemctl](https://raw.githubusercontent.com/systemd/systemd/main/man/systemctl.xml), [ALSA proc files](https://docs.kernel.org/sound/designs/procfile.html), and [aplay's hardware-list implementation](https://raw.githubusercontent.com/alsa-project/alsa-utils/master/aplay/aplay.c).

Private validation passed native pnpm YAML parsing, inline Node syntax checking, and four mocked observer scenarios: missing tools, inaccessible tools/files, a running stack, and bounded probe failures. Spies verified the command allowlist and absence of audio-client calls. Scope comparison confirmed only the logging step, added observation step, and artifact paths changed; all 157 frozen source/test/dependency/config files remained identical. Discovery expectations and the ten-actual-pass gate remained identical. GitHub contexts stay in supported locations; see [context availability](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability).

Validation evidence: `C:/Users/alexb/AppData/Local/Temp/d3-audio-host-validation-Bs24no`. Workflow SHA-256 before: `bcc588c18bdcc45fe3aa5465b4a171e93e3e457498a6b9f0f2153c08ad208f19`; after: `91c943f02eea8c19875fda25bce8284a327cbb85545798c8a650f100b36190ca`. Native Linux probes, Bash/awk execution, Firefox behavior, and GitHub execution have not been validated locally.

The next controller run must return `audio-host.json`, `audio/browser.log`, and the original audio result attachments. Review those actual observations before choosing a causal repair. This handoff makes no repair or acceptance claim.
