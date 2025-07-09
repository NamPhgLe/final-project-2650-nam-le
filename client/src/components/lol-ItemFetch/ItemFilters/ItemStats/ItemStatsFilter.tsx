import React, { useEffect } from 'react';
import styles from './ItemStatsFilter.module.css';
import { statNameMap } from '../../../../constants/statNameMap';
import { riotStatKeyMap } from '../../../../constants/riotStatNameMap';

interface ItemStatsFilterProps {
  availableStats: string[];
  selectedStats: string[];
  onChange: (selected: string[]) => void;
}

// fallback formatter: camelCase to "Camel Case"
const formatFallbackName = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, s => s.toUpperCase());

const normalizeKey = (stat: string) => riotStatKeyMap[stat] || stat;

const ItemStatsFilter: React.FC<ItemStatsFilterProps> = ({
  availableStats,
  selectedStats,
  onChange,
}) => {
  // Normalize and deduplicate stat keys
  const normalizedStats = Array.from(
    new Set(availableStats.map(normalizeKey))
  );

  useEffect(() => {
    console.log('Normalized stats:', normalizedStats);
  }, [availableStats]);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Filter by Stats:</h3>
      <div className={styles.buttonsContainer}>
        {normalizedStats.map(stat => {
          const isSelected = selectedStats.includes(stat);
          const label = statNameMap[stat] || formatFallbackName(stat);

          return (
            <button
              key={stat}
              type="button"
              className={`${styles.btn} ${isSelected ? styles.active : styles.inactive}`}
              onClick={() => {
                const next = isSelected
                  ? selectedStats.filter(s => s !== stat)
                  : [...selectedStats, stat];
                onChange(next);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ItemStatsFilter;
