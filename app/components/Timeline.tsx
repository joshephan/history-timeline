'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { EraData, Category, TimelineItem, Figure, Event, Work, CATEGORY_COLORS, ERA_BACKGROUNDS } from '../types';
import { yearToX, getTotalWidth, getTickYears, formatYear, assignLanes, TIMELINE_START_YEAR, TIMELINE_END_YEAR } from '../utils';
import styles from './Timeline.module.css';

interface TimelineProps {
  eras: EraData[];
  activeFilters: Set<Category>;
  onItemClick: (item: TimelineItem) => void;
  selectedItem: TimelineItem | null;
}

const FIGURE_BAR_HEIGHT = 28;
const RULER_HEIGHT = 44;
const WORKS_AREA_HEIGHT = 36;
const TOP_PADDING = 40;
const NAV_HEIGHT = 36;

export default function Timeline({ eras, activeFilters, onItemClick, selectedItem }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalWidth = getTotalWidth();
  const [viewportHeight, setViewportHeight] = useState(800);

  useEffect(() => {
    setViewportHeight(window.innerHeight);
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allFigures = eras.flatMap(era => era.figures).filter(f => activeFilters.has(f.category));
  const laneMap = assignLanes(allFigures);
  const maxLane = Math.max(0, ...Array.from(laneMap.values()));
  
  // Fill the full viewport height with lanes
  const availableHeight = viewportHeight - NAV_HEIGHT - TOP_PADDING - WORKS_AREA_HEIGHT - RULER_HEIGHT - 20;
  const laneHeight = Math.max(Math.floor(availableHeight / (maxLane + 1)), FIGURE_BAR_HEIGHT + 4);

  // Mouse wheel → horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const handleScrollTo = (e: CustomEvent<{ year: number }>) => {
      if (scrollRef.current) {
        const x = yearToX(e.detail.year) - 100;
        scrollRef.current.scrollTo({ left: x, behavior: 'smooth' });
      }
    };
    window.addEventListener('scrollToYear', handleScrollTo as EventListener);
    return () => window.removeEventListener('scrollToYear', handleScrollTo as EventListener);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = yearToX(-500) - 200;
    }
  }, []);

  const isSelected = useCallback((type: string, id: string) => {
    if (!selectedItem) return false;
    if (selectedItem.type === type) {
      if (type === 'figure') return (selectedItem.data as Figure).id === id;
      if (type === 'event') return (selectedItem.data as Event).id === id;
      if (type === 'work') return (selectedItem.data as Work).id === id;
    }
    return false;
  }, [selectedItem]);

  const majorTicks = getTickYears(TIMELINE_START_YEAR, TIMELINE_END_YEAR, 100);
  const minorTicks = getTickYears(TIMELINE_START_YEAR, TIMELINE_END_YEAR, 50).filter(y => y % 100 !== 0);

  // All events across eras
  const allEvents = eras.flatMap(era => era.events).filter(e => activeFilters.has(e.category));
  const allWorks = eras.flatMap(era => era.works).filter(w => activeFilters.has(w.category));

  return (
    <div className={styles.timelineWrapper} ref={scrollRef}>
      <div className={styles.timelineContent} style={{ width: totalWidth }}>
        {/* Era backgrounds - full height */}
        {eras.map((era) => {
          const left = yearToX(era.startYear);
          const width = yearToX(era.endYear) - left;
          const bgKey = era.eraEn.toLowerCase() as keyof typeof ERA_BACKGROUNDS;
          return (
            <div
              key={era.eraEn}
              className={styles.eraBackground}
              style={{
                left,
                width,
                backgroundColor: ERA_BACKGROUNDS[bgKey] || 'transparent',
              }}
            >
              <div className={styles.eraLabel}>{era.eraEn}</div>
            </div>
          );
        })}

        {/* Major tick lines - full height, behind everything */}
        {majorTicks.map((year) => (
          <div
            key={`gridline-${year}`}
            className={styles.gridLine}
            style={{ left: yearToX(year) }}
          />
        ))}

        {/* Year 0 divider - full height */}
        <div
          className={styles.yearZeroLine}
          style={{ left: yearToX(0) }}
        >
          <span className={styles.yearZeroLabel}>AD / BC</span>
        </div>

        {/* Event lines - full height vertical lines */}
        {allEvents.map((evt) => {
          const left = yearToX(evt.year);
          const color = CATEGORY_COLORS[evt.category];
          const selected = isSelected('event', evt.id);

          return (
            <div
              key={evt.id}
              className={`${styles.eventLine} ${selected ? styles.eventLineSelected : ''}`}
              style={{ left }}
              onClick={() => onItemClick({ type: 'event', data: evt })}
              title={`${evt.name} (${formatYear(evt.year)})`}
            >
              <div className={styles.eventStripe} style={{ backgroundColor: color }} />
              <div className={styles.eventTag} style={{ borderColor: color, color }}>
                <span className={styles.eventYear}>{formatYear(evt.year)}</span>
                <span className={styles.eventName}>{evt.name}</span>
              </div>
            </div>
          );
        })}

        {/* Figure bars - positioned from top */}
        {allFigures.map((fig) => {
          const lane = laneMap.get(fig.id) ?? 0;
          const left = yearToX(fig.birthYear);
          const width = Math.max(yearToX(fig.deathYear) - left, 40);
          const top = TOP_PADDING + lane * laneHeight;
          const color = CATEGORY_COLORS[fig.category];
          const selected = isSelected('figure', fig.id);

          return (
            <div
              key={fig.id}
              className={`${styles.figureBar} ${selected ? styles.figureBarSelected : ''}`}
              style={{
                left,
                width,
                top,
                height: FIGURE_BAR_HEIGHT,
                backgroundColor: color + '44',
                borderLeft: `3px solid ${color}`,
                borderRight: `1px solid ${color}66`,
              }}
              onClick={() => onItemClick({ type: 'figure', data: fig })}
              title={`${fig.name} (${formatYear(fig.birthYear)} – ${formatYear(fig.deathYear)})`}
            >
              <span className={styles.figureName}>{fig.name}</span>
            </div>
          );
        })}

        {/* Works - positioned along bottom, above ruler */}
        {allWorks.map((work) => {
          const left = yearToX(work.year);
          const color = CATEGORY_COLORS[work.category];
          const selected = isSelected('work', work.id);

          return (
            <div
              key={work.id}
              className={`${styles.workItem} ${selected ? styles.workItemSelected : ''}`}
              style={{ left, bottom: RULER_HEIGHT + 8 }}
              onClick={() => onItemClick({ type: 'work', data: work })}
              title={`${work.name} (${formatYear(work.year)})`}
            >
              <div className={styles.workDot} style={{ backgroundColor: color }} />
              <span className={styles.workLabel} style={{ color }}>{work.name}</span>
            </div>
          );
        })}

        {/* Ruler at bottom */}
        <div className={styles.ruler} style={{ height: RULER_HEIGHT }}>
          {majorTicks.map((year) => (
            <div
              key={`major-${year}`}
              className={styles.majorTick}
              style={{ left: yearToX(year) }}
            >
              <div className={styles.majorTickLine} />
              <span className={styles.majorTickLabel}>{formatYear(year)}</span>
            </div>
          ))}
          {minorTicks.map((year) => (
            <div
              key={`minor-${year}`}
              className={styles.minorTick}
              style={{ left: yearToX(year) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
