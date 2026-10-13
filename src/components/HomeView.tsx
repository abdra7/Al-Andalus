import { periods } from "../data/history";
import { Icon } from "./Icon";

interface HomeViewProps {
  onExplore: () => void;
  onOpenEras: () => void;
  onOpenLibrary: () => void;
}

export function HomeView({ onExplore, onOpenEras, onOpenLibrary }: HomeViewProps) {
  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__inner">
          <p className="hero__eyebrow">أطلس تاريخي تفاعلي</p>
          <h1 id="hero-title">الأندلس: رحلة عبر الزمن</h1>
          <p className="hero__sub">
            استكشف مدن الأندلس وحقبها وتراثها المعماري والعلمي على خريطة واحدة، من الفتح الإسلامي
            عام 711 إلى سقوط غرناطة عام 1492.
          </p>
          <p className="hero__years" aria-label="من 711 إلى 1492 ميلادية">
            <span>711</span>
            <span className="hero__years-line" aria-hidden="true" />
            <span>1492</span>
          </p>

          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={onExplore}>
              <Icon name="map" /> استكشف الخريطة التفاعلية
            </button>
            <button type="button" className="btn btn--outline" onClick={onOpenLibrary}>
              <Icon name="book" /> رفّ الكتب والمصادر
            </button>
          </div>
        </div>
      </section>

      <section className="home-eras" aria-labelledby="home-eras-title">
        <h2 id="home-eras-title" className="home-eras__title">
          {periods.length} حقب في {1492 - 711} عاماً
        </h2>
        <ol className="home-eras__list">
          {periods.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="era-chip"
                style={{ ["--era" as string]: p.color }}
                onClick={onOpenEras}
              >
                <span className="era-chip__name">{p.name}</span>
                <span className="era-chip__years">
                  {p.startYear} — {p.endYear}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
