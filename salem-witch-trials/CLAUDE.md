# CLAUDE.md — Salem Witch Trials interactive lesson

## Project

A single-file, browser-based, ~45-minute interactive lesson on the Salem Witch Trials (1692) for an 8th grade U.S. History class (Thompson Jr. High, Panama-Buena Vista USD). It replaces a static reading-and-worksheet lesson (Day 9 of a Thirteen Colonies unit) whose core weakness was asking students to compare 1692 "evidence" to a reasonable standard of proof with no scaffolding.

**Canonical deliverable:** `salem_time_detective.html` — a "time detective" point-and-click escape room. This is the current, preferred build.

**Kept alternative:** `salem_you_be_the_judge.html` — a linear case-file version the teacher also liked. Same historical content and the same core "is this really evidence?" move, without the escape-room framing. Keep it working; it's a lighter/simpler option for days when the full escape room is too much.

## History of this folder — read before touching anything

Four builds exist. Do not delete the older ones; the teacher iterated and wanted them preserved.

- `salem_time_detective.html` — **CURRENT / PRIMARY.** Escape room (see below).
- `salem_you_be_the_judge.html` — **KEPT ALTERNATIVE.** Five case files; student renders a verdict, then gets a scaffolded reveal.
- `salem_accusation_web.html` — superseded. A node-link "accusation web" timeline visualization. Well-built, but not the direction chosen.
- `salem_witch_trials.html` — superseded (oldest). A branching multi-character narrative with a stat system, modeled on the Civil War engine; scrapped for feeling like a reskin and being scoped at 2–3 days.

If work conflicts with the older two files, defer to `salem_time_detective.html`.

## The current build: "The Salem Files — Time Detective"

Framing: the student is a time detective sent back to 1692 to find out *how* the panic happened and crack the code that sends them home. Chosen constraints (all honored): **fresh escape room, no timer, content-derived puzzles, multiple location rooms, real historical images.**

Flow: **Intro briefing → Map of Salem (4 clickable locations) → each location is a point-and-click scene → solve all 4 → "The Way Home" vault → payoff + reflection.**

Each location has a real image backdrop, **glowing labeled hotspots** (deliberately NOT hidden — no pixel-hunting, an accessibility requirement for this population), popup "examine" modals, and one content-derived puzzle with a hint button. Solving a room drops a fact into the **Detective's Notebook**.

