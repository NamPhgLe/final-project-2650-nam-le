import React from 'react';
import styles from './InventoryStats.module.css';
import type { ItemData } from '../../../constants/itemData';
import { statNameMap } from '../../../constants/statNameMap';
import { parseItemDescription } from '../../../utils/parseItemDescription';
import useLatestVersion from '../../../hooks/useLatestVersion';
import { useEffect, useRef } from 'react';
interface InventoryStatsProps {
  items: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
}

function getStatName(statKey: string): string {
  return statNameMap[statKey] || statKey;
}

export default function InventoryStats({ items, trinket }: InventoryStatsProps) {
  const version = useLatestVersion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  if (!version) {
    return (
      <div className={styles.container}>
        <h3 className={styles.header}>Combined Stats</h3>
        <p>Loading version data...</p>
      </div>
    );
  }

  const statContributions: Record<
    string,
    { total: number; sources: { itemId: string; itemName: string; value: number }[] }
  > = {};

  const addStats = (item: ItemData) => {
    if (item.description) {
      const parsed = parseItemDescription(item.description);
      for (const [stat, value] of Object.entries(parsed)) {
        if (!statContributions[stat]) {
          statContributions[stat] = { total: 0, sources: [] };
        }
        statContributions[stat].total += value;
        statContributions[stat].sources.push({ itemId: item.id, itemName: item.name, value });
      }
    }
  };

  items.forEach((entry) => entry && addStats(entry.item));
  if (trinket) addStats(trinket.item);

  if (Object.keys(statContributions).length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.header}>Item Stats</h3>
        <p>No stats yet.</p>
      </div>
    );
  }

  const dedupedSourcesByStat: Record<
    string,
    { itemId: string; itemName: string; value: number; count: number }[]
  > = {};

  for (const [stat, data] of Object.entries(statContributions)) {
    const countMap: Record<string, { itemId: string; itemName: string; value: number; count: number }> = {};
    data.sources.forEach((source) => {
      const key = `${source.itemId}:${source.value}`;
      if (countMap[key]) {
        countMap[key].count += 1;
      } else {
        countMap[key] = { ...source, count: 1 };
      }
    });
    dedupedSourcesByStat[stat] = Object.values(countMap);
  }

  const STAT_ORDER = ['AttackDamage', 'MagicResist', 'AbilityPower', 'MoveSpeed'];
  const allStatKeys = [
    ...STAT_ORDER,
    ...Object.keys(statContributions).filter((k) => !STAT_ORDER.includes(k)),
  ];


  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.scrollArea}></div>
      {allStatKeys
        .filter((stat) => statContributions[stat])
        .map((stat) => (
          <div key={stat} className={styles.statLine}>
            <span className={styles.statLabel}>
              {getStatName(stat)}: {statContributions[stat].total}
            </span>
            <span className={styles.separator}>|</span>
            <div className={styles.sourcesList}>
              {dedupedSourcesByStat[stat].map((source, idx) => (
                <div key={`${stat}-${idx}`} className={styles.sourceItem}>
                  {source.count > 1 ? `${source.count} × ` : ''}
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${source.itemId}.png`}
                    alt={source.itemName}
                    className={styles.itemIcon}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
