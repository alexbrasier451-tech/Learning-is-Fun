# Coverage ledger

All 60 stable obligations are reconciled: 53 owned by execution children, 5 satisfied, and 2 excluded. Parent documents provide navigation only. An owned proposal requires its accepted bounded implementation; DECISIONS.md defines accepted details. [REQUEST](evidence/REQUEST.md) governs source authority.

| ID | Obligation | Source | Disposition | Owner | Reason/evidence/blocker |
|---|---|---|---|---|---|
| REQ-016 | Obvious in-play independent music/effects mute and volume, persistent preferences, immediate reliable silence and read-aloud stop; no unavoidable sounds | [Direct human clarification](evidence/REQUEST.md) | owned | WP02-05A | Audio UI and runtime behaviour owned with sound design; WP04 supports preference persistence and WP06 verifies actual integrated controls |
| REQ-015 | Background music and game sound effects in the polished first slice, using free tools/assets with coherent audio direction, remembered controls and accessible fallback | [Direct human request](evidence/REQUEST.md) | owned | WP02-03A | New explicit human requirement after Stage 4; WP01 supports browser/cache lifecycle, WP04 persisted controls, WP06 actual playtest |
| REQ-001 | English and maths learning for children aged 8–10. Apparent human brief; reaffirmed by Controller. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-13A | Age-appropriate English/maths, validated curriculum/skill mapping and learning rules; no full-curriculum or precise ability claim. |
| REQ-002 | Adventure World concept. Apparent human selection; educational activity should form part of the adventure. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-06A | Adventure restoration experience; title and fiction may be adapted without losing learning-driven exploration/progression. |
| REQ-003 | Drag-and-drop and point-and-click interaction. Apparent human brief. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-04A | Point/click and drag interactions; starter mechanic subset followed by the six-mechanic expansion, with minimal typing. |
| REQ-004 | PC/tablet browser game; explicitly not a phone app or phone-first product. Latest human requirement. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP01-02A | PC/tablet browser shell and GitHub Pages link entry; no installation required. |
| REQ-005 | Launch through a GitHub Pages link, using Crazy Rummy as a hosting/entry precedent. Latest human requirement. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP01-04A | PC/tablet browser shell and GitHub Pages link entry; no installation required. |
| REQ-006 | Local profiles. Latest human requirement; originally proposed in the attachment. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP04-06A | Local profile lifecycle, isolated durable progress, failures, reset/delete and validated whole-save export/import; no automatic sync. |
| REQ-007 | Weekly local leaderboard, not an online leaderboard. Apparent human requirement and latest confirmation. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-04A | Local weekly standings, nickname/avatar display, medals and archived results; WP02 supplies in-world presentation. |
| REQ-008 | Children earn points for answered questions and more for first-attempt correctness. The source values were proposals; accepted values are in DEC-011. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-02A | Answer/first-correct/perseverance rewards with coherent Check, hint, retry and identity semantics; accepted numerical values and the excluded special-challenge bonus are defined by DEC-011; awards are deduplicated. |
| REQ-009 | A future agent must actually play the integrated game in a browser through its published GitHub Pages link at PC and tablet layouts. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP06-02A | Actual published-link integrated starter play at PC/tablet layouts; consume later build/deployment evidence and record untested modes honestly. |
| REQ-010 | Retain playtest observations, defects, fixes and retest outcomes, with a usable handoff for unresolved findings. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP06-04A | Retain observations, causal defect owners, fixes/retests and actionable unresolved handoff. |
| REQ-011 | Distinguish browser viewport/touch emulation from physical-device testing and testing with children. Neither may be claimed from emulation. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP06-01A | Separate emulation, physical-device evidence and child evaluation; make no unsupported claims. |
| REQ-012 | The game should look amazing: compelling, polished visuals are an explicit outcome, not merely functional placeholder screens. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-02A | Cohesive finished visual experience; presentation, animation and decorative breadth bounded through target setting. |
| REQ-013 | Plan a free-tool design and asset workflow, with licensing/provenance records. Do not presume paid generation, subscriptions, existing assets or an approved final art style. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-01A | Achievable free-tool art workflow, asset inventory and licence/provenance evidence; no assumed paid service or approved style. |
| REQ-014 | Include visual acceptance and visual observations in the integrated playtest/retest work, supporting REQ-009–013. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-12A | Accountable visual criteria and closure of visual findings; WP06 supplies published-link observations/retests. |
| BND-001 | This engagement creates an implementation package only. No production implementation, deployment or production asset creation now. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | satisfied | NONE | [REQUEST](evidence/REQUEST.md) and BASELINE establish planning-only authority. See [baseline](evidence/BASELINE.md) and [request](evidence/REQUEST.md). |
| BND-002 | Crazy Rummy’s mobile design, multiplayer, remote services and project-specific release gates are outside the requested transfer. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | satisfied | NONE | [BASELINE](evidence/BASELINE.md) reconciles Crazy Rummy as distribution precedent only; REQUEST confirms exclusions. See [baseline](evidence/BASELINE.md) and [request](evidence/REQUEST.md). |
| BND-003 | This worker is report-only. The Controller owns shared documents; this worker has no authority to create or message other chats. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | satisfied | NONE | REQUEST/GLOBAL_RULES establish Controller-only shared writes/chat coordination; this stage remains report-only. See [baseline](evidence/BASELINE.md) and [request](evidence/REQUEST.md). |
| PROP-001 | “The Lost Kingdom” working title and restoration fiction: missing knowledge, damaged bridges, libraries and machines; exploration, interactive learning, progression and creation. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-06A | Adventure restoration experience; title and fiction may be adapted without losing learning-driven exploration/progression. |
| PROP-002 | 2D or 2.5D presentation; colourful world, characters, animation, unlocks, collectibles, hidden areas and surprises. These are directions, not an approved art specification. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-02A | Cohesive finished visual experience; presentation, animation and decorative breadth bounded through target setting. |
| PROP-003 | Named regions: Market Square, Whispering Library, Tinker’s Workshop, Storywood Forest and Clockwork Castle, with English and maths mixed across the world. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-10A | Explicitly retain/adapt/sequence named regions and mixed-subject world use; names do not mandate separate systems. |
| PROP-004 | Bridge mission: compose 12 metres of timber using manipulable planks, accepting multiple valid combinations. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-02A | Bridge educational constraints: exactly 12 metres, multiple valid combinations; WP02 supplies playable presentation. |
| PROP-005 | Spellbook mission: restore punctuation and make the corrected spell visibly affect the world. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-03A | Reviewed punctuation stems, accepted variants and feedback; WP02 supplies visible spell/world effect. |
| PROP-006 | Merchant mission: read and satisfy a basket order; supplied example is twice as many apples as pears, nine fruit total. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-02A | Merchant requires both nine fruit and twice as many apples as pears: six apples, three pears. |
| PROP-007 | First complete bridge/spellbook/merchant slice of approximately 20–30 minutes, preceding expansion. **This sequencing is supplied by the Controller.** The attachment itself recommends designing the first 30 minutes and separately describes a broader first release. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-06A | Complete approximately 20–30-minute starter adventure before broader delivery; duration is an estimate, not timed assessment. |
| PROP-008 | Broader release: one village, 6–8 interactive locations, a small cast, six reusable mechanics, approximately 20 skills split roughly evenly between subjects, and ten connected quests with a beginning, middle and ending. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-10A | Coordinate later village, 6–8 locations, small cast, six mechanics, approximately 20 skills and ten connected quests; WP03 supplies educational breadth. |
| PROP-009 | Six mechanics: drag into targets, matching, sequencing, sorting, object manipulation and selection with consequences. Minimal typing and visual manipulation. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-04A | Point/click and drag interactions; starter mechanic subset followed by the six-mechanic expansion, with minimal typing. |
| PROP-010 | Village creativity: buildings/upgrades, gardens/farms, growing castle, discovered-book library, inventions, creature sanctuary and decorative rewards. Sandbox play using unlocked capabilities. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-11A | DEC-014 accepts bounded decorations, companion, shelf and invention; farming/economy/sanctuary simulation are explicitly excluded. |
| PROP-011 | Customisable companion providing hints, explanations, celebrations and suitable activities; avoid simply giving answers; progression can unlock cosmetic changes. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-07A | Companion presentation/customisation using WP03-approved guidance and WP05 entitlements; no answer invention. |
| PROP-012 | Individual skill adaptation, progressive difficulty, hints, retries, mistake categories, later similar problems, retention checks, spaced practice and prerequisites. Same quest may present different educational difficulty. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-04A | Skill adaptation, prerequisites, hints/retries, misconceptions, later success and retention; starter minimum then extension. |
| PROP-013 | England National Curriculum Years 3–5 with Year 4 as starting point. Exact curriculum scope and mapping are not yet established. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-01A | Age-appropriate English/maths, validated curriculum/skill mapping and learning rules; no full-curriculum or precise ability claim. |
| PROP-014 | Maths catalogue: arithmetic, multiplication/division, fractions/decimals, money/measurement, time/timetables, shape/geometry, statistics/graphs, patterns and multi-step reasoning. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-13A | Map broader subject catalogues into bounded skills/content; explicitly disposition longer writing without inventing a runtime grader. |
| PROP-015 | English catalogue: spelling/vocabulary, grammar/word classes, punctuation, sentence construction, comprehension, inference/deduction, story sequencing and writing. Longer writing appears in the castle proposal despite the general minimal-typing preference. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-13A | Map broader subject catalogues into bounded skills/content; explicitly disposition longer writing without inventing a runtime grader. |
| PROP-016 | Learning produces meaningful world changes: sawmills/timber/bridges, punctuation spells, treasure-map comprehension and fraction potions. Struggling players retain opportunities to explore and progress. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-06A | Learning visibly changes the world while preserving exploration/progress opportunities for struggling players. |
| PROP-017 | Data-driven content and conceptual separation of adventure, learning, interaction, progress and content responsibilities. These are architectural candidates only. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-01A | Simple data-driven content/learning boundaries with counterpart responsibilities; no generic engine framework implied. |
| PROP-018 | Deterministic validated maths generators, carefully reviewed English content, and optional AI assistance during development; no runtime LLM deciding correctness. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-13A | Validated deterministic maths and reviewed English answers; optional development assistance, no runtime LLM correctness judging. |
| PROP-019 | Proposed stack: React, TypeScript, Phaser, IndexedDB and PWA/service worker. No component is currently selected or installed. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP01-01A | DEC-006/016 accept optional PWA installation, complete offline caching and safe next-launch updates with the selected browser stack; link launch requires no installation. |
| PROP-020 | Offline capability after caching, optional installation/fullscreen, mouse/touch support, no initial child accounts, persistent local progress, and backup/export. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP01-03A | Coordinate platform/offline/fullscreen disposition; mouse/touch and local operation retained, persistence/export supplied by WP04. |
| PROP-021 | Optional internal adult content editor attaching lessons to quests. This is substantial additional scope, not necessary by default. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | excluded | NONE | Internal adult content editor is outside this package’s implementation; reviewed data-driven authoring suffices. Preserved for possible future scope. |
| PROP-022 | Adult progress screen; no advertising or child-directed in-app purchases; read-aloud instructions, subtitles and alternatives to precise dragging. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP04-06A | Adult progress/settings and no child-directed advertising/purchases; WP02/WP01 supply accessible interaction/shell support. |
| PROP-023 | Proposed scoring: +5 initial attempt; +15 first-correct bonus; +5 eventual-correct bonus; +20 quest; +30 special challenge. Intended totals are 20 first-correct, 10 correct after retry, 5 initial incorrect. Prevent repeated awards for the same question. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-02A | Answer/first-correct/perseverance rewards with coherent Check, hint, retry and identity semantics; accepted numerical values and the excluded special-challenge bonus are defined by DEC-011; awards are deduplicated. |
| PROP-024 | Monday–Sunday competition; nicknames/avatars; gold/silver/bronze; previous champions/Hall of Fame; local Hall of Champions in the village. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-03A | Local weekly standings, nickname/avatar display, medals and archived results; WP02 supplies in-world presentation. |
| PROP-025 | Separate weekly and lifetime points; weekly reset preserves lifetime totals, kingdom, skill and quest progress. Lifetime points unlock decorations, companion cosmetics and buildings. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-02A | Separate weekly/lifetime points and durable unlock entitlements; rollover preserves world, quest and learning progress. |
| PROP-026 | Fairness: possible competitive question cap, unlimited learning/personal progression, resistance to deliberately selecting easy work, and no speed penalties. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-02A | Fair competitive eligibility/cap while allowing continued learning/progression; no speed penalties; DEC-011 fixes the first 30 eligible learning-selected opportunities per week. |
| PROP-027 | Sunday Festival, trophies/medals and additional awards such as persistence, improvement and subject achievement. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-11A | Bound later celebration/trophy presentation and explicitly disposition additional awards; WP05 owns eligibility/timing. A Sunday event cannot finalise an unfinished week. |
| PROP-028 | Single-player comparison against personal bests or explicitly identified computer competitors. These are alternatives, not requirements to invent rivals. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-03A | Bound to genuine personal-best/history comparison; invented computer competitors excluded from this implementation. |
| PROP-029 | Actual child evaluation for enjoyment, usability and learning value. This remains a distinct future research proposal; agent browser testing cannot establish educational efficacy. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | excluded | NONE | Actual child evaluation is outside this implementation package and remains future research. Agent testing cannot establish enjoyment or educational efficacy. |
| BASE-001 | Greenfield workspace confirmed. Record as an evidenced baseline finding, not missing work to “recover.” No existing dirty changes or failed implementation attempts were available. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | satisfied | NONE | BASELINE evidences the initially empty greenfield workspace; no recovery work is invented. See [baseline](evidence/BASELINE.md) and [request](evidence/REQUEST.md). |
| GAP-001 | Source speaker roles are inferred. Preserve the distinction between apparent human requests, assistant proposals and later Controller-relayed human requirements. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | satisfied | NONE | BASELINE records inferred speakers; REQUEST distinguishes later human requirements from assistant proposals. See [baseline](evidence/BASELINE.md) and [request](evidence/REQUEST.md). |
| GAP-002 | Future repository owner/name, remote, branch policy, Pages project path, permissions and published URL are unspecified. They block publishing and published-link acceptance, not package construction. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP01-04A | Obtain repository, branch, Pages path, permissions and URL before publishing. Missing external details block later publication, not this stage. |
| GAP-003 | Art direction, asset inventory and rights evidence are absent. Future planning must define the visual target and free production/reuse route without assuming that available generation tools are free. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-01A | Achievable free-tool art workflow, asset inventory and licence/provenance evidence; no assumed paid service or approved style. |
| GAP-004 | Initial-slice versus broader-release scope needs an explicit staged disposition. Do not lose the broader aspirations or claim all are required in the first slice. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-06A | Complete approximately 20–30-minute starter adventure before broader delivery; duration is an estimate, not timed assessment. |
| GAP-005 | Baseline gap, resolved by DEC-010/011: “new question” identity, submission versus manipulation, hints and first-attempt eligibility, retries, replay, generated variants and one-time quest rewards. The proposed “once per question” wording must accommodate the later retry-success bonus without duplication. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-02A | Answer/first-correct/perseverance rewards with coherent Check, hint, retry and identity semantics; accepted numerical values and the excluded special-challenge bonus are defined by DEC-011; awards are deduplicated. |
| GAP-006 | Baseline gap, resolved by DEC-012: week boundary/time zone, missed weeks, clock changes, ties, archives and award timing. A Sunday ceremony and Monday rollover require one coherent policy. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP05-03A | Implement the accepted DEC-012 calendar/timezone, closure, missed-week, clock, tie, archive and award policy consistently. |
| GAP-007 | Profile lifecycle, local storage scope, reset/delete, persistence failures and backup/restore semantics are unspecified. A shared web link does not imply a shared leaderboard or automatic cross-device synchronisation. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP04-03A | Local profile lifecycle, isolated durable progress, failures, reset/delete and validated whole-save export/import; no automatic sync. |
| GAP-008 | Content selection, prerequisite graph, mastery rules and curriculum mapping are unvalidated. Illustrative percentages are not established assessment measures or learning-outcome evidence. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP03-04A | Age-appropriate English/maths, validated curriculum/skill mapping and learning rules; no full-curriculum or precise ability claim. |
| GAP-009 | PC/tablet browser and viewport matrix, touch/drag alternatives, read-aloud behaviour and the meaning of “adult-only” access need bounded definitions. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP02-01A | Coordinate one PC/tablet interaction/accessibility contract; WP01 supplies platform matrix, WP04 adult-access meaning, WP03 read-aloud evidence semantics. |
| GAP-010 | No integrated game, hosted build, browser-playtest record, visual review, physical-device evidence or child-testing evidence currently exists. Published-link playtesting depends on later implementation and deployment. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP06-04A | Actual published-link integrated starter play at PC/tablet layouts; consume later build/deployment evidence and record untested modes honestly. |
| GAP-011 | At baseline, PWA installation/offline support and the named stack were proposals. Link-based launch does not itself select a PWA or require installation. Offline play would need an explicit first-load/cache/update contract if accepted. | [Baseline](evidence/BASELINE.md); [request](evidence/REQUEST.md) | owned | WP01-03A | DEC-006/016 accept optional PWA installation, complete offline caching and safe next-launch updates with the selected browser stack; link launch requires no installation. |

