# Civil War Interactive Lesson — Project Context

## Who this is for
Heath teaches 7th and 8th grade History at a junior high in Bakersfield, CA. Most students read at or below 4th grade level. Significant Spanish and Punjabi speaker populations. Class periods are 45 minutes with a 5-minute bellringer block.

## What this project is
An interactive HTML lesson on the Civil War. Students play through the war as one of four historical characters making consequential decisions. End-of-year unit; will be followed by (1) a poster project and (2) a separate lighter Reconstruction lesson reusing this engine.

Working file: `civil_war_journal.html` (single self-contained file, ~5,000 lines, no external build)
Companion: `Civil_War_Field_Notes.docx` (worksheet that pairs with the lesson)

## The four characters (7 nodes each, ending at war's end April–May 1865)
- **Clara** — enslaved woman on a Georgia plantation. Has a son Eli. Branch: escape (Underground Railroad) vs stay (plantation collapse). Ends with Sherman's army arriving / Emancipation.
- **James Hollis** — 34yo East Tennessee farmer, no enslaved people. Branch: vote for secession vs against. Ends with Lee's surrender, coming home.
- **Margaret Turner** — 35yo free Black abolitionist in Philadelphia. Sister Hannah, nephew Daniel enlists in the 54th Massachusetts. Ends with Lincoln's assassination, war's end.
- **Thomas McNamara** — 22yo Ohio cavalry trooper (2nd OH Volunteer Cavalry). "Save the Union" arc that broadens through encounters with escaped enslaved people, Black Union soldiers, and Sheridan's hard war. Ends at Appomattox + Lincoln's death. Recurring characters who die: Old Sam (his horse), Charlie (Cincinnati friend), Sgt. Owens (22nd USCT).

## Stat system (current: v3 / "Option C")
Three stats with caps: **Safety 0–6, Hope 0–6, Resources 0–10**
- Spend-not-accumulate: choices cost stats more than they grant.
- **Hope decay:** −1 every 3 nodes (the war wears people down). Doesn't fire on ending nodes.
- **Safety threshold:** when Safety ≤1, the bar pulses red and a one-time **interrupt scene** plays before the next regular node. Each character has their own interrupt (Clara: slave catchers reading her name; James: home guards at midnight; Margaret: a man watching her house; Thomas: courts-martial whispers).
- SAVE_KEY is `civilWarJournal_v2` to invalidate any old saves.

## Writing voice / pedagogy preferences
- **Smooth narrative prose at 6th-grade reading level**, second-person "you" voice
- **Vary sentence openings** — DO NOT do "He says... He has... He needs..." (Heath flags this hard)
- Combine staccato sentences with subordinate clauses
- Period-accurate concrete details where they help ("walking north by the stars")
- Each character has a clear emotional arc; endings reference what comes next without forcing closure
- All English nodes have Spanish translations (in `SPANISH.nodes` and `SPANISH.interrupts`)
- Reading level should match struggling readers; vocab tooltips already wired via `VOCAB` and `VOCAB_ES`

## Aesthetic
Field journal: aged paper background, Kalam handwritten font for body, red margin line, drop caps, sepia ink-style inline SVG sketches alongside period photos. Full HUD shows Safety/Hope/Resources bars + inventory + badges.

## Architecture (data lives near top of `<script>`)
- `CHARACTERS` — id, name, tag, blurb, portrait SVG, startStats, startNode
- `NODES` — keyed by id like `clara_1`, `thomas_4`. Each has date, text, prompt, choices[], optional `isEnding`+`fate`+`historyNote`. Choice fields: text, outcome, statChange, next, optional artifact/badge/requires
- `INTERRUPTS` — same shape as NODES but no `next` (engine returns to original target)
- `IMAGES` — maps node ID → either `{type:'sketch', sketch:'name'}` or `{type:'photo', src, captionEn, captionEs, altEn, altEs}`
- `SKETCHES` — inline SVG for each named sketch (cotton_field, farmhouse, creek_crossing, cavalry_charge, burning_barn, etc.)
- `SPANISH` — full translation tree mirroring the structure
- Engine functions: `render`, `makeChoice`, `acknowledgeOutcome` (handles hope decay + interrupt routing), `applyStatChange`, etc.

## Heath's working preferences
- Specific instructions for each lesson, not rough outlines
- Straightforward answers without excessive praise or commentary about questions
- No meta-intro phrases like "quick rundown"
- For new lessons: describe slide content + recommend images, only build .pptx if explicitly asked. Worksheets and companion docs DO get built as files.
- Concise, warm, show your work, respect time

## Open issues / known bugs to investigate
(To be filled in by Heath after this session — image URL audit, stat tuning observations, interrupt timing feel, any prose flagged on read-through)

## Deliverables remaining
- Image URL audit (some Wikimedia photos may 403 — fallback is to swap to SVG sketches)
- Exit ticket (Google Form-ready) for end of simulation
- Teacher discussion guide (alternative to answer key — historical context, common misconceptions, 4–5 universal discussion questions)
- The lighter Reconstruction lesson (separate file, will reuse this engine)
