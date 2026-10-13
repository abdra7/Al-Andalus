"""Rebuild the image dataset: WebP conversion, thumbnails, Arabic captions.

Inputs
  * src/data/images.json           existing records (+ their files in public/images)
  * INCOMING/manifest.json         new Commons downloads from scripts/fetch-more-images.mjs
Outputs
  * public/images/<id>.webp        long side ≤ 1400 px
  * public/images/thumbs/<id>.webp long side ≤ 360 px (gallery strips)
  * src/data/images.json + src/data/images.ts

Usage: python3 scripts/images/build_images.py [INCOMING_DIR]
Every caption below was written after looking at the picture and reading its Commons
description; edit CAPTIONS rather than the generated files.
"""
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / "public" / "images"
THUMBS = PUB / "thumbs"
INCOMING = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data" / "incoming-images"
MAX_SIDE, THUMB_SIDE = 1200, 360

# Existing records that were misattributed and are removed from the atlas.
DROP = {
    "malaga-2": "shows the Alcazaba of Antequera, not Málaga",
    "toledo-3": "Puente de Toledo is in Madrid, not Toledo",
    "generalife-2": "a garden plant, not a monument",
}

# New downloads to keep: manifest id -> (new id, subject, kind)
KEEP_NEW = {
    "cordoba-mihrab-2": ("cordoba-mihrab", "cordoba-mosque", "photo"),
    "cordoba-calahorra-1": ("cordoba-calahorra", "cordoba", "photo"),
    "granada-comares-1": ("granada-comares", "alhambra", "photo"),
    "granada-banuelo-1": ("granada-banuelo", "granada", "photo"),
    "granada-madraza-1": ("granada-madraza", "granada", "photo"),
    "seville-torre-oro-1": ("seville-torre-del-oro", "seville", "photo"),
    "seville-naranjos-1": ("seville-naranjos", "seville", "photo"),
    "toledo-cristo-luz-2": ("toledo-bab-mardum", "toledo", "photo"),
    "toledo-cristo-luz-1": ("toledo-bab-mardum-interior", "toledo", "photo"),
    "zahra-salon-rico-2": ("zahra-salon-rico", "zahra", "photo"),
    "malaga-alcazaba-1": ("malaga-alcazaba-patio", "malaga", "photo"),
    "malaga-gibralfaro-1": ("malaga-gibralfaro", "malaga", "photo"),
    "valencia-muralla-1": ("valencia-islamic-wall", "valencia", "photo"),
    "valencia-banos-1": ("valencia-almirall-baths", "valencia", "photo"),
    "almeria-jayran-1": ("almeria-jayran-wall", "almeria", "photo"),
    "zaragoza-oratorio-1": ("zaragoza-aljaferia-mihrab", "zaragoza", "photo"),
    "map-conquest-1": ("map-732", "maps", "map"),
    "map-taifas-1": ("map-taifas-1031", "maps", "map"),
    "map-almoravids-1": ("map-almoravids-1120", "maps", "map"),
    "map-almohads-1": ("map-almohads", "maps", "map"),
    "map-nasrid-1": ("map-nasrid", "maps", "map"),
    "event-guadalete-1": ("painting-guadalete", "paintings", "painting"),
    "event-navas-1": ("painting-navas", "paintings", "painting"),
    "event-rendicion-1": ("painting-rendicion", "paintings", "painting"),
    "event-suspiro-1": ("painting-suspiro", "paintings", "painting"),
    "fig-gibraltar-1": ("gibraltar-rock", "figures", "photo"),
    "fig-almanzor-1": ("statue-almanzor", "figures", "monument"),
    "fig-averroes-2": ("statue-averroes", "figures", "monument"),
    "fig-maimonides-1": ("statue-maimonides", "figures", "monument"),
    "fig-ibn-hazm-1": ("statue-ibn-hazm", "figures", "monument"),
    "fig-ibn-firnas-1": ("bridge-ibn-firnas", "figures", "photo"),
    "fig-ibn-zaydun-2": ("monument-ibn-zaydun-wallada", "figures", "monument"),
    "fig-al-mutamid-1": ("silves-al-mutamid", "figures", "monument"),
    "fig-ibn-baytar-1": ("statue-ibn-baytar", "figures", "monument"),
}

KIND_EXISTING = {"maps": "map", "art": "object"}

