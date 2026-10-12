// Image metadata for Al-Andalus historical atlas.
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

export const images: HistoricalImage[] = [
  {
    "id": "alhambra-1",
    "subject": "alhambra",
    "localFile": "/images/alhambra-1.jpg",
    "width": 1200,
    "height": 1940,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bell_Alhambra_Granada_Spain.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "The bell gable at the top of the Torre de la Vela in Alcazaba , Alhambra de Granada , Spain ."
  },
  {
    "id": "alhambra-2",
    "subject": "alhambra",
    "localFile": "/images/alhambra-2.jpg",
    "width": 1200,
    "height": 1805,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Puerta_del_Vino_Alhambra_Granada_Spain.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "The Wine Door ( Puerta del Vino ), exterior, Alhambra, Granada, Spain."
  },
  {
    "id": "alhambra-3",
    "subject": "alhambra",
    "localFile": "/images/alhambra-3.jpg",
    "width": 1200,
    "height": 676,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_whole_Alhambra_Granada_Spain.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "The whole Alhambra, as seen from the mirador San Nicolas, Granada, Spain."
  },
  {
    "id": "alhambra-4",
    "subject": "alhambra",
    "localFile": "/images/alhambra-4.jpg",
    "width": 1200,
    "height": 850,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fountain_patio_de_los_Leones_Alhambra_Granada_Spain.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "The twelve lions fountain of the Patio de los meones , a few days after the first water delivery, after more than 10 years of restoration. Alhambra, Granada, Spain."
  },
  {
    "id": "generalife-1",
    "subject": "generalife",
    "localFile": "/images/generalife-1.jpg",
    "width": 1200,
    "height": 1848,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alhambra_Generalife_fountains.jpg",
    "license": "CC BY-SA 2.0",
    "artist": "Andrew Dunn , http://www.andrewdunnphoto.com/",
    "description": "The Patio de la Acequia (Court of the Long Pond), with its 48m long pool lined with fountains, is one of the most popular parts of the Gardens Generalife in the Alhambra, Granada."
  },
  {
    "id": "generalife-2",
    "subject": "generalife",
    "localFile": "/images/generalife-2.jpg",
    "width": 1200,
    "height": 1479,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Euphorbia_marginata_Generalife_Granada_Spain.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "Euphorbia marginata , snow-on-the-mountain, Generalife gardens, Granada, Spain."
  },
  {
    "id": "granada-1",
    "subject": "granada",
    "localFile": "/images/granada-1.jpg",
    "width": 1200,
    "height": 1805,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alhambra_-_Granada_-_005_-_Panorama_part.jpg",
    "license": "Public domain",
    "artist": "Roland Geider ( Ogre )",
    "description": "Part of the panorama image below"
  },
  {
    "id": "granada-2",
    "subject": "granada",
    "localFile": "/images/granada-2.jpg",
    "width": 1200,
    "height": 1805,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alhambra_-_Granada_-_007_-_Panorama_part.jpg",
    "license": "Public domain",
    "artist": "Roland Geider ( Ogre )",
    "description": "Part of the panorama image below"
  },
  {
    "id": "granada-3",
    "subject": "granada",
    "localFile": "/images/granada-3.jpg",
    "width": 1200,
    "height": 1805,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alhambra_-_Granada_-_008_-_Panorama_part.jpg",
    "license": "Public domain",
    "artist": "Roland Geider ( Ogre )",
    "description": "Part of the panorama image below"
  },
  {
    "id": "cordoba-mosque-1",
    "subject": "cordoba-mosque",
    "localFile": "/images/cordoba-mosque-1.jpg",
    "width": 1200,
    "height": 800,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Interior_Mezquita_Cordoba_Spain.jpg",
    "license": "CC BY-SA 2.5",
    "artist": "Jialiang Gao www.peace-on-earth.org",
    "description": "The arches of red-and-white stripes inside the \"La Mezquita\" in Cordoba, Spain represent some of the pinnacles of the Moorish architectures."
  },
  {
    "id": "cordoba-mosque-2",
    "subject": "cordoba-mosque",
    "localFile": "/images/cordoba-mosque-2.jpg",
    "width": 1200,
    "height": 899,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:C%C3%B3rdoba._La_Mezquita_LCCN2017660381.jpg",
    "license": "Public domain",
    "artist": "Photoglob Co., publisher",
    "description": "Title: Córdoba. La Mezquita Abstract/medium: 1 print : color photochrom ; sheet 17 x 23 cm."
  },
  {
    "id": "cordoba-mosque-3",
    "subject": "cordoba-mosque",
    "localFile": "/images/cordoba-mosque-3.jpg",
    "width": 1200,
    "height": 959,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:C%C3%B3rdoba._Vista_interior_de_la_Catedral_%C3%B3_Mezquita_LCCN94511958.jpg",
    "license": "Public domain",
    "artist": "Laurent, J., photographer",
    "description": "Title: Córdoba. Vista interior de la Catedral ó Mezquita Abstract/medium: 1 photographic print : albumen."
  },
  {
    "id": "cordoba-mosque-4",
    "subject": "cordoba-mosque",
    "localFile": "/images/cordoba-mosque-4.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mezquita_cordoba_arco_interior.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Alvaro.vinuela.carnicero",
    "description": "Arabic arch inside Cordoba's Mosque (Mezquita)"
  },
  {
    "id": "cordoba-1",
    "subject": "cordoba",
    "localFile": "/images/cordoba-1.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Historic_centre_of_C%C3%B3rdoba_Part1_017.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Yamen",
    "description": "Historic centre of Córdoba"
  },
  {
    "id": "cordoba-2",
    "subject": "cordoba",
    "localFile": "/images/cordoba-2.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Historic_centre_of_C%C3%B3rdoba_Part1_036.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Yamen",
    "description": "Historic centre of Córdoba"
  },
  {
    "id": "cordoba-3",
    "subject": "cordoba",
    "localFile": "/images/cordoba-3.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Historic_centre_of_C%C3%B3rdoba_Part1_061.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Yamen",
    "description": "Historic centre of Córdoba"
  },
  {
    "id": "zahra-1",
    "subject": "zahra",
    "localFile": "/images/zahra-1.jpg",
    "width": 1200,
    "height": 800,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ruins_-_Madinat_al-Zahra_(2).JPG",
    "license": "CC BY-SA 3.0",
    "artist": "José Luiz",
    "description": "Ruínas"
  },
  {
    "id": "zahra-2",
    "subject": "zahra",
    "localFile": "/images/zahra-2.jpg",
    "width": 1200,
    "height": 777,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ruins_-_Madinat_al-Zahra.JPG",
    "license": "CC BY-SA 3.0",
    "artist": "José Luiz",
    "description": "Ruínas"
  },
  {
    "id": "zahra-3",
    "subject": "zahra",
    "localFile": "/images/zahra-3.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Patio_de_las_Mujeres,_Alc%C3%A1zar_de_los_Reyes_Cristianos.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Alvaro.vinuela.carnicero",
    "description": "Ruins of the old buldings of the ancient city of Medina Azahara, Córdoba. Old buildings strutcture is visible"
  },
  {
    "id": "seville-1",
    "subject": "seville",
    "localFile": "/images/seville-1.jpg",
    "width": 1200,
    "height": 858,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Plaza_Virgen_de_los_Reyes,_Seville,_Spain_-_Sep_2009.jpg",
    "license": "CC BY-SA 3.0",
    "artist": "Diliff",
    "description": "An ultrawide angle view of the Plaza Virgen de los Reyes looking west towards the Cathedral of Seville and the Giralda. On the left is the Convento de la Encarnacion and on the right is the Palacio Arzobispal (the Archbishop's Palace). This is a 4 segment panorama taken with a Canon 5D and 17-40mm f"
  },
  {
    "id": "seville-2",
    "subject": "seville",
    "localFile": "/images/seville-2.jpg",
    "width": 1200,
    "height": 1800,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:La_Giralda,_Seville,_Spain_-_Sep_2009.jpg",
    "license": "CC BY-SA 3.0",
    "artist": "Diliff",
    "description": "La Giralda at dusk, the tower of the Cathedral of Seville, as viewed from the Plaza Virgen de los Reyes in Seville, Spain. Taken with a Canon 5D and 17-40mm f/4L lens at 30mm."
  },
  {
    "id": "seville-3",
    "subject": "seville",
    "localFile": "/images/seville-3.jpg",
    "width": 1200,
    "height": 1600,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Giralda_Sevilla.jpg",
    "license": "CC BY-SA 3.0",
    "artist": "Kiban",
    "description": "Giralda, Seville, Spain."
  },
  {
    "id": "seville-4",
    "subject": "seville",
    "localFile": "/images/seville-4.jpg",
    "width": 1200,
    "height": 978,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Giralda_cath%C3%A9drale_tour_Seville_Espagne.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "The \"Giralda\", a part of the cathedral, a tower of the walls of the Real Alcazar, Seville, Spain."
  },
  {
    "id": "toledo-1",
    "subject": "toledo",
    "localFile": "/images/toledo-1.jpg",
    "width": 1200,
    "height": 802,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Vista_general_de_Toledo_(Espa%C3%B1a)_01.jpg",
    "license": "CC BY-SA 2.0",
    "artist": "tnarik from Spain",
    "description": "General view of Toledo ( Province of Toledo , Castile-La Mancha , Spain )."
  },
  {
    "id": "toledo-2",
    "subject": "toledo",
    "localFile": "/images/toledo-2.jpg",
    "width": 1200,
    "height": 800,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Toledo_-_02.jpg",
    "license": "CC BY-SA 3.0 es",
    "artist": "Carlos Delgado",
    "description": "View of Toledo, Spain."
  },
  {
    "id": "toledo-3",
    "subject": "toledo",
    "localFile": "/images/toledo-3.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Historic,_Puente_del_Toledo_(6382189033).jpg",
    "license": "CC BY-SA 2.0",
    "artist": "La Citta Vita",
    "description": "Historic, Puente del Toledo"
  },
  {
    "id": "malaga-1",
    "subject": "malaga",
    "localFile": "/images/malaga-1.jpg",
    "width": 1200,
    "height": 537,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Malaga_Alcazaba_25-9-2007a.JPG",
    "license": "CC BY-SA 3.0",
    "artist": "Hedwig Storch",
    "description": "Málaga : View from the harbor to the Alcazaba ."
  },
  {
    "id": "malaga-2",
    "subject": "malaga",
    "localFile": "/images/malaga-2.jpg",
    "width": 1200,
    "height": 799,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alcazaba_Antequera.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "The Alcazaba (fortress) of Antequera, Andalusia, Spain"
  },
  {
    "id": "malaga-3",
    "subject": "malaga",
    "localFile": "/images/malaga-3.jpg",
    "width": 1200,
    "height": 1942,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Spain_Andalusia_Malaga_BW_2015-10-24_14-59-25.jpg",
    "license": "CC BY-SA 3.0",
    "artist": "Berthold Werner",
    "description": "Spain, Malaga, Alcazaba"
  },
  {
    "id": "valencia-1",
    "subject": "valencia",
    "localFile": "/images/valencia-1.jpg",
    "width": 1200,
    "height": 911,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lonja_de_la_Seda_(Valencia).jpg",
    "license": "CC BY-SA 3.0 es",
    "artist": "Tadeo Crespi",
    "description": "Detalle del escudo que señalaba el inicio de las obras. (Lema: La noble y leal ciudad de Valencia con voluntad de acabar mi excelencia me ha empezado en cinco de febrero del corriente año MCCCCLXXXIII\""
  },
  {
    "id": "valencia-2",
    "subject": "valencia",
    "localFile": "/images/valencia-2.jpg",
    "width": 1200,
    "height": 2007,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lonja_de_la_Seda,_Valencia,_Espa%C3%B1a,_2014-06-29,_DD_20.JPG",
    "license": "CC BY-SA 3.0",
    "artist": "Diego Delso",
    "description": "Columnar Hall, Silk Market, Valencia, Spain"
  },
  {
    "id": "map-north-africa-andalus-map-800-png",
    "subject": "maps",
    "localFile": "/images/map-north-africa-andalus-map-800-png.png",
    "width": 1400,
    "height": 988,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:North_Africa_%26_Andalus_map_800.png",
    "license": "CC BY-SA 4.0",
    "artist": "BroXadal",
    "description": "خريطة تظهر توزُّع الدُّول والممالك والإمارات في بلاد المغرب الأوسط والأقصى والأندلس والغال وما جاورهما في سنة 183 هـ / 800 م، وتظهر الخلافة العبَّاسيَّة والدولة الرُّستميَّة وسجلماسة والدولة الإدريسيَّة وبرغواطة ونكور وإمارة قرطبة الأمويَّة وأستورياس والإمبراطوريَّة الكارلونجيَّة أو الإفرنج وجزر ميو"
  },
  {
    "id": "map-al-andalus-siglos-xii-xiii-jpg",
    "subject": "maps",
    "localFile": "/images/map-al-andalus-siglos-xii-xiii-jpg.jpg",
    "width": 1400,
    "height": 703,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Al-Andalus,_siglos_XII-XIII.jpg",
    "license": "CC BY 4.0",
    "artist": "Santiago Quesada García; Guadalupe Romero Vergara.",
    "description": "Principales ciudades y caminos de durante los siglos XII-XIII."
  },
  {
    "id": "map-mapa-de-al-andalus-ibn-hawqal-c-950-jpg",
    "subject": "maps",
    "localFile": "/images/map-mapa-de-al-andalus-ibn-hawqal-c-950-jpg.jpg",
    "width": 1400,
    "height": 1184,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mapa_de_al-Andalus,_Ibn_Hawqal_(c._950).jpg",
    "license": "Public domain",
    "artist": "Ibn Hawqal",
    "description": "Al-Andalus nun fragmento do mapa do Magreb (poñente) realizado por Ibn Hawqal para o seu Kitāb sūrat al-ard ( كتاب صورة الارض ) (Libro da configuración da Terra). Trans. de J.H Kramers & G. Wiet. O texto de riba di: Este é un río xunto ao cal se atopan lugares, distritos e comarcas rurais que perten"
  },
  {
    "id": "almeria-1",
    "subject": "almeria",
    "localFile": "/images/almeria-1.jpg",
    "width": 1200,
    "height": 625,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alcazaba_1,_Almeria,_Spain.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "Alcazaba of Almeria, Spain."
  },
  {
    "id": "almeria-2",
    "subject": "almeria",
    "localFile": "/images/almeria-2.jpg",
    "width": 1200,
    "height": 1705,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alcazaba_tower,_Almeria,_Spain.jpg",
    "license": "CC0",
    "artist": "Jebulon",
    "description": "a tower of the alcazaba, Almeria, Spain"
  },
  {
    "id": "zaragoza-1",
    "subject": "zaragoza",
    "localFile": "/images/zaragoza-1.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Zaragoza_-_Aljaferia_4.JPG",
    "license": "CC0",
    "artist": "Zarateman",
    "description": "La Aljafería , Zaragoza ( Aragón , España )."
  },
  {
    "id": "zaragoza-2",
    "subject": "zaragoza",
    "localFile": "/images/zaragoza-2.jpg",
    "width": 1200,
    "height": 1600,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Zaragoza_-_Aljaferia_5.JPG",
    "license": "CC0",
    "artist": "Zarateman",
    "description": "La Aljafería de Zaragoza ( Aragón )."
  },
  {
    "id": "art-1",
    "subject": "art",
    "localFile": "/images/art-1.jpg",
    "width": 1200,
    "height": 1819,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pyxid_Al_Mughira_OA_4068.jpg",
    "license": "Public domain",
    "artist": "Workshop at the court of Medina Azahara",
    "description": "Pyxid bearing the name of Prince Al-Mugẖīra, son of Caliph 'Abd al-Rahman III. Spain, Medina Azahara (near Cordoba)."
  },
  {
    "id": "art-2",
    "subject": "art",
    "localFile": "/images/art-2.jpg",
    "width": 1200,
    "height": 900,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:BLW_Openwork_Container_(Pyxis).jpg",
    "license": "Public domain",
    "artist": "Adam Morgan",
    "description": "Openwork Container (Pyxis), about 964. Spain, probably Cordoba. Carved ivory with silver and niello mounts. The inscription around the lid begins with a prayer for Abd al-Rahman III's successor, the caliph al-Hakam II. A similar prayer appears on a casket made for al-Hakam's wife in 964. This contai"
  },
  {
    "id": "art-3",
    "subject": "art",
    "localFile": "/images/art-3.jpg",
    "width": 1200,
    "height": 1599,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pyxis_Khalaf_Met_L2011.46.7.jpg",
    "license": "CC BY 2.5",
    "artist": "Khalaf",
    "description": "Pyxis with an Arabic inscription, Spanish Umayyad art."
  }
];

const byId = new Map(images.map((img) => [img.id, img]));

export function getImage(id: string): HistoricalImage | undefined {
  return byId.get(id);
}

export function imagesBySubject(subject: string): HistoricalImage[] {
  return images.filter((img) => img.subject === subject);
}
