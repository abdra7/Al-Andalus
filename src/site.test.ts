/// <reference types="vitest" />
// Guards for the deployment-sensitive pieces: fonts, basemap tiles, books, map labels.
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { books, BOOK_LEVELS, booksByLevel, bookListSources } from "./data/books";
import { periods, searchIndex } from "./data/history";
import basemap from "./data/basemap-manifest.json";
import { GEO_LABELS, MAX_BOUNDS, basemapTileUrl } from "./components/MapView";

const ROOT = process.cwd();

describe("self-hosted fonts", () => {
  const css = readFileSync(resolve(ROOT, "src/styles/fonts.css"), "utf8");
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/['"]/g, ""));

  it("declares the Thmanyah stand-ins", () => {
    expect(css).toMatch(/font-family: 'Alexandria'/);
    expect(css).toMatch(/font-family: 'Markazi Text'/);
  });

  it("every url() is root-absolute under /الأندلس/fonts/ (CSS lives in /الأندلس/assets/)", () => {
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(u, u).toMatch(/^\/الأندلس\/fonts\/[a-z0-9-]+\.woff2$/);
  });

  it("every referenced woff2 exists in public/fonts", () => {
    for (const u of urls) {
      const file = resolve(ROOT, "public/fonts", u.split("/").pop()!);
      expect(existsSync(file), file).toBe(true);
    }
  });

  it("ships only woff2 binaries plus the OFL notice", () => {
    for (const f of readdirSync(resolve(ROOT, "public/fonts"))) {
      expect(f, f).toMatch(/\.woff2$|^LICENSE-OFL\.txt$/);
    }
  });

  it("main.css keeps the three role variables", () => {
    const main = readFileSync(resolve(ROOT, "src/styles/main.css"), "utf8");
    for (const v of ["--font-ui", "--font-serif", "--font-display"]) expect(main).toContain(`${v}:`);
  });

  it("index.html preloads a font that fonts.css actually uses", () => {
    const html = readFileSync(resolve(ROOT, "index.html"), "utf8");
    const pre = html.match(/rel="preload" href="([^"]+)"/)?.[1];
    expect(pre).toBeDefined();
    expect(urls).toContain(decodeURI(pre!));
  });
});

describe("self-hosted basemap", () => {
  const ranges = basemap.ranges as unknown as Record<string, [number, number, number, number]>;

  const tileXY = (lat: number, lng: number, z: number) => {
    const n = 2 ** z;
    const x = Math.floor(((lng + 180) / 360) * n);
    const s = Math.sin((lat * Math.PI) / 180);
    const y = Math.floor((0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n);
    return [x, y];
  };

  it("has a tile range for every native zoom", () => {
    for (let z = basemap.minNativeZoom; z <= basemap.maxNativeZoom; z++) {
      expect(ranges[String(z)], `zoom ${z}`).toBeDefined();
    }
  });

  it("covers the whole pannable area at every native zoom", () => {
    const [[s, w], [n, e]] = MAX_BOUNDS as [[number, number], [number, number]];
    for (let z = basemap.minNativeZoom; z <= basemap.maxNativeZoom; z++) {
      const [x0, y0, x1, y1] = [...tileXY(n, w, z), ...tileXY(s, e, z)];
      const r = ranges[String(z)];
      expect(x0 >= r[0] && x1 <= r[1] && y0 >= r[2] && y1 <= r[3], `zoom ${z}`).toBe(true);
    }
  });

  it("every tile in the manifest exists on disk", () => {
    let count = 0;
    for (const [z, [x0, x1, y0, y1]] of Object.entries(ranges)) {
      for (let x = x0; x <= x1; x++)
        for (let y = y0; y <= y1; y++) {
          const f = resolve(ROOT, "public/tiles", z, String(x), `${y}.${basemap.format}`);
          expect(existsSync(f), f).toBe(true);
          count++;
        }
    }
    expect(count).toBeGreaterThan(500);
  });

  it("tile URLs are relative (resolve under the /الأندلس/ subpath) and never hit a third party", () => {
    const [x, y] = tileXY(37.88, -4.78, 7); // Córdoba
    expect(basemapTileUrl(7, x, y)).toBe(`./tiles/7/${x}/${y}.webp`);
    expect(basemapTileUrl(7, 0, 0)).toMatch(/^data:image\/svg\+xml/);
  });

  it("geographic labels sit inside the pannable area and are Arabic", () => {
    const [[s, w], [n, e]] = MAX_BOUNDS as [[number, number], [number, number]];
    for (const g of GEO_LABELS) {
      expect(g.lat >= s && g.lat <= n && g.lng >= w && g.lng <= e, g.text).toBe(true);
      expect(/[؀-ۿ]/.test(g.text), g.text).toBe(true);
    }
  });
});

describe("recommended books", () => {
  it("lists the five requested titles with authors", () => {
    const authors = books.map((b) => b.author).join(" ");
    for (const a of ["عنان", "السرجاني", "السويدان", "مؤنس", "الحجي"]) expect(authors).toContain(a);
    expect(books).toHaveLength(5);
  });

  it("every book has an https catalogue source (no PDF mirrors)", () => {
    for (const b of books) {
      expect(b.sources.length, b.id).toBeGreaterThan(0);
      for (const s of b.sources) {
        expect(s.url).toMatch(/^https:\/\//);
        expect(s.url, `${b.id} must not link to a PDF host`).not.toMatch(/\.pdf$|foulabook|pdf/i);
      }
    }
    for (const s of bookListSources) expect(s.url).toMatch(/^https:\/\//);
  });

  it("references real periods and sane year spans", () => {
    const ids = new Set(periods.map((p) => p.id));
    for (const b of books) {
      expect(b.coversFrom).toBeGreaterThanOrEqual(711);
      expect(b.coversTo).toBeLessThanOrEqual(1492);
      expect(b.coversFrom).toBeLessThan(b.coversTo);
      for (const p of b.periodIds) expect(ids.has(p), `${b.id}: ${p}`).toBe(true);
    }
  });

  it("groups books by level in reading order", () => {
    const groups = booksByLevel();
    expect(groups.map((g) => g.level)).toEqual(["reference", "general", "period"]);
    expect(groups.every((g) => BOOK_LEVELS[g.level].title.length > 0)).toBe(true);
  });

  it("books are searchable", () => {
    expect(searchIndex.filter((e) => e.kind === "book")).toHaveLength(books.length);
  });
});
