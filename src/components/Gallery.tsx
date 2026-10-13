import { useCallback, useEffect, useRef, useState } from "react";
import { getImage, type HistoricalImage } from "../data/images";
import { Icon } from "./Icon";

function Attribution({ img }: { img: HistoricalImage }) {
  return (
    <span className="img-credit">
      <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
        ويكيميديا كومنز
        <span className="sr-only"> (يفتح في نافذة جديدة)</span>
      </a>{" "}
      · {img.license}
      {img.artist && img.artist !== "غير معروف" ? <> · <bdi>{img.artist}</bdi></> : null}
    </span>
  );
}

/** Full-screen image viewer (dialog). Arrow keys follow reading direction in RTL. */
export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: HistoricalImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const img = images[index];
  const many = images.length > 1;
  const next = useCallback(() => onIndex((index + 1) % images.length), [index, images.length, onIndex]);
  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (many && e.key === "ArrowLeft") next();
      else if (many && e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [many, next, prev, onClose]);

  if (!img) return null;
  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={img.arabicCaption}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label="إغلاق العارض">
        <Icon name="close" size={22} />
      </button>
      <figure className="lightbox__figure">
        <img src={img.localFile} alt={img.arabicCaption} width={img.width} height={img.height} />
        <figcaption>
          <span>{img.arabicCaption}</span>
          <Attribution img={img} />
          {many && (
            <span className="lightbox__count">
              {index + 1} / {images.length}
            </span>
          )}
        </figcaption>
      </figure>
      {many && (
        <>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="الصورة السابقة">
            <Icon name="chevron-right" size={26} />
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="الصورة التالية">
            <Icon name="chevron-left" size={26} />
          </button>
        </>
      )}
    </div>
  );
}

/** Extra figure classes: maps are letterboxed, tall pictures are never cropped. */
function figureClass(img: HistoricalImage, extra = "") {
  const portrait = img.height > img.width * 1.05;
  return `info-figure${extra}${img.kind === "map" ? " info-figure--map" : ""}${portrait ? " info-figure--portrait" : ""}`;
}

/** One captioned image that opens in the viewer. */
export function ImageFigure({ imageId, compact = false }: { imageId: string; compact?: boolean }) {
  const img = getImage(imageId);
  const [open, setOpen] = useState(false);
  if (!img) return null;
  return (
    <figure className={figureClass(img, compact ? " info-figure--compact" : "")}>
      <button type="button" className="info-figure__zoom" onClick={() => setOpen(true)}>
        <img src={img.localFile} alt={img.arabicCaption} loading="lazy" decoding="async" width={img.width} height={img.height} />
        <span className="info-figure__zoom-hint" aria-hidden="true">
          <Icon name="expand" size={14} />
        </span>
        <span className="sr-only">عرض الصورة بالحجم الكامل</span>
      </button>
      <figcaption>
        {img.arabicCaption} — <Attribution img={img} />
      </figcaption>
      {open && <Lightbox images={[img]} index={0} onIndex={() => undefined} onClose={() => setOpen(false)} />}
    </figure>
  );
}

/** Lead image + thumbnail strip; any picture opens the full-screen viewer. */
export function Gallery({ imageIds, label }: { imageIds: string[]; label: string }) {
  const images = imageIds.map(getImage).filter((x): x is HistoricalImage => !!x);
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const key = imageIds.join("|");

  useEffect(() => setIndex(0), [key]);

  if (images.length === 0) return null;
  const current = images[Math.min(index, images.length - 1)];

  return (
    <section className="gallery" aria-label={label}>
      <figure className={figureClass(current)}>
        <button type="button" className="info-figure__zoom" onClick={() => setViewer(index)}>
          <img
            src={current.localFile}
            alt={current.arabicCaption}
            decoding="async"
            width={current.width}
            height={current.height}
          />
          <span className="info-figure__zoom-hint" aria-hidden="true">
            <Icon name="expand" size={14} />
          </span>
          <span className="sr-only">عرض الصورة بالحجم الكامل</span>
        </button>
        <figcaption>
          {current.arabicCaption} — <Attribution img={current} />
        </figcaption>
      </figure>

      {images.length > 1 && (
        <ul className="gallery__strip" aria-label={`صور أخرى: ${images.length}`}>
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                className="gallery__thumb"
                aria-pressed={i === index}
                aria-label={img.arabicCaption}
                onClick={() => setIndex(i)}
              >
                <img src={img.thumbFile} alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {viewer !== null && (
        <Lightbox images={images} index={viewer} onIndex={(i) => { setViewer(i); setIndex(i); }} onClose={() => setViewer(null)} />
      )}
    </section>
  );
}
