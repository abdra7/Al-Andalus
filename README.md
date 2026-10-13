# Al-Andalus — الأندلس: رحلة عبر الزمن

An interactive Arabic historical atlas exploring Al-Andalus through maps, timelines, cities, and verified historical sources.

**Live:** https://abdulrahim.page/al-andalus/ — the old Arabic address `https://abdulrahim.page/الأندلس/` redirects there.

## What this is

A production Arabic RTL web application that presents the history of Al-Andalus (711–1492 CE) as an interactive historical atlas:

- **Interactive map** (Leaflet + a **self-hosted parchment relief basemap**, no third-party tiles) with accurately positioned city markers, Andalusian Arabic names for seas, rivers and regions (بحر الروم، البحر المحيط، بحر الزقاق، الوادي الكبير…), and a period filter that dims cities outside the selected era.
- **Horizontal timeline** with 19 verified milestones, category filters (الفتوح، السياسة، الثقافة، العلوم، العمارة، السقوط), and keyboard-accessible selection.
- **City panel** (المدن الرئيسية) with 9 cities: قرطبة، غرناطة، إشبيلية، طليطلة، الزهراء، مالقة، بلنسية، المرية، سرقسطة.
- **Information panel** for a city, an event or a figure: sourced narrative, landmarks with dates, events, a **photo gallery with a full-screen viewer**, related figures, "further reading" pointing to the bookshelf, and source links.
- **28 historical figures** (طارق بن زياد → أبو عبد الله الصغير) with dates, works, a related monument/artwork image (never an invented portrait) and sources; listed by period in the library and searchable by alternative names (Averroes, Boabdil, ابن ميمون…).
- **Arabic search** with tolerant matching (hamza/alef/ta-marbuta normalization, Latin accent stripping) across cities, events, figures, periods, and books.
- **Historical library** (المكتبة) with a **bookshelf of recommended Arabic books** (عنان، السرجاني، السويدان، مؤنس، الحجي) grouped by reading level, plus topics: الدول والحقب، المدن، الشخصيات، العمارة، العلوم، المصادر.
- **Eras view** (الحقب التاريخية): each period opens to its capital, rulers with reign years, dated landmarks, a historical map, its figures, its timeline events, and the matching volume of عنان's «دولة الإسلام في الأندلس» (or مؤنس's «فجر الأندلس») on the shelf.
- **Background music** — «جادكَ الغيثُ» (muwashshah, words by لسان الدين بن الخطيب), published with the site owner's permission: loops, starts on the visitor's first interaction, play/pause, mute and volume controls in the header, choices remembered per visitor.
- **Responsive** desktop / tablet / mobile layouts with a mobile bottom drawer and tab bar.

## Technology

| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Client-focused atlas; no server needed |
| Build | Vite 5 | Fast, relative-base builds for subpath hosting |
| Map | Leaflet 1.9 + self-hosted WebP tiles (`public/tiles`, z5–8) | No API key, no tile server to break, no visitor IPs sent to third parties |
| Fonts | Alexandria + Markazi Text (self-hosted variable woff2, OFL) | Free stand-ins for Thmanyah — see typography below |
| Tests | Vitest | Data integrity, search normalisation, font URLs, tile coverage, books |
| Deploy | Static build → `al-andalus/` subdirectory of the `abdra7.github.io` repo → GitHub Pages | Coexists with the existing portfolio on the same custom domain |

## Local development

