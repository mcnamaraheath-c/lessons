# Sources for Salem Witch Trials Manuscript Images

All images below are photographic reproductions of 1692 court manuscripts from the
Salem witch trials. The manuscripts themselves are public domain by age (17th century).
All scans were fetched from the **Salem Witch Trials Documentary Archive and Transcription
Project** (Benjamin Ray, University of Virginia), salem.lib.virginia.edu, on **2026-08-30**.

Site usage statement (verbatim, from https://salem.lib.virginia.edu/home.html):

> © Copyright 2018 by Benjamin Ray and The University of Virginia
> The material presented in the Salem Witch Trials Documentary Archive is provided freely
> for non-commercial educational purposes. All other uses require advance permission from
> the project originators.

Note on that statement: the underlying 1692 manuscripts are public domain by age, and the
site's own terms permit free non-commercial educational use, which covers this lesson. The
site nonetheless asserts a 2018 compilation copyright; whether that claim could extend to
the individual scans (faithful reproductions of public-domain 2-D documents) was not
decided here — flagged for the record. Each image's caption should credit the holding
archive listed below.

---

## 1. Arrest warrant(s), February 29, 1692 (dated "febr 29th 1691/2" old style)

**Important:** no single surviving warrant names all three of the first accused. Two
separate warrants were issued the same day, February 29, 1692, on the same complaint by
Joseph Hutchinson, Thomas Putnam, Edward Putnam, and Thomas Preston. Both are committed
here, one per page file:

### `warrant_good_osborne_tituba_1692.jpg` — Warrant for the apprehension of Sarah Good
- What it is: Warrant of magistrates John Hathorne and Jonathan Corwin for the arrest of
  Sarah Good, addressed to Constable George Locker, dated Salem, Feb. 29, 1691/2.
  Verified visually: 17th-century manuscript naming Sarah Good, wife of William Good,
  signed *John Hathorne* and *Jonathan Corwin*.
- Source page: https://salem.lib.virginia.edu/n63.html (SWP No. 63: Sarah Good, doc 63.1)
- Direct file: https://salem.lib.virginia.edu/archives/ecca/large/ecca1004r.jpg
- Holding archive (as cited on source page): Essex County Court Archives, Salem —
  Witchcraft Vol. 1 no. 4, Massachusetts Supreme Judicial Court, Judicial Archives,
  Massachusetts State Archives, Boston, MA.
- Original pixel dimensions: 2819 × 4293

### `warrant_good_osborne_tituba_1692_p2.jpg` — Warrant for the apprehension of Sarah Osborne and Tituba
- What it is: Companion warrant of the same date and magistrates for the arrest of Sarah
  Osborne ("Sarah Osburne the wife of Alex'r Osburne") and Tituba ("titibe an Indian
  Woman servant, of mr Sam'l parris"), addressed to Constable Joseph Herrick. Verified
  visually: 17th-century manuscript naming both women, signed Hathorne and Corwin.
- Source page: https://salem.lib.virginia.edu/n125.html (SWP No. 125: Tituba, doc 125.1)
- Direct file: https://salem.lib.virginia.edu/archives/ecca/large/ecca1033r.jpg
- Holding archive (as cited on source page): Essex County Court Archives, Salem —
  Witchcraft Vol. 1, no. 33, Massachusetts Supreme Judicial Court, Judicial Archives,
  Massachusetts State Archives, Boston, MA.
- Original pixel dimensions: 2920 × 4394

Together the two pages name all three of the first accused: Sarah Good (p1), Sarah
Osborne and Tituba (p2).

## 2. Examination of Tituba, March 1, 1692

Two manuscript versions of Tituba's examination survive (SWP No. 125). Committed here is
the version recorded by magistrate **Jonathan Corwin**, a two-page manuscript headed
"Tittuba the Ind'n Woem'ns Exam'n March. 1. 1691/2". (The other version, recorded by
Ezekiel Cheever, Essex County Court Archives Vol. 1 no. 11–12, is also on the source
page but was not committed.)

### `tituba_examination_1692.jpg` (page 1) and `tituba_examination_1692_p2.jpg` (page 2)
- What it is: Corwin's record of Tituba's examination/confession, in question-and-answer
  form. Verified visually: page 1 carries the header above and the opening Q&A ("Why doe
  you hurt these poor Children…"); page 2 continues the confession (riding "upon a stick
  or poale" with Good and Osborne, the yellow bird, etc.).
- Source page: https://salem.lib.virginia.edu/n125.html (SWP No. 125: Tituba, doc 125.4)
- Direct files:
  - https://salem.lib.virginia.edu/archives/NYPL/LARGE/NYPL03A.jpg
  - https://salem.lib.virginia.edu/archives/NYPL/LARGE/NYPL03B.jpg
- Holding archive (as cited on source page): Salem Selections, Massachusetts Box, Essex
  Co., Manuscripts & Archives, New York Public Library, New York, NY.
- Original pixel dimensions: 1337 × 2102 (p1), 1269 × 2018 (p2)

## 3. Petition in support of Rebecca Nurse, 1692

### `nurse_petition_1692.jpg`
- What it is: The petition of Rebecca Nurse's neighbors (SWP No. 94.9, dated c. May
  1692): "We whose nams Are heareunto subscribed being desired by goodman Nurse to
  declare what we knewe concerning his wives conversation…", followed by 39 signatures
  in two columns (Israel Porter, Elizabeth Porter, Edward Bishop, Daniel Andrew,
  Jonathan Putnam, Nathaniel Felton Sr., and others). Verified visually: manuscript text
  and both signature columns match the transcription on the source page.
- Source page: https://salem.lib.virginia.edu/n94.html (SWP No. 94: Rebecca Nurse)
- Direct file: https://salem.lib.virginia.edu/archives/MassHist/large/H40.jpg
- Holding archive (as cited on source page): Witchcraft Papers No. 30, Massachusetts
  Historical Society, Boston, MA.
- Original pixel dimensions: 1366 × 2080

---

## Processing

Each image was downscaled to at most 1400 px on the long edge and re-saved as JPEG
quality 72 (Python PIL, Lanczos resampling). Original dimensions are recorded above.

## Not fetched / caveats

- **Wikimedia Commons (preferred source): no manuscript scans found.** Commons file-
  namespace searches on 2026-08-30 for the warrant, Tituba's examination, and the Nurse
  petition returned only 19th-century artwork and book PDFs — none of the 1692 court
  manuscripts. The Commons API also intermittently returned HTTP 429 (rate limited) from
  this environment, so a small number of retries went unanswered; the searches that did
  complete found nothing relevant, so all images were sourced from the UVA archive
  instead (the fallback the task allows).
- **No single warrant names all three first accused.** The requested "warrant for Sarah
  Good, Sarah Osborne, and Tituba" exists as two separate same-day warrants (see
  section 1); both were committed rather than substituting either alone.
- The Ezekiel Cheever version of Tituba's examination was not committed (the Corwin
  version was chosen because both of its pages are available as clean scans; the archive
  shows only a single image, ecca1011v, for the Cheever record).

