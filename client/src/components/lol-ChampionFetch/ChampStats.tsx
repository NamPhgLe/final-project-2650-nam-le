import { useEffect, useState } from 'react';
import axios from 'axios';

interface ChampStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

interface ChampionDetail {
  id: string;
  key: string;
  name: string;
  title: string;
  stats: ChampStats;
}

export default function ChampionStats() {
  const [champion, setChampion] = useState<ChampionDetail | null>(null);

  useEffect(() => {
    const fetchChampionDetail = async () => {
      try {
        const res = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion/Aatrox.json'
        );
        setChampion(res.data.data.Aatrox);
      } catch (err) {
        console.error('Error fetching champion detail:', err);
      }
    };

    fetchChampionDetail();
  }, []);

  function calculateStatAtLevel(base: number, perLevel: number, level: number) {
    return base + perLevel * (level - 1);
  }

  if (!champion) {
    return <div>Loading champion data...</div>;
  }

  const levels = [1, 9, 18];

  return (
    <div>
      <h2>{champion.name} - {champion.title}</h2>
      {levels.map((level) => (
        <div key={level} style={{ marginBottom: '1.5em' }}>
          <h3>Level {level} Stats</h3>
          <ul>
            <li>HP: {calculateStatAtLevel(champion.stats.hp, champion.stats.hpperlevel, level).toFixed(0)}</li>
            <li>MP: {calculateStatAtLevel(champion.stats.mp, champion.stats.mpperlevel, level).toFixed(0)}</li>
            <li>Armor: {calculateStatAtLevel(champion.stats.armor, champion.stats.armorperlevel, level).toFixed(2)}</li>
            <li>Magic Resist: {calculateStatAtLevel(champion.stats.spellblock, champion.stats.spellblockperlevel, level).toFixed(2)}</li>
            <li>Attack Damage: {calculateStatAtLevel(champion.stats.attackdamage, champion.stats.attackdamageperlevel, level).toFixed(2)}</li>
            <li>Attack Speed: {(champion.stats.attackspeed * (1 + (champion.stats.attackspeedperlevel / 100) * (level -1))).toFixed(3)}</li>
            <li>Move Speed: {champion.stats.movespeed.toFixed(0)}</li>
            <li>HP Regen: {calculateStatAtLevel(champion.stats.hpregen, champion.stats.hpregenperlevel, level).toFixed(2)}</li>
            <li>MP Regen: {calculateStatAtLevel(champion.stats.mpregen, champion.stats.mpregenperlevel, level).toFixed(2)}</li>
            <li>Crit Chance: {calculateStatAtLevel(champion.stats.crit, champion.stats.critperlevel, level).toFixed(2)}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}
