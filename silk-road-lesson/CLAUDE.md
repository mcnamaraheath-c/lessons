# CLAUDE.md — "Caravan: The Merchant's Road"
## Interactive Silk Road Trading Simulation — 7th Grade World History (Medieval Times Unit)

This file is the master design spec, agreed with the teacher on 2026-08-30. Read it fully
before writing any code. Build decisions not covered here follow the precedents set by
the sibling lessons in this repo — especially `salem-witch-trials/CLAUDE.md` (caption
policy, read-aloud, lightbox, testing gotchas) and `culper-ring-lesson/` (mission-code
save system). Where this spec conflicts with a sibling lesson's habits, this spec wins.

---

## 1. PROJECT OVERVIEW

**What this is:** A single-file HTML trading simulation. The student plays a young
merchant from Tang-dynasty Chang'an, c. 800 CE, who inherits an uncle's three camels and
a small purse of coins. They travel the overland Silk Road west through five stops —
**Chang'an → Dunhuang → Kashgar → Samarkand → Baghdad → Constantinople** — buying and
selling goods against visible price boards, making one road decision per leg, and
watching the value of silk multiply as it moves west.

**What it teaches:**
- Why goods gained value along the route (distance, danger, scarcity — supply and demand
  made visible and felt, not lectured)
- The geography of Afro-Eurasia c. 800: Tang China, the Taklamakan, the Pamirs,
  Transoxiana, the Abbasid Caliphate, Byzantium
- That the Silk Road was a **relay**: most real merchants ran one leg, not the whole road
- That ideas, technologies, and beliefs traveled with the cargo: Buddhism east along the
  route, paper west after Talas (751), and — one sober line, never dramatized — disease
- Primary-source contact: a real Sogdian letter, the Diamond Sutra, the Mogao murals

**Standards fit (California HSS, Grade 7):**
- **7.3** (China in the Middle Ages), esp. **7.3.4** — "Describe agricultural,
  technological, and commercial developments during the Tang and Sung periods." The
  westbound cargo (silk, porcelain, tea, paper) *is* 7.3.4.
- **7.2** (Islam), trade networks — the Samarkand and Baghdad stops (papermaking after
  Talas, the House of Wisdom, Abbasid trade).

**Where it fits:** Two consecutive 48-minute periods. Day 1 ends after Kashgar (a natural
cliffhanger at the edge of the high mountains); Day 2 runs Samarkand to Constantinople
plus the debrief. A fast student who finishes early replays with different trade choices
— different profits are a designed discussion prompt, not a bug.

**Student population (same school population as the Salem lesson — constraints, not
suggestions):**
- Most students read at 4th grade level or below: short sentences (< 15 words where
  possible), common words, active voice, period terms get tooltips
- Large Spanish-speaking population; **full EN/ES toggle is required** (teacher-confirmed
  2026-08-30)
- Chromebooks and iPads, sometimes old, possibly spotty wifi — fully self-contained
  single file, no CDN, no network dependency, works from local file or GitHub Pages
- 48-minute periods; each in-game city must be completable in ~7–9 minutes

## 1a. MATH POLICY (teacher decision 2026-08-30 — NON-NEGOTIABLE)

The teacher's words: students must not "shut down because they have to do math in a
history class." Therefore:

- **The game does ALL arithmetic and shows its work.** Every transaction displays the
  complete sentence: "You sold 3 silk for 45 coins (15 coins each)." The student never
  computes anything to proceed.