---

# Later additions (fetched 2026-08-30, second batch)

## 4. Portrait of Judge Samuel Sewall, by John Smibert, 1729

### `sewall_portrait_1729.jpg`
- What it is: Oil-on-canvas portrait of Samuel Sewall (1652–1730), painted from life by
  John Smibert in 1729. Sewall sat as a judge on the Court of Oyer and Terminer in 1692
  and publicly apologized for his role in 1697. Verified visually: period oil portrait
  (visible craquelure) of an elderly man in black robe, white judicial bands, and black
  skullcap, within a painted oval — matches the MFA's *Judge Samuel Sewall*, accession
  58.358. (Not to be confused with Smibert's 1733 Sewall portrait at the Peabody Essex
  Museum, also on Commons.)
- Source (file page): https://commons.wikimedia.org/wiki/File:John_Smibert_-_Judge_Samuel_Sewall_-_58.358_-_Museum_of_Fine_Arts.jpg
- Direct file: https://upload.wikimedia.org/wikipedia/commons/4/49/John_Smibert_-_Judge_Samuel_Sewall_-_58.358_-_Museum_of_Fine_Arts.jpg
- License, verified via the Commons API (action=query, prop=imageinfo,
  iiprop=extmetadata) on 2026-08-30: `LicenseShortName: "Public domain"`,
  `UsageTerms: "Public domain"`, `License: "pd"`. The file page's license template is
  `{{PD-Art|PD-old-auto-1923|deathyear=1751}}` (artist died 1751; a faithful photographic
  reproduction of a public-domain 2-D artwork).
