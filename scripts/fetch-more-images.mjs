#!/usr/bin/env node
// Downloads extra Wikimedia Commons images for the atlas (cities, periods, events, figures).
//
// Run it on a machine that can reach Wikimedia (Node 18+, no npm install needed):
//     node scripts/fetch-more-images.mjs            (or: node data/fetch-more-images.mjs)
//
// Output: data/incoming-images/<id>.(jpg|png) + data/incoming-images/manifest.json
// Only licences that allow redistribution are kept (CC0, public domain, CC BY, CC BY-SA).
// Nothing is published automatically: every picture is reviewed, captioned in Arabic and
// converted to WebP before it is added to public/images and src/data/images.ts.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = join("data", "incoming-images");
const UA = "al-andalus-atlas/1.1 (https://abdulrahim.page/; educational historical atlas)";
const WIDTH = 1280; // a standard Wikimedia thumbnail step
const API = "https://commons.wikimedia.org/w/api.php";

const LICENCE_OK = (s) =>
  !!s && !/\b(NC|ND)\b|non-?commercial|no-?deriv/i.test(s) &&
  /^(CC0|Public domain|PD\b|PD-|CC BY|CC-BY|Attribution|Copyrighted free use)/i.test(s.trim());

// key → what to look for. `titles` are tried first, then each query until `want` images pass.
// kind "map" allows SVG/PNG drawings; everything else must be a photo or painting (bitmap).
const WANTED = [
  // ---- cities: monuments not yet in the gallery ----
  { key: "cordoba-mihrab", want: 2, queries: ["Mihrab Mezquita de Córdoba", "Maqsura Mezquita Córdoba cúpula"] },
  { key: "cordoba-calahorra", want: 1, queries: ["Puente romano Córdoba Torre de la Calahorra"] },
  { key: "cordoba-banos", want: 1, queries: ["Baños del Alcázar Califal Córdoba"] },
  { key: "granada-comares", want: 1, queries: ["Patio de los Arrayanes Torre de Comares Alhambra"] },
  { key: "granada-albaicin", want: 1, queries: ["Albaicín Granada Alhambra desde mirador San Nicolás"] },
  { key: "granada-banuelo", want: 1, queries: ["El Bañuelo Granada baños árabes"] },
  { key: "granada-madraza", want: 1, queries: ["Madraza de Granada oratorio mihrab"] },
  { key: "seville-torre-oro", want: 1, queries: ["Torre del Oro Sevilla"] },
  { key: "seville-yeso", want: 1, queries: ["Patio del Yeso Real Alcázar Sevilla"] },
  { key: "seville-naranjos", want: 1, queries: ["Patio de los Naranjos Catedral de Sevilla"] },
  { key: "toledo-cristo-luz", want: 2, queries: ["Mezquita del Cristo de la Luz Toledo"] },
  { key: "toledo-bisagra", want: 1, queries: ["Puerta de Alfonso VI Bisagra Antigua Toledo"] },
  { key: "zahra-salon-rico", want: 2, queries: ["Salón Rico Medina Azahara", "Medina Azahara Salón de Abd al-Rahman III"] },
  { key: "malaga-alcazaba", want: 2, queries: ["Alcazaba de Málaga patio arcos", "Alcazaba Málaga Cuartos de Granada"] },
  { key: "malaga-gibralfaro", want: 1, queries: ["Castillo de Gibralfaro murallas Málaga"] },
  { key: "valencia-muralla", want: 1, queries: ["Muralla árabe de Valencia restos"] },
  { key: "valencia-banos", want: 1, queries: ["Baños del Almirante Valencia"] },
  { key: "almeria-jayran", want: 1, queries: ["Muralla de Jayrán Almería"] },
  { key: "zaragoza-oratorio", want: 2, queries: ["Aljafería oratorio mihrab", "Aljafería Patio de Santa Isabel"] },

  // ---- periods: historical maps ----
  { key: "map-conquest", kind: "map", want: 2, titles: ["File:Al-Andalus (732).svg"], queries: ["Al-Andalus 732 map"] },
  { key: "map-emirate", kind: "map", want: 2, queries: ["Emirate of Córdoba map", "Emirato de Córdoba mapa"] },
  { key: "map-taifas", kind: "map", want: 2, queries: ["Taifa kingdoms map 1031", "Reinos de taifas mapa"] },
  { key: "map-almoravids", kind: "map", want: 2, queries: ["Almoravid empire map", "Imperio almorávide mapa"] },
  { key: "map-almohads", kind: "map", want: 2, queries: ["Almohad Caliphate map", "Imperio almohade mapa"] },
  { key: "map-nasrid", kind: "map", want: 2, queries: ["Nasrid Kingdom of Granada map", "Reino nazarí de Granada mapa"] },

  // ---- events: 19th-century history paintings (public domain) ----
  { key: "event-guadalete", want: 2, queries: ["Don Rodrigo arengando a sus tropas en la batalla de Guadalete", "Batalla de Guadalete pintura"] },
  { key: "event-navas", want: 2, queries: ["Batalla de las Navas de Tolosa Van Halen"] },
  { key: "event-rendicion", want: 2, titles: ["File:La Rendición de Granada - Pradilla.jpg"], queries: ["La rendición de Granada Pradilla"] },
  { key: "event-suspiro", want: 1, queries: ["El suspiro del moro Pradilla"] },

  // ---- figures: monuments and objects tied to them (never invented portraits) ----
  { key: "fig-gibraltar", want: 1, queries: ["Rock of Gibraltar from La Línea"] },
  { key: "fig-abd-al-rahman-i", want: 2, queries: ["Estatua de Abderramán I Almuñécar"] },
  { key: "fig-almanzor", want: 2, queries: ["Estatua de Almanzor Calatañazor", "Estatua de Almanzor Algeciras"] },
  { key: "fig-averroes", want: 2, queries: ["Estatua de Averroes Córdoba"] },
  { key: "fig-maimonides", want: 2, queries: ["Estatua de Maimónides Córdoba"] },
  { key: "fig-ibn-hazm", want: 2, queries: ["Monumento a Ibn Hazm Córdoba"] },
  { key: "fig-ibn-firnas", want: 1, queries: ["Puente de Abbás Ibn Firnás Córdoba"] },
  { key: "fig-ibn-zaydun", want: 2, queries: ["Monumento a Ibn Zaydún y Wallada Córdoba", "Ibn Zaydun Wallada monumento"] },
  { key: "fig-al-mutamid", want: 2, queries: ["Al-Mutamid monumento Silves", "Almutamid estátua Silves"] },
  { key: "fig-ibn-baytar", want: 2, queries: ["Ibn al-Baitar estatua Benalmádena"] },
  { key: "fig-ibn-khatib", want: 2, queries: ["Ibn al-Jatib monumento Loja"] },
  { key: "fig-ibn-arabi", want: 2, queries: ["Ibn Arabi Murcia monumento", "Ibn Arabi busto"] },
  { key: "fig-zahrawi", want: 2, queries: ["Al-Tasrif surgical instruments manuscript", "Albucasis instrumentos quirúrgicos manuscrito"] },
  { key: "fig-nasrid-motto", want: 1, queries: ["Wa la ghaliba illa Allah Alhambra", "Lema nazarí Alhambra inscripción"] },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, asJson = true, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, "Api-User-Agent": UA } });
      if (res.status === 429 || res.status >= 500) {
        await sleep(2000 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return asJson ? await res.json() : Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1500 * (i + 1));
    }
  }
  throw new Error("unreachable");
}

