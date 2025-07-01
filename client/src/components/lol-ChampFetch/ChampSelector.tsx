import React from 'react';

interface ChampionSelectorProps {
  championList: Record<string, string>;
  selectedChampion: string;
  onChange: (championId: string) => void;
}

export default function ChampionSelector({ championList, selectedChampion, onChange }: ChampionSelectorProps) {
  return (
    <label>
      Champion:{' '}
      <select value={selectedChampion} onChange={e => onChange(e.target.value)}>
        {Object.entries(championList).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
