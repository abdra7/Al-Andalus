// Re-download all Al-Andalus images from Wikimedia Commons with clean filenames.
// Verifies license permits redistribution; records full attribution in images.json/images.ts.
import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const UA = "al-andalus-portfolio/1.0 (educational historical atlas; contact via GitHub)";
const OUT_DIR = "public/images";
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const ALLOWED_PREFIXES = ["CC0", "Public domain", "CC BY", "Attribution", "cc-zero"];

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
function download(url, dest) {
  execFileSync("curl", ["-sS", "--max-time", "60", "-H", `User-Agent: ${UA}`, url, "-o", dest], { stdio: "pipe" });
  const size = Number(execFileSync("stat", ["-c", "%s", dest], { encoding: "utf8" }).trim());
  // verify it's an image (JPEG FFD8 / PNG 89504E47)
  const magic = execFileSync("head", ["-c", "4", dest], { encoding: "latin1" });
  const isImg = magic.startsWith("\xff\xd8\xff") || magic === "\x89PNG" || magic.includes("PNG");
  return { size, isImg };
}

// [subject, keep, query]
const SUBJECTS = [
  ["alhambra", 4, "Alhambra Granada"],
  ["generalife", 2, "Generalife Granada"],
  ["granada", 3, "Granada Alhambra panorama"],
  ["cordoba-mosque", 4, "Mezquita Cathedral Cordoba interior arches"],
  ["cordoba", 3, "Cordoba historic centre"],
  ["zahra", 3, "Medina Azahara ruins"],
  ["seville", 4, "Seville Giralda"],
  ["toledo", 3, "Toledo Spain historic"],
  ["malaga", 3, "Malaga Alcazaba"],
  ["valencia", 2, "Lonja de la Seda Valencia"],
  ["almeria", 2, "Alcazaba de Almeria"],
  ["zaragoza", 2, "Aljaferia palace Zaragoza"],
  ["art-pyxis", 3, "Pyxis al-Mughira ivory"],
  ["art-ceramic", 2, "Hispano-Moresque ceramic"],
];

// explicit title list for maps (resolved earlier)
const MAP_TITLES = [
  "File:Al Andalus - 2.png",
  "File:Al Andalus & Christian Kingdoms.svg",
  "File:Al Andalus geopolitico.png",
  "File:Al-Andalus (732).svg",
  "File:Al-Andalus Vilayet 750AD.png",
  "File:North Africa & Andalus map 800.png",
  "File:Al-Andalus, siglos XII-XIII.jpg",
  "File:Mapa de al-Andalus, Ibn Hawqal (c. 950).jpg",
  "File:Marca Superior al-Andalus 950 (estructura territorial).png",
];

const images = [];

for (const [subject, keep, query] of SUBJECTS) {
  const data = api({
    action: "query", generator: "search",
    gsrsearch: `${query} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "20",
    prop: "imageinfo", iiprop: "url|extmetadata|size|mime", iiurlwidth: "1200",
  });
  const pages = data?.query?.pages;
  if (!pages) continue;
  let kept = 0;
  for (const page of pages) {
    if (kept >= keep) break;
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const em = info.extmetadata || {};
    const license = clean(em.LicenseShortName?.value || "");
    if (!ALLOWED_PREFIXES.some((a) => license.startsWith(a))) continue;
    const w = info.thumbwidth || info.width, h = info.thumbheight || info.height;
    if (!w || !h || w < 700 || h < 450) continue;
    const id = `${subject}-${kept + 1}`;
    const ext = (info.mime === "image/png" || (info.thumburl || info.url).endsWith(".png")) ? "png" : "jpg";
    const localName = `${id}.${ext}`;
    const localPath = `${OUT_DIR}/${localName}`;
    try {
      const { size, isImg } = download(info.thumburl || info.url, localPath);
      if (size < 20000 || !isImg) { rmSync(localPath); continue; }
    } catch { continue; }
    images.push({
      id, subject, localFile: `/images/${localName}`, width: w, height: h,
      sourceUrl: info.descriptionurl, license,
      artist: clean(em.Artist?.value || "غير معروف"),
      description: clean(em.ImageDescription?.value || page.title.replace(/^File:/, "").replace(/\.\w+$/, "")).slice(0, 300),
    });
    console.log(`OK   ${id}  [${license}]`);
    kept++;
  }
}

for (const title of MAP_TITLES) {
  const data = api({ action: "query", titles: title, prop: "imageinfo", iiprop: "url|extmetadata|size|mime", iiurlwidth: "1400" });
  const page = data?.query?.pages?.[0];
  if (!page || page.missing || !page.imageinfo?.[0]) { console.log("MISS", title); continue; }
  const info = page.imageinfo[0];
  const em = info.extmetadata || {};
  const license = clean(em.LicenseShortName?.value || "");
  if (!ALLOWED_PREFIXES.some((a) => license.startsWith(a))) { console.log("SKIP", title, license); continue; }
  const slug = title.replace(/^File:/, "").replace(/[^A-Za-z0-9]+/g, "-").toLowerCase().replace(/^-|-$/g, "").slice(0, 40);
  const id = `map-${slug}`;
  const isSvg = /\.svg$/i.test(title);
  const ext = isSvg ? "png" : (info.mime === "image/png" ? "png" : "jpg");
  const localName = `${id}.${ext}`;
  const localPath = `${OUT_DIR}/${localName}`;
  try {
    const { size, isImg } = download(info.thumburl || info.url, localPath);
    if (size < 10000 || !isImg) { rmSync(localPath); console.log("BAD", id); continue; }
  } catch { console.log("DLFAIL", title); continue; }
  images.push({
    id, subject: "maps", localFile: `/images/${localName}`,
    width: info.thumbwidth || info.width, height: info.thumbheight || info.height,
    sourceUrl: info.descriptionurl, license,
    artist: clean(em.Artist?.value || "غير معروف"),
    description: clean(em.ImageDescription?.value || title.replace(/^File:/, "").replace(/\.\w+$/, "")).slice(0, 300),
  });
  console.log(`OK   ${id}  [${license}]`);
}

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

export const images: HistoricalImage[] = ${JSON.stringify(images, null, 2)};

const byId = new Map(images.map((img) => [img.id, img]));

export function getImage(id: string): HistoricalImage | undefined {
  return byId.get(id);
}

export function imagesBySubject(subject: string): HistoricalImage[] {
  return images.filter((img) => img.subject === subject);
}
`;
writeFileSync("src/data/images.ts", ts);
writeFileSync("src/data/images.json", JSON.stringify({ images }, null, 2));
console.log(`\nTOTAL: ${images.length} images, ${readdirSync(OUT_DIR).length} files on disk`);
