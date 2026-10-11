# Music variation credits — independent shell validation

11 October 2026. **SCOPED PASS; no actionable findings or required correction.** The frozen credits companion satisfies the presentation requirements in `CONTINUATION-AND-MUSIC-VARIATION.md` and the independently accepted producer review `MUSIC-VARIATION-VALIDATION.md`. This is a credits/source/render verdict, not acoustic, integrated offline, publication or final-release acceptance.

## Exact candidate and checks

Candidate root: `C:/Users/alexb/.codex/visualizations/2026/10/09/01a12006-2ada-7081-a177-ce4799da0f2d/music-credits-0510f482/candidate`.

Declared base: `0510f482e5d10155843abe9179a3034b569a41ae`. Parent `credits-candidate-files.json` SHA-256: `429bec27eb44c2162fca4a5f74479664a40bef3ea96ab4b4f3cca9a33a0e1f48`.

| Owned delivery path | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/app/AppShell.tsx` | 21,526 | `a31e00ab9332c47b28d6a00ede3fa8c82b47d207439a8e1bb7bba419dd761ec4` |
| `tests/platform/shell.spec.ts` | 39,517 | `b4921f54eb6f3da2c1805111c96ba477c5ae3dfa6842ddd13b1cb61694a6fbfa` |
| `docs/work-package/execution/MUSIC-VARIATION-CREDITS-HANDOFF.md` | 5,060 | `bc14feab709d062de62495a3c40f6b12f0a47580e9c1bcb3c1d5628613b1a248` |

Independently checked the 664 paths in the staged-media inventory against actual files, allowing only the declared owned replacements, and checked the additional handoff: no missing or mismatched listed files. Read original shell/spec/register entries directly from the retained `base.zip`, without Git. The shell delta consists of three changed credits lines; the test delta updates the three former credits expectations, imports the register reader and adds the focused credits case. The original four cases remain.

Independently matched all 31 non-register files in the supplied 32-file media manifest to the actual credits candidate, including byte lengths and hashes. Its manifest hash remains `fd5a4f0455a73e3673ed506cd864f881fe77d2288307fba0cb83002f5539c185`. Both complete audio rows match the separately reviewed media candidate. Against the retained base register, only `village-loop` and `library-loop` differ; all other 70 rows and their order remain. This verifies the actual media overlay used for credits, not merely a proposed text fixture.

## Rights presentation and behavior

Both headings name both recordings: “Market on the Sea / Sleep Talking” and “Sunset Walk / Sleep Talking”. Combined author strings render plainly. No creator anchor attaches KiluaBoy's name to Jonathan Shaw's website. Existing anchors use the actual primary source/licence URLs and explicitly say “Primary component source” and “Primary component licence”.

The complete supplied attribution and modification strings render unchanged. Village attribution retains Jonathan Shaw's CC BY 3.0 component, the separate Sleep Talking CC0 dedication and secondary source/licence URLs; library attribution names both CC0 recordings. No blanket replacement licence, loss of component rights or new schema is introduced. This checks conformity to the accepted rights representation; it does not repeat its legal-source acquisition review.

`overflowWrap: anywhere` is confined to the credits articles and permits long disclosure URLs to wrap. No lifecycle, runtime control, preference, state, identity, theme selection or cache behavior changes. The existing Help close/focus behavior remains in place.

## Render evidence and limits

Read the focused test and actual parent `credits-results-corrected.json`: **one expected pass, 1.796 seconds, retry 0, no skipped/unexpected/flaky/report errors**. The handoff identifies Chrome `155.0.8059.40`. Assertions cover complete attribution/modification text, both headings, unlinked combined authors, primary anchor labels/hrefs, secondary URLs, dialog horizontal containment, Escape/focus return and no page errors.

Visually inspected all six `captures/credits-*.png` images and independently matched each image's bytes to its report attachment. Desktop 1366×768 at 16px and portrait 768×1024 at 32px show readable headings, disclosures and controls with wrapping inside the dialog; vertical scrolling reaches the final modification text and closing buttons. The portrait evidence is 200% root text sizing, not a separate native browser-zoom test. Individual captures show selected scroll positions; complete text retention is also supported by the exact DOM assertions and source review.

The initial failed run and private harness corrections remain disclosed in the handoff. The corrected run checks the actual author paragraph and two anchors without assuming React produces one text node. App/worker/focused-spec typechecks are author-reported passes, not independently rerun here. The known 61 baseline DOM TypeScript diagnostics remain foundation-owned and were neither rediagnosed nor attributed to these credits.

No material uncertainty required a fresh browser run; source, actual frozen overlay and inspected render evidence suffice for this bounded change. No full shell matrix, D3, main build or offline rerun occurred. The separately accepted cache companion remains separate evidence. Final integrated hearing of A+B cycles, joins, cues, speech and levels remains pending.

Only this main validation report was written. No candidate/source/spec/config/media modification, Git operation, deployment, new worker or other-chat message occurred. No server/browser was started; port 5217 was unused. Review is complete and source inspection is released to Controller for integration of the three owned delivery paths, with media/register integration retained by its existing owner.
