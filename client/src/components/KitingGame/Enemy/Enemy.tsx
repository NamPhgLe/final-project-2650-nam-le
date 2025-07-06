import React from 'react';
import type { EnemyBase } from './enemyTypes';

interface EnemyProps {
  enemy: EnemyBase;
}

export function Enemy({ enemy }: EnemyProps) {
  let color = 'gray';
  if (enemy.type === 'boss') color = 'red';
  else if (enemy.type === 'mushroom') color = 'purple';

  return (
    <div
      style={{
        position: 'absolute',
        left: enemy.position.x - enemy.size / 2,
        top: enemy.position.y - enemy.size / 2,
        width: enemy.size,
        height: enemy.size,
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid black',
      }}
      title={`${enemy.type} HP: ${enemy.hp}`}
    />
  );
}
