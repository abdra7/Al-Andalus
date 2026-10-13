// Historical data for the Al-Andalus interactive atlas: timeline, library topics,
// derived helpers and the search index. Periods, cities and figures live in their
// own files and are re-exported here. Every record carries sources; dates are CE.
// Never edit a historical claim without checking the cited source.

import { books } from "./books";
import { periods } from "./periods";
import { cities } from "./cities";
import { figures } from "./figures";
import type { City, Figure, LibraryTopic, Period, TimelineEvent } from "./types";
import {
  BRITANNICA,
  BRITANNICA_MUSLIM_SPAIN,
  COMMONS_MAP,
  ENC_ISLAM,
  MET_ANDALUS,
  UNESCO_CORDOBA,
  UNESCO_GRANADA,
  UNESCO_ZAHRA,
  W,
  wiki,
} from "./sources";

export * from "./types";
export { periods, cities, figures };


// ---------- Timeline events ----------

export const timelineEvents: TimelineEvent[] = [
  {
    id: "t-711",
    year: 711,
    yearLabel: "711",
    title: "الفتح الإسلامي لشبه الجزيرة الأيبيرية",
    description:
      "عبر طارق بن زياد المضيق بجيش من البربر، وهزم الملك القوطي رودريك في معركة وادي لكة في يوليو، ثم دخل طليطلة " +
      "عاصمة القوط، ولحق به موسى بن نصير في العام التالي.",
    category: "conquest",
    cityId: "toledo",
    imageId: "painting-guadalete",
    sources: [BRITANNICA_MUSLIM_SPAIN, wiki("Tariq ibn Ziyad", "طارق بن زياد")],
  },
  {
    id: "t-732",
    year: 732,
    yearLabel: "732",
    title: "بلاط الشهداء",
    description:
      "هُزم الوالي عبد الرحمن الغافقي أمام الفرنجة بقيادة شارل مارتل قرب مدينة تور، وانتهت ولايته بمقتله في المعركة.",
    category: "conquest",
    sources: [BRITANNICA_MUSLIM_SPAIN, W.governors],
  },
  {
    id: "t-756",
    year: 756,
    yearLabel: "756",
    title: "تأسيس إمارة قرطبة الأموية",
    description: "هزم عبد الرحمن الداخل الوالي يوسف الفهري خارج قرطبة، فأسس أول دولة مستقلة في الأندلس عن الخلافة العباسية.",
    category: "politics",
    cityId: "cordoba",
    sources: [BRITANNICA_MUSLIM_SPAIN, wiki("Abd al-Rahman I", "عبد الرحمن الداخل")],
  },
  {
    id: "t-785",
    year: 785,
    yearLabel: "785-786",
    title: "بدء بناء الجامع الكبير في قرطبة",
    description: "بدأ عبد الرحمن الداخل بناء الجامع الذي صار نموذجاً للعمارة الإسلامية في الغرب وأحد أعظم صروحها.",
    category: "architecture",
    cityId: "cordoba",
    imageId: "cordoba-mosque-1",
    sources: [W.mosqueCordoba, UNESCO_CORDOBA],
  },
  {
    id: "t-822",
    year: 822,
    yearLabel: "822-852",
    title: "عهد عبد الرحمن الثاني وازدهار قرطبة",
    description:
      "وسّع الأمير الجامع الكبير (833–848م)، واستقبل في أول عهده الموسيقي زرياب القادم من بغداد، فانتشرت في قرطبة أذواق " +
      "المشرق في الموسيقى واللباس والطعام.",
    category: "culture",
    cityId: "cordoba",
    sources: [W.emirate, wiki("Ziryab", "زرياب")],
  },
  {
    id: "t-929",
    year: 929,
    yearLabel: "929",
    title: "عبد الرحمن الناصر يعلن الخلافة",
    description: "أعلن عبد الرحمن الثالث نفسه خليفة متخذاً لقب الناصر لدين الله، فدخلت قرطبة عصرها الذهبي.",
    category: "politics",
    cityId: "cordoba",
    sources: [W.cordoba, BRITANNICA_MUSLIM_SPAIN],
  },
  {
    id: "t-936",
    year: 936,
    yearLabel: "936",
    title: "تأسيس مدينة الزهراء",
    description: "أمر الخليفة ببناء مدينة الزهراء غربي قرطبة مقراً للخلافة، وسكنها بحلول 945م.",
    category: "architecture",
    cityId: "zahra",
    imageId: "zahra-salon-rico",
    sources: [W.zahra, UNESCO_ZAHRA],
  },
  {
    id: "t-961",
    year: 961,
    yearLabel: "961-976",
    title: "خلافة الحكم المستنصر وازدهار العلم",
    description:
      "وسّع الحكم الجامع الكبير وأضاف محرابه المزخرف، وتنسب إليه الروايات مكتبة هائلة، وكان الزهراوي طبيب بلاطه.",
    category: "science",
    cityId: "cordoba",
    imageId: "cordoba-mihrab",
    sources: [wiki("Al-Hakam II", "الحكم المستنصر"), wiki("Al-Zahrawi", "الزهراوي")],
  },
  {
    id: "t-1002",
    year: 1002,
    yearLabel: "1002",
    title: "وفاة الحاجب المنصور",
    description: "توفي المنصور بن أبي عامر في مدينة سالم، وبعد سبع سنوات من حكم ابنيه انفجرت الفتنة.",
    category: "politics",
    cityId: "cordoba",
    sources: [wiki("Almanzor", "المنصور بن أبي عامر"), W.hisham2],
  },
  {
    id: "t-1031",
    year: 1031,
    yearLabel: "1031",
    title: "نهاية خلافة قرطبة",
    description: "خُلع هشام الثالث آخر الخلفاء، وتفتّتت الأندلس إلى دويلات (طوائف) متنافسة.",
    category: "politics",
    cityId: "cordoba",
    sources: [W.cordoba, W.taifa],
  },
  {
    id: "t-1085",
    year: 1085,
    yearLabel: "25 مايو 1085",
    title: "سقوط طليطلة",
    description: "دخل ألفونسو السادس ملك قشتالة طليطلة، فكان ضربة قاسية لدويلات الطوائف.",
    category: "conquest",
    cityId: "toledo",
    sources: [W.toledo],
  },
  {
    id: "t-1086",
    year: 1086,
    yearLabel: "23 أكتوبر 1086",
    title: "معركة الزلاقة ودخول المرابطين",
    description: "استنجد ملوك الطوائف بالمرابطين، فعبر يوسف بن تاشفين وانتصر على ألفونسو السادس، ثم ضمّ الطوائف إلى دولته.",
    category: "conquest",
    cityId: "seville",
    sources: [W.almoravids, wiki("Yusuf ibn Tashfin", "يوسف بن تاشفين")],
  },
  {
    id: "t-1118",
    year: 1118,
    yearLabel: "18 ديسمبر 1118",
    title: "سقوط سرقسطة",
    description: "استولى ألفونسو الأول ملك أراغون على سرقسطة من المرابطين، فانتهى الثغر الأعلى.",
    category: "conquest",
    cityId: "zaragoza",
    imageId: "zaragoza-1",
    sources: [W.zaragoza, W.almoravids],
  },
  {
    id: "t-1147",
    year: 1147,
    yearLabel: "1147",
    title: "دخول الموحدين",
    description: "بعد استيلائهم على مراكش دخل الموحدون إشبيلية، ثم جعلوها منذ 1163م عاصمتهم في الأندلس.",
    category: "politics",
    cityId: "seville",
    sources: [W.almohads, W.seville],
  },
  {
    id: "t-1184",
    year: 1184,
    yearLabel: "1184-1198",
    title: "بناء الخيرالدا",
    description: "بُنيت مئذنة جامع إشبيلية الموحدي، بدأها أبو يعقوب يوسف وأتمّها ابنه يعقوب المنصور.",
    category: "architecture",
    cityId: "seville",
    imageId: "seville-2",
    sources: [W.giralda],
  },
  {
    id: "t-1195",
    year: 1195,
    yearLabel: "18 يوليو 1195",
    title: "معركة الأرك",
    description: "انتصر الموحدون بقيادة يعقوب المنصور على ألفونسو الثامن ملك قشتالة.",
    category: "conquest",
    sources: [W.almohads, wiki("Abu Yusuf Yaqub al-Mansur", "يعقوب المنصور")],
  },
  {
    id: "t-1212",
    year: 1212,
    yearLabel: "1212",
    title: "معركة العقاب",
    description: "هزيمة الموحدين الفاصلة بقيادة محمد الناصر أمام التحالف المسيحي في لاس نافاس دي تولوسا، فتداعت دولتهم.",
    category: "conquest",
    imageId: "painting-navas",
    sources: [W.almohads],
  },
  {
    id: "t-1236",
    year: 1236,
    yearLabel: "29 يونيو 1236",
    title: "سقوط قرطبة",
    description: "دخل فرناندو الثالث عاصمة الخلافة القديمة بعد حصار دام أشهراً، وحُوّل جامعها إلى كاتدرائية.",
    category: "fall",
    cityId: "cordoba",
    sources: [W.cordoba],
  },
  {
    id: "t-1238",
    year: 1238,
    yearLabel: "1238",
    title: "تأسيس مملكة غرناطة",
    description: "دخل محمد الأول بن نصر (ابن الأحمر) غرناطة واتخذها عاصمة، فقامت آخر دولة إسلامية في الأندلس.",
    category: "politics",
    cityId: "granada",
    imageId: "alhambra-3",
    sources: [W.granadaEmirate],
  },
  {
    id: "t-1248",
    year: 1248,
    yearLabel: "23 نوفمبر 1248",
    title: "سقوط إشبيلية",
    description: "سلّمت عاصمة الموحدين في الأندلس لفرناندو الثالث بعد حصار دام نحو خمسة عشر شهراً.",
    category: "fall",
    cityId: "seville",
    sources: [W.seville],
  },
  {
    id: "t-1333",
    year: 1333,
    yearLabel: "1333-1354",
    title: "عصر يوسف الأول",
    description: "بنى السلطان باب الشريعة في الحمراء (1348م) وعمل في قصر قمارش، فبلغت الحمراء طوراً جديداً من الفخامة.",
    category: "architecture",
    cityId: "granada",
    imageId: "granada-comares",
    sources: [wiki("Yusuf I of Granada", "يوسف الأول"), W.alhambra],
  },
  {
    id: "t-1349",
    year: 1349,
    yearLabel: "1349",
    title: "تأسيس المدرسة اليوسفية",
    description: "أسس يوسف الأول في غرناطة المدرسة الكبرى الوحيدة التي بُنيت في الأندلس.",
    category: "science",
    cityId: "granada",
    imageId: "granada-madraza",
    sources: [W.granada, wiki("Yusuf I of Granada", "يوسف الأول")],
  },
  {
    id: "t-1362",
    year: 1362,
    yearLabel: "1362-1391",
    title: "عصر محمد الخامس وقصر الأسود",
    description: "في عهده الثاني بنى محمد الخامس قصر الأسود، ونُقشت أشعار ابن الخطيب وابن زمرك على جدران الحمراء.",
    category: "architecture",
    cityId: "granada",
    imageId: "alhambra-4",
    sources: [wiki("Muhammad V of Granada", "محمد الخامس"), W.alhambra],
  },
  {
    id: "t-1482",
    year: 1482,
    yearLabel: "1482",
    title: "بدء حرب غرناطة",
    description: "بدأ الملكان الكاثوليكيان حربهم لإسقاط مملكة غرناطة، وفي العام نفسه خلع أبو عبد الله أباه أبا الحسن.",
    category: "conquest",
    cityId: "granada",
    sources: [W.granadaEmirate, wiki("Muhammad XI of Granada", "أبو عبد الله الصغير")],
  },
  {
    id: "t-1487",
    year: 1487,
    yearLabel: "18 أغسطس 1487",
    title: "سقوط مالقة",
    description: "سلّمت مالقة بعد حصار بدأ في 6 مايو، فخسرت غرناطة أهم موانئها.",
    category: "fall",
    cityId: "malaga",
    sources: [W.malaga, W.alcazabaMalaga],
  },
  {
    id: "t-1492",
    year: 1492,
    yearLabel: "2 يناير 1492",
    title: "سقوط غرناطة ونهاية الأندلس",
    description:
      "بعد معاهدة 25 نوفمبر 1491م سلّم أبو عبد الله الصغير المدينة للملكين الكاثوليكيين، فانتهى الحكم الإسلامي في شبه " +
      "الجزيرة الأيبيرية.",
    category: "fall",
    cityId: "granada",
    imageId: "painting-rendicion",
    sources: [W.granadaEmirate, UNESCO_GRANADA],
  },
];

