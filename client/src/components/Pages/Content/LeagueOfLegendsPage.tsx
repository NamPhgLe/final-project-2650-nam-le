import React, { useEffect, useState } from 'react';
import championMetaRaw from '../../../data/champion_metadata.json';
type RawMeta = Record<string, { region: string; lane: string }>;
import styles from './LeaugeOfLegendsPage.module.css';
import ChampionStatsPage from './ChampionStatsPage';

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
  const [version, setVersion] = useState('');
  const [currentChampion, setCurrentChampion] = useState<string | null>(null);
  const [nextChampion, setNextChampion] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

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
        const list: ChampionData[] = Object.keys(data.data).map(key => {
          const meta = championMetaMap[key] ?? { region: 'Unknown', lane: 'All' };
          return {
            id: key,
            region: meta.region,
            lane: meta.lane
          };
        });
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

  const gridFlex = currentChampion ? '65%' : '100%';
  const panelFlex = '35%';

  return (
    <div style={{
      display: 'flex', height: '100vh',
      padding: '2rem', boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div
        style={{
          flex: `0 0 ${gridFlex}`,
          transition: 'flex-basis 0.3s ease',
          overflowY: 'auto'
        }}
      >
        <h1 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>
          League of Legends Simulator
        </h1>
        <p style={{ marginBottom: '1rem' }}>
          Region Filter:
        </p>
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {visibleChamps.map((champ, idx) => (
            <div
              key={champ.id}
              className={`${styles.slideInCard} ${styles.championCard}`}
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => openChampionStats(champ.id)}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                <img
                  src={splashUrl(champ.id)}
                  alt={`${champ.id} splash art`}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                padding: '0.75rem',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#000',
                userSelect: 'none'
              }}>
                {champ.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentChampion && (
        <div style={{
          flex: `0 0 ${panelFlex}`,
          marginLeft: '1rem',
          overflowY: 'auto'
        }}>
          <ChampionStatsPage
            championId={currentChampion}
            onClose={handlePanelClose}
            isClosing={isClosing}
          />
        </div>
      )}
    </div>
  );
};

export default LeagueOfLegendsPage;
