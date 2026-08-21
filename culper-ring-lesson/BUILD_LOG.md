# BUILD_LOG — Shadow War: The Culper Ring

---

## Phase 3A.1 — Illustrated title screen (first raster asset through the Bible pipeline)

Heath supplied cover art (`images/Culpercoverimage.png`, 2.3 MB source) — Washington at headquarters by candlelight over the Long Island map, code book and sealed letters on the desk, British ships and campfires through the window, with the full title typography baked in. It is the ILLUSTRATION_BIBLE §8 title concept, realized.

**Pipeline (now the template for every future illustration):** source PNG stays in `/images` (authoring only, never loaded at runtime) → converted in-browser to 1280px WebP q0.72 → **exactly 80 KB, meeting the Bible's title byte cap** → embedded base64 in the new `src/world/art/illustrations/illusManifest.js` with bilingual alt text and source/rights metadata → bundled into index.html like any module.

**Title screen behavior:** the section becomes a full-bleed cover with a bottom scrim carrying the menu; the SVG candle is hidden (the painting has two better ones) and the DOM `h1` is visually replaced but kept off-screen for screen readers, with the section exposed as `role="img"` + bilingual `aria-label`. Because the baked typography is English-only, the DOM subtitle now shows **only in Spanish mode** (translated line above the menu) — EN users see no duplicate text; the string stays set for assistive tech and tests. If the manifest were ever removed, the old candle title renders unchanged.

**Verification:** 54/54 asset tests (two new: cover embedded as WebP under cap with alt+source metadata; index.html wiring present) · 38/38 e2e (unchanged — subtitle text remains readable to the ES/EN toggle test) · EN and ES title screenshots inspected at 1024×600. `index.html` is now **316 KB** — the first raster asset fits within even the original 1.5 MB budget; the §0 budget amendment remains pending only for the *full* illustration plan.

**Note:** the cover ships with baked English typography. If Heath wants a fully localized cover later, the fix is a text-free version of the same art with DOM typography restored on top — one regeneration, no engine change.

---

## Phase 3.0 — Illustrated-history-book direction: ILLUSTRATION_BIBLE.md (documents only, no code)

Design direction received: shift the game's presentation from "pixel-art educational game" toward an **interactive illustrated history book** — four visual layers (painterly story illustrations behind off-map dialogue, the existing pixel walkable maps, painterly dialogue portraits, and authentic public-domain historical documents), Pyle/Wyeth inspiration, codified lighting and color.

**Delivered:** `ILLUSTRATION_BIBLE.md` — the governing document the direction asked for, built *before* any asset production. It contains the vision and layer model, style/lighting/color law, character sheets for all nine majors (plus the 355 silhouette-only rule), environment sheets, the title-screen concept, a dialogue `art` schema, naming/file/embedding conventions with byte caps, reusable AI prompt templates with a consistency workflow and human review gates, an authentic-source shelf with verification flags, a 12-point QA checklist, and a 3-phase rollout with stop gates. `ART_BIBLE.md` got a scope note (it remains law for the pixel layer only).

