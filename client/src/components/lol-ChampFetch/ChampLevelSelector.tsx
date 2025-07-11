import React from 'react';

interface ChampLevelSelectorProps {
  selectedLevel: number;
  onChange: (level: number) => void;
  minLevel?: number;
  maxLevel?: number;
}

export default function ChampLevelSelector({
  selectedLevel,
  onChange,
  minLevel = 1,
  maxLevel = 18,
}: ChampLevelSelectorProps) {
  return (
    <label style={{ marginLeft: '1em' }}>
      Level:{' '}
      <select
        value={selectedLevel}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        {Array.from({ length: maxLevel - minLevel + 1 }, (_, i) => i + minLevel).map(
          (level) => (
            <option key={level} value={level}>
              {level}
            </option>
          )
        )}
      </select>
    </label>
  );
}
