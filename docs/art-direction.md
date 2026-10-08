# Learning is Fun · The Lost Kingdom

WP02-01A direction and static contract, 9 October 2026. This is the production
brief for a layered storybook miniature. [The compact original SVG reference](art-direction-reference.svg)
shows the intended materials, cast silhouette, depth and live-text/control space;
it is a design sample, excluded from the runtime asset inventory. Its controls
are illustrations of states, not a playable scene or accessibility acceptance.

## Visual promise

Make a small, welcoming world worth repairing. The village feels assembled from
painted wood, folded paper, stitched cloth and rounded clay. Warm light catches
roof edges; shallow shadows seat props on the ground. Use three authored depth
planes: an atmospheric hill/tree silhouette, a crisp landmark and action plane,
then sparse foreground leaves or railings. Leave the focal action unobstructed.
The child should see what their work changed on returning to a location.

Scene art occupies useful space beside a quiet cream instruction surface, with
no glossy card grid. At portrait tablet size the scene sits above that surface;
controls wrap below the prompt. Preserve text size and tentative answers rather
than shrinking the whole landscape. Puzzle prompts, numbers, punctuation,
clock values and assessed labels stay live DOM/adapter SVG sourced from WP03.
Artwork never supplies an answer, hides a required instruction or becomes a
screenful of tiny tappable ornaments.

Pip is a small russet fox with a large cream muzzle, leaf-shaped tail and a cloth
scarf: generous silhouette, curious ears, readable idle/help/celebration poses.
Rowan wears a moss apron with a timber ruler; Iona has plum sleeves and a book
clasp; Nessa wears a coral shawl and carries a fruit basket. Orin joins in M2 with
a teal caretaker coat and a brass key. Vary skin tones, hair and silhouettes
within one restrained shape language. The player is represented by their chosen
reused portrait/prop, without adding another named NPC. Round paws/hands and
simple expressive eyes remain legible at avatar size. No emoji characters or
mixed stock-art style. Avatar IDs crop Pip-idle, Rowan, Iona, Nessa, coral flowers
and apple; no extra avatar exports or new cast.

## Tokens and states

Use a local system font stack: `ui-sans-serif, system-ui, -apple-system,
BlinkMacSystemFont, "Segoe UI", sans-serif`. No font download or service.
Child prompt/body: 18px / 1.5, secondary labels: 16px / 1.5, button text: 18px /
1.35 at weight 650, section heading: 24px / 1.25 at 700, adventure title: 36px /
1.15 at 750. Reading line length: 32–60 characters. At 200% text size allow
wrapping, vertical scroll and taller controls; no clipped prompt, fixed-height
feedback box or inaccessible offscreen action. Actual resizing remains a widget
and integration check, not a property proven by this static sample.

| Token | Value | Use |
|---|---|---|
| paper | #FFF6E5 | Quiet reading surfaces |
| ink | #263D38 | All main text and dark outlines |
| secondary | #52645F | Secondary text on paper |
| teal | #24665E | Primary controls, selected/focus boundary |
| forest | #244D42 | World foliage; success text |
| amber | #F4B85A | Selected/interactable fill with ink text |
| coral | #C16C60 | Cloth/roof/flower accent; no small text |
| plum | #70536F | Cast accent; secondary action text on paper |
| success-paper | #E1EEE2 | Success panel |
| support-paper | #F8E6DC | Supportive retry panel |

Measured sRGB contrast pairs (rounded to two decimals; fixtures recompute the
unrounded ratios). Normal text target ≥4.5:1, qualifying large text ≥3:1;
active-control/focus boundary target ≥3:1 against its neighbouring fill.
The text targets follow [W3C Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html).
The adopted 44px game target follows [W3C Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html),
not a claim that 44px is the AA minimum. These sources and the dragging guidance
were checked on 9 October 2026.

