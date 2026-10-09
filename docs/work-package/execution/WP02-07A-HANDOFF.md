# WP02-07A — M1 companion and saved creative ending

Implemented 9 October 2026 as the assigned sole author. Ready for independent
validation; Controller owns acceptance, integration and commits. Ordinary writes
worked. No delegation, other-chat messages, Git/status/shared-document changes,
catalogue/assets/audio/state/reward changes or dependency installation.

Inputs were released by Controller: ready M1 art, audio runtime
`24fb54e7c9104165391e9d1be655721ef5272105` with independently passing real binding,
atomic facade/core `97482c4b791a84c55384c623163664c7d1fdddbc` with fresh integration
PASS, scoring/entitlements, static catalogue and approved learning guidance.

## Output and composition contract

- `src/experience/CompanionView.tsx` exports `CompanionView` and its readonly props.
  Exact named inputs: `pose`, `visibleGuidance`, optional `nextActivityLabel`,
  `onRequestHint`, `onChooseNext`, `onRead`, `onStopReading`, `audioStatus`.
  Guidance/next labels are supplied strings; the component neither selects,
  judges, invents hints nor speaks automatically. It renders the ready idle/help/
  celebration SVGs and explicit Read/Stop actions against actual `AudioStatus`.
  Text remains visible while silent or unavailable.
- `src/experience/CreativePlot.tsx` exports `CreativePlot`, `CreativePlotProps`,
  `M1CreativeChoices`, `CreativeSaveStatus`. Exact named inputs: `saved`,
  `availableChoices`, `entitlements`, `pending`, `saveStatus`, `onSave`, `onCancel`.
  `saved` is accepted `CreativeState`; `onSave` receives the accepted complete
  `{ kind: 'appearance', value: CreativeState }`, including all six socket keys.
  `availableChoices` contains readonly scarf/flower/socket/decoration/cosmetic
  arrays from the accepted catalogue. The host filters quest prerequisites from
  committed world progress. The component filters to M1 and shows three free
  scarf/flower colours and three sockets, one movable/removable planter, leaf
  pattern and rim. Entitlements are supplied committed IDs; no points arithmetic,
  spending, quest/reward action or second store exists in the component.
- `src/experience/creative.css` supplies illustrated meadow/palettes, native
  controls at least 48px high, 18px text, visible keyboard focus, reflow and OS
  reduced-motion handling. All layered images use the accepted shared artwork
  coordinates and `assetUrl`.

**Required host scope:** mount CreativePlot with a React key containing captured
`profileId` and `snapshot.token.epoch`. The fixture additionally uses a selection
generation so switching away and back clears its old preview. Do not key by
revision: ordinary commits/conflicts must preserve a dirty preview. Capture
profile/token/action before awaiting; ignore UI results when that scope has
changed. Keep the saved prop sourced from the acknowledged facade snapshot.

CreativePlot owns only preview and undo history. Preview/move/undo do not call
`onSave`; Cancel restores the latest `saved` prop and calls `onCancel`. Editing,
undo, cancel and Save are disabled while Save is pending. Failed/conflicting
saves retain an explicitly unsaved preview. Committed/already-applied statuses
acknowledge only a preview matching the saved arrangement. The host owns any
celebration: only a new committed Save, never already-applied/reload/preview.

`saveStatus` accepts `idle`, `committed`, `already-applied`, `conflict`,
`save-failed`, `invalid`, `unsupported`. The accepted props need no world/final
shell dependency. WP02-06A must supply its assistance/selection adapter and panel
readiness/lifecycle; WP02-11A can extend the finite arrays sequentially.

## Real early host and evidence

Owned fixture files: `tests/fixtures/creative.html`, `creative.tsx`,
`creative-api.ts`, `creative.config.ts`, `creative.vite.config.ts`,
`creative-teardown.ts`, `creative-run.ps1`; owned spec:
`tests/browser/creative.spec.ts`. Node specs import only the erased pure API;
they never import executable TSX/DOM/audio implementations.

The mountPanel host constructs one actual state facade, native IndexedDB
repository, full validator/catalogue/bindings, preference helper and accepted
audio runtime. No fake writer or second store. Two profiles use real
CreateProfile. Q1–Q3/entitlements use real OpenEncounter/SubmitCheck commands
with a bounded test-only answer oracle; no answer oracle reaches product views.
Approved instruction/hints come from actual reviewed task/projection content.
Next activity enters the facade's suggested-practice selection. Answer hints
are projected only from committed revealed-assistance IDs. Failed help offers
the same explicit hint button to retry. Speech is always a later explicit Read.

Each Save uses one captured ChooseCosmetic envelope. Native abort retry retains
the identical envelope; conflict retry captures the refreshed token only on the
next explicit Save. Held writes exercise pending UI. A sibling real facade
creates conflicts and epoch replacement. Old-profile/epoch UI responses are
ignored without retargeting their command. Actual transactions are aborted
after native `put`; results are not synthesized.

Final full run:

```text
./tests/fixtures/creative-run.ps1
44 passed; 0 skipped, unexpected or flaky; 71.097 seconds
Started 9 October 2026, 04:58:16.938 BST
```

