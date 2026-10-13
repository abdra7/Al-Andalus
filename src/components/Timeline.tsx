import { useEffect, useMemo, useRef } from "react";
import { timelineEvents, type TimelineEvent } from "../data/history";
import { Icon } from "./Icon";

type Category = TimelineEvent["category"];

const CATEGORY_LABELS: Record<Category, string> = {
  conquest: "الفتوح",
  politics: "السياسة",
  culture: "الثقافة",
  science: "العلوم",
  architecture: "العمارة",
  fall: "السقوط",
};

const CATEGORIES: Category[] = ["conquest", "politics", "culture", "science", "architecture", "fall"];

interface TimelineProps {
  selectedEventId: string | null;
  onSelectEvent: (event: TimelineEvent) => void;
  activeCategories: Category[];
  onToggleCategory: (category: Category) => void;
}

export function Timeline({
  selectedEventId,
  onSelectEvent,
  activeCategories,
  onToggleCategory,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const visibleEvents = useMemo(
    () => timelineEvents.filter((e) => activeCategories.includes(e.category)),
    [activeCategories],
  );

  // scroll the selected item into view when selection changes
  useEffect(() => {
    if (!selectedEventId || !trackRef.current) return;
    const el = trackRef.current.querySelector<HTMLElement>(`[data-event-id="${selectedEventId}"]`);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [selectedEventId]);

  const firstYear = timelineEvents.length ? timelineEvents[0].year : 0;
  const lastYear = timelineEvents.length ? timelineEvents[timelineEvents.length - 1].year : 0;

  return (
    <section className="timeline" aria-labelledby="timeline-label">
      <div className="timeline__head">
        <h2 className="timeline__label" id="timeline-label">
          <Icon name="clock" /> الخط الزمني
        </h2>
        <span className="timeline__range">
          {firstYear} — {lastYear} ميلادية · الأحداث المعروضة: {visibleEvents.length}
        </span>
      </div>

      <div className="timeline__track-wrap" ref={trackRef}>
        <ol className="timeline__track">
          {visibleEvents.map((event) => {
            const selected = event.id === selectedEventId;
            return (
              <li key={event.id} className="timeline__node">
                <button
                  type="button"
                  data-event-id={event.id}
                  className={`timeline-item timeline-item--${event.category}`}
                  aria-pressed={selected}
                  onClick={() => onSelectEvent(event)}
                >
                  <span className="timeline-item__year">{event.yearLabel}</span>
                  <span className="timeline-item__title">{event.title}</span>
                </button>
                <span className="timeline-item__dot" aria-hidden="true" />
              </li>
            );
          })}
          {visibleEvents.length === 0 && (
            <li className="timeline__empty">لا أحداث ضمن التصنيفات المختارة — فعّل تصنيفاً واحداً على الأقل.</li>
          )}
        </ol>
      </div>

      <div className="timeline__filters" role="group" aria-label="تصفية الأحداث حسب النوع">
        <span className="timeline__filters-label" aria-hidden="true">
          التصنيف:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip chip--${cat}`}
            aria-pressed={activeCategories.includes(cat)}
            onClick={() => onToggleCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
    </section>
  );
}

export { CATEGORY_LABELS, CATEGORIES };