**Conflicts surfaced, not buried (require Heath's sign-off before Phase 3A):**
1. The master spec says "No large images. Use inline SVG illustrations. Target under 1.5 MB." The Bible proposes amending to base64-WebP raster with per-asset caps and a **6 MB** total budget (projected actual ≈ 2.9 MB for the full game) — the offline single-file rule stands untouched; the 1.5 MB figure was a delivery constraint, not a pedagogy one.
2. No authenticated likenesses exist for Woodhull, Brewster, Anna Strong, or Hale — portraits of them are inventions, to be disclosed on each character's existing "Real vs. Imagined" epilogue screen. Washington/Tallmadge/Arnold/André/Simcoe ground in period portraiture (holdings flagged ⚠ for verification at authoring time).
3. AI generation accepted per the direction, with anchor-image consistency workflow and per-character approval gates; authentic sources win wherever they exist.

**Deliberately NOT done:** no code changes, no generated assets, no map edits (the §3 map delta — wash basin, dock lanterns, one leaning post — is specified but awaits Phase 3B). The pixel pipeline, tests, and the shipped pilot are byte-identical this phase.

**Key design insight recorded:** the walkable map already gives dialogue visual context — the illustration layer targets precisely the scenes that currently float over an empty gradient (prologue, Washington's replies, interrupts, future finale). Coverage where it's needed, no double-dressing where it isn't.

---

## Phase 2.8 — Final Setauket map assembly + visual QA pass

**Scope honesty:** the map, mission flow, guards, objectives, and save system were already assembled and passing tests from Phases 2.5–2.7. This phase was composition polish, gap-closing, and a strict QA/audit pass. Nothing in the story changed.

**Layout decisions (final):** the four quadrants keep their addendum roles — NW Anna's house/garden/clothesline with the great oak, NE Woodhull farm + barn behind split rails with the walkable gate, center crossroads + well on packed dirt, E Roe's tavern with west-facing door, S restricted shore with two patrols and the dock. Two additions this phase: a packed-dirt **spur from Anna's yard down to the road** (visual "yard entrance" the spec asked for — walkability unchanged) and a **firewood stack in the SW field** so the one near-empty pocket reads as worked land. The clothesline remains the only bright horizontal in the world and is visible from every quadrant.

**Objective-route distances (BFS-measured, printed by the test suite):**
- spawn → Abraham: **13 tiles** · Abraham → watch zone: **6** · watch zone → clothesline: **13** · clothesline → dock end: **12**
- Two legs exceed the ~10-tile guideline by 2–3 tiles: they are the NW↔NE and NE↔SW diagonals of a 20-wide map whose quadrant separation *is* the mission geography (home vs farm vs shore); compressing them would collapse the town. Documented as accepted.
- **Total forced walking ≈ 44 tiles ≈ 6.5 s of pure movement**; with reading pauses and one guard-timing wait, forced travel stays well under **30 s** for the whole mission (limit: 90 s). The yard-ending path walks even less.

**Patrol design:** two straight, deterministic shoreline loops — west guard (2,11)↔(8,11) with variant-A kit, east guard (17,11)↔(11,11) with variant B — flanking the single dock crossing at column 9, so the student watches both cones sweep past the crossing before committing. Tests now pin the patrols to open, restricted, walkable sand.

**Gaps found and closed this phase:**
1. **Guard patrol phase was not serialized** (addendum §8 requires it). Mission codes now carry per-guard `[x, y, waypoint index, direction]`; `initWorld` restores it with bounds clamping. Codes grew ~40 chars (612 → 652).
2. **Debug mode was thin.** Backtick now overlays: collision (red), restricted zone (orange), trigger tiles (cyan — watch zone, posts gap, dock end), entity anchors (green), patrol waypoints (yellow), plus a live readout of node ID, objective, position/facing, stats, flags, guard phases with cone lengths, fired triggers, and noclip. Node-jump (J) and asset preview (P) unchanged. Still unreachable in normal play.
3. Registered-but-unplaced firewood finally earned a spot; the wheelbarrow still hasn't and stays shelved.

**QA results (all executed with project tooling, not assumed):**
- **52/52 static tests**, including new: BFS reachability of every objective/NPC stand from spawn, no entity sealed by collision, patrol walkability + restriction, spawn validity, one-of-each landmark counts, and a source-scan that every map hookup node (ab1…wash_weak) exists.
- **38/38 e2e playthrough checks**, including new: keyboard-only focus lands on a dialogue action button whenever a dialogue opens; touch-only D-pad movement + Interact-button dialogue with no keyboard; reduced motion (rm class, frozen water, movement intact); Calm Patrols (guard verifiably pauses ~2 s at waypoints, then resumes deterministically); guard phase surviving a mission-code round trip.
- **1024×600:** full HUD + objective banner + map fit with margin, no scrolling; the banner is a separate DOM bar *above* the canvas, so it physically cannot cover northern interactions (verified in screenshot).
- **Grayscale:** verified on the worst case (dusk scene desaturated) — restricted shore reads as the lightest textured band with posts/rocks, guards keep tall-hat + crossbelt identity, the hung signal stays legible.
- **Performance (6× proxy):** measured in real Chrome on the heaviest scene (dusk: wash + lanterns + cones + smoke): **draw 0.18 ms, update 0.002 ms per frame**. Under a 6× throttle that is ~1.1 ms against a 16.7 ms budget — roughly 15× headroom before 60 fps is threatened, more at 30 fps. Caveat: measured as a headless benchmark, not interactive DevTools throttling, and still not on physical Chromebook hardware.
- **Layer order:** verified in renders — restricted tint bakes below characters; cones above characters per the documented contract; smoke above roofs; props never cover Brewster's dock arrival; markers sit below labels, labels inside the canvas top edge.

**Wasted-time audit (strict):** no forced backtracking on the required path — objectives chain NW→NE→S-edge→NW→S without revisiting; the one deliberate repeat (returning from the watch zone to the clothesline) is the mission's core teaching beat, not filler. Dead ends: the tavern cul-de-sac (18,7–9) and SW field are 2–4 tiles deep and optional. Awkward positioning: none found — every interactable is faced from a full-width open tile; the clothesline, both doors, and Abraham were interaction-tested. "Where do I go?" moments: covered by the single-objective banner plus name labels; the villager hints redundantly point at the dock and farm. Nothing decorative adds forced walking; decoration lives in corners, not corridors.

**Remaining known issues:** real-Chromebook hardware and real-touch-device passes still pending (the standing caveat since Phase 2); dialogue Enter-activation relies on browser-native focused-button behavior (focus placement is now asserted in e2e; native activation can't be proven in jsdom); the barn door is visual-only and may draw a curious press (needs one EN/ES line from Heath to fix); on-screen D-pad overlaps the SW canvas corner on touch devices — nothing interactive lives there, but confirm on hardware.

**Pilot recommendation:** the movement layer looks like a win on the evidence available. Forced travel is ~30 s of a ~30-minute mission (≈2%), while the map carries real teaching weight the menu version couldn't: students *see* the patrol pattern before hanging the signal, *see* the restricted zone as a place, and *choose* the dock route with their feet. The ambient layer (villagers, hints, farm life) is where walking pays immersion dividends at zero required cost. Recommend proceeding to the teacher playtest as the true test — watch whether students detour to the chicken more than once.

---

## Phase 2.7 — Character & entity sprite library

**Completed assets (all programmatic pixel data, zero image files):**
- **Anna Strong (player):** 4 facings × 2 walk frames (`anna.walk`), idle group (`anna.idle`) resolving to frame 0 of each facing — no duplicate art, no separate interact pose (a pose change on a 140 ms tile game read as flicker, not meaning). Blue dress / cream apron / bonnet; feet planted on row 15 in every frame; zero size wobble (both validated).
- **British guards, two related variants:** `guard.variantA` (musket shouldered right) and `guard.variantB` (musket left + white haversack), full 4-facing × 2-frame sets. Crimson coat + tall shako + white crossbelts + musket line; the two on-map guards now use one variant each. Guard step frames flip on tile arrival exactly like the player's — synchronized to movement, never free-running.
- **Named NPCs, full 4-facing idle sets** with identity accessories: Abraham (straw hat, brown coat, **walking staff**), Widow Foster (day cap, **basket**), Mr. Hart (worn tricorn, **cane**, white hair), Jonah (cap, **green waistcoat over shirt sleeves**), Brewster (tricorn, **rolled sleeves + rope coil** — boatman, deliberately not pirate-coded). Entities now *face* their world: Abraham faces west toward the approaching player, the widow faces her well.
- **Modular villager set:** the four named villager bodies + `npc.youth` (bare-headed farm worker) + a palette-swap demo (`npc.villager.woman.brown` from the widow's body) for future ambient dialogue casting.
- **Interaction markers** (8×8 @16px): amber diamond (usable), speech bubble (person), latched-bar (Roe's tavern "not yet"). Drawn above the faced target with a slow sine bob, frozen under reduced motion, below the name label so nothing covers a face. Floating labels restyled to the spec: paper cream + dark outline — measurably more readable over grass, buildings, and water than the old dark-glass style; still current-language-only, still bob-free under reduced motion.
- **Entity metadata** now carries `sprite` (anim base), `facing`, `kind`, position, bilingual label, and the real story `node()` hookups (`ab1`-chain, `jf1/jf2`, `vf1`, `vo1` — unchanged); optional `dz`/`variant` documented. Story prose stays in NODES.

**16×16 compromises (honest list):** hands don't exist, so "carrying" is an adjacent prop; Anna got no domestic accessory because a basket muddied her silhouette against the yard's own baskets; the musket is a 2-color vertical line — readable as "armed," not as a Brown Bess; rolled sleeves are two skin pixels per arm. All acceptable at Chromebook viewing distance.

**Historical references/assumptions:** 1770s working dress (short gown + petticoat + apron + cap) for the women; broad-brim straw for a Long Island farmer; British regulars in crimson with white crossbelts and (a simplification) shako-like tall caps — the pilot trades strict 1779 headwear accuracy for the strongest possible silhouette cue, documented here deliberately.

**Readability findings** (from the preview's characters-in-context strips over grass/path/dock/shore): Anna's blue reads on every background; guards are unmistakable everywhere; Abraham's brown coat loses contrast on dock boards but he never stands there, and his hat + staff carry him; the grayscale silhouette rule (only British sprites touch row 0) is now a hard test, not a hope.

**Effort that did NOT earn its keep:** an experimental separate interact pose (dropped — flicker without meaning); the idle-vs-walk distinction for NPCs (villagers don't move in the pilot, so idle sets alone were the right scope). Nothing shipped that distracts from reading: markers are static-ish, small, and only appear when facing a target.

**Portraits — recommendation, not implemented:** the dialogue overlay has no portrait support (`#dlg-who` is a text strip). Adding a 48×48 portrait beside it is feasible without disrupting the overlay (one flex row), but it is pure polish, costs EN/ES-neutral art time for five faces, and the chunky-figure style carries identity already. Recommend deferring until after the teacher playtest; if approved, build portraits as `figureKit` extensions at 3× scale rather than new art.

**Verification:** 45/45 asset tests (new: facing/frame-count completeness, feet-row + wobble checks, grayscale silhouette rule, guard-variant distinctness with crossbelt/musket presence, boatman-not-pirate check, palette-swap correctness, marker checks, and a source-level scan that entity metadata in index.html resolves to real registered groups/facings) · 33/33 e2e checks (new step: labels appear for every NPC, the clothesline, and the tavern door, and the tavern's locked interaction still reaches its "not yet" node — closing the exact test gap that hid the unreachable-door bug in Phase 2.6) · scene + preview renders inspected in real Chrome, including context strips and the fallback checker.

---

## Phase 2.6 — Setauket environment asset library

**Assets created (≈55 new sprites, all programmatic pixel data, zero image files):**
- *Terrain:* grass ×3, packed dirt, path center/NS-run/WE-run/crossing, sand ×2 + pebbled restricted sand + wet mud waterline, shallow water ×2 frames, deep water ×2 frames, dock boards, tilled field, kitchen garden.
- *Natural barriers:* border tree (trunk visible) + interior forest canopy, bush, the great oak (2×2 landmark), dry-laid fieldstone wall, shoreline rocks.
- *Structures:* light clapboard wall/window (Anna), dark weathered wall/amber-lit window (tavern), weathered roof, chimney roof, house door, tavern door, board-and-batten barn (roof/wall/door), split-rail fence, **open gate (walkable, and drawn open)**, rope post, well, dock.
- *Landmarks & dock props:* clothesline family (below), trough, hitching post, hanging tavern sign, wheelbarrow, woodpile, stacked firewood, laundry basket, barrel, crate, rope coil, fishing net, dock posts, beached rowboat (2-tile), Brewster's whaleboat.
- *Ambient:* chicken (2fr), sleeping dog, cat on the fence rail, bird (2fr), chimney smoke (3fr, positions derived from chimney tiles), hanging laundry (2fr, registered but deliberately unplaced), grass tuft, flowers, leaning pitchfork, hay bundle.

**Clothesline mapping (matches the real puzzle — win = 1 black petticoat + 4 white handkerchiefs; decoys never appear on the map line):** `prop.clothesline.empty` (map char C) · `prop.clothesline.signal.m1` (post-puzzle overlay the game draws) · `prop.clothesline.item.petticoat` / `.item.hank` (composable pieces) · `SWART.compose.drawClothesline(ctx,tx,ty,{petticoat,hankies})` supports 0–6 handkerchiefs without a petticoat — exactly the range Mission 2 "Six Coves" will need.

**Deterministic variant rule (documented in mapLegend.js):** grass by position hash, path edges by path-neighbor mask, shallow-vs-deep water and sand-vs-mud by neighbors, border-vs-interior trees by neighbors. Nothing random, nothing per-frame; the bake is reproducible.

**Historical design choices:** clapboard courses and board-and-batten from Long Island vernacular; small-paned windows with muntins; fieldstone chimney and wall; split rails; muted-gold tavern signboard (restrained signage, and crimson stays reserved for the British); working waterfront told through barrels, nets, rope, and a beached rowboat rather than text.

**Readability decisions:**
- **Fixed a real reachability bug:** the tavern door used to face the rope-post row and could never be interacted with. It now faces west at (15,9), reached from (14,9); the sign hangs above it. (Found while recomposing — the e2e suite never visited the tavern; noted as a test gap.)
- Interior border trees merge into solid canopy so the map edge reads as one forest instead of a picket of lollipops; edge trees keep trunks to say "solid object."
- Restricted shore now carries pebbled ground texture in addition to the tint + posts + rocks — verified readable in a grayscale render.
- The farm gate is drawn *open* (posts aside, trampled ground) because it is walkable — collision must match the picture.
- Ambient props are placed only on tiles no route needs; the test suite enforces a critical-tile exclusion list (it caught one violation — a grass tuft on the main walking row — during development).

**Performance observations:** everything static (tiles, variants, props, tint) still bakes into the two full-map canvases, so the per-frame environment cost went from 1 drawImage to 5 (terrain + chicken + bird + 2 chimney smokes) — negligible; the frame loop still allocates nothing. Bake time grew trivially (~60 sprites rasterized once). No new risk for 6× CPU throttle beyond what Phase 2.5 measured; real-Chromebook confirmation still pending.

**Decorative but not navigational (honest list):** the wheelbarrow and stacked-firewood sprites are registered but unplaced (no spot earned them); `amb.laundry` is deliberately unplaced to protect the clothesline's uniqueness; the cat/dog/bird add life but no information. None of them cost the student anything — they are all off-route.

**Walking-time check:** clothesline → Abraham is now 11 walkable steps via the farm gate (~1.5s), slightly over the ~10-tile guideline but it is the mission's single longest required hop; all other legs are ≤9. No new walking was added by this phase — decoration went into corners, not corridors. The one glance-cost risk: the busier farmyard could make students detour to look at the chicken. That is arguably the point of an inhabited world; watch it in playtest.

**Verification:** 37/37 asset tests (new: full inventory, clothesline-state fidelity, crimson sweep over environment, variant determinism, per-tile resolve coverage both water frames, collision-vs-visual, critical-tile prop exclusion, reduced-motion frame freeze, compose slot math, terrain opacity) · 32/32 e2e playthrough (all routes, triggers, and saves intact on the recomposed map) · `build.js --check` clean · day/dusk/grayscale canvases exported from real Chrome and inspected (one bug found and fixed this way: transparent oak-canopy corners bled canvas black through the bake — now also covered by the opacity test).

---

## Phase 2.5 — Layered pixel-art asset pipeline (foundation)

**What changed:** all visual assets moved out of the game script into a layered, validated pipeline under `src/world/`, while the student deliverable stays one self-contained `index.html`. A dependency-free bundler (`node build.js`) concatenates the modules into `index.html` between marker comments; `node build.js --check` fails if the bundle is stale. Story nodes, localization, stats, and save-state code did not move and did not change.

**Files created**
- `src/world/art/` — `palette.js` (53 indexed, named, documented colors; crimson indexes formally reserved for `faction:"british"`), `pixelUtils.js` (pixel buffers, compact string-row format, validation, flips, palette swap, run-length canvas rasterizer), `spriteRegistry.js` (ID registry: duplicate rejection, structural validation at registration, cached canvases, animation groups, magenta fallback for missing IDs, crimson/blank/anim-ref audits).
- `src/world/tiles/` — `terrainTiles.js`, `structureTiles.js`, `propTiles.js` (all 15 map tiles + clothesline, signal overlay, boat — ported pixel-for-pixel from the shipped painters, now as palette-indexed data).
- `src/world/characters/` — `figureKit.js` (one parameterized 16×16 body: hats carry identity), `annaSprites.js` (4 facings × 2 frames), `npcSprites.js` (5 villagers, zero crimson), `guardSprites.js` (the only crimson file).
- `src/world/effects/` — `worldEffects.js` (cached shadow/lantern/dusk), `sightCones.js` (24 pre-rendered wedge canvases max, blitted per frame).
- `src/world/maps/` — `setauketMap.js` (the ASCII map + spawn), `mapLegend.js` (char → sprite + block/sight/restricted sets). Bilingual labels stayed in the game script: they are localization, not art.
- `src/world/rendering/` — `worldRenderer.js` (documented 10-layer draw contract; static map pre-baked into two full 640×480 canvases, one per water frame), `entityRenderer.js` (pooled, y-sorted, small `dz` offset instead of a depth engine), `effectRenderer.js` (night order: wash → lanterns; cones; debug grid).
- `src/world/previews/` — `assetPreview.js` (dev panel: full palette table, every sprite with ID/dims, live animation players, audit results) + `preview.html` (dev page that loads raw modules, no build step). In-game: backtick then **P**, debug mode only — students cannot reach it.
- `src/world/init.js`, `build.js`, `tools/test-assets.js` (25 unit tests), `tools/test-e2e.js` (the 32-check playthrough suite, adopted into the repo; needs `jsdom` available via NODE_PATH or a local install).

**Design decisions**
- Single-file constraint (spec §2) is honored by *generating into* index.html rather than abandoning modules — the bundle markers make the generated region explicit and `--check` keeps it honest.
- Existing procedural painters were ported to pixel buffers rather than hand-authoring arrays: same rects, same coordinates, but the output is now data that validation can inspect. Rendering is pixel-identical except three deliberate changes: (1) Roe's tavern sign is now muted gold — crimson is reserved for the British, and Roe is no such thing; (2) the restricted shore/dock now carries a subtle static crimson ground tint, double-coding the rope-post border for colorblind students (addendum §9); (3) sight cones draw above characters and the dusk wash draws before lantern glows, matching the documented layer order (you can now see the cone you are standing in, and lanterns actually glow at night).
- A handful of near-duplicate hues were consolidated into named palette entries (hair tones, tricorn felt); differences are 1–2 shades on 1–3 px details and invisible at 32px.

**Performance (Chromebook)**
- Net win: the per-frame terrain pass went from 300 `drawImage` calls to **one** (static map + structures + restricted tint pre-baked per water frame; ~2.4 MB of canvas memory, well within budget). Sprite canvases, cone wedges, lantern and shadow canvases are all cached at init; the frame loop allocates nothing (pooled actor slots, shared position scratch).
- Risk watched: init now rasterizes 38 assets + two full-map bakes up front. Measured as trivial (tens of ms even under jsdom); if a future asset load balloons, stagger the bake.

**Known limitations**
- NPCs have a single idle facing (pilot scope) — the registry's animation groups are ready for full walk sets when NPCs need to move.
- `flipH`/`flipV`/`swapPalette` are implemented and tested but no shipped asset uses them yet; they exist for the next asset layer (villager color variants, west/east mirroring).
- The preview panel is functional, not pretty; it is a dev tool.
- `tools/test-e2e.js` needs `jsdom`; the asset tests (`tools/test-assets.js`) and `build.js --check` are dependency-free.

**Wasted-student-time check:** nothing here changes pacing. The only student-visible differences are the restricted-zone tint (faster rule comprehension, if anything) and cones rendering above characters. Load time is unchanged to the eye.

**Verification:** `node build.js --check` clean · all `src/world` files pass `node --check` · 25/25 asset unit tests · 32/32 e2e playthrough checks (dialogue, nodes, puzzles, saves all unchanged) · map canvas exported from real Chrome and visually compared — identical scene, audit panel reports 38 assets, 0 problems.

**Next recommended asset layer:** environment richness for the existing map — tile variants (grass ×2–3, tree ×2), door/window variation, and shoreline transition tiles, all pure additions through the registry. After that, NPC walk sets when any mission needs a moving villager.

---

Deliverable: `index.html` — one self-contained file, **113 KB** (budget: 1.5 MB), no network calls of any kind. Open it from a local file or drop it on GitHub Pages as-is.

Per the spec's Phase 2 instruction ("stop here for teacher review before writing the other 11 missions"), this build stops at: **Engine + Prologue + Anna Strong Mission 1 (*The Signal*)**, with Mission 1 running on the **walkable Setauket map pilot** from the addendum.

---

## Phase 1 — Engine (done)

- Node/dialogue engine: 2–3 sentence chunks per screen, choices, converging branches, interrupt styling (darker palette, crimson border).
- Three-meter HUD (Suspicion / Trust / Intel) always on screen; every choice shows no preview, then an immediate one-line explanation toast ("He wonders what scared you. Suspicion +10.").
- **ES/EN toggle** (top-right, flag-free) — every node, choice, puzzle instruction, label, objective, and feedback line has a written Spanish mirror (natural Latin American register, not literal). Toggling mid-dialogue re-renders in place.
- **Read-aloud** (Web Speech, en-US / es-US) on every dialogue chunk, the objective banner, and vocab cards. Degrades silently if the device has no voices.
- **Vocabulary tooltips**: 10 terms (spy, intelligence, cipher, Loyalist, Patriot, occupied, treason, courier, dead drop, suspicion), each a bilingual card with a one-sentence definition and an SVG icon.
- **Mission Codes**: base64 of compact state (`CR1.` prefix), typed on the title screen to resume — including mid-map position, facing, and fired triggers. localStorage is a convenience layer only; the game runs fine with storage fully disabled (verified — see Testing).
- **Culper code book**: slide-in paper panel; real ring numbers (711/721/722/723/724/725/727/728/729/355) plus 15 internally consistent word codes reserved for later missions.
- Interrogation at Suspicion 100: 3-node scene, never game-over. Calm/consistent answer → released, Suspicion drops to 60. Checkable lie → held for hours, Suspicion 80, Trust −10.

## Phase 2 — Prologue + Anna Mission 1 (done)

- Shared prologue (8 nodes): Tallmadge/"John Bolton" recruitment, Nathan Hale handled in one plain sentence, code-book teach with a 3-number **decode puzzle** (tap number → pick word; wrong picks shake, nothing punishes), Suspicion-meter teach, Anna intro (Selah on the prison ship).
- Character select: 4 portrait cards (SVG, difficulty stars, "based on a real person" tag). Anna is playable; Woodhull/Brewster/355 show a friendly "still being written" note.
- **Mission 1 on the walkable map** (all 6 addendum pilot phases):
  - Canvas 640×480, 20×15 ASCII-defined tile map, fixed camera, integer scaling, `image-rendering: pixelated`.
  - Grid-locked movement, 140 ms tween, input buffering; keyboard (arrows/WASD + E/Space/Enter, Esc = menu) **or** touch (on-screen D-pad, glowing Interact button, tap-adjacent-tile-to-interact). First-run overlay teaches both in 2 screens, EN/ES, re-openable from the menu.
  - Programmatic pixel sprites (no image files): Anna (4 facings × 2 walk frames), Abraham, Widow Foster, Mr. Hart, Jonah Greene, Brewster, and the only-crimson-on-the-map British soldiers with tall-hat silhouettes (colorblind-safe double coding).
  - 2 guards on deterministic shoreline patrols with **visible 3-tile sight cones**; being seen only matters on the restricted sand/dock (rope-post border + the game says the rule out loud). Caught = dialogue + choice, reusing interrogation logic — never instant failure. "Calm patrols" setting adds 2 s waypoint pauses and dims cones.
  - Mission flow: talk to Abraham (learn the code, cove **4**) → observe the patrol from behind the posts → **clothesline puzzle** (hang the black petticoat + 4 handkerchiefs; decoy laundry in the tray; a soldier interrupts mid-puzzle) → choose: meet Brewster at the dock at dusk (more Intel, real stealth risk under lantern light) or watch from the yard (safe) → **Report to Washington**.
  - Ambient bilingual villager hints (Widow Foster, Mr. Hart), Roe's tavern foreshadow door, Anna's kitchen (Suspicion −5 once), Trust ≥ 60 unlocks a bonus Abraham scene ("Courage is being afraid and doing it anyway").
  - Jonah Greene, a free Black ferryman, is the documented-context supporting character (§11): written with dignity and agency — he *chooses* to pass Anna the patrol-timing intelligence.
- **Report to Washington** (CER-lite): 1 claim of 3, 2 evidence cards drawn from what the student actually discovered (decoys mixed in), sentence-starter reasoning with typed completion (ES starter included), wax-seal send, and Washington's reply changes if the claim outruns the evidence.
- **Debrief screen**: name/date line, stats, full report + Washington's note, choice history, hints used, mission code; copy button + print-friendly view. No data leaves the page.
- Accessibility: 44 px targets, visible focus rings, no drag-only mechanics anywhere, `prefers-reduced-motion` respected + in-game toggle (instant tile steps, no shimmer/bob), everything readable at 1024×600.
- Phase 3 note: the decode component exists and is data-driven; extending it to mission-length messages is wiring, not new code.

## Walking-time check (the pilot's key question)

Forced walking, measured on the final map: spawn→Abraham ~13 tiles, Abraham→watch point ~7, watch→clothesline ~11, optional dock run ~9. At 140 ms/tile that's **≈ 45–60 seconds of required walking for the whole mission** — under the 90-second ceiling. Nothing on the map is reading-critical; all prose stays in the paused overlay. Nothing about the movement layer felt like filler *to me*, but the real answer comes from students — see open question 2.

## Testing done

- 32 automated checks driving the real DOM end-to-end, all passing: full playthrough (both endings), decode wrong/right paths, clothesline interrupt + wrong-answer + hint flow, guard-cone capture, interrogation at Suspicion 100, gating (clothesline refuses before Abraham/watching), evidence cards matching actual discoveries, EN↔ES on every screen, bad-code rejection, and Mission-Code round-trips (end-of-mission and mid-map).
- Node-graph audit (no dangling `next`/`go`, every choice has Spanish) and a sentence-length sweep (no sentence over 20 words) run automatically.
- Rendered and pixel-verified in real Chrome: title, day map, and dusk map (night tint, guard lantern glows, boat at the dock, signal on the line).
- Fixed along the way: an interrogation loop at exactly Suspicion 100, and a crash when localStorage is disabled (managed Chromebooks do this — now fully guarded).
- **Not yet tested on real hardware**: an actual Chromebook, a real touch device, and Spanish voice quality (depends on installed voices). Suggest these as the first playtest items.

## Stubbed / deferred (per spec order)

- Woodhull, Brewster, and Agent 355 storylines; finale; epilogues; "Real vs. Imagined" screens.
- Interrogation failure → "continue as another ring member" (pilot uses release-with-penalty instead).
- Suspicion decay between missions (single-mission build so far).
- Invisible ink, encode puzzle, dead-drop map choices, Spot the Risk, Prison Ship interrupt (M1→M2).

## Open questions for Heath

1. **Mission Code length.** End-of-mission codes run ~600 characters because they carry the typed reasoning and full choice history (so the Debrief survives resumption). Too long to hand-copy — fine if students use the Copy button or you screenshot. Mid-mission codes are ~200. If you want hand-writable codes, I'd drop the choice log from the code (~150 chars) at the cost of a thinner restored Debrief. Your call.
2. **The pilot question:** watch whether students enjoy the walking or race through it. The ambient NPCs (well, tavern, ferryman) are where the map earns its keep — if students skip all three, the map is costing more than it gives.
3. **Cove-number recall:** Abraham says "cove four" once; the puzzle's hint button re-teaches it (hint 1 nudges, hint 2 answers). Right amount of friction for your readers?
4. **Jonah Greene** (free Black ferryman): documented-context characterization per §11 — please review his two nodes before wider rollout; name and role are easy to adjust.
5. Guard cones use translucent **crimson** (British danger color). An early sketch used amber; crimson teaches the color language better but is slightly less soft. Flag if it reads as too alarming.
