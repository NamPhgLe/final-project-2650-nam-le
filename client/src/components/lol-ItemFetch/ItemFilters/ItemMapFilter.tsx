import React, { useState } from 'react';

interface ItemData {
  name: string;
  maps: Record<string, boolean>;
  gold: {
    total: number;
  };
}

interface MapFilterProps {
  items: Record<string, ItemData>;
  version: string;
  showText: boolean;
}

const MAP_NAMES: Record<string, string> = {
  '11': 'Summoner’s Rift',
  '12': 'Howling Abyss',
  '21': 'Nexus Blitz',
  '30': 'Crystal Scar',
};

interface MapFilterProps {
  items: Record<string, ItemData>;
  version: string;
  showText: boolean;
  selectedMap: string | null;
  onSelectMap: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function MapFilter({ selectedMap, onSelectMap }: MapFilterProps) {
  const allMaps = Object.keys(MAP_NAMES);

  return (
    <div>
      <h3>Select Map to Filter Items</h3>
      <div className="mb-3">
        <button
          className={`btn btn-sm btn-outline-secondary me-2 ${selectedMap === null ? 'active' : ''}`}
          onClick={() => onSelectMap(null)}
        >
          All Maps
        </button>
        {allMaps.map((mapId) => (
          <button
            key={mapId}
            className={`btn btn-sm btn-outline-primary me-2 ${selectedMap === mapId ? 'active' : ''}`}
            onClick={() => onSelectMap(mapId)}
          >
            {MAP_NAMES[mapId] ?? mapId}
          </button>
        ))}
      </div>
    </div>
  );
}
