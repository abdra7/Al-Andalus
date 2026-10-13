import { libraryTopics, getPeriod, periods, figuresInPeriod, figureLife, type Figure } from "../data/history";
import { BOOK_LEVELS, booksByLevel, bookListSources } from "../data/books";
import { getImage } from "../data/images";
import { Icon } from "./Icon";

interface LibraryViewProps {
  onSelectCity: (cityId: string) => void;
  onSelectFigure: (figure: Figure) => void;
}

function FigureShelf({ onSelectFigure }: { onSelectFigure: (f: Figure) => void }) {
  return (
    <section className="people" aria-labelledby="people-title">
      <h2 id="people-title" className="library__section-title">
        أعلام الأندلس
      </h2>
      <p className="people__lead">
        قادة وحكّام وعلماء وشعراء، مرتّبون حسب الحقب. الصور لمعالم أو تماثيل أو لوحات مرتبطة بهم، لا صور حقيقية لهم.
      </p>
      {periods.map((p) => {
        const people = figuresInPeriod(p.id);
        if (people.length === 0) return null;
        return (
          <div className="people__group" key={p.id} style={{ ["--era" as string]: p.color }}>
            <h3 className="people__period">{p.name}</h3>
            <ul className="people__grid">
              {people.map((f) => {
                const img = f.imageId ? getImage(f.imageId) : undefined;
                return (
                  <li key={f.id}>
                    <button type="button" className="person" onClick={() => onSelectFigure(f)}>
                      <span className="person__media" aria-hidden="true">
                        {img ? (
                          <img src={img.thumbFile} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <span className="person__initial">{f.name.replace(/^((أبو|ابن|بن) |ال)+/, "").charAt(0)}</span>
                        )}
                      </span>
                      <span className="person__text">
                        <span className="person__name">{f.name}</span>
                        {figureLife(f) && <span className="person__life">{figureLife(f)}</span>}
                        <span className="person__role">{f.role}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

function BookShelf() {
  return (
    <section className="bookshelf" aria-labelledby="bookshelf-title">
      <header className="bookshelf__head">
        <h2 id="bookshelf-title" className="bookshelf__title">
          <Icon name="book" size={20} /> رفّ الكتب: مراجع عربية مختارة
        </h2>
        <p className="bookshelf__lead">
          خمسة كتب تُقرأ بالترتيب الذي يناسبك: موسوعة شاملة للباحث، وعرضان ميسّران للقارئ العام،
          ودراستان للتعمّق في حقبة بعينها أو للمراجعة الموجزة.
        </p>
      </header>

      {booksByLevel().map(({ level, books }) => (
        <div className="bookshelf__group" key={level}>
          <h3 className="bookshelf__level">
            <span className="bookshelf__level-num" aria-hidden="true">
              {BOOK_LEVELS[level].order}
            </span>
            {BOOK_LEVELS[level].title}
            <span className="bookshelf__audience">{BOOK_LEVELS[level].audience}</span>
          </h3>
          <ul className="bookshelf__list">
            {books.map((b) => (
              <li key={b.id} id={`book-${b.id}`} className={`book-card book-card--${b.level}`} tabIndex={-1}>
                <div className="book-card__spine" aria-hidden="true" />
                <div className="book-card__body">
                  <h4 className="book-card__title">{b.title}</h4>
                  {b.subtitle && <p className="book-card__subtitle">{b.subtitle}</p>}
                  <p className="book-card__author">{b.author}</p>
                  <p className="book-card__meta">
                    <span>
                      {b.coversFrom}–{b.coversTo}م
                    </span>
                    {b.extent && <span>{b.extent}</span>}
                  </p>
                  <p className="book-card__desc">{b.description}</p>
                  {b.periodIds.length < 7 && (
                    <p className="book-card__periods">
                      {b.periodIds.map((id) => (
                        <span className="info-badge" key={id}>
                          {getPeriod(id)?.name ?? id}
                        </span>
                      ))}
                    </p>
                  )}
                  {b.sources.map((s) => (
                    <a
                      key={s.url}
                      className="library-card__link"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.title} <Icon name="external-link" size={12} />
                      <span className="sr-only">(يفتح في نافذة جديدة)</span>
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="bookshelf__credit">
        مستند إلى قوائم ترشيح:{" "}
        {bookListSources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && "، "}
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title}
            </a>
          </span>
        ))}
        . الروابط تقود إلى بطاقات الكتب في الفهارس، لا إلى نسخ غير مرخّصة.
      </p>
    </section>
  );
}

export function LibraryView({ onSelectCity, onSelectFigure }: LibraryViewProps) {
  return (
    <div className="library">
      <div className="library__intro">
        <div className="hero__ornament" aria-hidden="true">❦</div>
        <h1>المكتبة التاريخية</h1>
        <p>
          موادّ مختارة عن الأندلس منظّمة حسب الموضوع: الدول والمدن والشخصيات والعمارة والعلوم،
          مع كتب عربية مرجعية وروابط للمصادر الموثوقة المستخدمة في هذا الأطلس.
        </p>
      </div>

      <BookShelf />

      <FigureShelf onSelectFigure={onSelectFigure} />

      <h2 className="library__section-title">موضوعات الأطلس</h2>
      <div className="library-grid">
        {libraryTopics.map((topic) => (
          <section className="library-card" key={topic.id} aria-labelledby={`lib-${topic.id}`}>
            <h3 className="library-card__title" id={`lib-${topic.id}`}>
              <Icon name={topic.icon} /> {topic.title}
            </h3>
            <ul>
              {topic.items.map((item, i) => (
                <li key={i}>
                  <span className="library-card__item-title">{item.title}</span>
                  <div className="library-card__item-desc">{item.description}</div>
                  <div className="library-card__actions">
                    {item.cityId && (
                      <button
                        type="button"
                        className="library-card__link"
                        onClick={() => onSelectCity(item.cityId!)}
                      >
                        عرض على الخريطة ←
                      </button>
                    )}
                    {item.sources[0] && (
                      <a
                        className="library-card__link"
                        href={item.sources[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        المصدر <Icon name="external-link" size={12} />
                        <span className="sr-only">(يفتح في نافذة جديدة)</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
