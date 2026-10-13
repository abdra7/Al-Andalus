import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CityPanel } from "./components/CityPanel";
import { InfoPanel } from "./components/InfoPanel";
import { MapView } from "./components/MapView";
import { Timeline, CATEGORIES } from "./components/Timeline";
import { SearchModal } from "./components/SearchModal";
import { LibraryView } from "./components/LibraryView";
import { HomeView } from "./components/HomeView";
import { ErasView } from "./components/ErasView";
import { MusicPlayer } from "./components/MusicPlayer";
import { Icon } from "./components/Icon";
import {
  getCity,
  getFigure,
  getTimelineEvent,
  type City,
  type Figure,
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
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);
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
    setSelectedFigureId(null);
    if (window.innerWidth <= 1024) setMobilePanel("info");
  }, []);

  const selectEvent = useCallback((event: TimelineEvent) => {
    setSelectedEventId(event.id);
    setSelectedCityId(null);
    setSelectedFigureId(null);
    if (window.innerWidth <= 1024) setMobilePanel("info");
  }, []);

  const selectFigure = useCallback((figure: Figure) => {
    setSelectedFigureId(figure.id);
    setSelectedCityId(null);
    setSelectedEventId(null);
    if (window.innerWidth <= 1024) setMobilePanel("info");
  }, []);

  /** Jump to a book on the library shelf and focus it. */
  const openBook = useCallback(
    (bookId: string) => {
      navigate("library");
      window.setTimeout(() => {
        const el = document.getElementById(`book-${bookId}`);
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        el?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
        el?.focus({ preventScroll: true });
      }, 80);
    },
    [navigate],
  );

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
  const selectedFigure = selectedFigureId ? getFigure(selectedFigureId) ?? null : null;

  const handleSearchSelect = useCallback(
    (entry: SearchEntry) => {
      setSearchOpen(false);
      if (entry.kind === "city" && entry.cityId) {
        const c = getCity(entry.cityId);
        if (c) selectCity(c);
        navigate("explore");
      } else if (entry.kind === "event") {
        const ev = getTimelineEvent(entry.id.replace(/^event-/, ""));
        if (ev) {
          selectEvent(ev);
          navigate("explore");
        }
      } else if (entry.kind === "book") {
        openBook(entry.id.replace(/^book-/, ""));
      } else if (entry.kind === "figure") {
        const f = getFigure(entry.id.replace(/^figure-/, ""));
        if (f) {
          selectFigure(f);
          navigate("explore");
        }
      } else {
        navigate("eras");
      }
    },
    [navigate, selectCity, selectEvent, selectFigure, openBook],
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

          <nav id="site-nav" className="site-nav" data-open={navOpen} aria-label="التنقل الرئيسي">
            {NAV_ITEMS.map((item) =>
              item.id === "search" ? (
                <button
                  key={item.id}
                  type="button"
                  className="site-nav__link site-nav__button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setNavOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  <Icon name="search" /> {item.label}
                  <kbd className="site-nav__kbd" aria-hidden="true">/</kbd>
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

          <div className="site-header__tools">
            <MusicPlayer />
            <button
              type="button"
              className="header-burger"
              aria-expanded={navOpen}
              aria-controls="site-nav"
              aria-label={navOpen ? "إغلاق القائمة" : "فتح القائمة"}
              onClick={() => setNavOpen((o) => !o)}
            >
              <Icon name={navOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      <main className="main" id="main-content" tabIndex={-1}>
        {view === "home" && (
          <HomeView
            onExplore={() => navigate("explore")}
            onOpenEras={() => navigate("eras")}
            onOpenLibrary={() => navigate("library")}
          />
        )}

        {view === "explore" && (
          <div className="explore">
            <h1 className="sr-only">الخريطة التفاعلية للأندلس</h1>
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
                eventCityId={selectedEvent?.cityId ?? selectedFigure?.cityId ?? null}
                onSelectCity={selectCity}
              />
              <InfoPanel
                city={selectedCity}
                event={selectedEvent}
                figure={selectedFigure}
                onSelectCity={selectCity}
                onSelectFigure={selectFigure}
                onOpenBook={openBook}
              />
            </div>
            <MobileDrawer panel={mobilePanel} onClose={() => setMobilePanel(null)}>
              {mobilePanel === "cities" && (
                <CityPanel selectedCityId={selectedCityId} onSelectCity={selectCity} />
              )}
              {mobilePanel === "info" && (
                <InfoPanel
                  city={selectedCity}
                  event={selectedEvent}
                  figure={selectedFigure}
                  onSelectCity={selectCity}
                  onSelectFigure={selectFigure}
                  onOpenBook={openBook}
                />
              )}
            </MobileDrawer>
            <nav className="mobile-tabbar" aria-label="أدوات الخريطة">
              <button
                type="button"
                aria-expanded={mobilePanel === "cities"}
                aria-controls="mobile-drawer"
                onClick={() => setMobilePanel(mobilePanel === "cities" ? null : "cities")}
              >
                <Icon name="map-pin" size={20} />
                المدن
              </button>
              <button
                type="button"
                aria-expanded={mobilePanel === "info"}
                aria-controls="mobile-drawer"
                onClick={() => setMobilePanel(mobilePanel === "info" ? null : "info")}
              >
                <Icon name="layers" size={20} />
                التفاصيل
              </button>
              <button type="button" aria-haspopup="dialog" onClick={() => setSearchOpen(true)}>
                <Icon name="search" size={20} />
                البحث
              </button>
            </nav>
          </div>
        )}

        {view === "eras" && (
          <ErasView
            onSelectCity={(city) => {
              selectCity(city);
              navigate("explore");
            }}
            onSelectEvent={(event) => {
              selectEvent(event);
              navigate("explore");
            }}
            onSelectFigure={(figure) => {
              selectFigure(figure);
              navigate("explore");
            }}
            onOpenBook={openBook}
          />
        )}

        {view === "library" && (
          <LibraryView
            onSelectCity={(cityId) => {
              const c = getCity(cityId);
              if (c) selectCity(c);
              navigate("explore");
            }}
            onSelectFigure={(figure) => {
              selectFigure(figure);
              navigate("explore");
            }}
          />
        )}
      </main>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleSearchSelect} />

      <footer className="site-footer">
        <p>
          أطلس الأندلس التفاعلي — المحتوى التاريخي مستند إلى مصادر موثوقة (اليونسكو، متحف المتروبوليتان،
          الموسوعات المرجعية). الخريطة الأساسية من Natural Earth وناسا (ملكية عامة)، والصور من ويكيميديا
          كومنز بتراخيص موثقة، والخطوط Alexandria وMarkazi Text برخصة OFL.
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

/** Mobile bottom sheet for the city list / details panels. */
function MobileDrawer({
  panel,
  onClose,
  children,
}: {
  panel: "cities" | "info" | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const open = panel !== null;

  // closed sheet must be unreachable for keyboard and screen readers
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      id="mobile-drawer"
      className="mobile-drawer"
      data-open={open}
      role="region"
      aria-label={panel === "cities" ? "قائمة المدن" : "التفاصيل"}
    >
      <button type="button" className="mobile-drawer__handle" onClick={onClose} aria-label="إغلاق اللوحة">
        <span aria-hidden="true" />
      </button>
      <div className="mobile-drawer__body">{children}</div>
    </div>
  );
}
