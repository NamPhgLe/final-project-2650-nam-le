import type { Position } from '../Types/Position';

const frameWidth = 28;
const frameHeight = 28;
const totalFrames = 2;
const frameDuration = 200; 

let frameIndex = 0;
let lastFrameTime = performance.now();
let lastX = 0;

export function drawPlayerSprite(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  position: Position,
  size: number,
  now: number,
  stats: { health: number; mana: number; maxHealth: number; maxMana: number; attackRange?: number},
  showAttackRangeCircle: boolean,  
) {
  if (now - lastFrameTime > frameDuration) {
    frameIndex = (frameIndex + 1) % totalFrames;
    lastFrameTime = now;
  }
  const attackRange = stats.attackRange ?? 100;
  const movingLeft = position.x < lastX;
  lastX = position.x;

  const halfSize = size / 2;

  ctx.save();

  if (movingLeft) {
    ctx.translate(position.x + halfSize, position.y - halfSize);
    ctx.scale(-1, 1); 
  } else {
    ctx.translate(position.x - halfSize, position.y - halfSize);
  }

  ctx.drawImage(
    sprite,
    frameIndex * frameWidth, 0,         
    frameWidth, frameHeight,             
    0, 0,                                
    size, size                         
  );

  ctx.restore();
  if (showAttackRangeCircle) {
    ctx.strokeStyle = 'rgba(0,0,255,0.5)';
    ctx.beginPath();
    ctx.arc(position.x, position.y, attackRange, 0, Math.PI * 2);
    ctx.stroke();
  }

  const healthBarWidth = size;
  const healthBarHeight = 8;
  const healthBarX = position.x - healthBarWidth / 2;
  const healthBarY = position.y - size / 2 - 20;

  ctx.fillStyle = 'black';
  ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

  const healthPercent = Math.max(0, stats.health / stats.maxHealth);
  ctx.fillStyle = 'limegreen';
  ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);

  const manaBarY = healthBarY + healthBarHeight + 4;
  ctx.fillStyle = 'black';
  ctx.fillRect(healthBarX, manaBarY, healthBarWidth, healthBarHeight);

  const manaPercent = Math.max(0, stats.mana / stats.maxMana);
  ctx.fillStyle = 'deepskyblue';
  ctx.fillRect(healthBarX, manaBarY, healthBarWidth * manaPercent, healthBarHeight);

  ctx.fillStyle = 'white';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${stats.health} / ${stats.maxHealth}`, position.x, healthBarY + healthBarHeight / 2);
  ctx.fillText(`${stats.mana} / ${stats.maxMana}`, position.x, manaBarY + healthBarHeight / 2);
}
