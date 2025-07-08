import { useState, useCallback, useEffect } from 'react';
import type { Position } from '../Types/Position';

export interface PlayerState {
  position: Position;
  moveTarget: Position | null;
  attackTarget: 'enemy' | null;
  isSlowed: boolean;
  stats: Record<string, number>;
}

export function usePlayer(initialPos: Position, incomingStats: Record<string, number>) {
  const [player, setPlayer] = useState<PlayerState>({
    position: initialPos,
    moveTarget: null,
    attackTarget: null,
    isSlowed: false,
    stats: incomingStats,
  });
  useEffect(() => {
    setPlayer(p => ({
      ...p,
      stats: incomingStats,
    }));
  }, [incomingStats]);
  
  
  const moveToward = useCallback((target: Position, deltaTimeMs: number) => {
    setPlayer(p => {
      const dx = target.x - p.position.x;
      const dy = target.y - p.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) return { ...p, position: target, moveTarget: null };

      const baseSpeed = p.stats.moveSpeed || 150;
      const actualSpeed = p.isSlowed ? baseSpeed * 0.5 : baseSpeed;
      const moveDistance = actualSpeed * (deltaTimeMs / 1000);
      if (moveDistance >= dist) return { ...p, position: target, moveTarget: null };

      return {
        ...p,
        position: {
          x: p.position.x + (dx / dist) * moveDistance,
          y: p.position.y + (dy / dist) * moveDistance,
        },
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
    setPlayer(p => ({ ...p, isSlowed: true }));
    setTimeout(() => {
      setPlayer(p => ({ ...p, isSlowed: false }));
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
