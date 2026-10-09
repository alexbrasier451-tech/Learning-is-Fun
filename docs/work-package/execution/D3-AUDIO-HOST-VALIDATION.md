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
