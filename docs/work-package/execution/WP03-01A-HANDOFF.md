# WP03-01A implementation handoff

Implemented by Codex on 8 October 2026. DEP-001 was released by Controller after
independent foundation acceptance. This reports bounded implementation evidence;
independent validation and administrative acceptance remain Controller-owned.

## Behavior and files

- `src/learning/contracts.ts`: readonly JSON task/response/result/manifest,
  selection/history/evidence/summary DTOs; exact DEC-025 observations,
  DEC-029 stimuli and DEC-034 binding/provenance/route producer definitions.
  Wrong Check completion is null; correct completion is success; deliberate
  finish has no submission or Check index. Persisted episode/command/save,
  reward and world shapes remain downstream-owned.
- `src/learning/identity.ts`: validates meaningful descriptors, preserves exact
  starter IDs, sorts parameters and uses typed JSON tuple percent encoding for
  other families. No answers, release/week/skin/seed or ID allocation.
- `src/content/skills.ts`: exactly M01–M10/E01–E10, source sections/objectives,
  staged scope and eight acyclic prerequisite suggestions. Declared bands are
  not delivered task availability.
- `tests/learning/identity.test.ts`, `tests/learning/contracts.test.ts`: bounded
  serialized/structural fixtures, identity invariants, registry graph and import
  direction checks. Numeric fixture probes are test-only, not family evaluators.
- `docs/content-review/registry.md`: selected curriculum mapping, honest reviewer
  disposition, retained accepted references and identity/assistance constraints.

## Criteria and checks

All assigned bounded criteria are represented: exact 20 IDs/official English
bands; acyclic suggestions; nine response and four result tags with serialized
valid/rejected examples; five stimulus variants plus absent/null text-only tasks;
zero denominator, missing endpoint and bad chart-scale rejection; exact anchors,
cosmetic invariance, substantive parameters and separate canonical/encounter/
opportunity/submission fields. The empty-catalogue consumer example proves the
registry can be constructed without implying delivery; actual selection is later.

Executed successfully with bundled Node
`C:/Users/alexb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`:

1. `node node_modules/typescript/bin/tsc -b` — app/Node/worker typecheck passed.
2. `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/learning/identity.test.ts tests/learning/contracts.test.ts` — focused fixture typecheck passed, including negative type examples.
3. `node node_modules/vitest/vitest.mjs run tests/learning/identity.test.ts tests/learning/contracts.test.ts` — 2 suites, 50 tests passed.
4. `git -c safe.directory='C:/Users/alexb/Documents/ChatGPT/Learning is Fun' diff --check` — passed; only unrelated Controller STATUS LF/CRLF warning. Owned new files also passed a trailing-whitespace scan.

The first focused run exposed two fixture defects: quantity bounds excluded its
own 125/100 pence example, and a mixed descriptor array inferred optional
undefined keys. Corrected fixture bounds/contextual typing; final checks above
passed. No production semantic repair or Node launch workaround was needed.
The final Git call encountered host repository ownership mismatch; an exact
command-only safe.directory entry allowed read-only checks, with no global
configuration change.
WP01 configuration owner supplied test discovery; this worker edited no config.
No broad gameplay, browser, save, reward allocation or application acceptance
checks were run.

## Compact consumer examples and limits

Tests retain bridge `lif.math.bridge.r1.total-12` with `{target:12}`, merchant
`lif.math.merchant.r1.mult-2.pears-3` with `{multiplier:2,pears:3}` (nine fruit),
and `lif.english.punctuation.r1.spellbook-anchor` with authored key and no
generated parameters. Alternate bridge arrangements and spellbook endings keep
the same IDs. A non-anchor fraction descriptor pins a literal encoded ID.

Experience fixture: Q1 story binding `q1-bridge`, mechanic drag, responseKind
bridge and derived provenance. State fixture: wrong Check encounter-1/episode 1
at cumulative index 1; deliberate finish action has no Check index; hinted correct
return is episode 2/local index 1/cumulative index 2, firstCheckCorrect remains
false. These are construction examples, not a running resolver/reducer.

Reward fixture: first-encounter and later-week-due-review candidates retain the
bridge canonical ID, but example encounter/opportunity IDs differ. A prior success
week of 2026-10-05 and due date 2026-10-11 are advisory selection facts; WP05
owns calendar construction, eligibility and allocation. WP04 supplies committed
history/provenance and filters duplicates; UI cannot assert independence.

The three production leaf modules import only learning types (contracts has no
imports). No state/reward/experience/UI dependency or runtime browser/database
global is introduced; WP01 is the only upstream implementation prerequisite.
Downstream authors can construct imported fixtures before their runtimes exist.

No material package/interface defect was found. Fixture task review status is
withheld; actual item/domain/stimulus consistency approval belongs to later
family authors, registry/binding validation to WP03-05A/13A, selection/evidence
policy to WP03-04A, and durable/integrated behavior to WP04/WP05/WP02. Generic
descriptor encoding preserves supplied parameters but cannot infer their
educational completeness. No decoder or universal validation engine is claimed.
Unrelated Controller changes were preserved. No staging or commit performed.

## Independent-review correction

Corrected M08's selected Year 5 timetable reference from Measurement to
`Statistics: tables, including timetables`, verified against the retained
[DfE mathematics programme](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study#year-5-programme-of-study),
Year 5 Statistics section. Its Years 3–4 clock/time reference remains Measurement.
Updated the registry review row and pinned the corrected source section in the
existing registry fixture. DTO and canonical identity behavior are unchanged.

Affected checks: focused fixture TypeScript check passed; Vitest
`run tests/learning/contracts.test.ts -t 'selected curriculum registry'` passed
all three registry/import-direction tests (28 other tests skipped); owned-file
trailing-whitespace scan and command-only safe.directory `git diff --check`
passed. No broad checks or commit performed.
