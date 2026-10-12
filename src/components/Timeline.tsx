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
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedEventId]);

  const firstYear = timelineEvents.length ? timelineEvents[0].year : 0;
  const lastYear = timelineEvents.length ? timelineEvents[timelineEvents.length - 1].year : 0;

  return (
    <nav className="timeline" aria-label="الخط الزمني التاريخي">
      <div className="timeline__head">
        <span className="timeline__label">
          <Icon name="clock" /> الخط الزمني
        </span>
        <span className="timeline__range">
          الزمن: {firstYear} — {lastYear} ميلادية
        </span>
      </div>

      <div className="timeline__track-wrap" ref={trackRef}>
        <div className="timeline__track" role="list">
          {visibleEvents.map((event) => {
            const selected = event.id === selectedEventId;
            return (
              <button
                key={event.id}
                type="button"
                role="listitem"
                data-event-id={event.id}
                className="timeline-item"
                aria-pressed={selected}
                aria-label={`${event.yearLabel} — ${event.title}`}
                onClick={() => onSelectEvent(event)}
              >
                <span className="timeline-item__year">{event.yearLabel}</span>
                <span className="timeline-item__title">{event.title}</span>
                <span className="timeline-item__dot" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="timeline__filters" role="group" aria-label="تصفية الأحداث حسب النوع">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className="chip"
            aria-pressed={activeCategories.includes(cat)}
            onClick={() => onToggleCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
    </nav>
  );
}

export { CATEGORY_LABELS, CATEGORIES };
