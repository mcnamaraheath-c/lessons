# CLAUDE.md — Salem Witch Trials interactive lesson

## Project

A single-file, browser-based, ~45-minute interactive lesson on the Salem Witch Trials (1692) for an 8th grade U.S. History class (Thompson Jr. High, Panama-Buena Vista USD). It replaces a static reading-and-worksheet lesson (Day 9 of a Thirteen Colonies unit) whose core weakness was asking students to compare 1692 "evidence" to a reasonable standard of proof with no scaffolding.

**Canonical deliverable:** `salem_you_be_the_judge.html` — a linear five-case-file lesson: the student weighs the real 1692 evidence, renders a Guilty / Not guilty verdict on each accused person, then gets a scaffolded reveal, and finally a "pattern" screen comparing their verdicts to what really happened. Chosen as primary in Aug 2026: its core action — deciding whether 1692 "evidence" is really evidence — *is* the lesson objective, it is simpler to run in one period, and it needs almost no generated art.

**Kept alternative:** `salem_time_detective.html` — the "time detective" point-and-click escape room, canonical until Aug 2026. Keep it working, but no further art or content investment is planned for it (see its section below for known issues).

## History of this folder — read before touching anything

Four builds exist. Do not delete the older ones; the teacher iterated and wanted them preserved.

- `salem_you_be_the_judge.html` — **CURRENT / PRIMARY.** Five case files; student renders a verdict, then gets a scaffolded reveal (see below).
- `salem_time_detective.html` — **KEPT ALTERNATIVE.** Escape room; was primary until Aug 2026, demoted when the teacher settled on the case-file format.
- `salem_accusation_web.html` — superseded. A node-link "accusation web" timeline visualization. Well-built, but not the direction chosen.
- `salem_witch_trials.html` — superseded (oldest). A branching multi-character narrative with a stat system, modeled on the Civil War engine; scrapped for feeling like a reskin and being scoped at 2–3 days.

If work conflicts with the other builds, defer to `salem_you_be_the_judge.html`.

## The current build: "You Be the Judge"

Framing: the Court of Oyer & Terminer, 1692 — the student is the judge. Flow: **Intro (village image → overview → a four-block "Before you judge" briefing: what people believed / how it started / the afflicted girls / the judges — added Aug 2026 so students meet the afflicted girls and the belief system before Case 1 uses them → classroom image + the cheating-scandal hook) → five cases in fixed order (Sarah Good, Rebecca Nurse, Tituba, Bridget Bishop, Giles Corey) → conclusion.**

Each case file has: a tagline, one or two images with honest captions, and typed evidence items (spectral / gossip / witness / touch / physical / legal / confession), and a **Guilty / Not guilty** verdict choice. Deciding triggers the reveal: an outcome stamp, "What really happened" in plain language, and a "Would this count as proof today?" box — the scaffolding the original worksheet lacked. The conclusion screen shows a table of the student's five verdicts against the real outcomes, the confession-pattern callout (confess → live; refuse → hang; not one exception), a short "And the evidence?" wrap-up, and Think-and-Write reflection questions.

**Caption/badge policy (teacher decision, Aug 2026):** NO badge chips and NO "Real historical person" banners — the teacher found them redundant and hectoring ("slapping students in the face with THIS IS REAL"), and covers realness verbally in class. Provenance lives quietly inside the captions instead: real documents carry their date and holding archive ("The warrant for Sarah Good's arrest, February 29, 1692 … Kept today at the Massachusetts State Archives"); later artworks say so plainly ("painted in 1855 — not a real photo"; "no real picture of her exists"); the two generated intro images say "as our artist imagines it". Do not reintroduce badges, ALL-CAPS "REAL", or similar emphasis; when adding images, follow this calm caption register and keep dates + archive credits.

Machinery: same EN/ES toggle, vocab tooltips, progress dots (one per case), single offline file. State is `{language, screen, verdicts}`; content lives in the `CASES` array. Nothing can be permanently failed; verdicts can be revisited via Back.

## The kept alternative: "The Salem Files — Time Detective"

Status note (Aug 2026): the room backdrops, map, and intro in this build are AI-generated images that replaced the original CC site photos; the four CC photos are still base64-embedded but **unused**, while their credits still print on the end screen. If this build is ever revived, either display those photos again or remove them and their `PHOTO_CREDITS` entries. The description below is otherwise accurate.

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

- The unscaffolded worksheet question ("compare 1692 evidence to a reasonable standard") is now the spine of the whole activity. In the judge build, every case's "Would this count as proof today?" box walks students through *why* spectral evidence / touch tests / marks / gossip / forced confessions are not proof; in the detective build the Examination room and final reveal do the same job.
- Students act on the evidence (weigh it and render a verdict; or examine, deduce, unlock) instead of copying notes.
- The confession pattern lands as an unmissable payoff — the judge build's verdicts-vs-reality table and pattern callout, or the detective build's vault code — not a lecture.
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

