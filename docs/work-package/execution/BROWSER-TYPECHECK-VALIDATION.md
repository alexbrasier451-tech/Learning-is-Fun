# Browser callback typecheck — independent foundation validation

11 October 2026. **SCOPED PASS for the frozen one-line configuration correction.** No source correction or type weakening is required. The original 61 diagnostics are resolved in this candidate. Controller owns integration and the final combined main build.

## Exact identity and scope

Reviewed the private `BROWSER-TYPECHECK-HANDOFF.md`, integration patch, source freeze and relevant baseline/typecheck/build/dependency evidence.

Candidate: `C:/Users/alexb/.codex/visualizations/2026/10/08/01a11d98-5787-7d20-8603-8829b864b348/browser-typecheck-9485a2c-f7f11541/candidate`.

- Accepted base: `9485a2cf67b0703deb4efa6c178602dc7952f705`.
- Archive SHA-256: `ca1bece08bf6c4e77b719237bedd033e3e923bd3ea004c2d51ae3f83c350dbf5`.
- Freeze-manifest SHA-256: `b8b8240e022a47024dfd42f9504be2d4435eb50fa3d7137ec80f3b308a0b2482`.
- 396-byte patch SHA-256: `5de65d333c5a26f28a58e8842741b6c6c04204fe2f39392b218c037b541cba59`.

The sole production change in `tsconfig.node.json` is:

```diff
-    "lib": ["ES2023"],
+    "lib": ["ES2023", "DOM", "DOM.Iterable"],
```

| Config | Bytes | SHA-256 |
|---|---:|---|
| Archive preimage | 436 | `f682ea2ce8069d7f11e5ed878535d5499697c287f63526c62c32ce01b58f9fc7` |
| Frozen correction | 459 | `b5a033e0ba84c3aa3b05398e25d298aed4051c41614b729767cac21789c7847c` |

Read the preimage directly from `candidate/tsconfig.node.json` inside the base ZIP and verified its exact bytes. The accepted Git blob uses LF and the archive preimage uses CRLF; their text matches after line-ending normalization. The corrected file preserves the archive's other bytes exactly, including line endings.

All 654 archived source files are preserved except this declaration; the private handoff is the only added source path. All 734 declared frozen source/build/evidence files match exact hashes and lengths and remained unchanged during review. This is an ordinary hash freeze without an authenticated-seal claim.

## Cause and fresh verification

The existing mixed Node/tooling/browser-test project includes typed Playwright callbacks that execute in the browser. ES2023 supplies ECMAScript APIs; DOM and DOM.Iterable supply the browser interfaces and iterable collections those callback bodies use. Runtime serialization does not supply TypeScript declaration libraries. Node declarations remain supplied by `types: ["node"]`.

The effective before/after configurations differ only in `lib`. **All 20 root files**, existing include patterns, Node types, strict options, module settings and no-emit behavior remain unchanged. The three existing playtest specs remain included. No test exclusion, new `any`, suppression or source change was introduced. App configuration and the separate ES2022/WebWorker project are unchanged.

Fresh direct execution with installed **Node 24.19.0 / TypeScript 7.0.2** checked every root reference against its actual frozen configuration:

| Root reference | Fresh result |
|---|---|
| `tsconfig.app.json` | exit 0, no diagnostics |
| `tsconfig.node.json` | exit 0, no diagnostics |
| `tsconfig.sw.json` | exit 0, no diagnostics |

The root has no source files and exactly these three independent references. Each fresh invocation used `--project` on the actual configuration and redirected only `--tsBuildInfoFile` into reviewer-private output. No library override was supplied. Fresh build-info files were created for all three projects; owner build-info bytes were preserved. A fresh `--showConfig` exactly matches the frozen corrected effective configuration.

The retained unchanged-base full-root `tsc -b --force` log contains exactly the original 61 browser-global/type diagnostics and matches its receipt/hash. The author's corrected full-root run exits 0 with an empty diagnostic log. The fresh checks independently confirm their closure across the complete root project set.

## Build applicability and dependency preservation

Reused the unaffected frozen root Vite and default-checker evidence after verifying successful exit codes and exact log hashes. The real root build identity is `local-browser-typecheck-9485a2c`, base `/Learning-is-Fun/`; the checker passes with its normal 8 MiB default, largest asset 6,773,804 bytes, and empty missing/oversized/out-of-scope sets. Existing Vite warnings remain visible.

This earlier accepted-base candidate deliberately contains the original media and source. The main checkout now includes separately reviewed arithmetic and music/cache companions. These receipts establish the causal configuration correction; Controller must run the final combined main build after integration.

The author's before/after shared dependency snapshots are byte-identical across all **15,289** file/link/directory records, including recorded content hashes, targets and mtimes. Its ten main source/media/package snapshots also match within that verification window. Current private dependency targets and package identities match the declared inputs. The private node_modules root is physical and has no shared `.pnpm` junction. This correction used direct entry points without pnpm or installation; its evidence does not erase the preceding music-cache task's separate shared-write incident.

The reviewer used direct compiler commands and private build-info output. All 28 captured relevant main-source, dependency-input and owner build-info files retained exact bytes. No shared dependency rescan, package manager, installation, build rerun, browser journey, production fix, Git mutation, deployment, worker or other-chat message occurred.

## Completion and evidence

**25 independent checks passed; zero remaining failures.** Private evidence: `C:/Users/alexb/AppData/Local/Temp/browser-typecheck-independent-66b3815800cc482497ff99f18c9e226c`. It includes `independent-validation.json`, three fresh project receipts/build-info files, `fresh-effective-node.json`, the directly extracted archive preimage, preservation snapshots and review scripts. The initial raw Git-byte comparison is retained separately; its LF/CRLF assumption was corrected without changing candidate bytes or repeating successful typechecks.

Only this main validation report and private reviewer output were written. The bounded correction is ready for Controller's coordinated integration and final combined build.
