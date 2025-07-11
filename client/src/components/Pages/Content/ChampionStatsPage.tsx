import React, { useEffect } from 'react';
import styles from './ChampionStatsPage.module.css';
import CombinedStats from '../../lol-ChampFetch/CombineStats';
import type { ItemData } from '../../../constants/itemData';
import useLatestVersion from '../../../hooks/useLatestVersion';
interface ChampionStatsPageProps {
  championId: string;
  onClose: () => void;
  isClosing: boolean;
  items: ItemData[];
  trinket: ItemData | null;
  version: string;
}

const ChampionStatsPage: React.FC<ChampionStatsPageProps> = ({
  championId,
  onClose,
  isClosing,
  items,
  trinket,
}) => {
  const version = useLatestVersion(); // dynamically fetched

  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(onClose, 300);
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  if (!version) return <p>Loading version...</p>;

  return (
    <div className={`${styles.panel} ${isClosing ? styles.exit : ''}`}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close champion stats">
        ×
      </button>

      <h2 className={styles.title}>Stats for {championId}</h2>
      <CombinedStats
        championId={championId}
        items={items.map(item => ({
          item,
          img: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.id}.png`,
        }))}
        trinket={
          trinket
            ? {
                item: trinket,
                img: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${trinket.id}.png`,
              }
            : null
        }
        version={version}
      />
    </div>
  );
};

export default ChampionStatsPage;
