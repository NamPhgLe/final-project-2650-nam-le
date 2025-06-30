import { useState } from 'react';
import type { ItemData } from '../constants/lol-ItemTypes';

const TRINKET_IDS = ['3340', '3363', '3364'];
const MIN_SLOTS = 6;
const MAX_SLOTS = 20;

export function useInventory() {
  const [inventory, setInventory] = useState<{ item: ItemData; img: string }[]>([]);
  const [trinket, setTrinket] = useState<{ item: ItemData; img: string } | null>(null);
  const [slotCount, setSlotCount] = useState(MIN_SLOTS);

  const addItem = (item: ItemData, img: string) => {
    const isTrinket = TRINKET_IDS.includes(item.id);

    if (isTrinket) {
      setTrinket({ item, img });
    } else if (inventory.length < slotCount) {
      setInventory((prev) => [...prev, { item, img }]);
    } else {
      alert('Inventory is full!');
    }
  };

  const removeItem = (index: number) => {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  };

  const removeTrinket = () => {
    setTrinket(null);
  };

  const clearInventory = () => {
    setInventory([]);
    setTrinket(null);
  };

  const increaseSlots = () => setSlotCount((prev) => Math.min(prev + 1, MAX_SLOTS));
  const decreaseSlots = () => setSlotCount((prev) => Math.max(prev - 1, MIN_SLOTS));

  return {
    inventory,
    trinket,
    slotCount,
    addItem,
    removeItem,
    removeTrinket,
    clearInventory,
    increaseSlots,
    decreaseSlots,
  };
}