- Holding institution, as stated on the file page: the page's source/credit field points
  to the Museum of Fine Arts, Boston object page
  https://www.mfa.org/collections/object/judge-samuel-sewall-33612 (accession 58.358),
  and the page is categorized "Portrait paintings in the Museum of Fine Arts, Boston".
- Date fetched: 2026-08-30
- Original pixel dimensions: 1324 × 1600 (committed copy downscaled to 1158 × 1400,
  JPEG quality 72, PIL Lanczos)

## 5. Report of the General Court committee on the reversal of attainders, 1710–1711

### `reversal_report_1711.jpg`
- What it is: The committee report underlying the October 1711 reversal-of-attainder act
  — **not the act itself** (see the "Not fetched" note below; no clean scan of the act
  was found, and this report is committed deliberately as a distinct item, to be labeled
  honestly as the report). Manuscript headed "To the Hon'd Gen'll Court Sitting": the
  committee, meeting at Salem in Sept. 1710 under the Court's act of May 1710, lists the
  names of those condemned for witchcraft in 1692 to be inserted in the reversal of
  their attainders — bracketed "Executed" (Elizabeth How, George Jacobs, Mary Easty,
  Mary Parker, George Burroughs, Giles Corey and Martha his wife, Rebecca Nurse, John
  Willard, Sarah Good, Martha Carrier, Samuel Wardwell, John Proctor, Sarah Wildes) and
  "Condemned Not Executed" (Mary Bradbury, Abigail Faulkner, Abigail Hobbs, Ann Foster,
  Rebecca Eames, Dorcas Hoar, Mary Post, Mary Lacey) — with the restitution amounts
  awarded to each, "the whole amounting unto £578 12s". Endorsed "Octo. 1711. Read &
  accepted in the House of Representatives … Sent up for Concurrence" (John Burrill,
  Speaker) and "In Council Read and Concurred" (Addington). Verified visually: 1710–11
  manuscript page (numbered 169) matching the archive's description "Report of General
  Court on reversal of attainders of accused Oct. 26, 1711", with the name list and
  amounts as above.
- Source page: https://salem.lib.virginia.edu/archives/ma135.html (Massachusetts
  Archives Collection vol. 135, doc 169)
- Direct file: https://salem.lib.virginia.edu/archives/MA135/large/MA169r.jpg
  (the verso large scan, MA169v, returns 404 — only the recto is available)
- Holding archive: Massachusetts Archives Collection, vol. 135, Massachusetts State
  Archives, Boston, MA (as presented by the UVA archive; usage per the site statement
  quoted at the top of this file).
- Date fetched: 2026-08-30
- Original pixel dimensions: 1819 × 2466 (committed copy downscaled to 1033 × 1400,
  JPEG quality 72, PIL Lanczos)

## Not fetched (second batch)

- **`act_reversal_1711.jpg` — SKIPPED: no genuine scan of the 1711 act found with clean
  provenance.** The October 1711 Massachusetts act reversing the attainders of the Salem
  convicted ("An Act to Reverse the Attainders of George Burroughs and others for
  Witchcraft") was searched for on 2026-08-30 without success:
  - **Wikimedia Commons:** file-namespace searches ("1711 attainder Salem",
    `"reverse the attainders"`, etc.) returned only book PDFs *about* the act (e.g.
    Goodell's 1884 *Reasons for concluding that the act of 1711 … became a law*), no
    scan of the act itself.
  - **Salem Witch Trials Documentary Archive (salem.lib.virginia.edu):** holds the
    committee report underlying the act (doc 169), which is the committee report,
    **not the act itself**, so per the no-substitution rule it was not committed under
    this filename. It was later committed as a distinct, honestly-labeled item — see
    section 5, `reversal_report_1711.jpg`, above.
  - **digitalcommonwealth.org:** JSON search API queries ("act reverse attainders 1711",
    "witchcraft attainder", "attainders", "Salem witchcraft act") returned no scan of
    the act.
  - **archive.org** (for the 1711 Boston printing of the session laws) is blocked by
    this environment's network policy (proxy CONNECT rejected); no workaround attempted.
