# D3 offline candidate execution

11 October 2026. Controller committed and pushed reviewed technical candidate `64865808d867dfe3d02e0f71deaec7ed3fdf897c`, verified the exact remote SHA, then dispatched the existing manual Firefox workflow for the changed shell and production offline selections.

- Shell dispatch: [run 38114285683](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38114285683).
- Offline dispatch: [run 38114286824](https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38114286824).

Both runs completed successfully on separate hosted runners against the same immutable commit. Downloaded artifacts confirm exact commit, selection, attempt 1, Linux Node24.21.0 and viewport1280×720. No Pages workflow or website publication is involved.

| Selection | Job | Artifact | Bytes | Actual result |
|---|---|---|---:|---|
| Shell | 114395969761 | 11693340852 | 27,306,445 | 4 expected passes, zero skipped/unexpected/flaky,21.512s |
| Offline | 114395973111 | 11693041180 | 54,814,451 | 4 expected passes, zero skipped/unexpected/flaky,42.897s |

Evidence and job logs are retained under `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-38114285683` and `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-38114286824`; extracted files are in each `artifact` subdirectory. Offline managed teardown records HTTP200/shutdown-requested. This receipt alone is not a claim of universal cleanup. The original shell reviewer and fresh platform reviewer are inspecting actual receipts, source identity, renders and cleanup limits before final acceptance.

Local technical evidence independently passes in WP01-03A-VALIDATION.md, OFFLINE-CONFIG-VALIDATION.md and OFFLINE-SHELL-VALIDATION.md. The shell and platform reviewers subsequently inspected all actual D3 receipts, traces/renders, identities and cleanup limits and report PASS. Controller accepts WP01-03A and releases DEP-067 for publication.

Firefox logs retain internal/unload and application script-timeout diagnostics; the reviews document successful subsequent required-path observations without claiming those warnings were independently explained or that logs were clean. Actual native audio operations do not establish acoustic listening. Linux browser/audio exit receipts and the server's acknowledged shutdown are retained with their precise limits; no extra post-run PID/port proof is invented. No publication or M1 acceptance is claimed.
