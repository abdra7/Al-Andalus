// The atlas cities. Every date and claim below was checked against the cited
// sources (city articles on Wikipedia/Britannica, UNESCO); coordinates are the
// historic centres (WGS84). Galleries reference src/data/images.ts.

import type { City } from "./types";
import {
  BRITANNICA,
  MET_ANDALUS,
  UNESCO_CORDOBA,
  UNESCO_GRANADA,
  UNESCO_ZAHRA,
  W,
  wiki,
} from "./sources";

export const cities: City[] = [
  {
    id: "cordoba",
    name: "قرطبة",
    latinName: "Córdoba",
    altNames: ["قرطبة", "Corduba", "Cordova"],
    lat: 37.8882,
    lng: -4.7794,
    founded: "أصلها روماني (Corduba)، وبلغت ذروتها في العصر الإسلامي",
    foundedYear: -169,
    peakYear: 1000,
    endYear: 1236,
    significance: "عاصمة الإمارة والخلافة الأموية، ومن أكبر مدن العالم في القرن العاشر",
    description:
      "فُتحت قرطبة سنة 711 أو 712م عنوةً لا صلحاً، وصارت مقر الولاة، ثم عاصمة الإمارة الأموية بعد انتصار عبد الرحمن " +
      "الداخل خارجها سنة 756م، فعاصمة الخلافة منذ 929م. في القرن العاشر بلغت أوجها، وتتراوح تقديرات سكانها نحو سنة " +
      "1000م بين مئة ألف ومليون نسمة، ويرجّح بعض المؤرخين قرابة 400 ألف. ضمّت أكثر من ثمانين مكتبة ومؤسسة علمية، " +
      "وأعيد بناء قنطرتها الرومانية ذات الستة عشر قوساً في العهد الأموي. " +
      "بدأت الفتنة فيها في 15 فبراير 1009م، ونهبها البربر سنة 1013م، ثم حكمها بنو جهور بعد إلغاء الخلافة حتى ضمّتها " +
      "إشبيلية سنة 1070م. دخلها فرناندو الثالث في 29 يونيو 1236م بعد حصار دام أشهراً، فحوّل جامعها إلى كاتدرائية. " +
      "أُدرج الجامع في قائمة التراث العالمي سنة 1984م، ثم وسط المدينة التاريخي سنة 1994م.",
    periods: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads"],
    capital: true,
    majorCity: true,
    imageId: "cordoba-mosque-1",
    gallery: [
      "cordoba-mihrab",
      "cordoba-2",
      "cordoba-3",
      "cordoba-1",
      "cordoba-calahorra",
      "cordoba-mosque-4",
      "cordoba-mosque-2",
      "cordoba-mosque-3",
      "art-2",
    ],
    landmarks: [
      {
        name: "الجامع الكبير",
        date: "785–988م",
        note: "بدأه عبد الرحمن الداخل (785–786م)، ووسّعه عبد الرحمن الثاني (833–848م) والحكم المستنصر (961–971م) والمنصور (987–988م).",
        imageId: "cordoba-mosque-1",
      },
      {
        name: "المحراب والمقصورة",
        date: "961–971م",
        note: "أُنجز المحراب وقباب المقصورة سنة 965م، والفسيفساء نحو 970–971م.",
        imageId: "cordoba-mihrab",
      },
      {
        name: "مئذنة الناصر",
        date: "951–952م",
        note: "أول مئذنة حقيقية للجامع، يحتويها اليوم برج الأجراس.",
        imageId: "cordoba-1",
      },
      {
        name: "القنطرة وبرج القلهرة",
        note: "قنطرة رومانية من ستة عشر قوساً أعيد بناؤها في العهد الأموي، وفي طرفها الجنوبي برج يُنسب بناؤه الأول إلى الموحدين.",
        imageId: "cordoba-calahorra",
      },
      {
        name: "الحمّامات الخلافية",
        date: "القرن 10م",
        note: "حمّام قرب القصر رُمّم جزئياً وفُتح متحفاً سنة 2006م.",
      },
    ],
    events: [
      {
        year: 711,
        yearLabel: "711 أو 712",
        title: "فتح قرطبة",
        description: "فُتحت المدينة عنوةً لا صلحاً، خلافاً لكثير من مدن شبه الجزيرة، وصارت مقر الولاة.",
        sources: [W.cordoba],
      },
      {
        year: 756,
        yearLabel: "756",
        title: "تأسيس إمارة قرطبة الأموية",
        description: "هزم عبد الرحمن الداخل الوالي يوسف الفهري خارج قرطبة، فأسس دولة الأمويين في الأندلس.",
        sources: [W.cordoba, wiki("Abd al-Rahman I", "عبد الرحمن الداخل")],
      },
      {
        year: 785,
        yearLabel: "785-786",
        title: "بدء بناء الجامع الكبير",
        description: "بدأ عبد الرحمن الداخل بناء الجامع الذي صار نموذجاً للعمارة الإسلامية في الغرب.",
        sources: [W.mosqueCordoba, UNESCO_CORDOBA],
      },
      {
        year: 929,
        yearLabel: "929",
        title: "إعلان الخلافة",
        description: "أعلن عبد الرحمن الثالث نفسه خليفة، فبلغت قرطبة أوج قوتها في القرن العاشر.",
        sources: [W.cordoba],
      },
      {
        year: 961,
        yearLabel: "961-971",
        title: "زيادة الحكم المستنصر",
        description: "مدّ الحكم بيت الصلاة 45 متراً جنوباً، وأضاف المحراب المزخرف والقباب المضلّعة.",
        sources: [W.mosqueCordoba, wiki("Al-Hakam II", "الحكم المستنصر")],
      },
      {
        year: 1009,
        yearLabel: "15 فبراير 1009",
        title: "بداية الفتنة",
        description: "ثورة في قرطبة أطلقت حرباً أهلية طويلة أنهت عصر الخلافة.",
        sources: [W.cordoba, W.hisham2],
      },
      {
        year: 1236,
        yearLabel: "29 يونيو 1236",
        title: "دخول فرناندو الثالث",
        description: "دخل ملك قشتالة المدينة بعد حصار دام أشهراً، وحُوّل الجامع إلى كاتدرائية.",
        sources: [W.cordoba, W.mosqueCordoba],
      },
    ],
    sources: [W.cordoba, W.mosqueCordoba, UNESCO_CORDOBA, MET_ANDALUS],
  },
  {
    id: "granada",
    name: "غرناطة",
    latinName: "Granada",
    altNames: ["غرناطة", "Granada", "Elvira", "إلبيرة"],
    lat: 37.1773,
    lng: -3.5986,
    founded: "ورثت مدينة إلبيرة القريبة، وصارت عاصمة في القرن الحادي عشر",
    peakYear: 1400,
    endYear: 1492,
    significance: "عاصمة بني زيري ثم بني نصر، وآخر عواصم الأندلس، وموطن الحمراء",
    description:
      "كانت حاضرة الإقليم أول الأمر «مدينة إلبيرة» في السهل، فلما خُرّبت في الفتنة نقل زاوي بن زيري مقرّه إلى المرتفع " +
      "المعروف بغرناطة وأسس طائفة مستقلة، وكان صموئيل بن النغريلة من كبار رجال دولتها. حكمها المرابطون منذ 1090م " +
      "فازدهرت، ثم دخلها محمد بن الأحمر سنة 1238م فجعلها عاصمة آخر دولة إسلامية في الأندلس، ونقل القصر من تل البيازين " +
      "إلى تل السبيكة حيث بدأ بناء الحمراء. في عهد يوسف الأول ومحمد الخامس اكتملت أبهى قصورها، وأُسست المدرسة اليوسفية " +
      "سنة 1349م، وهي المدرسة الكبرى الوحيدة التي بُنيت في الأندلس. سلّمها أبو عبد الله الصغير للملكين الكاثوليكيين في " +
      "2 يناير 1492م. أُدرجت الحمراء وجنة العريف في قائمة التراث العالمي سنة 1984م، وأضيف إليهما حي البيازين.",
    periods: ["taifas", "almoravids", "almohads", "nasrid"],
    capital: true,
    majorCity: true,
    imageId: "alhambra-3",
    gallery: [
      "granada-comares",
      "alhambra-4",
      "alhambra-2",
      "generalife-1",
      "granada-madraza",
      "granada-banuelo",
      "granada-2",
      "alhambra-1",
      "painting-rendicion",
    ],
    landmarks: [
      {
        name: "الحمراء",
        date: "من 1238م",
        note: "بدأها محمد الأول على تل السبيكة؛ لم يبق من عهده إلا بعض الأسوار والقصبة في الطرف الغربي.",
        imageId: "alhambra-3",
      },
      {
        name: "بهو الريحان وبرج قمارش",
        date: "القرن 14م",
        note: "عمل فيه يوسف الأول، وأعاد محمد الخامس زخرفة البهو.",
        imageId: "granada-comares",
      },
      {
        name: "قصر الأسود ونافورته",
        date: "عهد محمد الخامس",
        note: "على حافة حوض النافورة قصيدة لابن زمرك تصف جمالها ونظام مائها.",
        imageId: "alhambra-4",
      },
      {
        name: "جنة العريف",
        note: "المصيف النصري وبساتينه المجاورة للحمراء.",
        imageId: "generalife-1",
      },
      {
        name: "المدرسة اليوسفية",
        date: "1349م",
        note: "أسسها يوسف الأول قرب الجامع الكبير، وبقي منها المصلّى بمحرابه.",
        imageId: "granada-madraza",
      },
      {
        name: "حمّام البانيويلو",
        date: "القرن 11م",
        note: "يرجَّح أنه من العصر الزيري.",
        imageId: "granada-banuelo",
      },
    ],
    events: [
      {
        year: 1090,
        yearLabel: "1090",
        title: "دخول المرابطين",
        description: "خلع يوسف بن تاشفين أمير غرناطة الزيري عبد الله ونفاه إلى أغمات، فازدهرت المدينة في عهدهم.",
        sources: [W.granada, wiki("Yusuf ibn Tashfin", "يوسف بن تاشفين")],
      },
      {
        year: 1238,
        yearLabel: "1238",
        title: "عاصمة بني نصر",
        description: "دخل محمد الأول (ابن الأحمر) غرناطة واتخذها عاصمة، وبدأ بناء الحمراء.",
        sources: [W.granadaEmirate, W.alhambra],
      },
      {
        year: 1349,
        yearLabel: "1349",
        title: "تأسيس المدرسة اليوسفية",
        description: "أسس يوسف الأول المدرسة قرب الجامع الكبير، وهي المدرسة الكبرى الوحيدة في الأندلس.",
        sources: [W.granada, wiki("Yusuf I of Granada", "يوسف الأول")],
      },
      {
        year: 1354,
        yearLabel: "1354-1391",
        title: "عهد محمد الخامس وقصر الأسود",
        description: "حكم محمد الخامس مرتين (1354–1359 و1362–1391م)، وبنى قصر الأسود في الحمراء.",
        sources: [wiki("Muhammad V of Granada", "محمد الخامس"), W.alhambra],
      },
      {
        year: 1491,
        yearLabel: "25 نوفمبر 1491",
        title: "معاهدة تسليم غرناطة",
        description: "بعد حصار طويل وقّع أبو عبد الله الصغير معاهدة التسليم مع الملكين الكاثوليكيين.",
        sources: [W.granadaEmirate],
      },
      {
        year: 1492,
        yearLabel: "2 يناير 1492",
        title: "سقوط غرناطة ونهاية الأندلس",
        description: "سُلّمت المدينة للملكين الكاثوليكيين، فانتهى الحكم الإسلامي في شبه الجزيرة الأيبيرية.",
        sources: [W.granadaEmirate, UNESCO_GRANADA],
      },
    ],
    sources: [W.granada, W.granadaEmirate, W.alhambra, UNESCO_GRANADA],
  },
  {
    id: "seville",
    name: "إشبيلية",
    latinName: "Sevilla",
    altNames: ["إشبيلية", "Sevilla", "Ishbiliya", "Hispalis"],
    lat: 37.3891,
    lng: -5.9845,
    founded: "أصلها روماني (Hispalis)",
    peakYear: 1180,
    endYear: 1248,
    significance: "حاضرة بني عباد، وعاصمة الموحدين في الأندلس",
    description:
      "عُرفت بعد الفتح باسم إشبيلية، ودخلها موسى بن نصير على الأرجح في أواخر صيف 712م، ثم استعادها ابنه عبد العزيز في " +
      "يوليو 713م. وفي منتصف القرن التاسع هاجمها النورمان (المجوس) واحتلوها أربعين يوماً. بعد سقوط الخلافة صارت عاصمة " +
      "طائفة قوية حكمها بنو عباد (1023–1091م)، واشتهر بلاط المعتمد بن عباد بالشعر حتى خلعه المرابطون سنة 1091م. " +
      "دخلها الموحدون سنة 1147م، وجعلوها منذ 1163م عاصمتهم في الأندلس إلى جانب مراكش، فبنوا فيها جامعاً كبيراً بأمر " +
      "أبي يعقوب يوسف (1171م) ومئذنته الخيرالدا (1184–1198م)، وبرج الذهب على النهر (1220–1221م). " +
      "حاصرها فرناندو الثالث سنة 1247م، فسلّمت في 23 نوفمبر 1248م بعد نحو خمسة عشر شهراً.",
    periods: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads"],
    capital: true,
    majorCity: true,
    imageId: "seville-1",
    gallery: ["seville-2", "seville-naranjos", "seville-torre-del-oro", "seville-4", "seville-3"],
    landmarks: [
      {
        name: "الخيرالدا",
        date: "1184–1198م",
        note: "أمر بها أبو يعقوب يوسف واستُؤنف بناؤها سنة 1188م، بدأها أحمد بن باسُه وأتمّها علي الغماري في مارس 1198م.",
        imageId: "seville-2",
      },
      {
        name: "صحن البرتقال",
        note: "صحن الجامع الموحدي، باقٍ اليوم داخل الكاتدرائية.",
        imageId: "seville-naranjos",
      },
      {
        name: "برج الذهب",
        date: "1220–1221م",
        note: "بناه الوالي الموحدي أبو العلا لحراسة النهر، وأضيف طابقه الثاني في القرن الرابع عشر وقمته سنة 1760م.",
        imageId: "seville-torre-del-oro",
      },
      {
        name: "قصر المبارك",
        note: "بناه الموحدون في موضع القصر (ألكاثار) الحالي.",
        imageId: "seville-4",
      },
    ],
    events: [
      {
        year: 712,
        yearLabel: "712",
        title: "فتح إشبيلية",
        description: "دخلها موسى بن نصير بعد حصار دام ثلاثة أشهر، ثم استعادها ابنه عبد العزيز في يوليو 713م.",
        sources: [W.seville, wiki("Musa ibn Nusayr", "موسى بن نصير")],
      },
      {
        year: 1023,
        yearLabel: "1023-1091",
        title: "طائفة بني عباد",
        description: "حكم بنو عباد إشبيلية، وكان بلاط المعتمد بن عباد من أزهى بلاطات الأندلس شعراً وأدباً.",
        sources: [W.seville, W.taifa],
      },
      {
        year: 1147,
        yearLabel: "1147",
        title: "دخول الموحدين",
        description: "دخل الموحدون إشبيلية، ثم جعلوها منذ 1163م عاصمتهم في الأندلس.",
        sources: [W.seville, W.almohads],
      },
      {
        year: 1184,
        yearLabel: "1184-1198",
        title: "بناء الخيرالدا",
        description: "بُنيت مئذنة الجامع الكبير، وصارت بعد إضافة برج الأجراس رمز المدينة.",
        sources: [W.giralda],
      },
      {
        year: 1220,
        yearLabel: "1220-1221",
        title: "بناء برج الذهب",
        description: "بنى الوالي أبو العلا البرج على الوادي الكبير لحراسة مدخل النهر.",
        sources: [W.torreOro],
      },
      {
        year: 1248,
        yearLabel: "23 نوفمبر 1248",
        title: "تسليم إشبيلية",
        description: "سلّمت المدينة لفرناندو الثالث بعد حصار دام نحو خمسة عشر شهراً.",
        sources: [W.seville],
      },
    ],
    sources: [W.seville, W.giralda, W.torreOro, MET_ANDALUS],
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
    significance: "عاصمة القوط، وحاضرة الثغر الأوسط، ومركز الترجمة بعد سقوطها",
    description:
      "دخلها طارق بن زياد سنة 711 أو 712م وكانت عاصمة القوط الغربيين. جعلها الأمويون مركز الثغر الأوسط، فكانت مسرحاً " +
      "لثورات كثيرة على قرطبة بين 761 و857م. بعد الفتنة صارت عاصمة طائفة مستقلة حكمها بنو ذي النون، وبلغ سكانها قبيل " +
      "سقوطها نحو 28 ألفاً، منهم قرابة أربعة آلاف يهودي. دخلها ألفونسو السادس ملك قشتالة في 25 مايو 1085م، فكان سقوطها " +
      "صدمة دفعت ملوك الطوائف إلى الاستنجاد بالمرابطين. وصارت بعدها مركزاً لنقل الكتب العربية والعبرية إلى القشتالية " +
      "واللاتينية بأيدي علماء من المسلمين واليهود. ومن آثارها الإسلامية مسجد باب المردوم (999م) وباب بيساغرا القديم.",
    periods: ["conquest", "emirate", "caliphate", "taifas"],
    majorCity: true,
    imageId: "toledo-1",
    gallery: ["toledo-bab-mardum", "toledo-bab-mardum-interior", "toledo-2"],
    landmarks: [
      {
        name: "مسجد باب المردوم",
        date: "999م",
        note: "مصلّى صغير بنقش يسمّي بانيه موسى بن علي، تقسمه الأعمدة إلى تسعة أقسام، وصار كنيسة بعد 1085م.",
        imageId: "toledo-bab-mardum",
      },
      {
        name: "باب بيساغرا القديم",
        date: "القرن 10م",
        note: "المدخل الرئيس للمدينة في العصر الأندلسي.",
      },
      { name: "مسجد التورنيرياس", date: "القرن 11م", note: "مسجد صغير من عصر الطائفة." },
    ],
    events: [
      {
        year: 711,
        yearLabel: "711 أو 712",
        title: "دخول طارق بن زياد",
        description: "قاد طارق بنفسه الفرقة التي دخلت عاصمة القوط بعد معركة وادي لكة.",
        sources: [W.toledo, wiki("Tariq ibn Ziyad", "طارق بن زياد")],
      },
      {
        year: 999,
        yearLabel: "999",
        title: "بناء مسجد باب المردوم",
        description: "بُني المصلّى الصغير الذي بقي إلى اليوم باسم «كريستو دي لا لوث».",
        sources: [W.babMardum],
      },
      {
        year: 1085,
        yearLabel: "25 مايو 1085",
        title: "سقوط طليطلة",
        description: "دخل ألفونسو السادس المدينة، فكانت ضربة قاسية لدويلات الطوائف.",
        sources: [W.toledo],
      },
    ],
    sources: [W.toledo, W.babMardum, BRITANNICA],
  },
  {
    id: "zahra",
    name: "الزهراء",
    latinName: "Madinat al-Zahra",
    altNames: ["الزهراء", "مدينة الزهراء", "Medina Azahara"],
    lat: 37.8856,
    lng: -4.8647,
    founded: "أسسها عبد الرحمن الناصر سنة 936م مقراً للخلافة",
    foundedYear: 936,
    endYear: 1010,
    significance: "مدينة الخلافة الأموية قرب قرطبة، من أهم المواقع الأثرية الإسلامية في أوروبا",
    description:
      "أسسها عبد الرحمن الناصر سنة 936م على بعد بضعة كيلومترات غربي قرطبة، وأشرف على بنائها ولي عهده الحكم، وربما لم " +
      "يبدأ البناء الكبير قبل 940م. سكنها الخليفة بحلول 945م، ونُقلت إليها دواوين الدولة ودار السكة سنة 947م. " +
      "أشهر قاعاتها المجلس الشرقي المعروف بالصالون الغني، الذي تؤرخه نقوشه بين 953 و957م. نُهبت بين 1010 و1013م في " +
      "الفتنة ثم هُجرت، وبدأت الحفريات فيها سنة 1911م، وأدرجتها اليونسكو في قائمة التراث العالمي في 1 يوليو 2018م. " +
      "ومن روائع ما صُنع فيها علب العاج المنقوشة، مثل علبة الأمير المغيرة ابن عبد الرحمن الناصر.",
    periods: ["caliphate"],
    majorCity: true,
    imageId: "zahra-salon-rico",
    gallery: ["zahra-1", "zahra-3", "zahra-2", "art-1", "art-3"],
    landmarks: [
      {
        name: "المجلس الشرقي (الصالون الغني)",
        date: "953–957م",
        note: "قاعة استقبال الخليفة، بأقواسها الحدوية المزخرفة.",
        imageId: "zahra-salon-rico",
      },
      {
        name: "علبة المغيرة العاجية",
        note: "من روائع العاج المنحوت، صُنعت في الزهراء.",
        imageId: "art-1",
      },
    ],
    events: [
      {
        year: 936,
        yearLabel: "936",
        title: "تأسيس الزهراء",
        description: "أمر عبد الرحمن الناصر ببناء المدينة، وأوكل الإشراف عليها إلى ابنه الحكم.",
        sources: [W.zahra],
      },
      {
        year: 945,
        yearLabel: "945-947",
        title: "انتقال البلاط",
        description: "سكنها الخليفة بحلول 945م، ونُقلت إليها الدواوين ودار السكة سنة 947م.",
        sources: [W.zahra],
      },
      {
        year: 1010,
        yearLabel: "1010-1013",
        title: "نهب الزهراء",
        description: "نُهبت المدينة في الحرب الأهلية (الفتنة) ثم هُجرت.",
        sources: [W.zahra, UNESCO_ZAHRA],
      },
      {
        year: 1911,
        yearLabel: "1911",
        title: "بدء الحفريات",
        description: "بدأ التنقيب المنهجي الذي كشف أطلال المدينة.",
        sources: [W.zahra],
      },
      {
        year: 2018,
        yearLabel: "2018",
        title: "التراث العالمي",
        description: "أدرجت اليونسكو مدينة الزهراء في قائمة التراث العالمي.",
        sources: [UNESCO_ZAHRA],
      },
    ],
    sources: [W.zahra, UNESCO_ZAHRA, MET_ANDALUS],
  },
  {
    id: "malaga",
    name: "مالقة",
    latinName: "Málaga",
    altNames: ["مالقة", "Málaga", "Malaka"],
    lat: 36.7213,
    lng: -4.4214,
    founded: "مدينة فينيقية قديمة (Malaka)",
    foundedYear: -770,
    peakYear: 1400,
    endYear: 1487,
    significance: "ميناء مملكة غرناطة الأول ومدينة القصبة وجبل الفارو",
    description:
      "مالقة فينيقية الأصل، فتحها المسلمون سنة 711 أو ربما 713م. صارت في القرن الحادي عشر مركز قوة لبني حمود الذين بدأوا " +
      "بناء قصبتها، ثم انتزعها منهم زيريّو غرناطة سنة 1056 أو 1057م، ثم المرابطون. في عهد بني نصر أعاد محمد الثاني " +
      "بناء القصبة في أوائل القرن الرابع عشر، وبنى يوسف الأول قلعة جبل الفارو فوقها ووصلهما بممر مسوّر، وكانت مالقة " +
      "أهم موانئ المملكة. اشتهرت بتين «ريّة» الذي قيل إنه كان يُصدَّر إلى الصين، وبالخزف المذهّب الذي امتدحه ابن بطوطة. " +
      "حاصرها الملكان الكاثوليكيان من 6 مايو 1487م حتى سلّمت في 18 أغسطس، واستُعبد نحو أحد عشر ألفاً من أهلها.",
    periods: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads", "nasrid"],
    majorCity: true,
    imageId: "malaga-alcazaba-patio",
    gallery: ["malaga-1", "malaga-gibralfaro", "malaga-3", "statue-ibn-baytar"],
    landmarks: [
      {
        name: "القصبة",
        date: "القرن 11م",
        note: "بدأها بنو حمود، وأعاد بناءها محمد الثاني النصري في أوائل القرن الرابع عشر.",
        imageId: "malaga-alcazaba-patio",
      },
      {
        name: "قلعة جبل الفارو",
        date: "القرن 14م",
        note: "بناها يوسف الأول على التل الأعلى ووصلها بالقصبة بممر مسوّر.",
        imageId: "malaga-gibralfaro",
      },
    ],
    events: [
      {
        year: 1056,
        yearLabel: "1056 أو 1057",
        title: "زيريّو غرناطة",
        description: "انتزع بنو زيري مالقة من بني حمود.",
        sources: [W.malaga],
      },
      {
        year: 1487,
        yearLabel: "18 أغسطس 1487",
        title: "سقوط مالقة",
        description: "سلّمت المدينة بعد حصار بدأ في 6 مايو، فانقطع عن غرناطة أهم موانئها.",
        sources: [W.malaga, W.alcazabaMalaga],
      },
    ],
    sources: [W.malaga, W.alcazabaMalaga, W.granadaEmirate],
  },
  {
    id: "valencia",
    name: "بلنسية",
    latinName: "Valencia",
    altNames: ["بلنسية", "Valencia", "Balansiya", "Valentia"],
    lat: 39.4699,
    lng: -0.3763,
    founded: "أصلها روماني (Valentia)",
    foundedYear: -138,
    peakYear: 1050,
    endYear: 1238,
    significance: "حاضرة شرق الأندلس، بإرثها في الري وتنظيم المياه",
    description:
      "دخلها المسلمون نحو سنة 714م، وأمر عبد الرحمن الداخل بتخريب المدينة القديمة سنة 788–789م. ومع الفتنة صارت عاصمة " +
      "إمارة مستقلة في القرن الحادي عشر، ثم استولى عليها السيد (الكمبيادور) سنة 1094م، فلما خرجت قواته منها سنة 1102م " +
      "دخلها المرابطون. وبعد ضعفهم حكم ابن مردنيش شرق الأندلس وقاوم الموحدين حتى سنة 1172م. " +
      "سلّمها أهلها لجاك الأول ملك أراغون في 28 سبتمبر 1238م. ولا تزال «محكمة المياه» التي تفصل في نزاعات الري كل " +
      "خميس عند باب الكاتدرائية تُنسب إلى العصر الأندلسي، وبقيت أجزاء من سورها الإسلامي بين بيوت الحي القديم. " +
      "أما سوق الحرير (اللونخة) وحمّامات الأمير فمن عمارة ما بعد الفتح المسيحي.",
    periods: ["conquest", "emirate", "caliphate", "taifas", "almoravids", "almohads"],
    majorCity: true,
    imageId: "valencia-islamic-wall",
    gallery: ["valencia-almirall-baths", "valencia-2", "valencia-1"],
    landmarks: [
      {
        name: "السور الإسلامي",
        note: "بقايا متفرقة بين بيوت حي الكارمن القديم.",
        imageId: "valencia-islamic-wall",
      },
      {
        name: "محكمة المياه",
        note: "تجتمع كل خميس في ساحة العذراء للفصل في نزاعات الري، وتُنسب إلى العصر الأندلسي.",
      },
      {
        name: "حمّامات الأمير",
        date: "1313–1320م",
        note: "حمّامات على الطراز المدجّن بُنيت بعد الفتح المسيحي.",
        imageId: "valencia-almirall-baths",
      },
    ],
    events: [
      {
        year: 1094,
        yearLabel: "1094",
        title: "السيد في بلنسية",
        description: "استولى رودريغو دي بيبار (السيد) على المدينة بالقوة.",
        sources: [W.valencia],
      },
      {
        year: 1102,
        yearLabel: "1102",
        title: "دخول المرابطين",
        description: "بعد خروج قوات السيد من المدينة دخلها المرابطون.",
        sources: [W.valencia, W.almoravids],
      },
      {
        year: 1238,
        yearLabel: "28 سبتمبر 1238",
        title: "تسليم بلنسية",
        description: "سلّم أهلها المدينة لجاك الأول ملك أراغون، فانتهى حكم المسلمين فيها.",
        sources: [W.valencia],
      },
    ],
    sources: [W.valencia, W.taifa, BRITANNICA],
  },
  {
    id: "almeria",
    name: "المرية",
    latinName: "Almería",
    altNames: ["المرية", "Almería", "al-Mariyya"],
    lat: 36.834,
    lng: -2.4637,
    founded: "منحها عبد الرحمن الناصر لقب المدينة وأمر بأسوارها سنة 955م",
    foundedYear: 955,
    peakYear: 1050,
    endYear: 1489,
    significance: "مرفأ الخلافة على المتوسط ومدينة الحرير والطراز",
    description:
      "كانت «مريّة بجّانة» مرفأً لمدينة بجّانة، ومعنى «المريّة» المرقب أو برج المراقبة، فمنحها عبد الرحمن الناصر سنة 955م " +
      "لقب المدينة وأمر ببناء أسوارها وقصبتها في أعلاها. نحو سنة 1014م استقلت عن قرطبة بحكم الفتيان، وأولهم خيران " +
      "الذي وسّع القصبة، ثم حكمها بنو صمادح العرب حتى 1091م. اشتهرت بصناعة الحرير ذات المئات من الأنوال، وبأكثر من " +
      "ثمانمئة مشغل للطراز. استولى عليها ألفونسو السابع في 17 أكتوبر 1147م بحملة شارك فيها القطلانيون والجنويون " +
      "والبيزيون، ثم صارت للموحدين سنة 1157م، وانضمت إلى مملكة غرناطة بعد 1238م حتى سلّمت للملكين الكاثوليكيين في " +
      "22 ديسمبر 1489م.",
    periods: ["caliphate", "taifas", "almoravids", "almohads", "nasrid"],
    majorCity: true,
    imageId: "almeria-1",
    gallery: ["almeria-jayran-wall", "almeria-2"],
    landmarks: [
      {
        name: "القصبة",
        date: "من 955م",
        note: "بدأها عبد الرحمن الناصر، ووسّعها المنصور ثم خيران.",
        imageId: "almeria-1",
      },
      {
        name: "سور خيران",
        note: "سور يمتد على التلال وينسب إلى خيران أول ملوك الطائفة.",
        imageId: "almeria-jayran-wall",
      },
    ],
    events: [
      {
        year: 955,
        yearLabel: "955",
        title: "مدينة المرية",
        description: "منحها عبد الرحمن الناصر لقب المدينة وأمر ببناء أسوارها وقصبتها.",
        sources: [W.almeria, W.alcazabaAlmeria],
      },
      {
        year: 1014,
        yearLabel: "نحو 1014",
        title: "طائفة المرية",
        description: "استقلت المدينة عن قرطبة، ثم حكمها بنو صمادح حتى 1091م.",
        sources: [W.almeria],
      },
      {
        year: 1147,
        yearLabel: "17 أكتوبر 1147",
        title: "حملة ألفونسو السابع",
        description: "استولت حملة قشتالية جنوية بيزية قطلانية على المدينة، ثم صارت للموحدين سنة 1157م.",
        sources: [W.almeria],
      },
      {
        year: 1489,
        yearLabel: "22 ديسمبر 1489",
        title: "تسليم المرية",
        description: "دخلت المدينة في طاعة الملكين الكاثوليكيين.",
        sources: [W.almeria],
      },
    ],
    sources: [W.almeria, W.alcazabaAlmeria, BRITANNICA],
  },
  {
    id: "zaragoza",
    name: "سرقسطة",
    latinName: "Zaragoza",
    altNames: ["سرقسطة", "Saraqusta", "Caesaraugusta", "Zaragoza"],
    lat: 41.6488,
    lng: -0.8891,
    founded: "اشتُق اسمها العربي من اسمها الروماني «قيصر أغسطا»",
    peakYear: 1070,
    endYear: 1118,
    significance: "حاضرة الثغر الأعلى، وعاصمة بني هود وقصر الجعفرية",
    description:
      "اشتُق اسمها العربي «سرقسطة» من اسمها الروماني Caesaraugusta، وفتحها موسى بن نصير في حملته على شمال الأندلس. " +
      "صارت بعد الفتح عاصمة الثغر الأعلى في وجه الممالك المسيحية الشمالية. استقلّت بعد 1018م بحكم أسرة التجيبيين، " +
      "ثم حكمها بنو هود منذ 1039م، وبنى أميرها أبو جعفر أحمد المقتدر قصر الجعفرية الذي سمّاه «قصر السرور»، وأُنجز " +
      "معظمه بين 1065 و1081م. وفيها وُلد الفيلسوف ابن باجة نحو 1085م. دخلها المرابطون سنة 1110م، ثم استولى عليها " +
      "ألفونسو الأول ملك أراغون في 18 ديسمبر 1118م. اتخذ ملوك أراغون الجعفرية قصراً، وهي اليوم مقر برلمان أراغون، " +
      "وأُدرجت سنة 2001م ضمن موقع التراث العالمي «العمارة المدجّنة في أراغون».",
    periods: ["conquest", "emirate", "caliphate", "taifas", "almoravids"],
    majorCity: true,
    imageId: "zaragoza-1",
    gallery: ["zaragoza-aljaferia-mihrab", "zaragoza-2"],
    landmarks: [
      {
        name: "قصر الجعفرية",
        date: "1065–1081م",
        note: "قصر بني هود، سُمّي نسبة إلى كنية المقتدر «أبو جعفر».",
        imageId: "zaragoza-1",
      },
      {
        name: "مصلّى الجعفرية ومحرابه",
        note: "مسجد صغير خاص عند مدخل القاعة الذهبية، محرابه نحو مكة.",
        imageId: "zaragoza-aljaferia-mihrab",
      },
      {
        name: "برج التروبادور",
        note: "أقدم أجزاء القصر، يؤرَّخ بأواخر القرن التاسع أو النصف الثاني من القرن العاشر.",
        imageId: "zaragoza-2",
      },
    ],
    events: [
      {
        year: 1039,
        yearLabel: "1039",
        title: "بنو هود",
        description: "انتقل حكم طائفة سرقسطة من التجيبيين إلى بني هود.",
        sources: [W.zaragoza],
      },
      {
        year: 1065,
        yearLabel: "1065-1081",
        title: "بناء قصر الجعفرية",
        description: "أنجز المقتدر بن هود معظم قصره «قصر السرور».",
        sources: [W.aljaferia],
      },
      {
        year: 1110,
        yearLabel: "1110",
        title: "دخول المرابطين",
        description: "ضمّ المرابطون سرقسطة إلى دولتهم.",
        sources: [W.zaragoza],
      },
      {
        year: 1118,
        yearLabel: "18 ديسمبر 1118",
        title: "سقوط سرقسطة",
        description: "استولى ألفونسو الأول ملك أراغون على المدينة من المرابطين.",
        sources: [W.zaragoza, W.almoravids],
      },
    ],
    sources: [W.zaragoza, W.aljaferia, wiki("Ibn Bajja", "ابن باجة")],
  },
];
