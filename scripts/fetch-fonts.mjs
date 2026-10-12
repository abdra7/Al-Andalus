// Download OFL-licensed Arabic webfonts from Google Fonts for self-hosting.
// Only the Arabic subsets (smallest) plus latin are kept.
// Fonts used (all SIL Open Font License 1.1 — embedding & self-hosting permitted):
//   - IBM Plex Sans Arabic (UI/interface, sans)
//   - Amiri (editorial serif text & display)
//   - Reem Kufi (display headings)
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const UA_CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const OUT_DIR = "public/fonts";
mkdirSync(OUT_DIR, { recursive: true });

const FONTS = [
  { family: "IBM Plex Sans Arabic", slug: "ibmplexsansarabic", weights: [400, 600, 700] },
  { family: "Amiri", slug: "amiri", weights: [400, 700] },
  { family: "Reem Kufi", slug: "reemkufi", weights: [400, 700] },
];

function curl(url, dest) {
  if (!dest) return execFileSync("curl", ["-sS", "--max-time", "60", "-H", `User-Agent: ${UA_CHROME}`, url], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  execFileSync("curl", ["-sS", "--max-time", "60", "-H", `User-Agent: ${UA_CHROME}`, url, "-o", dest], { stdio: "pipe" });
  return "";
}

const cssParts = [];

for (const font of FONTS) {
  const query = font.weights.map((w) => w).join(";");
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@${query}&display=swap`;
  const css = curl(cssUrl);
  // keep only arabic + latin blocks (skip cyrillic-ext etc.)
  const blocks = css.split("/*").map((b) => "/*" + b).filter((b) => b.includes("@font-face"));
  const kept = blocks.filter((b) => b.startsWith("/* arabic") || b.startsWith("/* latin"));
  for (const block of kept) {
    const m = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!m) continue;
    const url = m[0].slice(4, -1).replace(/^url\(/, "");
    const fileName = `${font.slug}-${Math.random().toString(36).slice(2, 8)}.woff2`;
    const dest = `${OUT_DIR}/${fileName}`;
    curl(url, dest);
    const size = Number(execFileSync("stat", ["-c", "%s", dest], { encoding: "utf8" }).trim());
    if (size < 10000) { console.log("TOO SMALL", fileName); continue; }
    // rewrite the block to point at the local file
    const local = block.replace(/url\(https:\/\/[^)]+\.woff2\)/, `url(/fonts/${fileName})`);
    cssParts.push(local);
    console.log(`OK  ${font.family}  ${fileName}  ${Math.round(size / 1024)}KB`);
  }
}

// strip the format() hint line for browser compatibility is fine as-is
const finalCss = `/* Self-hosted Arabic webfonts — SIL Open Font License 1.1.
   IBM Plex Sans Arabic, Amiri, Reem Kufi.
   Source: Google Fonts (https://fonts.google.com). Do not re-license.
   Thmanyah (خط ثمانية) is NOT embedded: its license prohibits web embedding. */
${cssParts.join("\n")}
`;
writeFileSync("src/styles/fonts.css", finalCss);
console.log("\nwrote src/styles/fonts.css");
