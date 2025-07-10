import React, { useEffect, useState } from 'react';
import championRegionRaw from '../../../data/champion_regions.json';
import styles from './LeaugeOfLegendsPage.module.css';

interface ChampionData { id: string; region: string; }
const championRegionMap = championRegionRaw as Record<string, string>;

const LeagueOfLegendsPage: React.FC = () => {
  const [champions, setChampions] = useState<ChampionData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [version, setVersion] = useState('');

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
        const list = Object.keys(data.data).map(key => ({
          id: key,
          region: championRegionMap[key] || 'Unknown',
        }));
        setChampions(list);
      })
      .catch(console.error);
  }, []);

  const splashUrl = (champId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_0.jpg`;

  const regions = Array.from(
    new Set(champions.map(c => c.region).concat('All'))
  ).sort();

  const visible = selectedRegion === 'All'
    ? champions
    : champions.filter(c => c.region === selectedRegion);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>League of Legends Simulator</h1>
      <p className={styles.subtitle}>
        Click on a region tab to view its champions.
      </p>

      <div className={styles.regionTabs}>
        {regions.map((region, idx) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`
              ${styles.regionButton}
              ${region === selectedRegion ? 'active' : ''}
            `}
            style={{ '--delay': `${idx * 100}ms` } as React.CSSProperties}
          >
            {region}
          </button>
        ))}
      </div>

      <div className={styles.gridContainer}>
        {visible.map((champ, idx) => (
          <div
            key={champ.id}
            className={`
              ${styles.slideInCard}
              ${styles.championCard}
            `}
            style={{ '--delay': `${idx * 100}ms` } as React.CSSProperties}
          >
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
              <img
                src={splashUrl(champ.id)}
                alt={`${champ.id} splash art`}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, fontSize: '1rem' }}>
              {champ.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueOfLegendsPage;
