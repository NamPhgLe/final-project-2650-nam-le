import { useEffect, useState, useRef } from 'react';
import MapFilter from './lol-ItemFilters/ItemMapFilter';
import ItemStats from '../lol-ItemStats/ItemStats';
import styles from './Itemfetch.module.css';
import ItemStatsFilter from './lol-ItemFilters/ItemStats/ItemStatsFilter';
import { useFilteredItems, useAllStatKeys } from './lol-ItemFilters/FilterHooks/ItemFilter';
import type { ItemData } from '../../types/lol-ItemTypes';
import React from 'react';
import axios from 'axios';

type ItemMap = Record<string, ItemData>;

export default function ItemFetcher() {
  const [items, setItems] = useState<ItemMap | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [showText, setShowText] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('gold');
  const [selectedStats, setSelectedStats] = useState<string[]>(['gold']);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const allStatKeys = useAllStatKeys(items);
  const filteredItems = useFilteredItems(items, selectedMap, selectedStats, selectedSort);
  const selectedItem = selectedItemId && items ? items[selectedItemId] : null;
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const versionRes = await axios.get<string[]>(
          'https://ddragon.leagueoflegends.com/api/versions.json'
        );
        const latestVersion = versionRes.data[0];
        setVersion(latestVersion);

        const itemsRes = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`
        );
        setItems(itemsRes.data.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const autoHideText = containerSize.height < 400 && containerSize.width < 800;
  const effectiveShowText = showText && !autoHideText;
  
  
 return (
  <div className={styles.itemFetcherContainer}>
  <h2 className={styles.itemFetcherHeader}>Items (Version: {version ?? 'loading...'})</h2>

  <button
    onClick={() => setShowText((prev) => !prev)}
    className={styles.toggleButton}
  >
    {showText ? 'Hide Text' : 'Show Text'}
  </button>

  <ItemStatsFilter
  availableStats={allStatKeys}
  selectedStats={selectedStats}
  onChange={setSelectedStats}
/>

  {items && version ? (
    <MapFilter
      items={items}
      version={version}
      showText={effectiveShowText}
      selectedMap={selectedMap}
      onSelectMap={setSelectedMap}
    />
  ) : (
    <p className="loading-text">Loading items...</p>
  )}


<div className={styles.mainContent}>
  <div className={styles.itemsScrollContainer} ref={containerRef}>
    {filteredItems.length > 0 ? (
      <div className={styles.grid}>
        {filteredItems.map(([id, item]) => (
          <div
            key={id}
            onClick={() => setSelectedItemId(id)}
            className={`${styles.itemCard} ${selectedItemId === id ? styles.selected : ''} ${!showText ? styles.compact : ''}`}
            style={{ minHeight: showText ? 150 : 90 }}
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
              alt={item.name}
              className={styles.itemImage}
            />
            {showText && (
              <>
                <h6 className={styles.itemName}>{item.name}</h6>
                <div><strong>Gold:</strong> {item.gold.total}</div>
              </>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className={styles.noItemsText}>
        No items available{selectedMap ? ` on ${selectedMap}` : ''}.
      </p>
    )}
  </div>

  {selectedItem && (
    <div className={styles.detailsRow}>
      <div className={styles.statsColumn}>
        <ItemStats item={selectedItem} />
      </div>
    </div>
  )}
</div>

</div>
  );
}
