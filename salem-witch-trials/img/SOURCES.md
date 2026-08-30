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
