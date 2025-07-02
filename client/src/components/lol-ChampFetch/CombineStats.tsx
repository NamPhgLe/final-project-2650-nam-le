import React, { useState, useEffect } from 'react';
import ChampionSelector from './ChampSelector';
import LevelSelector from './ChampLevelSelector';
import type { ItemData } from '../../constants/itemData';
import { statNameMap } from '../../constants/statNameMap';
import { parseItemDescription } from '../../utils/parseItemDescription';
import { calculateLevelStat, calculateAttackSpeed } from '../../utils/champUtils';
import type { ChampionDetail } from '../../constants/champData';

interface CombinedStatsProps {
  items?: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
}

function getStatName(statKey: string): string {
  return statNameMap[statKey] || statKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

const renameMap: Record<string, string> = {
    hp: 'health',
    mp: 'mana',
    hpregen: 'healthRegen',      
    mpregen: 'manaRegen',     
    armor: 'armor',
    spellblock: 'magicResist',
    attackdamage: 'attackDamage',
    attackspeed: 'attackSpeed',
    movespeed: 'moveSpeed',     
    crit: 'critChance',         
  }
  

  function renameStatKey(key: string): string {
    return renameMap[key] || key;
  }

export default function CombinedStats({ items, trinket }: CombinedStatsProps) {
  const [championList, setChampionList] = useState<Record<string, string>>({});
  const [selectedChamp, setSelectedChamp] = useState('Aatrox');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [championData, setChampionData] = useState<ChampionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const combinedItemStats = React.useMemo(() => {
    const totalStats: Record<string, number> = {};
  
    if (items) {
      for (const { item } of items) {
        if (!item.description) continue;
        const stats = parseItemDescription(item.description);
        for (const [key, value] of Object.entries(stats)) {
          const renamedKey = renameStatKey(key); 
          totalStats[renamedKey] = (totalStats[renamedKey] || 0) + value;
        }
      }
    }
  
    if (trinket?.item?.description) {
      const trinketStats = parseItemDescription(trinket.item.description);
      for (const [key, value] of Object.entries(trinketStats)) {
        const renamedKey = renameStatKey(key); 
        totalStats[renamedKey] = (totalStats[renamedKey] || 0) + value;
      }
    }
  
    return totalStats;
  }, [items, trinket]);
  

  useEffect(() => {
    async function fetchChampionList() {
      try {
        const res = await fetch(
          'https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json'
        );
        const data = await res.json();
        const champMap: Record<string, string> = {};
        Object.keys(data.data).forEach((key) => {
          champMap[key] = data.data[key].name;
        });
        setChampionList(champMap);
      } catch (err) {
        console.error('Failed to fetch champion list', err);
      }
    }
    fetchChampionList();
  }, []);

  useEffect(() => {
    async function fetchChampionDetail() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion/${selectedChamp}.json`
        );
        const data = await res.json();
        setChampionData(data.data[selectedChamp]);
      } catch (err) {
        console.error('Failed to fetch champion data', err);
      } finally {
        setLoading(false);
      }
    }
    if (selectedChamp) fetchChampionDetail();
  }, [selectedChamp]);

  const baseStats: Record<string, number> = {};
  if (championData) {
    const s = championData.stats;
    baseStats.hp = calculateLevelStat(s.hp, s.hpperlevel, selectedLevel);
    baseStats.mp = calculateLevelStat(s.mp, s.mpperlevel, selectedLevel);
    baseStats.armor = calculateLevelStat(s.armor, s.armorperlevel, selectedLevel);
    baseStats.spellblock = calculateLevelStat(s.spellblock, s.spellblockperlevel, selectedLevel);
    baseStats.attackdamage = calculateLevelStat(s.attackdamage, s.attackdamageperlevel, selectedLevel);
    baseStats.attackspeed = calculateAttackSpeed(s.attackspeed, s.attackspeedperlevel, selectedLevel);
    baseStats.movespeed = s.movespeed;
    baseStats.hpregen = calculateLevelStat(s.hpregen, s.hpregenperlevel, selectedLevel);
    baseStats.mpregen = calculateLevelStat(s.mpregen, s.mpregenperlevel, selectedLevel);
    baseStats.crit = calculateLevelStat(s.crit, s.critperlevel, selectedLevel);
  }
  const baseStatsRenamed: Record<string, number> = {};
  for (const [key, value] of Object.entries(baseStats)) {
    baseStatsRenamed[renameStatKey(key)] = value;
  }
  const combinedStats: Record<string, number> = { ...baseStatsRenamed };
  for (const [key, val] of Object.entries(combinedItemStats)) {
    const renamedKey = renameStatKey(key);
    combinedStats[renamedKey] = (combinedStats[renamedKey] || 0) + val;
  }

  
  return (
    <div>
      <h2>Champion and Inventory Combined Stats</h2>

      {Object.keys(championList).length > 0 && (
        <div style={{ marginBottom: '1em' }}>
          <ChampionSelector
            championList={championList}
            selectedChampion={selectedChamp}
            onChange={setSelectedChamp}
          />
          <LevelSelector
            selectedLevel={selectedLevel}
            onChange={setSelectedLevel}
          />
        </div>
      )}

      {loading && <p>Loading champion data...</p>}

      {!loading && championData && (
        <>
          <h3>{championData.name} — {championData.title} (Level {selectedLevel})</h3>
          <ul>
            {Object.entries(combinedStats).map(([statKey, value]) => (
              <li key={statKey}>
                <strong>{getStatName(statKey)}:</strong> {value.toFixed(2)}
                {baseStats[statKey] !== undefined && combinedItemStats[statKey] !== undefined && (
                  <span style={{ fontSize: '0.9em', color: '#666' }}>
                    {' '}
                    (Base: {baseStats[statKey].toFixed(2)} + Items: {combinedItemStats[statKey].toFixed(2)})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
