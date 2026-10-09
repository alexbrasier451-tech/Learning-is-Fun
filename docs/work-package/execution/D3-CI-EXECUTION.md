# D3 Firefox remote execution

9 October 2026. Controller-owned external execution record. The public repository and implementation were explicitly authorized by the human. No GitHub Pages deployment or live-game acceptance has occurred.

## Initial candidate and dispatch

- Repository: https://github.com/alexbrasier451-tech/Learning-is-Fun . Read-only GitHub verification found public visibility, main as default, Actions enabled and all actions allowed.
- Local CI setup independently passed; candidate `46214efbf8fbb76126991d742c98405e5cce5176` includes reviewed game components, pinned dependencies and the dispatch-only workflow.
- `git push -u origin main` succeeded. GitHub branch lookup confirmed the exact candidate SHA.
- The explicit REST workflow dispatch failed with HTTP 422 before a runner started. GitHub's parser rejected `runner.temp` in `jobs.firefox.env`, lines 16–20: “Unrecognized named-value: 'runner'.”
- Original tooling author owns the narrow workflow correction. The root paths must be established at an actual runner step, preserving separate fixture roots and evidence. Original independent recheck and a complete dispatch/run attempt remain required.

There is no D3 runtime pass, artifact or browser observation from this rejected dispatch. The prior local YAML parser and synthetic reporter checks did not validate GitHub's context-availability schema. No browser, product or acceptance requirement has been waived. D1 Edge-primary approval remains unanswered.
