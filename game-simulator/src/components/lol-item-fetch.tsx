import { useEffect, useState } from 'react';
import axios from 'axios';
interface ItemData {
  name: string;
  stats: Record<string, number>;
  description: string;
  gold: {
    base: number;
    total: number;
    sell: number;
    purchasable: boolean;
  };
  tags: string[];
}

type ItemMap = Record<string, ItemData>;

export default function ItemFetcher() {
  const [items, setItems] = useState<ItemMap | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const versionRes = await axios.get<string[]>('https://ddragon.leagueoflegends.com/api/versions.json');
        const latestVersion = versionRes.data[0];
        setVersion(latestVersion);

        const itemsRes = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`);
        setItems(itemsRes.data.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h2>(Version: {version ?? 'loading...'})</h2>
      <h2>Items</h2>
      {items ? (
        <ul>
          {Object.entries(items).map(([id, item]) => (
            <li key={id} style={{ marginBottom: '1em' }}>
              <strong>{item.name}</strong> – {item.gold.total} gold
              <ul>
                {Object.entries(item.stats).map(([statName, value]) => (
                  <li key={statName}>
                    {statName}: {value}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        'Loading...'
      )}
    </div>
  );
}
