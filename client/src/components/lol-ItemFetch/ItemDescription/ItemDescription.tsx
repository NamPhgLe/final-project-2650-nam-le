import React, { useMemo, useState } from 'react';
import ItemStats from '../ItemStats/ItemStats';
import styles from './ItemDescription.module.css';
import type { ItemData } from '../../../constants/ItemData';



interface ItemDescriptionProps {
    item: ItemData;
    items: Record<string, ItemData>;
    version: string;
    onSelectItem: (id: string) => void;
    img?: string;
    onBuyItem?: (item: ItemData, img: string) => void;
}

export default function ItemDescription({
    item,
    items,
    version,
    onSelectItem,
    img,
    onBuyItem,
}: ItemDescriptionProps) {

    const uniqueByName = (list: { id: string; data: ItemData }[]) => {
        const seen = new Set<string>();
        return list.filter(({ data }) => {
            if (seen.has(data.name)) return false;
            seen.add(data.name);
            return true;
        });
    };

    const findAllParents = (
        ids: string[],
        itemsMap: Record<string, ItemData>,
        collected = new Set<string>()
    ): string[] => {
        let newParents: string[] = [];

        for (const [id, item] of Object.entries(itemsMap)) {
            if (
                !collected.has(id) &&
                item.from &&
                item.from.some((f) => ids.includes(f))
            ) {
                newParents.push(id);
            }
        }

        if (newParents.length === 0) {
            return Array.from(collected);
        }

        newParents.forEach((p) => collected.add(p));

        return findAllParents(newParents, itemsMap, collected);
    };

    const directBuildsInto = (item.into ?? [])
        .filter((id) => items[id])
        .map((id) => ({ id, data: items[id] }));

    const safeFrom = Array.isArray(item.from) ? item.from : [];

    const requiredComponentsWithCount = useMemo(() => {
        const countMap: Record<string, number> = {};

        for (const id of safeFrom) {
            countMap[id] = (countMap[id] || 0) + 1;
        }

        return Object.entries(countMap)
            .filter(([id]) => items[id])
            .map(([id, count]) => ({
                id,
                count,
                data: items[id],
            }));
    }, [safeFrom, items]);

    const uniqueBuildsInto = uniqueByName(directBuildsInto);

    return (
        <div className={styles.detailsRow}>
            <div className={styles.statsColumn}>
                <div className={styles.itemStatsWrapper}>
                    <ItemStats
                        item={item}
                        img={img}
                    />
                </div>

                {uniqueBuildsInto.length > 0 && (
                    <div className={styles.buildsIntoSection}>
                        <h4 className={styles.sectionHeader}>Builds Into:</h4>
                        <div className={styles.buildsIntoGrid}>
                            {uniqueBuildsInto.map(({ id, data }) => (
                                <div
                                    key={id}
                                    onClick={() => onSelectItem(id)}
                                    className={styles.buildsIntoCard}
                                >
                                    <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                                        alt={data.name}
                                        className={styles.itemImage}
                                    />
                                    <div className={styles.itemName}>{data.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {requiredComponentsWithCount.length > 0 && (
                    <div className={styles.buildsIntoSection}>
                        <h4 className={styles.sectionHeader}>Required Components:</h4>
                        <div className={styles.buildsIntoGrid}>
                            {requiredComponentsWithCount.map(({ id, data, count }) => (
                                <div
                                    key={id}
                                    onClick={() => onSelectItem(id)}
                                    className={styles.buildsIntoCard}
                                >
                                    <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                                        alt={data.name}
                                        className={styles.itemImage}
                                    />
                                    <div className={styles.itemName}>
                                        {count > 1 ? `${count}× ` : ''}{data.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {img && onBuyItem && (
                    <div className={styles.buyButtonWrapper}>
                        <button
                            className={styles.buyButton}
                            onClick={() => onBuyItem(item, img)}
                        >
                            Buy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
