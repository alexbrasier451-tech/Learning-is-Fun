# Published build identity — narrow shell handoff

11 October 2026. Source ready for the original shell reviewer and publisher. Based on accepted shell `6486580`; no publication acceptance or deployment is claimed.

Only `src/app/AppShell.tsx` changes: import the existing compiled `BUILD_ID` from `src/platform/appIdentity.ts` and render `Game version: {BUILD_ID}` in the Help dialog, immediately above Music credits. It is readable after opening Help and scrolling, outside gameplay. There is no second identity, new service, developer panel or lifecycle change. This note is the other owned repository path. Publisher-owned `base-path.spec.ts`, producer/publication files and unrelated changes are preserved; no Git staging, commit, deployment or other-chat message was sent.

Verification:

- `node node_modules/typescript/bin/tsc -b tsconfig.app.json --pretty false` passed; focused `git diff --check` passed.
- Root `tsc -b` reported publisher-owned `tests/platform/base-path.spec.ts` errors at lines 70/76: Node-configured test types lack `Navigator.serviceWorker`, `location`, `MessagePort.onmessage`, and the callback event type. This author did not edit that spec. Root typechecking is not claimed green by this handoff.
- One real rendered Help check passed in Chrome `155.0.8059.40`, 1366 × 768, private dev port 5195 and `/playtest/`: visible `Game version: local-wp01-02a` exactly matched the imported compiled `BUILD_ID`; zero page errors. Captured screenshot was visually inspected and the line is readable. This proves the display wiring, not the publisher's candidate build identity or deployment.

Private evidence at `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d`: `published-build-identity-render.json`, `published-build-identity-help.png`, and one-off `build-identity-render.mjs`. The runner's initial package-path lookup failed before any browser opened; switching to the existing `@playwright/test` export corrected the harness. No repository test was added or changed, and no broad matrix was rerun.

Frozen `AppShell.tsx` SHA-256: `9a12a03c229b8f2faaff6426b8e41263d553bdda837470066ecbc5e45ebbbc89`. The private server was stopped with Ctrl-C, its browser closed in `finally`, and port 5195 has no listener. Source and port are released. Publisher owns the actual visible candidate assertion in `base-path.spec.ts`; original shell reviewer owns the narrow delta review.
