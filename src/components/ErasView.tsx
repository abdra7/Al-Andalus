import { useEffect, useRef, useState } from "react";
import {
  figureLife,
  figuresInPeriod,
  getCity,
  periods,
  timelineEvents,
  type City,
  type Figure,
  type TimelineEvent,
} from "../data/history";
import { ImageFigure } from "./Gallery";
import { FurtherReading, LandmarkList, SourceList } from "./InfoPanel";
import { Icon } from "./Icon";

interface ErasViewProps {
  onSelectCity: (city: City) => void;
  onSelectEvent: (event: TimelineEvent) => void;
  onSelectFigure: (figure: Figure) => void;
  onOpenBook: (bookId: string) => void;
}

const displayEnd = (end: number) => (end === 1237 ? 1238 : end);

export function ErasView({ onSelectCity, onSelectEvent, onSelectFigure, onOpenBook }: ErasViewProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!openId) return;
    const el = refs.current[openId];
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [openId]);

  return (
    <div className="library">
      <div className="library__intro">
        <div className="hero__ornament" aria-hidden="true">❦</div>
        <h1>الحقب التاريخية للأندلس</h1>
        <p>
          {periods.length} حقب من الفتح الإسلامي سنة 711م حتى سقوط غرناطة سنة 1492م. افتح أي حقبة لترى حكّامها وعاصمتها
          ومعالمها وأعلامها وخريطتها، والجزء الذي يتناولها من رفّ الكتب.
        </p>
      </div>

      <ol className="eras">
        {periods.map((p, i) => {
          const open = openId === p.id;
          const events = timelineEvents.filter((e) => e.year >= p.startYear && e.year <= displayEnd(p.endYear));
          const people = figuresInPeriod(p.id);
          return (
            <li
              key={p.id}
              ref={(el) => {
                refs.current[p.id] = el;
              }}
              className={`era${open ? " era--open" : ""}`}
              style={{ ["--era" as string]: p.color }}
            >
              <h2 className="era__heading">
                <button
                  type="button"
                  className="era__toggle"
                  aria-expanded={open}
                  aria-controls={`era-body-${p.id}`}
                  onClick={() => setOpenId(open ? null : p.id)}
                >
                  <span className="era__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="era__titles">
                    <span className="era__name">{p.name}</span>
                    <span className="era__summary">{p.summary}</span>
                  </span>
                  <span className="era__years">
                    {p.startYear} — {displayEnd(p.endYear)}
                  </span>
                  <Icon name={open ? "chevron-up" : "chevron-down"} className="era__chev" />
                </button>
              </h2>

              {open && (
                <div className="era__body" id={`era-body-${p.id}`}>
                  <div className="era__main">
                    <p className="era__desc">{p.description}</p>

                    <dl className="era__facts">
                      <div>
                        <dt>العاصمة</dt>
                        <dd>{p.capital}</dd>
                      </div>
                      <div>
                        <dt>المدة</dt>
                        <dd>
                          {p.startYear}–{displayEnd(p.endYear)}م
                        </dd>
                      </div>
                    </dl>

                    <section className="era__block">
                      <h3>{p.rulersTitle ?? "أبرز الحكّام"}</h3>
                      <ul className="rulers">
                        {p.rulers.map((r) => (
                          <li key={r.name}>
                            <span className="rulers__name">{r.name}</span>
                            <span className="rulers__years">{r.years}</span>
                            {r.note && <span className="rulers__note">{r.note}</span>}
                          </li>
                        ))}
                      </ul>
                    </section>

                    {p.landmarks && p.landmarks.length > 0 && (
                      <section className="era__block">
                        <h3>معالم من هذه الحقبة</h3>
                        <LandmarkList landmarks={p.landmarks} />
                      </section>
                    )}

                    {events.length > 0 && (
                      <section className="era__block">
                        <h3>أحداث على الخط الزمني</h3>
                        <ul className="era__events">
                          {events.map((e) => (
                            <li key={e.id}>
                              <button type="button" className="library-card__link" onClick={() => onSelectEvent(e)}>
                                <span className="era__event-year">{e.yearLabel}</span> {e.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  <div className="era__side">
                    {p.mapImageId && <ImageFigure imageId={p.mapImageId} />}

                    {people.length > 0 && (
                      <section className="era__block">
                        <h3>أعلام الحقبة</h3>
                        <ul className="figure-chips">
                          {people.map((f) => (
                            <li key={f.id}>
                              <button type="button" className="figure-chip" onClick={() => onSelectFigure(f)}>
                                <span className="figure-chip__name">{f.name}</span>
                                <span className="figure-chip__role">
                                  {figureLife(f) ? `${figureLife(f)} · ` : ""}
                                  {f.role}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    <section className="era__block">
                      <h3>للاستزادة من رفّ الكتب</h3>
                      <FurtherReading refs={p.furtherReading} onOpenBook={onOpenBook} />
                    </section>

                    {(() => {
                      const city = p.landmarks?.find((l) => l.cityId)?.cityId;
                      const c = city ? getCity(city) : undefined;
                      return c ? (
                        <button type="button" className="btn btn--primary btn--block" onClick={() => onSelectCity(c)}>
                          <Icon name="map" /> استكشف {c.name} على الخريطة
                        </button>
                      ) : null;
                    })()}

                    <section className="era__block">
                      <h3>المصادر</h3>
                      <SourceList sources={p.sources} />
                    </section>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
