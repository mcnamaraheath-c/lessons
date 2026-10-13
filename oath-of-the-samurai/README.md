# Oath of the Samurai

Interactive story for the 7th-grade Feudal Japan unit (CA 7.5.3, 7.5.6). The student plays three generations of one samurai family, 1180–1285, and makes ten choices. About 30 minutes.

| File | What it is |
|---|---|
| `index.html` | The whole game. No build step; open it in a browser. |
| `writing-task.html` | Printable reasoning practice: English page, then Spanish page. |
| `images/` | Pictures for the story pages (see "Images" below). |
| `scripts/optimize-images.sh` | Shrinks and recompresses the pictures. |
| `CLAUDE.md` | The full design the game was built from. |

## Changing the text

All the words are in one block near the top of the script in `index.html`, called `CONTENT`. Each string has its English and Spanish side by side:

```js
situation: { en: "The rider waits at your gate.", es: "El jinete espera en tu puerta." },
```

Change the words inside the quotation marks and save. Leave the keys (`situation:`, `en:`, `es:`) and the punctuation around them alone.

## Teacher mode and reset

- Add `?teacher=1` to the address to show a **Jump to** menu in the bottom bar. It lists every page. Jumping ahead fills any choices not yet made with option A. In teacher mode a decision can be chosen again, so you can show both outcomes on the projector.
- Add `?reset=1` to clear saved progress and start from the title page.
- Progress is saved in the browser on that device. A refresh picks up on the same page.

## Images

The game looks for these filenames in `images/`. If a file is missing, the page shows a plain panel with the act's number (一 二 三), so the game works with no pictures at all.

To add or replace a picture, save it into `images/` under the exact filename below. Any size works; then run the optimizer.

| Page | Filename | Status |
|---|---|---|
| Title | `00-title.jpg` | in place (Midjourney) |
| Scene 1 | `s01-lords-offer.jpg` | in place (Midjourney) |
| Scene 2 | `s02-two-banners.jpg` | in place (Midjourney) |
| Scene 3, Minamoto path | `s03-dan-no-ura-m.jpg` | in place (Midjourney) |
| Scene 3, Taira path | `s03-dan-no-ura-t.jpg` | in place (Midjourney) |
| Scene 4 | `s04-oath-kamakura.jpg` | in place (Midjourney) |
| Inheritance 1 | `x1-inherit.jpg` | in place (Midjourney) |
| Scene 5 | `s05-summons.jpg` | in place (Midjourney) |
| Scene 6 | `s06-boundary-stones.jpg` | in place (Midjourney) |
| Scene 7 | `s07-zen-monk.jpg` | in place (Midjourney) |
| Inheritance 2 | `x2-inherit.jpg` | in place (Midjourney) |
| Scene 8 | `s08-hakata-bay.jpg` | in place (scroll panel) |
| Storm of 1274 | `s08-storm.jpg` | in place (Midjourney) |
| Scene 9 | `s09-the-wall.jpg` | in place (scroll panel) |
| Scene 10 | `s10-night-raid.jpg` | in place (scroll panel) |
| The divine wind | `s10-divine-wind.jpg` | in place (Midjourney) |
| Petition | `s11-petition.jpg` | in place (scroll panel) |
| End | `s12-ledger-end.jpg` | in place (scroll panel) |

All eighteen story pictures are in place. The Midjourney prompts used for the thirteen painted ones are in `CLAUDE.md` §9. The original Midjourney PNGs are kept in `images-source/`, which is not committed to the repo.

### Consequence pictures

Each consequence page also has a picture, one per outcome, shown in the same left-picture, right-text layout as the story pages. The file is chosen by the student's choice (`-a` or `-b`), and for Scene 3 by which side they fought on (`s03m` Minamoto, `s03t` Taira). All twenty-three are in place.

| Page | Files |
|---|---|
| Scene 1 | `s01-cons-a.jpg`, `s01-cons-b.jpg` |
| Scene 2 | `s02-cons-a.jpg`, `s02-cons-b.jpg` |
| Scene 3, Minamoto path | `s03m-cons-a.jpg`, `s03m-cons-b.jpg` |
| Scene 3, Taira path | `s03t-cons-a.jpg`, `s03t-cons-b.jpg` |
| Scene 3, closing page | `s03-close.jpg` |
| Scenes 4–10 | `s04-cons-a.jpg` … `s10-cons-b.jpg` (same pattern) |

### Optimizing

```
bash scripts/optimize-images.sh
```

It resizes every picture in `images/` to at most 1600px wide and saves it as a compressed `.jpg` with the same name. It uses ImageMagick if installed, and otherwise Python with Pillow (which is what was used for the current set, 2026-10-12).

### Scroll panel sources (attribution)

All five are from the *Mōko Shūrai Ekotoba* (Illustrated Account of the Mongol Invasions), made for the samurai Takezaki Suenaga about 1293, now in the Museum of the Imperial Collections, Tokyo. These are the original 13th-century scroll, not the 1846 Fukuda Taika copy. Wikimedia Commons lists each file as public domain.