```bash
npm install
npm run dev        # http://localhost:5188
npm test           # 55 tests: data integrity, references, search, fonts, basemap, images, music
npm run typecheck  # strict TypeScript
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Adding historical records

All historical content lives in **`src/data/`** — never inline it in components:

| File | Contents |
|---|---|
| `types.ts` | the data model (Period, City, Figure, TimelineEvent, Landmark, BookRef…) |
| `sources.ts` | shared sources + `wiki()` helper; cite only pages you have checked |
| `periods.ts` | 7 periods: capital, rulers, landmarks, map, further reading |
| `cities.ts` | 9 cities: narrative, landmarks, gallery, events |
| `figures.ts` | 28 figures |
| `history.ts` | timeline (26 events), library topics, helpers, search index; re-exports the rest |
| `books.ts` | the Arabic bookshelf |
| `images.ts` / `images.json` | **generated** by `scripts/images/build_images.py` |


1. **A new city** — append a `City` object to `cities.ts`. Required fields: `id`, `name`, `latinName`, `lat`, `lng`, `significance`, `description`, `periods`, `sources`. Add it to `majorCity: true` to surface it in the main panel.
2. **A new timeline event** — append a `TimelineEvent` to `timelineEvents` in `history.ts` with `year`, `yearLabel`, `title`, `description`, `category`, and at least one `source`.
3. **A new period** — append to `periods.ts`. Note: periods must not overlap on their boundary year (`periodAtYear` returns the first match).
4. **A new figure** — append to `figures.ts` (`periodId` required; `imageId` must be a monument or artwork, captioned as such).
5. **Library entries** — append to `libraryTopics`.
6. **Books** — append to `books` in `src/data/books.ts` (title, author, level, years covered, periods, catalogue source). Link to catalogue pages (Goodreads, WorldCat, CiNii, publisher) — never to PDF mirrors.

**Every record requires at least one source with a real `url`.** The test suite (`src/data.test.ts`) enforces sources, coordinate sanity, chronological ordering, and image-reference integrity — run `npm test` after any data change.

### Adding images

Images come from Wikimedia Commons with licence checks (CC0, public domain, CC BY, CC BY-SA only):

```bash
node scripts/fetch-more-images.mjs                 # on a machine that can reach Wikimedia → data/incoming-images/
python3 scripts/images/build_images.py data/incoming-images   # review, caption, convert
```

`build_images.py` holds the curated list of downloads to keep and an Arabic caption for **every** image (written after looking at the picture and its Commons description). It converts everything to WebP (≤1200 px, plus 360 px thumbnails in `public/images/thumbs/`) and regenerates `images.ts`/`images.json`. 72 images, ~10 MB. Three earlier pictures were removed as misattributed (an Antequera fortress labelled Málaga, Madrid's Puente de Toledo labelled Toledo, a garden plant), and the Alhambra captions — previously shifted by one — were corrected.

### Music

`public/audio/andalus-music.m4a` — AAC 80 kbps, loudness-normalised to about −20 LUFS with 2–3 s fades so the loop is smooth (8.8 MB, `preload="none"` so it downloads only when played). Published with the site owner's permission. The player (`src/components/MusicPlayer.tsx`) stores the visitor's choice (on/off, volume, mute) in `localStorage`; on iOS, where web pages cannot set the volume, the slider is replaced by a hint to use the device buttons.

## Typography licensing (important)

**Thmanyah (خط ثمانية) is not embedded in this project.** Its official license (`https://font.thmanyah.com/licenses`) states, under الإستخدامات الممنوعة:

> "إتاحة برنامج الخط بأي طريقة تُمكّن المستخدمين النهائيين أو الأطراف الثالثة من استخراج برنامج الخط أو تنزيله أو الوصول إليه أو إعادة استخدامه أو إعادة توزيعه بشكل مستقل كملفات خطوط، **بما في ذلك عبر التضمين على الويب** أو التطبيقات أو المنتجات البرمجية."

Web embedding (`@font-face`) is explicitly prohibited, so self-hosting or redistributing the font binaries in this repository or deployment would violate the license. The project therefore uses **SIL Open Font License 1.1** Arabic webfonts from Google Fonts (via Fontsource 5.3.0, variable `wght` axis, arabic + latin subsets) chosen to match Thmanyah's character:

| Role (CSS variable) | Thmanyah original | Free stand-in | Why |
|---|---|---|---|
| `--font-ui` | Thmanyah Sans | **Alexandria** (wght 100–900) | Geometric, low-contrast, wide Arabic sans — the closest open match |
| `--font-display` | Thmanyah Serif Display | **Markazi Text** (bold) | Contemporary Naskh with crisp editorial contrast |
| `--font-serif` | Thmanyah Serif Text | **Markazi Text** (regular) | Thmanyah's serif is one design in two optical sizes, so one Naskh family covers both roles |

- Copyrights: Alexandria © 2022 The Alexandria Project Authors; Markazi Text © 2017 The Markazi Text Project Authors. Licence text ships in `public/fonts/LICENSE-OFL.txt`.
- Markazi Text has a small apparent size, normalised with `size-adjust: 116%` in its `@font-face`.
- Only woff2 binaries are committed (4 files, ~128 KB total). Filenames carry a `-v5` suffix: bump it to bust caches.
- **Every `@font-face` URL must be root-absolute** (`/al-andalus/fonts/…`): the CSS bundle is served from `/al-andalus/assets/`, so a relative `./fonts/…` would resolve to `/al-andalus/assets/fonts/…` and 404. `src/site.test.ts` enforces this and checks the files exist.
- Arabic text is never letter-spaced (it breaks cursive joining).

If Thmanyah ever grants web-embedding authorization, swap the families in `src/styles/fonts.css` — the three role variables stay the same.

## Basemap

The map no longer depends on CARTO: in 2026 CARTO's keyless basemap endpoints began serving "API KEY REQUIRED" watermark tiles (with HTTP 200, so Leaflet never fired `tileerror`). The atlas now ships its own tiles:

