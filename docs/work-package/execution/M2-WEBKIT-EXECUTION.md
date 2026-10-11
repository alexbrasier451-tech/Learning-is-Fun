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
