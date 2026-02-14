'use client';

import { useEffect, useState } from 'react';
import { EraData, Category, TimelineItem } from './types';
import { loadAllEras } from './utils';
import Timeline from './components/Timeline';
import DetailPanel from './components/DetailPanel';
import NavBar from './components/NavBar';
import styles from './page.module.css';

export default function Home() {
  const [eras, setEras] = useState<EraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<Category>>(
    new Set(['religious', 'political', 'philosophical', 'scientific', 'artistic', 'cultural'])
  );

  useEffect(() => {
    loadAllEras().then((data) => {
      setEras(data);
      setLoading(false);
    });
  }, []);

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
  };

  const handleFilterToggle = (category: Category) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleScrollToEra = (eraEn: string) => {
    const era = eras.find(e => e.eraEn.toLowerCase() === eraEn.toLowerCase());
    if (era) {
      const event = new CustomEvent('scrollToYear', { detail: { year: era.startYear } });
      window.dispatchEvent(event);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingInner}>
          <div className={styles.loadingSpinner} />
          <p>역사를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavBar
        eras={eras}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
        onScrollToEra={handleScrollToEra}
      />
      <Timeline
        eras={eras}
        activeFilters={activeFilters}
        onItemClick={handleItemClick}
        selectedItem={selectedItem}
      />
      <DetailPanel
        item={selectedItem}
        onClose={handleClosePanel}
      />
    </div>
  );
}