CAPTIONS = {
    # ---- existing (re-captioned after review: several were shifted or wrong) ----
    "alhambra-1": "قوس الجرس أعلى برج الحراسة (برج الفيلا) في قصبة الحمراء، والجرس إضافة مسيحية لاحقة",
    "alhambra-2": "باب الخمر في الحمراء بقوسه الحدوي وزخارفه الجصية",
    "alhambra-3": "الحمراء على تل السبيكة كما تُرى من مطلّ سان نيكولاس في البيازين",
    "alhambra-4": "نافورة الأسود في قصر الأسود بالحمراء، وعلى حافة حوضها قصيدة لابن زمرك",
    "generalife-1": "ساحة الساقية في جنة العريف، المصيف النصري المجاور للحمراء",
    "granada-1": "الحمراء عند الغروب وخلفها جبال سييرا نيفادا (جزء من صورة بانورامية)",
    "granada-2": "قصور الحمراء عند الغروب وخلفها قمم سييرا نيفادا المكسوّة بالثلج",
    "granada-3": "الحمراء عند الغروب (جزء من صورة بانورامية)",
    "cordoba-mosque-1": "الأقواس المزدوجة بصنجها الحمراء والبيضاء في بيت الصلاة بجامع قرطبة",
    "cordoba-mosque-2": "بيت الصلاة في جامع قرطبة — صورة تاريخية ملوّنة بتقنية الفوتوكروم",
    "cordoba-mosque-3": "بيت الصلاة في جامع قرطبة — صورة تاريخية مطبوعة بالألبومين من القرن التاسع عشر",
    "cordoba-mosque-4": "قوس مزخرف بالفسيفساء في جامع قرطبة",
    "cordoba-1": "برج الأجراس في جامع قرطبة، ويضم في داخله بقايا مئذنة عبد الرحمن الناصر (951–952م)",
    "cordoba-2": "إحدى القباب المضلّعة في زيادة الحكم المستنصر بجامع قرطبة",
    "cordoba-3": "أروقة بيت الصلاة الممتدة في جامع قرطبة",
    "zahra-1": "أطلال مدينة الزهراء غربي قرطبة",
    "zahra-2": "بقايا جدران وأبنية في مدينة الزهراء",
    "zahra-3": "أطلال المباني في مدينة الزهراء",
    "seville-1": "ساحة عذراء الملوك في إشبيلية مساءً، وتظهر الكاتدرائية والخيرالدا",
    "seville-2": "الخيرالدا عند الغسق: مئذنة الجامع الموحدي (1184–1198م) يعلوها برج أجراس أُضيف بين 1558 و1568م",
    "seville-3": "الخيرالدا، مئذنة جامع إشبيلية الموحدي",
    "seville-4": "الخيرالدا وبرج من أسوار القصر (ألكاثار) في إشبيلية",
    "toledo-1": "طليطلة فوق منعطف نهر تاجُه",
    "toledo-2": "طليطلة القديمة، وفي أعلاها قصر الألكاثار",
    "malaga-1": "مالقة من جهة الميناء، وتعلوها القصبة",
    "malaga-3": "نافورة جدارية في قصبة مالقة",
    "valencia-1": "شعار بلنسية على مبنى سوق الحرير، من العمارة القوطية بعد الفتح المسيحي",
    "valencia-2": "قاعة الأعمدة في سوق الحرير ببلنسية (القرن الخامس عشر)، من العمارة القوطية بعد الفتح المسيحي",
    "map-north-africa-andalus-map-800-png": "بلاد المغرب والأندلس وما جاورهما نحو سنة 800م، وتظهر إمارة قرطبة",
    "map-al-andalus-siglos-xii-xiii-jpg": "أهم مدن الأندلس وطرقها في القرنين الثاني عشر والثالث عشر (بتسميات إسبانية)",
    "map-mapa-de-al-andalus-ibn-hawqal-c-950-jpg": "الأندلس في خريطة ابن حوقل للمغرب (نحو 950م) من كتاب «صورة الأرض»",
    "almeria-1": "قصبة المرية التي بدأ بناءها عبد الرحمن الناصر سنة 955م",
    "almeria-2": "برج من أبراج قصبة المرية",
    "zaragoza-1": "قصر الجعفرية في سرقسطة، وإلى اليسار برج التروبادور أقدم أجزائه",
    "zaragoza-2": "برج التروبادور في قصر الجعفرية بسرقسطة",
    "art-1": "علبة المغيرة العاجية، صُنعت في مدينة الزهراء للأمير المغيرة ابن عبد الرحمن الناصر",
    "art-2": "علبة عاجية مخرّمة من نحو 964م، من قرطبة على الأرجح — متحف المتروبوليتان",
    "art-3": "علبة عاجية بنقش عربي من الفن الأموي الأندلسي، تحمل اسم صانعها خلف",
    # ---- new ----
    "cordoba-mihrab": "واجهة محراب جامع قرطبة، أُنجز في خلافة الحكم المستنصر (961–976م) وزُيّن بالفسيفساء",
    "cordoba-calahorra": "برج القلهرة عند الطرف الجنوبي للقنطرة الرومانية في قرطبة، ويُنسب بناؤه الأول إلى العصر الموحدي",
    "granada-comares": "بهو الريحان وبرج قمارش في الحمراء، من أعمال يوسف الأول ومحمد الخامس",
    "granada-banuelo": "حمّام البانيويلو في غرناطة، بفتحات سقفه النجمية، ويرجَّح أنه من العصر الزيري (القرن 11م)",
    "granada-madraza": "محراب مصلّى المدرسة اليوسفية في غرناطة، التي أسسها يوسف الأول سنة 1349م",
    "seville-torre-del-oro": "برج الذهب على الوادي الكبير في إشبيلية، بناه الوالي الموحدي أبو العلا سنة 1220–1221م",
    "seville-naranjos": "صحن البرتقال في كاتدرائية إشبيلية، وهو صحن الجامع الموحدي، وخلفه باب الغفران",
    "toledo-bab-mardum": "مسجد باب المردوم (كريستو دي لا لوث) في طليطلة، بُني سنة 999م",
    "toledo-bab-mardum-interior": "داخل مسجد باب المردوم في طليطلة: أعمدة وأقواس تقسمه إلى تسعة أقسام",
    "zahra-salon-rico": "أقواس المجلس الشرقي (الصالون الغني) في مدينة الزهراء، المؤرخ بين 953 و957م",
    "malaga-alcazaba-patio": "فناء داخلي في قصبة مالقة",
    "malaga-gibralfaro": "مالقة من تل جبل الفارو، وتظهر أسوار القلعة التي بناها يوسف الأول",
    "valencia-islamic-wall": "بقايا السور الإسلامي لمدينة بلنسية بين بيوت الحي القديم",
    "valencia-almirall-baths": "حمّامات الأمير في بلنسية، بُنيت على الطراز المدجّن بين 1313 و1320م بعد الفتح المسيحي",
    "almeria-jayran-wall": "سور خيران في المرية، المنسوب إلى خيران العامري أول ملوك طائفتها",
    "zaragoza-aljaferia-mihrab": "محراب المصلّى الصغير في قصر الجعفرية بسرقسطة",
    "map-732": "امتداد الأندلس سنة 732م (بتسميات إنجليزية)",
    "map-taifas-1031": "شبه الجزيرة الأيبيرية سنة 1031م: الطوائف والممالك المسيحية (بتسميات إسبانية)",
    "map-almoravids-1120": "دولة المرابطين في المغرب والأندلس سنة 1120م (بتسميات إنجليزية)",
    "map-almohads": "مراحل توسّع دولة الموحدين في المغرب والأندلس (بتسميات إنجليزية)",
    "map-nasrid": "مملكة غرناطة 1250–1492م: الأحمر امتدادها في القرن 13م، والفاتح ما بقي منها سنة 1484م (بتسميات مجرية)",
    "painting-guadalete": "«الملك رودريك يخطب في جنوده في معركة وادي لكة»، لوحة برناردو بلانكو (1871م) بخيال القرن التاسع عشر",
    "painting-navas": "«معركة العقاب (لاس نافاس دي تولوسا)»، لوحة فرانسيسكو دي باولا فان هالن من القرن التاسع عشر",
    "painting-rendicion": "«تسليم غرناطة»، لوحة فرانسيسكو براديا (1882م): أبو عبد الله الصغير يسلّم المدينة للملكين الكاثوليكيين",
    "painting-suspiro": "«زفرة العربي الأخيرة»، لوحة فرانسيسكو براديا، رسمها بين 1879 و1892م",
    "gibraltar-rock": "صخرة جبل طارق من لا لينيا؛ حمل الجبل اسم طارق بن زياد منذ عبوره سنة 711م",
    "statue-almanzor": "تمثال حديث للمنصور بن أبي عامر في الجزيرة الخضراء",
    "statue-averroes": "تمثال حديث لابن رشد قرب سور قرطبة",
    "statue-maimonides": "تمثال حديث لموسى بن ميمون في قرطبة",
    "statue-ibn-hazm": "تمثال ابن حزم (1963م) عند باب إشبيلية في قرطبة، بجوار بقايا قناة مياه من القرن العاشر",
    "bridge-ibn-firnas": "جسر عباس بن فرناس على الوادي الكبير في قرطبة، سُمّي باسمه سنة 2011م",
    "monument-ibn-zaydun-wallada": "«نصب العاشقَين» في قرطبة، المهدى إلى ابن زيدون وولادة بنت المستكفي",
    "silves-al-mutamid": "ساحة المعتمد بن عباد في مدينة شلب (سيلفش) بالبرتغال، بمنحوتات حديثة",
    "statue-ibn-baytar": "تمثال حديث لابن البيطار في بنالمادينا قرب مالقة",
}


