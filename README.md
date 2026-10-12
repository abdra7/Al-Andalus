# Al-Andalus — الأندلس: رحلة عبر الزمن

An interactive Arabic historical atlas exploring Al-Andalus through maps, timelines, cities, and verified historical sources.

**Live:** https://abdulrahim.page/%D8%A7%D9%84%D8%A3%D9%86%D8%AF%D9%84%D8%B3 (`https://abdulrahim.page/الأندلس`)

## What this is

A production Arabic RTL web application that presents the history of Al-Andalus (711–1492 CE) as an interactive historical atlas:

- **Interactive map** (Leaflet + CARTO basemap) with accurately positioned historical city markers, custom styling for capitals and the selected city, and a historical-period overlay that dims cities outside the selected era.
- **Horizontal timeline** with 19 verified milestones, category filters (الفتوح، السياسة، الثقافة، العلوم، العمارة، السقوط), and keyboard-accessible selection.
- **City panel** (المدن الرئيسية) with the 8 principal historical cities: قرطبة، غرناطة، إشبيلية، طليطلة، الزهراء، مالقة، بلنسية، المرية.
- **Information panel** (تفاصيل المدينة والحدث) with sourced narratives, event lists, verified historical images with attribution, and source links.
- **Arabic search** with tolerant matching (hamza/alef/ta-marbuta normalization, Latin accent stripping) across cities, events, figures, and periods.
- **Historical library** (المكتبة) organized by subject: الدول والحقب، المدن، الشخصيات، العمارة، العلوم، المصادر.
- **Eras view** (الحقب التاريخية) with expandable period cards.
- **Responsive** desktop / tablet / mobile layouts with a mobile bottom drawer and tab bar.

## Technology

| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Client-focused atlas; no server needed |
| Build | Vite 5 | Fast, relative-base builds for subpath hosting |
| Map | Leaflet 1.9 + react-leaflet | No API key, OSM/CARTO tiles with proper attribution |
| Fonts | IBM Plex Sans Arabic, Amiri, Reem Kufi (self-hosted, OFL) | See font licensing below |
| Tests | Vitest | Data-integrity + search-normalization tests |
| Deploy | Static build → `الأندلس/` subdirectory of the `abdra7.github.io` repo → GitHub Pages | Coexists with the existing portfolio on the same custom domain |

## Local development

```bash
npm install
npm run dev        # http://localhost:5188
npm test           # 23 data-integrity & search tests
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

Web embedding (`@font-face`) is explicitly prohibited, so self-hosting or redistributing the font binaries in this repository or deployment would violate the license. The project therefore uses **SIL Open Font License 1.1** Arabic webfonts that permit embedding:

- **IBM Plex Sans Arabic** — UI and interface text
- **Amiri** — editorial serif passages
- **Reem Kufi** — display headings

The font family stack is centralized in `src/styles/fonts.css`; if Thmanyah grants explicit web-embedding authorization in the future, add its `@font-face` declaration there.

## Deployment architecture

```
github.com/abdra7/Al-Andalus (source of truth)
        │  npm run build
        ▼
      dist/  (relative asset paths: ./assets/…, ./fonts/…, ./images/…)
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
│   │   ├── MapView.tsx         # Leaflet map, markers, period overlay
│   │   ├── CityPanel.tsx       # المدن الرئيسية
│   │   ├── InfoPanel.tsx       # تفاصيل المدينة والحدث
│   │   ├── SearchModal.tsx     # Arabic-tolerant search
│   │   ├── LibraryView.tsx     # المكتبة
│   │   ├── HomeView.tsx        # hero
│   │   └── Icon.tsx            # inline SVG icon set
│   ├── data/
│   │   ├── history.ts          # ALL historical content (cities, events, periods, figures, library)
│   │   ├── images.ts           # image metadata + attribution
│   │   └── images.json         # raw image records
│   └── styles/
│       ├── main.css            # design system (navy/gold/parchment, RTL)
│       └── fonts.css           # self-hosted OFL @font-face declarations
├── public/
│   ├── fonts/                  # OFL woff2 files
│   └── images/                 # Commons photographs & maps
├── scripts/
│   └── fetch-all-images.mjs    # verified-license image acquisition
└── index.html                  # Arabic meta, OG tags, canonical URL
```
