import { getImage } from "../data/images";
import { getCity, getPeriod, type City, type TimelineEvent } from "../data/history";
import { Icon } from "./Icon";

interface InfoPanelProps {
  city: City | null;
  event: TimelineEvent | null;
}

export function InfoPanel({ city, event }: InfoPanelProps) {
  if (!city && !event) {
    return (
      <aside className="info-panel" aria-label="تفاصيل المدينة والحدث">
        <p className="info-panel__empty">
          <Icon name="map-pin" size={20} />
          <br />
          اختر مدينة من القائمة أو حدثاً من الخط الزمني لعرض تفاصيله هنا.
        </p>
      </aside>
    );
  }

  if (city) {
    return <CityInfo city={city} />;
  }
  return <EventInfo event={event!} />;
}

function SourceList({ sources }: { sources: { title: string; url: string }[] }) {
  return (
    <ul className="info-sources">
      {sources.map((s, i) => (
        <li key={i}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.title} <Icon name="external-link" size={11} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function ImageFigure({ imageId }: { imageId: string }) {
  const img = getImage(imageId);
  if (!img) return null;
  return (
    <figure className="info-figure">
      <img
        src={img.localFile}
        alt={img.arabicCaption}
        loading="lazy"
        width={img.width}
        height={img.height}
      />
      <figcaption>
        {img.arabicCaption}
        {" — "}
        <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
          ويكيميديا كومنز
        </a>{" "}
        ({img.license})
        {img.artist && img.artist !== "غير معروف" ? ` — ${img.artist}` : ""}
      </figcaption>
    </figure>
  );
}

function CityInfo({ city }: { city: City }) {
  const periods = city.periods.map(getPeriod).filter(Boolean);
  const imageId = city.imageId;

  return (
    <aside className="info-panel" aria-label="تفاصيل المدينة والحدث">
      <h2 className="info-title">{city.name}</h2>
      <div className="info-latin">{city.latinName}</div>
      <div>
        {city.capital && <span className="info-badge">عاصمة</span>}
        {periods.map((p) => (
          <span className="info-badge" key={p!.id}>
            {p!.name}
          </span>
        ))}
      </div>

      {imageId && <ImageFigure imageId={imageId} />}

      <div className="info-section">
        <h3 className="info-section__title">
          <Icon name="map-pin" /> نبذة
        </h3>
        <p>{city.description}</p>
      </div>

      {city.founded && (
        <div className="info-section">
          <h3 className="info-section__title">
            <Icon name="calendar" /> التأسيس
          </h3>
          <p>{city.founded}</p>
        </div>
      )}

      {city.events.length > 0 && (
        <div className="info-section">
          <h3 className="info-section__title">
            <Icon name="layers" /> أحداث ومعالم
          </h3>
          <ul className="info-events">
            {city.events.map((e, i) => (
              <li className="info-events__item" key={i}>
                <span className="info-events__year">{e.yearLabel}:</span> {e.title}
                <div style={{ fontSize: "0.78rem", color: "var(--brown-muted)", marginTop: 2 }}>
                  {e.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="info-section">
        <h3 className="info-section__title">
          <Icon name="book" /> المصادر
        </h3>
        <SourceList sources={city.sources} />
      </div>
    </aside>
  );
}

function EventInfo({ event }: { event: TimelineEvent }) {
  const city = event.cityId ? getCity(event.cityId) : undefined;
  return (
    <aside className="info-panel" aria-label="تفاصيل المدينة والحدث">
      <h2 className="info-title">{event.title}</h2>
      <div className="info-latin">{event.yearLabel} ميلادية</div>
      <div>
        <span className="info-badge">{event.yearLabel}</span>
        {city && <span className="info-badge">{city.name}</span>}
      </div>

      <div className="info-section">
        <h3 className="info-section__title">
          <Icon name="clock" /> السياق التاريخي
        </h3>
        <p>{event.description}</p>
      </div>

      {city && (
        <div className="info-section">
          <h3 className="info-section__title">
            <Icon name="map-pin" /> المدينة المرتبطة
          </h3>
          <p>
            <strong>{city.name}</strong> — {city.significance}
          </p>
        </div>
      )}

      <div className="info-section">
        <h3 className="info-section__title">
          <Icon name="book" /> المصادر
        </h3>
        <SourceList sources={event.sources} />
      </div>
    </aside>
  );
}