There are **no authentic portraits of any of these people** — never fabricate faces. All images are genuinely licensed and **base64-embedded**.

**The judge build (primary)** embeds 14 images. On the conclusion screen, one real portrait and one more real document: the October 1711 committee report behind the reversal-of-attainder act (`reversal`, Massachusetts State Archives; it is the report, NOT the act — no clean scan of the act exists, see `img/SOURCES.md`), naming the condemned and their restitution amounts. One real portrait: Judge Samuel Sewall by John Smibert, 1729, painted from life (`sewall`, MFA Boston) — the only authentic face in the lesson, on the conclusion screen with the 1697 apology story in its caption. Two generated intro images (Midjourney, teacher-approved, Aug 2026): a winter view of Salem Village above the title and an ordinary modern classroom beside the cheating-scandal analogy — captioned "as our artist imagines it" per the caption policy above; source PNGs are in `img/`. Five real 1692 documents: Bridget Bishop's death warrant; the Sarah Holton deposition against Rebecca Nurse; the warrant for Sarah Good's arrest (`good_warrant`, Feb 29, 1692, Massachusetts State Archives); the Nurse petition with 39 signatures (`nurse_petition`, Massachusetts Historical Society); and Tituba's examination record (`tituba_exam`, p.1 of the Corwin version, New York Public Library). Five period artworks: Matteson's 1855 "Trial of George Jacobs" [`jacobs`], the 1870 Tituba illustration, the 1893 accused-woman-in-chains drawing, the 1892 Giles Corey pressing, and a woodcut of a condemned person carted to be hanged — each captioned as later art, not a photo. Captions credit each document's holding archive.

**Licensing status of the judge build:** the manuscripts and artworks are Public Domain by age; no Creative Commons material, so no attribution requirements or share-alike terms. One caveat: the three document scans added in Aug 2026 were sourced from the UVA Salem archive (salem.lib.virginia.edu), whose site terms permit free non-commercial educational use but assert a compilation copyright and require permission for other uses. Classroom use is clearly covered; **check before selling on TPT** — full provenance, source URLs, and the verbatim usage statement are in `img/SOURCES.md`. There is a historical nuance recorded there too: no single warrant names all three first accused; two same-day warrants exist (Good; Osborne + Tituba), and both scans are kept in `img/`.

**The detective build (alternative)** additionally holds AI-generated backdrops and the four unused CC site photos noted above. In the original design, room backdrops were present-day photos of the real sites, sepia/darkened/vignetted to feel period and mute modern details.

**Licensing matters here.** Period artworks/documents are Public Domain. The four site photos are Creative Commons and REQUIRE attribution — an image-credits list is embedded on the end screen and must stay:
- Salem Village Parsonage ruins — Fletcher6, CC BY-SA 3.0
- The Witch House (Jonathan Corwin House) — chensiyuan, CC BY-SA 4.0
- Salem Village Witchcraft Victims' Memorial, Danvers — Francis Helminski, CC BY-SA 4.0
- Proctor's Ledge Memorial — Jangseung92, CC BY-SA 4.0
Note the CC BY-SA "share-alike" terms if this is ever sold/redistributed (e.g., on TPT). If swapping images, keep them PD or properly attributed CC, verify licensing via the Commons API, and view each before using.

For the judge build's three 2026-added documents, source JPEGs and provenance live in the project's `img/` folder (`SOURCES.md` there is authoritative); the embedded copies are downscaled (~1000px, JPEG q70). For everything else, the base64 lives inline only — re-download from Wikimedia Commons if raw files are needed.

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

- Data-driven: in the judge build, cases/evidence live in the `CASES` array; in the detective build, rooms/hotspots/puzzles live in `ROOMS` and image credits in `PHOTO_CREDITS`. UI strings in `UI`, vocab in `VOCAB`/`VOCAB_ES`. Keep both `en` and `es` on every string.
- Hotspots use percentage x/y positions over each backdrop; labels carry the meaning (backdrops aren't purpose-drawn, so don't rely on precise feature alignment).
- **Apostrophe gotcha:** short fields are single-quoted JS strings — an apostrophe or wrong quote breaks the script. Longer body fields are double-quoted. After ANY edit, extract the `<script>` and run `node --check`, then a jsdom smoke test (localStorage needs a non-opaque origin — pass `url:"http://localhost/"`).
- **Build process for embedded images:** the HTML is authored with a `"__IMG_JSON__"` placeholder; a small Node script reads the JPEGs, base64-encodes them into an `IMG` map, and replaces the placeholder to produce the final file. jsdom availability is via the scratchpad `node_modules` (installed with `npm install jsdom --no-save`).
- Detective build only: the vault success uses a 700ms delay before advancing to the end screen — account for this in tests (wait >700ms).

## Suggested classroom use

Single ~45-minute period: intro + hook (~5 min); the five case files, solo or in pairs (~25–30 min, about 5 minutes per case); the pattern screen + reflection + discussion (~10–15 min). No multi-day structure is hard-coded.