## Supporting relationships

These contributions preserve shared requirements across M1 and M2; the accountable owner above remains singular. Milestone acceptance requires its applicable supporting outputs.

| ID | Chunk | Contribution |
|---|---|---|
| REQ-004 | WP01-01A | Toolchain, platform identity and early shell contracts |
| REQ-005 | WP01-01A | Toolchain, platform identity and early shell contracts |
| GAP-009 | WP01-01A | Toolchain, platform identity and early shell contracts |
| PROP-017 | WP01-01A | Toolchain, platform identity and early shell contracts |
| GAP-009 | WP01-02A | Accessible shell and single-runtime audio composition |
| PROP-017 | WP01-02A | Accessible shell and single-runtime audio composition |
| PROP-022 | WP01-02A | Accessible shell and single-runtime audio composition |
| REQ-015 | WP01-02A | Accessible shell and single-runtime audio composition |
| REQ-016 | WP01-02A | Accessible shell and single-runtime audio composition |
| REQ-005 | WP01-03A | Complete offline cache and safe next-launch updates |
| REQ-015 | WP01-03A | Complete offline cache and safe next-launch updates |
| REQ-016 | WP01-03A | Complete offline cache and safe next-launch updates |
| REQ-004 | WP01-04A | M1 GitHub Pages candidate publication |
| PROP-020 | WP01-04A | M1 GitHub Pages candidate publication |
| REQ-004 | WP01-05A | M2 platform upgrade and GitHub Pages candidate publication |
| REQ-005 | WP01-05A | M2 platform upgrade and GitHub Pages candidate publication |
| PROP-020 | WP01-05A | M2 platform upgrade and GitHub Pages candidate publication |
| GAP-002 | WP01-05A | M2 platform upgrade and GitHub Pages candidate publication |
| GAP-011 | WP01-05A | M2 platform upgrade and GitHub Pages candidate publication |
| REQ-015 | WP01-05A | M2 platform upgrade and GitHub Pages candidate publication |
| REQ-016 | WP01-05A | M2 platform upgrade and GitHub Pages candidate publication |
| REQ-003 | WP02-01A | Experience DTOs, visual direction and interaction contract |
| REQ-012 | WP02-01A | Experience DTOs, visual direction and interaction contract |
| REQ-015 | WP02-01A | Experience DTOs, visual direction and interaction contract |
| REQ-016 | WP02-01A | Experience DTOs, visual direction and interaction contract |
| REQ-004 | WP02-01A | Experience DTOs, visual direction and interaction contract |
| PROP-008 | WP02-01A | Experience DTOs, visual direction and interaction contract |
| REQ-013 | WP02-02A | M1 original scene, character and activity artwork |
| REQ-014 | WP02-02A | M1 original scene, character and activity artwork |
| PROP-001 | WP02-02A | M1 original scene, character and activity artwork |
| PROP-007 | WP02-02A | M1 original scene, character and activity artwork |
| PROP-010 | WP02-02A | M1 original scene, character and activity artwork |
| PROP-011 | WP02-02A | M1 original scene, character and activity artwork |
| REQ-013 | WP02-03A | M1 original music and effect production |
| REQ-014 | WP02-03A | M1 original music and effect production |
| REQ-016 | WP02-03A | M1 original music and effect production |
| GAP-009 | WP02-04A | M1 native draft and pointer interaction widgets |
| REQ-012 | WP02-04A | M1 native draft and pointer interaction widgets |
| PROP-004 | WP02-04A | M1 native draft and pointer interaction widgets |
| PROP-005 | WP02-04A | M1 native draft and pointer interaction widgets |
| PROP-006 | WP02-04A | M1 native draft and pointer interaction widgets |
| PROP-007 | WP02-04A | M1 native draft and pointer interaction widgets |
| REQ-015 | WP02-05A | Single audio controller, speech and in-play controls |
| GAP-009 | WP02-05A | Single audio controller, speech and in-play controls |
| PROP-011 | WP02-05A | Single audio controller, speech and in-play controls |
| REQ-014 | WP02-05A | Single audio controller, speech and in-play controls |
| REQ-012 | WP02-06A | M1 committed adventure and quest composition |
| REQ-014 | WP02-06A | M1 committed adventure and quest composition |
| REQ-015 | WP02-06A | M1 committed adventure and quest composition |
| REQ-016 | WP02-06A | M1 committed adventure and quest composition |
| REQ-001 | WP02-06A | M1 committed adventure and quest composition |
| REQ-007 | WP02-06A | M1 committed adventure and quest composition |
| REQ-008 | WP02-06A | M1 committed adventure and quest composition |
| PROP-004 | WP02-06A | M1 committed adventure and quest composition |
| PROP-005 | WP02-06A | M1 committed adventure and quest composition |
| PROP-006 | WP02-06A | M1 committed adventure and quest composition |
| PROP-012 | WP02-06A | M1 committed adventure and quest composition |
| PROP-022 | WP02-06A | M1 committed adventure and quest composition |
| PROP-024 | WP02-06A | M1 committed adventure and quest composition |
| PROP-025 | WP02-06A | M1 committed adventure and quest composition |
| PROP-026 | WP02-06A | M1 committed adventure and quest composition |
| PROP-010 | WP02-07A | M1 companion and saved creative ending |
| PROP-007 | WP02-07A | M1 companion and saved creative ending |
| REQ-012 | WP02-07A | M1 companion and saved creative ending |
| REQ-014 | WP02-07A | M1 companion and saved creative ending |
| PROP-012 | WP02-07A | M1 companion and saved creative ending |
| REQ-008 | WP02-07A | M1 companion and saved creative ending |
| REQ-012 | WP02-08A | M2 artwork and bounded creative asset expansion |
| REQ-013 | WP02-08A | M2 artwork and bounded creative asset expansion |
| REQ-014 | WP02-08A | M2 artwork and bounded creative asset expansion |
| PROP-002 | WP02-08A | M2 artwork and bounded creative asset expansion |
| PROP-003 | WP02-08A | M2 artwork and bounded creative asset expansion |
| PROP-008 | WP02-08A | M2 artwork and bounded creative asset expansion |
| PROP-010 | WP02-08A | M2 artwork and bounded creative asset expansion |
| PROP-011 | WP02-08A | M2 artwork and bounded creative asset expansion |
| REQ-003 | WP02-09A | M2 matching, sequencing and sorting widgets |
| PROP-009 | WP02-09A | M2 matching, sequencing and sorting widgets |
| GAP-009 | WP02-09A | M2 matching, sequencing and sorting widgets |
| PROP-008 | WP02-09A | M2 matching, sequencing and sorting widgets |
| REQ-002 | WP02-10A | M2 connected world and quest composition |
| REQ-003 | WP02-10A | M2 connected world and quest composition |
| REQ-012 | WP02-10A | M2 connected world and quest composition |
| REQ-014 | WP02-10A | M2 connected world and quest composition |
| PROP-001 | WP02-10A | M2 connected world and quest composition |
| PROP-009 | WP02-10A | M2 connected world and quest composition |
| PROP-016 | WP02-10A | M2 connected world and quest composition |
| PROP-010 | WP02-10A | M2 connected world and quest composition |
| PROP-011 | WP02-10A | M2 connected world and quest composition |
| PROP-012 | WP02-10A | M2 connected world and quest composition |
| REQ-001 | WP02-10A | M2 connected world and quest composition |
| PROP-011 | WP02-11A | M2 lasting creativity and closed-week Festival |
| PROP-008 | WP02-11A | M2 lasting creativity and closed-week Festival |
| PROP-022 | WP02-11A | M2 lasting creativity and closed-week Festival |
| PROP-024 | WP02-11A | M2 lasting creativity and closed-week Festival |
| PROP-025 | WP02-11A | M2 lasting creativity and closed-week Festival |
| PROP-026 | WP02-11A | M2 lasting creativity and closed-week Festival |
| REQ-007 | WP02-11A | M2 lasting creativity and closed-week Festival |
| REQ-008 | WP02-11A | M2 lasting creativity and closed-week Festival |
| REQ-012 | WP02-11A | M2 lasting creativity and closed-week Festival |
| REQ-014 | WP02-11A | M2 lasting creativity and closed-week Festival |
| REQ-009 | WP02-12A | M1 visual and acoustic acceptance handoff |
| REQ-010 | WP02-12A | M1 visual and acoustic acceptance handoff |
| REQ-011 | WP02-12A | M1 visual and acoustic acceptance handoff |
| REQ-012 | WP02-12A | M1 visual and acoustic acceptance handoff |
| REQ-013 | WP02-12A | M1 visual and acoustic acceptance handoff |
| REQ-015 | WP02-12A | M1 visual and acoustic acceptance handoff |
| REQ-016 | WP02-12A | M1 visual and acoustic acceptance handoff |
| PROP-007 | WP02-12A | M1 visual and acoustic acceptance handoff |
| REQ-014 | WP02-13A | M2 visual and interaction acceptance extension |
| REQ-009 | WP02-13A | M2 visual and interaction acceptance extension |
| REQ-010 | WP02-13A | M2 visual and interaction acceptance extension |
| REQ-011 | WP02-13A | M2 visual and interaction acceptance extension |
| REQ-012 | WP02-13A | M2 visual and interaction acceptance extension |
| REQ-015 | WP02-13A | M2 visual and interaction acceptance extension |
| REQ-016 | WP02-13A | M2 visual and interaction acceptance extension |
| PROP-008 | WP02-13A | M2 visual and interaction acceptance extension |
| PROP-010 | WP02-13A | M2 visual and interaction acceptance extension |
| PROP-027 | WP02-13A | M2 visual and interaction acceptance extension |
| REQ-001 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| REQ-008 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| PROP-004 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| PROP-005 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| PROP-006 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| PROP-012 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| PROP-014 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| PROP-015 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| PROP-018 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| GAP-005 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| GAP-008 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| GAP-009 | WP03-01A | Learning contracts, curriculum registry and canonical identity |
| REQ-001 | WP03-02A | Starter bridge and merchant learning |
| REQ-002 | WP03-02A | Starter bridge and merchant learning |
| REQ-008 | WP03-02A | Starter bridge and merchant learning |
| PROP-012 | WP03-02A | Starter bridge and merchant learning |
| PROP-013 | WP03-02A | Starter bridge and merchant learning |
| PROP-014 | WP03-02A | Starter bridge and merchant learning |
| PROP-016 | WP03-02A | Starter bridge and merchant learning |
| PROP-018 | WP03-02A | Starter bridge and merchant learning |
| PROP-026 | WP03-02A | Starter bridge and merchant learning |
| GAP-004 | WP03-02A | Starter bridge and merchant learning |
| GAP-005 | WP03-02A | Starter bridge and merchant learning |
| GAP-008 | WP03-02A | Starter bridge and merchant learning |
| GAP-009 | WP03-02A | Starter bridge and merchant learning |
| REQ-001 | WP03-03A | Reviewed starter spellbook content |
| REQ-002 | WP03-03A | Reviewed starter spellbook content |
| REQ-008 | WP03-03A | Reviewed starter spellbook content |
| REQ-015 | WP03-03A | Reviewed starter spellbook content |
| PROP-012 | WP03-03A | Reviewed starter spellbook content |
| PROP-013 | WP03-03A | Reviewed starter spellbook content |
| PROP-015 | WP03-03A | Reviewed starter spellbook content |
| PROP-016 | WP03-03A | Reviewed starter spellbook content |
| PROP-018 | WP03-03A | Reviewed starter spellbook content |
| PROP-022 | WP03-03A | Reviewed starter spellbook content |
| GAP-004 | WP03-03A | Reviewed starter spellbook content |
| GAP-005 | WP03-03A | Reviewed starter spellbook content |
| GAP-008 | WP03-03A | Reviewed starter spellbook content |
| GAP-009 | WP03-03A | Reviewed starter spellbook content |
| REQ-001 | WP03-04A | Skill evidence, adaptive selection and review |
| REQ-008 | WP03-04A | Skill evidence, adaptive selection and review |
| REQ-009 | WP03-04A | Skill evidence, adaptive selection and review |
| REQ-015 | WP03-04A | Skill evidence, adaptive selection and review |
| PROP-011 | WP03-04A | Skill evidence, adaptive selection and review |
| PROP-013 | WP03-04A | Skill evidence, adaptive selection and review |
| PROP-017 | WP03-04A | Skill evidence, adaptive selection and review |
| PROP-018 | WP03-04A | Skill evidence, adaptive selection and review |
| PROP-022 | WP03-04A | Skill evidence, adaptive selection and review |
| PROP-026 | WP03-04A | Skill evidence, adaptive selection and review |
| GAP-005 | WP03-04A | Skill evidence, adaptive selection and review |
| GAP-007 | WP03-04A | Skill evidence, adaptive selection and review |
| GAP-009 | WP03-04A | Skill evidence, adaptive selection and review |
| REQ-001 | WP03-05A | Starter catalogue and educational handoff |
| REQ-002 | WP03-05A | Starter catalogue and educational handoff |
| REQ-008 | WP03-05A | Starter catalogue and educational handoff |
| REQ-009 | WP03-05A | Starter catalogue and educational handoff |
| PROP-004 | WP03-05A | Starter catalogue and educational handoff |
| PROP-005 | WP03-05A | Starter catalogue and educational handoff |
| PROP-006 | WP03-05A | Starter catalogue and educational handoff |
| PROP-012 | WP03-05A | Starter catalogue and educational handoff |
| PROP-013 | WP03-05A | Starter catalogue and educational handoff |
| PROP-017 | WP03-05A | Starter catalogue and educational handoff |
| PROP-018 | WP03-05A | Starter catalogue and educational handoff |
| PROP-026 | WP03-05A | Starter catalogue and educational handoff |
| GAP-004 | WP03-05A | Starter catalogue and educational handoff |
| GAP-005 | WP03-05A | Starter catalogue and educational handoff |
| GAP-007 | WP03-05A | Starter catalogue and educational handoff |
| GAP-008 | WP03-05A | Starter catalogue and educational handoff |
| GAP-009 | WP03-05A | Starter catalogue and educational handoff |
| REQ-001 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-004 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-006 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-008 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-009 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-012 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-013 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-014 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-016 | WP03-06A | Expansion arithmetic and scaling content |
| PROP-018 | WP03-06A | Expansion arithmetic and scaling content |
| GAP-004 | WP03-06A | Expansion arithmetic and scaling content |
| GAP-008 | WP03-06A | Expansion arithmetic and scaling content |
| REQ-001 | WP03-07A | Expansion fractions, decimals and measured quantities |
| PROP-008 | WP03-07A | Expansion fractions, decimals and measured quantities |
| PROP-009 | WP03-07A | Expansion fractions, decimals and measured quantities |
| PROP-012 | WP03-07A | Expansion fractions, decimals and measured quantities |
| PROP-013 | WP03-07A | Expansion fractions, decimals and measured quantities |
| PROP-014 | WP03-07A | Expansion fractions, decimals and measured quantities |
| PROP-016 | WP03-07A | Expansion fractions, decimals and measured quantities |
| PROP-018 | WP03-07A | Expansion fractions, decimals and measured quantities |
| GAP-004 | WP03-07A | Expansion fractions, decimals and measured quantities |
| GAP-008 | WP03-07A | Expansion fractions, decimals and measured quantities |
| REQ-001 | WP03-08A | Expansion time, geometry and data content |
| PROP-008 | WP03-08A | Expansion time, geometry and data content |
| PROP-009 | WP03-08A | Expansion time, geometry and data content |
| PROP-012 | WP03-08A | Expansion time, geometry and data content |
| PROP-013 | WP03-08A | Expansion time, geometry and data content |
| PROP-014 | WP03-08A | Expansion time, geometry and data content |
| PROP-016 | WP03-08A | Expansion time, geometry and data content |
| PROP-018 | WP03-08A | Expansion time, geometry and data content |
| GAP-004 | WP03-08A | Expansion time, geometry and data content |
| GAP-008 | WP03-08A | Expansion time, geometry and data content |
| REQ-001 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-008 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-009 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-012 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-013 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-015 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-016 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-018 | WP03-09A | Expansion spelling and vocabulary content |
| PROP-022 | WP03-09A | Expansion spelling and vocabulary content |
| GAP-004 | WP03-09A | Expansion spelling and vocabulary content |
| GAP-008 | WP03-09A | Expansion spelling and vocabulary content |
| GAP-009 | WP03-09A | Expansion spelling and vocabulary content |
| REQ-001 | WP03-10A | Expansion word classes and clauses |
| PROP-008 | WP03-10A | Expansion word classes and clauses |
| PROP-009 | WP03-10A | Expansion word classes and clauses |
| PROP-012 | WP03-10A | Expansion word classes and clauses |
| PROP-013 | WP03-10A | Expansion word classes and clauses |
| PROP-015 | WP03-10A | Expansion word classes and clauses |
| PROP-016 | WP03-10A | Expansion word classes and clauses |
| PROP-018 | WP03-10A | Expansion word classes and clauses |
| PROP-022 | WP03-10A | Expansion word classes and clauses |
| GAP-004 | WP03-10A | Expansion word classes and clauses |
| GAP-008 | WP03-10A | Expansion word classes and clauses |
| GAP-009 | WP03-10A | Expansion word classes and clauses |
| REQ-001 | WP03-11A | Expansion punctuation and direct speech |
| PROP-005 | WP03-11A | Expansion punctuation and direct speech |
| PROP-008 | WP03-11A | Expansion punctuation and direct speech |
| PROP-009 | WP03-11A | Expansion punctuation and direct speech |
| PROP-012 | WP03-11A | Expansion punctuation and direct speech |
| PROP-013 | WP03-11A | Expansion punctuation and direct speech |
| PROP-015 | WP03-11A | Expansion punctuation and direct speech |
| PROP-016 | WP03-11A | Expansion punctuation and direct speech |
| PROP-018 | WP03-11A | Expansion punctuation and direct speech |
| PROP-022 | WP03-11A | Expansion punctuation and direct speech |
| GAP-004 | WP03-11A | Expansion punctuation and direct speech |
| GAP-008 | WP03-11A | Expansion punctuation and direct speech |
| GAP-009 | WP03-11A | Expansion punctuation and direct speech |
| REQ-001 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-006 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-008 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-009 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-012 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-013 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-015 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-016 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-018 | WP03-12A | Expansion reading, inference and reviewed writing |
| PROP-022 | WP03-12A | Expansion reading, inference and reviewed writing |
| GAP-004 | WP03-12A | Expansion reading, inference and reviewed writing |
| GAP-008 | WP03-12A | Expansion reading, inference and reviewed writing |
| GAP-009 | WP03-12A | Expansion reading, inference and reviewed writing |
| REQ-002 | WP03-13A | Complete curriculum catalogue and quest bindings |
| REQ-008 | WP03-13A | Complete curriculum catalogue and quest bindings |
| REQ-009 | WP03-13A | Complete curriculum catalogue and quest bindings |
| REQ-015 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-004 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-005 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-006 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-007 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-008 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-009 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-011 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-012 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-013 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-016 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-017 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-022 | WP03-13A | Complete curriculum catalogue and quest bindings |
| PROP-026 | WP03-13A | Complete curriculum catalogue and quest bindings |
| GAP-004 | WP03-13A | Complete curriculum catalogue and quest bindings |
| GAP-005 | WP03-13A | Complete curriculum catalogue and quest bindings |
| GAP-007 | WP03-13A | Complete curriculum catalogue and quest bindings |
| GAP-008 | WP03-13A | Complete curriculum catalogue and quest bindings |
| GAP-009 | WP03-13A | Complete curriculum catalogue and quest bindings |
| REQ-006 | WP04-01A | Local save and command contracts |
| PROP-017 | WP04-01A | Local save and command contracts |
| PROP-020 | WP04-01A | Local save and command contracts |
| GAP-007 | WP04-01A | Local save and command contracts |
| REQ-015 | WP04-01A | Local save and command contracts |
| REQ-016 | WP04-01A | Local save and command contracts |
| REQ-006 | WP04-02A | Atomic IndexedDB repository and stale-tab protection |
| GAP-007 | WP04-02A | Atomic IndexedDB repository and stale-tab protection |
| PROP-017 | WP04-02A | Atomic IndexedDB repository and stale-tab protection |
| PROP-020 | WP04-02A | Atomic IndexedDB repository and stale-tab protection |
| GAP-005 | WP04-02A | Atomic IndexedDB repository and stale-tab protection |
| GAP-006 | WP04-02A | Atomic IndexedDB repository and stale-tab protection |
| REQ-006 | WP04-03A | Bounded backup validation and whole-save recovery |
| PROP-020 | WP04-03A | Bounded backup validation and whole-save recovery |
| PROP-024 | WP04-03A | Bounded backup validation and whole-save recovery |
| PROP-025 | WP04-03A | Bounded backup validation and whole-save recovery |
| GAP-005 | WP04-03A | Bounded backup validation and whole-save recovery |
| GAP-006 | WP04-03A | Bounded backup validation and whole-save recovery |
| REQ-015 | WP04-03A | Bounded backup validation and whole-save recovery |
| REQ-016 | WP04-03A | Bounded backup validation and whole-save recovery |
| REQ-006 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| REQ-007 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| REQ-008 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| PROP-012 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| PROP-017 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| PROP-020 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| PROP-024 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| PROP-025 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| GAP-005 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| GAP-006 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| GAP-007 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| REQ-009 | WP04-04A | Single state facade and atomic learning/world/reward integration |
| REQ-015 | WP04-05A | Remembered preferences and immediate silence persistence |
| REQ-016 | WP04-05A | Remembered preferences and immediate silence persistence |
| PROP-022 | WP04-05A | Remembered preferences and immediate silence persistence |
| REQ-006 | WP04-05A | Remembered preferences and immediate silence persistence |
| GAP-007 | WP04-05A | Remembered preferences and immediate silence persistence |
| GAP-009 | WP04-05A | Remembered preferences and immediate silence persistence |
| GAP-007 | WP04-06A | Profile chooser and proportionate adult progress/settings |
| PROP-012 | WP04-06A | Profile chooser and proportionate adult progress/settings |
| PROP-020 | WP04-06A | Profile chooser and proportionate adult progress/settings |
| GAP-009 | WP04-06A | Profile chooser and proportionate adult progress/settings |
| REQ-015 | WP04-06A | Profile chooser and proportionate adult progress/settings |
| REQ-016 | WP04-06A | Profile chooser and proportionate adult progress/settings |
| REQ-009 | WP04-06A | Profile chooser and proportionate adult progress/settings |
| REQ-006 | WP04-07A | M2 state compatibility and real starter-save preservation |
| PROP-022 | WP04-07A | M2 state compatibility and real starter-save preservation |
| GAP-007 | WP04-07A | M2 state compatibility and real starter-save preservation |
| PROP-012 | WP04-07A | M2 state compatibility and real starter-save preservation |
| PROP-020 | WP04-07A | M2 state compatibility and real starter-save preservation |
| PROP-024 | WP04-07A | M2 state compatibility and real starter-save preservation |
| PROP-025 | WP04-07A | M2 state compatibility and real starter-save preservation |
| REQ-007 | WP04-07A | M2 state compatibility and real starter-save preservation |
| REQ-008 | WP04-07A | M2 state compatibility and real starter-save preservation |
| REQ-015 | WP04-07A | M2 state compatibility and real starter-save preservation |
| REQ-016 | WP04-07A | M2 state compatibility and real starter-save preservation |
| REQ-009 | WP04-07A | M2 state compatibility and real starter-save preservation |
| REQ-007 | WP05-01A | Reward contracts and shared London calendar utilities |
| REQ-008 | WP05-01A | Reward contracts and shared London calendar utilities |
| PROP-017 | WP05-01A | Reward contracts and shared London calendar utilities |
| PROP-023 | WP05-01A | Reward contracts and shared London calendar utilities |
| PROP-024 | WP05-01A | Reward contracts and shared London calendar utilities |
| PROP-025 | WP05-01A | Reward contracts and shared London calendar utilities |
| PROP-026 | WP05-01A | Reward contracts and shared London calendar utilities |
| GAP-005 | WP05-01A | Reward contracts and shared London calendar utilities |
| GAP-006 | WP05-01A | Reward contracts and shared London calendar utilities |
| REQ-006 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| REQ-007 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| PROP-010 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| PROP-011 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| PROP-016 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| PROP-017 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| GAP-007 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| REQ-009 | WP05-02A | Once-only scoring, review eligibility and lasting entitlements |
| REQ-007 | WP05-03A | Weekly closure, archived ranks and personal records |
| REQ-006 | WP05-03A | Weekly closure, archived ranks and personal records |
| PROP-025 | WP05-03A | Weekly closure, archived ranks and personal records |
| PROP-027 | WP05-03A | Weekly closure, archived ranks and personal records |
| GAP-007 | WP05-03A | Weekly closure, archived ranks and personal records |
| REQ-009 | WP05-03A | Weekly closure, archived ranks and personal records |
| REQ-008 | WP05-04A | Accessible local Hall of Champions and personal history |
| REQ-006 | WP05-04A | Accessible local Hall of Champions and personal history |
| PROP-024 | WP05-04A | Accessible local Hall of Champions and personal history |
| PROP-025 | WP05-04A | Accessible local Hall of Champions and personal history |
| PROP-026 | WP05-04A | Accessible local Hall of Champions and personal history |
| PROP-028 | WP05-04A | Accessible local Hall of Champions and personal history |
| PROP-027 | WP05-04A | Accessible local Hall of Champions and personal history |
| REQ-009 | WP05-04A | Accessible local Hall of Champions and personal history |
| REQ-009 | WP06-01A | Agent-directed scenario, touch and evidence tooling |
| REQ-010 | WP06-01A | Agent-directed scenario, touch and evidence tooling |
| GAP-010 | WP06-01A | Agent-directed scenario, touch and evidence tooling |
| REQ-014 | WP06-01A | Agent-directed scenario, touch and evidence tooling |
| REQ-015 | WP06-01A | Agent-directed scenario, touch and evidence tooling |
| REQ-016 | WP06-01A | Agent-directed scenario, touch and evidence tooling |
| REQ-010 | WP06-02A | M1 published-link adventure and visual journey |
| REQ-011 | WP06-02A | M1 published-link adventure and visual journey |
| GAP-010 | WP06-02A | M1 published-link adventure and visual journey |
| REQ-014 | WP06-02A | M1 published-link adventure and visual journey |
| REQ-015 | WP06-02A | M1 published-link adventure and visual journey |
| REQ-016 | WP06-02A | M1 published-link adventure and visual journey |
| REQ-009 | WP06-03A | M1 local, weekly, audio and offline boundary observations |
| REQ-010 | WP06-03A | M1 local, weekly, audio and offline boundary observations |
| REQ-011 | WP06-03A | M1 local, weekly, audio and offline boundary observations |
| GAP-010 | WP06-03A | M1 local, weekly, audio and offline boundary observations |
| REQ-015 | WP06-03A | M1 local, weekly, audio and offline boundary observations |
| REQ-016 | WP06-03A | M1 local, weekly, audio and offline boundary observations |
| PROP-020 | WP06-03A | M1 local, weekly, audio and offline boundary observations |
| REQ-009 | WP06-04A | M1 acceptance, defect closure and expansion gate |
| REQ-011 | WP06-04A | M1 acceptance, defect closure and expansion gate |
| REQ-014 | WP06-04A | M1 acceptance, defect closure and expansion gate |
| REQ-015 | WP06-04A | M1 acceptance, defect closure and expansion gate |
| REQ-016 | WP06-04A | M1 acceptance, defect closure and expansion gate |
| REQ-009 | WP06-05A | M2 published-link ten-quest and visual journey |
| REQ-010 | WP06-05A | M2 published-link ten-quest and visual journey |
| REQ-011 | WP06-05A | M2 published-link ten-quest and visual journey |
| GAP-010 | WP06-05A | M2 published-link ten-quest and visual journey |
| REQ-014 | WP06-05A | M2 published-link ten-quest and visual journey |
| REQ-015 | WP06-05A | M2 published-link ten-quest and visual journey |
| REQ-016 | WP06-05A | M2 published-link ten-quest and visual journey |
| REQ-009 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| REQ-010 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| REQ-011 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| GAP-010 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| REQ-014 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| REQ-015 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| REQ-016 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| PROP-020 | WP06-06A | M2 integrity, audio and real starter-save upgrade |
| REQ-009 | WP06-07A | M2 acceptance and final defect closure |
| REQ-010 | WP06-07A | M2 acceptance and final defect closure |
| REQ-011 | WP06-07A | M2 acceptance and final defect closure |
| GAP-010 | WP06-07A | M2 acceptance and final defect closure |
| REQ-014 | WP06-07A | M2 acceptance and final defect closure |
| REQ-015 | WP06-07A | M2 acceptance and final defect closure |
| REQ-016 | WP06-07A | M2 acceptance and final defect closure |


