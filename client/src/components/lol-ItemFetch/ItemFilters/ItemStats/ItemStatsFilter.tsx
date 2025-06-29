import React from 'react';
import styles from './ItemStatsFilter.module.css';
import {statNameMap} from '../../../../constants/statNameMap'
interface ItemStatsFilterProps {
  availableStats: string[];
  selectedStats: string[];
  onChange: (selected: string[]) => void;
}

const ItemStatsFilter: React.FC<ItemStatsFilterProps> = ({
  availableStats,
  selectedStats,
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Filter by Stats:</h3>
      <div className={styles.buttonsContainer}>
        {availableStats.map(stat => {
          const isSelected = selectedStats.includes(stat);
          return (
            <button
              key={stat}
              type="button"
              className={`${styles.btn} ${isSelected ? styles.active : styles.inactive}`}
              onClick={() => {
                if (isSelected) {
                  onChange(selectedStats.filter(s => s !== stat));
                } else {
                  onChange([...selectedStats, stat]);
                }
              }}
            >
              {statNameMap[stat] || stat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ItemStatsFilter;
