import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChampionSelector from './ChampSelector';
import LevelSelector from './ChampLevelSelector';
import type { ChampionDetail, ChampStats } from '../../constants/champData';
import { calculateLevelStat, calculateAttackSpeed } from '../../utils/champUtils';
import { statNameMap } from '../../constants/statNameMap';

export default function ChampionStats() {
  const [championList, setChampionList] = useState<Record<string, string>>({});
  const [selectedChampion, setSelectedChampion] = useState('Aatrox');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [championData, setChampionData] = useState<ChampionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json')
      .then(res => {
        const data = res.data.data;
        const list: Record<string, string> = {};
        Object.entries(data).forEach(([id, champ]: any) => {
          list[id] = champ.name;
        });
        setChampionList(list);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedChampion) return;
    setLoading(true);
    axios.get(`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion/${selectedChampion}.json`)
      .then(res => setChampionData(res.data.data[selectedChampion]))
      .catch(err => {
        console.error(err);
        setChampionData(null);
      })
      .finally(() => setLoading(false));
  }, [selectedChampion]);

  const renderStats = () => {
    if (!championData) return null;
    const s = championData.stats;
    const statsToShow: (keyof ChampStats)[] = [
      'hp', 'mp', 'armor', 'spellblock', 'attackdamage', 'attackspeed',
      'movespeed', 'hpregen', 'mpregen', 'crit'
    ];

    return statsToShow.map((key) => {
      let value: number;
      if (key === 'attackspeed') {
        value = calculateAttackSpeed(s.attackspeed, s.attackspeedperlevel, selectedLevel);
      } else {
        const perLevel = s[`${key}perlevel` as keyof ChampStats] ?? 0;
        value = calculateLevelStat(s[key], perLevel, selectedLevel);
      }
      return (
        <li key={key}>
          {statNameMap[key] ?? key}: {value.toFixed(2)}
        </li>
      );
    });
  };

  return (
    <div>
      <h1>Champion Stats</h1>
      <ChampionSelector championList={championList} selectedChampion={selectedChampion} onChange={setSelectedChampion} />
      <LevelSelector selectedLevel={selectedLevel} onChange={setSelectedLevel} />
      {loading ? <p>Loading champion...</p> : (
        championData && (
          <div style={{ marginTop: '1em' }}>
            <h2>{championData.name} — {championData.title}</h2>
            <ul>{renderStats()}</ul>
          </div>
        )
      )}
    </div>
  );
}
