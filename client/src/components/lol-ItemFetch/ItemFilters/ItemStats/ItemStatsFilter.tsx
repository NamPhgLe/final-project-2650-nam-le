import React, { useEffect } from 'react';
import styles from './ItemStatsFilter.module.css';
import { statNameMap } from '../../../../constants/statNameMap';
import { riotStatKeyMap } from '../../../../constants/riotStatNameMap';

interface ItemStatsFilterProps {
  availableStats: string[]; // e.g., ["FlatArmorMod", "FlatHPRegenMod"]
  selectedStats: string[];  // still uses the original keys like "FlatArmorMod"
  onChange: (selected: string[]) => void;
}

// fallback formatter: camelCase → "Camel Case"
const formatFallbackName = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, s => s.toUpperCase());

const ItemStatsFilter: React.FC<ItemStatsFilterProps> = ({
  availableStats,
  selectedStats,
  onChange,
}) => {
  useEffect(() => {
    console.log('Available stats:', availableStats);
  }, [availableStats]);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Filter by Stats:</h3>
      <div className={styles.buttonsContainer}>
        {availableStats.map(originalKey => {
          const normalizedKey = riotStatKeyMap[originalKey] || originalKey;
          const label = statNameMap[normalizedKey] || formatFallbackName(normalizedKey);
          const isSelected = selectedStats.includes(originalKey); // use original for state

          return (
            <button
              key={originalKey}
              type="button"
              className={`${styles.btn} ${isSelected ? styles.active : styles.inactive}`}
              onClick={() => {
                const next = isSelected
                  ? selectedStats.filter(s => s !== originalKey)
                  : [...selectedStats, originalKey];
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
