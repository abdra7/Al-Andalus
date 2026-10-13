import {
  figureLife,
  figuresInCity,
  getCity,
  getPeriod,
  periodAtYear,
  type BookRef,
  type City,
  type Figure,
  type Landmark,
  type Source,
  type TimelineEvent,
} from "../data/history";
import { books } from "../data/books";
import { Gallery, ImageFigure } from "./Gallery";
import { Icon } from "./Icon";

interface InfoPanelProps {
  city: City | null;
  event: TimelineEvent | null;
  figure: Figure | null;
  onSelectCity: (city: City) => void;
  onSelectFigure: (figure: Figure) => void;
  onOpenBook: (bookId: string) => void;
}

/** Enan's eighth volume surveys the monuments that survive in Spain and Portugal. */
const CITY_READING: BookRef[] = [
  { bookId: "enan-dawlat-al-islam", part: "الجزء الثامن: الآثار الأندلسية الباقية في إسبانيا والبرتغال" },
];

export function InfoPanel({ city, event, figure, onSelectCity, onSelectFigure, onOpenBook }: InfoPanelProps) {
  if (figure) {
    return (
      <aside className="info-panel" aria-label="تفاصيل الشخصية">
        <FigureInfo figure={figure} onSelectCity={onSelectCity} onOpenBook={onOpenBook} />
      </aside>
    );
  }
  if (city) {
    return (
      <aside className="info-panel" aria-label="تفاصيل المدينة">
        <CityInfo city={city} onSelectFigure={onSelectFigure} onOpenBook={onOpenBook} />
      </aside>
    );
  }
  if (event) {
    return (
      <aside className="info-panel" aria-label="تفاصيل الحدث">
        <EventInfo event={event} onSelectCity={onSelectCity} />
      </aside>
    );
  }
  return (
    <aside className="info-panel" aria-label="التفاصيل">
      <div className="info-panel__empty">
        <Icon name="map-pin" size={28} />
        <p>اختر مدينة من القائمة أو من الخريطة، أو حدثاً من الخط الزمني، لعرض تفاصيله هنا.</p>
      </div>
    </aside>
  );
}

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ul className="info-sources">
      {sources.map((s) => (
        <li key={s.url}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.title} <Icon name="external-link" size={12} />
            <span className="sr-only">(يفتح في نافذة جديدة)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function FurtherReading({ refs, onOpenBook }: { refs: BookRef[]; onOpenBook: (id: string) => void }) {
  const items = refs
    .map((r) => ({ ref: r, book: books.find((b) => b.id === r.bookId) }))
    .filter((x) => x.book);
  if (items.length === 0) return null;
  return (
    <ul className="reading-list">
      {items.map(({ ref, book }) => (
        <li key={`${ref.bookId}-${ref.part ?? ""}`}>
          <button type="button" className="reading-list__book" onClick={() => onOpenBook(book!.id)}>
            <Icon name="book" size={16} />
            <span>
              <span className="reading-list__title">{book!.title}</span>
              <span className="reading-list__author">{book!.author}</span>
              {ref.part && <span className="reading-list__part">{ref.part}</span>}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function LandmarkList({ landmarks }: { landmarks: Landmark[] }) {
  return (
    <ul className="landmarks">
      {landmarks.map((l) => (
        <li key={l.name} className="landmarks__item">
          <span className="landmarks__name">
            {l.name}
            {l.date && <span className="landmarks__date">{l.date}</span>}
          </span>
          <span className="landmarks__note">{l.note}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="info-section">
      <h3 className="info-section__title">
        <Icon name={icon} /> {title}
      </h3>
      {children}
    </section>
  );
}

function CityInfo({
  city,
  onSelectFigure,
  onOpenBook,
}: {
  city: City;
  onSelectFigure: (f: Figure) => void;
  onOpenBook: (id: string) => void;
}) {
  const periods = city.periods.map(getPeriod).filter(Boolean);
  const people = figuresInCity(city.id);
  const gallery = [city.imageId, ...(city.gallery ?? [])].filter((x): x is string => !!x);

  return (
    <>
      <h2 className="info-title">{city.name}</h2>
      <div className="info-latin" dir="ltr" lang="es">
        {city.latinName}
      </div>
      <p className="info-lead">{city.significance}</p>
      <div className="info-badges">
        {city.capital && <span className="info-badge info-badge--strong">عاصمة</span>}
        {periods.map((p) => (
          <span className="info-badge" key={p!.id}>
            {p!.name}
          </span>
        ))}
      </div>

      <Gallery key={city.id} imageIds={gallery} label={`صور ${city.name}`} />

      <Section icon="map-pin" title="نبذة">
        <p className="info-prose">{city.description}</p>
      </Section>

      {city.landmarks && city.landmarks.length > 0 && (
        <Section icon="landmark" title="أبرز المعالم">
          <LandmarkList landmarks={city.landmarks} />
        </Section>
      )}

      {city.events.length > 0 && (
        <Section icon="layers" title="أحداث">
          <ul className="info-events">
            {city.events.map((e) => (
              <li className="info-events__item" key={`${e.year}-${e.title}`}>
                <span className="info-events__year">{e.yearLabel}:</span> {e.title}
                <div className="info-events__desc">{e.description}</div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {people.length > 0 && (
        <Section icon="user" title={`أعلام من ${city.name}`}>
          <ul className="figure-chips">
            {people.map((f) => (
              <li key={f.id}>
                <button type="button" className="figure-chip" onClick={() => onSelectFigure(f)}>
                  <span className="figure-chip__name">{f.name}</span>
                  <span className="figure-chip__role">{f.role}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section icon="book" title="للاستزادة من رفّ الكتب">
        <FurtherReading refs={CITY_READING} onOpenBook={onOpenBook} />
      </Section>

      <Section icon="external-link" title="المصادر">
        <SourceList sources={city.sources} />
      </Section>
    </>
  );
}

function FigureInfo({
  figure,
  onSelectCity,
  onOpenBook,
}: {
  figure: Figure;
  onSelectCity: (c: City) => void;
  onOpenBook: (id: string) => void;
}) {
  const period = getPeriod(figure.periodId);
  const city = figure.cityId ? getCity(figure.cityId) : undefined;
  const life = figureLife(figure);
  return (
    <>
      <h2 className="info-title">{figure.name}</h2>
      <div className="info-latin" dir="ltr" lang="en">
        {figure.latinName}
      </div>
      <p className="info-lead">{figure.role}</p>
      <div className="info-badges">
        {life && <span className="info-badge info-badge--strong">{life}</span>}
        {period && <span className="info-badge">{period.name}</span>}
        {city && <span className="info-badge">{city.name}</span>}
        {!city && figure.place && <span className="info-badge">{figure.place}</span>}
      </div>

      {figure.imageId && <ImageFigure imageId={figure.imageId} />}

      <Section icon="user" title="سيرة">
        <p className="info-prose">{figure.description}</p>
      </Section>

      {figure.works && figure.works.length > 0 && (
        <Section icon="book" title="من آثاره">
          <ul className="works-list">
            {figure.works.map((w) => (
              <li key={w}>«{w}»</li>
            ))}
          </ul>
        </Section>
      )}

      {city && (
        <button type="button" className="btn btn--outline btn--block" onClick={() => onSelectCity(city)}>
          <Icon name="map-pin" /> عرض {city.name} على الخريطة
        </button>
      )}

      {period && (
        <Section icon="clock" title="للاستزادة من رفّ الكتب">
          <FurtherReading refs={period.furtherReading} onOpenBook={onOpenBook} />
        </Section>
      )}

      <Section icon="external-link" title="المصادر">
        <SourceList sources={figure.sources} />
      </Section>
    </>
  );
}

function EventInfo({ event, onSelectCity }: { event: TimelineEvent; onSelectCity: (c: City) => void }) {
  const city = event.cityId ? getCity(event.cityId) : undefined;
  const period = periodAtYear(event.year);
  return (
    <>
      <h2 className="info-title">{event.title}</h2>
      <div className="info-latin">{event.yearLabel} ميلادية</div>
      <div className="info-badges">
        {period && <span className="info-badge info-badge--strong">{period.name}</span>}
        {city && <span className="info-badge">{city.name}</span>}
      </div>

      {event.imageId && <ImageFigure imageId={event.imageId} />}

      <Section icon="clock" title="السياق التاريخي">
        <p className="info-prose">{event.description}</p>
      </Section>

      {city && (
        <Section icon="map-pin" title="المدينة المرتبطة">
          <p>
            <strong>{city.name}</strong> — {city.significance}
          </p>
          <button type="button" className="btn btn--outline btn--block" onClick={() => onSelectCity(city)}>
            <Icon name="map-pin" /> تفاصيل {city.name}
          </button>
        </Section>
      )}

      <Section icon="external-link" title="المصادر">
        <SourceList sources={event.sources} />
      </Section>
    </>
  );
}
