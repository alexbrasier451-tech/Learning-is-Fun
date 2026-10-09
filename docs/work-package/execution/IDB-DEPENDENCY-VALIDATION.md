# idb dependency and retained-byte packaging — independent validation

Date: 9 October 2026. Reviewed against HEAD `8e351c7e6e0d76c7a5c8087b101c80274c414856`, reusing the accepted WP01-01A foundation context and [IDB-DEPENDENCY-HANDOFF](IDB-DEPENDENCY-HANDOFF.md).

**Verdict: ACCEPTED for both bounded changes.** Finding severity: NONE. No invalidated foundation criteria. Dependency acceptance does not accept WP04-02A repository behavior; retained-byte verification does not reopen the independently accepted audio/licensing judgement. Controller owns administrative acceptance and commits.

## Exact dependency delta and installed evidence

- `package.json` adds only runtime `idb: "8.0.3"`. `pnpm-lock.yaml` adds only its direct importer, the recorded SHA-512 integrity entry and empty snapshot. Independently removed those exact additions in memory and compared the resulting texts with HEAD: both match exactly. Existing transitive `idb@7.1.1`, its consumers, all other pins, scripts and lock settings are preserved.
- `pnpm-workspace.yaml` matches HEAD and its recorded preparation SHA-256 `e642806ffde8706aeeba1b6cbc23306f620e468cb6b1d65a1b8cf2ae731f4018`. No release-age or other policy change.
- Installed `node_modules/idb/package.json` reports exactly **8.0.3 / ISC**. Its LICENSE is **776 bytes**, SHA-256 `873a2f333fda393ec3464f4579209b019d98e97c3bf498b10e85f630162fd708`, matching the handoff's retained full notice. The lock integrity is exactly `sha512-LtwtVyVYO5BqRvcsKuB2iUMnHwPVByPCXFXOpuU96IZPPoPN6xjOGxZQ74pgSVVLQWtUOYgyeL4GE98BY5D3wg==`.
- Independently imported the installed package in a fresh Node process: `openDB`, `deleteDB`, `wrap` and `unwrap` all resolve as functions. No IndexedDB operations were invoked. Reused the owner's successful frozen install and focused strict ES2022/DOM/Bundler declaration check; the documented TS5112 command setup retry is resolved. `.idb-import-check.ts` is absent.

## Administrative retained-byte verification

`.gitattributes` contains only the explanatory comment and these narrow rules:

```gitattributes
assets/source/audio/licensed/*.html -text
assets/source/audio/licensed/creator-license.txt -text
```

Following correction commit `33ca3bc7209a9697b54f53ff51698b4c7ece83e1`, independently ran `git hash-object --no-filters -- <path>`, compared each result with `git rev-parse HEAD:<path>`, and checked `git check-attr text -- <path>`. **All six raw-file object IDs equal their HEAD blobs; all six have `text: unset`.** Paths below are relative to `assets/source/audio/licensed/`.

| Exact file | Raw object ID = HEAD blob |
|---|---|
| `a-tale-of-peace-source.html` | `edfb32e928b8f05d5afa44b74bad242a75d94d19` |
| `cc-by-3.0-legalcode.html` | `0687f31d07c889828bb49e4a2076f13571a1cedc` |
| `cc0-1.0-legalcode.html` | `e9365d245955fdb6bc9c1e850dc7aac5e953921d` |
| `creator-license.txt` | `3fe0d6c1bc841d325d770794846d5c31398c4b27` |
| `market-on-the-sea-source.html` | `a8868a6aac2df0d6a4834367fcd632bb33ce74dd` |
| `sunset-walk-source.html` | `1eba9572c41fcbaf8ebc9c5585efe8b8c8771d3a` |

Only this report was authored. No installations, module/cache/config mutations, broad builds/tests, music review, shared-status edits, commits, workers or other-chat messages were performed. Concurrent repository/preference authors' files and checks were left undisturbed.
