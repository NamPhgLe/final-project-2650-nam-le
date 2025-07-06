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
  attackRange: number,
  now: number
) {
  if (now - lastFrameTime > frameDuration) {
    frameIndex = (frameIndex + 1) % totalFrames;
    lastFrameTime = now;
  }

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

  ctx.strokeStyle = 'rgba(0,0,255,0.5)';
  ctx.beginPath();
  ctx.arc(position.x, position.y, attackRange, 0, Math.PI * 2);
  ctx.stroke();
}
