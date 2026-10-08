# Dependencies and concurrency

This registry owns execution edges and permitted concurrency. Parent chunks are navigation only. An edge requires the named output before dependent completion; construction against frozen contracts may proceed only where explicitly allowed below. DEC-022/023 prevent static-catalogue and final-shell cycles. No production work is authorized by this planning package.

M1 is complete only at WP06-04A; all M2 implementation follows that gate. WP04-07A owns M2 state compatibility so starter state/UI work never waits for expansion. Producer UI uses the early minimal fixture host, then WP01-02A composes it. Original case → owner correction → republish → full-path retest is an iteration within the affected milestone, not a reverse dependency edge. Final acceptance remains with WP06.

## Dependency edges

| Edge ID | Prerequisite chunk | Dependent chunk | Required handoff |
|---|---|---|---|
| DEP-001 | WP01-01A | WP03-01A | Platform identity and early preview contract. |
| DEP-002 | WP03-01A | WP05-01A | Frozen learning DTO and identity definitions; no state/UI imports. |
| DEP-003 | WP03-01A | WP02-01A | Pure DTOs available for early static world/quest/cosmetic catalogue. |
| DEP-004 | WP05-01A | WP02-01A | Pure DTOs available for early static world/quest/cosmetic catalogue. |
| DEP-005 | WP02-01A | WP04-01A | Frozen domain DTOs and complete static Q1–Q10 definitions (DEC-022). |
| DEP-006 | WP03-01A | WP04-01A | Frozen domain DTOs and complete static Q1–Q10 definitions (DEC-022). |
| DEP-007 | WP05-01A | WP04-01A | Frozen domain DTOs and complete static Q1–Q10 definitions (DEC-022). |
| DEP-008 | WP03-01A | WP03-02A | Stable learning/content contracts and quest bindings. |
| DEP-009 | WP02-01A | WP03-02A | Stable learning/content contracts and quest bindings. |
| DEP-010 | WP03-01A | WP03-03A | Stable learning/content contracts and quest bindings. |
| DEP-011 | WP02-01A | WP03-03A | Stable learning/content contracts and quest bindings. |
| DEP-012 | WP03-01A | WP03-04A | Learning, calendar and saved-history contracts, not state implementation. |
| DEP-013 | WP05-01A | WP03-04A | Learning, calendar and saved-history contracts, not state implementation. |
| DEP-014 | WP04-01A | WP03-04A | Learning, calendar and saved-history contracts, not state implementation. |
| DEP-015 | WP03-02A | WP03-05A | Reviewed starter banks and pure selection/evaluation. |
| DEP-016 | WP03-03A | WP03-05A | Reviewed starter banks and pure selection/evaluation. |
| DEP-017 | WP03-04A | WP03-05A | Reviewed starter banks and pure selection/evaluation. |
| DEP-018 | WP05-01A | WP05-02A | Frozen DTOs, identity and entitlements; pure policy uses contract fixtures before full integration. |
| DEP-019 | WP03-01A | WP05-02A | Frozen DTOs, identity and entitlements; pure policy uses contract fixtures before full integration. |
| DEP-020 | WP02-01A | WP05-02A | Frozen DTOs, identity and entitlements; pure policy uses contract fixtures before full integration. |
| DEP-021 | WP05-01A | WP05-03A | Completed calendar utilities; serial ownership transfer for calendar.ts. |
| DEP-022 | WP04-01A | WP04-02A | Versioned state and repository contract. |
| DEP-023 | WP04-01A | WP04-05A | Persisted preferences and immediate-silence port contracts. |
| DEP-024 | WP02-01A | WP04-05A | Persisted preferences and immediate-silence port contracts. |
| DEP-025 | WP04-02A | WP04-03A | Repository and bounded valid reward/history/content fixtures. |
| DEP-026 | WP05-02A | WP04-03A | Repository and bounded valid reward/history/content fixtures. |
| DEP-027 | WP05-03A | WP04-03A | Repository and bounded valid reward/history/content fixtures. |
| DEP-028 | WP03-05A | WP04-03A | Repository and bounded valid reward/history/content fixtures. |
| DEP-029 | WP04-03A | WP04-04A | Validated persistence, pure domain functions and early static catalogue ready for atomic facade integration. |
| DEP-030 | WP04-05A | WP04-04A | Validated persistence, pure domain functions and early static catalogue ready for atomic facade integration. |
| DEP-031 | WP03-05A | WP04-04A | Validated persistence, pure domain functions and early static catalogue ready for atomic facade integration. |
| DEP-032 | WP05-02A | WP04-04A | Validated persistence, pure domain functions and early static catalogue ready for atomic facade integration. |
| DEP-033 | WP05-03A | WP04-04A | Validated persistence, pure domain functions and early static catalogue ready for atomic facade integration. |
| DEP-034 | WP02-01A | WP04-04A | Validated persistence, pure domain functions and early static catalogue ready for atomic facade integration. |
| DEP-035 | WP02-01A | WP02-02A | Visual contract and asset registry handed off. |
| DEP-036 | WP02-01A | WP02-03A | Audio contract; WP02-02A edge is asset-register write handoff only. Disjoint source production may overlap under CON-002. |
| DEP-037 | WP02-02A | WP02-03A | Audio contract; WP02-02A edge is asset-register write handoff only. Disjoint source production may overlap under CON-002. |
| DEP-038 | WP02-01A | WP02-04A | Interaction and learning contracts; WP01-01A minimal host, never completed composition. |
| DEP-039 | WP03-01A | WP02-04A | Interaction and learning contracts; WP01-01A minimal host, never completed composition. |
| DEP-040 | WP02-03A | WP02-05A | Audio exports and persisted runtime ready for final binding; controller core may be built with frozen-port fixtures earlier. |
| DEP-041 | WP04-05A | WP02-05A | Audio exports and persisted runtime ready for final binding; controller core may be built with frozen-port fixtures earlier. |
| DEP-042 | WP04-04A | WP02-05A | Audio exports and persisted runtime ready for final binding; controller core may be built with frozen-port fixtures earlier. |
| DEP-043 | WP02-02A | WP02-07A | Art, speech/audio, state and entitlement interfaces. |
| DEP-044 | WP02-05A | WP02-07A | Art, speech/audio, state and entitlement interfaces. |
| DEP-045 | WP04-04A | WP02-07A | Art, speech/audio, state and entitlement interfaces. |
| DEP-046 | WP05-02A | WP02-07A | Art, speech/audio, state and entitlement interfaces. |
| DEP-047 | WP04-03A | WP04-06A | Actual state and validated backup/preferences; avatar assets. Early host from WP01-01A, no final shell prerequisite. |
| DEP-048 | WP04-04A | WP04-06A | Actual state and validated backup/preferences; avatar assets. Early host from WP01-01A, no final shell prerequisite. |
| DEP-049 | WP04-05A | WP04-06A | Actual state and validated backup/preferences; avatar assets. Early host from WP01-01A, no final shell prerequisite. |
| DEP-050 | WP02-02A | WP04-06A | Actual state and validated backup/preferences; avatar assets. Early host from WP01-01A, no final shell prerequisite. |
| DEP-051 | WP05-02A | WP05-04A | Committed standings/history selectors; early host from WP01-01A. |
| DEP-052 | WP05-03A | WP05-04A | Committed standings/history selectors; early host from WP01-01A. |
| DEP-053 | WP04-04A | WP05-04A | Committed standings/history selectors; early host from WP01-01A. |
| DEP-054 | WP02-02A | WP02-06A | M1 producer components and actual state ready for adventure composition in early host. |
| DEP-055 | WP02-04A | WP02-06A | M1 producer components and actual state ready for adventure composition in early host. |
| DEP-056 | WP02-05A | WP02-06A | M1 producer components and actual state ready for adventure composition in early host. |
| DEP-057 | WP02-07A | WP02-06A | M1 producer components and actual state ready for adventure composition in early host. |
| DEP-058 | WP03-05A | WP02-06A | M1 producer components and actual state ready for adventure composition in early host. |
| DEP-059 | WP04-04A | WP02-06A | M1 producer components and actual state ready for adventure composition in early host. |
| DEP-060 | WP05-04A | WP02-06A | M1 producer components and actual state ready for adventure composition in early host. |
| DEP-061 | WP02-06A | WP01-02A | Completed adventure, adult and Hall panels for final single-runtime composition (DEC-023). |
| DEP-062 | WP04-06A | WP01-02A | Completed adventure, adult and Hall panels for final single-runtime composition (DEC-023). |
| DEP-063 | WP05-04A | WP01-02A | Completed adventure, adult and Hall panels for final single-runtime composition (DEC-023). |
| DEP-064 | WP01-02A | WP01-03A | Integrated application, complete asset inventory and readiness/flush API. |
| DEP-065 | WP02-03A | WP01-03A | Integrated application, complete asset inventory and readiness/flush API. |
| DEP-066 | WP04-04A | WP01-03A | Integrated application, complete asset inventory and readiness/flush API. |
| DEP-067 | WP01-03A | WP01-04A | Complete offline-capable M1 build and deployment inputs. |
| DEP-068 | WP01-01A | WP06-01A | Actual interaction surface, valid fixtures and expected outcomes for agent-directed scenario tooling. |
| DEP-069 | WP02-04A | WP06-01A | Actual interaction surface, valid fixtures and expected outcomes for agent-directed scenario tooling. |
| DEP-070 | WP04-03A | WP06-01A | Actual interaction surface, valid fixtures and expected outcomes for agent-directed scenario tooling. |
| DEP-071 | WP03-05A | WP06-01A | Actual interaction surface, valid fixtures and expected outcomes for agent-directed scenario tooling. |
| DEP-072 | WP05-01A | WP06-01A | Actual interaction surface, valid fixtures and expected outcomes for agent-directed scenario tooling. |
| DEP-073 | WP06-01A | WP06-02A | Published M1 candidate URL/build and working agent observation tools. |
| DEP-074 | WP01-04A | WP06-02A | Published M1 candidate URL/build and working agent observation tools. |
| DEP-075 | WP06-01A | WP06-03A | Published M1 candidate URL/build and working agent observation tools. |
| DEP-076 | WP01-04A | WP06-03A | Published M1 candidate URL/build and working agent observation tools. |
| DEP-077 | WP06-02A | WP02-12A | Reuse recorded published visual/acoustic observations; no duplicate full journey. |
| DEP-078 | WP06-03A | WP02-12A | Reuse recorded published visual/acoustic observations; no duplicate full journey. |
| DEP-079 | WP02-12A | WP06-04A | M1 findings and owner corrections verified on corrected build; sole M1 acceptance. |
| DEP-080 | WP06-02A | WP06-04A | M1 findings and owner corrections verified on corrected build; sole M1 acceptance. |
| DEP-081 | WP06-03A | WP06-04A | M1 findings and owner corrections verified on corrected build; sole M1 acceptance. |
| DEP-082 | WP06-04A | WP02-08A | Accepted M1 and asset-register serial successor ownership. |
| DEP-083 | WP02-03A | WP02-08A | Accepted M1 and asset-register serial successor ownership. |
| DEP-084 | WP06-04A | WP02-09A | Accepted M1 and reusable interaction widgets. |
| DEP-085 | WP02-04A | WP02-09A | Accepted M1 and reusable interaction widgets. |
| DEP-086 | WP06-04A | WP03-06A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-087 | WP03-01A | WP03-06A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-088 | WP02-01A | WP03-06A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-089 | WP06-04A | WP03-07A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-090 | WP03-01A | WP03-07A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-091 | WP02-01A | WP03-07A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-092 | WP06-04A | WP03-08A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-093 | WP03-01A | WP03-08A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-094 | WP02-01A | WP03-08A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-095 | WP06-04A | WP03-09A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-096 | WP03-01A | WP03-09A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-097 | WP02-01A | WP03-09A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-098 | WP06-04A | WP03-10A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-099 | WP03-01A | WP03-10A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-100 | WP02-01A | WP03-10A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-101 | WP06-04A | WP03-11A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-102 | WP03-01A | WP03-11A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-103 | WP02-01A | WP03-11A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-104 | WP06-04A | WP03-12A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-105 | WP03-01A | WP03-12A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-106 | WP02-01A | WP03-12A | Accepted M1; frozen skill/DTO/quest contracts. Disjoint content modules may proceed concurrently. |
| DEP-107 | WP03-06A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-108 | WP03-07A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-109 | WP03-08A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-110 | WP03-09A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-111 | WP03-10A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-112 | WP03-11A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-113 | WP03-12A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-114 | WP03-05A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-115 | WP03-04A | WP03-13A | Reviewed expansion modules and starter catalogue; serial catalogue integration. |
| DEP-116 | WP03-13A | WP04-07A | Accepted M1 real save and complete M2 catalogue for bounded compatibility/adult-view verification. |
| DEP-117 | WP04-04A | WP04-07A | Accepted M1 real save and complete M2 catalogue for bounded compatibility/adult-view verification. |
| DEP-118 | WP04-06A | WP04-07A | Accepted M1 real save and complete M2 catalogue for bounded compatibility/adult-view verification. |
| DEP-119 | WP06-04A | WP04-07A | Accepted M1 real save and complete M2 catalogue for bounded compatibility/adult-view verification. |
| DEP-120 | WP02-08A | WP02-11A | M2 assets, companion, compatible state and closed-week records. |
| DEP-121 | WP02-07A | WP02-11A | M2 assets, companion, compatible state and closed-week records. |
| DEP-122 | WP04-07A | WP02-11A | M2 assets, companion, compatible state and closed-week records. |
| DEP-123 | WP05-03A | WP02-11A | M2 assets, companion, compatible state and closed-week records. |
| DEP-124 | WP02-08A | WP02-10A | Complete M2 content/components and serial ownership of world composition. |
| DEP-125 | WP02-09A | WP02-10A | Complete M2 content/components and serial ownership of world composition. |
| DEP-126 | WP02-11A | WP02-10A | Complete M2 content/components and serial ownership of world composition. |
| DEP-127 | WP03-13A | WP02-10A | Complete M2 content/components and serial ownership of world composition. |
| DEP-128 | WP04-07A | WP02-10A | Complete M2 content/components and serial ownership of world composition. |
| DEP-129 | WP02-06A | WP02-10A | Complete M2 content/components and serial ownership of world composition. |
| DEP-130 | WP02-10A | WP01-05A | M2 producers complete; retain real M1 build/save for upgrade; serial platform publication. |
| DEP-131 | WP04-07A | WP01-05A | M2 producers complete; retain real M1 build/save for upgrade; serial platform publication. |
| DEP-132 | WP06-04A | WP01-05A | M2 producers complete; retain real M1 build/save for upgrade; serial platform publication. |
| DEP-133 | WP01-03A | WP01-05A | M2 producers complete; retain real M1 build/save for upgrade; serial platform publication. |
| DEP-134 | WP01-04A | WP01-05A | M2 producers complete; retain real M1 build/save for upgrade; serial platform publication. |
| DEP-135 | WP01-05A | WP06-05A | Published M2 candidate, accepted M1 evidence/save and agent-directed tools. |
| DEP-136 | WP06-01A | WP06-05A | Published M2 candidate, accepted M1 evidence/save and agent-directed tools. |
| DEP-137 | WP06-04A | WP06-05A | Published M2 candidate, accepted M1 evidence/save and agent-directed tools. |
| DEP-138 | WP01-05A | WP06-06A | Published M2 candidate, accepted M1 evidence/save and agent-directed tools. |
| DEP-139 | WP06-01A | WP06-06A | Published M2 candidate, accepted M1 evidence/save and agent-directed tools. |
| DEP-140 | WP06-04A | WP06-06A | Published M2 candidate, accepted M1 evidence/save and agent-directed tools. |
| DEP-141 | WP06-03A | WP06-06A | Prior boundary observations and real starter-save fixture. |
| DEP-142 | WP06-05A | WP02-13A | Reuse M2 observations with accepted M1 visual/acoustic baseline. |
| DEP-143 | WP06-06A | WP02-13A | Reuse M2 observations with accepted M1 visual/acoustic baseline. |
| DEP-144 | WP02-12A | WP02-13A | Reuse M2 observations with accepted M1 visual/acoustic baseline. |
| DEP-145 | WP02-13A | WP06-07A | Final M2 evidence and verified owner corrections; sole final acceptance. |
| DEP-146 | WP06-05A | WP06-07A | Final M2 evidence and verified owner corrections; sole final acceptance. |
| DEP-147 | WP06-06A | WP06-07A | Final M2 evidence and verified owner corrections; sole final acceptance. |
| DEP-148 | WP02-02A | WP05-04A | Ready M1 avatar/UI framing exports and asset mapping before finished Hall visual verification. CON-003 fixture construction may precede this completion handoff. |