Private result root:
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-creative-dae97eb8511f4460b73e80144476a847`.
`results.json` holds all results and JSON attachments with native root,
acknowledged snapshot, command identities, ordered events, browser versions and
celebration counts. Eleven cases each ran in Chromium support (1366×768),
Edge D2 (1920×1080), Chromium T1 emulation (1024×768) and WebKit T2 emulation
(768×1024). Tablet choice cases use actual Playwright touch taps.

| Observation | Evidence |
|---|---|
| Each of scarf/flowers/placement | All three free options; preview→undo→Cancel leaves snapshot exactly unchanged; held Save disables edits; one acknowledged revision; real reload restores arrangement; native abort retains preview; identical-envelope retry; two-tab conflict retains preview; explicit retry succeeds. Rewards and encounters remain unchanged. |
| Committed world/entitlements | At zero, leaf/rim locked and no planter/flower/socket controls. Actual suggested-practice success reaches exactly 20: leaf available, no Q3 planter, no spending on appearance Save. Real Q1/Q2 leave planter unavailable; only committed Q3 enables flowers/sockets/rim. Q3 unassisted fixture totals 120; appearance Save preserves every reward fact. |
| Profile and epoch isolation | Held original child's Save may commit to that child only; next child stays unchanged, gets its own saved preview, no celebration. Real ResetSave changes epoch; old held result cannot apply to a newly created child. |
| Acknowledgement/Cancel | Another facade saves the same preview; local Save returns already-applied and produces zero celebrations. Subsequent Cancel uses another facade's latest committed arrangement. |
| Approved help | Hint text/speech absent while held and after native abort. Retry commits approved hint ID before revealing text. No automatic speech. Explicit Read enters actual runtime with a labelled simulated local voice after acknowledgement; Stop cancels it. Silence leaves visible text. Late help cannot appear/speak for another child. |
| Accessibility/visuals | Native Space/Enter selection and Save; controls ≥44×44 and text ≥18px; 360px reflow without horizontal overflow; celebration animation absent under reduced motion. |

After that full run, strengthened only the WebKit help branch to explicitly
activate the unavailable audio path and assert visible text/fallback. Final
`creative-run.ps1 -Project creative-webkit-T2 -Filter 'approved help'`:
**1 passed**, 2.6s; root
`C:/Users/alexb/AppData/Local/Temp/learning-is-fun-creative-f05bf0e6452d4d70aa765128390fae4e`.
This is an affected-case recheck, not a second full 44-case run.

Strict ES2022/DOM/JSX check of `src/vite-env.d.ts` + `creative.tsx` passes.
Separate strict Node/ES2023 check of `creative.spec.ts` passes with no DOM libs
or shared config expansion. No emit/incremental cache, broad package suite or
producer rerun. Earlier producer regression/threshold evidence is reused.
Owned whitespace scan is clean; private port5187 is released. Private Vite
cache/reports/output and max1 worker were used; Hall5185/adult5186 untouched.

Visual inspection used final `preview.png`, `saved.png`, `narrow.png` beneath
`playwright/creative-keyboard-tap-size-1a609-illustrated-visual-evidence-<project>`
in the full result root. Inspected desktop/tablet and 360px renders: original
scarf/leaf and planter/flower/rim layers align; controls/status/focus fit and
remain legible. Adjusted Pip spacing after initial narrow inspection, then
reran the complete owned suite. Existing original-art pose review is reused.

Initial failures were test defects (ambiguous duplicate Stop locator, DOMRect
serialization, waiting for queued refresh before releasing the held write,
and reading preference evidence before queue settlement). Preserved failed
roots `440b35421f774fb2ba6bc0792d6484f7` and
`f6decd966d2848208f635f36664ba048` beneath the same temporary-root prefix;
all original cases pass in the final run. No producer compensation was needed.

## Remaining requirements and limits

No known owned source failure. Independent validation/administrative acceptance
remain outstanding. D1 Chrome/D3 Firefox are unavailable per accepted discovery;
Chromium support is not Chrome, WebKit on Windows is not physical Safari/iPad,
and Edge evidence does not resolve the pending human Edge-primary approval.
No installations/security changes or implicit browser substitution.

The exact 60-point reward threshold is covered by the accepted scoring producer;
this host verifies committed rim entitlement with actual Q3 (120 points), not a
fabricated Q3-at-60 save. Locked rim remains visible before Q3. Guidance selection
and scoring continue to belong to their producers. Simulated voice proves
speech ordering/lifecycle only; WebKit's unavailable activation proves text
fallback. No acoustic quality/local device voice, physical device, child-testing,
published game, final-shell/world/quest journey, M2 or package acceptance claim.
Physical-device/child-testing is not introduced as an extra mandatory gate.

Final source SHA-256:

```text
CompanionView.tsx f4e3180a85fc0ba2192c8e9f2d29fd96c51aa53a68bf288ff24e3329195e8147
CreativePlot.tsx eb0b4dbaa352f138a6378fdaf0f08c9440d5974cb3c31abc564550498ba0db9f
creative.css ac193898f3b5a28ec2c77c24d38922b2f4fffe9e3e056dc2e3d6da13553c8d92
creative.tsx d6f872d8ac88eff1a3a3e4dd56d3d6cce307609c703acda0e34621c39750204d
creative.spec.ts a824d54cf541cd0492a8ae94ff18457f7a2e959f226b08f3cd191a4b329c3d01
```