// ---------- Library ----------

export const libraryTopics: LibraryTopic[] = [
  {
    id: "states",
    title: "الدول والحقب التاريخية",
    icon: "crown",
    items: periods.map((p) => ({
      title: `${p.name} (${p.startYear}–${p.endYear === 1237 ? 1238 : p.endYear})`,
      description: p.summary,
      sources: p.sources.slice(0, 1),
    })),
  },
  {
    id: "cities",
    title: "المدن والعواصم",
    icon: "map-pin",
    items: cities.map((c) => ({
      title: c.name,
      description: c.significance,
      cityId: c.id,
      sources: c.sources.slice(0, 1),
    })),
  },
  {
    id: "architecture",
    title: "العمارة والآثار",
    icon: "landmark",
    items: [
      {
        title: "الجامع الكبير بقرطبة",
        description: "بدأه عبد الرحمن الداخل (785–786م) ووُسّع ثلاث مرات حتى 988م، بأقواسه المزدوجة ومحراب الحكم المستنصر.",
        cityId: "cordoba",
        sources: [W.mosqueCordoba, UNESCO_CORDOBA],
      },
      {
        title: "مدينة الزهراء",
        description: "مدينة البلاط الخلافي (936م)، ومجلسها الشرقي المؤرخ بين 953 و957م.",
        cityId: "zahra",
        sources: [W.zahra, UNESCO_ZAHRA],
      },
      {
        title: "مسجد باب المردوم بطليطلة",
        description: "مصلّى صغير من سنة 999م بقي إلى اليوم باسم «كريستو دي لا لوث».",
        cityId: "toledo",
        sources: [W.babMardum],
      },
      {
        title: "قصر الجعفرية بسرقسطة",
        description: "قصر بني هود «قصر السرور» (1065–1081م)، اليوم مقر برلمان أراغون.",
        cityId: "zaragoza",
        sources: [W.aljaferia],
      },
      {
        title: "الخيرالدا وبرج الذهب",
        description: "مئذنة جامع إشبيلية الموحدي (1184–1198م) وبرج حراسة النهر (1220–1221م).",
        cityId: "seville",
        sources: [W.giralda, W.torreOro],
      },
      {
        title: "الحمراء وجنة العريف",
        description: "مدينة القصور النصرية على تل السبيكة، بقصري قمارش والأسود والمدرسة اليوسفية القريبة.",
        cityId: "granada",
        sources: [W.alhambra, UNESCO_GRANADA],
      },
    ],
  },
  {
    id: "science",
    title: "العلوم والآداب",
    icon: "flask",
    items: [
      {
        title: "الطب والصيدلة",
        description: "الزهراوي وموسوعة «التصريف»، وابن زهر و«التيسير»، وابن رشد و«الكليات»، وابن البيطار و«الجامع».",
        cityId: "cordoba",
        sources: [wiki("Al-Zahrawi", "الزهراوي"), wiki("Ibn Zuhr", "ابن زهر")],
      },
      {
        title: "الفلسفة",
        description: "ابن باجة في سرقسطة، وابن طفيل و«حي بن يقظان»، وابن رشد «الشارح»، وموسى بن ميمون و«دلالة الحائرين».",
        cityId: "cordoba",
        sources: [wiki("Averroes", "ابن رشد"), wiki("Ibn Tufail", "ابن طفيل")],
      },
      {
        title: "الشعر والأدب",
        description: "ابن حزم و«طوق الحمامة»، وابن زيدون وولادة، والمعتمد بن عباد، ولسان الدين بن الخطيب وابن زمرك شاعرا الحمراء.",
        cityId: "granada",
        sources: [wiki("Ibn Zaydun", "ابن زيدون"), wiki("Ibn al-Khatib", "ابن الخطيب")],
      },
      {
        title: "الموسيقى والذوق",
        description: "زرياب وأول مدارس الموسيقى في قرطبة، والموشحات التي اشتهر منها «جادك الغيث» لابن الخطيب.",
        cityId: "cordoba",
        sources: [wiki("Ziryab", "زرياب")],
      },
      {
        title: "الفنون الزخرفية",
        description: "علب العاج المنحوتة في الزهراء وقرطبة، والخزف المذهّب في مالقة، والحرير والطراز في المرية.",
        sources: [MET_ANDALUS, W.almeria],
      },
    ],
  },
  {
    id: "sources",
    title: "المصادر والمراجع",
    icon: "book",
    items: [
      {
        title: "مركز التراث العالمي لليونسكو",
        description: "سجلات الحمراء وقرطبة والزهراء وأوصافها الرسمية.",
        sources: [UNESCO_GRANADA, UNESCO_CORDOBA, UNESCO_ZAHRA],
      },
      { title: "متحف المتروبوليتان للفنون", description: "منشور «الأندلس: فن إسبانيا الإسلامية».", sources: [MET_ANDALUS] },
      {
        title: "ويكيميديا كومنز",
        description: "الصور والخرائط واللوحات بتراخيص مفتوحة (CC0 وCC BY وCC BY-SA والملكية العامة).",
        sources: [COMMONS_MAP],
      },
      {
        title: "الموسوعات المرجعية",
        description: "بريتانيكا والموسوعة الإسلامية ومقالات ويكيبيديا المحققة لتواريخ الأحداث والأعلام.",
        sources: [BRITANNICA_MUSLIM_SPAIN, BRITANNICA, ENC_ISLAM],
      },
    ],
  },
];