## Permitted concurrency

| Group ID | Members | Conditions |
|---|---|---|
| CON-001 | WP03-02A, WP03-03A, WP03-04A, WP05-02A, WP05-03A, WP04-02A, WP04-05A | After each incoming contract handoff, independent content/pure-policy/repository/preferences modules may proceed in separate owned files; contract changes route to Controller. |
| CON-002 | WP02-02A, WP02-03A | Visual and audio source production may overlap in disjoint asset trees after WP02-01A. Asset registry mutation is strictly WP02-01A → WP02-02A → WP02-03A → WP02-08A; the corresponding edge gates register integration, not source creation. |
| CON-003 | WP02-04A, WP02-05A, WP04-06A, WP05-04A | Independent widgets/audio/adult/Hall implementation using frozen ports and WP01-01A fixture host. Actual-domain completion obeys incoming edges; do not edit final shell or another producer's files. |
| CON-004 | WP06-02A, WP06-03A | Same immutable M1 build, separate browser contexts/save fixtures and disjoint evidence files. No shared-clock/storage mutations or simultaneous deployment. |
| CON-005 | WP02-08A, WP02-09A, WP03-06A, WP03-07A, WP03-08A, WP03-09A, WP03-10A, WP03-11A, WP03-12A | Only after M1 acceptance; independent art/widget/content modules, no concurrent central registry/catalogue writes. WP03-13A integrates afterward. |
| CON-006 | WP06-05A, WP06-06A | Same immutable M2 build, isolated contexts and evidence, dedicated real-M1 upgrade fixture; serialize publication and final acceptance. |

