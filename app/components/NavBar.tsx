'use client';

import { useState } from 'react';
import { EraData, Category, CATEGORY_COLORS, CATEGORY_LABELS } from '../types';
import styles from './NavBar.module.css';

interface NavBarProps {
  eras: EraData[];
  activeFilters: Set<Category>;
  onFilterToggle: (category: Category) => void;
  onScrollToEra: (eraEn: string) => void;
}

const ALL_CATEGORIES: Category[] = ['religious', 'political', 'philosophical', 'scientific', 'artistic', 'cultural'];

export default function NavBar({ eras, activeFilters, onFilterToggle, onScrollToEra }: NavBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <h1 className={styles.title}>Historical Timeline</h1>
        <div className={styles.eraButtons}>
          {eras.map((era) => (
            <button
              key={era.eraEn}
              className={styles.eraButton}
              onClick={() => onScrollToEra(era.eraEn)}
              title={era.eraEn}
            >
              {era.eraEn}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <button
          className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          ⚙ Filter
        </button>
        {showFilters && (
          <div className={styles.filterDropdown}>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterChip} ${activeFilters.has(cat) ? styles.filterChipActive : ''}`}
                onClick={() => onFilterToggle(cat)}
                style={{
                  borderColor: CATEGORY_COLORS[cat],
                  backgroundColor: activeFilters.has(cat) ? CATEGORY_COLORS[cat] + '30' : 'transparent',
                }}
              >
                <span
                  className={styles.filterDot}
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                />
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
