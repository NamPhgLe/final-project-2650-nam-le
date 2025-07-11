import React, { useState, useEffect } from 'react';
import ChampionSelector from './ChampSelector';
import LevelSelector from './ChampLevelSelector';
import type { ItemData } from '../../constants/itemData';
import { statNameMap } from '../../constants/statNameMap';
import { parseItemDescription } from '../../utils/parseItemDescription';
import { calculateLevelStat, calculateAttackSpeed } from '../../utils/champUtils';
import type { ChampionDetail } from '../../constants/champData';
import ChampionAbilities from './ChampAbilites';
// import {KitingGame} from '../Game/KitingGame';
import { KitingGame } from '../KitingGame/GameLoop/KitingGame'

interface CombinedStatsProps {
  level: number;
  items?: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
  version?: string | null;
}

function getStatName(statKey: string): string {
  return statNameMap[statKey] || statKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}
interface CombinedStatsProps {
  championId: string;
  items?: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
  version?: string | null;
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

export default function CombinedStats({ championId, items, trinket, version }: CombinedStatsProps) {
  const [selectedChamp, setSelectedChamp] = useState(championId);
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
    setSelectedChamp(championId);
  }, [championId]);

  useEffect(() => {
    async function fetchChampionDetail() {
      if (!version) return; 
      setLoading(true);
      try {
        const res = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${selectedChamp}.json`
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
  }, [selectedChamp, version]);

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
    baseStats.attackRange = s.attackrange;
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

      {loading && <p>Loading champion data...</p>}

      {!loading && championData && (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <h3>{championData.name} — {championData.title}</h3>
      <LevelSelector
        selectedLevel={selectedLevel}
        onChange={(newLevel) => setSelectedLevel(newLevel)}
        minLevel={1}
        maxLevel={18}
      />
    </div>
    
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

      {championData && version && (
        <ChampionAbilities championData={championData} version={version} />
      )}

      {/* {combinedStats && Object.keys(combinedStats).length > 0 ? (
        <KitingGame stats={combinedStats} itemStats={combinedItemStats} items={items || []} trinket={trinket} />
      ) : (
        <p>Loading stats...</p>
      )} */}
    </div>
  );
}