// ---------- Derived helpers ----------

export function getCity(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}

export function getPeriod(id: string): Period | undefined {
  return periods.find((p) => p.id === id);
}

export function getTimelineEvent(id: string): TimelineEvent | undefined {
  return timelineEvents.find((e) => e.id === id);
}

export function citiesInPeriod(periodId: string): City[] {
  return cities.filter((c) => c.periods.includes(periodId));
}

export function eventsInYearRange(start: number, end: number): TimelineEvent[] {
  return timelineEvents.filter((e) => e.year >= start && e.year <= end);
}

export function getFigure(id: string): Figure | undefined {
  return figures.find((f) => f.id === id);
}

export function figuresInPeriod(periodId: string): Figure[] {
  return figures.filter((f) => f.periodId === periodId);
}

export function figuresInCity(cityId: string): Figure[] {
  return figures.filter((f) => f.cityId === cityId);
}

/** Display life span, e.g. "1126–1198" or the figure's own label for uncertain dates. */
export function figureLife(f: Figure): string | undefined {
  if (f.lifeLabel) return f.lifeLabel;
  if (f.born !== undefined && f.died !== undefined) return `${f.born}–${f.died}`;
  return undefined;
}

export function periodAtYear(year: number): Period | undefined {
  return periods.find((p) => year >= p.startYear && year <= p.endYear);
}

