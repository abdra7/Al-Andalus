// Recommended Arabic books on the history of al-Andalus, grouped by reading level.
// Bibliographic details checked against Goodreads edition/series pages and the CiNii
// (National Institute of Informatics, Japan) library catalogue. Links point to catalogue
// pages only — never to unauthorised PDF copies.

import type { Source } from "./types";

export type BookLevel = "reference" | "general" | "period";

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  level: BookLevel;
  /** Span of history covered, CE. */
  coversFrom: number;
  coversTo: number;
  extent?: string;          // e.g. number of volumes
  description: string;      // Arabic, why read it
  periodIds: string[];      // links into periods[]
  sources: Source[];
}

export const BOOK_LEVELS: Record<BookLevel, { title: string; audience: string; order: number }> = {
  reference: { title: "الموسوعات الشاملة", audience: "للمتخصصين والباحثين", order: 1 },
  general: { title: "العرض التاريخي الميسّر", audience: "للقارئ العام", order: 2 },
  period: { title: "دراسات الحقب والفترات", audience: "للتعمّق في مرحلة بعينها أو لمراجعة موجزة", order: 3 },
};

export const books: Book[] = [
  {
    id: "enan-dawlat-al-islam",
    title: "دولة الإسلام في الأندلس",
    author: "محمد عبد الله عنان",
    level: "reference",
    coversFrom: 711,
    coversTo: 1492,
    extent: "ثمانية أجزاء",
    description:
      "أوسع مرجع أكاديمي بالعربية في تاريخ الأندلس وأدقّه؛ يتتبّع الدولة من الفتح حتى سقوط غرناطة ومصير الموريسكيين، ويختم بجزء عن الآثار الأندلسية الباقية في إسبانيا والبرتغال.",
    periodIds: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads", "nasrid"],
    sources: [
      {
        title: "Goodreads — سلسلة «دولة الإسلام في الأندلس» بأجزائها",
        url: "https://www.goodreads.com/series/54607",
        publisher: "Goodreads",
      },
    ],
  },
  {
    id: "sarjani-andalus",
    title: "الأندلس من الفتح إلى السقوط",
    author: "د. راغب السرجاني",
    level: "general",
    coversFrom: 711,
    coversTo: 1492,
    description:
      "عرض سلس وواضح يرتّب الأحداث ترتيباً مميزاً ويبسّطها، فيصلح مدخلاً أول لمن يبدأ القراءة في تاريخ الأندلس.",
    periodIds: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads", "nasrid"],
    sources: [
      {
        title: "Goodreads — الأندلس من الفتح إلى السقوط (الطبعات)",
        url: "https://www.goodreads.com/work/editions/14122548",
        publisher: "Goodreads",
      },
    ],
  },
  {
    id: "suwaidan-illustrated",
    title: "الأندلس: التاريخ المصوّر",
    author: "د. طارق السويدان",
    level: "general",
    coversFrom: 711,
    coversTo: 1492,
    description:
      "يمتاز بكثرة الخرائط والرسوم والتوثيق البصري، فيساعد القارئ على تخيّل الجغرافيا وتبدّل الممالك والحدود عبر القرون.",
    periodIds: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads", "nasrid"],
    sources: [
      {
        title: "Goodreads — الأندلس التاريخ المصور (الطبعات)",
        url: "https://www.goodreads.com/work/editions/2505369",
        publisher: "Goodreads",
      },
    ],
  },
  {
    id: "munis-fajr",
    title: "فجر الأندلس",
    subtitle: "دراسة في تاريخ الأندلس من الفتح الإسلامي إلى قيام الدولة الأموية (711–756م)",
    author: "د. حسين مؤنس",
    level: "period",
    coversFrom: 711,
    coversTo: 756,
    description:
      "من أجمل الكتب وأرقاها عن الحقبة الأولى: الفتح وعصر الولاة حتى دخول عبد الرحمن الداخل وقيام الإمارة الأموية.",
    periodIds: ["conquest"],
    sources: [
      {
        title: "Goodreads — فجر الأندلس (الطبعات)",
        url: "https://www.goodreads.com/work/editions/15109152",
        publisher: "Goodreads",
      },
    ],
  },
  {
    id: "hajji-tarikh",
    title: "التاريخ الأندلسي",
    subtitle: "من الفتح الإسلامي حتى سقوط غرناطة (92–897هـ / 711–1492م)",
    author: "د. عبد الرحمن علي الحجي",
    level: "period",
    coversFrom: 711,
    coversTo: 1492,
    extent: "مجلد واحد",
    description:
      "من أفضل المختصرات الدقيقة؛ يستعرض تاريخ الأندلس كاملاً في مجلد واحد، فيناسب المراجعة السريعة بعد قراءة المطوّلات.",
    periodIds: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads", "nasrid"],
    sources: [
      {
        title: "CiNii — بطاقة الكتاب في فهرس المكتبات الجامعية",
        url: "https://ci.nii.ac.jp/ncid/BA70279562",
        publisher: "CiNii Books (NII)",
      },
    ],
  },
];

/** Reading lists the selection above draws on. */
export const bookListSources: Source[] = [
  {
    title: "تبيان — 10 كتب عن تاريخ الأندلس",
    url: "https://tipyan.com/10-books-about-the-history-of-andalous/",
    publisher: "Tipyan",
  },
  {
    title: "Goodreads — قائمة كتب عن تاريخ الأندلس",
    url: "https://www.goodreads.com/list/show/50427._",
    publisher: "Goodreads",
  },
];

export function booksByLevel(): { level: BookLevel; books: Book[] }[] {
  return (Object.keys(BOOK_LEVELS) as BookLevel[])
    .sort((a, b) => BOOK_LEVELS[a].order - BOOK_LEVELS[b].order)
    .map((level) => ({ level, books: books.filter((b) => b.level === level) }))
    .filter((g) => g.books.length > 0);
}
