# CLAUDE.md — Oath of the Samurai

Interactive HTML story for a 7th-grade Feudal Japan unit. One self-contained page, hosted on GitHub Pages in the `lessons` repo. The student plays three generations of one samurai family (1180–1285) and feels the lord-vassal system through choices that carry forward. Companion: one printable writing task.

Standards: CA 7.5.3 (lord-vassal system of shogun, daimyo, samurai; values of the warrior code; its 20th-century influence) and 7.5.6 (rise of a military society in the late 12th century; role of the samurai).

This file is the complete design. Build exactly what is here. Where the file is silent, choose the simplest option that keeps the page uncluttered.

---

## 1. Non-negotiables

Read these before writing anything. Every one of them comes from what has worked and failed with these students.

1. **One reading level, about 6th–7th grade.** No level toggle. Full Spanish translation of every string.
2. **One decision per choice, never two.** Each decision page asks one question. Both options are real choices a samurai could have made. Neither option is silly, and no option text is ever reused in another scene.
3. **Setup before payoff.** Anything a consequence page names (a person, a promise, a paper, a field, a retainer) must already have appeared on that scene's story page or in its option cards, or in an earlier scene that this scene explicitly calls back by year.
4. **Clarity rules for every paragraph, English and Spanish:**
   - Clans are always "the Taira clan" / "the Minamoto clan" on first use in every scene.
   - Every new person gets name and role in the same sentence ("Lord Hirose, Kuwabara's brother-in-law"). Nobody is "he" or "the one who" before being named.
   - Every title gets a plain definition the first time it appears on a page: lord, shogun, vassal, Zen, koku.
   - Every callback names the year and the thing: "the man who offered you double rice in 1180."
   - Every place gets a tag: Kyoto, the capital; Kamakura, the shogun's town; Hakata Bay, where your family lives.
   - One new person or one new idea per paragraph.
5. **One thing per page.** Story page, decision page, consequence page are three separate pages. Never put story prose, option cards, and stat changes on the same screen. If a page is getting crowded, split it.
6. **No fail state.** Every path reaches the ending. Rice floors at 0 with a one-line note; the story continues.
7. **Prose is polished and flowing.** Scenes carry roughly equal weight. Word budgets: story page 150–190 words, option card 15–30 words, consequence page 70–110 words. Do not write choppy or thin.
8. **About 30 minutes of play.** 10 decisions, 2 inheritance pages, 1 code page, 4 ending pages. Do not add scenes.
9. **Everything editable by the teacher.** All text lives in one `CONTENT` object at the top of the script, keyed by page id, with `en` and `es` strings side by side. No text hard-coded in HTML or CSS.

---

## 2. Files and tech

```
oath-of-the-samurai/
  index.html          the whole game (HTML + CSS + JS in one file, no build step, no framework)
  writing-task.html   printable companion (EN page, then ES page), print-styled
  images/             see §9 for every filename
  README.md           how to replace images, how to use teacher mode
```

- Vanilla HTML/CSS/JS. No dependencies except Google Fonts (`Noto Serif` for Latin text, `Noto Serif JP` for kanji marks). Provide real fallback stacks.
- Works on Chromebooks (1366×768) and wide classroom monitors (1920×1080 and 2560×1080). No page may need vertical scrolling at 1366×768 at the default font size; if content overflows, split the page.
- State is a single JS object (see §6), saved to `localStorage` after every page so a refresh resumes. Wrap all storage in try/catch; start fresh if empty.
- Text-to-speech: Web Speech API. "Read aloud" reads the visible text of the current page in the current language (`en-US` / `es-MX`, falling back to any `en`/`es` voice). Stop any running speech on page change.
- Keyboard: Enter/Space on the focused control; A/B keys select options on decision pages; left arrow = Back. All controls are real `<button>` elements with visible focus rings.
- URL `?teacher=1` shows a small "Jump to" menu in the bottom bar listing every page id, for projection and for helping a student who lost progress. Hidden otherwise.
- `?reset=1` clears saved state.

---

## 3. Visual design

The look is Japanese ink-wash for Acts 1–2 and shifts into the painted-scroll look of the *Mōko Shūrai Ekotoba* for Act 3. The shift is deliberate: in Act 3 the pictures become a real primary source, painted by a samurai who fought at Hakata Bay and then petitioned for reward.

### Tokens (CSS custom properties on `:root`; Act 3 overrides via `body[data-act="3"]`)

| Token | Acts 1–2 (ink-wash) | Act 3 (scroll) |
|---|---|---|
| `--paper` | `#F4EDE0` warm washi | `#E8D8B5` aged scroll paper |
| `--ink` | `#1C1A17` sumi black | `#2A211A` |
| `--accent` | `#B7352A` vermilion (shu) | `#B7352A` unchanged |
| `--secondary` | `#2C3E6B` indigo (ai) | `#3F7D5A` malachite green |
| `--gold` | `#B8923E` | `#B8923E` |
| `--muted` | `#8C8780` | `#7A6A55` |
| `--frame` | 1px ink line, square corners | 6px scroll-edge border image drawn in CSS (two thin lines with a gold hairline between) |

- Page background: `--paper` with a very faint paper-fiber texture made in CSS (no image file).
- Headings: `Noto Serif`, weight 600. Body: `Noto Serif`, 20px desktop / 18px at ≤1366px, line-height 1.6, max width 62ch.
- Act marks and stat marks use `Noto Serif JP`: 一 二 三 for acts, 名 信 米 for stats, 誓 for the oath ledger.
- Buttons: ink outline, square corners, vermilion fill on hover/focus with paper text. Option cards: paper with ink outline; hover lifts 2px and adds a vermilion left rule. Nothing rounded, nothing with a drop shadow heavier than 0 2px 0 rgba(0,0,0,.08).
- Stat change animation: each delta appears as a small vermilion (+) or indigo (−) tag beside its bar, one at a time, 400ms apart, then the bar fills or empties. Reduced-motion media query disables animation.
- Transitions between pages: 250ms fade. Nothing slides.

### Layout per page type

- **Story page**: illustration left 44% width in a `--frame`, text right in a single column. At ≤1100px wide, stack illustration above text with the image capped at 38vh.
- **Decision page**: one line of situation text at top (max 25 words), then two option cards side by side, each labeled A and B in a small vermilion square. Nothing else.
- **Consequence page**: one short illustration-free text block, then the stat deltas, then Continue. If a ledger update happens on this page, it is a *separate* page after it.
- **Ledger page**: two columns under 誓, left "What I gave my lord" / right "What my lord gave me," one row per entry, plus an arrow between columns that is vermilion when a grant moved and grey (`--muted`, dashed) when it did not.