/** Search index over cities, events, figures, periods. */
export interface SearchEntry {
  id: string;
  title: string;
  latinName?: string;
  kind: "city" | "event" | "figure" | "period" | "book";
  /** Alternative spellings matched by search but not displayed. */
  aliases?: string[];
  year?: number;
  yearLabel?: string;
  description: string;
  cityId?: string;
}

export const searchIndex: SearchEntry[] = [
  ...cities.map((c) => ({
    id: `city-${c.id}`,
    title: c.name,
    latinName: c.latinName,
    aliases: c.altNames,
    kind: "city" as const,
    year: c.foundedYear,
    yearLabel: c.foundedYear !== undefined && c.foundedYear > 0 ? String(c.foundedYear) : undefined,
    description: c.significance,
    cityId: c.id,
  })),
  ...timelineEvents.map((e) => ({
    id: `event-${e.id}`,
    title: e.title,
    kind: "event" as const,
    year: e.year,
    yearLabel: e.yearLabel,
    description: e.description,
    cityId: e.cityId,
  })),
  ...figures.map((f) => ({
    id: `figure-${f.id}`,
    title: f.name,
    latinName: f.latinName,
    aliases: f.aliases,
    kind: "figure" as const,
    year: f.died,
    yearLabel: figureLife(f),
    description: f.role,
    cityId: f.cityId,
  })),
  ...books.map((b) => ({
    id: `book-${b.id}`,
    title: b.title,
    aliases: [b.author],
    kind: "book" as const,
    yearLabel: `${b.coversFrom}–${b.coversTo}`,
    description: `${b.author} — ${b.description}`,
  })),
  ...periods.map((p) => ({
    id: `period-${p.id}`,
    title: p.name,
    latinName: p.latinName,
    kind: "period" as const,
    year: p.startYear,
    yearLabel: `${p.startYear}–${p.endYear}`,
    description: p.summary,
  })),
];
