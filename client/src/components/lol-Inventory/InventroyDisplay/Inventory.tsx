import React from 'react';
import styles from './Inventory.module.css';
import eye from '../../../assets/eye.png'
import type { ItemData } from '../../../constants/itemData';

interface TrinketProps {
    items: ({ item: ItemData; img: string } | null)[];
    trinket?: { item: ItemData; img: string } | null;
    slotCount: number;
    onRemoveItem: (index: number) => void;
    onRemoveTrinket: () => void;
    onIncreaseSlots: () => void;
    onDecreaseSlots: () => void;
}

export default function Trinket({
    items,
    trinket,
    slotCount,
    onRemoveItem,
    onRemoveTrinket,
    onIncreaseSlots,
    onDecreaseSlots,
}: TrinketProps) {
    const filled: (typeof items)[0][] = items.slice(0, slotCount);
    while (filled.length < slotCount) {
        filled.push(null);
    }

    const slotsPerRow = 10;
    const rows: (typeof filled)[] = [];
    for (let i = 0; i < slotCount; i += slotsPerRow) {
        rows.push(filled.slice(i, i + slotsPerRow));
    }
    return (
        <div className={styles.inventoryContainer}>
            <div className={styles.slotControls}>
                <button className={styles.controlButton} onClick={onDecreaseSlots} disabled={slotCount <= 6}>−</button>
                <span className={styles.slotInfo}>{slotCount} slots + trinket</span>
                <button className={styles.controlButton} onClick={onIncreaseSlots} disabled={slotCount >= 20}>+</button>
            </div>

            <table className={styles.table}>
                <tbody>
                    {rows.map((rowItems, rowIndex) => {
                        const isLastRow = rowIndex === rows.length - 1;
                        return (
                            <tr key={rowIndex}>
                                {rowItems.map((entry, idx) => {
                                    const index = rowIndex * slotsPerRow + idx;
                                    return (
                                        <td
                                            key={index}
                                            className={styles.slot}
                                            onDoubleClick={() => entry && onRemoveItem(index)}
                                        >
                                            {entry
                                                ? <img src={entry.img} alt={entry.item.name} />
                                                : <div className={styles.emptySlot} />}
                                        </td>
                                    );
                                })}

                                {isLastRow && (
                                    <td
                                        onDoubleClick={() => trinket && onRemoveTrinket()}
                                    >
                                        {trinket
                                            ? <img src={trinket.img} alt={trinket.item.name} />
                                            : <div className={styles.emptyTrinketSlot} />}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

}
