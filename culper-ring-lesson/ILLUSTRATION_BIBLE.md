# ILLUSTRATION_BIBLE — Shadow War: The Culper Ring

**The governing document for the game's shift toward an interactive illustrated history book.**
Every future illustration, portrait, document, map addition, and UI art decision is evaluated against this document. It extends — and where scopes overlap, outranks — `ART_BIBLE.md`, which remains the binding law for one layer only: the pixel-art walkable world.

> The player steps inside an illustrated Revolutionary War history book. Historical authenticity first, emotional storytelling second, readability for struggling readers always. Not fantasy, not anime, not a generic pixel RPG, not cartoon edu-software — an award-winning illustrated history book that became interactive.

---

## 0. Constraints and required decisions — READ FIRST

This direction collides with three written project rules. The Bible does not pretend otherwise; it proposes the amendments and flags what only Heath can decide.

| # | Existing rule (CLAUDE_Culper_Ring_Spec.md §2) | Collision | Proposed amendment |
|---|---|---|---|
| 1 | "No large images. Use inline SVG illustrations." | Painterly illustrations and authentic document scans are raster art. | Amend to: *raster art allowed as base64-embedded WebP, hard per-asset caps (below); SVG remains the rule for icons and UI.* |
| 2 | "Target file size under 1.5 MB." | The full four-layer plan cannot fit in 1.5 MB. | Raise the budget to **6 MB** for the full game. Rationale: the constraint's *purpose* is offline single-file delivery on old Chromebooks — disk and memory tolerate 6 MB easily; it was never a bandwidth rule. Per-asset caps keep it honest: full-screen illustration ≤ 60 KB (WebP, 960×540 max), portrait ≤ 15 KB (256×256), document ≤ 80 KB. Budget math: ~24 illustrations (1.4 MB) + ~30 portraits (0.45 MB) + ~10 documents (0.8 MB) + existing 0.21 MB game ≈ **2.9 MB** with headroom for the remaining 12 missions. |
| 3 | Single file, zero network at runtime. | **No collision — this rule stands absolutely.** | Authentic scans are downloaded at *authoring* time, processed, and embedded at build time. The student's file never touches the network. |

**Decisions Heath must sign off before asset production begins:**
1. The 6 MB budget amendment (above).
2. The invented-likeness policy (§6): no authenticated portraits exist for Woodhull, Brewster, Anna Strong, or Nathan Hale — their faces will be *inventions*, disclosed on each character's existing "Real vs. Imagined" epilogue screen. Washington, Tallmadge, Arnold, André, and Simcoe will be grounded in period portraiture.
3. AI-generated art is acceptable per the direction — but every generated asset passes the human review gate (§13.4) before it enters the game, and each character's sheet is approved *before* batch generation.
4. Whether prologue Story Illustrations ship in the current pilot (Phase 3A, ~0.5 MB) before the teacher playtest, or after it.

**Hard rules imported from the master spec that no illustration may break:**
- Violence referenced, never depicted. **No execution imagery** (Hale, André). No graphic prison-ship interiors.
- **Agent 355 never receives a face.** She is composed as silhouette, turned figure, fan, shadow, empty chair — the mystery *is* the lesson. This applies to every layer including marketing-style art.
- Real people portrayed respectfully and within the documented record; inventions disclosed via "Real vs. Imagined."
- Enslaved and free Black people existed in this world and appear with dignity and agency (Jonah Greene sets the precedent).
- British crimson stays reserved: in illustrations, saturated crimson appears **only** on British soldiers and explicitly British objects. Civilians live in cream, faded blue, brown, gray. Patriots in muted blues, browns, greens.

---

## 1. The four visual layers

| Layer | Medium | Governed by | Status |
|---|---|---|---|
| 1. Story Illustrations | Painterly raster (AI-assisted + authentic), full-screen behind dialogue | this document | **not built** |
| 2. Walkable maps | Programmatic pixel art | `ART_BIBLE.md` (unchanged) | shipped |
| 3. Character portraits | Painterly raster beside dialogue | this document | **not built** |
| 4. Historical documents | Authentic public-domain scans, treated | this document | **not built** |

