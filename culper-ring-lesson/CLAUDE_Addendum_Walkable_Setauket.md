# CLAUDE.md ADDENDUM — Walkable World Pilot: "Setauket, 1779"
## Append to the Shadow War: Culper Ring spec. This addendum governs the movement layer only.

**Scope of this addendum:** Convert ONE mission — Anna Strong, Mission 1 (*The Signal*) — from menu-based scene selection into a small walkable town map. The existing node engine, stat system, language toggle, read-aloud, and puzzles are unchanged; the map replaces only the "choose where to go" layer. If this pilot succeeds, the pattern extends to other missions. Do not build movement into any other mission until told to.

---

## 1. ARCHITECTURE PRINCIPLE

**The story engine is the brain. The map is the skin.**

- All dialogue, choices, puzzles, and stat changes continue to run through the existing node system, displayed in the existing dialogue overlay (with ES/EN toggle and read-aloud intact).
- The map's only jobs: (a) let the student walk between locations, (b) trigger nodes when the student interacts with people/objects, (c) create light spatial tension via guard sightlines.
- When a dialogue/puzzle overlay is open, the world is paused. No real-time pressure while reading. Ever.

---

## 2. RENDERING & GRID

- **HTML5 Canvas 2D**, single canvas element.
- **Logical resolution: 640×480** (20×15 tiles at 32px). Scale the canvas to fit the window with integer scaling where possible, `image-rendering: pixelated`.
- **Fixed camera. No scrolling.** The whole map fits on one screen. This kills an entire class of bugs and keeps students oriented. (Scrolling camera is explicitly out of scope for the pilot.)
- **Tile size: 32×32.** Grid-locked movement — the character occupies exactly one tile, moves one tile per input, with a ~140ms tween between tiles. Input buffering: holding a direction key queues continuous movement.
- Target 60fps but design for 30fps Chromebooks: no per-frame allocations, draw only dirty regions or keep the draw loop trivially cheap (a 20×15 tile blit is fine to redraw fully).

---

## 3. MAP DATA FORMAT

Maps are ASCII string arrays in the JS source with a legend — human-readable, easy for Claude Code (and Heath) to edit:

```js
const SETAUKET = [
  "TTTTTTTTWWWWTTTTTTTT",
  "T..g....WWWW....d..T",
  "T..HHH..~~~~..HHH..T",
  "T..HAH...bb...H.H..T",
  // ... 15 rows total
];
// LEGEND
// T tree (block)   W water (block)   ~ shoreline (walk)
// H house wall (block)   . grass (walk)   b dock boards (walk)
// A = Anna's yard door (interact→enter yard scene)
// g = guard spawn   d = dock interact point
```

- Two layers only: **terrain** (the ASCII map) and an **entities list** (NPCs, interactables, trigger tiles) defined as objects: `{id, x, y, sprite, facing, nodeId, label_en, label_es, patrol?: [...]}`.
- Collision = a Set of blocking tile characters. Nothing fancier.

---

## 4. SPRITES & ART

- **Programmatic pixel art, no image files.** Each sprite is a 16×16 array of palette indices rendered once to an offscreen canvas at load, then blitted. Draw characters at 16×16 scaled to 32×32 (chunky, readable, era-appropriate charm).
- Shared palette from the main spec (midnight blue, paper cream, candle amber, redcoat crimson reserved for British).
- **Player (Anna):** 4 facings × 2-frame walk cycle = 8 frames. Idle = frame 1 of facing.
- **NPCs:** single facing frame each is acceptable for the pilot (villager, British soldier ×2, Abraham Woodhull, Caleb Brewster at the dock).
- **Redcoat rule from the main spec applies spatially:** British soldiers are the only crimson sprites on the map. Students should be able to read danger by color at a glance.
- Environment tiles: grass, tree, water (2-frame shimmer), dirt path, house walls/roofs, dock, the clothesline (distinct, visible from anywhere — it's the mission's landmark).

---

## 5. CONTROLS

Must be fully playable with EITHER keyboard or touch alone:

- **Keyboard:** Arrow keys / WASD to move. **E / Space / Enter** to interact with the faced tile. Esc opens the pause menu (resume, language, mission code, how-to-play).
- **Touch/trackpad:** On-screen D-pad (bottom-left, 44px+ buttons, semi-transparent) and an **Interact button** (bottom-right) that lights up when interaction is available. Also: tapping an adjacent interactable tile triggers interaction directly.
- **First-run overlay** teaches controls in ≤2 screens (EN/ES), skippable, re-openable from pause menu.
- No diagonal movement. No held-key interact. No double-tap gestures.

---

## 6. INTERACTION MODEL

