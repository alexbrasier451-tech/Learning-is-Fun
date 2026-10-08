# Global rules

## Current execution authority

On 8 October 2026 the human instructed: “Restart as the controller. Use the Work Package Implementation skill to complete the work package you just created.” The earlier direct authorization to create and coordinate required visible worker chats remains effective. This authorizes implementation of the signed-off package and supersedes historical planning-only restrictions in the following builder rules, chunk descriptions and evidence. Those historical statements remain as planning provenance, not current blockers.

During execution the Controller owns shared package/status documents, dispatch, integration and commits. Implementation workers own only their explicitly assigned production files and chunk-specific execution evidence. Validators are independent and report-only. Workers must not create/delegate to or message other chats. Follow accepted dependencies and prescribed models/reasoning; release dependent work only after independent validation and administrative acceptance. Preserve unrelated files. The execution ledger distinguishes implementation acceptance from specification acceptance. No product scope or signed-off contract is changed by this authority note.

## Historical package-building rules

Only the Controller writes shared documents. Lane workers write only assigned chunk documents; one writer per chunk. Review workers are report-only except trivial clerical chunk corrections allowed by the builder skill. No worker creates/delegates to or messages another chat. Direct human authorization for Controller-created visible workers is recorded in [REQUEST](evidence/REQUEST.md).

Package builders may inspect source/evidence but must not implement production changes, generate production assets, deploy, or run broad application regression suites. Assigned documents are starting context, not absolute information boundaries: inspect additional material when causal evidence requires it and record why. Human requirements define the intended outcome; current source and reproducible evidence define present state; assistant suggestions and old packages are proposals/historical claims requiring reconciliation.

Use ordinary supported writers and preserve unrelated tracked/untracked files. No Toolkit requirement applies. Do not alter durable instructions or skills. Stage reports contain affected chunk IDs, proposed shared changes, coverage/dependency changes and blockers only. No production authorization follows from package sign-off.

## Authority locations

README owns baseline summary, status, index and live roster. COVERAGE owns stable ID dispositions and support relationships. DEPENDENCIES owns dependency edges and concurrency. DECISIONS owns accepted shared architecture/interfaces. Chunks own bounded implementation detail and acceptance. evidence/INDEX links evidence without unnecessary copies.

## Chunk schema

IDs: WP01 and children WP01-01A. Filenames: chunks/<ID>.md. Title line: '# <ID> — <Title>'. Required second-level headings, exactly:

- Chunk ID and parent
- Purpose
- Coverage IDs
- Current baseline
- Target outcome
- Relevant files and symbols
- Required inputs
- Produced outputs/interfaces
- Dependencies
- Permitted concurrency
- Implementation model/reasoning
- Exact scope
- Explicit exclusions
- Acceptance criteria
- Proportionate verification
- Evidence required
- Known blockers
- Handoff/commit boundary

Chunk ID and parent uses a Field/Value table with 'Chunk ID' and 'Parent' rows; NONE for root. Coverage IDs uses 'Owned: ...' and 'Supporting: ...' lines; parents transfer ownership to children and retain navigation. Implementation model/reasoning uses Field/Value table rows 'Model' and 'Reasoning'. Use explicit NONE when inapplicable. Every final execution chunk has concrete scope, inputs, outputs, acceptance and bounded verification; unresolved prerequisites name actual blockers.

## Mechanical conventions

README index columns: ID | Title | Kind | Parent | Document | Status. Kind is parent or execution. Every chunk appears exactly once; title and parent match. Coverage dispositions: owned (one execution Owner), excluded (NONE, reason), satisfied (NONE, linked evidence), blocked (NONE, named blocker). No blanks at final validation. Supporting relationships are separate from ownership.

Dependency edges: Edge ID | Prerequisite chunk | Dependent chunk | Required handoff. IDs DEP-001 etc. Chunk dependency sections reference their edge IDs. Concurrency: Group ID | Members | Conditions; IDs CON-001 etc. No conflicting writers or prerequisite contradictions. Shared decisions use DEC-001 etc.

Final deterministic validation checks unique IDs, coverage dispositions/owners, referenced dependencies, parent links, required headings and model/reasoning, README agreement, required shared files and links, orphans, cycles and declared conventions. It does not replace independent semantic review or add application quality gates.
