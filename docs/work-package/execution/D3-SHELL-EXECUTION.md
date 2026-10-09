# D3 assembled shell execution

9 October 2026. Controller executed the reviewed four-case shell selection on exact candidate `b85df192a949c9e276b230dcefd02bfbe6272569` after F01 technical closure.

- [Run37918177034](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/37918177034), job113779379912, attempt1: success.
- Artifact11610832406, `d3-firefox-shell-37918177034-1`, 25,764,277 bytes. Downloaded with job log to `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-37918177034`; extracted evidence is under `artifact`.
- `run.json`: exact candidate, Linux, Node24.21.0, viewport1280×720, shell selection and four expected cases.
- `shell/results.json`: four expected passes, zero skipped/unexpected/flaky, duration25.057s. The actual root application and accepted native audio provisioning were used.
- Original independent shell/integration reviewer passed final receipt, source, trace and cleanup inspection in [WP01-02A validation](WP01-02A-VALIDATION.md). Both explicit runtime-disposal calls present in the suite completed without error; Firefox and native audio cleanup exited successfully. Retained internal/teardown warnings limit clean-console claims. Controller accepts the whole shell child and releases DEP-064 for offline implementation.

This is technical browser evidence, not heard-quality, physical-device, offline, published-game or M1 release acceptance. The workflow publishes only temporary test artifacts, not a website.