**The unifying trick — one visual language across four media.** Every non-pixel asset passes through the same finishing treatment so authentic engravings, AI paintings, and UI read as pages of one book:
1. **The paper ground.** Every illustration sits on the game's aged-paper cream (`#f2e8d5` family) with a subtle fiber texture; edges vignette softly into paper, never hard-cropped to the viewport. Documents keep their own paper but are matted onto ours.
2. **The palette grade.** After generation/scanning, every asset is graded toward the game palette (§11): shadows pull toward midnight blue `#1a2332`, warm light toward candle amber `#e8a33d`, and overall chroma is restrained. A washed-out engraving and an over-vivid AI painting meet in the middle.
3. **The line discipline.** Pyle/Wyeth-style shapes: strong silhouettes, big value masses, minimal fussy detail. If a thumbnail at 100 px wide doesn't read, the composition fails.

---

## 2. Layer 1 — Story Illustrations

**When they appear.** The walkable map already provides visual context — dialogue on the map stays over the live world (this is working; do not cover it). The illustration layer targets everywhere dialogue currently floats over an empty dark gradient: the **prologue**, **Washington's replies**, **interrupt scenes**, mission briefings/epilogues, and the **finale**. One illustration per scene, held through its nodes — not per dialogue chunk.

**Shot list mapped to real, existing nodes** (Phase 3A — the current build):

| ID | Nodes | Scene | Lighting recipe (§10) |
|---|---|---|---|
| `illus.occupied-newyork` | p1–p2 | British warships crowding the East River; the city small beneath masts; crimson pennants the only saturation | overcast day |
| `illus.tallmadge-door` | p3–p4b | Tallmadge on horseback at a farmhouse door, lantern raised; Anna's shadow in the doorway | night lantern |
| `illus.hale-letter` | p4 | Restraint rule: NO gallows. A folded letter, spilled ink, an empty chair, dawn light — loss told through objects | dawn indoor |
| `illus.codebook-hands` | p5 | Hands opening the code book beside a candle (hand-off to authentic doc, §5) | candlelight |
| `illus.anna-clothesline` | p7–p8 | Anna at the line at first light, bay behind, laundry basket at her hip — the game's signature image | golden morning |
| `illus.washington-candlelight` | wash_good / wash_weak | Washington reading a small report by candle, maps spread, wax and seals | candlelight |
| `illus.brewster-crossing` | br1 (optional backdrop swap) | Whaleboat low in dark water, oars feathered, far shore lanterns | moonlight water |

Reserved for later phases (do not produce yet): prison-ship letter interrupt (M1→M2), Simcoe's checkpoint, the André capture and Arnold finale set (per spec: André's fate is one somber screen — objects and faces, no gallows), per-character epilogue plates.

**Composition rules.** 16:9-safe at 960×540; the lower third stays *quiet* (dialogue card overlays it); one light source per scene; figures ≤ 3 unless the crowd is the point; horizon low for outdoor scenes (Wyeth sky). Nothing essential in the outer 5% (Chromebook scaling).

**Text-over-art legibility (non-negotiable).** The dialogue card keeps its current solid background — text never sits raw on a painting. When an illustration is active, it dims to 80% behind an ink scrim at the card's edge. Contrast of card text is already WCAG-safe and stays untouched.

**Accessibility.** Every illustration carries bilingual alt text (one plain sentence, 4th-grade level) exposed to the read-aloud button — an illustration must *add* comprehension for a struggling reader, never gate it.

---

## 3. Layer 2 — Walkable maps (delta only)

`ART_BIBLE.md` remains law. The direction's wishlist is mostly already shipped: Anna's yard has the garden, flower bed, woodpile *(at the farm)*, footpath spur, and laundry basket; the farm has field furrows, barn, hay, tools, chicken, cat; the dock has barrels, crates, rope, nets, dockposts, and a beached rowboat.

**Approved additions (small, asymmetry-serving):** a wash basin in Anna's yard (the one listed item genuinely missing — she is the ring's laundress; this is environmental storytelling), a second woodpile or lean-to on the *house* side, one or two lantern posts at the dock (day: unlit props; dusk: light sources), and breaking the rope-post line's perfect symmetry with one leaning post. **Rejected:** wagons and livestock beyond the chicken (tile budget and route clutter), anything that adds forced walking. Additions ride the existing prop pipeline; nothing here needs new engine work.

---

## 4. Layer 3 — Character portraits

**Format.** 256×256 source, displayed at ~96–128 px beside the dialogue speaker strip; bust framing (mid-chest up), three-quarter view default; painterly, NOT pixel art; transparent-cornered vignette onto the paper ground so portraits feel inked into the page. Same figure, same clothing, same lighting logic in every expression — expressions change the face and posture only.