- **Style:** parchment land with relief, muted sea with coastal halo and engraved ripple lines, modern coastlines/rivers/lakes. Labels are HTML (Arabic, site fonts), not baked into the tiles.
- **Sources (public domain):** [Natural Earth](https://www.naturalearthdata.com/) 1:10m vectors and NASA Blue Marble Shaded Relief & Bathymetry (via `@freetiler/nasa-bluemarble`). Credited in the map's attribution control.
- **Files:** `public/tiles/{z}/{x}/{y}.webp`, zooms 5–8 (845 tiles, ~1.6 MB); Leaflet over-zooms to 9. Ranges live in `src/data/basemap-manifest.json`; out-of-range requests get a sea-coloured placeholder instead of a 404.
- **Regenerate:** `scripts/basemap/render.py` (Python + numpy/scipy/shapely/Pillow); see its docstring for inputs. Keep its `MAX_BOUNDS` in sync with `MapView.tsx`.

## Deployment architecture

```
github.com/abdra7/Al-Andalus (source of truth)
        │  npm run build
        ▼
      dist/  (relative: ./assets/…, ./images/…, ./tiles/… — fonts root-absolute: /al-andalus/fonts/…)
        │  copied into the al-andalus/ subdirectory
        ▼
github.com/abdra7/abdra7.github.io (the site serving abdulrahim.page)
        │  GitHub Pages
        ▼
https://abdulrahim.page/al-andalus/
```

Why this architecture: `abdulrahim.page` is served by GitHub Pages from the `abdra7.github.io` repository (CNAME verified). Building with `base: "./"` produces relative asset URLs, so the app works beneath any subpath; only the `@font-face` URLs are root-absolute.

**Why `/al-andalus/` and not `/الأندلس/`:** URLs may only contain ASCII, so an Arabic folder name is percent-encoded (`/%D8%A7%D9%84…`) whenever the link is copied or shared. The app therefore lives at `/al-andalus/`. The Pages repo keeps a one-file `الأندلس/index.html` that redirects old links (including their `#/…` section) to the new address. The home page itself has no hash, so the shared link is simply `https://abdulrahim.page/al-andalus/`.

Deploy steps (documented and reproducible):

```bash
npm run build
# copy dist/* into the al-andalus/ directory of a clone of abdra7/abdra7.github.io
# commit + push → GitHub Pages rebuilds automatically
```

## Sources

Historical content is sourced from:

- **UNESCO World Heritage Centre** — Alhambra/Generalife/Albayzín (list 314), Historic Centre of Córdoba (313), Caliphate City of Medina Azahara (1560)
- **The Metropolitan Museum of Art** — *Al-Andalus: The Art of Islamic Spain*
- **Wikimedia Commons** — historical maps and photographs (CC0 / CC BY / CC BY-SA, verified per file)
- **Encyclopaedia Britannica** and **Brill's Encyclopaedia of Islam** — event dates and figures

Images and maps are NOT presented as historical evidence beyond what their Commons description states; modern photographs are captioned as such.

## Project structure

```
al-andalus/
├── src/
│   ├── App.tsx                 # shell, hash routing, view state
│   ├── main.tsx                # entry
│   ├── components/
│   │   ├── Timeline.tsx        # horizontal interactive timeline + filters
│   │   ├── MapView.tsx         # Leaflet map, local basemap, Arabic geo labels, markers
│   │   ├── CityPanel.tsx       # المدن الرئيسية
│   │   ├── InfoPanel.tsx       # تفاصيل المدينة والحدث
│   │   ├── SearchModal.tsx     # Arabic-tolerant search
│   │   ├── LibraryView.tsx     # المكتبة
│   │   ├── HomeView.tsx        # hero
│   │   └── Icon.tsx            # inline SVG icon set
│   ├── data/
│   │   ├── history.ts          # ALL historical content (cities, events, periods, figures, library)
│   │   ├── books.ts            # recommended Arabic books (bookshelf)
│   │   ├── basemap-manifest.json # tile ranges for the self-hosted basemap
│   │   ├── images.ts           # image metadata + attribution
│   │   └── images.json         # raw image records
│   └── styles/
│       ├── main.css            # design system (navy/gold/parchment, RTL)
│       └── fonts.css           # self-hosted OFL @font-face declarations
├── public/
│   ├── fonts/                  # OFL woff2 files + LICENSE-OFL.txt
│   ├── images/                 # Commons photographs & maps
│   ├── tiles/                  # self-hosted basemap tiles (z5–8, WebP)
│   └── og-image.jpg            # 1200×630 social preview
├── scripts/
│   ├── fetch-all-images.mjs    # verified-license image acquisition
│   └── basemap/render.py       # basemap tile renderer
└── index.html                  # Arabic meta, OG tags, canonical URL
```
