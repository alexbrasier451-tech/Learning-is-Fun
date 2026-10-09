# Node/app project membership — independent validation

Date: 9 October 2026. Review baseline: `845b8e7`. Reused accepted foundation context; read the original diagnostics, exact configuration diff and completed [NODE-PROJECT-REFINEMENT-HANDOFF](NODE-PROJECT-REFINEMENT-HANDOFF.md). Final handoff snapshot SHA-256: `e6986bd947c6613e41fd50d55c04114e9029f14e0e7c358c416445bd5f101394`.

**Verdict: PASS for the bounded two-configuration membership correction.** Finding severity: NONE. No invalidated foundation criteria. Earlier red diagnostics are retained investigation evidence; the completed handoff and supported green root check close this configuration issue. Controller owns administrative acceptance and commits.

## Exact changes and boundaries

| Exact file | Verified change and preserved contract |
|---|---|
| `tsconfig.node.json` | Only `composite: true` becomes `incremental: true`. Existing build-info path, includes, strictness, ES2023-only library, Node types, module resolution, skipLibCheck and noEmit are unchanged. This removes composite root-file-list closure for imported erased APIs/contracts while retaining their semantic checking. |
| `tsconfig.app.json` | Only `tests/fixtures/*-api.ts` is appended to include. Composite, strict, ES2022/DOM/DOM.Iterable, react-jsx, types=[], verbatimModuleSyntax, source/fixture-TSX includes and `src/sw.ts` exclusion are unchanged. The added pattern is top-level and API-suffixed; it does not include general fixture runners/configuration/support TS or recursive fixture TS. |

Independently compared parsed configurations with HEAD after reversing only these authorized changes: exact equality. `tsconfig.json` and `tsconfig.sw.json` match HEAD unchanged. The empty-files root schedules the three projects; app/worker do not consume a Node-project declaration reference. All four current configuration hashes match the final handoff.

The original 12 Node TS6307 diagnostics identify imported erased API/domain files omitted from composite roots. After the Node correction, the six app TS6307 diagnostics identify the same API membership class in fixture TSX imports. Both fixes address their producing configuration layer. All seven currently matched fixture APIs use erased type imports/declarations; neither correction adds browser globals or imports executable fixture hosts into Node. No strictness/source-error check is disabled.

## Proportionate verification

- Independently created a private config extending the actual Node config, with only private build-info and relocation-specific typeRoots overrides. An empty-files solution referencing it passes installed TypeScript 7.0.2 `tsc -b --force --verbose`: **exit 0**. This directly verifies supported solution scheduling without writing shared compiler caches.
- Private effective options/file-list checks preserve strict=true, lib=[ES2023], types=[node] and no JSX option. The actual closure contains **24 repository source files, zero TSX files and zero DOM/WebWorker library files**.
- Private negative probes produce the expected **TS2322** type mismatch, **TS2584** missing DOM `document`, and **TS17004** unsupported JSX diagnostics. An initial probe used the same `.ts`/`.tsx` basename; TypeScript selected the TS file. Distinct probe filenames corrected that private harness omission and exercised both boundaries successfully.
- Reused the owner's final private app checks: exit 0, all seven fixture APIs listed, original composite/strict/DOM/JSX boundary retained and worker source excluded. Independently inspected their recorded options/file list and compared current configuration hashes.
- Reused and inspected `node-app-project-final-71Kj9J/run.json` and `supported-root-typecheck.txt`: supported `pnpm run typecheck` / `tsc -b` **exit 0 at 05:06:38 BST**, covering app/Node/worker after both fixes. No broad root rerun, application build or browser regression was needed.

Reviewer probes/output are private under `C:/Users/alexb/AppData/Local/Temp/node-membership-validation-3nbI3K`, including solution/configuration files, compiler output and `results.json`. Only this report and those private artifacts were authored. Production/configuration/dependencies, shared status, Git state, other reviewers' ports/caches and other chats were untouched; no delegation occurred.

The handoff's D3 feasibility proposal is outside this verdict. No workflow/external action, remote-browser acceptance or browser waiver is reviewed or granted here. Component, final integration and published-browser acceptance retain their own evidence boundaries.
