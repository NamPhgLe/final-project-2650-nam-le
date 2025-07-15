import React, { useEffect, useState, useRef } from 'react';
import championMetaRaw from '../../../data/champion_metadata.json';
type RawMeta = Record<string, { region: string; lane: string }>;
import styles from './LeaugeOfLegendsPage.module.css';
import ChampionStatsPage from './ChampionStatsPage';
import { useInventory } from '../../../hooks/useInventory';
import type { ItemData } from '../../../constants/itemData';
import InventoryPage from './InventoryPage';
import NavBar from '../../Layout/NavBar';
type ItemMap = Record<string, ItemData>;

const championMetaMap = championMetaRaw as unknown as RawMeta;

interface ChampionData {
  id: string;
  region: string;
  lane: string;
}

const LANES = ['All', 'Top', 'Jungle', 'Mid', 'Bot', 'Support'] as const;
type Lane = typeof LANES[number];

const LeagueOfLegendsPage: React.FC = () => {
  const [champions, setChampions] = useState<ChampionData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<'All' | string>('All');
  const [selectedLane, setSelectedLane] = useState<Lane>('All');
  const [currentChampion, setCurrentChampion] = useState<string | null>(null);
  const [nextChampion, setNextChampion] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isHoveringScrollContainer, setIsHoveringScrollContainer] = useState(false);
  const [items, setItems] = useState<ItemMap | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [showInventory, setShowInventory] = useState(false);

  const { inventory, trinket, slotCount, addItem: handleBuyItem, removeItem, removeTrinket, increaseSlots, decreaseSlots } = useInventory();

  useEffect(() => {
    const loadItems = async () => {
      try {
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const latestVersion = versions[0];
        setVersion(latestVersion);

        const itemsRes = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`
        );
        const itemsData = await itemsRes.json();

        const rawItems: Record<string, ItemData> = itemsData.data;
        const itemMap: Record<string, ItemData> = {};

        Object.entries(rawItems).forEach(([id, item]) => {
          itemMap[id] = { ...item, id };
        });

        setItems(itemMap);
      } catch (error) {
        console.error('Failed to load items:', error);
      }
    };

    loadItems();
  }, []);
  useEffect(() => {
    fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(res => res.json())
      .then((versions: string[]) => {
        const latest = versions[0];
        setVersion(latest);
        return fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`
        );
      })
      .then(res => res.json())
      .then((data: any) => {
        const list: ChampionData[] = Object.keys(data.data)
          .map(key => {
            const meta = championMetaMap[key];
            if (!meta || meta.lane === 'Unknown') {
              console.log(`Filtered out: ${key}`, meta);
              return null;
            }
            return {
              id: key,
              region: meta.region,
              lane: meta.lane
            };
          })
          .filter((c): c is ChampionData => c !== null);
        setChampions(list);
      })
      .catch(console.error);
  }, []);

  const splashUrl = (c: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c}_0.jpg`;

  const regions = ['All', ...Array.from(new Set(champions.map(c => c.region)))].sort();

  const visibleChamps = champions
    .filter(c => selectedRegion === 'All' || c.region === selectedRegion)
    .filter(c => selectedLane === 'All' || c.lane === selectedLane);

  const openChampionStats = (champId: string) => {
    if (!currentChampion) {
      setCurrentChampion(champId);
    } else if (champId !== currentChampion) {
      setNextChampion(champId);
      setIsClosing(true);
    }
  };
  const handlePanelClose = () => {
    if (isClosing && nextChampion) {
      setCurrentChampion(nextChampion);
      setNextChampion(null);
      setIsClosing(false);
    } else {
      setCurrentChampion(null);
      setNextChampion(null);
      setIsClosing(false);
    }
  };

  const panelFlex = '35%';
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isHoveringScrollContainer) return;

      const { deltaX, deltaY } = e;
      const isVerticalScroll = Math.abs(deltaY) > Math.abs(deltaX);

      if (isVerticalScroll) {
        e.preventDefault();
        container.scrollLeft += deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isHoveringScrollContainer]);


  const CARD_WIDTH = 225;
  const CARD_HEIGHT = 150;

  const IMAGE_RATIO = 0.56;
  return (
    <>
      <div
        className={`${styles.leagueContainer} ${showInventory ? styles.slideUpOut : styles.slideReset
          }`}
      >

        <div style={{
          display: 'flex', height: '100vh',
          padding: '2rem', boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div
            style={{
              flex: `1`,
              transition: 'flex-basis 0.3s ease',
              overflowY: 'hidden',
            }}
          >
            
            <h1 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>
              League of Legends - Read About Champions
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={styles.slideInText}
                  style={{
                    animationDelay: '0ms',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: r === selectedRegion ? '#c00000' : '#e0e0e0',
                    color: r === selectedRegion ? '#fff' : '#000',
                    transition: 'all 0.2s'
                  }}
                >{r}</button>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              padding: '0 0.5rem',
              borderBottom: '2px solid #ddd'
            }}>
              {LANES.filter(l => l !== 'All').map(lane => (
                <button
                  key={lane}
                  onClick={() => setSelectedLane(lane)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    fontWeight: lane === selectedLane ? 700 : 400,
                    color: lane === selectedLane ? '#c00000' : '#555',
                    cursor: 'pointer',
                    borderBottom: lane === selectedLane ? '3px solid #c00000' : '3px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {lane}
                </button>
              ))}
            </div>
            <div
              key={`${selectedRegion}-${selectedLane}`}
              ref={scrollContainerRef}
              onMouseEnter={() => setIsHoveringScrollContainer(true)}
              onMouseLeave={() => setIsHoveringScrollContainer(false)}
              style={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridTemplateRows: `repeat(3, ${CARD_HEIGHT}px)`,
                gridAutoColumns: `${CARD_WIDTH}px`,
                gap: '1rem',
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingBottom: '1rem',
                scrollBehavior: 'smooth',
                flexGrow: 1,
                minHeight: 0,
              }}
            >
              {visibleChamps.map((champ, idx) => (
                <div
                  key={champ.id}
                  className={`${styles.slideInCard} ${styles.championCard}`}
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    width: `${CARD_WIDTH}px`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: `${CARD_HEIGHT}px`,
                  }}
                  onClick={() => openChampionStats(champ.id)}
                >
                  <div style={{ position: 'relative', width: '100%', paddingTop: `${IMAGE_RATIO * 100}%` }}>
                    <img
                      src={splashUrl(champ.id)}
                      alt={`${champ.id} splash art`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      padding: '0.3rem 0',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: '#000',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flexShrink: 0,
                    }}
                    title={champ.id}
                  >
                    {champ.id}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentChampion && items && version && (
            <div style={{ flex: `0 0 ${panelFlex}`, marginLeft: '1rem', overflowY: 'auto' }}>
              <ChampionStatsPage
                championId={currentChampion}
                onClose={handlePanelClose}
                isClosing={isClosing}
                items={inventory.map(({ item }) => item)}
                trinket={trinket ? trinket.item : null}
                level={level}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`${styles.inventoryContainer} ${showInventory ? styles.slideUpIn : styles.slideResetDown
          }`}
      >
        <InventoryPage isOpen={true} onClose={() => setShowInventory(false)} />
      </div>

      <button
        onClick={() => setShowInventory(prev => !prev)}
        className={styles.toggleButton}
      >
        {showInventory ? 'Close Inventory' : 'Open Inventory'}
      </button>
    </>
  );
};

export default LeagueOfLegendsPage;
