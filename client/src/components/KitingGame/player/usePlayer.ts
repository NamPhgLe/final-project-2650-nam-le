import { useState, useCallback } from 'react';
import type { Position } from '../Types/Position';

interface PlayerState {
  position: Position;
  moveTarget: Position | null;
  attackTarget: 'enemy' | null;
  speed: number;

}

export function usePlayer(initialPos: Position) {
  const [player, setPlayer] = useState<PlayerState>({
    position: initialPos,
    moveTarget: null,
    attackTarget: null,
    speed: 150,
  });

  const moveToward = useCallback((target: Position, deltaTimeMs: number) => {
    setPlayer(p => {
      const dx = target.x - p.position.x;
      const dy = target.y - p.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) {
        return { ...p, position: target, moveTarget: null };
      }

      const moveDistance = p.speed * (deltaTimeMs / 1000);
      if (moveDistance >= dist) {
        return { ...p, position: target, moveTarget: null };
      }

      const moveX = (dx / dist) * moveDistance;
      const moveY = (dy / dist) * moveDistance;

      return {
        ...p,
        position: { x: p.position.x + moveX, y: p.position.y + moveY },
        moveTarget: target,
      };
    });
  }, []);

  const setMoveTarget = useCallback((pos: Position | null) => {
    setPlayer(p => ({ ...p, moveTarget: pos }));
  }, []);

  const setAttackTarget = useCallback((target: 'enemy' | null) => {
    setPlayer(p => ({ ...p, attackTarget: target }));
  }, []);

  const applySlow = useCallback((durationMs: number) => {
    setPlayer(p => ({ ...p, speed: p.speed * 0.5 }));
    setTimeout(() => {
      setPlayer(p => ({ ...p, speed: 150 })); 
    }, durationMs);
  }, []);

  return {
    player,
    setPlayer,
    moveToward,
    setMoveTarget,
    setAttackTarget,
    applySlow,
  };
}
