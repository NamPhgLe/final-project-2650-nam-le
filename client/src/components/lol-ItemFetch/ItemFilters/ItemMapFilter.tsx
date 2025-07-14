import React from 'react';
import styles from './MapFilter.module.css';

interface MapFilterProps {
  items: Record<string, any>;
  version: string;
  selectedMap: string | null;
  onSelectMap: React.Dispatch<React.SetStateAction<string | null>>;
}

const MAP_NAMES: Record<string, string> = {
  '11': 'Summoner’s Rift',
};

export default function MapFilter({ selectedMap, onSelectMap }: MapFilterProps) {
  const allMaps = Object.keys(MAP_NAMES);

  return (
    <div className={styles.mapFilterContainer}>

      <div className={styles.mapButtonGroup}>
        <button
          className={`${styles.mapButton} ${selectedMap === null ? styles.active : ''}`}
          onClick={() => onSelectMap(null)}
        >
          All Maps
        </button>
        {allMaps.map((mapId) => (
          <button
            key={mapId}
            className={`${styles.mapButton} ${selectedMap === mapId ? styles.active : ''}`}
            onClick={() => onSelectMap(mapId)}
          >
            {MAP_NAMES[mapId] ?? `Map ${mapId}`}
          </button>
        ))}
      </div>
    </div>
  );
}
