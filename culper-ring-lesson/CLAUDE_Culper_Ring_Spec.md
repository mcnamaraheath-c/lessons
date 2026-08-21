# CLAUDE.md — "Shadow War: The Culper Ring"
## Interactive Spy Mission Lesson — 8th Grade U.S. History (American Revolution Unit)

This file is the master design spec. Read it fully before writing any code. Build decisions not covered here should follow the precedents set by "Voices of the Civil War" (same developer, same student population).

---

## 1. PROJECT OVERVIEW

**What this is:** A single-file HTML interactive where students play as one of four members of the Culper Spy Ring (1778–1780) in British-occupied New York and Long Island. Students complete three espionage missions per character, using real Culper Ring tradecraft (number ciphers, invisible ink, clothesline signals, dead drops), managing a Suspicion meter, and delivering intelligence to General Washington. All four storylines converge in a shared finale: the discovery of Benedict Arnold's treason in September 1780.

**What it teaches:**
- Why intelligence mattered in the Revolution (Washington's information war vs. British military superiority)
- The mechanics and risks of the Culper Ring specifically
- The role of ordinary civilians — farmers, merchants, women — in the war
- Primary-source thinking: coded letters, conflicting reports, evaluating whether information can be trusted

**Where it fits:** Summative interactive for the American Revolution unit. Students have already covered Lexington/Concord through Saratoga. This follows the Hobbes/Locke → Declaration sequence.

**Student population (critical — shapes everything below):**
- Most students read at 4th grade level or below
- Large Spanish-speaking population; full Spanish toggle is required, not optional
- Chromebooks, sometimes old ones; possibly spotty wifi — the file must be fully self-contained
- 45-minute class periods with a 5-minute bellringer; one mission must be completable in ~30 minutes

---

## 2. TECHNICAL REQUIREMENTS

- **One single HTML file.** All CSS and JS inline. No external libraries, no CDN calls, no fonts loaded from the network (use system font stacks or embedded @font-face only if base64-embedded and small). Must open from a local file OR from GitHub Pages with zero network dependency.
- **Save/resume:** Use an in-memory state object plus a "Mission Code" system — at the end of each mission, generate a short code (base64 of compressed state) the student writes down or the teacher screenshots. Entering the code on the start screen restores progress. Do NOT rely on localStorage as the only mechanism (shared Chromebooks, cleared profiles), but you may use it as a convenience layer with the code as backup.
- **Performance:** No large images. Use inline SVG illustrations (same approach as the Civil War build). Target file size under 1.5 MB.
- **Works on:** Chrome on Chromebooks, screen widths down to 1024×600. Touch-friendly targets (44px minimum).
- **Accessibility floor:** visible keyboard focus, all interactive puzzles operable by click/tap alone (no drag-only mechanics — every drag has a click alternative), prefers-reduced-motion respected.

---

## 3. READING LEVEL & LANGUAGE RULES (NON-NEGOTIABLE)

- All student-facing text at **4th grade reading level**: sentences under 15 words where possible, common words, active voice.
- Story text arrives in **chunks of 2–3 sentences maximum** per screen before a choice or a "Continue" tap.
- **Spanish toggle** (persistent button, top-right, flag-free — just "ES / EN"): every story node, choice, puzzle instruction, tooltip, and feedback line has a Spanish mirror. Spanish should be natural Latin American Spanish, not literal translation.
- **Read-aloud button** on every text block using the Web Speech API (speechSynthesis), respecting the current language (en-US / es-US voice).
- **Vocabulary tooltips:** underlined dotted terms (spy, intelligence, cipher, Loyalist, Patriot, occupied, treason, courier, dead drop, suspicion) open a small bilingual card: word, plain-English definition (one sentence), Spanish translation, tiny SVG icon.
- Names and dates always styled distinctly (small caps or bold) so low readers can anchor on them.

---

## 4. THE FOUR PLAYABLE CHARACTERS

Character select screen shows four portrait cards (SVG portraits, consistent style with Civil War build). Each card: name, one-line hook, difficulty stars, and a "What's true?" tag noting the character is based on a real person.

### 4.1 Abraham Woodhull — "Samuel Culper" (Agent 722)
- Farmer from Setauket, Long Island. Nervous, careful, deeply afraid of being caught — his own cousin was hanged-adjacent territory; British officers are quartered near his family.
- **Play style:** Cover-story management. He travels to Manhattan "to sell produce" and must keep his story straight under questioning.
- **Arc theme:** Courage is being afraid and doing it anyway.
- **Difficulty:** ★★☆ (medium)

### 4.2 Anna Strong (Agent 355-adjacent signal operator)
- Setauket neighbor. Her husband was imprisoned by the British on a prison ship. She runs the **clothesline signal system**: a black petticoat on the line means Caleb Brewster has arrived; the number of white handkerchiefs tells which of six coves he's hiding in.
- **Play style:** Hiding in plain sight. Puzzles about observation, timing, and doing spy work while appearing to do laundry and chores in front of British soldiers.
- **Arc theme:** The war was fought in kitchens and yards, not just battlefields. Women's work made the ring function — and history barely wrote it down.
- **Difficulty:** ★☆☆ (approachable — good default recommendation for struggling readers; most visual, least text)

### 4.3 Caleb Brewster (Agent 725)
- Whaleboat captain who rows intelligence across Long Island Sound to Tallmadge in Connecticut, past British patrol ships. Bold, almost reckless — the opposite personality of Woodhull.
- **Play style:** Action and risk math. Route choices across a map of the Sound, weather, patrol timing, chase sequences (timed choice moments, not twitch gameplay).
- **Arc theme:** Speed vs. safety; his boldness protects the careful people behind him.
- **Difficulty:** ★★☆ (medium)

### 4.4 "Agent 355" — The Lady
- The code book's entry 355 means "lady." Her real identity is unknown to this day. She moves through Loyalist high society in occupied New York City, overhearing British officers.
- **Play style:** Social deduction. Conversation choices at dinners and gatherings; decide what to ask, when to stay quiet, whom to trust. Highest-stakes storyline — she operates closest to British command with no escape route.
- **Arc theme + meta-lesson:** Her chapter opens and closes with the historical mystery itself: *we do not know her name.* Students experience why some people are missing from the historical record. This is the game's most powerful history lesson — protect it in the writing.
- **Difficulty:** ★★★ (most reading, most nuance)

---

## 5. STORY STRUCTURE

### Shared Prologue (all characters, ~5 nodes)
1779. Major Benjamin Tallmadge ("John Bolton," Agent 721) recruits the player. Establishes: New York is occupied, Washington is losing the information war, one letter in the wrong hands means hanging (reference Nathan Hale, 1776 — one screen, handled seriously but not graphically). Prologue teaches the interface: how choices work, what the Suspicion meter is, how to open the code book.

### Per-Character: 3 Missions (each mission = one class period, ~30 min)

Each mission follows the same skeleton so students learn the rhythm:

**BRIEFING → TRAVEL/SETUP (choices) → TRADECRAFT PUZZLE → COMPLICATION (interrupt or branch) → DELIVERY (choices) → REPORT TO WASHINGTON (assessment checkpoint) → MISSION CODE issued**

Node budget: **12–16 nodes per mission**, 3–4 meaningful branch points each, ~40–50 nodes per character including prologue and finale. Branches reconverge at mission boundaries (diamond/foldback structure — do not let the tree explode).

### Mission Content by Character

**Woodhull:**
1. *The Produce Run* — first trip to Manhattan; British checkpoint questioning (cover-story consistency puzzle: player earlier chose details of the cover story and must repeat them correctly).
2. *Invisible Ink* — receive James Jay's "sympathetic stain"; write a report between the lines of an innocent letter; ink-reveal puzzle.
3. *The Counterfeit Plot* — discover the British are printing fake Continental dollars to destroy Patriot money; get the intel out while a suspicious officer, Colonel Simcoe, watches Setauket.

**Anna Strong:**
1. *The Signal* — learn the clothesline code; puzzle: British soldiers are watching, hang the right combination (black petticoat + correct handkerchief count) without being obvious. Timing/sequencing puzzle.
2. *Six Coves* — Brewster is coming but a patrol is near cove #3; read the shoreline map, choose the signal that redirects him safely.
3. *The Search* — soldiers search Setauket homes; hide the evidence (spot-the-risk puzzle: which items in her house would give away the ring? Interactive room scene).

**Brewster:**
1. *The Crossing* — first run across the Sound; route choice vs. weather vs. patrol schedule (resource/risk decision, Oregon-Trail-style event rolls with visible odds — teach probability honestly, no hidden dice).
2. *The Chase* — a British guard boat spots him; sequence of timed two-option choices (10-second timer, generous, pausable via accessibility setting).
3. *The Newport Warning* — July 1780: the ring learns the British plan to attack the newly arrived French fleet at Newport. Get the warning to Washington in time. Historical payoff: Washington's response helps make the British back down. This is the "your work mattered" mission.

**Agent 355:**
1. *The Dinner Party* — Loyalist society dinner; conversation tree; learn who talks too much. Teach: listening is intelligence.
2. *The Officer's Boast* — a British major hints at troop movements; extract details without asking direct questions (choice-craft puzzle: some questions raise Suspicion, some earn Intel).
3. *Something Wrong at Headquarters* — she notices an American general's name in British correspondence. She can't read the whole letter. She reports a fragment. (This feeds directly into the finale.)

### Shared Finale: "The Traitor" (all storylines converge, ~10 nodes, one class period)
September 1780. Major John André is captured near Tarrytown with plans to West Point hidden in his boot. Benedict Arnold — a hero of Saratoga — has sold out. The finale plays as a rapid intelligence assembly: the player reviews fragments gathered across their missions (the game surfaces the student's own earlier discoveries) and pieces together what Arnold gave the British and what it means. Ends with André's fate handled honestly and age-appropriately (he was hanged as a spy — the same fate every ring member risked; one somber screen, no imagery of the execution), and Washington's reaction.

**Epilogue screens (per character):** What really happened to this person. Woodhull survived the war and lived quietly. Anna Strong's family reunited. Brewster was wounded but survived, and later ran boats for the government. Agent 355: *we still don't know.* Final screen for every path: "The Culper Ring was never caught. Washington never learned all their names. Now you know them."

---

## 6. STAT SYSTEM

Three visible meters, always on screen, with icons and color coding:

| Stat | Range | Meaning | Icon |
|---|---|---|---|
| **Suspicion** | 0–100 | How closely the British are watching you | 👁 eye (SVG) |
| **Trust** | 0–100 | How much the ring relies on you | 🤝 hands (SVG) |
| **Intel** | 0–10 pieces | Intelligence delivered to Washington | 📜 sealed letter (SVG) |

Rules:
- Every choice shows NO stat preview beforehand (decisions should feel real) but shows the stat change immediately after with a one-line explanation ("The sentry remembers your face. Suspicion +15.").
- **Suspicion 100 = capture**, but capture is never game over. It triggers an **Interrogation Scene**: a tense 3-node sequence where the player must keep their cover story straight. Succeed: released, Suspicion drops to 60, mission continues on a harder branch. Fail: the character is imprisoned, and the player continues the mission as a different ring member covering for them (teaches: the ring protected each other). Never a "you died, restart" screen.
- Suspicion decays slightly (−5) between missions if the player chose "lay low" options.
- Trust gates optional content: high Trust unlocks a bonus scene per mission (a personal moment with another ring member — this is where character warmth lives).
- Intel count determines the finale's detail level and the ending summary.

---

## 7. TRADECRAFT PUZZLES (the escape-room DNA)

All puzzles must be **historically real mechanics**, click/tap operable, with a hint button (hint use is tracked but never punished visibly).

### 7.1 The Culper Code Book
An in-game reference the player can open anytime (book icon, slides in from the side). Use these commonly cited real code assignments:
- 711 = General Washington
- 721 = John Bolton (Tallmadge)
- 722 = Samuel Culper (Woodhull)
- 723 = Culper Jr. (Townsend)
- 724 = Austin Roe
- 725 = Caleb Brewster
- 727 = New York
- 728 = Long Island
- 729 = Setauket
- 355 = lady
- Plus ~15 common words used in puzzles (attack, ships, troops, soon, guns, etc. — assign plausible three-digit codes and keep them internally consistent across all missions)

**Decode puzzle:** the player receives a numbered message ("711 must know: 727 ships move to 728") and rebuilds it by tapping code numbers → the decoded words fill in. Difficulty scales: mission 1 messages are 4–5 words; finale messages are 10–12 words.

**Encode puzzle (harder, optional):** player writes a report by choosing words, and must replace the dangerous words with numbers before sending. Sending an unencoded name = big Suspicion spike (teach through consequence).

### 7.2 Invisible Ink ("Sympathetic Stain")
An innocent-looking letter fills the screen. Player "brushes the reagent" by tapping/dragging across the paper; hidden lines fade in between the visible lines. Include one decoy letter with nothing hidden (teach: verify before trusting). Historical note shown after: the stain was invented by James Jay, John Jay's brother, and needed a special chemical to reveal — heat alone wouldn't work. Washington called it "the medicine."

### 7.3 Clothesline Signals (Anna's missions)
Interactive clothesline: player hangs items by tapping slots. Black petticoat = "Brewster is here." Count of white handkerchiefs (1–6) = which cove. Puzzles give a scenario ("Brewster waits at the cove by the tall rocks — cove 4 — and a patrol walks past at noon") and the player must produce the correct line at the correct time.

### 7.4 Dead Drops & Routes
Simple map interactions: choose where to leave a message (Roe's tavern box vs. a fence post vs. hand delivery), or chart Brewster's route across the Sound. Each option displays honest tradeoffs in plain language before choosing.

### 7.5 Spot the Risk (Anna mission 3)
An SVG room scene; player taps items that could expose the ring before soldiers finish searching (code book on the table, reagent bottle, a letter half-burned). 5 items, ~90 seconds, pausable.

---

## 8. INTERRUPT SCENES

Sudden full-screen events with a distinct visual treatment (darker palette, faster text), same mechanism as the Civil War build:
1. **The Checkpoint** (any Woodhull travel node, once): Simcoe's Rangers stop the wagon.
2. **The Prison Ship** (Anna, between missions 1–2): a letter arrives about her husband aboard HMS Jersey. No choice — a character moment. Keep it short and honest; prison ships killed more Americans than battles did.
3. **News of Arnold** (all characters, triggers the finale).

---

## 9. ASSESSMENT — "REPORT TO WASHINGTON"

End of every mission: the student composes a short intelligence report using a scaffolded CER-lite builder:
- **Claim:** choose one sentence from three options ("The British plan to ___")
- **Evidence:** select 2 evidence cards from what they found this mission (their actual discoveries — wrong/irrelevant cards are mixed in)
- **Reasoning:** sentence-starter with a typed completion, 1–2 sentences, with a Spanish starter available ("This matters because… / Esto importa porque…")

The report is "sealed and sent" with a wax-seal animation. At game end, a **Debrief screen** compiles all reports + choice history + Intel score into a formatted summary with a copy button and a print-friendly view — this is what students submit. No backend, no data leaves the page.

---

## 10. VISUAL DESIGN DIRECTION

- **Concept: candlelight and ciphers.** Palette drawn from the ring's own materials — deep midnight blue-black (night crossings, #1a2332 territory), aged paper cream, candle-flame amber as the single accent, faded redcoat crimson used ONLY for British/danger elements so the color itself becomes a warning the students learn to read.
- Typography: a characterful but highly legible display face treatment for headers (system serif stack styled with letter-spacing; no external fonts), clean humanist sans for body at generous size (18px minimum body on Chromebook screens).
- **Signature element:** the code book. Its slide-in panel, its numbers, and the decode interaction should be the thing students remember. Spend the polish budget there.
- Paper textures via subtle SVG filters, not image files. Wax seal motif for completed missions.
- Keep motion minimal: text fade-ins, the ink reveal, the seal press. Respect prefers-reduced-motion.
- UI copy: plain verbs ("Send the report," "Hang the signal"), consistent names for actions across all four storylines.

---

## 11. HISTORICAL ACCURACY GUARDRAILS

- Real people are portrayed respectfully and in line with the documented record; where the record is silent (dialogue, daily details), invent plausibly and mark it: the epilogue includes a **"Real vs. Imagined"** screen per character listing 3 things in the game that are documented and 2 things that were invented for the story.
- Agent 355's identity stays unknown. Do not assign her a name, romance, or fate. The mystery is the lesson.
- Violence: referenced, never depicted. Hale's and André's executions are stated in one plain sentence each. Prison ships described honestly but without graphic detail.
- Enslaved people existed in this world; occupied New York and Long Island farms included enslaved and free Black people. Include at least one documented-context supporting character (e.g., a free Black ferryman or tavern worker) written with dignity and agency — consult the record via research before writing; do not invent stereotypes.
- No glorifying spycraft as consequence-free: the Suspicion system and interrogation scenes exist to make the danger real.

---

## 12. BUILD PHASES (work in this order)

1. **Engine pass:** Port/adapt the node engine, stat system, language toggle, and read-aloud from the Civil War build. Get one dummy mission running end to end with save codes.
2. **Prologue + Anna Mission 1** (simplest storyline) fully written EN/ES, with the clothesline puzzle. Playtest checkpoint — stop here for teacher review before writing the other 11 missions.
3. Code book + decode puzzle component (used everywhere — build once, reuse).
4. Remaining missions in order: Woodhull, Brewster, 355.
5. Finale + epilogues + Debrief/assessment compiler.
6. Accessibility + Spanish QA pass: every node read in both languages, every puzzle keyboard-operable.
7. File-size and Chromebook performance pass.

**After each phase, write a short note in a `BUILD_LOG.md` describing what was built, what's stubbed, and any open questions for Heath.**

---

## 13. OUT OF SCOPE (do not build unless asked)

- Multiplayer or shared state of any kind
- Accounts, servers, analytics
- Audio files (speech synthesis only)
- A teacher dashboard (the Debrief copy/print output is the deliverable)
