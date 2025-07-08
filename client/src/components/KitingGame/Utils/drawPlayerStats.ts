import type { PlayerState } from '../player/usePlayer';
import { statNameMap } from '../../../constants/statNameMap';

export function drawPlayerStats(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  x: number = 10,
  y: number = 20,
  fontSize: number = 14,
  lineHeight: number = 18
) {
  const effectiveSpeed = player.isSlowed
    ? (player.stats.moveSpeed || 150) * 0.5
    : (player.stats.moveSpeed || 150);


    const displayStats = {
        ...player.stats,
        moveSpeed: effectiveSpeed,
        critChance: player.stats.critChance ?? 0,
      };
    

  ctx.fillStyle = 'white';
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'left';

  for (const [label, value] of Object.entries(displayStats)) {
    ctx.fillText(`${label}: ${value}`, x, y);
    y += lineHeight;
  }
}
