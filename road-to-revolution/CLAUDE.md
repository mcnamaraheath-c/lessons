# Road to Revolution — Interactive Lesson Build (7th Grade U.S. History)

**How to use this file:** Save it as `CLAUDE.md` in a new project folder. Copy `salem_witch_trials_interactive_lesson.html` and `Day2_Salem_Response_Sheet.docx` into the same folder as reference templates. Then open Claude Code in that folder and send this first message:

> Read CLAUDE.md. Study the Salem HTML and response sheet as the style and structure template. Then build Day 2 only (`day2_three_sides_stamp_act.html` + `Day2_Response_Sheet.docx`). Stop and show me before starting Day 3.

---

## Who this is for

7th grade U.S. History. Most students read below grade level; many are English learners. Every reading and task must be scaffolded *in the material itself* — inline gloss boxes for hard words, sentence frames for every written response, word banks, short chunks, cognates called out where they help (Spanish). Never assume a student will look something up or ask.

## The classroom model (hard constraints — do not negotiate these)

1. **Hybrid screen + paper.** Students READ, LOOK, and CLICK on Chromebooks. All student WRITING happens on a printed paper response sheet. No text inputs, textareas, or on-screen typing for student answers anywhere in any HTML file.
2. **One self-contained HTML file per lesson.** No external CSS/JS, no frameworks, no build step, no fetch calls. Teacher posts the file to Google Classroom; students download and open it in Chrome.
3. **No localStorage / sessionStorage / cookies / window.storage.** Progress lives in an in-memory `state` object and is lost on refresh. Each file tells students to finish in one sitting.
4. **One double-sided response sheet per student per lesson** (Word .docx). Nothing else prints. Include a one-page teacher page at the front with a cold-run pacing guide and answer key.
5. **45-minute lessons.** Pace every part to fit, with a minute estimate per part on the teacher page.
6. **Images only from Wikimedia Commons, public domain, primary sources preferred.** Use direct `https://upload.wikimedia.org/wikipedia/commons/thumb/<a>/<ab>/<File_Name>/<width>px-<File_Name>` hash-path URLs. `Special:FilePath` redirect URLs do NOT render — never use them. Every `<img>` must have `onerror="imgFail(this)"` and every activity must be fully completable if images never load.
7. **Sync rule.** Any number, label, or question that appears on both the screen and the paper sheet (proposal numbers, box labels, reflection question numbers) must match exactly. When you change one, change the other in the same commit.
8. **Content is original.** Rewrite all readings, proposals, and arguments in plain language at roughly a 4th–5th grade reading level. Do not copy text from any published curriculum. Proposals may keep their historical meaning but should be phrased simply.

## Reuse from the Salem template

- Overall look and feel, top nav with per-part completion markers, part-by-part gating, and the `imgFail()` handler.
- Fill-in-blank word-choice syntax and the completion logic pattern (a part is complete when all its click interactions are done, and the "I wrote this on my paper" checkbox for each written task is checked).
- Response sheet layout: teacher page first, then the student sheet designed to print double-sided on one page.

