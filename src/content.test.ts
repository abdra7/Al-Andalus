/// <reference types="vitest" />
// Integrity of the enriched content: every reference resolves, every record is sourced.
import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { cities, figures, periods, timelineEvents, getCity, getPeriod, searchIndex } from "./data/history";
import { books } from "./data/books";
import { images, getImage } from "./data/images";

const ROOT = process.cwd();
const httpsOnly = (url: string) => expect(url).toMatch(/^https:\/\//);

describe("images", () => {
  it("every image and thumbnail file exists as WebP", () => {
    for (const img of images) {
      expect(img.localFile, img.id).toMatch(/^\.\/images\/[a-z0-9-]+\.webp$/);
      expect(img.thumbFile, img.id).toMatch(/^\.\/images\/thumbs\/[a-z0-9-]+\.webp$/);
      expect(existsSync(resolve(ROOT, "public", img.localFile.slice(2))), img.localFile).toBe(true);
      expect(existsSync(resolve(ROOT, "public", img.thumbFile.slice(2))), img.thumbFile).toBe(true);
    }
  });

  it("ids are unique and every caption is Arabic", () => {
    expect(new Set(images.map((i) => i.id)).size).toBe(images.length);
    for (const img of images) expect(/[؀-ۿ]/.test(img.arabicCaption), img.id).toBe(true);
  });

  it("misattributed pictures stay out of the atlas", () => {
    for (const id of ["malaga-2", "toledo-3", "generalife-2"]) expect(getImage(id), id).toBeUndefined();
  });

  it("files stay web-sized", () => {
    for (const img of images) {
      const bytes = statSync(resolve(ROOT, "public", img.localFile.slice(2))).size;
      expect(bytes, img.id).toBeLessThan(600_000);
      expect(Math.max(img.width, img.height), img.id).toBeLessThanOrEqual(1200);
    }
  });
});

describe("cities", () => {
  it("lead image, gallery and landmark images all resolve", () => {
    for (const c of cities) {
      for (const id of [c.imageId, ...(c.gallery ?? []), ...(c.landmarks ?? []).map((l) => l.imageId)]) {
        if (id) expect(getImage(id), `${c.id} → ${id}`).toBeDefined();
      }
    }
  });

  it("includes Zaragoza at its real position", () => {
    const z = getCity("zaragoza")!;
    expect(z.name).toBe("سرقسطة");
    expect(Math.abs(z.lat - 41.65)).toBeLessThan(0.1);
    expect(Math.abs(z.lng + 0.88)).toBeLessThan(0.1);
  });

  it("every city event is sourced", () => {
    for (const c of cities) for (const e of c.events) expect(e.sources.length, `${c.id}: ${e.title}`).toBeGreaterThan(0);
  });
});

describe("periods", () => {
  it("each has a capital, rulers, a map and further reading that exists on the shelf", () => {
    const shelf = new Set(books.map((b) => b.id));
    for (const p of periods) {
      expect(p.capital.length, p.id).toBeGreaterThan(2);
      expect(p.rulers.length, p.id).toBeGreaterThan(2);
      expect(p.mapImageId && getImage(p.mapImageId), `${p.id} map`).toBeTruthy();
      expect(p.furtherReading.length, p.id).toBeGreaterThan(0);
      for (const r of p.furtherReading) expect(shelf.has(r.bookId), `${p.id} → ${r.bookId}`).toBe(true);
      for (const l of p.landmarks ?? []) {
        if (l.imageId) expect(getImage(l.imageId), `${p.id} → ${l.imageId}`).toBeDefined();
        if (l.cityId) expect(getCity(l.cityId), `${p.id} → ${l.cityId}`).toBeDefined();
      }
      p.sources.forEach((s) => httpsOnly(s.url));
    }
  });
});

describe("figures", () => {
  it("there are at least 25, with unique ids", () => {
    expect(figures.length).toBeGreaterThanOrEqual(25);
    expect(new Set(figures.map((f) => f.id)).size).toBe(figures.length);
  });

  it("every figure links to a real period, city and image, and is sourced", () => {
    for (const f of figures) {
      expect(getPeriod(f.periodId), `${f.id} period`).toBeDefined();
      if (f.cityId) expect(getCity(f.cityId), `${f.id} city`).toBeDefined();
      if (f.imageId) expect(getImage(f.imageId), `${f.id} image`).toBeDefined();
      expect(f.sources.length, f.id).toBeGreaterThan(0);
      f.sources.forEach((s) => httpsOnly(s.url));
      if (f.born !== undefined && f.died !== undefined) expect(f.born, f.id).toBeLessThan(f.died);
    }
  });

  it("figures are searchable", () => {
    expect(searchIndex.filter((e) => e.kind === "figure")).toHaveLength(figures.length);
  });
});

describe("timeline", () => {
  it("has unique ids and every event image resolves", () => {
    expect(new Set(timelineEvents.map((e) => e.id)).size).toBe(timelineEvents.length);
    expect(timelineEvents.length).toBeGreaterThanOrEqual(26);
    for (const e of timelineEvents) if (e.imageId) expect(getImage(e.imageId), e.id).toBeDefined();
  });
});

describe("music", () => {
  it("ships one compact looping track", () => {
    const f = resolve(ROOT, "public/audio/andalus-music.m4a");
    expect(existsSync(f)).toBe(true);
    expect(statSync(f).size).toBeLessThan(12_000_000);
  });
});

describe("search aliases", () => {
  it("finds figures by common alternative names", async () => {
    const { searchIndex: idx } = await import("./data/history");
    const { normalizeArabic } = await import("./components/SearchModal");
    const hit = (q: string) =>
      idx.some((e) => [e.title, e.latinName ?? "", ...(e.aliases ?? [])].some((t) => normalizeArabic(t).includes(normalizeArabic(q))));
    for (const q of ["ابن ميمون", "Averroes", "Boabdil", "المنصور", "سرقسطة", "عنان"]) expect(hit(q), q).toBe(true);
  });
});
