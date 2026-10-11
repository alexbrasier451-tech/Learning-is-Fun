# App icon — original art handoff

9 October 2026. **Ready for narrow independent review. Register writer released.**
No server or port was used; 5196 and 5198 were untouched. Chromium was closed
after the private file-based render. No Git operations, delegation, other-chat
messages, dependency/build/cache changes or main-app/configuration edits.

## Exact deliverable

| Field | Value |
|---|---|
| Register ID | `app-icon` |
| Editable source | `assets/source/art/m1/ui/app-icon.svg` |
| Byte-identical public export | `public/assets/art/m1/ui/app-icon.svg` |
| Base-relative runtime path | `assets/art/m1/ui/app-icon.svg` |
| Intrinsic size / viewBox | 512×512 / `0 0 512 512` |
| Bytes, each file | **3160** |
| SHA-256, both files | `5e1e69dd487d7b8ce484117c6f55ec25969dbc1812dc4c6def8ea59b4c7228c3` |
| Manifest declaration for downstream owner | `sizes: "any"`, `type: "image/svg+xml"`, `purpose: "any"` |

The original icon places Pip's recognisable tall ears, cream muzzle and stitched
teal scarf on a rounded cream storybook tile with a pale meadow inset. The head
and scarf adapt this project's original `pip-idle` geometry; eyes are slightly
enlarged for small-scale readability. No new character or external art was used.
This is a square `any` icon; no maskable-safe-area claim or raster export.

All IDs use `app-icon-`: title, description, paper/meadow/fur gradients, tile,
Pip, head and scarf. No script, remote reference, embedded raster, event handler,
font, assessed text or animation. XML is stored on one line without a trailing
newline to keep measured bytes stable across line-ending conversions. SVG
groups remain editable.

## Provenance and permission

Author: **OpenAI Codex — original SVG artwork for Learning is Fun**. Created under
the explicit project instruction for an original free-tool Pip app icon.
Project-use holder: **Learning is Fun project requester (AI-generated project
output)**. This identifies the recipient and authorized project use, without
asserting human authorship, copyright eligibility/exclusivity or inventing a
third-party grant. No stock pack, paid service, account, trial, downloaded font
or media-generation tool was used. No CC0/GPL relicensing. Attribution is
“Original artwork created with OpenAI Codex for Learning is Fun.” The new
register record retains this handoff as its provenance evidence.

## Verification and preservation

[Native-size comparison](../../../assets/source/art/m1/evidence/app-icon/native-scales.png)
shows the icon beside the unchanged established Pip, then at **16, 24, 32, 48,
64, 128 and 192 CSS px**, and 16–64px on a dark surface. Inspected at device scale
factor 1: ears, muzzle and scarf remain recognisable at 16px; eyes/expression
resolve more clearly at 24px and above; no edge clipping or identity mismatch.
Small stitching detail is decorative, not required for recognition.

Private native renderer: Playwright Chromium **156.0.8078.4**, 1120×980 viewport,
deviceScaleFactor 1, browser sandbox enabled. All 14 comparison images decoded;
zero page errors and zero SVG parser errors.
[Render measurements](../../../assets/source/art/m1/evidence/app-icon/render-checks.json).
The ordinary filesystem-sandbox attempt crashed before opening a page; the same
file-only check passed under approved normal-user execution without disabling
Chromium sandboxing. This is SVG rendering evidence, not installation, platform
manifest, D1 Chrome or published/offline acceptance.

The new ready M1 SVG row was appended without reserializing the prior 71 rows.
All prior records, including audio bytes/provenance/licences and planned M2,
are unchanged. Existing 36 source/export SHA-256s match the pre-addition art
manifest. The only inventory updates are `assets/asset-register.json`,
`assets/source/art/m1/manifest.json` and `required-runtime.json`: **72 records,
37 ready M1 SVGs, 7 ready M1 audio records, 28 planned M2 records**. M1 art total
is now **267896 bytes**. Earlier 36 export entries/list items are unchanged;
`app-icon` is appended. The M1 required-runtime file remains an art-only list.
[Preservation and safety checks](../../../assets/source/art/m1/evidence/app-icon/verification.json).

The private `inspect-icon.mjs` can rerender the file-based comparison;
`finalize-icon.mjs` is a guarded one-shot record of this insertion, not a command
to rerun after release. Its before snapshots retain comparison evidence. The
historical original-36 `build-art.mjs`/`measure-art.mjs` helpers and preview were
not expanded by this narrow addition; use the icon's own evidence for this asset.
The catalogue owner owns the requested fixed-count test update; no catalogue
test or production manifest was edited here. Offline owner may now bind the
ready runtime icon path and the `any` manifest declaration above.

## PAUSED — human request, 9 October 2026

Paused at the completed icon checkpoint. No further implementation, review,
build, test suite or external action started. No work resumes until the human
explicitly requests it.

Completed changes: original 512×512 icon pair, ready register row, appended M1
inventory metadata and native-scale evidence. Latest actual verification was
the final Node assertion pass recorded above: identical 3160-byte pair and
matching SHA-256, evidence present, 72 register records / 37 M1 SVGs, previous
71 records unchanged. Chromium native-size inspection passed earlier; no new
verification was run for this pause.

Exact task-authored paths left for Controller integration (this worker made no
commit and did not inspect Git state):

- `assets/source/art/m1/ui/app-icon.svg`
- `public/assets/art/m1/ui/app-icon.svg`
- `assets/asset-register.json`
- `assets/source/art/m1/manifest.json`
- `assets/source/art/m1/required-runtime.json`
- `assets/source/art/m1/evidence/app-icon/register-before.json`
- `assets/source/art/m1/evidence/app-icon/manifest-before.json`
- `assets/source/art/m1/evidence/app-icon/required-before.json`
- `assets/source/art/m1/evidence/app-icon/inspect-icon.mjs`
- `assets/source/art/m1/evidence/app-icon/finalize-icon.mjs`
- `assets/source/art/m1/evidence/app-icon/preview.html`
- `assets/source/art/m1/evidence/app-icon/native-scales.png`
- `assets/source/art/m1/evidence/app-icon/render-checks.json`
- `assets/source/art/m1/evidence/app-icon/verification.json`
- `docs/work-package/execution/APP-ICON-HANDOFF.md`

Process/output identity: no active app-icon browser, server, port or command
session. The file-based Chromium browser closed in `finally`; ports 5196/5198
were never used. Register ownership was released before this pause. Evidence
is preserved at the paths above; unrelated files and user sessions untouched.

Pending dependencies: narrow independent media review, catalogue owner's count
assertion update and offline owner's manifest integration/acceptance. On explicit
human resumption, Controller should first check whether those consumers have
already accepted the frozen icon; return only specific art corrections here.
Do not rerun the guarded one-shot finalizer or overwrite subsequent register work.
