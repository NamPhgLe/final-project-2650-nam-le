import React, { useState } from 'react';
import { GameCanvas } from './GameCanvas';
import type { Position } from '../Types/Position';
import type { ItemData } from '../../../constants/itemData';
interface KitingGameProps {
  stats: Record<string, number>;
  itemStats: Record<string, number>;
  items: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
}

export function KitingGame({stats, itemStats, items, trinket}: KitingGameProps) {
  const gameWidth = 600;
  const gameHeight = 400;

  const [attackRange, setAttackRange] = useState(70);
  const [rightClickDown, setRightClickDown] = useState(false);
  const [cursorPos, setCursorPos] = useState<Position | null>(null);

  const handleRightClick = (pos: Position, clickedEnemy: boolean) => {
    setCursorPos(pos);
  };

  const handleStopMove = () => {
    setRightClickDown(false);
    setCursorPos(null);
  };

  return (
    <div>
      <h3>Kiting Game (League-style)</h3>

      <div style={{ margin: '8px 0' }}>
        <label>
          Attack Range: {attackRange}px
          <input type="range" min={10} max={200} value={attackRange} onChange={e => setAttackRange(Number(e.target.value))} />
        </label>
      </div>

      <div
        onMouseDown={e => e.button === 2 && setRightClickDown(true)}
        onMouseUp={e => e.button === 2 && setRightClickDown(false)}
        style={{ width: gameWidth, height: gameHeight, userSelect: 'none' }}
        onMouseMove={e => {
          if (rightClickDown) {
            const rect = e.currentTarget.getBoundingClientRect();
            setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }
        }}
      >
        <GameCanvas
          width={gameWidth}
          height={gameHeight}
          attackRange={attackRange}
          rightClickDown={rightClickDown}
          cursorPos={cursorPos}
          onRightClick={handleRightClick}
          onStopMove={handleStopMove}
          stats={stats}
          items={items}
          trinket={trinket}
        />
      </div>
    </div>
  );
}
