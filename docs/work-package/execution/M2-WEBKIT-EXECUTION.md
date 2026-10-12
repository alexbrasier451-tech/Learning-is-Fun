# Focused published Linux WebKit verification

12 October 2026 BST. Controller retains frozen M2 deployment `011d2afe6e8a2215d4bebdd21787cfaa4f7a9fc9-pages-38177521884-1`. No game source or deployment changes accompany this verification route.

## Reason and scope

[Reviewed journeys](WP06-05A-VALIDATION.md) support full fresh D1/T1, T2 controls and Edge/Firefox smoke. Required Windows WebKit artwork remains failed under J2-01. The original observer's metadata-only faithful retest reproduces native fetch failure before HTTP with `signal.aborted=false`; original world and tooling owners found no demonstrated application defect. Tooling localized four failures to native send errors, without proving the underlying peer/socket cause. Original failures and the isolated passing probes remain separate evidence.

Controller authorizes the same native WebKit engine on supported Ubuntu 24.04 for the original fresh Q1–Q6 touch/rotation/doubled-text path, followed by supplementary Castle/Green checks from an unchanged genuine normal export. This does not claim a Windows fix or physical Safari/device coverage. Actual results must determine applicability; preparing this route adds no accepted child.

## Prepared source and integration

- Original observer's one-case source and byte-identical normal export passed [independent source review](WP06-05A-VALIDATION.md#linux-webkit-case--source-readiness-addendum). [Scenario handoff](../../../artifacts/playtests/M2/011d2afe6e8a2215d4bebdd21787cfaa4f7a9fc9-pages-38177521884-1/journey/linux-webkit-source/HANDOFF.md) and sibling `FILES.json` freeze its scope and identities.
- Original foundation owner's four additive files passed [independent runner review](PUBLISHED-WEBKIT-CI-VALIDATION.md). Controller verified absent target paths, checked all source hashes, copied only those four files and verified their final hashes. Existing Pages/D3/runtime sources remain unchanged.
- Actual combined discovery with the integrated config finds exactly **one** case, `Published M2 WebKit touch and scene transport observation`, under `T2-WebKit-touch`; the strict discovery gate passes. Supported main `tsc -b --force` passes. No browser was launched by these checks.
- Local discovery evidence: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d11-b980-7332-8a57-33fcaf22e390/linux-webkit-integration/`. Its source marker `0bb9671793c9d6acc667c81010966025e3d519e3` is the pre-commit integration baseline, not an executed CI source or deployed game identity.

The manual workflow is `published-webkit-observation.yml`, with read-only repository permissions, matched WebKit, one worker, zero retries, exact-case gates and retained evidence on failure. Actual CI identity/result and subsequent independent native-evidence review are pending.

## First dispatch — configuration rejection

Controller committed and pushed reviewed source `9ec9cc67d77a2ec4667db63bdfaa4dd500d8b0f3`. GitHub rejected the manual dispatch with HTTP 422 before creating a run: line 16, column 37 uses `runner.temp` in job-level `env`, where that context is unavailable. Local typechecking/discovery and prepared-source reviews did not detect GitHub's context restriction. This is a workflow configuration defect, not a Linux browser or game failure. The original foundation author owns the narrow runtime-environment correction; the original reviewer will recheck that change before another dispatch. No test result or acceptance is claimed.

The original author corrected only the workflow and handoff: the preparation step receives the root through supported step-level `env`, then writes it to `GITHUB_ENV` for subsequent steps. The original reviewer independently passes this narrow correction, preserving the missed-review history. Controller checked both preimages and final hashes and integrated those exact two files. Scenario, fixture, config, adapter, identity/result gates and game remain unchanged, so their earlier supported checks are retained. The next dispatch supplies actual remote parser and execution evidence.

## First actual Linux run — trace ownership conflict

Corrected source `ed2e4f65ceefb09a3f2a8e0534656c32e426cfe8` was accepted by GitHub. Run [38185441804](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38185441804), attempt 1, passes environment preparation, frozen dependency installation, source checking, exact discovery and matched native WebKit installation. Thus the workflow-context rejection is closed by actual remote execution.

The sole case fails before game navigation in 4.064 seconds: `context.tracing.start` reports that tracing already started. Runner automatic tracing conflicts with the observer's explicit manual per-context trace ownership. The piped observation step reports success from `tee`; the strict result gate correctly rejects the actual failed result (0 expected, 1 unexpected, no retries/skips/flakes) and the job fails. No Linux artwork outcome is established.

Actual artifact `11719288152` is retained at `artifacts/ci/M2/ed2e4f6/published-webkit-38185441804/`, together with run logs. Artifact ZIP SHA-256: `12c99b3856b061771b0954e41b2d3a636f93a39e0b6e70e1bfb188dc34341627`. The original foundation owner has the bounded configuration repair to preserve manual traces as the single owner. The original reviewer will recheck the changed interface before the same-case rerun. Production remains frozen.

The original author changed the dedicated config to `trace: 'off'`, leaving the observer's explicit trace start/stop/attachment code as the sole owner. Screenshots, scenario, fixture, workflow, reports and strict gates remain unchanged. Original independent recheck passes ten targeted checks; the retained failed result still fails the gate. Controller checked exact preimages and final hashes and integrated only the config and handoff. Actual original-case Linux rerun remains the closure check; no native success is inferred from this source correction.

## Second actual Linux run — touch-capability assertion

Run [38186227198](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38186227198), attempt 1, uses source `42115348cd01b1f9acbeab7790216a9fa73b5fa0`. It passes setup and reaches published Help with manual traces retained, closing the trace-start conflict. The sole case fails in 19.673 seconds at the observer's `navigator.maxTouchPoints > 0` assertion: the Linux engine reports zero despite explicit `hasTouch: true` and the native touchscreen tap path. No quest or required artwork result is claimed from this run. Result gate again correctly rejects the failed case.

Artifact `11719428933`, ZIP SHA-256 `0f512ea716670e444c89716b605e9931631046882866456a97b2c4079ee8f836`, is retained with GitHub metadata/logs at `artifacts/ci/M2/4211534/published-webkit-38186227198/`. The original observer owns determining whether this property is a valid proxy for the configured native input. Any correction must preserve actual trusted touch proof and raw reported capabilities, with no navigator override, mouse substitution or weakened scene assertions. Original independent review and the same-case rerun remain required.

Original observer investigation established that the hardware-capability property is not a reliable proxy for this emulated input contract. The revised existing Help tap requires a matching, ordered trusted touch start/end pair or trusted pointer down/up pair with `pointerType: 'touch'`. Passive recording preserves raw `maxTouchPoints`; it neither changes navigator nor injects input. Original actions, scene assertions, import and cleanup remain unchanged. Independent correction review passes, and Controller verifies all six frozen file identities. Focused typechecking and exact one-case discovery pass; actual Linux trusted-event proof remains pending the same-case rerun.
