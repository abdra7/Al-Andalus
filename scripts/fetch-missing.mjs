// Targeted fetch for missing subjects: almeria, zaragoza (Aljaferia), artifacts.
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const UA = "al-andalus-portfolio/1.0 (educational historical atlas; contact via GitHub)";
const OUT_DIR = "public/images";

function api(params) {
  const qs = new URLSearchParams({ format: "json", formatversion: "2", ...params }).toString();
  try {
    return JSON.parse(execFileSync("curl", ["-sS", "--max-time", "30", "-H", `User-Agent: ${UA}`,
      `https://commons.wikimedia.org/w/api.php?${qs}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));
  } catch { return null; }
}
function clean(t) {
  if (!t) return "";
  return t.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

const TARGETS = [
  { subject: "almeria", keep: 2, query: "Alcazaba Almeria" },
  { subject: "zaragoza", keep: 2, query: "Aljaferia Zaragoza" },
  { subject: "art", keep: 3, query: "pyxis ivory Islamic Spain" },
];

const existing = JSON.parse(readFileSync("src/data/images.json", "utf8"));
const images = existing.images.filter((i) => !["almeria", "zaragoza", "art"].includes(i.subject));
const added = [];

for (const t of TARGETS) {
  const data = api({
    action: "query", generator: "search",
    gsrsearch: `${t.query} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "20",
    prop: "imageinfo", iiprop: "url|extmetadata|size|mime", iiurlwidth: "1200",
  });
  const pages = data?.query?.pages;
  if (!pages) { console.log("no results", t.query); continue; }
  let kept = 0;
  for (const page of pages) {
    if (kept >= t.keep) break;
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const em = info.extmetadata || {};
    const license = clean(em.LicenseShortName?.value || "");
    if (!["CC0", "Public domain", "CC BY", "Attribution"].some((a) => license.startsWith(a))) continue;
    const w = info.thumbwidth || info.width, h = info.thumbheight || info.height;
    if (!w || !h || w < 700 || h < 450) continue;
    const id = `${t.subject}-${kept + 1}`;
    const ext = (info.mime === "image/png" || (info.thumburl || info.url).endsWith(".png")) ? "png" : "jpg";
    const localName = `${id}.${ext}`;
    const localPath = `${OUT_DIR}/${localName}`;
    try {
      execFileSync("curl", ["-sS", "--max-time", "60", "-H", `User-Agent: ${UA}`, info.thumburl || info.url, "-o", localPath], { stdio: "pipe" });
      const size = Number(execFileSync("stat", ["-c", "%s", localPath], { encoding: "utf8" }).trim());
      if (size < 20000) { require("node:fs").rmSync(localPath); continue; }
      const magic = execFileSync("head", ["-c", "4", localPath], { encoding: "latin1" });
      if (!magic.startsWith("\xff\xd8\xff") && !magic.includes("PNG")) { require("node:fs").rmSync(localPath); continue; }
    } catch { continue; }
    added.push({
      id, subject: t.subject, localFile: `/images/${localName}`, width: w, height: h,
      sourceUrl: info.descriptionurl, license,
      artist: clean(em.Artist?.value || "غير معروف"),
      description: clean(em.ImageDescription?.value || page.title.replace(/^File:/, "").replace(/\.\w+$/, "")).slice(0, 300),
    });
    console.log("OK", id, `[${license}]`, page.title.slice(0, 60));
    kept++;
  }
}

const all = [...images, ...added];
const ts = `// Image metadata for Al-Andalus historical atlas.
// All images sourced from Wikimedia Commons with verified redistribution licenses.
// Raw record: src/data/images.json. Full policy: README.md.

export interface HistoricalImage {
  id: string;
  subject: string;
  localFile: string;
  width: number;
  height: number;
  sourceUrl: string;
  license: string;
  artist: string;
  description: string;
}

export const images: HistoricalImage[] = ${JSON.stringify(all, null, 2)};

const byId = new Map(images.map((img) => [img.id, img]));

export function getImage(id: string): HistoricalImage | undefined {
  return byId.get(id);
}

export function imagesBySubject(subject: string): HistoricalImage[] {
  return images.filter((img) => img.subject === subject);
}
`;
writeFileSync("src/data/images.ts", ts);
writeFileSync("src/data/images.json", JSON.stringify({ images: all }, null, 2));
console.log(`\nTOTAL: ${all.length} images (added ${added.length})`);
