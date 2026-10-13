# Al-Andalus — الأندلس: رحلة عبر الزمن

An interactive Arabic historical atlas exploring Al-Andalus through maps, timelines, cities, and verified historical sources.

**Live:** https://abdulrahim.page/%D8%A7%D9%84%D8%A3%D9%86%D8%AF%D9%84%D8%B3/ (`https://abdulrahim.page/الأندلس/`)

## What this is

A production Arabic RTL web application that presents the history of Al-Andalus (711–1492 CE) as an interactive historical atlas:

- **Interactive map** (Leaflet + a **self-hosted parchment relief basemap**, no third-party tiles) with accurately positioned city markers, Andalusian Arabic names for seas, rivers and regions (بحر الروم، البحر المحيط، بحر الزقاق، الوادي الكبير…), and a period filter that dims cities outside the selected era.
- **Horizontal timeline** with 19 verified milestones, category filters (الفتوح، السياسة، الثقافة، العلوم، العمارة، السقوط), and keyboard-accessible selection.
- **City panel** (المدن الرئيسية) with the 8 principal historical cities: قرطبة، غرناطة، إشبيلية، طليطلة، الزهراء، مالقة، بلنسية، المرية.
- **Information panel** (تفاصيل المدينة والحدث) with sourced narratives, event lists, verified historical images with attribution, and source links.
- **Arabic search** with tolerant matching (hamza/alef/ta-marbuta normalization, Latin accent stripping) across cities, events, figures, periods, and books.
- **Historical library** (المكتبة) with a **bookshelf of recommended Arabic books** (عنان، السرجاني، السويدان، مؤنس، الحجي) grouped by reading level, plus topics: الدول والحقب، المدن، الشخصيات، العمارة، العلوم، المصادر.
- **Eras view** (الحقب التاريخية) with expandable period cards.
- **Responsive** desktop / tablet / mobile layouts with a mobile bottom drawer and tab bar.

## Technology

| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Client-focused atlas; no server needed |
| Build | Vite 5 | Fast, relative-base builds for subpath hosting |
| Map | Leaflet 1.9 + self-hosted WebP tiles (`public/tiles`, z5–8) | No API key, no tile server to break, no visitor IPs sent to third parties |
| Fonts | Alexandria + Markazi Text (self-hosted variable woff2, OFL) | Free stand-ins for Thmanyah — see typography below |
| Tests | Vitest | Data integrity, search normalisation, font URLs, tile coverage, books |
| Deploy | Static build → `الأندلس/` subdirectory of the `abdra7.github.io` repo → GitHub Pages | Coexists with the existing portfolio on the same custom domain |

## Local development

```bash
npm install
npm run dev        # http://localhost:5188
npm test           # 41 tests: data integrity, search, fonts, basemap, books
npm run typecheck  # strict TypeScript
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Adding historical records

All historical content lives in **`src/data/history.ts`** — never inline it in components:

1. **A new city** — append a `City` object to the `cities` array. Required fields: `id`, `name`, `latinName`, `lat`, `lng`, `significance`, `description`, `periods`, `sources`. Add it to `majorCity: true` to surface it in the main panel.
2. **A new timeline event** — append a `TimelineEvent` to `timelineEvents` with `year`, `yearLabel`, `title`, `description`, `category`, and at least one `source`.
3. **A new period** — append to `periods`. Note: periods must not overlap on their boundary year (`periodAtYear` returns the first match).
4. **A new figure** — append to `figures`.
5. **Library entries** — append to `libraryTopics`.
6. **Books** — append to `books` in `src/data/books.ts` (title, author, level, years covered, periods, catalogue source). Link to catalogue pages (Goodreads, WorldCat, CiNii, publisher) — never to PDF mirrors.

**Every record requires at least one source with a real `url`.** The test suite (`src/data.test.ts`) enforces sources, coordinate sanity, chronological ordering, and image-reference integrity — run `npm test` after any data change.

### Adding images

Images are fetched from Wikimedia Commons with license verification:

```bash
node scripts/fetch-all-images.mjs   # rebuilds src/data/images.ts from Commons
```

Only CC0 / Public domain / CC BY / CC BY-SA images are accepted. Each image records: `id`, `localFile`, `sourceUrl`, `license`, `artist`, `description`. Full attribution is rendered in the UI caption and recorded in `src/data/images.json`.

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
- **Every `@font-face` URL must be root-absolute** (`/الأندلس/fonts/…`): the CSS bundle is served from `/الأندلس/assets/`, so a relative `./fonts/…` would resolve to `/الأندلس/assets/fonts/…` and 404. `src/site.test.ts` enforces this and checks the files exist.
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
      dist/  (relative: ./assets/…, ./images/…, ./tiles/… — fonts root-absolute: /الأندلس/fonts/…)
        │  copied into the الأندلس/ subdirectory
        ▼
github.com/abdra7/abdra7.github.io (the site serving abdulrahim.page)
        │  GitHub Pages
        ▼
https://abdulrahim.page/الأندلس
```

Why this architecture: `abdulrahim.page` is served by GitHub Pages from the `abdra7.github.io` repository (CNAME verified). GitHub Pages serves Arabic UTF-8 paths correctly (verified with an HTTP probe: `/الأندلس/…` returns 200 for both the encoded and raw forms). Building with `base: "./"` produces relative asset URLs so the app works beneath any subpath without broken references.

Deploy steps (documented and reproducible):

```bash
npm run build
# copy dist/* into the الأندلس/ directory of a clone of abdra7/abdra7.github.io
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