def save_webp(src: Path, dst: Path, side: int, quality: int, lossless_ok: bool = False):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    if im.mode in ("P", "LA", "RGBA"):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
        im = bg
    else:
        im = im.convert("RGB")
    im.thumbnail((side, side), Image.Resampling.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "WEBP", quality=quality, method=6)
    return im.size


def main():
    old = json.loads((ROOT / "src/data/images.json").read_text())["images"]
    out = []
    for rec in old:
        if rec["id"] in DROP:
            continue
        src = PUB / Path(rec["localFile"]).name
        if not src.exists():  # already converted on a previous run
            src = PUB / f"{rec['id']}.webp"
        w, h = save_webp(src, PUB / f"{rec['id']}.webp.tmp", MAX_SIDE, 70)
        os.replace(PUB / f"{rec['id']}.webp.tmp", PUB / f"{rec['id']}.webp")
        save_webp(PUB / f"{rec['id']}.webp", THUMBS / f"{rec['id']}.webp", THUMB_SIDE, 62)
        out.append({
            **{k: rec[k] for k in ("id", "subject", "sourceUrl", "license", "artist", "description")},
            "kind": KIND_EXISTING.get(rec["subject"], "photo"),
            "localFile": f"./images/{rec['id']}.webp",
            "thumbFile": f"./images/thumbs/{rec['id']}.webp",
            "width": w,
            "height": h,
            "arabicCaption": CAPTIONS[rec["id"]],
        })

    manifest = json.loads((INCOMING / "manifest.json").read_text())["images"]
    by_id = {m["id"]: m for m in manifest}
    for mid, (nid, subject, kind) in KEEP_NEW.items():
        m = by_id[mid]
        w, h = save_webp(INCOMING / m["file"], PUB / f"{nid}.webp", MAX_SIDE, 70 if kind != "map" else 86)
        save_webp(PUB / f"{nid}.webp", THUMBS / f"{nid}.webp", THUMB_SIDE, 62)
        out.append({
            "id": nid,
            "subject": subject,
            "sourceUrl": m["sourceUrl"],
            "license": m["license"],
            "artist": m["artist"] or "غير معروف",
            "description": m["description"] or m["objectName"],
            "kind": kind,
            "localFile": f"./images/{nid}.webp",
            "thumbFile": f"./images/thumbs/{nid}.webp",
            "width": w,
            "height": h,
            "arabicCaption": CAPTIONS[nid],
        })

    # remove superseded originals (jpg/png) and dropped records
    keep = {f"{r['id']}.webp" for r in out}
    for f in PUB.iterdir():
        if f.is_file() and f.name not in keep:
            f.unlink()
    for f in THUMBS.iterdir():
        if f.name not in keep:
            f.unlink()

    (ROOT / "src/data/images.json").write_text(json.dumps({"images": out}, ensure_ascii=False, indent=2) + "\n")
    ts = [
        "// Image metadata for the Al-Andalus atlas — GENERATED by scripts/images/build_images.py.",
        "// All images come from Wikimedia Commons with licences that allow redistribution.",
        "// arabicCaption is the Arabic alt text / figcaption; every caption was checked against the picture.",
        "// Paths are relative so they resolve under the /al-andalus/ deployment subpath.",
        "",
        "export type ImageKind = \"photo\" | \"map\" | \"painting\" | \"monument\" | \"object\";",
        "",
        "export interface HistoricalImage {",
        "  id: string;",
        "  subject: string;",
        "  kind: ImageKind;",
        "  localFile: string;",
        "  thumbFile: string;",
        "  width: number;",
        "  height: number;",
        "  sourceUrl: string;",
        "  license: string;",
        "  artist: string;",
        "  description: string;",
        "  arabicCaption: string;",
        "}",
        "",
        "export const images: HistoricalImage[] = " + json.dumps(out, ensure_ascii=False, indent=2) + ";",
        "",
        "const byId = new Map(images.map((img) => [img.id, img]));",
        "",
        "export function getImage(id: string): HistoricalImage | undefined {",
        "  return byId.get(id);",
        "}",
        "",
        "export function imagesBySubject(subject: string): HistoricalImage[] {",
        "  return images.filter((img) => img.subject === subject);",
        "}",
        "",
    ]
    (ROOT / "src/data/images.ts").write_text("\n".join(ts))
    total = sum((PUB / f"{r['id']}.webp").stat().st_size for r in out)
    thumbs = sum((THUMBS / f"{r['id']}.webp").stat().st_size for r in out)
    print(f"{len(out)} images, {total/1e6:.1f} MB full + {thumbs/1e6:.2f} MB thumbs")


if __name__ == "__main__":
    main()