| Pair | Contrast | Role |
|---|---|---|
| ink / paper | 10.83:1 | Prompt/body |
| secondary / paper | 5.85:1 | 16px secondary labels |
| paper / teal | 6.24:1 | Primary button text; boundary on paper |
| ink / amber | 6.56:1 | Selected text and outline |
| plum / paper | 6.20:1 | Secondary action text |
| forest / success-paper | 7.91:1 | Labelled success feedback |
| ink / support-paper | 9.60:1 | Labelled retry guidance |
| teal / amber | 3.78:1 | Focus boundary on selected fill |

Spacing scale: 4, 8, 12, 16, 24, 32px. Panel radius 24px; tiles 12px; controls
14px. Panel shadow: `0 8px 20px rgb(38 61 56 / 12%)`; decorative art shadows
are short and soft. Main controls have ≥48px minimum height, ≥44×44px hit areas
for every game target, 8px spacing and a 2px visible outline. Thin punctuation
glyphs use full tiles. Focus uses a 3px teal ring with 3px paper separation from
the control, including the teal primary button. Do not use shadow alone as its
boundary. SVG artwork stroke widths scale with the scene, not the hit area.

Normal: paper/ink with teal outline and a verb label. Selected: amber/ink, solid
teal outline, a tick shape AND “Selected” text; it can be deselected. Focus:
separated ring, never hidden by scenery or overlays. Disabled/unavailable:
keep readable ink/paper, use “Available after …” with lock outline and explanatory
text; do not reduce opacity until unreadable or expose a dead quest control.
Pending: “Saving…” plus retained arrangement, no premature celebration. Incorrect:
“Try another arrangement” plus one actionable supplied explanation on support
paper, retaining the draft. Success: “Bridge restored” plus a tick and the visible
restored landmark on success-paper, only after committed success. Colour never
stands alone for availability, correctness or reward.

## Seven landmarks and restoration layers

Each scene is one layered SVG export. Its landmarkAssetId references that export,
not a second fetched duplicate. Prefix internal IDs with the scene/export ID;
use labelled `background`, `middle`, `foreground` and the exact result ID for
each result layer. Independent overlay exports use their own prefixes. A route
or availability fact can reveal a DOM hotspot or prop; it need not be drawn as
an extra physical object. Rendering belongs to WP02-06A/10A.

| Scene / delivery / theme | Landmark and depth | Committed changes |
|---|---|---|
| village-green / M1 / village | Bent-roof home, circular lawn, Hall sign; hill behind, flower rim in front | Q3 bunting/welcome and three plot sockets; M2 Q5 garden/marker overlays, Q10 finale |
| river-bridge / M1 / village | Low timber arch over a teal ribbon river, reeds in front | Q1 broken timbers → joined bridge; map route opens |
| whispering-library / M1 / library | Plum-roof book-shaped gable, lantern windows, low shelf | Q2 sleeping → lit/open with spellbook/instructions; M2 Q6 shelf/map |
| market-square / M1 / village | Coral awning on a curved stall, crates and basket | Q3 empty → stocked, bunting points back to the green |
| tinkers-workshop / M2 / village | Round sawmill wheel under timber eaves | Q4 working wheel/supplies and one sawmill-model display |
| storywood-forest / M2 / library | Arch of trees around a pale winding path | Q7 ordered tale/path, Q8 recovered brass gear |
| clockwork-castle / M2 / village | Compact stepped towers, enormous amber clock face | Q9 clock/open doorway, Q10 authored finale overlay |

Reference direction: teal water/forest, warm timber bridge, cream walls, coral
roof, plum trim, amber affordances. Give every location a clear silhouette at
thumbnail size. Restore tangible objects with a brief skippable reveal; keep
camera travel small, never cover the next action with confetti. Reduced/system
reduced motion replaces travel, decorative loops, flutter and particles with an
immediate static changed layer and the same text. Discoveries are one optional,
transient, non-scored moment per scene, named in DISCOVERIES; never a collectible
journal or new saved completion flag.

## Interaction and owner boundaries

