import React from 'react';
import type { ItemData } from '../../../constants/lol-ItemTypes';
import { statNameMap } from '../../../constants/statNameMap';
import { parseItemDescription } from '../../../utils/parseItemDescription'; 

interface InventoryStatsProps {
  items: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
}

function getStatName(statKey: string): string {
  return statNameMap[statKey] || statKey;
}

export default function InventoryStats({ items, trinket }: InventoryStatsProps) {
  const statContributions: Record<
    string,
    { total: number; sources: { itemName: string; value: number }[] }
  > = {};

  const addStats = (item: ItemData) => {
    if (item.description) {
      const parsed = parseItemDescription(item.description);
      for (const [stat, value] of Object.entries(parsed)) {
        if (!statContributions[stat]) {
          statContributions[stat] = { total: 0, sources: [] };
        }
        statContributions[stat].total += value;
        statContributions[stat].sources.push({ itemName: `${item.name}`, value });
      }
    }
  };
  

  items.forEach((entry) => entry && addStats(entry.item));
  if (trinket) addStats(trinket.item);

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Combined Stats</h3>
      {Object.keys(statContributions).length === 0 ? (
        <p>No stats yet.</p>
      ) : (
        <ul>
          {Object.entries(statContributions).map(([statKey, data]) => (
            <li key={statKey}>
              <strong>{getStatName(statKey)}</strong>: {data.total}
              <ul>
                {data.sources.map((source, idx) => (
                  <li key={idx}>
                    {source.itemName}: {source.value}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
