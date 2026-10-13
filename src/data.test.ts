/// <reference types="vitest" />
import { describe, it, expect } from "vitest";
import { normalizeArabic } from "./components/SearchModal";
import {
  cities,
  timelineEvents,
  periods,
  figures,
  searchIndex,
  getCity,
  periodAtYear,
  citiesInPeriod,
  eventsInYearRange,
} from "./data/history";
import { images, getImage } from "./data/images";

describe("normalizeArabic", () => {
  it("unifies alef variants", () => {
    expect(normalizeArabic("الأندلس")).toBe(normalizeArabic("الاندلس"));
  });

  it("strips harakat and tatweel", () => {
    expect(normalizeArabic("قُرْطَبَة")).toBe("قرطبه");
    expect(normalizeArabic("الــزهراء")).toBe("الزهراء"); // ء stays; only tatweel removed
  });

  it("normalizes ta marbuta and alef maqsura", () => {
    expect(normalizeArabic("مالقة")).toBe("مالقه");
    expect(normalizeArabic("قرطبة")).toBe("قرطبه");
    expect(normalizeArabic("الزهراء")).toBe("الزهراء");
    expect(normalizeArabic("مصطفى")).toBe("مصطفي");
  });

  it("lowercases latin", () => {
    expect(normalizeArabic("Córdoba")).toBe("cordoba");
  });

  it("strips latin accents so unaccented queries match", () => {
    expect(normalizeArabic("Córdoba")).toBe(normalizeArabic("Cordoba"));
    expect(normalizeArabic("Madinat al-Zahra")).toBe(normalizeArabic("Madinat al-Zahra"));
  });
});

