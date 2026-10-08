Propose the following scaffold under `docs/work-package/`. Preserve the existing evidence files. No files were changed.

| File | Authoritative contents and initial state |
|---|---|
| `README.md` | Purpose, concise reconciled baseline, package status, navigation, live worker roster and chunk index. State “Stage 2 structure established; decomposition pending; implementation not authorized.” Link the accepted baseline and request supplement. Start the chunk index empty. |
| `GLOBAL_RULES.md` | Ownership, source precedence, planning-only scope, chunk schema and mechanical conventions below. |
| `COVERAGE.md` | Stable obligation inventory, final dispositions and supporting relationships. Seed the 58 proposed IDs from BASELINE: `REQ-001–014`, `PROP-001–029`, `BND-001–003`, `BASE-001`, `GAP-001–011`. REQUEST qualifies their meaning. |
| `DEPENDENCIES.md` | Authoritative dependency edges and explicitly permitted concurrency. Start both tables empty; no implementation concurrency is yet approved. |
| `DECISIONS.md` | Accepted shared architecture/interface decisions only. Initially state that no stack, art direction, scoring formula, weekly policy or PWA contract has been selected. |
| `chunks/` | Assigned chunk documents, created from Stage 3 onward. |
| `evidence/INDEX.md` | Links to REQUEST, BASELINE, the complete source attachment and the four Crazy Rummy references already identified by BASELINE. Describe each reference’s evidential role without copying its contents. |

README should distinguish the complete first bridge/spellbook/merchant slice from sequenced broader aspirations, linking REQUEST for details. It should identify visual quality, free-tool asset provenance and eventual published-link agent playtesting as material requirements. These are navigation summaries; COVERAGE owns dispositions and chunks own implementation detail.

Use this exact schema for every chunk, with each field an `##` heading:

```markdown
# WP01 — Title

## Chunk ID and parent
| Field | Value |
|---|---|
| Chunk ID | WP01 |
| Parent | NONE |

## Purpose
## Coverage IDs
## Current baseline
## Target outcome
## Relevant files and symbols
## Required inputs
## Produced outputs/interfaces
## Dependencies
## Permitted concurrency
## Implementation model/reasoning
## Exact scope
## Explicit exclusions
## Acceptance criteria
## Proportionate verification
## Evidence required
## Known blockers
## Handoff/commit boundary
```

Use explicit `NONE` where genuinely inapplicable. Early-stage documents may name unresolved decisions; final execution chunks must resolve them or identify a concrete blocker. Under “Coverage IDs,” separate owned IDs from supporting IDs. Under “Implementation model/reasoning,” use a two-column table naming both values.

Recommended global rules:

- Only the Controller writes shared documents; workers write assigned chunks, with one writer per chunk.
- Builders may inspect source/evidence but may not implement production changes, deploy, generate production assets or run broad regression suites.
- Assigned documents are starting context, not absolute boundaries. Record why additional inspection was necessary.
- Human requirements define the intended outcome; current source and reproducible evidence establish present state. Historical packages and assistant proposals require reconciliation.
- Preserve unrelated files and use ordinary supported writers. No Toolkit transaction is required.
- Stage reports contain affected chunk IDs, proposed shared changes, coverage/dependency changes and blockers.
- Preserve one authoritative location per fact: shared decisions in DECISIONS, dependency/concurrency records in DEPENDENCIES, dispositions in COVERAGE, detailed interfaces and acceptance criteria in their owning chunks. Other documents link to those authorities.

Use one coverage table:

```markdown
| ID | Obligation | Source | Disposition | Owner | Reason/evidence/blocker |
```

Its final disposition vocabulary should be exactly:

| Disposition | Required accompanying data |
|---|---|
| `owned` | One accountable execution chunk in Owner |
| `excluded` | Owner `NONE`; explicit reason |
| `satisfied` | Owner `NONE`; linked evidence |
| `blocked` | Owner `NONE`; named blocking dependency and explanation |

Supporting relationships belong in a separate table:

```markdown
| Coverage ID | Supporting chunk | Contribution |
```

Stage 2 can seed the obligation inventory with disposition/owner cells blank, clearly marked **provisional and incomplete until Stage 4**. Do not invent owners or call decomposition itself an implementation blocker to obtain artificial completeness. Final validation rejects blanks. When splitting chunks, transfer ownership to one child and retain the parent as navigation; supporting contributions never create a second owner.

Recommended machine-checkable conventions:

- Chunk IDs: `WP01`, with children such as `WP01-01A`; filenames exactly `chunks/<ID>.md`. Parent is `NONE` or one existing chunk ID.
- README index columns: `ID | Title | Kind | Parent | Document | Status`. Kind is `parent` or `execution`. Every chunk file has exactly one index row; indexed title, ID and parent match its document.
- Dependency table: `Edge ID | Prerequisite chunk | Dependent chunk | Required handoff`. Use IDs such as `DEP-001`. Chunk dependency sections reference these edge IDs; exact output contracts remain in the producing chunk.
- Concurrency table: `Group ID | Members | Conditions`. Use IDs such as `CON-001`; chunk concurrency sections reference approved groups. No group may contradict a prerequisite handoff or permit conflicting writers.
- Shared decisions: `Decision ID | Accepted decision | Rationale/source | Affected chunks`, using `DEC-001` onward.
- Validate unique IDs, valid references, acyclic parent/dependency relationships, required headings, named implementation model/reasoning, exact coverage dispositions, valid ownership, index/file agreement, working package links and orphan records. Add no broader test gates.

There is no blocker to creating this scaffold. Repository publication details, art direction, content scope, scoring, rollover and persistence policies remain later planning resolutions; they should remain visible in COVERAGE without prematurely choosing semantic lanes or architecture.