Drag is optional: select with tap/click, then tap/click the labelled destination;
keyboard select/place yields the same draft. Matching selects two items;
sequencing offers Move before/after; sorting selects item then category;
manipulation exposes labelled increment/decrement; selection uses focusable
choices. Show selected item and legal destination labels. Every required target
is ≥44×44px without overlapping hit boxes. No hover-only instruction, precision
timing, multi-touch requirement or orientation lock. Undo/remove are explicit.
Use native buttons/radios with live labels; decorative SVG is aria-hidden beside
equivalent DOM. Overlays return focus to the initiating control and have Escape/
Back routes without traps. These are bounded product targets, not certification.
The touch alternative and keyboard path are distinct requirements, following
[W3C dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

DEC-005/WP01 own D1 Chrome 1366×768 complete mouse/keyboard, D2 Edge 1920×1080
and D3 Firefox 1280×720 smoke, T1 Chromium touch 1024×768 complete, T2 WebKit
touch 768×1024 activities plus rotation. Emulation is not physical-tablet/Safari
evidence. Widget authors check 200% text, focus and touch; WP06 checks the actual
published game. WP04 owns deliberate two-step adult entry, not authentication.

Visible instructions can have user-triggered Read/Stop/Replay where a local
English `localService` voice exists. Missing local voices keep text and readable
unavailable guidance. Never automatically read assessed passages or punctuation
answers. WP03 owns listening-support/answer-help meaning; WP04 commits assistance
before relevant help is revealed. Neutral instructions do not imply answer help.
No quest depends on speech.

In-play sound controls are always easy to reach: Enable/Resume sound, Silence
all, independent music/effects mute and volume, and Stop reading beside narration.
First/read-failed visits are silent. Silence-all stops music, effects AND speech
synchronously before persistence; navigation, load/resume callbacks and failed
saves cannot undo it. Resume is explicit and preserves channel mutes/volumes.
`src/audio/contracts.ts` supplies only AudioPreferenceIntent/LiveAudioGate.
WP04-01A owns InstallationAudioPreferences; WP04-05A owns requested generations,
queue/ack/retry and its applyLivePreferences binding. WP02-05A owns the real
audio/speech gate, not a second preference store. DEC-020/026 remain authoritative.

## Static progress and creative handoff

SCENES/QUESTS/WORLD_RESULTS are the one static graph. Q1→Q2→Q3; Q3→Q4→Q5 and
Q3→Q6; Q5+Q6→Q7→Q8→Q9→Q10. Empty prerequisites belong only to Q1. Q1–3 and
four scenes are M1; Q4–10 and three additional scenes are M2. Q5/Q6/Q10 explicitly
remain M2 even though they revisit M1 scenes. Future IDs do not make M2 playable.
Result facts derive from committed quest IDs, never independent save flags.
WP03 owns required story-binding identity/availability/success; WP04 is the sole
atomic validator/writer of permanent unique completedQuestIds and
completedStoryBindingIds. Both begin empty and survive history compaction/reload/
backup/M2. Optional-transfer/revisit/practice success cannot complete required
bindings. No evaluation, reward arithmetic or state runtime exists in this slice.

CREATIVE_CHOICES supplies three free scarf colours (teal/amber/plum), three free
flower colours (coral/gold/violet) after Q3 and complete six-key placements. M1
permits one planter in plot-1…3, with plot-4…6 null; M2 permits one item per socket
and reusable planter/tree/bench/lantern/banner/pond after Q3. Plain pattern/rim/
trim is null. Preview/undo is local; one Save sends the complete appearance
replacement to WP04, which validates milestone, Q3 and entitlements. Dormant
default flower colour is coral before Q3, with all placements initially null.

| Cosmetic choice and entitlement ID | Target | WP05 lifetime outcome | Delivery |
|---|---|---|---|
| scarf-leaf | scarfPatternId | 20 | M1 |
| planter-rim | planterRimId | 60 (planter also requires Q3) | M1 |
| home-trim | facadeTrimId | 150 | M2 |
| scarf-star, scarf-wave | scarfPatternId | 300, both choices | M2 |

The concrete entitlement strings equal choice IDs in separate fields; WP05 owns
threshold derivation, never deducts points, and no cosmetic gates quests. M2 shelf
displays spellbook from Q2, forest-story-map from Q6 and forest-tale from Q7; the
single sawmill-model invention derives from Q4. STORY_DISPLAYS has those asset
references/requirements, not additional saved awards or editable grants.

## Free production, inventory and rights

The required route is text-authored editable SVG using this palette and local
original JSON note/envelope compositions rendered to PCM by later producers.
No paid service, account, trial, sample library or remote font is needed. Optional
Inkscape/Krita/Audacity are author tools, not runtime requirements; this slice
does not claim those editors are installed or tested. No external asset pack is
selected. Later art/audio authors own quality and exports, not this reference.

[asset-register.json](../assets/asset-register.json) contains a versioned embedded
Draft 2020-12 per-export schema and 71 planned rows: 36 M1 SVGs, 7 M1 WAVs and
28 M2 SVGs. Source paths are planned, not file-existence claims. M1 includes four
scene families with result layers, world map/Hall marker, Pip's three poses,
Rowan/Iona/Nessa, plank lengths 1–6, punctuation tile, apple/pear/basket, spellbook/
instructions, scarf/flowers/planter and leaf/rim overlays, shared control/socket
surrounds and reused discoveries. M2 adds three scenes/Orin, garden/finale/shelf
overlays, story/map/quantity/clock/array/book surrounds, gear/marker/books/model,
five additional decorations and home/star/wave overlays. The inherited planter
is the sixth decoration. Text and assessed representations remain live data.

Every row is exactly one fetched export, not an internal layer or avatar crop.
Runtime paths are base-relative `assets/art/m1|m2/...` or `assets/audio/...`;
public exports live at `public/<runtimePath>` and load with WP01's assetUrl.
Editable sources are under `assets/source/`; SVG IDs are prefixed, with no
scripts, remote/editor-only dependencies or baked puzzle text. Scene IDs map to
matching scene filenames. Reference SVG is documentation, not an offline asset.

Ready rows require measured per-export bytes, SVG width/height or decoded audio
sampleRate/frameCount. Loops additionally require exclusive frame endpoints with
`0 ≤ start < end ≤ frameCount`. WAV exports are mono 44.1kHz 16-bit PCM. Two
60–90s loops (`village-loop`, `library-loop`) and pickup/placement/support/success/
restoration cues reuse soft plucked/bell tones, warm sustain and wooden taps;
arrange phrases with variation, space and folded tails, no harsh failure buzzer.
Village theme serves green/bridge/market/workshop/castle; library serves library/
forest. WP02-03A owns composition, measured joins/headroom and actual listening;
callback/peak checks cannot establish acoustic quality. Speech ducks only
otherwise permitted music, with generation/mute rechecks after async work.

Permission is either original authorship with holder/statement/confirmation and
retained evidence, or reused exact licence/version/URL and retained licence path,
plus source URL, attribution and modifications when applicable. Planned original
rights remain pending/unassigned. Never relabel original art CC0/GPL because an
editor uses that licence; no fabricated copyright grant. Ready provenance is a
producer requirement. Credits read confirmed register fields, with no placeholder
author labels shown to children. Schema catches structure, not truth of rights.

WP01's required runtime set is the unique ready runtime paths filtered by
delivered milestone (M2 includes M1), not all planned references. Initially that
set is empty. Ready/offline and measured cache sizing remain WP01-owned. Initial
register writer is WP02-01A; accepted handoff passes exclusively to WP02-02A,
then WP02-03A, then WP02-08A. Disjoint art/audio source production can overlap,
but register writes follow the serial handoff. No new currency, asset loader,
renderer, state store, reward policy or media acceptance is supplied here.