**Placement.** The dialogue card gains a portrait slot left of the `who` strip. On 1024×600 this costs ~112 px of card width — acceptable at current card size (`min(720px, 96vw)`); the engine change is one flex row (already assessed as low-risk in BUILD_LOG Phase 2.7). Portraits never cover map, meters, or banner. When no portrait exists for a speaker (e.g., "The sergeant," villagers), the card renders exactly as today — portraits are enhancement, never dependency.

**Expression matrix — scoped to actual script needs, not completionism:**

| Character | Expressions (count) | Grounding |
|---|---|---|
| Anna Strong | neutral · concerned · determined · quiet-relief (4) | invented likeness (disclose) |
| Abraham Woodhull | anxious · neutral · unguarded-warm (3) | invented likeness (disclose) |
| Benjamin Tallmadge | earnest · grave (2) | period portrait exists (verify: Ezra Ames portrait) |
| Caleb Brewster | grin · focused (2) | invented likeness (disclose) |
| George Washington | thinking · grave · approving (3) | Peale / Stuart portraiture (PD) |
| Nathan Hale | calm-resolute (1 — single scene) | **no life portrait exists**; invented, idealization avoided; disclose |
| Benedict Arnold | proud · cornered (2 — finale) | period engravings (PD) |
| John André | composed · resigned (2 — finale) | André's own self-portrait sketch (PD; verify holding — Yale) |
| Major Simcoe | cold · suspicious (2 — Woodhull M3) | period portrait exists (verify) |
| **Agent 355** | **NONE. Silhouette treatment only, forever.** | spec §11 |

Total: ~21 portraits ≈ 0.3 MB. Jonah Greene and the villagers stay portrait-less in the pilot; if the teacher playtest shows portraits matter, Jonah is first in line (his dignity-and-agency writing deserves the investment).

---

## 5. Layer 4 — Historical documents

**Principle:** where a real thing exists, show the real thing. Students should touch actual sources, not recreations — this is the strongest primary-source teaching in the game.

**Presentation pattern (one pattern, every document):** the treated scan on the paper ground → a bilingual caption card (what it is, one sentence, 4th-grade level) → a "What does it say?" toggle revealing a plain-language transcription EN/ES with read-aloud. Authentic 18th-century handwriting is *unreadable* for this population — the artifact carries authenticity; the transcription carries meaning. Both are always present.

