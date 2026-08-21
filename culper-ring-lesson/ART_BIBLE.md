# ART_BIBLE — Shadow War: The Culper Ring

> **Scope note (2026-07-15):** this document is the binding law for ONE visual layer — the programmatic pixel-art walkable world. The project's overall visual direction (story illustrations, character portraits, historical documents, lighting, and the cross-media style language) is governed by `ILLUSTRATION_BIBLE.md`, which outranks this file wherever scopes overlap. Nothing below changes for the pixel layer.

> Shadow War should look like a readable, restrained, late-18th-century illustrated history book translated into chunky pixel art. Shapes should be simplified, silhouettes should be recognizable, and historical cues should be prioritized over decorative detail. The world should feel inhabited but not visually noisy.

Everything below serves that sentence. When a new asset makes the screen busier without making it more readable, cut it.

## Hard constraints

- **Programmatic pixel art only.** No PNG, JPG, SVG, WebP, or GIF files anywhere in the world layer. Every asset is JavaScript pixel data (`src/world/`) rendered once to an offscreen canvas at load.
- **One shared palette** (`src/world/art/palette.js`). Sprites reference colors by index, never by hex. If an asset needs a color the palette lacks, that is a palette design discussion, not a local hex. Adding an entry is append-only — existing indexes are stable forever, because sprite data references them by number.
- **Source sprites are 16×16** unless a prop genuinely needs another size (the boat is 26×8). Blit at 2× with nearest-neighbor. Never draw at fractional pixels.
- Logical resolution 640×480, 20×15 tiles of 32×32, fixed camera.

## Color rules

- **British crimson (`british-crimson`, `british-crimson-dark`) is reserved.** Only sprites registered with `faction: "british"` — soldiers, and explicitly British objects — may contain those indexes. Villagers never wear red, so students can trust the color as a danger signal. `registry.auditCrimson()` enforces this at load and in tests; do not add `crimson-ok` tags casually.
- **British danger is double-coded**: crimson coat AND the tall shako silhouette. No civilian wears a tall hat. This is the colorblind path — protect both halves.
- `candle-amber` is the world's single warm accent (door handles, lanterns). Use it to say "you can interact here" or "light," nothing else.
- Keep per-sprite color counts low: a 16×16 character should use ~5–7 indexes; a tile ~3–4.

## Shape and detail rules

- **Silhouette first.** A character must be identifiable at 32px from hat + body shape alone: bonnet (Anna), straw brim (Abraham), day cap (widow), tricorn (Hart, Brewster), flat cap (Jonah), tall shako (British). Color is confirmation, not identification.
- **Maximum detail for 16×16:** faces are hair + two eye pixels; hands do not exist; clothing gets at most one accent element (apron, crossbelt). If a detail needs more than ~3 pixels to read, it is too small to include.
- **No dithering** except at most a single-row transition (unused so far — prefer hard bands). Checkerboard shading reads as noise on low-quality Chromebook panels.
- **No isolated single-pixel noise.** Texture speckles (grass, sand, path) come in fixed, deterministic positions from the shared painters so repeated tiles read as calm fields, and always sit 1+ tile apart.
- **Landmarks must be findable at a glance.** The clothesline, the dock, the well, and doors each get one distinguishing feature visible from anywhere on screen. If two landmarks compete, dim the less important one.
- **Contrast floor:** adjacent fills should differ enough to survive a washed-out 1024×600 TN panel — when in doubt, compare against `grass-medium` at 40% brightness. Interactive things get the strongest edges.

## Historical rules

- **Period:** Long Island, 1779. Buildings are saltbox/colonial vernacular — plaster and timber walls, wood-shingle roofs, split-rail fences, plank docks, stone wells. No thatched-fantasy cottages, no castles, no generic medieval anything.
- **Clothing:** working dress, aprons, bonnets and caps for women; breeches, plain coats, tricorns and straw hats for men; British regulars in crimson coats with white crossbelts and shakos. Nothing steampunk, nothing modern, no anachronistic objects (no lanterns with glass panes drawn in loving detail — one amber glow is enough).
- Decorative flourishes lose to historical plausibility every time. If it wouldn't be in a schoolbook illustration of occupied Setauket, it isn't in the game.

## Pipeline workflow (for anyone adding an asset)

