# D3 corrected adventure and published M1 execution

11 October 2026. Controller dispatched the independently reviewed runner on exact main/origin commit `4ce77058e60f8f87285e5b8f63c7630fdaffb188`. This source includes accepted local audio correction `0624419` and independently reviewed local journey/reflow correction `a5ab6e6`. The game remains frozen published B, built from `b158e2b3de86d119c1650996977201264563abde`; a CI source commit is not a deployment.

At dispatch, no passing result was inferred from discovery. Adventure requires seven first-attempt passes on matched Linux Firefox. The separate published selection requires one bounded live-origin case, visible/native build identity matching CANDIDATE.json, and retained CI/deployment identities. Actual results are recorded below; original D1/T1 agent-directed journeys remain separate evidence.

Adventure run: https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38121464433 . Controller will append actual results, retained artifacts and independent review before accepting the changed candidate or republishing.

## Actual native outcomes

Both runs completed successfully on the exact source SHA above. These are actual retained Playwright results, not modelled gate checks:

| Selection | Run / job / artifact | Native result | Retained evidence |
|---|---|---|---|
| Adventure | 38121464433 / 114416899384 / 11695348192 | 7 passed, 0 skipped/unexpected/flaky, no report errors; 36.126 seconds | `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-38121464433/` |
| Published B | 38121488407 / 114416968894 / 11695238179 | 1 passed, 0 skipped/unexpected/flaky, no report errors; 11.316 seconds | `C:/Users/alexb/AppData/Local/Temp/learning-is-fun-d3-run-38121488407/` |

Each root retains the downloaded artifact zip, extracted native reports/traces and `job.log`. Adventure artifact is 36,701,647 bytes; published artifact is 15,171,549 bytes. The original experience reviewer independently accepted the actual seven-case result in [correction validation](PUBLISHED-JOURNEY-CORRECTION-VALIDATION.md); the fresh WP06 reviewer independently accepted the actual one-case published result in [journey validation](WP06-02A-VALIDATION.md). Controller accepts these bounded outcomes with their retained Firefox diagnostics and precise cleanup limits. No Pages deployment occurred during these runs; published smoke concerns B only.

The corrected production candidate at `4ce77058e60f8f87285e5b8f63c7630fdaffb188` is ready for Controller-owned replacement publication. The publisher has retained a real native B context, documented in [the replacement handoff](M1-CORRECTED-PUBLICATION-HANDOFF.md). Final C bytes, native retention, fresh entry and original observer retests remain required; no M1 acceptance is implied.
