# Published build identity — independent validation

11 October 2026. **PASS for the narrow Help display addition; no actionable findings.** Reviewed `PUBLISHED-BUILD-IDENTITY-HANDOFF.md`, the current shell, the existing identity provider/build define, and the author's rendered evidence. Controller supplied accepted shell baseline `6486580` and final offline acceptance `d2ce42c`; this review does not reopen those accepted scopes or grant publication acceptance.

## Source identity and behavior

Current `src/app/AppShell.tsx` SHA-256 is `9a12a03c229b8f2faaff6426b8e41263d553bdda837470066ecbc5e45ebbbc89`, matching the handoff. Independently removing only the single `BUILD_ID` import and single `Game version: {BUILD_ID}` paragraph in memory reproduces the previously validated shell hash `cce623d24154440ee5478270b7f703db2f5bbea0656aef7c6629d9d2a9fd8d78`. This confirms the complete shell delta without a Git operation or source write.

The paragraph uses the existing `src/platform/appIdentity.ts` export, derived from the compiled `__BUILD_ID__` supplied by Vite. It introduces no separate version value or identity source. React renders it as ordinary text in the existing Help dialog immediately before Music credits. It adds no effect, callback, subscription, focus target, persistence operation, registration or lifecycle behavior. Existing Help navigation and close controls are unchanged.

## Evidence inspected

Author evidence root: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d`.

Read `build-identity-render.mjs` and its actual `published-build-identity-render.json` receipt; visually inspected `published-build-identity-help.png`. The runner opens real Help, waits for the version paragraph, scrolls it into view, and compares its text with the imported compiled identity. Receipt: Chrome `155.0.8059.40`, observed `Game version: local-wp01-02a`, compiled `local-wp01-02a`, no page errors. The 1366 × 768 capture shows the complete line clearly above Music credits, with Help's closing controls visible. The runner closes its browser in `finally`; the handoff records the server stopped and port 5195 released.

The handoff records passing `tsc -b tsconfig.app.json --pretty false` and focused whitespace verification. These are author-reported checks, not independent reruns. It also explicitly records root typecheck failures in the publisher-owned, in-progress `tests/platform/base-path.spec.ts`; those are not attributed to this display addition, and that file was not changed by this reviewer. The initial runner import-path failure occurred before browser launch and was corrected in the private harness.

## Disposition and limits

The source and rendered evidence are proportionate to this two-line display change. No new browser run, broad matrix, D3 rerun or build was needed. The local value proves display wiring; it does not establish the eventual published candidate value, deployed URL or publication success. The publisher retains the actual candidate assertion and publication verification.

Only this validation report was written. No production, spec, configuration, other report, Git or messaging action was taken. No server or browser was started; source inspection remains released.
