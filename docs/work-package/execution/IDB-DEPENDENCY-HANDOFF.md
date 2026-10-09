# idb dependency handoff for WP04-02A

Prepared and executed 9 October 2026. **Installed after explicit exclusive tooling-window release; installation and focused checks are finished.** Ready for independent review and controller commit. During preparation only this evidence document was written; package/lock/policy/modules were unchanged until release. During the released window only the exact idb manifest/lock additions, installed dependency and this evidence were changed. No project build, broad typecheck/test, browser run, commit or other-chat message was performed.

## Selected package and verified provenance

Pin runtime dependency **`idb: "8.0.3"`** as instructed by the controller. This is a published, established idb 8.x release satisfying WP04-02A's accepted helper contract; no newest-patch requirement applies.

- [Official release metadata](https://registry.npmjs.org/idb/8.0.3) reports version 8.0.3, licence ISC, ESM/CJS exports and bundled TypeScript declarations at `build/index.d.ts`.
- Registry publication time: `2025-05-07T08:12:54.533Z`.
- [Official tarball](https://registry.npmjs.org/idb/-/idb-8.0.3.tgz): 16368 bytes.
- Tarball SHA-512 computed from the downloaded bytes matches both registry metadata and the controller-supplied expected integrity:

```text
sha512-LtwtVyVYO5BqRvcsKuB2iUMnHwPVByPCXFXOpuU96IZPPoPN6xjOGxZQ74pgSVVLQWtUOYgyeL4GE98BY5D3wg==
```

Fetched and checked in memory at `2026-10-09T00:26:19.062Z` (01:26:19 BST). The tarball's `package/package.json` confirms version/licence/exports. It declares no runtime dependencies, peer dependencies, optional dependencies or Node engine constraint. Its own development dependencies are not project installation requirements. No transitive package expansion is expected for the new direct idb 8.0.3 entry.

The existing lockfile already contains transitive `idb@7.1.1` for accepted tooling. Preserve that entry and its consumers; adding a direct 8.x helper is not authority to upgrade or deduplicate unrelated dependencies. Release-age policy needs no new exception for this 2025 release. The existing Vite-only exception stays unchanged.

Compatibility evidence at preparation was package-level: standard ESM/CJS entry points, bundled declaration files and no engine/peer conflict with the project Node 24/TypeScript toolchain. Installed import/type resolution subsequently passed in the released window as recorded below. No IndexedDB transaction or browser behavior is claimed by this dependency handoff.

## Exact intended manifest/lock delta

Add the runtime pin before the existing React entries:

```json
"idb": "8.0.3"
```

Expected pnpm v9-format lock additions, without deleting the existing idb 7.x entry:

```yaml
importers:
  .:
    dependencies:
      idb:
        specifier: 8.0.3
        version: 8.0.3

packages:
  idb@8.0.3:
    resolution: {integrity: sha512-LtwtVyVYO5BqRvcsKuB2iUMnHwPVByPCXFXOpuU96IZPPoPN6xjOGxZQ74pgSVVLQWtUOYgyeL4GE98BY5D3wg==}

snapshots:
  idb@8.0.3: {}
```

The snippets describe additions within existing sections; they are not a replacement lockfile. Let the pinned pnpm generate its canonical entries, then inspect the exact diff. No scripts, tool versions, workspace policy, browser configuration or other direct/transitive versions are authorized to change.

Read-only preparation hashes:

| File | SHA-256 |
|---|---|
| package.json | `80a61698c36fb688527c62eac98419692df68e6ab9aa15497cfa142f49852f04` |
| pnpm-lock.yaml | `85d272ace969b7c22b638710f21b7c1e2ab53de87678bcd308bd22dbac577a4a` |
| pnpm-workspace.yaml | `e642806ffde8706aeeba1b6cbc23306f620e468cb6b1d65a1b8cf2ae731f4018` |

These are observed preparation evidence, not frozen transaction preconditions. Re-read current files at release and preserve any controller-authorized intervening changes.

## Bounded execution after explicit release

Controller must release the short tooling window before any package/lock/module mutation or installation. No elapsed-time assumption substitutes for that release.

Use the existing bundled Node 24/pnpm 11.25.0 launcher with a child environment that removes all case-insensitive PATH keys and supplies one short `Path`: bundled Node bin, bundled pnpm fallback, `C:/Windows/system32`, `C:/Windows`. This changes only the child environment, not machine/user settings.

1. Re-read current manifest/lock/workspace policy and check that only the requested dependency delta is pending.
2. Execute `pnpm add idb@8.0.3 --save-exact` through that child environment.
3. Inspect package/lock/workspace diffs; require exact idb pin/integrity, preserve existing idb 7.x and every unrelated version, and require no workspace-policy change.
4. Execute `pnpm install --frozen-lockfile`.
5. Run a harmless installed ESM import check for `openDB`, `deleteDB`, `wrap`, `unwrap` without invoking IndexedDB. Typecheck a temporary focused source importing `openDB`, `DBSchema` and `IDBPDatabase` under strict ES2022/DOM/Bundler TypeScript settings; remove it in `finally` cleanup.
6. Verify the installed version and LICENSE match this handoff, record exact results here, inspect the bounded final diff, and return control for independent review/commit.

No broad application typecheck, app build, gameplay suite, browser run or unrelated update is part of this tooling window. WP04-02A owns real IndexedDB transaction verification after its own implementation; this handoff does not grant implementation acceptance.

## Retained actual ISC notice

Extracted from the integrity-verified tarball's `package/LICENSE`, 776 bytes, SHA-256 `873a2f333fda393ec3464f4579209b019d98e97c3bf498b10e85f630162fd708`. The full upstream body is retained below. Preserve it in applicable source/release distributions.

```text
ISC License (ISC)
Copyright (c) 2016, Jake Archibald <jaffathecake@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## Execution result

The controller explicitly released the exclusive tooling window after other authors/reviewers held checks. Re-read package/lock/workspace hashes; all three still matched the preparation baseline. Used bundled Node 24.19.0/pnpm 11.25.0 with the documented short child Path, preserving machine/user settings.

Exact results:

1. `pnpm add idb@8.0.3 --save-exact` — exit 0; one package added, idb 8.0.3. Existing transitive deprecation warning for glob@11.1.0 is unchanged. No added release-age exception.
2. Inspected generated diff: package.json has only runtime `idb: "8.0.3"`; pnpm-lock.yaml has only the expected importer, integrity and empty snapshot additions shown above. pnpm expanded the existing engines formatting; restored its original formatting to keep the final manifest delta to one line. No dependency/version/policy change beyond idb.
3. `pnpm install --frozen-lockfile` — exit 0, already up to date, 251 ms. No lock mutation needed.
4. Installed `import('idb')` — pass: `openDB`, `deleteDB`, `wrap` and `unwrap` resolve as functions; installed package version is exactly 8.0.3. No IndexedDB API was invoked.
5. Installed LICENSE is 776 bytes and SHA-256 `873a2f333fda393ec3464f4579209b019d98e97c3bf498b10e85f630162fd708`, exactly matching the verified tarball and retained notice.
6. Focused strict ES2022/DOM/Bundler import/typecheck — exit 0. The temporary `.idb-import-check.ts` imports `openDB`, `DBSchema` and `IDBPDatabase`, defines a tiny typed records schema, and typechecks an uncalled open function. It was removed in `finally` cleanup.

The first focused compiler invocation without `--ignoreConfig` stopped at TypeScript 7 diagnostic TS5112 (command-line source beside tsconfig.json). This was command setup, not an idb type error. Reran only that focused check with the required flag; no application source or compiler configuration was changed. Successful command:

```text
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --types node .idb-import-check.ts
```

Final bounded review confirms every pre-existing manifest/lock entry is preserved and pnpm-workspace.yaml retains its original hash/exception. No broader build or tests were run. The temporary probe is absent. **Installations and checks are finished; controller may release other authors' checks.** WP04-02A can now import the pinned helper for its separate repository implementation and real-browser transaction verification.
