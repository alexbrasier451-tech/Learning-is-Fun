# D3 StrictMode correction execution

9 October 2026. Controller execution of the existing six-case adventure selection on reviewed correction candidate `df331762ad23195c152e4c4491febb3882999e31`.

- Run [37915585144](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37915585144), job `113770841987`, attempt 1: completed successfully.
- Artifact `11608733458`, `d3-firefox-adventure-37915585144-1`, 33,057,137 bytes. Downloaded with job log to `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37915585144`; extracted evidence is under `artifact`.
- `run.json` verifies the exact candidate, Linux, Node24.21.0, viewport1280×720, adventure selection and six expected cases.
- `adventure/results.json`: six expected passes, zero skipped/unexpected/flaky, duration35.474s. Existing actual native audio provisioning and managed cleanup were used unchanged.
- Original independent adventure reviewer passed the changed-candidate receipt, source-identity and cleanup recheck in [the correction validation](WP02-06A-STRICTMODE-VALIDATION.md): all six explicit fixture closes completed without errors, and Firefox/native audio cleanup exited successfully. Retained Firefox warnings limit clean-console claims. Controller accepts the correction; no acoustic, whole-shell or publication claim is made.

The two original root-app Chrome scenarios also pass after the producer correction and the shell-owned focus correction; their precise evidence is recorded in the correction reports. This execution adds no work-package child and does not replace downstream shell or published-game verification.
