# Proposed amendment — multi-required-binding verification allocation

Status: ACCEPTED by Controller, 9 October 2026, after [fresh Sol/xhigh independent review](MULTI-BINDING-AMENDMENT-VALIDATION.md) found no substantive findings. The allocation below is authoritative; its original proposal rationale is retained. WP04-04A may proceed under the corrected criteria, but its implementation boundary remains unaccepted pending runtime validation. No execution dependency or release gate is discharged by this documentation acceptance. Controller owns shared DECISIONS/GLOBAL_RULES/status and acceptance records.

## Defect and independent assessment

[WP04-04A's implementation handoff](WP04-04A-HANDOFF.md) identifies an impossible M1 full-save fixture under the signed-off producer contract. The prior WP04-04A acceptance sentence was:

> Exercise a multi-required-binding fixture from the delivered contract: one success persists partial progress, and only all required successes complete the quest even after intermediate compaction/reload.

[WP03-05A](../chunks/WP03-05A.md#produced-outputsinterfaces) fixes exactly nine M1 rows, with one required story anchor for each of Q1–Q3. Its nonempty/all-required helper is general, but no released M1 quest has a nonempty proper subset of required successes. Read-only inspection confirms `src/content/quest-bindings.ts` rejects added M1 rows or changed released meanings; `src/state/backup.ts` validates permanent IDs and completion against that actual registry. `src/state/transition.ts` calls the real helper, checks prerequisites, composes binding/quest/reward changes and validates the complete candidate. Injecting a synthetic registry into the reducer cannot make the unchanged full-save decoder accept it.

The intended product is the three-anchor first slice followed by expansion, as recorded in [REQUEST](../evidence/REQUEST.md) and the signed-off chunks. [DEC-034](../DECISIONS.md) requires all required bindings and prerequisites, permanent completion through compaction and unchanged M1 meanings in M2. [WP03-13A](../chunks/WP03-13A.md#produced-outputsinterfaces) already specifies real multibeat M2 quests; its acceptance oracle explicitly names Q9 clock then sequence and rejects optional work as a replacement. [WP04-07A](../chunks/WP04-07A.md#produced-outputsinterfaces) already requires partial multi-binding progress through reload/round-trip and later final success. These sources support placing the integrated proof there without enlarging M1 or losing the product obligation.

The proposed mapping is sufficient for the intended milestone split, conditional on completing the real M2 case. A pure helper test plus singleton integration is deliberately insufficient evidence for partial multi-required full-save persistence; the amendment does not claim otherwise. No production change is justified merely to admit the M1 synthetic fixture. Actual M2 compatibility changes remain within their existing owner and gate.

## Exact before/after obligation and owner

| Obligation | Before | Proposed after / accountable execution owner |
|---|---|---|
| Nonempty/all-required rule | WP04-04A consumed the producer helper and demanded a multi-required integrated fixture under M1. | WP04-04A exercises the real helper with multiple already specified IDs: empty/missing false, proper subset false, complete set true, including completion-set JSON round-trip. WP03-05A retains helper/registry ownership. This is contract evidence only. |
| Released M1 durable integration | WP04-04A owned the actual anchor, transfer, resume, commit and compaction/reload cases. | Unchanged owner and product scope. WP04-04A proves actual Q1–Q3 helper use and permanent singleton/quest/once-only reward facts through full validation and durable operations. No extra required M1 beat or registry row. |
| Partial multi-required full-save persistence | Literal WP04-04A sentence required it before M1 acceptance; WP04-07A already separately required the M2 partial round-trip. | WP04-07A explicitly discharges the carried obligation within that existing M2 case: actual produced multibeat bindings/tasks, valid prerequisites, first success commits a proper subset with no quest completion/bonus, supported encounter compaction, reload and full backup export/import preserve it, optional work cannot fill the missing ID, final required success completes/rewards once, duplicate/reload remain idempotent. No helper-only substitute. |
| Evidence and acceptance | The M1 sentence could invite an invalid synthetic registry or an overstated helper-only pass. | Separate M1 helper and real singleton evidence; explicitly outstanding M2 integrated proof. Fresh independent amendment review and Controller acceptance precede release of the affected boundary; all other facade checks still apply. |

The helper fixture may use already specified M2 binding identities as contract inputs without claiming they are delivered M1 content. It must not invent question/binding IDs or install fixture data in the product registry. The M2 case must use actual delivered WP03-13A content, not those helper inputs. Its compact expanded fixture remains separate from the immutable real accepted M1 export used for upgrade preservation.

## Affected references and unchanged boundaries

Authored files only:

- [WP04-04A](../chunks/WP04-04A.md): proposed-status note; replace only the impossible multi-required fixture obligation with the explicit M1/M2 evidence split; add evidence attribution.
- [WP04-07A](../chunks/WP04-07A.md): proposed-status note; make the existing M2 partial multi-binding case explicitly carry the integrated compaction/reload/full-save obligation; add its evidence attribution.
- This amendment record: retained prior sentence, rationale, ownership and review disposition.

Supporting references were inspected to establish the causal contract, not amended: WP03-05A fixed registry/helper; WP03-13A existing M2 rows and Q9 oracle; DEC-034 and Stage 10 recheck; REQUEST and GLOBAL_RULES for source precedence; current binding/transition/backup source for the reported decoder boundary; WP04-04A handoff and execution status for outstanding limitations. Historical planning baselines remain historical. Runtime source inspection is not an execution or acceptance claim.

No coverage ID, disposition, owning/supporting relationship, chunk ID, acceptance-table ID, implementation model/reasoning, schema heading, concurrency permission or dependency edge changes. WP04-04A remains Astra/xhigh; WP04-07A remains Sol/high. DEP-031 supplies the M1 registry to WP04-04A. Existing DEP-116/117/118/119 still require the M2 catalogue, completed M1 facade/adult boundary and WP06-04A accepted M1 export before WP04-07A. No reverse M2 prerequisite is added to M1. WP06-04A and WP06-07A remain the respective release acceptance owners.

Controller may record this allocation as an accepted clarification to DEC-034 and link it from the execution ledger once reviewed; this worker makes no shared-document/status edits and assigns no new decision or coverage ID. If review rejects the split, the original contradiction remains blocked for Controller disposition rather than being silently waived.

D1 browser evidence, published PC/tablet play, audio/listening/control obligations, the accepted licensed-music amendment and all unrelated facade defects/checks are unchanged. No new questions, production binding IDs, test-only production port, generic validation bypass, relaxed decoder, migration, reward policy, dependency/configuration change or new test framework is authorized by this amendment.

## Author verification and handoff

Documentation checks passed: comparison against captured pre-edit text confirms identical schema headings and changes only in Acceptance criteria and Evidence required, plus the leading proposed-status notes. Coverage, dependencies, concurrency, models, produced interfaces and exact scope sections are unchanged. All 41 relative document links across the three authored files resolve. The original impossible sentence is retained here and removed from the M1 obligation. No runtime tests, broad suites, Git operation, delegation or other-chat message was performed. Independent review must assess the allocation against the signed-off sources and evidence limits; Controller acceptance and subsequent implementation validation remain outstanding.
