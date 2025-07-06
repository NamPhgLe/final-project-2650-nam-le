export interface Position {
  x: number;
  y: number;
}

export function distance(a: Position, b: Position): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function isCollidingWithObstacle(
  pos: Position,
  obstacles: { position: Position; width: number; height: number }[],
  buffer = 0
): boolean {
  return obstacles.some(({ position, width, height }) => {
    return (
      pos.x + buffer > position.x &&
      pos.x - buffer < position.x + width &&
      pos.y + buffer > position.y &&
      pos.y - buffer < position.y + height
    );
  });
}