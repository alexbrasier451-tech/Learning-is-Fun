# App icon — independent validation

11 October 2026, following the explicit human resumption. Narrow review of the
frozen addition described in [APP-ICON-HANDOFF](APP-ICON-HANDOFF.md), its listed
source/export, inventory metadata, before snapshots and native-size evidence.
The handoff's 9 October pause is historical; this review is the authorized
resumption. No broader artwork, soundtrack or application acceptance is reopened.

## Verdict and exact identity

**PASS. No actionable defect found in the app-icon addition or its two-count
catalogue integration.** Ready for the Controller's icon handoff acceptance.

| Field | Independently verified value |
|---|---|
| Asset ID | `app-icon` |
| Editable source | `assets/source/art/m1/ui/app-icon.svg` |
| Public export | `public/assets/art/m1/ui/app-icon.svg` |
| Runtime path | `assets/art/m1/ui/app-icon.svg` |
| Intrinsic dimensions / viewBox | 512×512 / `0 0 512 512` |
| Bytes | **3,160**, both files |
| SHA-256, source and export | **`5e1e69dd487d7b8ce484117c6f55ec25969dbc1812dc4c6def8ea59b4c7228c3`** |
| Downstream declaration | SVG, `sizes: "any"`, `type: "image/svg+xml"`, `purpose: "any"` |

## Visual and safety findings

Inspected the retained [native-size capture](../../../assets/source/art/m1/evidence/app-icon/native-scales.png)
at its supplied 1120×980 resolution alongside the unchanged established Pip.
Tall ears, russet head, cream muzzle and stitched teal scarf preserve Pip's
identity and the accepted palette. The large face makes an appropriate icon
adaptation without introducing a new character. The ears, face silhouette and
scarf remain distinguishable at **16px** on light and dark surfaces; the eyes and
expression become clearer at **24px and above**. Stitching is decorative and
does not need to resolve at the smallest size. No clipping, displaced scarf,
broken silhouette or identity mismatch is visible at 16/24/32/48/64/128/192px.

The retained [render measurements](../../../assets/source/art/m1/evidence/app-icon/render-checks.json)
identify this exact hash/byte count: Chromium 156.0.8078.4, deviceScaleFactor 1,
browser sandbox enabled, 14 decoded comparison images, zero page errors and zero
SVG parser errors. Inspected its file-based preview and renderer to confirm the
capture's native pixel sizes. Reused this valid evidence; no rerender was needed.

Source and public bytes are identical, single-line XML with no terminal newline.
Independent XML parsing passed with DTD prohibited and the external resolver
disabled. Markup contains only SVG/title/desc/defs/linearGradient/stop/groups and
rect/circle/path/ellipse primitives. All nine IDs are unique and `app-icon-`
prefixed; every local gradient and accessible-name reference resolves. No script,
event handler, image/font dependency, remote reference, foreignObject, animation,
editor filter, assessed text or external XML entity is present. Title/description
are metadata, not baked puzzle content.

The new ready M1 SVG record has truthful dimensions/bytes, source/runtime mapping,
confirmed original project-use permission and the handoff as retained provenance.
Its statement identifies adaptation of project-original Pip geometry without
claiming human authorship, copyright eligibility or an invented CC0/GPL grant.

## Preservation and narrow inventory integration

Read-only deterministic comparisons against the frozen before snapshots passed:

- **All previous 71 register rows** retain their complete field values and order;
  the schema and other top-level register fields are unchanged. `app-icon` is the
  sole appended row, producing **72 records**.
- All previous **36 art manifest entries** and **36 required-runtime entries**
  are unchanged. Every old source/export hash still matches its recorded value.
  The new inventory is **37 ready M1 SVGs**, totaling **267,896 bytes**; the
  required-runtime list remains unique and art-only.
- All **seven ready audio records** are preserved within those 71 prior rows;
  all seven actual WAV hashes and byte counts match the current accepted-source
  measurements. Their licence/provenance fields are unchanged. The **28 M2 rows**
  remain planned. No audio reproduction or acoustic review was repeated.

The Controller's catalogue edits are exactly the existing expected counts
**71→72** and **36→37**. Reversing only those two numeric changes in memory
reproduces the previously independently reviewed catalogue-test SHA-256
`d65af833024236a6af1200d872fd35173537f527f3a6f4eba9bbecc833201bbb`
(allowing checkout line-ending normalization). Thus no semantic, safe-path,
rights, file/measurement, staged-record or other test assertion was removed or
weakened. Current test SHA-256 is
`a6143780399c0d4d577900894e5dbe30e68d0d54ff560d5bc2d96f87a80bd7e2`.
Reviewed register SHA-256 is
`5558d48569e1c0ed9dcac50b504fd1e7ea603a201a41b102d35fad880817872c`.

## Executed checks and scope limits

1. Inline read-only Node assertions via `node --input-type=module`: exact icon
   identity/bytes/dimensions, markup/reference allowlist, register/provenance,
   before-snapshot preservation, old art/audio file hashes, inventory totals,
   render-evidence identity and reverse-count test fingerprint — **PASS**.
2. .NET `XmlReader`, `DtdProcessing.Prohibit`, `XmlResolver = null`, on the public
   icon — **PASS**, complete parse without external resolution.
3. Existing `tests/experience/catalogue.test.ts`, restricted to
   `testNamePattern: 'per-export inventory lifecycle'` through `startVitest` with
   `run:true`, `config:false`, `cache:false`, `maxWorkers:1`,
   `fileParallelism:false`, `configFile:false` and a private OS-temp cache path
   `app-icon-independent-validation-vitest` — **3 passed, 17 deliberately skipped**.
   This verifies the changed inventory expectations and existing lifecycle/schema
   guards without a broad catalogue or artwork test audit.

No production source, artwork, tests, configuration or shared ledger was changed.
Neither the one-shot finalizer nor the historical 36-art generation/measurement
helpers was run. No Git operation, worker, other-chat message, browser session or
server was started; ports **5195/5196** were untouched. Only this report was added.

This is acceptance of the original SVG **any-purpose icon asset** and its narrow
inventory integration. No raster, maskable-safe-area, browser-installation,
manifest/shell binding, branded D1, published/offline or acoustic acceptance is
required or claimed here. Those downstream owners retain their own checks.
