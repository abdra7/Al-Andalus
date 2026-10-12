import { useCallback, useEffect, useMemo, useState } from "react";
import { CityPanel } from "./components/CityPanel";
import { InfoPanel } from "./components/InfoPanel";
import { MapView } from "./components/MapView";
import { Timeline, CATEGORIES } from "./components/Timeline";
import { SearchModal } from "./components/SearchModal";
import { LibraryView } from "./components/LibraryView";
import { HomeView } from "./components/HomeView";
import { Icon } from "./components/Icon";
import {
  cities,
  getCity,
  getTimelineEvent,
  timelineEvents,
  periods as PERIODS,
  type City,
  type TimelineEvent,
  type SearchEntry,
} from "./data/history";

type View = "home" | "explore" | "eras" | "library" | "search";
type Category = TimelineEvent["category"];

const NAV_ITEMS: { id: View; label: string; icon: string }[] = [
  { id: "home", label: "الصفحة الرئيسية", icon: "home" },
  { id: "explore", label: "الخريطة التفاعلية", icon: "map" },
  { id: "eras", label: "الحقب التاريخية", icon: "clock" },
  { id: "library", label: "المكتبة", icon: "library" },
  { id: "search", label: "البحث", icon: "search" },
];

function viewFromHash(hash: string): View {
  const h = hash.replace(/^#\/?/, "");
  if (NAV_ITEMS.some((n) => n.id === h)) return h as View;
  return "home";
}

export default function App() {
  const [view, setView] = useState<View>(() => viewFromHash(window.location.hash));
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<Category[]>([...CATEGORIES]);
  const [mobilePanel, setMobilePanel] = useState<"cities" | "info" | null>(null);

  // hash routing
  useEffect(() => {
    const onHash = () => {
      const v = viewFromHash(window.location.hash);
      setView(v);
      setNavOpen(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((v: View) => {
    window.location.hash = `#/${v}`;
    setView(v);
    setNavOpen(false);
  }, []);

  const selectCity = useCallback((city: City) => {
    setSelectedCityId(city.id);
    setSelectedEventId(null);
    if (window.innerWidth <= 1024) setMobilePanel("info");
  }, []);

  const selectEvent = useCallback((event: TimelineEvent) => {
    setSelectedEventId(event.id);
    setSelectedCityId(null);
    if (window.innerWidth <= 1024) setMobilePanel("info");
  }, []);

  const toggleCategory = useCallback((cat: Category) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }, []);

  const selectedYear = useMemo(() => {
    const ev = selectedEventId ? getTimelineEvent(selectedEventId) : null;
    return ev?.year ?? null;
  }, [selectedEventId]);

  const selectedCity = selectedCityId ? getCity(selectedCityId) ?? null : null;
  const selectedEvent = selectedEventId ? getTimelineEvent(selectedEventId) ?? null : null;

  const handleSearchSelect = useCallback(
    (entry: SearchEntry) => {
      setSearchOpen(false);
      if (entry.kind === "city" && entry.cityId) {
        setSelectedCityId(entry.cityId);
        setSelectedEventId(null);
        navigate("explore");
      } else if (entry.kind === "event") {
        const ev = getTimelineEvent(entry.id.replace(/^event-/, ""));
        if (ev) {
          selectEvent(ev);
          navigate("explore");
        }
      } else if (entry.kind === "figure" && entry.cityId) {
        setSelectedCityId(entry.cityId);
        setSelectedEventId(null);
        navigate("explore");
      } else {
        navigate("eras");
      }
    },
    [navigate, selectEvent],
  );

  // keyboard shortcut: "/" opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        تجاوز إلى المحتوى الرئيسي
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__brand" href="#/home" aria-label="الصفحة الرئيسية">
            <span className="site-header__title">الأندلس</span>
            <span className="site-header__sub">رحلة عبر الزمن</span>
          </a>

          <button
            type="button"
            className="header-burger"
            aria-expanded={navOpen}
            aria-label="القائمة"
            onClick={() => setNavOpen((o) => !o)}
          >
            <Icon name={navOpen ? "close" : "menu"} />
          </button>

          <nav className="site-nav" data-open={navOpen} aria-label="التنقل الرئيسي">
            {NAV_ITEMS.map((item) =>
              item.id === "search" ? (
                <button
                  key={item.id}
                  type="button"
                  className="site-nav__link"
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  onClick={() => setSearchOpen(true)}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.id}
                  href={`#/${item.id}`}
                  className="site-nav__link"
                  aria-current={view === item.id ? "page" : undefined}
                  onClick={() => {
                    setView(item.id);
                    setNavOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
        </div>
      </header>

      <div className="main" id="main-content">
        {view === "home" && <HomeView onExplore={() => navigate("explore")} />}

        {view === "explore" && (
          <>
            <Timeline
              selectedEventId={selectedEventId}
              onSelectEvent={selectEvent}
              activeCategories={activeCategories}
              onToggleCategory={toggleCategory}
            />
            <div className="explorer">
              <CityPanel selectedCityId={selectedCityId} onSelectCity={selectCity} />
              <MapView
                selectedCityId={selectedCityId}
                selectedYear={selectedYear}
                onSelectCity={selectCity}
              />
              <InfoPanel city={selectedCity} event={selectedEvent} />
            </div>
            <MobileDrawer
              panel={mobilePanel}
              onClose={() => setMobilePanel(null)}
  
            >
              {mobilePanel === "cities" && (
                <CityPanel selectedCityId={selectedCityId} onSelectCity={selectCity} />
              )}
              {mobilePanel === "info" && <InfoPanel city={selectedCity} event={selectedEvent} />}
            </MobileDrawer>
            <div className="mobile-tabbar" role="tablist" aria-label="أدوات الجوال">
              <button
                type="button"
                role="tab"
                aria-selected={mobilePanel === "cities"}
                aria-pressed={mobilePanel === "cities"}
                onClick={() => setMobilePanel(mobilePanel === "cities" ? null : "cities")}
              >
                <Icon name="map-pin" />
                المدن
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobilePanel === "info"}
                aria-pressed={mobilePanel === "info"}
                onClick={() => setMobilePanel(mobilePanel === "info" ? null : "info")}
              >
                <Icon name="layers" />
                التفاصيل
              </button>
              <button
                type="button"
                role="tab"
                aria-pressed={false}
                onClick={() => setSearchOpen(true)}
              >
                <Icon name="search" />
                البحث
              </button>
            </div>
          </>
        )}

        {view === "eras" && <ErasView onSelectCity={selectCity} onSelectEvent={selectEvent} />}

        {view === "library" && (
          <LibraryView
            onSelectCity={(cityId) => {
              setSelectedCityId(cityId);
              setSelectedEventId(null);
              navigate("explore");
            }}
          />
        )}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleSearchSelect} />

      <footer className="site-footer">
        <p>
          أطلس الأندلس التفاعلي — المحتوى التاريخي مستند إلى مصادر موثوقة (اليونسكو، متحف المتروبوليتان،
          الموسوعات المرجعية). الخرائط والصور من ويكيميديا كومنز بتراخيص موثقة.
        </p>
        <p style={{ marginTop: 6 }}>
          <a href="https://abdulrahim.page/" target="_blank" rel="noopener noreferrer">
            ← العودة إلى الموقع الرئيسي
          </a>
        </p>
      </footer>
    </div>
  );
}

/** Mobile bottom drawer for panels. */
function MobileDrawer({
  panel,
  onClose,
  children,
}: {
  panel: "cities" | "info" | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") return null;
  return (
    <div className="mobile-drawer" data-open={panel !== null} aria-hidden={panel === null}>
      <div className="mobile-drawer__handle" onClick={onClose} role="button" tabIndex={0} aria-label="إغلاق اللوحة">
        <span />
      </div>
      <div className="mobile-drawer__body">{children}</div>
    </div>
  );
}

/** Eras view: all periods as cards with their events. */
function ErasView({
  onSelectCity,
  onSelectEvent,
}: {
  onSelectCity: (city: City) => void;
  onSelectEvent: (event: TimelineEvent) => void;
}) {
  const [openPeriod, setOpenPeriod] = useState<string | null>(null);
  return (
    <main className="library">
      <div className="library__intro">
        <div className="hero__ornament" aria-hidden="true">❦</div>
        <h2>الحقب التاريخية للأندلس</h2>
        <p>
          تسع مراحل كبرى من الفتح الإسلامي حتى سقوط غرناطة. اختر حقبة لعرض أحداثها،
          ثم انتقل إلى الخريطة التفاعلية لاستكشاف مدنها.
        </p>
      </div>
      <div className="library-grid">
        {PERIODS.map((p) => {
          const evs = timelineEvents.filter((e) => e.year >= p.startYear && e.year <= p.endYear);
          const open = openPeriod === p.id;
          return (
            <section className="library-card" key={p.id} style={{ borderTop: `3px solid ${p.color}` }}>
              <button
                type="button"
                className="library-card__title"
                style={{ width: "100%", background: "none", border: "none", borderBottom: "2px solid var(--gold)", paddingBottom: 8, cursor: "pointer", fontFamily: "inherit" }}
                aria-expanded={open}
                onClick={() => setOpenPeriod(open ? null : p.id)}
              >
                <Icon name="crown" /> {p.name}
                <span style={{ marginInlineStart: "auto", fontSize: "0.72rem", color: "var(--brown-muted)" }}>
                  {p.startYear} — {p.endYear}
                </span>
              </button>
              <p style={{ fontSize: "0.84rem", color: "var(--brown-soft)", marginBlock: 8 }}>{p.summary}</p>
              {open && (
                <>
                  <p style={{ fontSize: "0.84rem", marginBlockEnd: 10 }}>{p.description}</p>
                  <ul>
                    {evs.map((e) => (
                      <li key={e.id} style={{ marginBottom: 6 }}>
                        <button
                          type="button"
                          className="library-card__link"
                          onClick={() => {
                            onSelectEvent(e);
                          }}
                        >
                          {e.yearLabel} — {e.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      className="library-card__link"
                      onClick={() => {
                        const city = cities.find((c) => c.periods.includes(p.id));
                        if (city) onSelectCity(city);
                      }}
                    >
                      استكشف مدن هذه الحقبة ←
                    </button>
                  </div>
                </>
              )}
              <ul className="info-sources" style={{ marginTop: 10 }}>
                {p.sources.slice(0, 2).map((s, i) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.title} <Icon name="external-link" size={10} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
