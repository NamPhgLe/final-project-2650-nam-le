import type { Position } from '../Types/Position';

const frameWidth = 28;
const frameHeight = 28;
const totalFrames = 2;
const frameDuration = 300;

let frameIndex = 0;
let lastFrameTime = performance.now();

export function drawMushroomSprite(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  position: Position,
  size: number,
  now: number
) {
  if (now - lastFrameTime > frameDuration) {
    frameIndex = (frameIndex + 1) % totalFrames;
    lastFrameTime = now;
  }

  const halfSize = size / 2;

  ctx.save();

  ctx.translate(position.x - halfSize, position.y - halfSize);

  ctx.drawImage(
    sprite,
    frameIndex * frameWidth, 0,
    frameWidth, frameHeight,
    0, 0,
    size, size
  );

  ctx.restore();
}
