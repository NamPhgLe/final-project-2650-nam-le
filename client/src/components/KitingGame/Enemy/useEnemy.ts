import { useState } from 'react';
import type { Position } from '../Types/Position';

export type EnemyType = 'boss' | 'mushroom';

export interface Enemy {
  id: number;
  type: EnemyType;
  position: Position;
  size: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  speed?: number;
  slowTimer?: number;
  slowDuration?: number;
}

let enemyId = 0;

export function useEnemy() {
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  const spawnBoss = (pos: Position) => {
    setEnemies(prev => [
      ...prev,
      {
        id: ++enemyId,
        type: 'boss',
        position: pos,
        size: 100,
        hp: 100,
        maxHp: 100,
        alive: true,
      },
    ]);
  };

  const spawnMushroom = (pos: Position) => {
    setEnemies(prev => [
      ...prev,
      {
        id: ++enemyId,
        type: 'mushroom',
        position: pos,
        size: 40,
        hp: 1,
        maxHp: 1,
        alive: true,
        speed: 1,
        slowTimer: 0,
        slowDuration: 5000,
      },
    ]);
  };

  const updateEnemies = (delta: number, playerPos: Position, canvasWidth: number) => {
    setEnemies(prev =>
      prev.map(enemy => {
        if (!enemy.alive) return enemy;

        if (enemy.type === 'mushroom') {
          const newX = enemy.position.x + (enemy.speed ?? 0);
          const outOfBounds = newX > canvasWidth;

          const collidedWithPlayer =
            Math.hypot(newX - playerPos.x, enemy.position.y - playerPos.y) < enemy.size / 2 + 12;

          if (outOfBounds || collidedWithPlayer) {
            return { ...enemy, alive: false };
          }

          return {
            ...enemy,
            position: { ...enemy.position, x: newX },
          };
        }

        return enemy;
      }),
    );
  };

  const damage = (id: number, amount: number) => {
    setEnemies(prev =>
      prev.map(e =>
        e.id === id ? { ...e, hp: Math.max(0, e.hp - amount), alive: e.hp - amount > 0 } : e,
      ),
    );
  };

  return {
    enemies,
    spawnBoss,
    spawnMushroom,
    updateEnemies,
    damage,
  };
}