**Acquisition shelf** (public-domain candidates; ⚠ = exact holding/URL must be verified at authoring time — do not assert to students until verified):
- Culper code book pages — George Washington Papers, Library of Congress ⚠ (the in-game code book panel gains a "see the real page" view)
- Culper correspondence with invisible-ink passages — George Washington Papers, LOC ⚠ (pairs with Woodhull M2, *Invisible Ink*)
- Ratzer "Plan of the City of New York" (1770) — PD, multiple holdings (prologue: occupied New York)
- Period map of Long Island Sound / Setauket coastline ⚠ (Brewster's crossings)
- HMS Jersey prison-ship engravings — PD (Anna's interrupt; honest, not graphic — choose exterior views)
- André capture/trial engravings and his self-portrait ⚠ (finale; respects the no-execution-imagery rule)
- Washington portraiture (Peale, Stuart) — PD (portrait grounding + epilogue plates)
- A Revolutionary-era newspaper page ⚠ (Woodhull M3 counterfeiting plot)

Rights rule: **pre-1800 works are PD; the *scan* source must still be checked** for use terms; prefer LOC/NARA/institutional open-access downloads; record source + URL + date for every document in the asset manifest — this metadata feeds the "Real vs. Imagined" screens.

---

## 6. Character sheets (grounding for every portrait and illustration appearance)

Format per character: role · age in 1779 · appearance anchors · costume + palette · one prop · bearing · DON'Ts. These sheets are the consistency mechanism — the same sheet text is pasted into every AI prompt involving that character (§13).

- **Anna Strong** — Setauket farmwife and signal operator, ~39. Invented face: broad, weathered, steady dark eyes; brown hair pinned under a white cap/bonnet. Short gown in muted blue `#3a5a7a` over cream apron; practical shoes. Prop: laundry basket or clothespin. Bearing: capable, watchful, unhurried — *never* aristocratic, never glamorous. DON'T: silk, jewelry, youthening.
- **Abraham Woodhull** — farmer, "Samuel Culper," ~29 but worry-worn. Invented face: thin, tight-jawed, eyes that check the road. Brown coat `#6e5137`, straw hat, boots. Prop: walking staff. Bearing: shoulders slightly hunched, hands restless. DON'T: merchant finery, courage-poster squareness.
- **Benjamin Tallmadge** — dragoon major, "John Bolton," ~25. Grounded in portraiture ⚠. Continental blue coat, white smallclothes. Bearing: upright, earnest, young-for-the-weight. DON'T: crimson anywhere, powdered-wig fanciness.
- **Caleb Brewster** — whaleboat captain, ~32. Invented face: wind-burned, broad grin, heavy hands. Navy peacoat `#2c3e57`, rolled sleeves, worn tricorn. Prop: rope coil or oar. DON'T: **anything pirate** — no earrings, sashes, cutlasses; he is a working boatman with a commission.
- **George Washington** — commander-in-chief, 47. Peale/Stuart grounding. Buff-and-blue uniform. Seen mostly by candlelight over papers. Bearing: contained gravity; approval is a small nod, not a smile. DON'T: dollar-bill flatness, marble-statue coldness.
- **Nathan Hale** — 21 at death (1776, prologue only). No life portrait exists — invent restrained: plain Continental coat, young, calm. One scene, one expression. DON'T: gallows, rope, martyr-glow.
- **Benedict Arnold** — 38–39, finale. Engraving-grounded. Continental uniform *early*, British scarlet *after* — the coat change is the story. Bearing: proud, wounded (leg), aggrieved.
- **John André** — 29, British adjutant-general, finale. Self-portrait-grounded ⚠. Elegant scarlet, composed. Handled with the dignity the record shows; his death is told, never shown.
- **Major John Graves Simcoe** — Queen's Rangers commander (Woodhull M3). Portrait-grounded ⚠. **Green** Rangers coat — deliberately NOT crimson; his menace reads through stillness, not color. DON'T: cartoon villainy.
- **Agent 355** — silhouette only: gown shape, fan, turned head, candle-shadow. Composition must make her *presence* strong and her identity absent.

---

## 7. Environment sheets (recurring illustrated settings)

- **Anna's yard:** house gable + great oak framing; the line with its cord catching light; the bay a value-break behind. Dawn default.
- **Washington's headquarters:** one candle, map-covered table, sealed letters, the code book; window shows dark or distant fires. THE title-screen setting.
- **The Sound at night:** low whaleboat, feathered oars, black water with one lantern track; Connecticut shore a breath of light.
- **Occupied New York:** masts like a fence across the sky; crimson pennants; civilians small and gray.
- **Setauket village:** as the pixel map establishes it — green, dirt road, well, saltbox roofs; illustrations must agree with the map's geography (bay south, farm northeast).

---

## 8. Title screen

Full illustrated background: **Washington's headquarters at night** — candle burning beside maps, coded letters, and the Culper code book; through the window, British campfires prick the far shore. Logo above; the current menu (bilingual, code entry) unchanged over the illustration's quiet lower third. The candle already in the title screen carries over — it becomes *the* candle in the scene. Asset: `illus.title-headquarters`, budget ≤ 80 KB (it earns a higher cap). The screen must say "Revolutionary-War espionage" before a single word is read.

---

## 9. Dialogue presentation schema

Nodes gain an optional `art` block; absence = current behavior (map scenes keep the live map):

```js
wash_good:{ who:{...}, t:{...},
  art:{ illus:"illus.washington-candlelight",
        portrait:"portrait.washington.thinking",
        mood:"planning" },        // mood = grade preset, not free text
  ...}
```
`mood` selects one of the lighting recipes (§10) applied as a CSS grade on the illustration layer — it never alters text styling. Interrupt scenes keep their existing darker treatment, which becomes a mood preset (`danger`).

---

## 10. Lighting recipes (the only five)

| Recipe | Key | Shadow | Use |
|---|---|---|---|
| golden morning | warm low sun, long shadows west | cool blue-gray | outdoor day, Anna's yard |
| overcast day | flat silver | soft neutral | occupied city, somber outdoor |
| candlelight | amber `#e8a33d` pool | midnight `#1a2332` | interiors, Washington, code book |
| night lantern | one lantern sphere | deep blue-black | Tallmadge's arrival, dock at dusk |
| moonlight water | cold rim light | near-black water | Brewster crossings |

No lens flares, no god-rays, no rim-light drama, no modern color-grading looks. If a lighting choice wouldn't appear in a Pyle plate, it doesn't appear here.

---

## 11. Color

The game palette (53 entries, `palette.js`) remains the anchor. Illustrations may use full painterly gradation but must *grade toward* these poles: paper cream `#f2e8d5` (light), midnight blue `#1a2332` (dark), candle amber `#e8a33d` (warmth), and the faction rules — British crimson `#a83232` saturated only on British subjects; Patriots in muted blue/brown/green; civilians in cream/faded blue/brown/gray. A shared reference swatch strip is exported from the palette module and attached to every AI generation prompt.

---

## 12. Naming, files, and technical integration

- **IDs:** `illus.<scene-slug>` · `portrait.<character>.<expression>` · `doc.<item-slug>` — same dot-path convention as the sprite registry.
- **Files:** sources live in `src/world/art/illustrations/` (working PNG + final WebP + a `manifest.js` mapping ID → base64 WebP + alt text EN/ES + source/rights metadata). `build.js` embeds the manifest like any other module. The student file stays single and offline.
- **Runtime:** an `<img>`/CSS layer behind the dialogue modal — NOT the game canvas; the pixel renderer is untouched. Reduced-motion: illustrations swap with no cross-fade.
- **Caps (enforced by a build check to be added with Phase 3A):** illustration ≤ 60 KB (title ≤ 80), portrait ≤ 15 KB, document ≤ 80 KB; total file hard-fails the build over 6 MB.
- **Registry note:** raster art does NOT enter the pixel sprite registry (16×16 validation would reject it); the manifest is its parallel, with its own audit (alt text present, caps met, rights metadata present, crimson-subject tag for the color rule).

---

## 13. AI illustration strategy

**13.1 Base style block (paste verbatim into every generation):**
> Late 18th-century American Revolutionary War historical illustration in the tradition of Howard Pyle and N.C. Wyeth. Oil and gouache texture, visible brushwork, strong silhouettes, large simple value masses, muted period-accurate palette on warm aged-paper cream ground, restrained detail, low horizon, single light source. Historically accurate 1770s clothing, architecture, and objects. Quiet, dignified, human. Book-plate composition with soft vignetted edges.

**13.2 Negative block (paste verbatim):**
> no anime, no manga, no photorealism, no 3D render, no fantasy elements, no modern objects, no dramatic cinematic lighting, no lens flare, no HDR, no neon, no Victorian or medieval anachronisms, no gore, no gallows or execution imagery, no caricature, no watermark, no text.

**13.3 Assembly:** base style + lighting recipe (§10) + environment sheet (§7) + character sheet(s) (§6, pasted whole) + composition line (quiet lower third; ≤3 figures; subject placement) + palette swatch reference. Portraits add: "bust portrait, three-quarter view, mid-chest framing, plain paper-toned background."

**13.4 Consistency workflow (seeds don't survive tools; process does):** 1) generate each character's *neutral* portrait until Heath approves it — that image becomes the character's visual anchor, attached (as image reference where the tool allows) to every later generation; 2) batch expressions off the anchor; 3) grade everything through the §1 finishing treatment; 4) side-by-side review against the character sheet and the crimson rule; 5) only then embed. Any regeneration replaces the *whole* expression set of a character, never one drifted face.

**13.5 Authentic-first rule:** before generating any scene, check the §5 shelf — if a period image serves the teaching goal, treat and use it, and label it as authentic in-game. Generated art is for moments history didn't illustrate.

---

## 14. QA checklist — every new visual asset

1. Would it sit comfortably in a serious illustrated history book? 2. Silhouette readable at thumbnail? 3. Palette graded to §11; crimson only on the British? 4. Lighting from the five recipes? 5. Period-accurate objects only? 6. Violence/execution rules respected; 355 faceless? 7. Bilingual alt text written at 4th-grade level? 8. Under its byte cap? 9. Rights metadata recorded (authentic) or "invented — disclose" flag set (AI)? 10. Dialogue text remains on its solid card — never raw over art? 11. Reduced-motion path verified? 12. Does it *teach* something — daily life, stakes, or place?

---

## 15. Phased rollout (each phase shippable, each behind the review gate)

- **3A — Prologue set (proves the language):** title screen + 7 shot-list illustrations + Anna/Tallmadge/Washington portraits + the real code-book page. ~0.9 MB. Engine: illustration layer + portrait slot + `art` schema. STOP for Heath's review — this is the visual playtest.
- **3B — Mission 1 full dress:** remaining M1 portraits (Woodhull, Brewster), `br1` backdrop, map delta (§3), Report/Debrief document dressing.
- **3C — onward:** per-mission sets as missions are written; finale set last, with the Arnold/André material and its restraint rules.

Do **not** generate ahead of the phase gates. The Bible exists precisely so asset production never outruns approval.