Swap the wax-seal motif for something fitting this unit (e.g., a quill/ink seal or a delegate's ribbon). Keep it small and unfussy.

## Unit structure (only the HTML days are built here)

| Day | Lesson | Built here? |
|---|---|---|
| 1 | Choose Your Destiny — identity cards (paper, existing) | No — but see the ledger strip below |
| 2 | Three Sides + the Stamp Act | **Yes** |
| 3 | Stamp Act Congress (Live or Self-Paced) | **Yes** |
| 4 | Boston Massacre — Pelham vs. Revere (teacher's own lesson) | No |
| 5 | Townshend/Tea Act opener + Boston Tea Party (teacher's own lesson) | No |
| 6 | Intolerable Acts + 1774 bridge | **Yes** |
| 7 | Lexington, Concord & Thomas Paine | **Yes** |
| 8 | Second Continental Congress (Live or Self-Paced) | **Yes** |
| 9+ | Declaration of Independence (teacher's existing paper days) | No |

**Build order:** Day 2 → Day 3 → Day 6 → Day 7 → Day 8. Build one day at a time, both files, then stop for review. Do not start the next day until told to.

### Student identities (from Day 1, referenced on every day)

Each student has an identity card with a colonial job, a salary in pounds, a home colony, and a political side: **Patriot**, **Loyalist**, or **Neutralist**. Screens should address the student as a colonist ("As a printer in New Jersey, you would…"). Never assume a specific job; give examples that cover several jobs.

### The ledger strip (replaces all fake money)

A small paper strip stapled to the identity card. Build it as a one-off half-page .docx (`Ledger_Strip.docx`, 4 strips per page to cut apart) during the Day 2 build. Rows:

| | Pounds |
|---|---|
| My salary | ______ |
| Stamp Act (Day 2) | − ______ |
| Townshend Acts (Day 5) | − ______ |
| Tea Act (Day 5) | − ______ |
| Intolerable Acts — Boston port closed (Day 6) | − ______ |
| What I have left | ______ |

The HTML on Days 2 and 6 tells students what to subtract (a flat, simple number per act — keep the math to single-digit subtraction). Days 5's deductions are teacher-led, so print them on the teacher page of the Day 6 packet as a reminder.

---

## Day-by-day specifications

### Day 2 — Three Sides + the Stamp Act
`day2_three_sides_stamp_act.html` · `Day2_Response_Sheet.docx` · `Ledger_Strip.docx`

Objective (student-facing): *I can explain what Patriots, Loyalists, and Neutralists believed, and describe the Stamp Act.*

Screen parts:
1. **Meet the three sides.** One card each: Patriot, Loyalist, Neutralist. Three or four short sentences per card, one gloss box per card (e.g., *loyal*, *independence*, *neutral* — note the Spanish cognates). One public-domain image per side if a good one exists; otherwise a simple icon drawn in CSS.
2. **Who would say it?** Ten short statements. Student taps Patriot / Loyalist / Neutralist for each; immediate feedback with a one-line explanation. Part completes when all ten are answered (wrong answers may be retried).
3. **The Stamp Act, 1765.** Plain-language explanation in three chunks: what it taxed (paper items — newspapers, legal papers, playing cards), why Parliament passed it (war debt from the French and Indian War), and the colonists' objection (no representatives in Parliament). Gloss boxes for *Parliament*, *tax*, *represent/representation*, *repeal*. Image: a Stamp Act tax stamp (Wikimedia has period proof stamps).
4. **Who did it hit?** Four job examples (printer, lawyer, farmer, merchant). Student taps "hit hard / hit a little / barely noticed" for each; feedback explains why.
5. **Pay the tax.** Screen shows the flat Stamp Act deduction and tells students to fill ledger row 1 on paper. Checkbox: "I filled in my ledger."
6. **Write it down.** Lists the two paper tasks (below) with "I wrote this on my paper" checkboxes.

Paper (front): three-column organizer for the sides — for each: *They wanted…*, *They believed…*, one statement from Part 2 copied in. Word bank included.
Paper (back): Stamp Act 3-box summary (what / why / colonists' response) with frames; one response: *"I think the Stamp Act was fair / unfair because ____. A ____ (job) would feel ____ because ____."*

### Day 3 — Stamp Act Congress
`day3_stamp_act_congress.html` · `Day3_Response_Sheet.docx`

Objective: *I can argue for or against a proposal and vote as a delegate.*

**Opening screen: mode select.** Two large buttons — **Live Congress** and **Self-Paced Congress**. The teacher tells students which to press. Both modes share the same proposal data; keep it in one JS array so content is edited in one place.

**Five proposals** (plain-language versions; keep the numbering identical on paper):
1. No taxation without representation.
2. Trial by jury is a right of all British citizens.
3. We will not obey the Stamp Act.
4. We will stop buying British goods. (gloss: *boycott*)
5. Parliament must repeal the Stamp Act. (gloss: *repeal*)

Each proposal card has: the proposal, a two-sentence "what this means," one gloss box, an **argument bank** of 6 short Patriot lines and 6 short Loyalist lines (one sentence each, concrete, at student level), and 4 Neutralist **question stems** ("What would happen if…", "How would this affect…", "Why should we trust…", "Isn't it true that…").

Historical outcome for every proposal: all five passed at the real Stamp Act Congress (October 1765, New York) and were sent to Britain in the Declaration of Rights and Grievances; the Stamp Act was repealed in March 1766.

**Live mode flow:**
- *Briefing (target 15 min):* student sees only their assigned proposal (they tap the number the teacher gives them) and their side (tap Patriot / Loyalist / Neutralist). Patriots and Loyalists tap two reasons from the bank; the screen assembles a model speech from a frame ("Fellow delegates, I am a [side]. We should vote [yes/no] on Proposal [#] because [reason 1]. Also, [reason 2]. Vote [yes/no]!") which they copy to paper. Neutralists tap a stem and the screen shows it with a blank to finish on paper. Checkbox: "I wrote my speech/question on my paper."
- *Congress Board (target 25 min):* a separate full-screen view meant for the teacher's projector, reachable from a "Teacher: open Congress Board" link. For each proposal: proposal in large text, a 30-second countdown button for each speaker (Patriot → Loyalist → Neutralist question), then Yea / Nay tally buttons the teacher taps while counting hands, pass/fail result, running score (Patriots +1 if passed, Loyalists +1 if failed; ties fail). No parliamentary motions — the board's order of speakers replaces "I move / I second." Final screen: class result vs. 1765 result.
- *After (5 min):* students record votes and answer paper reflection.

**Self-paced mode flow:** for each proposal in order — read the card, read the strongest 3 Patriot lines and 3 Loyalist lines side by side, tap Yea or Nay, tap the two reasons that convinced you, then the historical result is revealed with one line of "what happened next." Progress marker per proposal. Final screen compares the student's five votes to 1765.

Paper (front): speech/question frame with blanks; vote tracker for proposals 1–5 (Yea/Nay boxes + "Passed / Failed"). The same sheet serves both modes — in self-paced mode the speech frame becomes "my strongest reason," and the sheet says so.
Paper (back): two reflection questions with starters and a word bank: (1) *Which proposal was hardest to decide? I think ____ because ____.* (2) *In 1765 all five passed. Our congress ____. I think this is because ____.*

### Day 6 — Intolerable Acts + 1774
`day6_intolerable_acts.html` · `Day6_Response_Sheet.docx`

Objective: *I can explain the four Intolerable Acts and describe how the colonies responded.*

Screen parts:
1. **Why Britain was angry.** Two-sentence recap of the Tea Party (students did this with the teacher). Image: a period Tea Party engraving.
2. **Four acts, four cards.** Boston Port Act, Massachusetts Government Act, Administration of Justice Act, Quartering Act. Each card: a simple CSS icon, one line "what it did," one line "how a colonist felt." Gloss boxes: *intolerable*, *quarter (soldiers)*, *port*. Tap each card to flip; part completes when all four are opened.
3. **Match it.** Four scenarios ("A soldier knocks and says he is sleeping in your house tonight") → tap the act. Feedback.
4. **Pay the price.** Boston's port is closed; screen explains merchants and dock workers lost income, and gives the flat ledger deduction (all students pay, to show the whole colony suffered). Checkbox for ledger row.
5. **1774: the colonies meet.** Short bridge: twelve colonies sent delegates to Philadelphia (First Continental Congress). Three decisions, each shown as a quick tap-vote *before* the real answer is revealed: (a) resist the Intolerable Acts — passed; (b) stop all trade with Britain (the Continental Association) — passed; (c) the Galloway Plan, a compromise keeping the colonies under Britain with their own council — rejected by one vote. Student sees "You voted ___ / They voted ___."
6. **Write it down.** Checkboxes for the paper tasks.

Paper (front): four-box organizer (act name given; student writes the main idea from a frame and draws a small picture).
Paper (back): three quick-vote boxes for 1774 (my vote / real vote); ledger reminder; one response: *The Intolerable Acts made colonists ____ because ____.*
Teacher page: include the Day 5 ledger deductions (Townshend, Tea Act) as a reminder since Day 5 is teacher-led.

### Day 7 — Lexington, Concord & Thomas Paine
`day7_lexington_concord_paine.html` · `Day7_Response_Sheet.docx`

Objective: *I can explain what happened at Lexington and Concord and put Thomas Paine's words in my own words.*

Screen parts:
1. **April 18–19, 1775, in three beats.** (a) British soldiers march to seize colonial weapons at Concord; riders (Revere, Dawes, Prescott) warn the countryside. (b) Lexington: 77 militia face ~700 regulars; a shot is fired, 8 colonists die. (c) Concord: militia turn the British back at the North Bridge; the British retreat to Boston under fire. Keep casualty facts plain; no graphic imagery. One period image per beat if available (e.g., the Doolittle engravings, public domain).
2. **Order the events.** Six event tiles; student taps them into order. Feedback.
3. **Who fired first?** Short note that nobody knows; two sentences each from a British and a colonial account (paraphrased, not quoted). Tap: "This matters because…" multiple choice.
4. **Thomas Paine, *Common Sense*, January 1776.** Who he was, why a pamphlet mattered (cheap, everyone could hear it read aloud). Gloss: *pamphlet*, *common sense*, *tyrant*.
5. **Say it plainly.** Four short Paine excerpts (under 20 words each; *Common Sense* is public domain). For each, three modern-language options — tap the best one. Feedback explains the choice.
6. **Write it down.** Checkboxes.

Paper (front): three-box sequence strip (frames + tiny drawing); "Who fired first?" one-line response with frame.
Paper (back): Paine translation — the fourth excerpt with a frame for the student's own modern version, plus *Paine wanted colonists to ____ because ____.*

### Day 8 — Second Continental Congress
`day8_second_continental_congress.html` · `Day8_Response_Sheet.docx`

Objective: *I can argue for or against a proposal and vote as a delegate.*

Identical structure to Day 3 (mode select, briefing, Congress Board, self-paced flow, shared data array). Reuse the Day 3 code; only the data changes.

**Five proposals** (Philadelphia, 1775–1776):
1. Create a Continental Army and make George Washington its commander. — passed, June 1775
2. Print paper money to pay for the army. — passed, 1775
3. Ask King George to cancel the taxes; if he does, we stop pushing for independence. (The Olive Branch Petition — the **Loyalist** proposal; Patriots vote no, Loyalists vote yes.) — sent July 1775; the king refused to read it
4. Ask other countries (like France) for help. — passed, 1776
5. Sign the Declaration of Independence. — passed, July 1776

Scoring note for the Board: Proposal 3 is reversed — Loyalists +1 if it passes, Patriots +1 if it fails. Make this explicit on the proposal card and on the paper vote tracker.

Paper (front): same design as Day 3.
Paper (back): reflection with frames: (1) *Our congress voted ____ on signing the Declaration. In 1776 they voted yes. I think ____.* (2) *If I lived in 1776, I would have been a Patriot / Loyalist / Neutralist because ____.* Word bank.

---

## Response sheet conventions (all days)

- Teacher page: objective, materials (one line), minute-by-minute pacing, ledger deduction for the day if any, answer key for every click activity and a sample answer for every frame.
- Student sheet: name line, lesson title, part numbers matching the screen, frames with blanks sized for 7th-grade handwriting, a word bank in a box, and a small "done" checkbox next to each task that mirrors the on-screen checkbox.
- Fit test: print preview at 100%; front and back must each fit one page with no overflow.

## Things to avoid

- Any on-screen typing for student answers.
- Long paragraphs. Three or four sentences per chunk, then an interaction.
- Speeches or arguments written *for* students that they merely copy without choosing anything. Choice (tapping reasons) is the thinking step; the frame is the scaffold.
- Fake money, stamps, or fines anywhere.
- Depicting violence or death visually. State facts plainly, move on.
- Assuming images will load. Test each file with images blocked.