The four rooms and their puzzles:
1. **The Parsonage** (parsonage ruins photo) — Tituba, the first fits, the first warrants. Puzzle: how many did it begin with? → **3**.
2. **The Examination Room** (Witch House photo) — the 4 "proofs": spectral evidence, touch test, the body/witch's-mark search, and the real Nurse deposition. Puzzle: how many would count as real evidence today? → **0**.
3. **The Jail** (Danvers memorial shackle-and-chains photo) — prisoners Sarah Good, Tituba, Giles Corey, Rebecca Nurse, plus Bridget Bishop's real death warrant. Puzzle: what decided who lived/died? → **confessing**.
4. **Gallows Hill** (Proctor's Ledge memorial photo) — the totals, the first execution, how it ended. Puzzle: how many were hanged? → **19**.

**Final vault = the lesson.** A 3-dial lock whose combination is **3 · 19 · 0** ("it began with 3, it killed 19, and 0 of the dead had confessed"). Opening it reveals the pattern in plain terms (confess → live; tell the truth → possibly hang; the "evidence" was never real) and ties back to the classroom cheating-scandal hook, then the reflection questions.

## Why this format (fixes the original lesson's failures)

- The unscaffolded worksheet question ("compare 1692 evidence to a reasonable standard") is now the spine of the whole activity. The Examination room and the final reveal walk students through *why* spectral evidence / touch tests / marks / gossip / forced confessions are not proof.
- Students act on the evidence (examine, deduce, unlock) instead of copying notes.
- The confession pattern lands as an unmissable payoff (the vault code literally encodes it), not a lecture.
- The cheating-scandal hook is the on-ramp and returns at the end.

## Student population — design constraints, not suggestions

- Predominantly below grade level; many read at 4th grade or lower.
- Significant Spanish- and Punjabi-speaking populations.
- Low-socioeconomic; no assumed background knowledge of colonial New England, Puritanism, or courts.
- Short sentences, common vocabulary in all text. Period terms get tooltips (list below). Puzzles are number/selection based (low reading load), every puzzle has a hint, nothing can be permanently failed, and all clickable objects are clearly marked.

## Reused engine machinery (from `civil_war_journal.html`)

Reference: `/mnt/c/Users/User/OneDrive/Desktop/civil-war-lesson/`.
- **EN/ES toggle:** `state.language`, `localStorage` persistence, all content as `{en, es}` objects, one `UI` string table, a `T()` helper.
- **Vocab tooltips:** the `wrap()` auto-tagger + `.vocab`/`.tooltip`/`.es` CSS (bilingual, 🌐 second-language line). Spanish has its own `VOCAB_ES` keys.
- Single-file, no build step, offline-capable.
Do NOT reuse the journal visual style or stat/branching UI. The escape room has its own dark "detective dossier" identity (parchment map, glowing hotspots, notebook drawer, vault). Punjabi was not added (not requested); the `{en,es}` structure makes a third language mostly translation work.

## Images — already sourced, verified, embedded (do not re-fetch casually)

There are **no authentic portraits of any of these people** — never fabricate faces. All images are genuinely licensed and **base64-embedded** (the file is ~4.4 MB as a result; that's expected). Two are real 1692 documents (Bridget Bishop's death warrant; the Sarah Holton deposition against Rebecca Nurse). Others are period artworks (Matteson's 1853 painting, the 1892 Giles Corey pressing, the 1870 Tituba illustration, etc.) — each captioned as later art, not a photo. Room backdrops are present-day photos of the real sites, sepia/darkened/vignetted to feel period and mute modern details.

**Licensing matters here.** Period artworks/documents are Public Domain. The four site photos are Creative Commons and REQUIRE attribution — an image-credits list is embedded on the end screen and must stay:
- Salem Village Parsonage ruins — Fletcher6, CC BY-SA 3.0
- The Witch House (Jonathan Corwin House) — chensiyuan, CC BY-SA 4.0
- Salem Village Witchcraft Victims' Memorial, Danvers — Francis Helminski, CC BY-SA 4.0
- Proctor's Ledge Memorial — Jangseung92, CC BY-SA 4.0
Note the CC BY-SA "share-alike" terms if this is ever sold/redistributed (e.g., on TPT). If swapping images, keep them PD or properly attributed CC, verify licensing via the Commons API, and view each before using.

Source JPEGs were downloaded to the scratchpad `img/` folder during the build; the base64 lives inline in the HTML. The raw source images are NOT saved in the project folder — re-download from Wikimedia Commons if you need them.

## Vocabulary for tooltips

spectral evidence, afflicted, magistrate, confession, touch test, petition, gallows, plea, hysteria (plus examination, recant, indictment, acquitted as needed in the alternative build).

## Historical content (verified — use these facts)

- The five people featured: **Sarah Good** (poor beggar; refused; hanged Jul 19, 1692), **Rebecca Nurse** (71, respected, 39-name petition; jury reversed to guilty; refused; hanged Jul 19), **Tituba** (enslaved; confessed under pressure, named others; survived), **Bridget Bishop** (tavern-keeper; refused; first executed, Jun 10), **Giles Corey** (refused to enter a plea; pressed to death over two days, Sept — state factually, do not dramatize).
- Evidence types used: spectral evidence; touch test; witness testimony/gossip; physical "witch's marks"; confession.
- **Confession pattern (core):** every accused person who confessed was spared; all 19 who were hanged had maintained innocence. The vault code encodes this.
- **Totals:** 200+ accused; 19 hanged; 1 pressed to death; 5+ died in jail.
- **How it ended:** spectral evidence ruled out (Oct 1692); court dissolved, pardons by May 1693; Samuel Sewall publicly apologized in 1697; names cleared and restitution paid in 1711.

## Tone and content guardrails

- Executions and Corey's death: factual, sober, real — never dramatized for shock.
- Every person is real; do NOT invent dialogue, inner thoughts, or motivations. Evidence text is adapted into plain English from real 1692 records; the intro says so.
- Villains are a legal process and a climate of fear, not cartoon evil. Magistrates believed, within their worldview, they were protecting the town. Preserve that.

## Technical notes for future edits

- Data-driven: rooms/hotspots/puzzles live in the `ROOMS` array, UI in `UI`, image credits in `PHOTO_CREDITS`, vocab in `VOCAB`/`VOCAB_ES`. Keep both `en` and `es` on every string.
- Hotspots use percentage x/y positions over each backdrop; labels carry the meaning (backdrops aren't purpose-drawn, so don't rely on precise feature alignment).
- **Apostrophe gotcha:** short fields are single-quoted JS strings — an apostrophe or wrong quote breaks the script. Longer body fields are double-quoted. After ANY edit, extract the `<script>` and run `node --check`, then a jsdom smoke test (localStorage needs a non-opaque origin — pass `url:"http://localhost/"`).
- **Build process for embedded images:** the HTML is authored with a `"__IMG_JSON__"` placeholder; a small Node script reads the JPEGs, base64-encodes them into an `IMG` map, and replaces the placeholder to produce the final file. jsdom availability is via the scratchpad `node_modules` (installed with `npm install jsdom --no-save`).
- The vault success uses a 700ms delay before advancing to the end screen — account for this in tests (wait >700ms).

## Suggested classroom use

Single ~45-minute period: intro + hook (~5 min); the four rooms, solo or in pairs (~25–30 min); vault payoff + reflection + discussion (~10–15 min). No multi-day structure is hard-coded.