- Interactables (NPCs, the clothesline, doors, the dock) get a floating indicator: a small bobbing **name label** when the player is within 1 tile and facing them (e.g., "Clothesline / Tendedero" — bilingual, follows the current language setting). Labels are the wayfinding system; low readers navigate by proximity prompts, not by reading a quest log.
- Pressing Interact opens the existing dialogue overlay and runs the linked node. On overlay close, control returns to the map, player keeps position/facing.
- **Trigger tiles** (invisible): stepping on them fires a node once (e.g., stepping onto the dock road while a patrol is near triggers the checkpoint interrupt). Track fired triggers in state.
- A small **objective banner** (top of screen, one line, bilingual, read-aloud button): "Hang the signal before noon. / Cuelga la señal antes del mediodía." Always exactly one current objective.

---

## 7. GUARDS & SUSPICION ON THE MAP

Light spatial stealth — tension without twitch skill:

- 2 guards with **deterministic patrol loops** (fixed waypoint lists, tile-by-tile, same speed as the player). No randomness, no chasing.
- Each guard has a **visible sight cone**: 3 tiles straight ahead, rendered as a soft translucent wedge so students can SEE the rule. If the player is inside a cone while in a flagged "restricted" zone or while carrying flagged contraband state, trigger a caught-node: Suspicion +10 and a short dialogue ("What are you doing near the dock, ma'am?") with a choice — this reuses the interrogation logic, it is never instant failure.
- Standing in a cone in normal areas doing normal things = nothing. Guards are dangerous in context, not everywhere. The game states this rule plainly in the first-run overlay.
- Reduced-motion / accessibility setting "Calm patrols": guards pause 2s at each waypoint, cones dim but stay visible.

---

## 8. STATE, SAVE CODES, INTEGRATION

- Extend the existing state object with `{map: {x, y, facing, firedTriggers[], guardPhase}}`. Mission codes from the main spec must serialize map state too, so a student can resume mid-map next class.
- HUD from the main spec (Suspicion / Trust / Intel) stays on-screen above the canvas at all times.
- The mission's existing node graph is refactored minimally: "travel" nodes are deleted; their destination nodes become entity `nodeId`s on the map. Story content text is otherwise untouched.

---

## 9. ACCESSIBILITY & LANGUAGE (map-specific rules)

- All reading remains inside the paused dialogue overlay — the map itself contains no essential prose beyond bilingual labels and the one-line objective banner.
- `prefers-reduced-motion` or the in-game toggle: movement becomes instant tile steps (no tween), water shimmer stops, label bobbing stops.
- Interact is never timing-dependent. Nothing on the map requires reaction speed; guard cones move at walking pace and pause when any overlay is open.
- Colorblind consideration: British soldiers are distinguished by crimson AND a tall-hat silhouette; restricted zones are marked by both tint and a rope/post tile border.

---

## 10. THE PILOT MAP: SETAUKET (20×15)

Content-dense, no dead space — every screen quadrant has a purpose:

- **NW:** Anna's house + yard with the **clothesline** (mission centerpiece).
- **NE:** Woodhull's farm (talk to Abraham — story beats, Trust scene).
- **S:** The shoreline and **dock** (Brewster arrival point; restricted zone patrolled by guards).
- **Center:** The road and village well — villager NPCs with one-line ambient dialogue (bilingual, flavor + hints, e.g., "Soldiers watch the docks at midday." / "Los soldados vigilan el muelle al mediodía.").
- **E:** Roe's tavern exterior (door interact = foreshadow node for later missions; locked content, friendly "not yet" message).
- Mission flow on this map: talk to Abraham → learn Brewster is coming → observe guard patrol → hang the correct signal on the clothesline (existing clothesline puzzle) → reach the dock or signal from the yard depending on choice → mission Report to Washington overlay → mission code.

Walking distance check: no two objectives more than ~10 tiles apart. Total forced walking across the whole mission under 90 seconds; the other ~28 minutes is content.

---

## 11. BUILD PHASES (pilot)

1. **Engine:** canvas boot, tile renderer, ASCII map loader, collision, player movement with tween + buffering, D-pad. Debug mode: backtick toggles grid overlay + noclip + node-jump menu.
2. **Entities:** NPC rendering, facing-based interact, floating bilingual labels, trigger tiles, objective banner.
3. **Integration:** wire dialogue overlay open/close/pause, HUD persistence, state + mission-code serialization.
4. **Guards:** patrol loops, visible cones, caught-node hookup, Calm Patrols setting.
5. **Content:** build the Setauket map + all entity nodes for Anna Mission 1; ambient villager lines EN/ES.
6. **QA pass:** touch-only playthrough, keyboard-only playthrough, reduced-motion playthrough, 1024×600 window, throttled CPU (Chrome DevTools 6× slowdown must stay playable).

Write findings to BUILD_LOG.md after each phase, including anything about the movement layer that felt like wasted student time — that's the pilot's key question.

## 12. OUT OF SCOPE FOR THE PILOT

- Scrolling camera, multiple maps, map transitions
- Pathfinding, guard chasing, any AI beyond fixed loops
- Free/pixel movement or physics
- Inventory UI (state flags only), day/night cycle, weather
- Audio files (Web Speech read-aloud only)
- Converting any mission other than Anna Mission 1
