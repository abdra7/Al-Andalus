// Historical data model for the Al-Andalus interactive atlas.
// Every record carries sources. Dates follow CE/AD; where historians disagree,
// `confidenceNote` records the uncertainty. Never edit historical claims without
// checking the cited source.

import { books } from "./books";

export interface Source {
  title: string;
  url: string;
  publisher: string;
}

export interface Period {
  id: string;
  name: string;            // Arabic
  latinName: string;       // transliteration / English
  startYear: number;       // CE, negative for BCE
  endYear: number;
  color: string;           // map accent color
  summary: string;         // Arabic
  description: string;     // Arabic, longer
  sources: Source[];
}

export interface CityEvent {
  year: number;            // CE (negative = BCE)
  yearLabel: string;       // Arabic display, e.g. "756" or "2 يناير 1492"
  title: string;           // Arabic
  description: string;     // Arabic
  sources: Source[];
}

export interface City {
  id: string;
  name: string;            // Arabic primary
  latinName: string;       // Córdoba
  altNames: string[];      // alternative historical/Latin names
  lat: number;
  lng: number;
  founded?: string;        // Arabic description of founding
  foundedYear?: number;
  peakYear?: number;       // year of greatest importance
  endYear?: number;        // when it left Andalusian control
  significance: string;    // Arabic, one line
  description: string;     // Arabic, extended
  periods: string[];       // period ids this city belongs to
  capital?: boolean;       // was a capital
  majorCity?: boolean;     // shown in المدن الرئيسية panel
  imageId?: string;        // reference into images dataset
  events: CityEvent[];
  sources: Source[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  yearLabel: string;
  title: string;           // Arabic
  description: string;     // Arabic
  category: "conquest" | "politics" | "culture" | "science" | "architecture" | "fall";
  cityId?: string;
  lat?: number;
  lng?: number;
  sources: Source[];
}

export interface Figure {
  id: string;
  name: string;            // Arabic
  latinName: string;
  born?: number;
  died?: number;
  role: string;            // Arabic
  description: string;     // Arabic
  cityId?: string;
  sources: Source[];
}

export interface LibraryTopic {
  id: string;
  title: string;           // Arabic section title
  icon: string;            // icon key
  items: {
    title: string;
    description: string;
    cityId?: string;
    sources: Source[];
  }[];
}

// ---------- Sources ----------

const UNESCO_GRANADA: Source = {
  title: "اليونسكو — الحمراء وجينيراليف والبيازين، غرناطة",
  url: "https://whc.unesco.org/en/list/314/",
  publisher: "UNESCO World Heritage Centre",
};
const UNESCO_CORDOBA: Source = {
  title: "اليونسكو — وسط قرطبة التاريخي",
  url: "https://whc.unesco.org/en/list/313",
  publisher: "UNESCO World Heritage Centre",
};
const UNESCO_ZAHRA: Source = {
  title: "اليونسكو — مدينة الزهراء الخلافية",
  url: "https://whc.unesco.org/en/list/1560",
  publisher: "UNESCO World Heritage Centre",
};
const MET_ANDALUS: Source = {
  title: "متحف المتروبوليتان — الأندلس: فن إسبانيا الإسلامية",
  url: "https://www.metmuseum.org/es/met-publications/al-andalus-the-art-of-islamic-spain",
  publisher: "The Metropolitan Museum of Art",
};
const COMMONS_MAP: Source = {
  title: "ويكيميديا كومنز — خرائط تاريخية للأندلس (CC0)",
  url: "https://commons.wikimedia.org/wiki/File:Al_Andalus.png",
  publisher: "Wikimedia Commons",
};
const BRITANNICA: Source = {
  title: "Encyclopaedia Britannica — Al-Andalus",
  url: "https://www.britannica.com/place/al-Andalus",
  publisher: "Encyclopaedia Britannica",
};
const ENC_ISLAM: Source = {
  title: "الموسوعة الإسلامية — أندلس (EI2/EI3)",
  url: "https://referenceworks.brill.com/display/db/eiso",
  publisher: "Brill",
};

// ---------- Periods ----------

export const periods: Period[] = [
  {
    id: "conquest",
    name: "الفتح الإسلامي",
    latinName: "The Conquest",
    startYear: 711,
    endYear: 756,
    color: "#8a6d3b",
    summary: "دخول المسلمين إلى الأندلس وسقوط الدولة القوطية الغربية",
    description:
      "بدأت الحملة الإسلامية إلى شبه الجزيرة الأيبيرية عام 711م بقيادة طارق بن زياد، الذي عبر المضيق فأطلق اسمه عليه (جبل طارق). " +
      "في معركة وادي لكة (طرف الغار) هُزم الملك القوطي رودريك، وفُتحت قرطبة وطليطلة وإشبيلية تباعاً. " +
      "أدار الولاة المسلمون البلاد في بادئ الأمر تابعين لخلافة دمشق ثم الأمويين، وشهدت الأندلس في هذه المرحلة تحولات ديموغرافية " +
      "ودينية وثقافية عميقة.",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "emirate",
    name: "الدولة الأموية في الأندلس",
    latinName: "Umayyad Emirate of Córdoba",
    startYear: 756,
    endYear: 929,
    color: "#2e5c8a",
    summary: "إمارة قرطبة المستقلة تحت حكم الأمويين الفارين من المشرق",
    description:
      "أسس عبد الرحمن الداخل (صقر قريش) إمارة قرطبة عام 756م بعد فراره من المشرق إثر سقوط الدولة الأموية في دمشق على يد العباسيين. " +
      "وحّد الإمارة تدريجياً في وجه القوى المناوئة: البربر والقوطيين والثورات الداخلية والضغط المسيحي في الشمال. " +
      "تحت حكم عبد الرحمن الثاني (822-852) بلغت قرطبة ازدهاراً ثقافياً وعمرانياً، وبدأ بناء الجامع الأكبر على نطاق واسع. " +
      "توالى بعده الحكم الأول والحكم الثاني والمنذر وعبد الله، وبلغت الإمارة أوجها الثقافي قبيل إعلان الخلافة.",
    sources: [UNESCO_CORDOBA, BRITANNICA],
  },
  {
    id: "caliphate",
    name: "خلافة قرطبة",
    latinName: "Caliphate of Córdoba",
    startYear: 929,
    endYear: 1031,
    color: "#b8924a",
    summary: "ذروة الحضارة الأندلسية السياسية والعلمية والفنية",
    description:
      "أعلن عبد الرحمن الناصر الخلافة عام 929م متخذاً لقب أمير المؤمنين، فصارت قرطبة من أكبر مدن العالم وأغناها. " +
      "في عهده وعهد ابنه الحكم المستنصر ازدهرت العلوم والآداب والفنون، ووصلت مكتبة الحكم المستنصر إلى مئات الآلاف من المجلدات. " +
      "بُني قصر مدينة الزهراء شمالي قرطبة ليكون مقر الخلافة. " +
      "وبعد وفاة الحاجب المنصور بن أبي عامر (1002) دخلت الخلافة في حرب أهلية (الفتنة) أنهتها عام 1031م بإلغاء الخلافة وتفتت البلاد.",
    sources: [UNESCO_CORDOBA, UNESCO_ZAHRA, MET_ANDALUS],
  },
  {
    id: "taifas",
    name: "ملوك الطوائف",
    latinName: "Taifa Kingdoms",
    startYear: 1031,
    endYear: 1086,
    color: "#9c6b3f",
    summary: "تفتت الخلافة إلى دويلات متنافسة على الثروة والثقافة",
    description:
      "بعد سقوط الخلافة عام 1031م تشكلت دويلات مستقلة (طوائف) حكمتها سلالات مختلفة: طوائف إشبيلية وغرناطة وطليطلة وبلنسية " +
      "وقرطبة ولبلة وطائفة بني الأفطس في بطليوس. " +
      "رغم التناحر السياسي بينها، شهدت هذه المرحلة ازدهاراً أدبياً وعلمياً وفنياً في بلاطات أمرائها. " +
      "لكن ضعفها أمام التوسع المسيحي في الشمال دفعها لاستدعاء المرابطين من المغرب، فكانت معركة الزلاقة (1086).",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "almoravids",
    name: "المرابطون",
    latinName: "Almoravids",
    startYear: 1086,
    endYear: 1147,
    color: "#5d6d7e",
    summary: "دولة صحراوية متشددة ضمت الأندلس ووحدتها ضد تقدم القوى المسيحية",
    description:
      "دعا ملوك الطوائف المرابطين إلى الأندلس بعد سقوط طليطلة عام 1085م، فدخلها يوسف بن تاشفين وانتصر في الزلاقة (1086). " +
      "ثم ضمّ الطوائف واحدة تلو الأخرى حتى وحّد الأندلس تحت سلطة مراكش (1090-1094). " +
      "حكم المرابطون بصرامة وأضعفوا الازدهار الثقافي النسبي، وواجهوا ثورات داخلية وضغط القشتاليين والأراغونيين. " +
      "سقطت دولتهم على يد الموحدين في المغرب، ثم في الأندلس بعد سقوط مراكش عام 1147م.",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "almohads",
    name: "الموحدون",
    latinName: "Almohads",
    startYear: 1147,
    endYear: 1237, // ends 1237 so the Nasrid period starting 1238 owns the boundary year
    color: "#7b4b2a",
    summary: "خلافة موحدية شديدة المركزية أعادت توحيد غرب المتوسط",
    description:
      "قامت الدولة الموحدية في المغرب بزعامة محمد بن تومرت، ووسّع عبد المؤمن بن علي سلطتها فدخلت الأندلس عام 1147م. " +
      "في عهد أبي يعقوب يوسف وابنه يعقوب المنصور بلغت الدولة قوتها، فانتصر الموحدون في معركة الأرك (1195)، " +
      "لكن الهزيمة الفاصلة في معركة العقاب (لاس نافاس دي تولوسا) عام 1212م حطمت قوتهم العسكرية. " +
      "ترك الموحدون إرثاً معمارياً ضخماً في إشبيلية (الخيرالدا) وغيرها. تفتت البلاد بعدهم لتظهر مملكة غرناطة.",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "nasrid",
    name: "مملكة غرناطة (بنو نصر)",
    latinName: "Nasrid Kingdom of Granada",
    startYear: 1238,
    endYear: 1492,
    color: "#c19a3d",
    summary: "آخر دولة إسلامية في الأندلس وذروة الفن الأندلسي في الحمراء",
    description:
      "أسس محمد بن يوسف بن نصر (الأحمر) مملكة غرناطة عام 1238م بعد تفتت السلطة الموحدية، فحكمت سلالته قرابة 250 عاماً. " +
      "صمدت المملكة أمام القشتاليين بالتحالفات والدبلوماسية والجزية أحياناً، وبلغت ذروتها المعمارية في قصر الحمراء " +
      "المتجسد في عهد يوسف الأول ومحمد الخامس. " +
      "في عام 1492م سلّم أبو عبد الله الصغير المدينة للملكين الكاثوليكيين، فانتهى الوجود السياسي للأندلس في شبه الجزيرة الأيبيرية.",
    sources: [UNESCO_GRANADA, BRITANNICA],
  },
];

// ---------- Cities ----------

export const cities: City[] = [
  {
    id: "cordoba",
    name: "قرطبة",
    latinName: "Córdoba",
    altNames: ["قرطبة", "Corduba", "Cordova"],
    lat: 37.8882,
    lng: -4.7794,
    founded: "أصلها روماني (قرطبة الرومانية)، وبلغت ذروتها في العصر الإسلامي",
    foundedYear: -169,
    peakYear: 1000,
    significance: "عاصمة الدولة الأموية وخلافة قرطبة، وأكبر مدن أوروبا في القرن العاشر",
    description:
      "تُعد قرطبة أهم حواضر الأندلس على الإطلاق. فُتحت عام 711م، ثم صارت عاصمة الإمارة الأموية عام 756م على يد عبد الرحمن الداخل، " +
      "وعاصمة الخلافة عام 929م. في أوجها (القرنان العاشر والحادي عشر) قيل إنها ضمّت نحو ثلاثمائة مسجد وقصائر ودار علم، " +
      "وكان جامعها الأكبر ثاني أكبر مساجد العالم الإسلامي مساحة بعد الحرم المكي. " +
      "بُني الجامع الأكبر ابتداءً من عام 785-786م على عهد عبد الرحمن الأول وأُكمل بتوسعات الحكم الثاني وعبد الرحمن الناصر " +
      "والحكم المستنصر. في عام 1236م فتحها فرناندو الثالث وسلمت لاحقاً، فحوّل الجامع إلى كاتدرائية.",
    periods: ["conquest", "emirate", "caliphate", "taifas"],
    capital: true,
    majorCity: true,
    imageId: "cordoba-mosque-1",
    events: [
      {
        year: 711,
        yearLabel: "711",
        title: "فتح قرطبة",
        description: "دخل المسلمون قرطبة في أعقاب معركة وادي لكة، وصارت قاعدة الولاية الإسلامية.",
        sources: [BRITANNICA],
      },
      {
        year: 756,
        yearLabel: "756",
        title: "تأسيس إمارة قرطبة الأموية",
        description: "أعلن عبد الرحمن الداخل نفسه أميراً في قرطبة مؤسساً بذلك دولة الأمويين في الأندلس.",
        sources: [BRITANNICA, UNESCO_CORDOBA],
      },
      {
        year: 785,
        yearLabel: "785-786",
        title: "بدء بناء الجامع الأكبر",
        description: "بدأ عبد الرحمن الأول بناء الجامع الأكبر الذي صار نموذجاً للعمارة الإسلامية الغربية.",
        sources: [UNESCO_CORDOBA],
      },
      {
        year: 929,
        yearLabel: "929",
        title: "إعلان الخلافة الأموية",
        description: "توج عبد الرحمن الناصر نفسه خليفة، فصارت قرطبة من كبريات حواضر العالم.",
        sources: [UNESCO_CORDOBA, BRITANNICA],
      },
      {
        year: 1236,
        yearLabel: "1236",
        title: "فتح قرطبة المسيحي",
        description: "استولى فرناندو الثالث على المدينة، وحُوّل الجامع الأكبر إلى كاتدرائية لاحقاً.",
        sources: [UNESCO_CORDOBA],
      },
    ],
    sources: [UNESCO_CORDOBA, BRITANNICA, MET_ANDALUS],
  },
  {
    id: "granada",
    name: "غرناطة",
    latinName: "Granada",
    altNames: ["غرناطة", "Granada", "Elvira"],
    lat: 37.1773,
    lng: -3.5986,
    founded: "مدينة قديمة (إيليبيري ثم رومانية)، ازدهرت في العصر الإسلامي",
    peakYear: 1400,
    endYear: 1492,
    significance: "آخر عاصمة للإسلام في الأندلس، وموطن قصر الحمراء",
    description:
      "غرناطة أشهر مدن الأندلس في الذاكرة العالمية، لكونها آخر معقل للمسلمين في شبه الجزيرة الأيبيرية. " +
      "أسس محمد بن يوسف بن نصر مملكة بني نصر فيها عام 1238م، وفيها بنى السلاطين قصر الحمراء " +
      "الذي يُعد أعقد تجسيد للفن الأندلسي: أقواس المعقوف، وأعمدة الرخام، والنقوش الجصية، والزرنيخات، وأفنية " +
      "كالرياض والأسود. " +
      "حي البيازين المجاور يحفظ النسيج العمراني الموري الأصيل. استسلمت المدينة في 2 يناير 1492م للملكين الكاثوليكيين " +
      "بموجب معاهدة، فكانت نهاية الوجود الإسلامي السياسي في الأندلس.",
    periods: ["taifas", "almoravids", "almohads", "nasrid"],
    capital: true,
    majorCity: true,
    imageId: "alhambra-2",
    events: [
      {
        year: 1238,
        yearLabel: "1238",
        title: "تأسيس مملكة غرناطة",
        description: "دخل محمد الأول (الأحمر) غرناطة وأسس سلالة بني نصر التي حكمت نحو 250 عاماً.",
        sources: [UNESCO_GRANADA, BRITANNICA],
      },
      {
        year: 1354,
        yearLabel: "1354-1391",
        title: "عصر محمد الخامس وبناء أسوار الحمراء",
        description: "بلغ البناء في الحمراء ذروته في عهد يوسف الأول ومحمد الخامس، فشيِّد بهو السيدة والأسود.",
        sources: [UNESCO_GRANADA],
      },
      {
        year: 1491,
        yearLabel: "1491",
        title: "بدء حصار غرناطة",
        description: "فرض الملوك الكاثوليكيون حصاراً مطبقاً على المدينة دام عدة أشهر.",
        sources: [BRITANNICA],
      },
      {
        year: 1492,
        yearLabel: "2 يناير 1492",
        title: "سقوط غرناطة ونهاية الأندلس",
        description: "سلّم أبو عبد الله الصغير مفاتيح المدينة، فانتهى الوجود السياسي للأندلس.",
        sources: [UNESCO_GRANADA, BRITANNICA],
      },
    ],
    sources: [UNESCO_GRANADA, BRITANNICA, MET_ANDALUS],
  },
  {
    id: "seville",
    name: "إشبيلية",
    latinName: "Sevilla",
    altNames: ["إشبيلية", "Sevilla", "Ishbiliya"],
    lat: 37.3891,
    lng: -5.9845, // was -4.9845, which put Seville ~90 km east, near Écija
    founded: "أصلها روماني (Hispalis)، وبلغت أهمية كبرى في الإسلام",
    peakYear: 1150,
    endYear: 1248,
    significance: "كبرى مدن الأندلس وعاصمة المرابطين والموحدين في الغرب",
    description:
      "إشبيلية (أشبيلية) من أعرق مدن الأندلس. فُتحت عام 712م، وصارت عاصمة طائفة بني عباد في عهد المعتمد بن عباد، " +
      "ثم عاصمة المرابطين ثم الموحدين. من أشهر آثارها برج الخيرالدا الذي بناه الموحدون كمئذنة لجامعهم الكبير " +
      "في عهد أبي يعقوب يوسف. وفي عهد الموحدين صارت المدينة من أهم مدن غرب المتوسط. " +
      "استولى عليها فرناندو الثالث عام 1248م فأُدرج جامعها الكبير تحويله إلى كاتدرائية.",
    periods: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads"],
    capital: true,
    majorCity: true,
    imageId: "seville-1",
    events: [
      {
        year: 712,
        yearLabel: "712",
        title: "فتح إشبيلية",
        description: "فتحها موسى بن نصير في أعقاب حملة طارق بن زياد.",
        sources: [BRITANNICA],
      },
      {
        year: 1023,
        yearLabel: "1023-1091",
        title: "طائفة بني عباد",
        description: "حكم بنو عباد إشبيلية وكان بلاط المعتمد بن عباد من أزهى بلاطات الأندلس شعراً وأدباً.",
        sources: [BRITANNICA, ENC_ISLAM],
      },
      {
        year: 1171,
        yearLabel: "1171-1198",
        title: "بناء الخيرالدا الموحدية",
        description: "بُنيت مئذنة جامع إشبيلية الكبير بأمر أبي يعقوب يوسف الموحدي، وصارت لاحقاً برج كاتدرائية.",
        sources: [BRITANNICA, MET_ANDALUS],
      },
      {
        year: 1248,
        yearLabel: "1248",
        title: "فتح إشبيلية المسيحي",
        description: "استسلمت المدينة لفرناندو الثالث، وحُوّل جامعها إلى كاتدرائية.",
        sources: [BRITANNICA],
      },
    ],
    sources: [BRITANNICA, MET_ANDALUS],
  },
  {
    id: "toledo",
    name: "طليطلة",
    latinName: "Toledo",
    altNames: ["طليطلة", "Toledo", "Toletum"],
    lat: 39.8628,
    lng: -4.0273,
    founded: "عاصمة القوط الغربيين قبل الفتح الإسلامي",
    foundedYear: -192,
    peakYear: 1050,
    endYear: 1085,
    significance: "مدينة الثقافات الثلاث وعاصمة قشتالة بعد الفتح المسيحي",
    description:
      "طليطلة مدينة الطبقات الحضارية: رومانية، قوطية، إسلامية، قشتالية. في العصر الأندلسي كانت من أكبر حواضر " +
      "الوسط وصارت عاصمة طائفة بني ذي النون. ومنها خرج علماء نقلوا التراث العربي إلى اللاتينية بعد فتحها. " +
      "في 6 مايو 1085م فتحها Alfonso السادس ملك قشتالة، فصارت عاصمة لمملكة قشتالة ومركزاً لـ\"مدرسة ترجمة طليطلة\" " +
      "التي نقلت كنوز العلم العربي إلى أوروبا. فيها كنيس المسيغة ومسجد باب المردوم وكاتدرائية قوطية.",
    periods: ["conquest", "emirate", "caliphate", "taifas"],
    majorCity: true,
    imageId: "toledo-1",
    events: [
      {
        year: 712,
        yearLabel: "712",
        title: "فتح طليطلة",
        description: "دخلها المسلمون بعد مفاوضات مع أهلها، فصارت من كبريات مدن الثغر الأوسط.",
        sources: [BRITANNICA],
      },
      {
        year: 1032,
        yearLabel: "1032-1085",
        title: "طائفة بني ذي النون",
        description: "حكم بنو ذي النون طليطلة، وكان إسماعيل ذو النون راعياً للعلماء.",
        sources: [BRITANNICA],
      },
      {
        year: 1085,
        yearLabel: "6 مايو 1085",
        title: "فتح طليطلة",
        description: "استولى ألفونسو السادس على المدينة، فكانت ضربة قوية لدويلات الأندلس وبداية تدهورها.",
        sources: [BRITANNICA, ENC_ISLAM],
      },
    ],
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "zahra",
    name: "الزهراء",
    latinName: "Madinat al-Zahra",
    altNames: ["الزهراء", "مدينة الزهراء", "Medina Azahara"],
    lat: 37.8856,
    lng: -4.8647,
    founded: "بنيت من جديد عام 936م لتكون مقر الخلافة",
    foundedYear: 936,
    endYear: 1010,
    significance: "المدينة الخلافية الأثرية وشاهد على أوج الحضارة الأموية",
    description:
      "مدينة الزهراء مدينة بناها عبد الرحمن الناصر عام 936م على بعد نحو ثمانية كيلومترات غرب قرطبة لتكون مقر حكم الخلافة. " +
      "ضمت قصوراً إدارية وجامعاً وحمامات وحدائق وشبكات مياه متقنة. " +
      "دُمّرت في الحرب الأهلية التي أنهت الخلافة (1009-1010) وهُجرت بعدها نحو ألف عام حتى أُعيد اكتشاف آثارها " +
      "في بداية القرن العشرين. تُعد اليوم من أهم المواقع الأثرية الإسلامية في أوروبا، وأدرجتها اليونسكو في قائمة التراث العالمي.",
    periods: ["caliphate"],
    majorCity: true,
    imageId: "zahra-1",
    events: [
      {
        year: 936,
        yearLabel: "936",
        title: "بناء مدينة الزهراء",
        description: "أمر عبد الرحمن الناصر ببناء المدينة لتكون عاصمة الخلافة الأموية.",
        sources: [UNESCO_ZAHRA],
      },
      {
        year: 1009,
        yearLabel: "1009-1010",
        title: "تدمير الزهراء",
        description: "نهبت المدينة خلال الحرب الأهلية (الفتنة) التي أنهت الخلافة الأموية.",
        sources: [UNESCO_ZAHRA],
      },
      {
        year: 1911,
        yearLabel: "1911",
        title: "إعادة اكتشاف الآثار",
        description: "بدأت الحفريات المنهجية في الموقع التي كشفت عن أطلال المدينة العظيمة.",
        sources: [UNESCO_ZAHRA],
      },
    ],
    sources: [UNESCO_ZAHRA, MET_ANDALUS],
  },
  {
    id: "malaga",
    name: "مالقة",
    latinName: "Málaga",
    altNames: ["مالقة", "Málaga", "Malaqa"],
    lat: 36.7213,
    lng: -4.4214,
    founded: "مدينة فينيقية قديمة (Malaka)، ازدهرت في الإسلام",
    foundedYear: -770,
    peakYear: 1300,
    endYear: 1487,
    significance: "ميناء الأندلس الجنوبي الكبير ومدينة بني نصر الساحلية",
    description:
      "مالقة (مالقة) من أقدم مدن الأندلس، أصلها فينيقي. ازدهرت في العصر الإسلامي ميناءً تجارياً وعسكرياً، " +
      "وفيها قلعة جبل الفارو (Gibralfaro) وحصون المرابطين والموحدين. صارت من أهم مدن مملكة غرناطة. " +
      "سقطت بيد القشتاليين عام 1487م بعد حصار طويل، فكان سقوطها تمهيداً لسقوط غرناطة.",
    periods: ["conquest", "emirate", "caliphate", "almoravids", "almohads", "nasrid"],
    majorCity: true,
    imageId: "malaga-2",
    events: [
      {
        year: 1487,
        yearLabel: "1487",
        title: "سقوط مالقة",
        description: "استسلمت المدينة للقشتاليين بعد حصار عنيف دام أشهراً، فعُدّ تمهيداً لسقوط غرناطة.",
        sources: [BRITANNICA],
      },
    ],
    sources: [BRITANNICA],
  },
  {
    id: "valencia",
    name: "بلنسية",
    latinName: "Valencia",
    altNames: ["بلنسية", "Valencia", "Balansiya"],
    lat: 39.4699,
    lng: -0.3763,
    founded: "أصلها روماني (Valentia)، وازدهرت في الإسلام",
    foundedYear: -138,
    peakYear: 1050,
    endYear: 1238,
    significance: "مدينة شرق الأندلس الكبرى وحاضنة أعرق إرث زراعي وثقافي",
    description:
      "بلنسية من حواضر شرق الأندلس. اشتهرت بأنظمتها المائية وزراعة الأرز وقصب السكر والحوامض التي نقلها المسلمون " +
      "أو طوروها في أرضها، ومنها انتشرت إلى صقلية. كانت عاصمة طائفة قوية في القرن الحادي عشر. " +
      "استولى عليها رودريغو دي بيفار (السيد) بين عامي 1094-1102م باسم القشتاليين. " +
      "ومن آثارها العمرانية لونخة الحرير التي بُنيت في القرن الرابع عشر الميلادي وتُعد من أبهى صروح العمارة القوطية الأندلسية.",
    periods: ["conquest", "emirate", "caliphate", "taifas", "almohads"],
    majorCity: true,
    imageId: "valencia-1",
    events: [
      {
        year: 1021,
        yearLabel: "1010-1094",
        title: "طائفة بلنسية",
        description: "حكمت سلالات متعاقبة بلنسية، وكانت من أغنى الطوائف شرقاً.",
        sources: [BRITANNICA],
      },
      {
        year: 1238,
        yearLabel: "1238",
        title: "فتح بلنسية",
        description: "استولى جيمس الأول ملك أراغون على المدينة فأنهى حكم المسلمين فيها.",
        sources: [BRITANNICA],
      },
    ],
    sources: [BRITANNICA],
  },
  {
    id: "almeria",
    name: "المرية",
    latinName: "Almería",
    altNames: ["المرية", "Almería", "al-Mariyya"],
    lat: 36.834,
    lng: -2.4637,
    founded: "مدينة أسسها عبد الرحمن الثالث عام 955م كميناء ومقر قوة",
    foundedYear: 955,
    peakYear: 1050,
    endYear: 1489,
    significance: "أغنى ميناء شرقي في الأندلس وحاضنة صناعة الحرير",
    description:
      "المرية مدينة أسسها عبد الرحمن الناصر عام 955م لتكون ميناء الخلافة الرئيسي على المتوسط. " +
      "اشتهرت بصناعة الحرير وضفائر الحرير (الطراز) التي كانت تُصدَّر إلى كل أوروبا، وكانت من أغنى المدن الأندلسية. " +
      "صارت عاصمة طائفة قوية تحت بني صمادح. وفيها قلعة كبيرة (الحصون الموحدية) لا تزال قائمة. " +
      "سقطت بيد القشتاليين عام 1489م.",
    periods: ["caliphate", "taifas", "almoravids", "almohads", "nasrid"],
    majorCity: true,
    imageId: "almeria-1",
    events: [
      {
        year: 955,
        yearLabel: "955",
        title: "تأسيس المرية",
        description: "أسسها عبد الرحمن الناصر لتكون ميناء الخلافة الشرقي.",
        sources: [BRITANNICA],
      },
      {
        year: 1146,
        yearLabel: "1146",
        title: "جمهورية المرية",
        description: "أعلن أهلها استقلالاً قصيراً بإدارة ابن ماردنيش قبل العودة إلى الحكم الموحدي.",
        sources: [BRITANNICA, ENC_ISLAM],
      },
    ],
    sources: [BRITANNICA],
  },
];

// ---------- Timeline events ----------

export const timelineEvents: TimelineEvent[] = [
  {
    id: "t-711",
    year: 711,
    yearLabel: "711",
    title: "الفتح الإسلامي لشبه الجزيرة الأيبيرية",
    description:
      "عبر طارق بن زياد المضيق وهزم الملك القوطي رودريك في معركة وادي لكة، فبدأت ثمانية قرون من الوجود الإسلامي في الأندلس.",
    category: "conquest",
    cityId: "cordoba",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "t-756",
    year: 756,
    yearLabel: "756",
    title: "تأسيس إمارة قرطبة الأموية",
    description: "أعلن عبد الرحمن الداخل إمارة قرطبة، فأصبحت المدينة عاصمة أول دولة إسلامية مستقلة في الأندلس.",
    category: "politics",
    cityId: "cordoba",
    sources: [UNESCO_CORDOBA, BRITANNICA],
  },
  {
    id: "t-785",
    year: 785,
    yearLabel: "785-786",
    title: "بدء بناء الجامع الأكبر في قرطبة",
    description: "بدأ بناء الجامع الأكبر الذي صار نموذجاً للعمارة الإسلامية الغربية وأحد أعظم صروحها.",
    category: "architecture",
    cityId: "cordoba",
    sources: [UNESCO_CORDOBA],
  },
  {
    id: "t-822",
    year: 822,
    yearLabel: "822-852",
    title: "عهد عبد الرحمن الثاني وازدهار قرطبة",
    description: "بلغت قرطبة في عهد عبد الرحمن الثاني ازدهاراً عمرانياً وثقافياً، ووصلتها العلوم من المشرق.",
    category: "culture",
    cityId: "cordoba",
    sources: [BRITANNICA],
  },
  {
    id: "t-929",
    year: 929,
    yearLabel: "929",
    title: "عبد الرحمن الناصر يعلن الخلافة",
    description: "توج عبد الرحمن الناصر نفسه خليفة أمير المؤمنين، فدخلت قرطبة عصرها الذهبي السياسي.",
    category: "politics",
    cityId: "cordoba",
    sources: [UNESCO_CORDOBA, BRITANNICA],
  },
  {
    id: "t-936",
    year: 936,
    yearLabel: "936",
    title: "بناء مدينة الزهراء",
    description: "أمر الخليفة عبد الرحمن الناصر ببناء مدينة الزهراء لتكون مقراً فاخراً للخلافة.",
    category: "architecture",
    cityId: "zahra",
    sources: [UNESCO_ZAHRA],
  },
  {
    id: "t-961",
    year: 961,
    yearLabel: "961-976",
    title: "خلافة الحكم المستنصر وازدهار العلم",
    description: "في عهد الحكم المستنصر بلغت مكتبة قرطبة أرقاماً قياسية، وازدهر الطب والفلك والفلسفة.",
    category: "science",
    cityId: "cordoba",
    sources: [BRITANNICA, MET_ANDALUS],
  },
  {
    id: "t-1002",
    year: 1002,
    yearLabel: "1002",
    title: "وفاة الحاجب المنصور",
    description: "بعد وفاة الحاجب المنصور بن أبي عامر دخلت الخلافة في صراعات داخلية عُرفت بالفتنة.",
    category: "politics",
    cityId: "cordoba",
    sources: [BRITANNICA],
  },
  {
    id: "t-1031",
    year: 1031,
    yearLabel: "1031",
    title: "نهاية خلافة قرطبة",
    description: "أُلغيت الخلافة رسمياً وتفتت الأندلس إلى دويلات (طوائف) متنافسة.",
    category: "politics",
    cityId: "cordoba",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "t-1085",
    year: 1085,
    yearLabel: "1085",
    title: "سقوط طليطلة",
    description: "فتح ألفونسو السادس ملك قشتالة طليطلة، فكان ضربة قاسية لدويلات الأندلس.",
    category: "conquest",
    cityId: "toledo",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "t-1086",
    year: 1086,
    yearLabel: "1086",
    title: "معركة الزلاقة ودخول المرابطين",
    description: "دعا ملوك الطوائف المرابطين، فدخل يوسف بن تاشفين الأندلس وانتصر في الزلاقة ثم ضم الطوائف.",
    category: "conquest",
    cityId: "seville",
    sources: [BRITANNICA],
  },
  {
    id: "t-1147",
    year: 1147,
    yearLabel: "1147",
    title: "دخول الموحدين",
    description: "وسّع الموحدون سلطتهم من المغرب إلى الأندلس فوحّدوا البلاد تحت خلافة واحدة.",
    category: "politics",
    cityId: "seville",
    sources: [BRITANNICA],
  },
  {
    id: "t-1195",
    year: 1195,
    yearLabel: "1195",
    title: "معركة الأرك",
    description: "انتصار الموحدين بقيادة يعقوب المنصور على قشتالة في معركة الأرك.",
    category: "conquest",
    cityId: "seville",
    sources: [BRITANNICA],
  },
  {
    id: "t-1212",
    year: 1212,
    yearLabel: "1212",
    title: "معركة العقاب",
    description: "هزيمة الموحدين الفاصلة أمام التحالف المسيحي في لاس نافاس دي تولوسا (العقاب)، فتداعت دولتهم.",
    category: "conquest",
    sources: [BRITANNICA],
  },
  {
    id: "t-1238",
    year: 1238,
    yearLabel: "1238",
    title: "تأسيس مملكة غرناطة",
    description: "دخل محمد الأول بن نصر (الأحمر) غرناطة وأسس آخر دولة إسلامية في الأندلس.",
    category: "politics",
    cityId: "granada",
    sources: [UNESCO_GRANADA, BRITANNICA],
  },
  {
    id: "t-1333",
    year: 1333,
    yearLabel: "1333-1354",
    title: "عصر يوسف الأول وبداية بناء الحمراء",
    description: "بدأ السلطان يوسف الأول بناء قصر الحمراء في صورته المتكاملة، فصار أيقونة الفن الأندلسي.",
    category: "architecture",
    cityId: "granada",
    sources: [UNESCO_GRANADA],
  },
  {
    id: "t-1362",
    year: 1362,
    yearLabel: "1362-1391",
    title: "عصر محمد الخامس وذروة الحمراء",
    description: "بلغ البناء في الحمراء ذروته في عهد محمد الخامس، فأُكمل بهو السيدة وبعض أجنحة القصر.",
    category: "architecture",
    cityId: "granada",
    sources: [UNESCO_GRANADA],
  },
  {
    id: "t-1482",
    year: 1482,
    yearLabel: "1482",
    title: "بدء حرب غرناطة",
    description: "بدأ الملوك الكاثوليكيون حربهم المنظمة لإسقاط مملكة غرناطة.",
    category: "conquest",
    cityId: "granada",
    sources: [BRITANNICA],
  },
  {
    id: "t-1492",
    year: 1492,
    yearLabel: "2 يناير 1492",
    title: "سقوط غرناطة ونهاية الأندلس",
    description: "سلّم أبو عبد الله الصغير المدينة للملكين الكاثوليكيين، فانتهى الحكم الإسلامي في شبه الجزيرة الأيبيرية.",
    category: "fall",
    cityId: "granada",
    sources: [UNESCO_GRANADA, BRITANNICA],
  },
];

// ---------- Figures ----------

export const figures: Figure[] = [
  {
    id: "abd-al-rahman-i",
    name: "عبد الرحمن الداخل",
    latinName: "Abd al-Rahman I",
    born: 731,
    died: 788,
    role: "مؤسس الإمارة الأموية في الأندلس",
    description: "الأموي الفار من مذبحة العباسيين في المشرق، وحّد الأندلس تحت إمارة قرطبة، واشتهر بلقب صقر قريش.",
    cityId: "cordoba",
    sources: [BRITANNICA, UNESCO_CORDOBA],
  },
  {
    id: "abd-al-rahman-iii",
    name: "عبد الرحمن الناصر",
    latinName: "Abd al-Rahman III",
    born: 891,
    died: 961,
    role: "أعظم خلفاء قرطبة",
    description: "أعلن الخلافة عام 929م، ووصل بقرطبة إلى ذروة مجدها، وأمر ببناء مدينة الزهراء.",
    cityId: "cordoba",
    sources: [UNESCO_CORDOBA, UNESCO_ZAHRA],
  },
  {
    id: "al-mansur",
    name: "المنصور بن أبي عامر",
    latinName: "Almanzor",
    born: 938,
    died: 1002,
    role: "حاجب الخليفة وقائدها العسكري",
    description: "بسط نفوذه على الخلافة وقاد حملات عسكرية واسعة، وبعد موته دخلت الخلافة في الفتنة.",
    cityId: "cordoba",
    sources: [BRITANNICA],
  },
  {
    id: "ibn-rushd",
    name: "ابن رشد",
    latinName: "Averroes",
    born: 1126,
    died: 1198,
    role: "فيلسوف وفقيه وقاضٍ أندلسي",
    description: "من أعظم فلاسفة الإسلام، اشتهر بشروحه على أرسطو، وأثر بشدة في الفلسفة الأوروبية.",
    cityId: "cordoba",
    sources: [BRITANNICA, MET_ANDALUS],
  },
  {
    id: "al-zahrawi",
    name: "أبو القاسم الزهراوي",
    latinName: "Al-Zahrawi (Abulcasis)",
    born: 936,
    died: 1013,
    role: "أعظم جراحي العصر الوسيط",
    description: "طبيب أندلسي، مؤلف كتاب التصريف الذي ظل مرجعاً للجراحة في أوروبا قروناً.",
    cityId: "cordoba",
    sources: [MET_ANDALUS, BRITANNICA],
  },
  {
    id: "ibn-hazm",
    name: "ابن حزم الأندلسي",
    latinName: "Ibn Hazm",
    born: 994,
    died: 1064,
    role: "عالم وفقيه وأديب",
    description: "صاحب طوق الحمامة، من أبرع أدباء الأندلس، ومن كبار أعلام الظاهرية.",
    cityId: "cordoba",
    sources: [BRITANNICA, ENC_ISLAM],
  },
  {
    id: "muhammad-v",
    name: "محمد الخامس",
    latinName: "Muhammad V",
    born: 1338,
    died: 1391,
    role: "سلطان غرناطة",
    description: "بلغ قصر الحمراء في عهده أعلى درجات الإبداز المعماري، فبُني بهو السيدة وجنحات قصر الأسود.",
    cityId: "granada",
    sources: [UNESCO_GRANADA],
  },
  {
    id: "ibn-zamrak",
    name: "ابن زمرك",
    latinName: "Ibn Zamrak",
    born: 1333,
    died: 1393,
    role: "شاعر بلاط بني نصر",
    description: "شاعر بلاط الحمراء، نقشت قصائده على جدران القصر فصارت جزءاً من تصميمه.",
    cityId: "granada",
    sources: [UNESCO_GRANADA, MET_ANDALUS],
  },
];

// ---------- Library ----------

export const libraryTopics: LibraryTopic[] = [
  {
    id: "states",
    title: "الدول والحقب التاريخية",
    icon: "crown",
    items: [
      {
        title: "الإمارة الأموية (756-929)",
        description: "تأسيس عبد الرحمن الداخل وتوحيد الأندلس وازدهار قرطبة قبل الخلافة.",
        cityId: "cordoba",
        sources: [UNESCO_CORDOBA, BRITANNICA],
      },
      {
        title: "خلافة قرطبة (929-1031)",
        description: "العهد الذهبي السياسي والعلمي، وبناء مدينة الزهراء، والحرب الأهلية التي أنهت الخلافة.",
        cityId: "zahra",
        sources: [UNESCO_ZAHRA, MET_ANDALUS],
      },
      {
        title: "ملوك الطوائف (1031-1086)",
        description: "تفتت البلاد إلى دويلات مزدهرة ثقافياً وضعيفة عسكرياً.",
        sources: [BRITANNICA, ENC_ISLAM],
      },
      {
        title: "المرابطون والموحدون (1086-1238)",
        description: "دولتان من المغرب وحّدتا الأندلس، تركتا إرثاً معمارياً كبيراً في إشبيلية.",
        cityId: "seville",
        sources: [BRITANNICA],
      },
      {
        title: "مملكة غرناطة (1238-1492)",
        description: "آخر دولة إسلامية في الأندلس، وذروة الفن الأندلسي في قصر الحمراء.",
        cityId: "granada",
        sources: [UNESCO_GRANADA],
      },
    ],
  },
  {
    id: "cities",
    title: "المدن والعواصم",
    icon: "map-pin",
    items: [
      { title: "قرطبة", description: "العاصمة الكبرى وجامعها الأكبر ومدينة الزهراء الملحقة بها.", cityId: "cordoba", sources: [UNESCO_CORDOBA] },
      { title: "غرناطة", description: "آخر عاصمة، والحمراء والبيازين التراث العالمي.", cityId: "granada", sources: [UNESCO_GRANADA] },
      { title: "إشبيلية", description: "عاصمة المرابطين والموحدين وبرج الخيرالدا.", cityId: "seville", sources: [BRITANNICA] },
      { title: "طليطلة", description: "مدينة الثقافات الثلاث ومركز مدرسة الترجمة.", cityId: "toledo", sources: [BRITANNICA] },
      { title: "الزهراء", description: "المدينة الخلافية الأثرية.", cityId: "zahra", sources: [UNESCO_ZAHRA] },
      { title: "مالقة", description: "الميناء الجنوبي وقلعة جبل الفارو.", cityId: "malaga", sources: [BRITANNICA] },
      { title: "بلنسية", description: "حواضر الشرق وأنظمتها المائية ولونخة الحرير.", cityId: "valencia", sources: [BRITANNICA] },
      { title: "المرية", description: "ميناء الخلافة الشرقي وصناعة الحرير.", cityId: "almeria", sources: [BRITANNICA] },
    ],
  },
  {
    id: "figures",
    title: "الشخصيات التاريخية",
    icon: "user",
    items: [
      { title: "عبد الرحمن الداخل", description: "مؤسس الإمارة الأموية في قرطبة.", cityId: "cordoba", sources: [UNESCO_CORDOBA] },
      { title: "عبد الرحمن الناصر", description: "أعظم خلفاء قرطبة وباني الزهراء.", cityId: "zahra", sources: [UNESCO_ZAHRA] },
      { title: "ابن رشد", description: "الفيلسوف الأندلسي الذي علّق على أرسطو.", cityId: "cordoba", sources: [MET_ANDALUS] },
      { title: "الزهراوي", description: "أعظم جراحي العصر الوسيط.", cityId: "cordoba", sources: [MET_ANDALUS] },
      { title: "محمد الخامس", description: "السلطان الذي بلغت الحمراء في عهده ذروتها.", cityId: "granada", sources: [UNESCO_GRANADA] },
      { title: "ابن زمرك", description: "شاعر بلاط الحمراء الذي نقشته جدرانها.", cityId: "granada", sources: [UNESCO_GRANADA] },
    ],
  },
  {
    id: "architecture",
    title: "العمارة والآثار",
    icon: "landmark",
    items: [
      { title: "الجامع الأكبر في قرطبة", description: "ثاني أكبر مساجد الإسلام مساحة، وأعجوبة الأقواس المزدوجة.", cityId: "cordoba", sources: [UNESCO_CORDOBA] },
      { title: "مدينة الزهراء", description: "المدينة الخلافية الأثرية وأعظم مواقع العمارة الأموية.", cityId: "zahra", sources: [UNESCO_ZAHRA] },
      { title: "قصر الحمراء", description: "أعقد تحف الفن الأندلسي: الأقواس المعقوفة والأفنية والنقوش.", cityId: "granada", sources: [UNESCO_GRANADA] },
      { title: "الخيرالدا", description: "المئذنة الموحدية التي صارت برج كاتدرائية إشبيلية.", cityId: "seville", sources: [BRITANNICA] },
      { title: "قلاع مالقة والمرية", description: "حصون المرابطين والموحدين وبنو نصر في الجنوب.", cityId: "malaga", sources: [BRITANNICA] },
    ],
  },
  {
    id: "science",
    title: "العلوم والثقافة",
    icon: "flask",
    items: [
      { title: "الطب والجراحة", description: "الزهراوي وكتابه التصريف، وابن رشد وأبحاثه الطبية.", cityId: "cordoba", sources: [MET_ANDALUS] },
      { title: "الفلك والرياضيات", description: "ازدهرت في قرطبة وطليطلة، ونُقلت إلى أوروبا عبر الترجمة.", cityId: "toledo", sources: [BRITANNICA] },
      { title: "الأدب والشعر", description: "المعتمد بن عباد وابن حزم وابن زمرق، وشعر الغزل والأندلس.", cityId: "seville", sources: [BRITANNICA] },
      { title: "الفنون الزخرفية", description: "العاج والخشب والخزف والأسلحة المزخرفة في متاحف العالم.", sources: [MET_ANDALUS] },
    ],
  },
  {
    id: "sources",
    title: "المصادر والمراجع",
    icon: "book",
    items: [
      { title: "مركز التراث العالمي لليونسكو", description: "سجلات الحمراء وقرطبة والزهراء وأوصافها الرسمية.", sources: [UNESCO_GRANADA, UNESCO_CORDOBA, UNESCO_ZAHRA] },
      { title: "متحف المتروبوليتان للفنون", description: "منشور الأندلس: فن إسبانيا الإسلامية.", sources: [MET_ANDALUS] },
      { title: "ويكيميديا كومنز", description: "خرائط وصور تاريخية بتراخيص موثقة (CC0/CC BY/CC BY-SA).", sources: [COMMONS_MAP] },
      { title: "الموسوعات المرجعية", description: "بريتانيكا والموسوعة الإسلامية كمراجع تواريخ الأحداث.", sources: [BRITANNICA, ENC_ISLAM] },
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

export function periodAtYear(year: number): Period | undefined {
  return periods.find((p) => year >= p.startYear && year <= p.endYear);
}

/** Search index over cities, events, figures, periods. */
export interface SearchEntry {
  id: string;
  title: string;
  latinName?: string;
  kind: "city" | "event" | "figure" | "period" | "book";
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
    kind: "city" as const,
    year: c.foundedYear,
    yearLabel: c.foundedYear !== undefined ? String(Math.abs(c.foundedYear)) : undefined,
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
    kind: "figure" as const,
    year: f.died,
    yearLabel: f.died !== undefined ? `${f.born}–${f.died}` : undefined,
    description: f.role,
    cityId: f.cityId,
  })),
  ...books.map((b) => ({
    id: `book-${b.id}`,
    title: b.title,
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
