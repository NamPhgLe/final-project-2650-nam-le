import { useState } from 'react';
import styles from './Inventory.module.css';
import type { ItemData } from '../../../constants/ItemData';

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

    let filledItems = items.slice(0, slotCount);
    while (filledItems.length < slotCount) {
        filledItems.push(null);
    }

    const slotsPerRow = 5;
    const rows = [];
    for (let i = 0; i < slotCount; i += slotsPerRow) {
        rows.push(filledItems.slice(i, i + slotsPerRow));
    }

    return (
        <div className={styles.inventoryContainer}>
            <div className={styles.slotControls}>
                <button onClick={onDecreaseSlots} disabled={slotCount <= 6}>-</button>
                <span>{slotCount} slots</span>
                <button onClick={onIncreaseSlots} disabled={slotCount >= 20}>+</button>

            </div>

            <table className={styles.table}>
                <tbody>
                    {rows.map((rowItems, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {rowItems.map((entry, idx) => {
                                const index = rowIndex * slotsPerRow + idx;
                                return (
                                    <td
                                        key={`slot-${index}`}
                                        className={styles.slot}
                                        onDoubleClick={() => {
                                            if (entry) onRemoveItem(index);
                                        }}
                                    >
                                        {entry ? (
                                            <img src={entry.img} alt={entry.item.name} />
                                        ) : (
                                            <div className={styles.emptySlot} />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={slotsPerRow} className={styles.trinketSlot}>
                            <strong>Trinket Slot:</strong>
                            <div
                                onDoubleClick={() => {
                                    if (trinket) onRemoveTrinket();
                                }}
                            >
                                {trinket ? (
                                    <img src={trinket.img} alt={trinket.item.name} />
                                ) : (
                                    <div className={styles.emptyTrinketSlot} />
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
