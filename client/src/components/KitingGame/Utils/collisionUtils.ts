export interface Position {
  x: number;
  y: number;
}

export function distance(a: Position, b: Position): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}


export function isCircleColliding(a: Position, aRadius: number, b: Position, bRadius: number) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distSq = dx * dx + dy * dy;
  const radiusSum = aRadius + bRadius;
  return distSq <= radiusSum * radiusSum;
}