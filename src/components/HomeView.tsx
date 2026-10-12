import { periods } from "../data/history";
import { Icon } from "./Icon";

interface HomeViewProps {
  onExplore: () => void;
}

export function HomeView({ onExplore }: HomeViewProps) {
  return (
    <main className="hero">
      <div className="hero__ornament" aria-hidden="true">❦ ❖ ❦</div>
      <h1>الأندلس: رحلة عبر الزمن</h1>
      <p className="hero__sub">
        أطلس تاريخي تفاعلي يستكشف مدن الأندلس وحقبها وتراثها المعماري والعلمي،
        من الفتح الإسلامي عام 711 إلى سقوط غرناطة عام 1492.
      </p>
      <p className="hero__years">711 — 1492 ميلادية</p>

      <div className="hero__actions">
        <button type="button" className="btn btn--primary" onClick={onExplore}>
          <Icon name="map" /> استكشف الخريطة التفاعلية
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 28,
          maxWidth: 760,
        }}
      >
        {periods.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid var(--line)",
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              padding: "10px 14px",
              textAlign: "center",
              minWidth: 130,
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "0.9rem" }}>
              {p.name}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--brown-muted)" }}>
              {p.startYear} — {p.endYear}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
