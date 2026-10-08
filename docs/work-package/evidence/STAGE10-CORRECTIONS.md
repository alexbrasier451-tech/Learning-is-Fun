# Stage 10 — owning-author corrections

Controller accepted DEC-033 (selected profile, active panel lifecycle/readiness), DEC-034 (quest/transfer binding provenance and permanent completion), and DEP-148 (Hall artwork). No child, coverage or model change. All authors stopped. Independent rechecks follow; these author reports are not acceptance.

## delivery

Updated **WP01, WP01-02A and WP01-03A** for DEC-026/028.

The audio adapter mapping is explicit, and OfflineStatus is marked accepted. No unresolved interface proposals, scope changes or edge changes remain. Stage 9 complete; stopped before review.

Touched **WP01, WP01-01A, WP01-02A and WP01-03A**.

For Controller freeze, **WP01-01A** now owns pure `src/app/panelLifecycle.ts`:

- `ActivePanelStatus {dirty, pending, failed}`
- `PanelLeaveResult`: ready or blocked with message
- `ActivePanelLifecycle`: `getStatus`, `subscribe`, async `suspend`, explicit `discardDraft`
- `ActivePanelHost.register(panel): () => void`, with token-safe cleanup

**WP01-02A** owns tab-local `selectedProfileId`, passes it explicitly to adventure adapters, and guards navigation/profile switching. It supplies WP04’s exact `readTransientReadiness` constructor input from current panel/transition flags. WP01-03A consumes suspension followed by flush/readiness.

No scope, model, coverage or edge changes. Matching WP02 lifecycle consumption and Controller freeze remain before independent recheck; no final acceptance claimed.

Updated **WP01, WP01-01A, WP01-02A and WP01-03A** to record DEC-033 acceptance. Exact signatures and registration semantics are preserved.

No remaining delivery-interface disagreement. Independent recheck remains pending; quest-binding ownership is unchanged.

## experience

Stage 9 alignment complete for **WP02 and WP02-01A–13A**.

- DEC-031 creative contracts and DEC-032 `selectCommittedActivity` are incorporated, including nullability, unavailable content, Check attribution and no historical-delta celebration.
- No remaining shared proposals, contract blockers, coverage/model changes or dependency-edge changes.
- Checks pass: 14 documents, 18 required headings each, all 40 incoming DEP references.

Stopped before Stage 10 independent review.

Corrections complete in **WP02, WP02-01A, WP02-02A, WP02-06A and WP02-10A**.

- AdventureView explicitly receives `selectedProfileId` and `activePanelHost`.
- QuestActivity implements the DEC-033 suspension/status/discard/teardown contract.
- `WorldProgress.completedStoryBindingIds: readonly ActivityBindingId[]` preserves permanent progress through compaction.
- Request/resume adapters consume WP03 routes and WP04’s exclusive OpenEncounter payload.
- Documented DEP-148’s existing artwork handoff and escaped table union pipes.

No producer disagreements remain. Document checks pass. Binding-contract Controller freeze and independent affected recheck remain; no final acceptance claimed.

Updated **WP02, WP02-01A, WP02-06A and WP02-10A** to mark DEC-034 accepted and remove pending-freeze wording.

No outstanding interface disagreements or scope changes. Stopped for the Controller’s independent affected rechecks; no final acceptance claimed.

## learning

Updated **WP03, WP03-01A, WP03-06A/07A/08A and WP03-13A** under accepted DEC-029.

- **WP03-01A** owns the exact readonly `TaskStimulus` union: array, fraction, clock, diagram and data; common labels/accessibility text; optional/null for text-only tasks.
- Refined clock `face` and diagram edge IDs/labels so rendering never invents assessed information.
- Content producers validate source/answer consistency; catalogue handoff preserves it. Coordinates remain stimulus-only.
- Linked WP02-09A’s renderer/control ownership and preserved concurrent fixture-based construction.

