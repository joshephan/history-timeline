'use client';

import { TimelineItem, Figure, Event, Work, CATEGORY_COLORS, CATEGORY_LABELS } from '../types';
import { formatYear } from '../utils';
import styles from './DetailPanel.module.css';

interface DetailPanelProps {
  item: TimelineItem | null;
  onClose: () => void;
}

export default function DetailPanel({ item, onClose }: DetailPanelProps) {
  if (!item) return null;

  const renderFigure = (fig: Figure) => (
    <>
      <div className={styles.header}>
        <div className={styles.names}>
          <h2 className={styles.nameKo}>{fig.name}</h2>
        </div>
        <span
          className={styles.badge}
          style={{ backgroundColor: CATEGORY_COLORS[fig.category] + '30', color: CATEGORY_COLORS[fig.category], borderColor: CATEGORY_COLORS[fig.category] }}
        >
          {CATEGORY_LABELS[fig.category]}
        </span>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Lifespan</span>
          <span className={styles.metaValue}>
            {formatYear(fig.birthYear)} — {fig.deathYear ? formatYear(fig.deathYear) : 'Present'}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Duration</span>
          <span className={styles.metaValue}>
            {Math.abs((fig.deathYear || 2025) - fig.birthYear)} years
          </span>
        </div>
      </div>
      {fig.descriptionEn && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Description</h4>
          <p className={styles.description}>{fig.descriptionEn}</p>
        </div>
      )}
      {fig.description && fig.description !== fig.descriptionEn && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Details</h4>
          <p className={styles.description}>{fig.description}</p>
        </div>
      )}
      {fig.significance && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Historical Significance</h4>
          <p className={styles.significance}>{fig.significance}</p>
        </div>
      )}
    </>
  );

  const renderEvent = (evt: Event) => (
    <>
      <div className={styles.header}>
        <div className={styles.names}>
          <h2 className={styles.nameKo}>{evt.name}</h2>
        </div>
        <span
          className={styles.badge}
          style={{ backgroundColor: CATEGORY_COLORS[evt.category] + '30', color: CATEGORY_COLORS[evt.category], borderColor: CATEGORY_COLORS[evt.category] }}
        >
          {CATEGORY_LABELS[evt.category]}
        </span>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Year</span>
          <span className={styles.metaValue}>{formatYear(evt.year)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Type</span>
          <span className={styles.metaValue}>📌 Event</span>
        </div>
      </div>
      {evt.descriptionEn && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Description</h4>
          <p className={styles.description}>{evt.descriptionEn}</p>
        </div>
      )}
    </>
  );

  const renderWork = (work: Work) => (
    <>
      <div className={styles.header}>
        <div className={styles.names}>
          <h2 className={styles.nameKo}>{work.name}</h2>
        </div>
        <span
          className={styles.badge}
          style={{ backgroundColor: CATEGORY_COLORS[work.category] + '30', color: CATEGORY_COLORS[work.category], borderColor: CATEGORY_COLORS[work.category] }}
        >
          {CATEGORY_LABELS[work.category]}
        </span>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Year</span>
          <span className={styles.metaValue}>{formatYear(work.year)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Author</span>
          <span className={styles.metaValue}>{work.author}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Type</span>
          <span className={styles.metaValue}>📖 Work</span>
        </div>
      </div>
      {work.descriptionEn && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Description</h4>
          <p className={styles.description}>{work.descriptionEn}</p>
        </div>
      )}
    </>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <div className={styles.content}>
          {item.type === 'figure' && renderFigure(item.data as Figure)}
          {item.type === 'event' && renderEvent(item.data as Event)}
          {item.type === 'work' && renderWork(item.data as Work)}
        </div>
      </div>
    </div>
  );
}