1. Author pixel data in the right module under `src/world/` (or a new module — add it to the ordered list in `build.js` and `tools/test-assets.js`). Use `SWART.px` helpers or `fromStrings` rows; reference palette indexes via `palette.index("name")`.
2. Register it: `registry.register(id, sprite, {kind, faction, expect})`. IDs are dot-paths: `tile.grass.0`, `prop.clothesline`, `anna.walk.south.1`. Walk sets go through `registerWalkSet` so the animation group is defined consistently.
3. Run `node build.js` to inject the bundle into `index.html` (the shipped file stays single-file — never edit between the bundle markers by hand).
4. Run `node tools/test-assets.js` — it validates dimensions, palette indexes, blank frames, animation refs, and the crimson reservation.
5. Eyeball it: open `src/world/previews/preview.html`, or in-game press `` ` `` then `P` (debug only; students never see this).

## Character rules (the figure library)

- **Identity formula, in priority order: headwear → body shape → clothing color family → one accessory → stance.** Faces are hair plus two eye pixels; nothing identity-critical may live in the face. If a character needs a second accessory to read, the first one failed.
- **The tall hat belongs to the Crown.** Sprite row 0 is the shako's row: only `faction:"british"` sprites may have pixels there (tested). Combined with crimson + white crossbelts, guards carry three redundant cues — two of which survive grayscale.
- **Guards must telegraph facing** because the sight cone points where the sprite points: musket side, crossbelt X, eye pixel, and hat brim all shift with facing. Never author a guard frame with an ambiguous front.
- **Frame discipline:** feet touch row 15 in every frame; heads keep a constant top row per figure; accessories keep their anchors across frames. No frame-to-frame size wobble (tested). Idle is walk frame 0 — feet never animate while standing.
- **Animation is movement-locked.** The step frame flips on tile arrival for the player AND the guards; nothing free-runs on the clock except ambient decor (chicken/bird/smoke), which is decorative by definition and freezes under reduced motion.
- **Cast identity kit:** Anna — blue dress, cream apron + bonnet (no carried prop; the yard is busy enough). Abraham — straw hat, earth-brown coat, walking staff. Widow Foster — day cap, gray dress, basket. Mr. Hart — worn tricorn, drab coat, cane, white hair. Jonah — dark cap, green waistcoat over shirt sleeves. Brewster — tricorn, navy peacoat, rolled sleeves, rope coil; a working boatman, never pirate-coded (no eyepatch, no skulls, no oversized hat — ever).
- **Palette swaps make villagers, not clones:** one body, swapped cloth family, different accessory. Keep silhouettes distinct when two swapped villagers can appear on screen together.
- **Interaction markers** (8×8, drawn at 16px): amber diamond = usable, cream bubble = person speaks, latched bar = not yet. Paper cream + ink outline so they read over any terrain and in grayscale; slow sine bob only, pinned still under reduced motion; always above the head, always below the name label.

## Environment rules (the Setauket library)

- **Terrain-layer sprites are fully opaque.** Anything the map's legend can resolve to must cover all 256 pixels — transparent corners bleed canvas black through the bake. `tools/test-assets.js` enforces this.
- **Variants are deterministic, never random.** Grass picks its variant by `(x*7+y*13)%3`; paths pick edge treatments from neighboring path characters; water turns shallow beside sand; sand turns to wet mud at the waterline; border trees show trunks while interior trees merge into solid canopy. All rules live in `mapLegend.resolve()` and nothing re-rolls at draw time — the same ASCII always bakes the same picture.
- **Collision matches the picture.** Blocking vegetation has a solid dark mass (bush, canopy); the open gate shows posts stood aside and trampled ground, because it is walkable; a closed-looking gate over a walkable tile is a lie. Solid props (barrels, trough, woodpile, beached rowboat) register in the map's `propBlocked` set.
- **Ambient life never competes with the mission.** Critters and clutter go on tiles no route needs (the test suite keeps a list of critical tiles and fails if a prop lands on one), never adjacent to an interaction point in a way that could read as interactive, and never animate faster than a 2–3 frame idle. Reduced motion pins every ambient animation to frame 0 (`worldRenderer.ambFrame`).
- **The clothesline outranks everything.** It keeps the only bright horizontal cord in the world; nothing else may hang cream-on-grass horizontals near Anna's yard (the generic `amb.laundry` sprite exists for FUTURE distant ambience only — do not place it on this map).
- **Building identity kit:** Anna = light clapboard + cream trim + small-paned dark windows; Woodhull = split rails + tilled furrows + board-and-batten barn; Roe's tavern = dark weathered boards + amber-lit panes + a hung muted-gold sign. Amber window light means "occupied," and the tavern is the only building that gets it.
- **The shore must read as "watched" without color:** pebbled ground texture + rope posts + rocks + the translucent zone tint — grayscale-checked. Water depth is value-coded: mud → shallow (lighter, seabed dots) → deep.

## Draw order (do not improvise)

Layers, bottom to top — documented and implemented in `src/world/rendering/worldRenderer.js`:
1. base terrain → 2. shoreline/path detail → 3. ground props → 4. structure bases (1–4 are pre-baked into the terrain cache, including the static restricted-zone tint) → 5. characters (y-sorted; entities may nudge with a small `dz` offset — that's the whole depth system) → 6. tall props/foreground (reserved) → 7. world effects (dusk wash, then lantern glows) → 8. sight cones → 9. interaction labels (DOM) → 10. objective banner + HUD (DOM).
