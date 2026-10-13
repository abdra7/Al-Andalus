import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex, getCity, type SearchEntry } from "../data/history";
import { Icon } from "./Icon";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (entry: SearchEntry) => void;
}
/** Normalize Arabic text for tolerant matching: strip diacritics, unify alef/ya/ta-marbuta. */

export function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "") // harakat + tatweel
    .replace(/[أإآٱ]/g, "ا") // alef variants
    .replace(/ى/g, "ي") // alef maqsura -> ya
    .replace(/ة/g, "ه") // ta marbuta -> ha
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    // Latin diacritics -> base letters (NFD split + remove combining marks)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function score(entry: SearchEntry, query: string): number {
  const q = normalizeArabic(query);
  if (!q) return 0;
  const title = normalizeArabic(entry.title);
  const latin = normalizeArabic(entry.latinName ?? "");
  const aliases = (entry.aliases ?? []).map(normalizeArabic);
  const desc = normalizeArabic(entry.description);
  if (title.startsWith(q)) return 100;
  if (title.includes(q)) return 80;
  if (aliases.some((a) => a.startsWith(q))) return 75;
  if (latin.startsWith(q)) return 70;
  if (aliases.some((a) => a.includes(q))) return 65;
  if (latin.includes(q)) return 60;
  if (desc.includes(q)) return 30;
  return 0;
}

export function SearchModal({ open, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActiveIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      // give focus back to whatever opened the dialog
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // show a helpful default: cities first
      return searchIndex.filter((e) => e.kind === "city").slice(0, 10);
    }
    return searchIndex
      .map((e) => ({ e, s: score(e, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.e);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[activeIndex];
      if (entry) onSelect(entry);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // keep focus inside the dialog
      const focusables = boxRef.current?.querySelectorAll<HTMLElement>("input, button");
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const activeId = results[activeIndex] ? `search-opt-${results[activeIndex].id}` : undefined;

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  if (!open) return null;

  return (
    <div
      className="search-modal"
      role="dialog"
      aria-modal="true"
      aria-label="البحث في المحتوى التاريخي"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-modal__box" ref={boxRef} onKeyDown={handleKey}>
        <div className="search-modal__input-wrap">
          <Icon name="search" />
          <input
            ref={inputRef}
            className="search-modal__input"
            type="search"
            placeholder="ابحث عن مدينة أو حدث أو شخصية…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="ابحث في المدن والأحداث والشخصيات والكتب"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
          />
          <button type="button" className="search-modal__close" onClick={onClose} aria-label="إغلاق البحث">
            <Icon name="close" size={18} />
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {query.trim() ? `${results.length} نتيجة` : ""}
        </p>
        {results.length === 0 ? (
          <p className="search-empty">لا توجد نتائج مطابقة. جرّب كلمة أخرى أو اسماً لاتينياً مثل Córdoba.</p>
        ) : (
          <ul className="search-results" id="search-results" role="listbox" aria-label="نتائج البحث">
            {results.map((entry, i) => {
              const city = entry.cityId ? getCity(entry.cityId) : undefined;
              return (
                <li
                  key={entry.id}
                  id={`search-opt-${entry.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className="search-results__item"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => onSelect(entry)}
                >
                  <span className="search-results__title">{entry.title}</span>
                  <span className="search-results__meta">
                    <span className="search-results__kind">
                      {entry.kind === "city"
                        ? "مدينة"
                        : entry.kind === "event"
                          ? "حدث"
                          : entry.kind === "figure"
                            ? "شخصية"
                            : entry.kind === "book"
                              ? "كتاب"
                              : "حقبة"}
                    </span>
                    {entry.yearLabel && <span>{entry.yearLabel}</span>}
                    {city && <span>{city.name}</span>}
                    {entry.latinName && <span dir="ltr">{entry.latinName}</span>}
                  </span>
                  <span className="search-results__desc">{entry.description}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