- Prices are small friendly whole numbers (nothing over ~100; no decimals, no fractions,
  no percentages anywhere in student-facing text — the Byzantine customs duty is "the
  tax collector takes 6 of your coins," never "10%").
- Quick checks are **conceptual, never computational**: "Why does silk cost more here
  than in Chang'an?" with tap-to-answer choices — not "how much profit did you make?"
- The paper Merchant's Ledger (teacher materials) asks students only to **copy numbers
  off the screen** and do at most one single-digit-friendly subtraction at the very end
  ("sold for − bought for = profit"), with a worked example on the sheet, and the game's
  final ledger screen shows the same numbers so students can self-check.
- The final ledger screen presents profit as a pre-computed story ("Your silk: bought
  for 8, sold for 87"), with the math already done.

---

## 2. TECHNICAL REQUIREMENTS

- **One single HTML file:** `caravan_merchants_road.html`. All CSS/JS inline, all images
  base64-embedded. No external libraries, no CDN, no network fonts. Target ≤ ~4 MB.
- **Build process for embedded images** (same pattern as Salem): the HTML is authored
  with a `"__IMG_JSON__"` placeholder; `build_embed.js` (Node) reads the JPEGs/PNGs from
  `img/`, base64-encodes them into an `IMG` map, and writes the final file. Author file:
  `caravan_merchants_road.src.html`. Never hand-edit the built file's IMG blob.
- **Save/resume — critical for the two-day structure:** localStorage as the convenience
  layer PLUS a **"Caravan Code"** shown at the Day 1 stopping point and on demand from
  the header. **Teacher decision (2026-08-30): the code must be short enough for a 7th
  grader to copy by hand.** It is exactly 12 characters, grouped `XXXX-XXXX-XXXX`, in
  Crockford base32 (digits + capitals, never I/L/O/U; entry auto-corrects i/l→1 and
  o→0, ignores case, dashes, and spaces). It carries position, coins, camels, supplies,
  cargo, and the current road decision, with a 10-bit checksum (a single wrong
  character is rejected ~99.9% of the time). It does NOT carry trade history: on the
  same device, entering the code picks up the matching localStorage save (full
  history); on a different device, the final ledger marks carried-in goods honestly
  ("You carried 2 in from Day 1. What you paid is on your paper ledger.") and the
  coins headline stays exact. The paper Merchant's Ledger is the durable Day 1 record —
  by design, not as a fallback. Shared Chromebooks and cleared profiles make
  localStorage alone insufficient (Culper precedent).
- **Works on:** Chrome on Chromebooks and Safari on iPad, widths down to 1024×600.
  Touch targets ≥ 44px. No drag-only mechanics — every interaction is tap/click (with
  keyboard operability). `prefers-reduced-motion` respected. Visible keyboard focus.
- **After ANY edit:** extract the `<script>` and run `node --check`, then a jsdom smoke
  test (pass `url:"http://localhost/"` so localStorage works). Apostrophe gotcha from
  Salem applies: short fields single-quoted, long bodies double-quoted.

## 3. LANGUAGE MACHINERY (reused from Salem/Civil War — do not reinvent)

- EN/ES toggle: `state.language`, persisted; ALL content strings as `{en, es}` objects;
  one `UI` string table; `T()` helper. Spanish is a full first-class translation, not a
  gloss.
- Vocab tooltips: the `wrap()` auto-tagger + `.vocab`/`.tooltip` CSS, bilingual with the
  🌐 second-language line; `VOCAB` and `VOCAB_ES` both populated.
- **Vocabulary list:** caravan, caravanserai, oasis, bazaar, merchant, toll, profit,
  supply, demand, dynasty, empire, monk, scroll, porcelain, customs (as needed: steppe,
  relay).
- Read-aloud button: port Salem's implementation verbatim in spirit — `pickVoice()`
  ranking (Natural/Neural > Google > others, eSpeak penalized), EN/ES voice matching,
  screen-text collection with buttons/tooltips stripped, sentence chunking (Chrome
  long-utterance workaround — keep), stops on navigation/language switch, hides without
  speech support.
- Lightbox: Salem's `figure.exhibit` delegation pattern — any exhibit image enlarges on
  tap/Enter/Space, closes on overlay/×/Escape/navigation.

---

## 4. GAME DESIGN

### State and meters (only three visible meters — no hidden stats)

- **Coins** (starts at 60)
- **Cargo**: 3 camels × 2 loads each = 6 slots (events can add/remove a camel; floor of
  1 camel — the player is never stranded)
- **Supplies**: food/water units, consumed per leg, bought cheaply in each city; running
  out never kills — it forces selling a load at a loss and a one-line explanation

State object: `{language, screen, cityIndex, coins, camels, cargo:[], supplies,
decisions:{}, checks:{}, ledger:[], seenIntro}`. Everything needed to restore lives in
the state; the Caravan Code encodes it.

### The loop at every city (~7–9 min)

1. **Arrive** — generated backdrop, 2–3 short paragraphs ("what is this place"), one
   NPC conversation (tap-through, 3–5 exchanges, one choice inside it is flavor-only).
2. **Bazaar** — the buy/sell screen against a visible price board. Buttons are
   "Buy 1 / Sell 1" steppers; the game narrates every transaction in a full sentence
   with the arithmetic done (see MATH POLICY).
3. **Road decision** — ONE meaningful choice per leg, tradeoffs stated up front in
   plain language, outcome on the next screen with a one-paragraph "why" grounded in
   real history. Bad outcomes cost coins/supplies/a camel — **nothing is ever game
   over**, and no outcome depends on reflexes or timing.
4. **Quick check** — 1–2 tap-to-answer conceptual questions; wrong answers get a gentle
   explain-and-retry, and the chosen answers are stored for the ledger screen.

### Goods and the price system (the price table IS the lesson)

Westbound cargo bought in Chang'an: **silk, porcelain, tea, paper**. Mid-route
opportunity: **spices** (appear in Samarkand/Baghdad markets, sell well in
Constantinople). Deliberate teachable trap: **jade** is for sale in Kashgar but jade
flowed EAST into China — every city west of Kashgar offers less than you paid, and the
Sogdian merchant warns you if asked ("Wrong direction, friend"). Buying it anyway costs
a few coins and earns the relay-trade insight early; the game never mocks the choice.

Prices are a fixed data table (no randomness in prices — two students at the same city
see the same board; randomness lives only in event outcomes, and even those are
seeded-fair: guard-hire always works, risk-taking fails at fixed scripted points so the
narrative stays authored, fair, and testable).

Illustrative price line (final numbers tuned during build, all ≤ ~100):
- Silk: 8 (Chang'an) → 14 (Dunhuang) → 20 (Kashgar) → 34 (Samarkand) → 55 (Baghdad) →
  90 (Constantinople)
- Paper: rises to Kashgar, then **stalls/drops in Samarkand and Baghdad** — because they
  make their own after 751 (Talas). The paper-maker NPC lands this: technology travels.
- Porcelain: steady multiplier, but fragile — one event can break a load (announced as a
  risk before the choice, never a gotcha).
- Tea: modest gains, sells best in Central Asia (Dunhuang/Kashgar), flat further west —
  teaches that not everything was wanted everywhere.

### The legs and their decisions (all historically grounded)

1. **Chang'an → Dunhuang:** the Jade Gate (Yumen Pass). Decision: pay the official toll
   or follow a smuggler's detour (detour risks confiscation of one load; scripted).
2. **Dunhuang → Kashgar:** the Taklamakan. Decision: northern route (longer, safer,
   more supplies burned) vs. southern oasis route (shorter, sandstorm costs supplies +
   a delay scene). Either way the desert is survived — expensively or cheaply.
3. **Kashgar → Samarkand:** the Pamirs ("the roof of the world"). Decision: hire local
   yak porters (costs coins, protects cargo) or push the camels over the passes (a
   porcelain load is at risk; the game states this before the choice).
4. **Samarkand → Baghdad:** bandit country. Decision: join a large caravan and pay its
   master's fee, or travel alone and fast (scripted bandit scene costs coins; hiring in
   is always safe — hospitality and safety in numbers were the caravanserai system).
5. **Baghdad → Constantinople:** the Byzantine frontier. Decision: declare at customs
   (the collector takes a stated number of coins) or hide silk in a tea bale
   (scripted discovery of ONE attempt, fine + a stern scene, the other attempt
   succeeds — students see why smuggling silk was common AND risky). Framed with the
   kommerkion in kid terms: "the emperor taxes everything that enters."

### The endgame payoff (Day 2, last ~12 min)

1. **Final Ledger screen** — the student's actual numbers, pre-computed, one row per
   good: bought-for, sold-for, and a plain-language verdict line. Big single takeaway
   banner: silk's full price line across all six cities as a simple bar strip.
2. **The relay reveal** — "You did something almost no real merchant did." Most goods
   changed hands at every stop; each merchant ran one leg. One screen, with the Sogdian
   letter as the exhibit (real merchants writing home about shipments).
3. **"More than goods traveled this road"** — Buddhism east (Mogao/Diamond Sutra
   callbacks), paper west (Talas callback), then one calm factual line that sickness
   traveled the routes too (no Black Death dramatization — wrong era, wrong tone).
4. **Think-and-Write** (3 questions, mirrored verbatim on the paper ledger) + exit
   ticket ("Name one thing that traveled the Silk Road that was not a good for sale").

### Day boundary

After the Kashgar quick check, a **"Rest at the caravanserai"** screen: shows the
Caravan Code big and copyable, tells the student to write it on their ledger sheet,
and offers "Keep going" (for fast classes/replays) so the boundary is soft, not locked.

---

## 5. CHARACTERS (all fictional composites — generated portraits approved)

Teacher decision 2026-08-30: generated character portraits are IN. Guardrails carried
over from Salem:
- Every NPC is an invented composite, clearly framed as such in the intro ("The people
  you will meet stand for the kinds of people who really worked this road").
- **No generated faces for real historical people, ever.** Real people (Xuanzang,
  Zhang Qian, Harun al-Rashid, Empress Irene) may be *mentioned* by NPCs or captions,
  shown only via genuine period art, and never given invented dialogue.
- Portraits are period-plausible and respectful: working clothes, no fantasy costume,
  no ethnic caricature. Each culture along the route is drawn with the same dignity.

The cast (one portrait each, ~7 total):
- **Uncle Wei** (Chang'an) — retiring merchant; the send-off, explains meters and goods
- **Brother Kong** (Dunhuang) — Buddhist monk copying sutras; ideas travel; Diamond
  Sutra exhibit; mentions Xuanzang's journey a lifetime earlier
- **Old Yusuf** (Kashgar) — camel trader and mountain guide; the jade warning lives here
- **Vandak** (Samarkand) — Sogdian merchant; the relay-trade concept in person ("I have
  never seen China. My silk has.")
- **Roshan** (Samarkand) — paper-maker; the Talas story, told factually and briefly
- **Scholar Salim** (Baghdad) — House of Wisdom translator; books buy ideas
- **Anna the silk buyer** (Constantinople) — closes the loop; retells the old silkworm-
  smuggling story (Justinian's monks, c. 552) as a story merchants tell

## 6. IMAGES

Two layers, Salem's split exactly: real historical images where a real thing exists;
generated art only for scene-setting and the fictional cast.

**Caption policy (inherited verbatim from Salem — teacher decision):** NO badges, NO
"REAL" banners. Provenance lives quietly in calm captions: real items carry date +
holding archive; generated images say "as our artist imagines it." Follow the register.

### Real / public-domain exhibits (fetch, verify license via Commons API, document in
`img/SOURCES.md` with the same rigor as Salem's — provenance, direct URLs, license
verification output, fetch date, original dimensions, processing):
1. **Mogao Cave 323 mural, Zhang Qian's departure** (Tang, 8th c.) — intro screen
2. **Diamond Sutra frontispiece, 868 CE** (British Library) — Dunhuang stop
3. **A Sogdian Ancient Letter** (early 4th c., Stein collection) — Samarkand stop and
   the relay-reveal screen
4. **Tang sancai glazed camel** (ideally the camel with musicians) — Chang'an or intro.
   ⚠️ Photos of 3-D objects are NOT covered by PD-Art: the photo itself needs a real
   PD or CC license, verified; if CC, attribution is kept and recorded.
5. **Byzantine silk fragment** (2-D textile photo, PD preferred) — Constantinople stop
6. Optional if clean: a Tang coin / dirham hoard photo (money itself traveled)

If any item can't be found with clean provenance, follow Salem's no-substitution rule:
skip it and record the search in SOURCES.md rather than embedding something dubious.

### Generated art (teacher produces via Midjourney from `IMAGE_PROMPTS.md`; placeholder
inline-SVG scenes ship in the meantime so the build is never blocked):
- 1 cover (caravan at dusk on dunes)
- 6 city backdrops: Chang'an West Market; the Jade Gate/desert; Kashgar oasis bazaar;
  Samarkand caravanserai courtyard; Baghdad round city; Constantinople harbor
- 7 NPC portraits (cast above)
All captioned "as our artist imagines it" / Spanish equivalent. Source PNGs kept in
`img/generated/`; embedded copies downscaled like everything else (~1000–1400 px long
edge, JPEG q70–72).

## 7. HISTORICAL CONTENT GUARDRAILS (verified facts — use these)

- Date anchor c. 800 CE: Tang dynasty in China (Chang'an the world's largest city);
  Abbasid Caliphate (Baghdad founded 762, House of Wisdom under Harun al-Rashid/
  al-Ma'mun); Byzantine Empire at Constantinople; Sogdian merchant network active in
  Transoxiana; papermaking established in Samarkand after the Battle of Talas (751)
  and reaching Baghdad by the 790s.
- Silk technology had already reached Byzantium (6th c.) — Anna's smuggling story is
  told as the past; Byzantine demand for *Chinese* silk remained real. Don't claim
  Byzantium couldn't make silk.
- The "Silk Road" name is modern (Richthofen, 1877) — one intro line says travelers
  never called it that; it was many roads.
- Jade flowed east (Khotan → China); horses (Ferghana) flowed east; silk, porcelain,
  paper flowed west; Buddhism spread along the eastern routes; Islam was spreading in
  Central Asia in this era — present matter-of-factly where relevant (Samarkand,
  Baghdad), respectfully and briefly, no proselytizing framing in any direction.
- No invented dialogue or inner thoughts for real people. Composites carry the drama.
- Dangers (bandits, sandstorms, mountain cold) are real and stated soberly — setbacks
  in coins and cargo, never depicted violence, never death on screen.

## 8. TEACHER MATERIALS (built AFTER the lesson works — Salem pattern)

`materials/`:
- **Merchant's Ledger** student sheet, EN + ES, PDF (print; HTML→Chromium print is the
  layout source of truth) + docx (Google Classroom "make a copy per student"). One row
  per city filled DURING play (what I bought/sold — copied numbers only; one decision +
  why), the Caravan Code box for the Day 1/Day 2 boundary, the single worked-example
  subtraction at the end, and the three Think-and-Write questions verbatim + exit
  ticket. Keep in sync with the lesson's questions if they change.
- **Substitute plan**, two pages, Salem format: link, board rules, two-day timeline,
  opening script, troubleshooting, no-wifi discussion fallback.
- **Answer key is NOT committed** (students browse this site) — deliver directly.
- New unit card on the repo's root `index.html`: "Silk Road — c. 800 CE / Caravan: The
  Merchant's Road / Trading simulation".

## 9. FILE LAYOUT

```
silk-road-lesson/
  CLAUDE.md                       ← this spec
  caravan_merchants_road.src.html ← authored source (has "__IMG_JSON__")
  caravan_merchants_road.html     ← built, shippable, single file
  build_embed.js                  ← base64 embedder (node build_embed.js)
  IMAGE_PROMPTS.md                ← Midjourney prompts for the teacher
  img/
    SOURCES.md                    ← provenance + license verification (authoritative)
    *.jpg                         ← processed PD exhibits
    generated/                    ← teacher's PNGs land here when ready
  materials/                      ← ledger sheets + sub plan (phase 6)
```

## 10. BUILD ORDER

1. This spec (committed first — the map before the road)
2. PD image sourcing + `img/SOURCES.md`
3. Engine + Day 1 cities (Chang'an, Dunhuang, Kashgar) with placeholder SVG backdrops
4. Day 2 cities + ledger/reveal/reflection screens
5. Full ES pass, read-aloud, lightbox, jsdom tests, index card, review screenshots
6. Teacher materials

Commit per phase with clear messages, push to the working branch after each phase.