No remaining discrepancy or blocker. No edge, coverage or model changes. Stage 9 complete; stopped before independent review.

Corrected **WP03, WP03-01A, WP03-04A, WP03-05A and WP03-13A**.

Authoritative producer definitions:

- **WP03-01A:** `QuestActivityBinding` adds `sourceBindingId`; `ActivityBindingProvenance` contains `{bindingId, questId, role}`. `LearningRouteIntent` explicitly distinguishes quest, optional-transfer, revisit and general practice. Resume preserves saved provenance.
- **WP03-04A:** `resolveBindingIntent(...) → BindingResolution`; `SelectionRequest.intent` uses `ResolvedSelectionIntent`; selected output includes `bindingProvenance`.
- **WP03-05A:** nine stable M1 bindings plus `validateBindings`, `getRequiredBindingIds` and `areRequiredBindingsComplete`. Only committed correct story work adds permanent `completedStoryBindingIds`; optional work never supplies required completion.
- **WP03-13A:** exact required M2 binding IDs/order and optional revisit rules; M1 required sets remain unchanged.

Transfer survives compaction through permanent source-binding completion plus the immutable singleton anchor’s task ID—no additional history store or UI-supplied previous task.

**Pending:** Controller freeze and consuming-owner alignment, then independent recheck. No learning-side disagreement, edge, coverage, model or split change proposed. Stopped before final acceptance.

Aligned **WP03, WP03-01A, WP03-04A, WP03-05A and WP03-13A** with accepted DEC-034.

Removed pending-freeze wording and confirmed route/provenance, exclusive resume, permanent completion and compaction-safe transfer alignment with WP04/WP02.

No remaining learning-side discrepancy or scope change. Author work stopped; independent affected recheck remains.

## local

Affected: **WP04-01A, WP04-04A, WP05-01A**.

Proposed shared acceptance:

```ts
// src/state/controller.ts — implemented by WP04-04A
selectCommittedActivity(
  snapshot: CommittedSnapshot,
  catalogue: readonly TaskDefinition[],
  key: { profileId: ProfileId; encounterId: string }
): ActivityProjectionResult
```

Exact projection/save fields belong to **WP04-01A**; imported `EligibilityResult` belongs to **WP05-01A**. The selector resolves approved content, returns stored judged feedback, permits null drafts, and reports unavailable content without mutation or regrading.

DEC-031 creative references are aligned. No edge, coverage or model changes. Only Controller acceptance and WP02 consumption of this read contract remain before review.

Aligned **WP04-01A, WP04-04A and WP05-01A** with accepted DEC-032.

No shared proposals, blockers, dependency, coverage or model changes remain. **Stage 9 complete; stopped before Stage 10 independent review.**

Corrected **WP04-01A, WP04-03A, WP04-04A, WP04-06A, WP04-07A and WP05-04A**.

- **DEC-033 readiness:** `readTransientReadiness(): TransientReadiness`, `getUpdateReadiness()` and `flush()` are defined in WP04-01A and implemented by WP04-04A.
- **Binding handoff:** WP04-01A owns exclusive fresh-route/resume `OpenEncounter` payloads and persists imported `ActivityBindingProvenance`. WP04-04A consumes WP03’s resolver/completion helpers; permanent `completedStoryBindingIds` stays WP02-owned.
- **Compaction:** optional transfer resolves from the immutable singleton source binding plus permanent completion; no encounter-history dependency or additional store.
- **Hall:** DEP-148 is included; CON-003 early fixtures remain permitted.

No outstanding cross-lane discrepancy found. Binding shared acceptance and independent affected recheck remain; no final acceptance claimed.

Aligned **WP04-01A, WP04-03A, WP04-04A, WP04-06A, WP04-07A and WP05-04A** with accepted DEC-033/034 and DEP-148.

No outstanding shared proposals or discrepancies. Author corrections complete; stopped for independent affected recheck.
