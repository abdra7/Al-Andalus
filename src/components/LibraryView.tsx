import { libraryTopics } from "../data/history";
import { Icon } from "./Icon";

interface LibraryViewProps {
  onSelectCity: (cityId: string) => void;
}

export function LibraryView({ onSelectCity }: LibraryViewProps) {
  return (
    <main className="library">
      <div className="library__intro">
        <div className="hero__ornament" aria-hidden="true">❦</div>
        <h2>المكتبة التاريخية</h2>
        <p>
          موادّ مختارة عن الأندلس منظّمة حسب الموضوع: الدول والمدن والشخصيات والعمارة والعلوم،
          مع روابط للمصادر الموثوقة المستخدمة في هذا الأطلس.
        </p>
      </div>

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
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 2 }}>
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
                        المصدر <Icon name="external-link" size={10} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
