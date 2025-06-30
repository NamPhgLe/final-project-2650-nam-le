import { useMemo } from 'react';

const TRINKET_IDS = ['3340', '3363', '3364'];

interface ItemData {
  name: string;
  stats: Record<string, number>;
  maps: Record<string, boolean>;
  gold: { total: number };
}

type ItemMap = Record<string, ItemData>;

export function useAllStatKeys(items: ItemMap | null) {
  return useMemo(() => {
    if (!items) return [];
    const keys = new Set<string>();
    Object.values(items).forEach(item => {
      Object.keys(item.stats).forEach(stat => keys.add(stat));
    });
    return Array.from(keys).sort();
  }, [items]);
}

export function useFilteredItems(
  items: ItemMap | null,
  selectedMap: string | null,
  selectedStats: string[],
  selectedSort: string,
  searchTerm: string
) {
  return useMemo(() => {
    if (!items) return [];

    const lowerTerm = searchTerm.toLowerCase();
    const seenNames = new Set<string>();
    let entries = Object.entries(items);

    if (selectedMap) {
      entries = entries.filter(([_, item]) => item.maps[selectedMap]);
    }

    const filterStats = selectedStats.filter((s) => s !== 'gold');
    if (filterStats.length > 0) {
      entries = entries.filter(([_, item]) =>
        filterStats.every((stat) => item.stats[stat] && item.stats[stat] !== 0)
      );
    }

    if (searchTerm.trim()) {
      entries = entries.filter(([_, item]) =>
        item.name.toLowerCase().includes(lowerTerm) ||
        Object.keys(item.stats).some(stat => stat.toLowerCase().includes(lowerTerm))
      );
    }

   
entries = entries.filter(([id, item]) => {
  // Always include trinkets regardless of map/stats filters
  if (TRINKET_IDS.includes(id)) return true;

  if (selectedMap && !item.maps[selectedMap]) return false;

  if (filterStats.length > 0 && !filterStats.every((stat) => item.stats[stat] && item.stats[stat] !== 0)) {
    return false;
  }

  return true;
});
    entries.sort(([_, a], [__, b]) => {
      if (selectedSort === 'gold') {
        return a.gold.total - b.gold.total;
      }
      return (b.stats[selectedSort] || 0) - (a.stats[selectedSort] || 0);
    });

    return entries;
  }, [items, selectedMap, selectedStats, selectedSort, searchTerm]);
}
