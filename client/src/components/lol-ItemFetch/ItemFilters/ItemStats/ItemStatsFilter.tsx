import React, { useEffect } from 'react';
import styles from './ItemStatsFilter.module.css';
import { statNameMap } from '../../../../constants/statNameMap';
import { riotStatKeyMap } from '../../../../constants/riotStatNameMap';

interface ItemStatsFilterProps {
  availableStats: string[];
  selectedStats: string[];  
  onChange: (selected: string[]) => void;
}

const formatFallbackName = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, s => s.toUpperCase());

const ItemStatsFilter: React.FC<ItemStatsFilterProps> = ({
  availableStats,
  selectedStats,
  onChange,
}) => {

  return (
    <div className={styles.container}>
   
      <div className={styles.buttonsContainer}>
        {availableStats.map(originalKey => {
          const normalizedKey = riotStatKeyMap[originalKey] || originalKey;
          const label = statNameMap[normalizedKey] || formatFallbackName(normalizedKey);
          const isSelected = selectedStats.includes(originalKey); 

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
