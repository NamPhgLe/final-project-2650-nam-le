import React, { useEffect, useState, useRef } from 'react';
import MapFilter from '../ItemFilters/ItemMapFilter';
import styles from '../itemStats.module.css';
import ItemStatsFilter from '../ItemFilters/ItemStats/ItemStatsFilter';
import { useFilteredItems, useAllStatKeys } from '../../../hooks/useItemFilter';
import type { ItemData } from '../../../constants/itemData';
import ItemSearchFilter from '../ItemFilters/ItemSearch/ItemSearchFilter';
import axios from 'axios';
import ItemDescription from '../ItemDescription/ItemDescription';
import { useInventory } from '../../../hooks/useInventory';
import Inventory from '../../lol-Inventory/InventroyDisplay/Inventory';
import InventoryStats from '../../lol-Inventory/InventoryStats/InventoryStats';

type ItemMap = Record<string, ItemData>;

export default function ItemFetcher() {
  const [items, setItems] = useState<ItemMap | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [nextItemId, setNextItemId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedMap, setSelectedMap] = useState<string | null>('11');
  const [selectedSort, setSelectedSort] = useState<string>('gold');
  const [selectedStats, setSelectedStats] = useState<string[]>(['gold']);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showInventoryStats, setShowInventoryStats] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const allStatKeys = useAllStatKeys(items);
  const filteredItems = useFilteredItems(
    items,
    selectedMap,
    selectedStats,
    selectedSort,
    searchTerm
  );
  const selectedItem = selectedItemId && items ? items[selectedItemId] : null;

  const {
    inventory,
    trinket,
    slotCount,
    addItem: handleBuyItem,
    removeItem,
    removeTrinket,
    increaseSlots,
    decreaseSlots,
  } = useInventory();

  const hasInventoryItems = inventory.length > 0 || !!trinket;

  useEffect(() => {
    async function loadData() {
      try {
        const versions = await axios.get<string[]>(
          'https://ddragon.leagueoflegends.com/api/versions.json'
        );
        const latest = versions.data[0];
        setVersion(latest);

        const itemsRes = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/item.json`
        );
        const raw = itemsRes.data.data as Record<string, ItemData>;
        const map: Record<string, ItemData> = {};
        Object.entries(raw).forEach(([id, itm]) => {
          map[id] = { ...itm, id };
        });
        setItems(map);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => {
      setSelectedItemId(nextItemId);
      setNextItemId(null);
      setIsClosing(false);
    }, 300);
    return () => clearTimeout(t);
  }, [isClosing, nextItemId]);

  const onClose = () => {
    setNextItemId(null);
    setIsClosing(true);
  };

  const openItemPanel = (id: string) => {
    if (!selectedItemId) {
      setSelectedItemId(id);
    } else if (id !== selectedItemId) {
      setNextItemId(id);
      setIsClosing(true);
    }
  };

  return (
    <div className={styles.itemFetcherContainer}>
      <h2 className={styles.itemFetcherHeader}>
      </h2>

      <ItemStatsFilter
        availableStats={allStatKeys}
        selectedStats={selectedStats}
        onChange={setSelectedStats}
      />

      <div className={styles.filters}>
        <ItemSearchFilter onSearch={setSearchTerm} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.itemsScrollContainer} ref={containerRef}>
          <div className={styles.grid}>
            {filteredItems.map(([id, item], idx) => (
              <div
                key={id}
                onClick={() => openItemPanel(id)}
                onDoubleClick={() =>
                  handleBuyItem(item as unknown as import('../../../constants/itemData').ItemData, `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`)
                }
                className={`${styles.itemCard} ${selectedItemId === id ? styles.selected : ''}`}
                style={{ '--delay': `${idx * 50}ms` } as React.CSSProperties}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <h6 className={styles.itemName}>{item.name}</h6>
                <div><strong>Gold:</strong> {item.gold.total}</div>
              </div>
            ))}
          </div>
        </div>
        {selectedItem && (
          <div className={`${styles.panel} ${isClosing ? styles.exit : ''}`}>

            <ItemDescription
              item={selectedItem}
              items={items!}
              version={version!}
              onSelectItem={openItemPanel}
              img={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${selectedItemId}.png`}
              onBuyItem={handleBuyItem}
              selectedMap={selectedMap}
            />
          </div>
        )}

      </div>

      <div className={styles.inventoryRow}>
        <Inventory
          items={inventory}
          trinket={trinket}
          slotCount={slotCount}
          onRemoveItem={removeItem}
          onRemoveTrinket={removeTrinket}
          onIncreaseSlots={increaseSlots}
          onDecreaseSlots={decreaseSlots}
        />

        {hasInventoryItems && (
          <div className={`${styles.inventoryStatsPanel}`}>
            <InventoryStats items={inventory} trinket={trinket} />
          </div>
        )}
      </div>
    </div>
  );
}
