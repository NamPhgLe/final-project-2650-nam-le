import { useState } from 'react';
import type { ItemData } from '../constants/lol-ItemTypes';

const TRINKET_IDS = ['3340', '3363', '3364'];

export function useInventory() {
  const [inventory, setInventory] = useState<{ item: ItemData; img: string }[]>([]);
  const [trinket, setTrinket] = useState<{ item: ItemData; img: string } | null>(null);

  const addItem = (item: ItemData, img: string) => {
    const isTrinket = TRINKET_IDS.includes(item.id);

    if (isTrinket) {
      setTrinket({ item, img });
    } else if (inventory.length < 6) {
      setInventory((prev) => [...prev, { item, img }]);
    } else {
      alert("Inventory is full!");
    }
  };

  const removeItem = (index: number) => {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  };

  const clearInventory = () => {
    setInventory([]);
    setTrinket(null);
  };

  return {
    inventory,
    trinket,
    addItem,
    removeItem,
    clearInventory,
  };
}
