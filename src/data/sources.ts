// Reference sources cited across the atlas. Every page here was opened and checked
// for the specific facts it supports. Prefer adding a source to inventing one.

import type { Source } from "./types";

export const UNESCO_GRANADA: Source = {
  title: "اليونسكو — الحمراء وجنة العريف والبيازين، غرناطة",
  url: "https://whc.unesco.org/en/list/314/",
  publisher: "UNESCO World Heritage Centre",
};
export const UNESCO_CORDOBA: Source = {
  title: "اليونسكو — وسط قرطبة التاريخي",
  url: "https://whc.unesco.org/en/list/313",
  publisher: "UNESCO World Heritage Centre",
};
export const UNESCO_ZAHRA: Source = {
  title: "اليونسكو — مدينة الزهراء الخلافية",
  url: "https://whc.unesco.org/en/list/1560",
  publisher: "UNESCO World Heritage Centre",
};
export const MET_ANDALUS: Source = {
  title: "متحف المتروبوليتان — الأندلس: فن إسبانيا الإسلامية",
  url: "https://www.metmuseum.org/es/met-publications/al-andalus-the-art-of-islamic-spain",
  publisher: "The Metropolitan Museum of Art",
};
export const COMMONS_MAP: Source = {
  title: "ويكيميديا كومنز — خرائط تاريخية للأندلس",
  url: "https://commons.wikimedia.org/wiki/Category:Maps_of_al-Andalus",
  publisher: "Wikimedia Commons",
};
export const BRITANNICA: Source = {
  title: "Encyclopaedia Britannica — Al-Andalus",
  url: "https://www.britannica.com/place/al-Andalus",
  publisher: "Encyclopaedia Britannica",
};
export const BRITANNICA_MUSLIM_SPAIN: Source = {
  title: "Encyclopaedia Britannica — Spain: Muslim Spain",
  url: "https://www.britannica.com/place/Spain/Muslim-Spain",
  publisher: "Encyclopaedia Britannica",
};
export const ENC_ISLAM: Source = {
  title: "الموسوعة الإسلامية — أندلس (EI2/EI3)",
  url: "https://referenceworks.brill.com/display/db/eiso",
  publisher: "Brill",
};

/** An English Wikipedia article, checked for the facts it is cited for. */
export function wiki(article: string, label: string): Source {
  return {
    title: `ويكيبيديا (بالإنجليزية) — ${label}`,
    url: `https://en.wikipedia.org/wiki/${encodeURI(article.replace(/ /g, "_"))}`,
    publisher: "Wikipedia",
  };
}

// Frequently cited articles
export const W = {
  governors: wiki("List of Umayyad governors of al-Andalus", "ولاة الأندلس الأمويون"),
  emirate: wiki("Emirate of Córdoba", "إمارة قرطبة"),
  hisham2: wiki("Hisham II", "هشام المؤيد"),
  taifa: wiki("Taifa", "ملوك الطوائف"),
  almoravids: wiki("Almoravid dynasty", "المرابطون"),
  almohads: wiki("Almohad Caliphate", "الموحدون"),
  granadaEmirate: wiki("Emirate of Granada", "مملكة غرناطة"),
  mosqueCordoba: wiki("Mosque–Cathedral of Córdoba", "جامع قرطبة"),
  zahra: wiki("Medina Azahara", "مدينة الزهراء"),
  alhambra: wiki("Alhambra", "الحمراء"),
  giralda: wiki("Giralda", "الخيرالدا"),
  torreOro: wiki("Torre del Oro", "برج الذهب"),
  babMardum: wiki("Mosque of Cristo de la Luz", "مسجد باب المردوم"),
  alcazabaMalaga: wiki("Alcazaba of Málaga", "قصبة مالقة"),
  alcazabaAlmeria: wiki("Alcazaba of Almería", "قصبة المرية"),
  aljaferia: wiki("Aljafería", "قصر الجعفرية"),
  cordoba: wiki("Córdoba, Spain", "قرطبة"),
  granada: wiki("Granada", "غرناطة"),
  seville: wiki("Seville", "إشبيلية"),
  toledo: wiki("Toledo, Spain", "طليطلة"),
  malaga: wiki("Málaga", "مالقة"),
  valencia: wiki("Valencia", "بلنسية"),
  almeria: wiki("Almería", "المرية"),
  zaragoza: wiki("Zaragoza", "سرقسطة"),
} as const;
