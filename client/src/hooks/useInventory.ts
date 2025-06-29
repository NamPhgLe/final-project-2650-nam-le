import { useState } from 'react';
import type { ItemData } from '../constants/lol-ItemTypes';

export function useInventory() {
  const [inventory, setInventory] = useState<{ item: ItemData; img: string }[]>([]);
  const [ward, setWard] = useState<{ item: ItemData; img: string } | null>(null);

  const addItem = (item: ItemData, img: string) => {
    const isWard = item.name.toLowerCase().includes("ward");
    if (isWard) {
      setWard({ item, img });
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
    setWard(null);
  };

  return {
    inventory,
    ward,
    addItem,
    removeItem,
    clearInventory,
  };
}
