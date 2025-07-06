import React from 'react';

import type { Position } from './Types/Position';

interface AttackRangeIndicatorProps {
  position: Position;
  range: number;
}

export function AttackRangeIndicator({ position, range }: AttackRangeIndicatorProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x - range,
        top: position.y - range,
        width: range * 2,
        height: range * 2,
        borderRadius: '50%',
        border: '1px dashed blue',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}