### Chrome

- **Top strip (always visible)**: act·scene indicator on the left (e.g. 一·3), three slim stat bars in the middle (mark, label, bar, number), and a 誓 button on the right that opens the ledger page as an overlay. Height ≤ 56px. Nothing else.
- **Bottom bar (always visible)**: Back · Read aloud · EN/ES · Continue. Continue is disabled on decision pages until an option is chosen; choosing an option advances immediately, so decision pages have no Continue click. Teacher jump menu appears here only with `?teacher=1`.
- Back goes to the previous page. Back from a consequence page returns to the decision page with the chosen option highlighted but does not allow re-choosing (the choice is made). This matches the Civil War journal.

---

## 4. Stat engine

Three stats. Spend-not-accumulate, like the Civil War journal.

| Stat | Mark | Range | Meaning | Goes up | Goes down |
|---|---|---|---|---|---|
| Honor | 名 | 0–6 | Your family's name | Keeping your word when it costs you; courage; mercy | Breaking an oath; running |
| Trust | 信 | 0–6 | What your lord thinks of you | Service: answering a call, fighting, obeying the law | Asking your lord for something; disobeying; embarrassing him |
| Rice | 米 | 0–10 | Your land, in koku | **Only through the grants listed below** (a lord's gift, a court award, or a full season at home on the land) | Every battle scene (−1), seven years of wall duty (−2), and specific choices |

Rules:
- Clamp every stat to its range after every change.
- Rice at 0 shows one line on the next consequence page: "Your family borrows rice from the temple to eat." Nothing else happens.
- **Inheritance**: Honor and Rice carry in full. Trust = `Math.floor(trust / 2)`.
- **Taira reset**: choosing B in Scene 2 sets Trust to exactly 1 (new lord).
- Starting values: Honor 3, Trust 0, Rice 2.

### Grants (the only ways Rice rises)

| When | Condition | Rice |
|---|---|---|
| Scene 1 A | — | +2 (lord's rice for the winter) |
| Scene 2 B | — | +1 (Hirose's rice) |
| Scene 4 grant, Minamoto path | — | +4 |
| Scene 4 grant, Minamoto path | PROMISE | +1 more |
| Scene 4 grant, Taira path | — | +2 (PROMISE gives nothing; the page says why) |
| Scene 6 B | — | +1 (court awards the field) |
| Scene 7 B | — | +1 (a full season on the land) |
| Act 2 close | Trust ≥ 4 | +1 (one small field) |
| Scene 5 B | — | +1 (full harvest) |
| Act 3 close (the Petition) | **never** | 0 — the arrow goes grey |

---

## 5. Flags (carry-forward)

| Flag | Set in | Values | Paid off in |
|---|---|---|---|
| `PROMISE` | Scene 1 | true / false | Scene 4 grant text and amount |
| `SIDE` | Scene 2 | `minamoto` / `taira` | Scene 3 (which version), Scene 4 (opening paragraph and grant) |
| `RETAINERS` | Scene 4 | true / false | Scene 9 drain (−1 instead of −2) and the retainer's name in Scenes 9–10 |
| `SUMMONS` | Scene 5 | `self` / `brother` | Scene 8 greeting and Trust ±1 |
| `ZEN` | Scene 7 | true / false | Scene 10 raid text (lose no one / lose the named retainer) |

The story branches once (Scene 2) and rejoins after Scene 4. Do not add branches.

---

## 6. State model

```js
const state = {
  lang: 'en',                   // 'en' | 'es'
  page: 'p00',                  // current page id
  history: [],                  // page ids visited, for Back
  stats: { honor: 3, trust: 0, rice: 2 },
  flags: { PROMISE: false, SIDE: null, RETAINERS: false, SUMMONS: null, ZEN: false },
  choices: {},                  // sceneId -> 'A' | 'B'
  ledger: [],                   // { gen: 1|2|3, gave: key, got: key, moved: bool }
  riceZeroNoted: false
};
```

Pages are an ordered array of objects `{ id, type, act, text, ... }`. `type` ∈ `title | intro | stats | story | decision | consequence | ledger | inherit | code | storm | petition | evidence | epilogue | end`. Story/decision/consequence pages that depend on a flag list their variants under keys (`minamoto`, `taira`, `self`, `brother`, `zen`, `nozen`, `retainers`, `noretainers`), and the renderer picks the variant from `state.flags`.

Page order (ids): p00 title · p01 intro · p02 stats · s1 story/decision/consequence · ledger1 · s2 · s3 (variant by SIDE) · s4 · ledger2 · inherit1 · s5 · s6 · code · s7 · act2close (ledger) · inherit2 · s8 · s8storm · s9 · ledger3 · s10 · s10storm · petition · ledger4 · evidence · epilogue · end.

---

## 7. Language

- Every string exists as `en` and `es`. The EN/ES button swaps instantly on the current page and persists.
- Spanish: address the student as *tú*. Keep all proper names unchanged. Translate titles with this glossary and use the same word every time:

| English | Spanish |
|---|---|
| lord | señor |
| shogun | shogun (define: "el general más alto de todos los guerreros de Japón") |
| vassal | vasallo |
| samurai | samurái |
| warrior | guerrero |
| clan | clan (el clan Taira / el clan Minamoto) |
| oath | juramento |
| koku | koku (define as in English) |
| the shogun's government | el gobierno del shogun |
| Honor / Trust / Rice | Honor / Confianza / Arroz |
| What I gave my lord / What my lord gave me | Lo que le di a mi señor / Lo que mi señor me dio |
| retainer | guerrero de mi casa |
| the warrior's code (bushido) | el código del guerrero (bushido) |
| the divine wind (kamikaze) | el viento divino (kamikaze) |

- Spanish follows the same clarity rules as English and never leans on a cognate to carry a definition. Translate the sense, not the word order.

---

## 8. Image handling

- Every story page, the title, the intro, both inheritance pages, and the storm pages have one image slot with a fixed filename (§9). Load with `<img loading="lazy">` inside the `--frame`.
- If a file is missing or fails to load, show a placeholder: the `--paper` tone darkened 6%, with the act's kanji (一 二 三) centered in `--muted` at 20% opacity. The page must look finished with no images at all.
- Act 3 images are public-domain scroll panels. Fetch the largest available versions from Wikimedia Commons, crop to the described panel, save as JPEG ≤ 400 KB, and record the source URL and panel description in `README.md` for attribution on the end page.
- Teacher-supplied Midjourney images: accept any size; on first build, write a small `scripts/optimize-images.sh` (ImageMagick) that resizes to max 1600px wide and recompresses. Document it in README.

---

## 9. Images: filenames, sources, prompts

Midjourney prompts share one suffix so the set matches: `--ar 16:9 --style raw --no text, letters, watermark, modern buildings`. Palette must stay inside the tokens: warm paper, sumi black, one vermilion accent. "Sumi-e" is the style anchor in every Act 1–2 prompt.

| Page | Filename | Source | Prompt or panel |
|---|---|---|---|
| p01 intro | `images/01-intro.jpg` | Midjourney | (added Oct 12) sumi-e ink wash, a young man on a hillside farm above a bay, rice terraces, a horse and a bow, Kyushu, 1180, warm paper |
| p00 title | `images/00-title.jpg` | Midjourney | sumi-e ink wash painting, a single samurai helmet resting on a scroll beside a sheaf of rice, warm washi paper, one small vermilion seal, generous empty space, Kamakura period, wide composition |
| s1 story | `images/s01-lords-offer.jpg` | Midjourney | sumi-e ink wash, a mounted lord with twenty riders arriving at a hillside farming village above a bay, terraced rice fields, young man standing at a gate, Kyushu, 12th century, warm paper tone, one vermilion banner |
| s2 story | `images/s02-two-banners.jpg` | Midjourney | sumi-e ink wash, night, a lone messenger on horseback outside a farm gate with a lantern, two distant war banners on separate hills, one vermilion, one black, moonlit rice fields, 12th century Japan |
| s3 minamoto | `images/s03-dan-no-ura-m.jpg` | Midjourney | sumi-e ink wash, naval battle in a narrow strait, small wooden boats, archers, one armored man reaching up from the water toward a boat's edge, churning tide, 1185, warm paper, vermilion accents on banners only |
| s3 taira | `images/s03-dan-no-ura-t.jpg` | Midjourney | sumi-e ink wash, deck of a sinking war boat tilting into the sea, a war banner falling, a second boat pulling alongside with armored men reaching across, narrow strait, 1185, warm paper, vermilion accents on banners only |
| s4 story | `images/s04-oath-kamakura.jpg` | Midjourney | sumi-e ink wash, a hall in Kamakura, rows of kneeling armored warriors, an official reading from a long register, a lord presenting a paper to a young warrior, 1192, warm paper, one vermilion seal on the paper |
| inherit1 | `images/x1-inherit.jpg` | Midjourney | sumi-e ink wash, an old samurai's hands passing a rolled scroll tied with cord to younger hands, a sword and a rice bowl beside them, close composition, warm paper, single vermilion seal on the scroll |
| s5 story | `images/s05-summons.jpg` | Midjourney | sumi-e ink wash, ripe rice fields at harvest with cut sheaves, a mounted messenger at the field's edge holding out a document, a farmer-warrior looking from the rider to the field, autumn, 13th century Japan |
| s6 story | `images/s06-boundary-stones.jpg` | Midjourney | sumi-e ink wash, a boundary stone pulled from the earth at the edge of a rice field, two groups of warriors facing each other across the field, swords still sheathed, tense stillness, warm paper, no vermilion |
| s7 story | `images/s07-zen-monk.jpg` | Midjourney | sumi-e ink wash, a small mountain temple in falling snow, a monk and a samurai seated facing each other on the veranda, the sword laid aside, bare plum branch, deep empty space, warm paper, one vermilion plum blossom |
| inherit2 | `images/x2-inherit.jpg` | Midjourney | sumi-e ink wash, the same scroll from the first inheritance image now older and worn, set beside a letter with a foreign red seal, a bay with distant unfamiliar ships on the horizon, warm paper |
| s8 story | `images/s08-hakata-bay.jpg` | Commons, *Mōko Shūrai Ekotoba* | The famous panel: Takezaki Suenaga on a wounded horse under a bursting iron bomb, three Mongol archers to the left. Commons file `Mōko_Shūrai_Ekotoba.jpg` is this panel; confirm by sight. |
| s8storm | `images/s08-storm.jpg` | Midjourney | painted handscroll style of the Moko Shurai Ekotoba, mineral pigments on aged paper, malachite green sea, a night storm scattering wooden warships in a bay, no figures, scroll edge visible |
| s9 story | `images/s09-the-wall.jpg` | Commons, *Mōko Shūrai Ekotoba* | Scroll 2 panel: mounted samurai riding along the top of the stone wall at Hakata with foot soldiers below. Browse the Commons category for the scroll (files named `MokoShuraiE-Kotoba_I` through `_IV` are the 1846 Fukuda Taika copy) and pick by sight. |
| s10 story | `images/s10-night-raid.jpg` | Commons, *Mōko Shūrai Ekotoba* | Scroll 2 panel: samurai climbing from a small boat onto a Mongol ship, fighting on the deck. Pick by sight. |
| s10storm | `images/s10-divine-wind.jpg` | Midjourney | painted handscroll style of the Moko Shurai Ekotoba, mineral pigments, two vast fleets of wooden ships broken against a rocky shore after a typhoon, grey-green waves, torn sails, dawn light, scroll edge visible |
| petition | `images/s11-petition.jpg` | Commons, *Mōko Shūrai Ekotoba* | Scroll 1 panel: Suenaga kneeling before a seated Kamakura official to state his claim for reward. Pick by sight. |
| end | `images/s12-ledger-end.jpg` | Commons, *Mōko Shūrai Ekotoba* | Any calm scroll panel of Suenaga mounted with retainers on foot, as the closing image under the final ledger. |

The epilogue page has no image.

## 9a. Consequence images (added Oct 12)

Consequence pages use the same split layout as story pages (illustration left 44%, text right), with one image per outcome. The decision page stays image-free. Scene 10's image is shared by the zen/nozen variants; the Scene 3 closing page has one shared image.

| Page | Filename (by choice) |
|---|---|
| s1-cons | s01-cons-a.jpg / s01-cons-b.jpg |
| s2-cons | s02-cons-a.jpg / s02-cons-b.jpg |
| s3-cons (minamoto) | s03m-cons-a.jpg / s03m-cons-b.jpg |
| s3-cons (taira) | s03t-cons-a.jpg / s03t-cons-b.jpg |
| s3-close | s03-close.jpg |
| s4-cons | s04-cons-a.jpg / s04-cons-b.jpg |
| s5-cons | s05-cons-a.jpg / s05-cons-b.jpg |
| s6-cons | s06-cons-a.jpg / s06-cons-b.jpg |
| s7-cons | s07-cons-a.jpg / s07-cons-b.jpg |
| s8-cons | s08-cons-a.jpg / s08-cons-b.jpg |
| s9-cons | s09-cons-a.jpg / s09-cons-b.jpg |
| s10-cons | s10-cons-a.jpg / s10-cons-b.jpg |

Implementation: add an `img` function to each consequence page in PAGES that returns the filename for `pick(S, n)` (and `S.flags.SIDE` for s3), and have the consequence renderer use the story page's split layout. The placeholder rule in §8 still applies, so the page is finished before any file exists. The teacher generates these as PNG; `scripts/optimize-images.sh` converts them.

---

## 10. Page text (English; Claude Code translates per §7)

Every page below is written out. Build it verbatim. Bracketed notes are instructions, not text.

### p00 — Title
**Oath of the Samurai**
誓
*Three generations. One promise.*
[Button: Begin]

### p01 — Intro
You are Yamabe Tadayoshi. A nineteen-year-old living in the year 1180.

Your family farms a few small fields on the island of Kyushu, in the south of Japan, on a hillside that looks down on Hakata Bay. You can ride, shoot a bow from a moving horse, and carry a sword that was your grandfather's.

In this story you will make ten choices. Each one changes what happens next, and some of them will change what happens to your son and to your grandson. There is no wrong way to play. There are only the choices a samurai could really have made, and what came of them.

### p02 — Three things to watch
[Three cards, revealed one at a time with Continue; the stat bars in the top strip appear as each card is revealed.]

**名 Honor** — Your name. Honor is what people say about you and your family when you are not in the room. It goes up when you keep your word even when it costs you. It goes down when you break your word, or when you run.

**信 Trust** — What your lord thinks of you. A lord is a landowner with warriors of his own. Trust goes up when you serve him. You spend it every time you ask him for something.

**米 Rice** — Your land, measured in koku. One koku is enough rice to feed one person for a year. Rice goes down every time you go to war. Only a lord can give you more.

Keep your eye on the rice.

---

### Act 一 — Tadayoshi, 1180–1192

### s1 — The Lord's Offer (spring 1180)
**Story.** Bandits have burned the rice store on the farm next to yours. Your father sends a letter to the emperor's governor, the official in the capital who is supposed to keep order in your province. A letter comes back. No soldiers come with it.

Then a lord named Kuwabara rides into your village with twenty warriors on horseback. A lord is a landowner with warriors of his own, and Lord Kuwabara says what lords all over Japan are saying that year: the emperor's officials cannot protect you anymore, but I can. He wants your sword whenever he calls for it. In return, he will protect your family's fields.

He looks at you for a long moment, because you are the one in your family who can ride and shoot. Then he asks what you want from him in return for your oath.

**Decision.** Lord Kuwabara waits for your answer.
- **A — Rice now.** "Give my family enough rice to get through this winter, and my sword is yours."
- **B — Land later.** "Let me prove myself first. When I have earned it, give me land of my own."

**Consequence A.** Lord Kuwabara nods once. That evening two of his men carry sacks of rice into your father's storehouse, enough to get everyone through to spring. You kneel in the yard and swear the oath: when he calls, you come. Your father watches from the doorway and says nothing, which is how he says he is proud.
[Rice +2, Trust +1]

**Consequence B.** Lord Kuwabara is quiet for a moment. "Most men ask for rice," he says. "I will remember that you asked for the harder thing." You kneel in the yard and swear the oath: when he calls, you come. Your family's storehouse is as empty as it was this morning, but your lord has made you a promise, and a lord's promise is worth something.
[Trust +2, PROMISE = true]

### ledger1 — The Oath
[First appearance of the ledger. Explain it in one line above the columns: "An oath has two sides. Here is what each side has given so far."]
- Gave: my sword, whenever my lord calls
- Got (A): rice for the winter · Got (B): a promise of land
[Arrow: vermilion in both cases; a promise counts as the lord's side moving.]

### s2 — Two Banners (autumn 1180)
**Story.** In Kyoto, the capital city, a prince has sent out a call for warriors to rise up against the Taira clan, the powerful family that controls the emperor. Far to the east, a man named Minamoto Yoritomo has raised his banner to answer the prince's call. The Taira clan holds the capital, the emperor, and most of Kyushu, the island where you live. They look like the stronger side.

Lord Kuwabara gathers his warriors in his hall and tells them he has chosen to fight for the Minamoto clan. Some of the men look at each other. Nobody says anything.

That night a messenger comes to your gate from Lord Hirose, Kuwabara's brother-in-law, whose lands lie in the next valley. Lord Hirose has chosen the Taira clan. He offers you more rice than Kuwabara pays, and a horse, and a place in his line. His messenger reminds you of one thing before he waits for your answer: the Taira clan is the side that is winning.

**Decision.** Lord Hirose's messenger is waiting in the dark outside your gate.
- **A — Stay with Kuwabara.** "Tell Lord Hirose I swore to Kuwabara, and I will fight for the Minamoto clan with him."
- **B — Go to Hirose.** "Tell Lord Hirose I will come. The Taira clan is stronger, and my family needs rice."

**Consequence A.** The messenger rides off without a word. In the morning Lord Kuwabara finds you saddling your horse beside his other men. "Hirose asked for you, didn't he?" he says. "And here you are." He does not thank you, because a lord does not thank a vassal for keeping his oath. But he puts you in the front of the line, where he can see you.
Nobody knows yet who will win this war. The Taira clan is bigger. But you kept the first promise you ever made.
[Honor +1, Trust +1, SIDE = minamoto]

**Consequence B.** You ride through the night to Lord Hirose's hall. By morning you have rice, a horse, and a place in his line. You are a Taira warrior now. Behind you, in Kuwabara's village, people are already saying that the Yamabe boy broke his oath. Lord Hirose does not care what they say. He needs swords.
Nobody knows yet who will win this war. The Taira clan is bigger. But a new lord's trust starts at the beginning.
[Rice +1, Honor −1, Trust set to 1, SIDE = taira]

### s3 — Dan-no-ura (spring 1185) — variant by SIDE
[Both variants open with the same line on the story page: "Five years of war have eaten your family's rice." Apply Rice −1 before the decision, animated on the story page.]

**Story, minamoto.** For five years the Taira clan and the Minamoto clan have fought up and down Japan. Now the last battle is being fought in boats, in the narrow sea between the islands of Honshu and Kyushu, at a place called Dan-no-ura. You are in one of Lord Kuwabara's boats with six of his men, and the Minamoto side is losing until midday, when the tide turns.

The tide at Dan-no-ura runs like a river. When it changes, every Taira boat is pushed toward the rocks, and the Minamoto archers can finally reach them. Ship by ship, the Taira clan begins to go down.

A man in the water beside your boat calls for a rope. His helmet is gone and his armor is dragging him under. You know his face. It is Lord Hirose, Kuwabara's brother-in-law, the man who offered you double rice in 1180.

**Decision, minamoto.** Lord Hirose's hand is a sword's length from your boat.
- **A — Pull him in.** He will be a prisoner, but he will live.
- **B — Leave him.** The sea decides. You keep your boat steady and your men safe.

**Consequence A.** You throw the rope. Hirose comes over the side like a landed fish, coughing seawater, and two of your men hold him down. Your captain is not pleased, but he says nothing. Later, men on both sides tell the story of the Yamabe warrior who pulled an enemy from the sea. Mercy is part of a warrior's name.
[Honor +1]

**Consequence B.** You keep your hands on the oar. The sea takes Hirose under before he can call again. Your captain claps your shoulder. "You kept the boat steady," he says. "That man turned on his own family." Lord Kuwabara hears what you did and remembers it.
[Trust +1]

**Story, taira.** For five years the Taira clan and the Minamoto clan have fought up and down Japan. Now the last battle is being fought in boats, in the narrow sea between the islands of Honshu and Kyushu, at a place called Dan-no-ura. You are on Lord Hirose's ship, and the Taira side is winning until midday, when the tide turns.

The tide at Dan-no-ura runs like a river. When it changes, every Taira boat is pushed toward the rocks, and the Minamoto archers can finally reach you. Ship by ship, the Taira clan begins to go down. Lord Hirose's flag comes down with the mast.

A boat pulls alongside, and you know the men in it. They are Lord Kuwabara's warriors, the lord you left in 1180. One of them is holding out his hand.

**Decision, taira.** Lord Kuwabara's boat is beside yours.
- **A — Fight on.** Hirose's ship is sinking, but you will not lower your sword while the deck is under your feet.
- **B — Surrender.** Lower your sword and let Kuwabara's men pull you aboard.

**Consequence A.** You fight until the deck tilts out from under you. The sea takes your armor, your sword, and nearly takes you. Kuwabara's men drag you out half-drowned and tie your hands, a prisoner. Your family's rice is gone with your armor. But men on both sides tell the story of the Yamabe warrior who did not run.
[Honor +2, Rice −1]

**Consequence B.** You lay your sword on the deck. Kuwabara's men pull you across, and one of them says, "You remembered who you were first." You are a prisoner, but a prisoner of your own first lord, and that is not the same as being an enemy.
[Honor −1, Trust +1]

[Closing page, both variants:] By sunset the Taira clan is gone. Their ships, their lords, and the child emperor they carried with them are all at the bottom of the strait. Minamoto Yoritomo now commands every warrior in Japan.

### s4 — The Oath at Kamakura (1192)
**Story.** The war is over. The emperor has given Minamoto Yoritomo a new title: shogun, the top general of all of Japan's warriors. The emperor still lives in Kyoto, the capital, with his poems and his ceremonies, but the real orders now come from Kamakura, the town in the east where Yoritomo rules.

Lord Kuwabara brings his warriors to Kamakura to kneel before the shogun. In a long hall, an official reads names from a register and hands each warrior a paper that says which land is his. A warrior who holds land from a lord like this is called a vassal, and the paper is proof of the deal: the land is yours, and your sword is your lord's.

[minamoto] Your name is read. You walk forward and take the paper. [If PROMISE:] Lord Kuwabara says, so the official can hear, "In 1180 this man asked me for land instead of rice. Write it bigger."
[taira] The official reaches the end of the list and your name is not on it. The hall goes quiet. Then Lord Kuwabara steps forward. "This man served me before he served Hirose," he says. "I will answer for him." The official looks at Kuwabara for a long moment, and writes. [If PROMISE:] The land is smaller than what you were promised in 1180. The promise died when you left.

Beside you kneel Gorō and Sadamune, the two warriors who have fought at your side since the strait.

[Grant animates on the story page: minamoto +4 (+1 PROMISE); taira +2.]

**Decision.** The official asks whether the land goes in your name alone.
- **A — Keep all of it.** "All of it in the Yamabe name. We earned it."
- **B — Share it.** "Write part of it to Gorō and Sadamune. They fought beside me, and they should hold land from me the way I hold it from my lord."

**Consequence A.** Your name goes on the register, and every koku of the land is yours. Gorō and Sadamune will go home to their fathers' farms. You ride back to Kyushu a landed man, with a paper in your sleeve that the shogun's government will honor for as long as it stands.
[Rice as granted]

**Consequence B.** Gorō and Sadamune kneel to you the way you knelt to Kuwabara. Now you are a small lord yourself, with warriors of your own house. Your land is smaller, but it is not only yours to defend. This is how the whole country works now: the shogun gives land to your lord, your lord gives land to you, and you give land to your men.
[Rice −1, RETAINERS = true]

### ledger2
- Gave: five years of war, Dan-no-ura
- Got: land, in writing, from the shogun's register
[Arrow vermilion.]

### inherit1 — The oath passes down
Tadayoshi grows old on his land and dies there, which is more than most warriors of the Genpei War can say. The oath scroll and the land pass to his son.

Honor passes with the name. Rice passes with the paper. But a lord's trust is not inherited. It must be earned again.

[Trust halves, animated. Then:] The year is 1232. You are Yamabe Yoshisuke, Tadayoshi's son. Your lord is Kuwabara's son.

---

### Act 二 — Yoshisuke, 1232–1240

### s5 — The Summons (autumn 1232)
**Story.** Lord Kuwabara, the one who took your father to Kamakura, has died, and his son is lord now. A rider brings an order from the shogun's government in Kamakura: every vassal owes six months of guard duty in Kyoto, the capital, and the Kuwabara warriors leave in three days.

Your rice is standing in the fields, one week from harvest. If you leave now, part of the crop will rot before anyone can bring it in. Your younger brother Yoshikage can ride, and the shogun's rules allow a vassal to send a substitute in his place.

The rider will not wait three days. He wants your answer before he rides to the next farm.

**Decision.** The rider waits at your gate.
- **A — Ride now.** Leave the harvest to your family and go yourself, today.
- **B — Send Yoshikage.** Finish the harvest, then follow your brother to Kyoto.

**Consequence A.** Rain comes the week after you leave. A third of the crop rots in the field. In Kyoto, the new Lord Kuwabara sees you at your post every morning for six months, and he learns your face.
[Trust +2, Rice −1, SUMMONS = self]

**Consequence B.** The harvest comes in full, and your storehouse is heavy. Yoshikage rides to Kyoto and stands guard well. But when the new Lord Kuwabara calls the roll on the first morning, the name he hears is Yoshikage, not Yoshisuke, and he remembers which Yamabe came.
[Rice +1, Trust −1, SUMMONS = brother]

### s6 — The Boundary Stones (1236)
**Story.** A warrior named Hirose Tsunemori, the grandson of the Lord Hirose from the Genpei War, has moved the boundary stones on the field your father Tadayoshi was given in 1192. Four stones, each one dragged twenty paces into your land. At the shrine festival he said in front of everyone that the Yamabe family holds land it did not earn.

Your warriors want to settle it the old way, with swords, tomorrow at dawn. Twenty years ago that is what you would have done.

But the shogun's government has a new law, written in Kamakura four years ago: warriors who fight each other over land must take the fight to a court instead, and a lord whose vassals start a private war must pay a fine to Kamakura out of his own storehouse.

**Decision.** Your warriors are waiting for you to say the word.
- **A — Draw your sword.** Meet Hirose Tsunemori at the boundary stones at dawn and settle it the way warriors always have.
- **B — Go to court.** Take your father's paper from 1192 to Lord Kuwabara and let the shogun's law decide.

**Consequence A.** You win. Tsunemori limps home with a cut across his arm, and the stones go back where they were. Every warrior in the valley knows the Yamabe name is not to be insulted. But a private war is against the shogun's law, and Lord Kuwabara pays the fine to Kamakura out of his own storehouse. He does not say a word to you. He does not need to.
[Honor +1, Trust −2]

**Consequence B.** The judge in Lord Kuwabara's court reads Tadayoshi's paper from 1192 aloud. The stones go back where they were, and Tsunemori's family must pay you a season's rice for what they took. Lord Kuwabara says only, "That is what the paper is for." The paper, it turns out, is worth more than a sword.
[Trust +1, Rice +1]

### code — The Warrior's Code
[One page, four short rows, each with its kanji. Tie each value to a scene the student just played.]
Warriors have a name for the way you are expected to live. They call it bushido, the warrior's code. It has four parts, and you have already met all of them.

- **忠 Loyalty** — You keep your oath to your lord even when another lord offers more. *(1180, the night the messenger came.)*
- **勇 Courage** — You face the enemy and the sea without running. *(1185, Dan-no-ura.)*
- **名 Honor** — Your name is what people say about your family when you are not there. *(Every choice so far.)*
- **克己 Self-discipline** — You hold the sword in when the law says to hold it in. *(1236, the boundary stones.)*

A warrior who has all four is called a true samurai. Nobody is born with all four.

### s7 — The Monk (winter 1240)
**Story.** It is a hard winter. Snow has closed the road to the valley, and there is nothing to do but wait for spring. At a small temple above the bay, a monk of a kind of Buddhism called Zen explains why so many warriors have been coming to sit in silence with him.

In Zen, he says, you train your mind the way you train your body: every day, with discipline, until it does what you tell it. A warrior who has already made peace with the idea of dying moves without fear. And fear, the monk says, is what gets a samurai killed. A frightened hand is slow.

He offers you a place on the veranda. Warriors who stay the winter sit in silence for hours, eat little, and pay for the temple's rice from their own storehouses.

**Decision.** The monk waits. Snow is falling past the open door.
- **A — Stay the winter.** Sit with the monks, learn to still your mind, and send rice from your storehouse to keep the temple fed.
- **B — Go home.** Thank the monk. Your training is the bow and the sword, every morning, in your own yard.

**Consequence A.** By spring you can sit for an hour without moving, and you no longer dream about your father's stories of Dan-no-ura. Your storehouse is lighter for feeding the temple. But people in the village say Yoshisuke came down from the temple a different kind of warrior, one who does not hurry.
[Honor +1, Rice −1, ZEN = true]

**Consequence B.** You spend the winter and the spring on your own land, shooting at a straw target until your arrows go where you look. Your storehouse is fuller than it has ever been, and your sword arm is faster than it was. A samurai's discipline, you tell your son, is the bow at dawn.
[Rice +1, ZEN = false]

### act2close — The ledger, Act 二
[If Trust ≥ 4:] Lord Kuwabara calls you to his hall and gives you one small field by the river, in writing. "There is still a little land to give," he says. The arrow moves, smaller than in 1192.
[Else:] Lord Kuwabara calls you to his hall and thanks you for your service. He does not give you land. "There is very little left to give," he says. The arrow stays grey.
- Gave: guard duty in Kyoto, obedience to the shogun's law
- Got: one small field / nothing this time
[Rice +1 if condition met.]

### inherit2 — The oath passes down
Yoshisuke dies in his sleep, an old man, in the house his father built. The oath scroll and the land pass to his son.

Honor passes with the name. Rice passes with the paper. A lord's trust is not inherited. It must be earned again.

[Trust halves.] The year is 1274. You are Yamabe Nagamoto, Yoshisuke's son. Your lord is the grandson of the first Lord Kuwabara.

For six years, letters have been arriving in Japan from Kublai Khan, the Mongol ruler of China, ordering Japan to submit to him. The shogun's government has refused every one. Now the Mongols have stopped writing.

[body data-act switches to 3 here; paper and frame tokens shift.]

---

### Act 三 — Nagamoto, 1274–1285

### s8 — Hakata Bay (November 1274)
**Story.** Kublai Khan's fleet is in Hakata Bay, the bay your family's land looks out on. Hundreds of ships. Your scout comes back white-faced and reports how the Mongol soldiers fight: they stay in tight groups, they shoot their arrows all at once in a cloud, and they throw iron balls that explode and kill horses.

[self] When you reach Lord Kuwabara's camp, he greets you by name. "You are Yoshisuke's son. Your father stood guard in Kyoto while his own harvest rotted in the field. Stand at my right side." [Trust +1]
[brother] When you reach Lord Kuwabara's camp, he looks at you for a moment before he speaks. "The Yamabe family sent a brother last time. Show me you are here now." [Trust −1]

All around you, the samurai are fighting the way samurai have always fought. Each man rides out alone, shouts his name and his family's name, and challenges one Mongol to fight him. The Mongols do not answer challenges. They shoot the man who is shouting.

[Rice −1 animates on the story page: "War eats rice."]

**Decision.** The Mongol lines are coming up the beach.
- **A — Ride out alone.** Shout your name, "Yamabe Nagamoto, grandson of Tadayoshi who fought at Dan-no-ura," and charge.
- **B — Hold your men.** Keep them together behind the dunes and meet the Mongol line as a group, the way the Mongols fight.

**Consequence A.** You charge. Arrows come in a cloud and an iron ball bursts over your horse. You reach the Mongol line and cut your way back out, and every warrior on the beach heard your name before you did it. Two of your men and three horses do not come back. [Honor +2, Rice −2]

**Consequence B.** You hold your men behind the dunes until the first Mongol group reaches the sand, then you hit them all at once. They fall back to their ships. Lord Kuwabara finds you afterward and says only, "One captain thought." [Trust +1, Rice −1]

### s8storm
That night a storm comes in off the sea. By morning the bay is empty. The Mongol fleet has gone back to Korea, and nobody in Japan believes they have gone for good.

### s9 — Seven Years of Stone (1275–1281)
**Story.** The Mongols are gone, but everyone knows they will come back. In 1276 the shogun's government orders a stone wall built along the whole shore of Hakata Bay, high enough that no horse can climb it. Every vassal in Kyushu must build one section of the wall and take turns standing guard on it, all at his own cost: the stone, the workers, the rice to feed them.

Over the next seven years, Kublai Khan sends messengers demanding that Japan surrender. The shogun's government cuts off their heads and sends no answer.

[retainers] Gorō, grandson of the Gorō your grandfather Tadayoshi gave land to in 1192, hauls stone beside you every day. [noretainers] A warrior named Shigeto, who has stood beside you since the wall's first stone, hauls stone beside you every day.

Lord Kuwabara rides the wall each spring and repeats what Kamakura has promised him: every warrior will be rewarded with land when this is over.

[Rice −2 (or −1 with RETAINERS) animates: "Seven years of stone and guard duty eat rice."]

**Decision.** The stonecutters want to know how high to build.
- **A — Build it high.** Taller than the order requires, and hire more stonecutters with your own rice to do it.
- **B — Build what is required.** Keep the rest of your rice to feed your men through the long wait.

**Consequence A.** Your section stands a head taller than the sections on either side. Lord Kuwabara stops his horse in front of it on his spring ride and says your name to the men around him. Your storehouse is nearly empty. [Rice −1, Trust +1]

**Consequence B.** Your section meets the order exactly, and every man who started the wall with you is still fed and still with you when the seventh year ends. [No stat change]

### ledger3
- Gave: seven years of stone, guard duty, the first invasion
- Got: *promised*
[Arrow grey, dashed, with the word "promised" beneath it in --gold.]

### s10 — The Divine Wind (summer 1281)
**Story.** In the summer of 1281 the Mongols return with two fleets, far larger than the first. The wall works. The Mongol soldiers cannot land, so they stay crowded on their ships in the bay, week after week, in the heat.

Every night, samurai row out in small boats, climb onto the Mongol ships in the dark, and fight on the decks. Many do not row back. But every ship they attack is one more ship that cannot rest, and the Mongols are running out of water.

Lord Kuwabara asks for volunteers for tonight's boats. [retainers] Gorō [noretainers] Shigeto is already standing.

[Rice −1 animates.]

**Decision.** The boats leave at moonset.
- **A — Volunteer for the raid.** Row out in the dark and board a Mongol ship.
- **B — Hold your section of the wall.** That is your duty, and the wall is the reason the Mongols are still on their ships.

**Consequence A, zen.** You board the ship the way your father learned to sit at the temple in 1240: without hurry, without fear. You remember what he told you: a frightened hand is slow. Yours is not. You fight across the deck and back into the boat, and every man who rowed out with you rows back. [Honor +2, Trust +1]

**Consequence A, nozen.** You board the ship with the bow and the sword your father drilled into you every dawn in 1240. You fight across the deck and back into the boat. [retainers] Gorō [noretainers] Shigeto does not row back with you. [Honor +2, Trust +1]

**Consequence B.** You hold the wall through the longest nights of the summer. No Mongol sets foot on your section. The men in the boats get the stories, but the wall is why there are stories to tell. [Honor +1, Trust +1]

### s10storm — The divine wind
[Full-width image, three lines of text beneath.]
On the night of the fifteenth day, a typhoon comes in off the sea. By morning both Mongol fleets are broken against the shore, and the bay is full of wreckage. The priests say the gods sent the wind to save Japan. They call it kamikaze, the divine wind.

### petition — Kamakura, 1285
**Story.** The war is over, and you have kept your side of the oath for eleven years. Lord Kuwabara rides to Kamakura to claim the land the shogun's government promised in 1276.

There is no land. In every war before this one, the winners took the losers' land and shared it out. But the Mongols had no land in Japan to take. The shogun's government gives a little land to the temples whose priests prayed for the wind. To the warriors who built the wall and rowed the boats, it gives thanks.

Lord Kuwabara rides home with nothing in his saddlebag. He does not need to tell you. You can see it in how he sits his horse.

### ledger4 — The oath, Act 三
[The arrow is grey and does not move. Below the columns, one line at a time:]
- Gave: two invasions, seven years of stone, the night boats
- Got: —
There was no enemy land to take. There was no land in Japan to give. For the first time since 1180, the oath was kept on only one side.
Across Kyushu, thousands of families were in the same position. The shogun's government that could not pay its warriors grew weaker every year, and within fifty years it fell.

---

## 11. Ending pages

### evidence — Evidence for your GRAPES Tracker
[Heading, then three rows laid out exactly like the tracker: three columns, What happened / Source / Why it mattered. A "Copy all" button copies the three rows as plain text in the current language. The rows are fixed text; they do not change with the student's choices.]

| What happened | Source | Why it mattered |
|---|---|---|
| In 1192 Minamoto Yoritomo became shogun. Samurai swore loyalty to lords in exchange for land, and the emperor became a figurehead. | Oath of the Samurai, Act 1 | Warriors, not the emperor, now ruled Japan. |
| Samurai lived by bushido (loyalty, courage, honor, self-discipline), and many practiced Zen Buddhism to face death without fear. | Oath of the Samurai, Act 2 | The warrior code shaped how Japanese leaders and soldiers thought for centuries. |
| After the Mongol invasions of 1274 and 1281, there was no new land to reward the samurai who fought. | Oath of the Samurai, Act 3 | The lord-vassal deal only worked if both sides could pay. When it couldn't, the Kamakura shogunate grew weak. |

Below the table, one line: "Copy these into your GRAPES Tracker under P (Politics) and S (Social)."

### epilogue — 650 years later
[No image. One short page. Tone: calm and factual; this is for 12–14 year olds.]
The storm of 1281 gave Japan a word: kamikaze, the divine wind. The oath gave Japan a code: bushido, the warrior's way.

Six hundred and fifty years later, in the 1940s, Japan's government went to war against the United States and its allies. It taught its soldiers a version of bushido in which surrender was the worst dishonor a man could suffer, and it named its pilots who flew their planes into enemy ships after the storm: kamikaze.

That was a modern government using an old idea for its own purposes. Nagamoto's oath asked him to keep his word to his lord. It did not ask him to die on purpose, and his lord owed him land in return. When you hear the word kamikaze, you can now explain where it came from, and what was changed.

### end
[Final ledger image (`s12-ledger-end.jpg`) above the three-generation ledger: one row per generation, gave/got, third row's right column empty. Beneath: "Thank you for playing. Open the writing task." Button opens `writing-task.html`. Below that in small `--muted` text: image attributions for the scroll panels (from README).]

---

## 12. Writing task (`writing-task.html`)

Printable, letter size, one English page followed by one Spanish page. No name/school footer. Plain print CSS, same fonts. Fields are blank lines, not form inputs.

**Oath of the Samurai — Reasoning Practice**

Name: ______ Period: ______

*The claim is written for you. The evidence comes from the story. Your job is the reasoning: explain how each piece of evidence proves the claim.*

**Claim:** The samurai had the biggest impact on medieval Japan.

**Evidence 1:** In 1192 Minamoto Yoritomo became shogun, and samurai swore loyalty to lords in exchange for land, while the emperor became a figurehead.
**Reasoning 1:** This evidence shows the samurai had the biggest impact because ______________________________. Without the samurai, ______________________________.

**Evidence 2:** Samurai lived by bushido (loyalty, courage, honor, self-discipline), and many practiced Zen Buddhism to face death without fear.
**Reasoning 2:** This evidence shows the samurai had the biggest impact because ______________________________. Without the samurai, ______________________________.

**Evidence 3:** After the Mongol invasions of 1274 and 1281, there was no new land to reward the samurai who fought, and the Kamakura shogunate grew weak.
**Reasoning 3:** This evidence shows the samurai had the biggest impact because ______________________________. Without the samurai, ______________________________.

**One more thing (optional):** Which of your ten choices was the hardest to make, and what did it cost your family? ______________________________

Spanish page: same structure. "Práctica de razonamiento." Claim: "Los samuráis fueron lo que más impacto tuvo en el Japón medieval." Frames: "Esta evidencia muestra que los samuráis tuvieron el mayor impacto porque ______. Sin los samuráis, ______."

---

## 13. Build order

1. Scaffold `index.html` with tokens, chrome, page renderer, state, storage, Back, language toggle, TTS, teacher menu. Use placeholder images everywhere.
2. Enter all English text from §10–11 into `CONTENT`. Run the renderer through every page id on every variant path (minamoto/taira × promise × retainers × self/brother × zen). Fix overflow at 1366×768.
3. Implement the stat engine and grants exactly per §4; implement flags per §5; implement the ledger pages with the arrow states.
4. Translate every string to Spanish per §7. Put each `es` string directly beside its `en` string in `CONTENT`.
5. Fetch and crop the five scroll panels; write README attribution; write `scripts/optimize-images.sh`.
6. Build `writing-task.html`.
7. Run the QA checklist (§14) and record results in README.

---

## 14. QA checklist (run all; record pass/fail in README)

Content
- [ ] Every story page is 150–190 words; every consequence 70–110; every option card 15–30.
- [ ] No option card text appears in more than one scene.
- [ ] Every proper noun on a consequence page appears earlier on that scene's story page or option cards, or in an earlier scene named by year.
- [ ] Every clan is "the Taira clan"/"the Minamoto clan" on first use per page, in both languages.
- [ ] Every new person is introduced with name and role in the same sentence.
- [ ] Spanish exists for every string; the glossary is used consistently; no English leaks when toggled on any page.

Engine
- [ ] Play all 2 × 2 × 2 × 2 × 2 = 32 flag combinations with a script; every path reaches `end`; no stat ever leaves its range; Rice 0 shows its note exactly once per occurrence.
- [ ] Trust halves at both inheritances; Honor and Rice carry.
- [ ] Taira path: Trust is exactly 1 after Scene 2; grant is +2 at Scene 4; PROMISE adds nothing on this path and the page says so.
- [ ] Act 2 close grants +1 only when Trust ≥ 4.
- [ ] Petition never changes Rice; ledger4's arrow is grey on every path.
- [ ] RETAINERS reduces Scene 9 drain to −1 and swaps Gorō/Shigeto in Scenes 9–10.
- [ ] ZEN swaps the Scene 10 raid consequence; on the nozen raid the named retainer is lost.
- [ ] SUMMONS swaps the Scene 8 greeting and applies ±1 Trust.

Interface
- [ ] No vertical scroll on any page at 1366×768 default font; no horizontal scroll at any width ≥ 1024.
- [ ] Decision pages contain exactly: one situation line, two cards, the chrome. Nothing else.
- [ ] Back works from every page; cannot re-choose a made decision.
- [ ] Refresh resumes at the same page with the same state; `?reset=1` clears it; `?teacher=1` shows the jump menu.
- [ ] Read aloud reads the current page in the current language and stops on page change.
- [ ] Every image slot shows a finished-looking placeholder when its file is absent.
- [ ] `body[data-act="3"]` swaps the paper, frame, and secondary tokens; Acts 1–2 are unaffected.
- [ ] Keyboard-only play works end to end; focus is visible on every control.
- [ ] Reduced-motion disables stat animations and fades.

---

## 15. Teacher notes (put in README, not in the game)

**Launch (3 min).** Project the title page. Say: "You are going to play one family for a hundred years. Every choice you make is a choice a real samurai could have made. Watch the rice." Open `?teacher=1` on the projector so you can jump to any page a student asks about.

**Play (about 30 min).** Students play individually on Chromebooks with headphones for Read aloud. The Spanish toggle is theirs to use. If a student loses progress, the jump menu gets them back.

**Debrief (7 min).** Three questions, one at a time, thumbs up/down then discuss:
1. "Did your lord keep his side of the oath in Act 1?" (Everyone: yes.)
2. "Did your lord keep his side in Act 3?" (Everyone: no, and nobody's choices could change that.)
3. "Then whose fault was it?" (Nobody's: the deal needed land, and there was none. That is the sentence that goes in the tracker.)

**Writing task.** Hand out `writing-task.html` printed, or assign the next day as the bellringer if play ran long. The epilogue page is fine to leave for the next day too.

**Absent students.** The link is on Google Classroom; the game saves progress on the device they use, so they should finish on the same Chromebook.
