import { useEffect, useState, useRef } from 'react';
import MapFilter from '../ItemFilters/ItemMapFilter';
import styles from './Itemfetch.module.css';
import ItemStatsFilter from '../ItemFilters/ItemStats/ItemStatsFilter';
import { useFilteredItems, useAllStatKeys } from '../../../hooks/useItemFilter';
import type { ItemData } from '../../../constants/lol-ItemTypes';
import ItemSearchFilter from '../ItemFilters/ItemSearch/ItemSearchFilter';
import axios from 'axios';
import ItemDescription from '../ItemDescription/ItemDescription';
import { useInventory } from '../../../hooks/useInventory';
import Inventory from '../../lol-Inventory/InventroyDisplay/Inventory';
import InventoryStats from '../../lol-Inventory/InventoryStats/InventoryStats'
type ItemMap = Record<string, ItemData>;

export default function ItemFetcher() {
  const [items, setItems] = useState<ItemMap | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [showText, setShowText] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('gold');
  const [selectedStats, setSelectedStats] = useState<string[]>(['gold']);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const allStatKeys = useAllStatKeys(items);
  const filteredItems = useFilteredItems(items, selectedMap, selectedStats, selectedSort, searchTerm);
  const selectedItem = selectedItemId && items ? items[selectedItemId] : null;

  const { inventory, trinket, slotCount, addItem: handleBuyItem, removeItem, removeTrinket, increaseSlots, decreaseSlots } = useInventory();

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

        const rawData: Record<string, ItemData> = itemsRes.data.data;

        const items: Record<string, ItemData> = {};
        Object.entries(rawData).forEach(([id, item]) => {
          items[id] = { ...item, id };
        });

        setItems(items);
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

      <ItemSearchFilter onSearch={setSearchTerm} />

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
                  onDoubleClick={() =>
                    handleBuyItem(item as ItemData, `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`)
                  }
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

        {selectedItem && items && version && (
          <ItemDescription
            item={selectedItem}
            items={items}
            version={version}
            onSelectItem={setSelectedItemId}
            img={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${selectedItemId}.png`}
            onBuyItem={handleBuyItem}
          />
        )}

        <Inventory 
          items={inventory} 
          trinket={trinket} 
          slotCount={slotCount}
          onRemoveItem={removeItem}
          onRemoveTrinket={removeTrinket}
          onIncreaseSlots={increaseSlots}
          onDecreaseSlots={decreaseSlots}
          />

          <InventoryStats items={inventory} trinket={trinket}></InventoryStats>
      </div>
    </div>
  );
}
