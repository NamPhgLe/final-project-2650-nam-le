import React, { useEffect, useState } from 'react';
import championRegionRaw from '../../../data/champion_regions.json';

interface ChampionData {
  id: string;
  region: string;
}

const championRegionMap = championRegionRaw as Record<string, string>;

const LeagueOfLegendsPage: React.FC = () => {
  const [champions, setChampions] = useState<ChampionData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      .then((res) => res.json())
      .then((versions: string[]) => {
        const latest = versions[0];
        setVersion(latest);
        return fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`
        );
      })
      .then((res) => res.json())
      .then((data: any) => {
        const champList: ChampionData[] = Object.keys(data.data).map((key) => ({
          id: key,
          region: championRegionMap[key] || 'Unknown',
        }));
        setChampions(champList);
      })
      .catch(console.error);
  }, []);

  const splashUrl = (champId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_0.jpg`;

  const regions = Array.from(
    new Set(champions.map((champ) => champ.region).concat('All'))
  ).sort();

  const visibleChamps =
    selectedRegion === 'All'
      ? champions
      : champions.filter((champ) => champ.region === selectedRegion);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>
        League of Legends Simulator
      </h1>
      <p style={{ marginBottom: '2rem' }}>
        Click on a region tab to view its champions.
      </p>

      {/* Region Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor:
                region === selectedRegion ? '#c00000' : '#e0e0e0',
              color: region === selectedRegion ? '#fff' : '#000',
              transition: 'all 0.2s ease',
            }}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Champion Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {visibleChamps.map((champ) => (
          <div
            key={champ.id}
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
              }}
            >
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
                }}
              />
            </div>
            <div
              style={{
                padding: '0.75rem',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {champ.id}
              <br />
              <span style={{ fontSize: '0.875rem', color: '#777' }}>
                {champ.region}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueOfLegendsPage;