describe("historical data integrity", () => {
  it("has all 8 required major cities", () => {
    const required = ["cordoba", "granada", "seville", "toledo", "zahra", "malaga", "valencia", "almeria"];
    const ids = cities.filter((c) => c.majorCity).map((c) => c.id);
    for (const r of required) {
      expect(ids, `missing major city: ${r}`).toContain(r);
    }
  });

  it("every city has valid Iberian coordinates", () => {
    for (const c of cities) {
      expect(c.lat, `${c.id} lat`).toBeGreaterThan(34);
      expect(c.lat, `${c.id} lat`).toBeLessThan(45);
      expect(c.lng, `${c.id} lng`).toBeGreaterThan(-11);
      expect(c.lng, `${c.id} lng`).toBeLessThan(5);
    }
  });

  it("cities sit at their real positions (±0.15°)", () => {
    // Reference coordinates of the historic centres (WGS84).
    const ref: Record<string, [number, number]> = {
      cordoba: [37.879, -4.78],
      granada: [37.177, -3.599],
      seville: [37.389, -5.984],
      toledo: [39.857, -4.024],
      zahra: [37.888, -4.867],
      malaga: [36.721, -4.421],
      valencia: [39.47, -0.376],
      almeria: [36.834, -2.464],
    };
    for (const [id, [lat, lng]] of Object.entries(ref)) {
      const c = getCity(id)!;
      expect(Math.abs(c.lat - lat), `${id} lat`).toBeLessThan(0.15);
      expect(Math.abs(c.lng - lng), `${id} lng`).toBeLessThan(0.15);
    }
  });

  it("every city has at least one source", () => {
    for (const c of cities) {
      expect(c.sources.length, `${c.id} has no sources`).toBeGreaterThan(0);
      for (const s of c.sources) expect(s.url).toMatch(/^https:\/\//);
    }
  });

  it("every timeline event has a source and valid category", () => {
    for (const e of timelineEvents) {
      expect(e.sources.length, `${e.id} has no sources`).toBeGreaterThan(0);
      expect(e.year).toBeGreaterThanOrEqual(711);
      expect(e.year).toBeLessThanOrEqual(1492);
    }
  });

  it("timeline is chronologically ordered", () => {
    for (let i = 1; i < timelineEvents.length; i++) {
      expect(timelineEvents[i].year).toBeGreaterThanOrEqual(timelineEvents[i - 1].year);
    }
  });

  it("covers the full span 711–1492", () => {
    const first = timelineEvents[0];
    const last = timelineEvents[timelineEvents.length - 1];
    expect(first.year).toBe(711);
    expect(last.year).toBe(1492);
  });

  it("periods are ordered and cover the span", () => {
    for (let i = 1; i < periods.length; i++) {
      expect(periods[i].startYear).toBeGreaterThan(periods[i - 1].startYear);
    }
    expect(periods[0].startYear).toBe(711);
    expect(periods[periods.length - 1].endYear).toBe(1492);
  });

  it("periodAtYear resolves correctly", () => {
    // 756 is the boundary year: conquest ends 756 and emirate starts 756.
    // The map/overlay uses the FIRST matching period, so boundary years show the earlier period.
    expect(periodAtYear(756)?.id).toBe("conquest");
    expect(periodAtYear(757)?.id).toBe("emirate");
    expect(periodAtYear(929)?.id).toBe("emirate"); // boundary: caliphate starts 929
    expect(periodAtYear(930)?.id).toBe("caliphate");
    expect(periodAtYear(1031)?.id).toBe("caliphate");
    expect(periodAtYear(1032)?.id).toBe("taifas");
    expect(periodAtYear(1237)?.id).toBe("almohads");
    expect(periodAtYear(1238)?.id).toBe("nasrid");
    expect(periodAtYear(700)).toBeUndefined();
    expect(periodAtYear(1500)).toBeUndefined();
  });

  it("citiesInPeriod returns sensible results", () => {
    const nasrid = citiesInPeriod("nasrid");
    expect(nasrid.map((c) => c.id)).toContain("granada");
    const emirate = citiesInPeriod("emirate");
    expect(emirate.map((c) => c.id)).toContain("cordoba");
  });

  it("eventsInYearRange filters correctly", () => {
    const fitna = eventsInYearRange(1000, 1031);
    expect(fitna.length).toBeGreaterThan(0);
    expect(fitna.every((e) => e.year >= 1000 && e.year <= 1031)).toBe(true);
  });

  it("every figure has a role and sources", () => {
    for (const f of figures) {
      expect(f.role.length).toBeGreaterThan(3);
      expect(f.sources.length).toBeGreaterThan(0);
    }
  });

  it("getCity resolves by id", () => {
    expect(getCity("cordoba")?.name).toBe("قرطبة");
    expect(getCity("nope")).toBeUndefined();
  });

  it("search index covers all content types", () => {
    const kinds = new Set(searchIndex.map((e) => e.kind));
    expect(kinds.has("city")).toBe(true);
    expect(kinds.has("event")).toBe(true);
    expect(kinds.has("figure")).toBe(true);
    expect(kinds.has("period")).toBe(true);
  });
});

describe("image dataset", () => {
  it("all images have redistributable licenses", () => {
    for (const img of images) {
      expect(
        ["CC0", "Public domain", "CC BY", "Attribution", "cc-zero"].some((l) => img.license.startsWith(l)),
        `${img.id}: license ${img.license}`,
      ).toBe(true);
    }
  });

  it("all images have a source URL and subpath-safe local path", () => {
    for (const img of images) {
      expect(img.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org/);
      // relative so it resolves under the /الأندلس deployment subpath
      expect(img.localFile, `${img.id} must use a relative path`).toMatch(/^\.\/images\//);
      expect(img.localFile).not.toMatch(/^\/images\//); // root-absolute breaks the subpath
    }
  });

  it("covers every major city subject", () => {
    const subjects = new Set(images.map((i) => i.subject));
    for (const city of ["cordoba", "granada", "seville", "toledo", "malaga", "valencia", "almeria", "zahra"]) {
      expect(subjects.has(city), `no images for ${city}`).toBe(true);
    }
  });

  it("getImage resolves by id", () => {
    expect(getImage(images[0].id)?.id).toBe(images[0].id);
    expect(getImage("nonexistent")).toBeUndefined();
  });

  it("every image has an Arabic caption for alt text", () => {
    for (const img of images) {
      expect(img.arabicCaption, `${img.id} missing arabicCaption`).toBeTruthy();
      // must contain Arabic script
      expect(/[\u0600-\u06FF]/.test(img.arabicCaption), `${img.id} caption not Arabic`).toBe(true);
    }
  });

  it("every major city references an existing image", () => {
    for (const c of cities) {
      if (c.imageId) {
        expect(getImage(c.imageId), `${c.id} references missing image ${c.imageId}`).toBeDefined();
      }
    }
  });
});