| File | Commons source | What the crop shows |
|---|---|---|
| `s08-hakata-bay.jpg` | [File:Mōko Shūrai Ekotoba.jpg](https://commons.wikimedia.org/wiki/File:M%C5%8Dko_Sh%C5%ABrai_Ekotoba.jpg) | Suenaga on a bleeding horse, an iron bomb bursting overhead, three Mongol archers at left. |
| `s09-the-wall.jpg` | [File:Takezaki suenaga ekotoba bourui.jpg](https://commons.wikimedia.org/wiki/File:Takezaki_suenaga_ekotoba_bourui.jpg) | Suenaga and three other riders passing the stone wall at Hakata, warriors seated along the top. No foot soldiers in the crop. |
| `s10-night-raid.jpg` | [File:Takezaki suenaga ekotoba3.jpg](https://commons.wikimedia.org/wiki/File:Takezaki_suenaga_ekotoba3.jpg) | Samurai climbing from a small boat onto a Mongol ship and fighting on the deck. |
| `s11-petition.jpg` | [File:Takezaki suenaga ekotoba, amanawatei.jpg](https://commons.wikimedia.org/wiki/File:Takezaki_suenaga_ekotoba,_amanawatei.jpg) | Suenaga seated before the official Adachi Yasumori in Kamakura, stating his claim. |
| `s12-ledger-end.jpg` | [File:Takezaki suenaga ekotoba 1-1.jpg](https://commons.wikimedia.org/wiki/File:Takezaki_suenaga_ekotoba_1-1.jpg) | Suenaga and about four companions riding out under a banner. Everyone is mounted; the scroll has no calm panel with retainers on foot. |

Four of the five (all but `s08`) are scans from printed books, so they have a yellow cast and a faint page-gutter line.

## QA results (2026-10-03)

How it was checked: a script played all 1,024 combinations of the ten choices through the stat engine (this covers all 32 flag combinations); a second script clicked through five full games in each language in a simulated browser; headless Chrome measured every page for overflow, in both languages on four paths, at 1366×640, 1350×673, 1024×665, 1100×665, 1904×985 and 2544×985.

### Content

| Check | Result |
|---|---|
| Story 150–190 words, consequence 70–110, option card 15–30 | **Fail as written.** The text is the verbatim text from `CLAUDE.md` §10, and most of it is shorter than these budgets. Scene 2 and Scene 3 (Minamoto path) are in range; the other stories run 98–148 words, and Scene 4 runs 148–204 depending on the path. Every consequence is under 70 words (27–68). Seven option cards are 11–14 words. Nothing was padded; the teacher chose to keep the text exactly as given. |
| No option card text reused in another scene | Pass |
| Every proper noun on a consequence page is set up earlier | Pass (the Scene 7 Dan-no-ura line was corrected to "your father's stories of Dan-no-ura"). |
| Clans are "the Taira clan" / "the Minamoto clan" on first use per page | Pass, except Scene 2 consequence B in English, which opens with "a Taira warrior" (verbatim). The Spanish says "guerrero del clan Taira." |
| Every new person has name and role in the same sentence | Pass (read-through) |
| Spanish for every string; glossary consistent; no English leaks | Pass (261 string pairs; every page differs between EN and ES) |

### Engine

| Check | Result |
|---|---|
| All 32 flag combinations reach `end`; no stat leaves its range; Rice 0 note once per occurrence | Pass (1,024 paths; 548 of them hit Rice 0) |
| Trust halves at both inheritances; Honor and Rice carry | Pass |
| Taira path: Trust exactly 1 after Scene 2; grant +2 at Scene 4; PROMISE adds nothing and the page says so | Pass |
| Act 2 close grants +1 only when Trust ≥ 4 | Pass |
| Petition never changes Rice; ledger4 arrow grey on every path | Pass |
| RETAINERS reduces Scene 9 drain to −1 and swaps Gorō/Shigeto | Pass |
| ZEN swaps the Scene 10 raid consequence; nozen raid loses the named retainer | Pass |
| SUMMONS swaps the Scene 8 greeting and applies ±1 Trust | Pass |

### Interface

| Check | Result |
|---|---|
| No vertical scroll at 1366×768; no horizontal scroll at ≥ 1024 wide | Pass. On a Chromebook-height screen, four long story pages (Scenes 2, 3, 4, 9) show in two parts: Continue shows the rest of the text beside the same picture. |
| Decision pages hold only the situation line, two cards, and the chrome | Pass |
| Back works from every page; a made decision cannot be re-chosen | Pass |
| Refresh resumes; `?reset=1` clears; `?teacher=1` shows the jump menu | Pass |
| Read aloud reads the page in the current language and stops on page change | **Not tested.** The test browser has no voices. Try it on a Chromebook. |
| Finished-looking placeholder when an image is absent | Pass (screenshots) |
| `body[data-act="3"]` swaps paper, frame and secondary colour | Pass (screenshots) |
| Keyboard-only play; visible focus | A, B and left-arrow keys tested; focus rings show. A full keyboard-only run by hand has not been done. |
| Reduced motion disables animations and fades | Built, not machine-tested |
| "Copy all" on the evidence page | Built, not tested in a real browser |

## Teacher notes

**Launch (3 min).** Project the title page. Say: "You are going to play one family for a hundred years. Every choice you make is a choice a real samurai could have made. Watch the rice." Open `?teacher=1` on the projector so you can jump to any page a student asks about.

**Play (about 30 min).** Students play individually on Chromebooks with headphones for Read aloud. The Spanish toggle is theirs to use. If a student loses progress, the jump menu gets them back.

**Debrief (7 min).** Three questions, one at a time, thumbs up/down then discuss:
1. "Did your lord keep his side of the oath in Act 1?" (Everyone: yes.)
2. "Did your lord keep his side in Act 3?" (Everyone: no, and nobody's choices could change that.)
3. "Then whose fault was it?" (Nobody's: the deal needed land, and there was none. That is the sentence that goes in the tracker.)

**Writing task.** Hand out `writing-task.html` printed, or assign the next day as the bellringer if play ran long. The epilogue page is fine to leave for the next day too.

**Absent students.** The link is on Google Classroom; the game saves progress on the device they use, so they should finish on the same Chromebook.
