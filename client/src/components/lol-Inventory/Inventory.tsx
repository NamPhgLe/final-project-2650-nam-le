import styles from './inventory.module.css'
import type { ItemData } from '../../constants/lol-ItemTypes';

interface InventoryProps {
    items: ({ item: ItemData; img: string } | null)[];
    ward?: { item: ItemData; img: string } | null;
}

export default function Iventory({
    items,
    ward,
} : InventoryProps) {

    const filledItems = [...items];
    while (filledItems.length < 6) {
        filledItems.push(null);
    }

    return (
        <div className={styles.inventoryContainer}>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        {filledItems.slice(0, 3).map((entry, idx) => (
                            <td key={`slot-top-${idx}`} className={styles.slot}>
                                {entry ? (
                                    <img src={entry.img} alt={entry.item.name} />
                                ) : (
                                    <div className={styles.emptySlot} />
                                )}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {filledItems.slice(3, 6).map((entry, idx) => (
                            <td key={`slot-bottom-${idx}`} className={styles.slot}>
                                {entry ? (
                                    <img src={entry.img} alt={entry.item.name} />
                                ) : (
                                    <div className={styles.emptySlot} />
                                )}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td colSpan={3} className={styles.wardSlot}>
                            <strong>Ward Slot:</strong>
                            <div>
                                {ward ? (
                                    <img src={ward.img} alt={ward.item.name} />
                                ) : (
                                    <div className={styles.emptyWardSlot} />
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
