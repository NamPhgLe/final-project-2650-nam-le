import React from 'react';

interface ChampLevelSelectorProps {
  selectedLevel: number;
  onChange: (level: number) => void;
  maxLevel?: number;
}

export default function ChampLevelSelector({ selectedLevel, onChange, maxLevel = 18 }: ChampLevelSelectorProps) {
  return (
    <label style={{ marginLeft: '1em' }}>
      Level:{' '}
      <select value={selectedLevel} onChange={e => onChange(parseInt(e.target.value, 10))}>
        {Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </label>
  );
}