const strip = (s) =>
  (s ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const IIPROPS = {
  prop: "imageinfo",
  iiprop: "url|size|mime|extmetadata",
  iiurlwidth: String(WIDTH),
  iiextmetadatafilter: "LicenseShortName|Artist|ImageDescription|ObjectName|DateTimeOriginal|Credit",
  iiextmetadatalanguage: "en",
};

async function query(params) {
  const qs = new URLSearchParams({ action: "query", format: "json", formatversion: "2", origin: "*", ...IIPROPS, ...params });
  const data = await get(`${API}?${qs}`);
  const pages = data?.query?.pages ?? [];
  return pages.filter((p) => p.imageinfo?.[0]).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

function acceptable(page, kind) {
  const ii = page.imageinfo[0];
  const m = ii.extmetadata ?? {};
  const licence = strip(m.LicenseShortName?.value);
  if (!LICENCE_OK(licence)) return { ok: false, why: `licence: ${licence || "?"}` };
  const isDrawing = /svg|png|gif/.test(ii.mime);
  if (kind !== "map" && /svg/.test(ii.mime)) return { ok: false, why: "svg" };
  if (/pdf|tiff|djvu|video|audio/.test(ii.mime)) return { ok: false, why: ii.mime };
  const minW = kind === "map" || isDrawing ? 600 : 900;
  if (ii.width < minW) return { ok: false, why: `too small (${ii.width}px)` };
  const ratio = ii.width / ii.height;
  if (ratio > 2.6 || ratio < 0.45) return { ok: false, why: `aspect ${ratio.toFixed(2)}` };
  return { ok: true, licence };
}

const existing = new Set();
try {
  const old = JSON.parse(readFileSync(join("src", "data", "images.json"), "utf8"));
  for (const img of old.images ?? []) existing.add(img.sourceUrl);
} catch {
  /* fine: run outside the repo */
}

mkdirSync(OUT, { recursive: true });
const manifest = { generated: new Date().toISOString(), width: WIDTH, images: [], misses: [] };
const taken = new Set();

for (const w of WANTED) {
  const picked = [];
  const rejected = [];
  const consider = async (pages) => {
    for (const p of pages) {
      if (picked.length >= w.want) return;
      const ii = p.imageinfo[0];
      if (existing.has(ii.descriptionurl) || taken.has(ii.descriptionurl)) continue;
      const a = acceptable(p, w.kind);
      if (!a.ok) {
        rejected.push(`${p.title} — ${a.why}`);
        continue;
      }
      picked.push({ p, licence: a.licence });
      taken.add(ii.descriptionurl);
    }
  };
  try {
    if (w.titles?.length) await consider(await query({ titles: w.titles.join("|") }));
    for (const q of w.queries ?? []) {
      if (picked.length >= w.want) break;
      const ft = w.kind === "map" ? "filetype:bitmap|drawing" : "filetype:bitmap";
      await consider(await query({ generator: "search", gsrsearch: `${q} ${ft}`, gsrnamespace: "6", gsrlimit: "12" }));
      await sleep(400);
    }
  } catch (e) {
    console.log(`✗ ${w.key}: ${e.message}`);
  }

  let n = 0;
  for (const { p, licence } of picked) {
    n += 1;
    const ii = p.imageinfo[0];
    const m = ii.extmetadata ?? {};
    const src = ii.thumburl || ii.url;
    const ext = /\.png($|\?)/i.test(src) ? "png" : "jpg";
    const id = `${w.key}-${n}`;
    try {
      const buf = await get(src, false);
      writeFileSync(join(OUT, `${id}.${ext}`), buf);
      manifest.images.push({
        id,
        key: w.key,
        file: `${id}.${ext}`,
        title: p.title,
        sourceUrl: ii.descriptionurl,
        license: licence,
        artist: strip(m.Artist?.value),
        credit: strip(m.Credit?.value),
        description: strip(m.ImageDescription?.value).slice(0, 600),
        objectName: strip(m.ObjectName?.value),
        date: strip(m.DateTimeOriginal?.value),
        originalWidth: ii.width,
        originalHeight: ii.height,
        bytes: buf.length,
      });
      console.log(`✓ ${id}  ${p.title}  [${licence}]`);
    } catch (e) {
      console.log(`✗ ${id}: download failed (${e.message})`);
    }
    await sleep(500);
  }
  if (picked.length < w.want) manifest.misses.push({ key: w.key, found: picked.length, want: w.want, rejected: rejected.slice(0, 6) });
}

writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
const mb = (manifest.images.reduce((s, i) => s + i.bytes, 0) / 1e6).toFixed(1);
console.log(`\nDone: ${manifest.images.length} images (${mb} MB) in ${OUT}`);
if (manifest.misses.length) console.log(`Not found / short: ${manifest.misses.map((m) => m.key).join(", ")}`);
if (!existsSync(join(OUT, "manifest.json"))) process.exit(1);
