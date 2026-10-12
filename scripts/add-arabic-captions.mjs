// Adds Arabic captions/alt text to the image dataset.
// English Commons descriptions are translated/paraphrased into Arabic so every
// <img alt> and figcaption is Arabic, per the project language requirement.
// Attribution fields (artist/license/sourceUrl) are preserved untouched.
import { readFileSync, writeFileSync } from "node:fs";

const ARABIC_CAPTIONS = {
  // subject-level fallbacks by keyword match
  "alhambra-1": "بوابة النبيذ في قصر الحمراء بغرناطة",
  "alhambra-2": "منظر عام لقصر الحمراء في غرناطة",
  "alhambra-3": "نافورة فناء الأسود في الحمراء",
  "alhambra-4": "تفصيل زخرفي في فناء Arrayanes بالحمراء",
  "generalife-1": "نوافير قصر جينيراليف التابع للحمراء",
  "generalife-2": "نبتة الفربيون المهدّبة في حدائق جينيراليف",
  "granada-1": "بانوراما الحمراء من جهة غرناطة (جزء 1)",
  "granada-2": "بانوراما الحمراء من جهة غرناطة (جزء 2)",
  "granada-3": "بانوراما الحمراء من جهة غرناطة (جزء 3)",
  "cordoba-mosque-1": "الداخل الجامع الكبير في قرطبة بأقواسه المزدوجة",
  "cordoba-mosque-2": "جامع قرطبة الكبير — صورة تاريخية من مكتبة الكونغرس",
  "cordoba-mosque-3": "قوس داخلي في جامع قرطبة الكبير",
  "cordoba-mosque-4": "الأقواس المزدوجة الشهيرة في جامع قرطبة",
  "cordoba-1": "جامع-كاتدرائية قرطبة: امتزاج الفنون المسيحية والمورية",
  "cordoba-2": "وسط قرطبة التاريخي",
  "cordoba-3": "وسط قرطبة التاريخي — مشهد عمراني",
  "zahra-1": "آثار مدينة الزهراء قرب قرطبة",
  "zahra-2": "أطلال مدينة الزهراء الخلافية",
  "zahra-3": "فناء النساء في قصر الملوك المسيحيين بقرطبة",
  "seville-1": "ميدان العذراء في إشبيلية مع الكاتدرائية والخيرالدا",
  "seville-2": "أسوار قصر الكازار الحقيقي على نهر الوادي الكبير بإشبيلية",
  "seville-3": "برج الخيرالدا كما يبدو من قصر الكازار بإشبيلية",
  "seville-4": "منظر على برج الخيرالدا من قصر الكازار",
  "toledo-1": "منظر عام لمدينة طليطلة",
  "toledo-2": "مدينة طليطلة التاريخية",
  "toledo-3": "جسر طليطلة التاريخي",
  "malaga-1": "غروب الشمس على مدينة مالقة",
  "malaga-2": "قلعة مالقة كما تبدو من جبل الفارو",
  "malaga-3": "قلعة جبل الفارو في مالقة",
  "valencia-1": "لونخة الحرير في بلنسية — تحفة العمارة القوطية",
  "valencia-2": "لونخة الحرير في بلنسية",
  "almeria-1": "قلعة الحصون (القلعة) في المرية",
  "almeria-2": "برج قلعة المرية",
  "zaragoza-1": "قصر الجعفرية في سرقسطة",
  "zaragoza-2": "قصر الجعفرية في سرقسطة — تفصيل معماري",
  "art-1": "علبة المغيرة العاجية — من روائع فن الأندلس",
  "art-2": "حاوية عاجية مزخرفة من التراث الأندلسي",
  "art-3": "علبة خلف العاجية — متحف المتروبوليتان",
  "map-north-africa-andalus-map-800-png": "خريطة شمال أفريقيا والأندلس نحو عام 800م",
  "map-al-andalus-siglos-xii-xiii-jpg": "خريطة الأندلس في القرنين الثاني عشر والثالث عشر",
  "map-mapa-de-al-andalus-ibn-hawqal-c-950-jpg": "خريطة الأندلس لابن حوقل (نحو 950م)",
};

const data = JSON.parse(readFileSync("src/data/images.json", "utf8"));
let matched = 0;
for (const img of data.images) {
  const cap = ARABIC_CAPTIONS[img.id];
  if (cap) {
    img.arabicCaption = cap;
    matched++;
  } else {
    // fallback: keep a neutral Arabic caption from the id
    img.arabicCaption = `صورة تاريخية من ${img.subject}`;
  }
}
writeFileSync("src/data/images.json", JSON.stringify({ images: data.images }, null, 2));

// regenerate images.ts with the arabicCaption field
const ts = `// Image metadata for Al-Andalus historical atlas.
// All images sourced from Wikimedia Commons with verified redistribution licenses.
// arabicCaption provides the Arabic alt text / figcaption used in the UI.
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
  arabicCaption: string;
}

export const images: HistoricalImage[] = ${JSON.stringify(data.images, null, 2)};

const byId = new Map(images.map((img) => [img.id, img]));

export function getImage(id: string): HistoricalImage | undefined {
  return byId.get(id);
}

export function imagesBySubject(subject: string): HistoricalImage[] {
  return images.filter((img) => img.subject === subject);
}
`;
writeFileSync("src/data/images.ts", ts);
console.log(`Arabic captions: ${matched} explicit of ${data.images.length}`);
