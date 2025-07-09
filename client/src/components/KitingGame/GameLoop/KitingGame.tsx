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

export function KitingGame({ stats, items, trinket }: KitingGameProps) {
  const gameWidth = 600;
  const gameHeight = 400;

  const [gameStarted, setGameStarted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [rightClickDown, setRightClickDown] = useState(false);
  const [cursorPos, setCursorPos] = useState<Position | null>(null);
  const [showAttackRangeCircle, setShowAttackRangeCircle] = useState(true);

  const handleRightClick = (pos: Position, clickedEnemy: boolean) => {
    setCursorPos(pos);
  };

  const handleStopMove = () => {
    setRightClickDown(false);
    setCursorPos(null);
  };

  if (!gameStarted) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1>League-Style Kiting Game</h1>
        <button
          onClick={() => setGameStarted(true)}
          style={{ padding: '12px 24px', fontSize: '18px', marginBottom: '12px' }}
        >
          Start Game
        </button>
        <br />
        <button
          onClick={() => setShowOptions(prev => !prev)}
          style={{ padding: '8px 16px', fontSize: '16px' }}
        >
          {showOptions ? 'Hide Options' : 'Options'}
        </button>

        {showOptions && (
          <div style={{ marginTop: '20px' }}>
            <h3>Options</h3>

            <div style={{ marginBottom: '12px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={audioEnabled}
                  onChange={() => setAudioEnabled(prev => !prev)}
                />{' '}
                Audio {audioEnabled ? 'On' : 'Off'}
              </label>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={showAttackRangeCircle}
                  onChange={() => setShowAttackRangeCircle(prev => !prev)}
                />{' '}
                Show Attack Range Circle
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3>Kiting Game (League-style)</h3>
      <label>
        <input
          type="checkbox"
          checked={showAttackRangeCircle}
          onChange={e => setShowAttackRangeCircle(e.target.checked)}
        />{' '}
        Show Attack Range
      </label>

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
          showAttackRangeCircle={showAttackRangeCircle}
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
