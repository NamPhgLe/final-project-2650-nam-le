import React, { useState } from 'react';
import { KitingGame } from './KitingGame';
import type { ItemData } from '../../../constants/itemData';

interface GameMenuProps {
  stats: Record<string, number>;
  itemStats: Record<string, number>;
  items: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
}

export function GameMenu({ stats, itemStats, items, trinket }: GameMenuProps) {
  const [started, setStarted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  if (started) {
    return (
      <KitingGame
        stats={stats}
        itemStats={itemStats}
        items={items}
        trinket={trinket}
      />
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>League-Style Kiting Game</h1>
      <button onClick={() => setStarted(true)} style={{ fontSize: '20px', padding: '10px 20px' }}>
        Start Game
      </button>
      <br /><br />
      <button onClick={() => setShowOptions(prev => !prev)} style={{ fontSize: '16px' }}>
        {showOptions ? 'Hide Options' : 'Options'}
      </button>

      {showOptions && (
        <div style={{ marginTop: '20px' }}>
          <h3>Game Options (Coming Soon)</h3>
          <p>Customize settings like difficulty, controls, and more.</p>
        </div>
      )}
    </div>
  );
}
