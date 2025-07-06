import React, { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../player/usePlayer';
import { useEnemy } from '../Enemy/useEnemy';
import { distance } from '../Utils/collisionUtils';
import type { Position } from '../Types/Position';
import { drawPlayerSprite } from '../Utils/drawPlayerSprite';
import { drawMushroomSprite } from '../Utils/drawMushroomSprite';
import mushroomSprite from '../assets/mushroom_sprite.png';
import playerSprite from '../assets/player_sprite.png';
import bgScroll from '../assets/bg_scroll.jpg';

interface GameCanvasProps {
  width: number;
  height: number;
  attackRange: number;
  rightClickDown: boolean;
  cursorPos: Position | null;
  onRightClick: (pos: Position, clickedEnemy: boolean) => void;
  onStopMove: () => void;
}

export function GameCanvas({
  width,
  height,
  attackRange,
  rightClickDown,
  cursorPos,
  onRightClick,
  onStopMove,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(new Image());
  const [bgLoaded, setBgLoaded] = useState(false);
  const scrollXRef = useRef(0);
  const scaledWidthRef = useRef(0);

  const playerSize = 50;
  const scrollSpeed = 2;
  const attackCooldown = 800;
  const lastAttackTimeRef = useRef(0);
  const playerImageRef = useRef<HTMLImageElement>(new Image());
  const mushroomImageRef = useRef<HTMLImageElement>(new Image());
  useEffect(() => {
    mushroomImageRef.current.src = mushroomSprite;
  }, []);
  useEffect(() => {
    playerImageRef.current.src = playerSprite;
  }, []);
  const {
    player,
    setPlayer,
    moveToward,
    setMoveTarget,
    setAttackTarget,
    applySlow,
  } = usePlayer({ x: 200, y: 200 });

  const {
    enemies,
    spawnBoss,
    spawnMushroom,
    damage,
    updateEnemies,
  } = useEnemy();

  useEffect(() => {
    const img = bgImageRef.current;
    img.src = bgScroll;
    img.onload = () => {
      setBgLoaded(true);
      const scale = height / img.height;
      scaledWidthRef.current = img.width * scale;
    };
  }, [height]);

  useEffect(() => {
    spawnBoss({ x: width - 50, y: height / 2 });
    spawnMushroom({ x: 100, y: height / 2 + 50 });
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const update = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      lastTime = now;
    
      updateEnemies(deltaTime, player.position, width);
      checkMushroomCollisions();
      handlePlayerBehavior(now, deltaTime);
    
      scrollXRef.current = (scrollXRef.current + scrollSpeed) % (scaledWidthRef.current || width);
      draw();
    
      animationFrameId = requestAnimationFrame(update);
    };
    
    const handlePlayerBehavior = (now: number, deltaTime: number) => {
      const boss = enemies.find(e => e.type === 'boss' && e.alive);
    
      if (player.attackTarget === 'enemy' && boss) {
        const distToBoss = distance(player.position, boss.position);
        const inRange = distToBoss <= attackRange + playerSize / 2 + boss.size / 2;
    
        if (!inRange) {
          moveToward(boss.position, deltaTime);
        } else if (now - lastAttackTimeRef.current >= attackCooldown) {
          damage(boss.id, 10);
          lastAttackTimeRef.current = now;
        }
    
        if (!boss.alive) {
          setAttackTarget(null);
        }
        return;
      }
    
      if (rightClickDown && cursorPos) {
        moveToward(cursorPos, deltaTime);
      } else if (player.moveTarget) {
        moveToward(player.moveTarget, deltaTime);
      }
    };
    

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [player, enemies, cursorPos, rightClickDown, bgLoaded]);

  const checkMushroomCollisions = () => {
    enemies.forEach(enemy => {
      if (enemy.type === 'mushroom' && enemy.alive) {
        const dist = distance(player.position, enemy.position);
        if (dist < (playerSize + enemy.size) / 2 && enemy.slowTimer === 0) {
          applySlow(enemy.slowDuration ?? 0);
          enemy.slowTimer = enemy.slowDuration ?? 0;
        }
      }
    });
  };



  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !bgLoaded) return;

    ctx.clearRect(0, 0, width, height);

    const scaledWidth = scaledWidthRef.current;
    const numImages = Math.ceil(width / scaledWidth) + 1;
    for (let i = 0; i < numImages; i++) {
      const x = i * scaledWidth - scrollXRef.current;
      ctx.drawImage(bgImageRef.current, x, 0, scaledWidth, height);
    }

    enemies.forEach(enemy => {
      if (!enemy.alive) return;
    
      if (enemy.type === 'mushroom') {
        drawMushroomSprite(ctx, mushroomImageRef.current, enemy.position, enemy.size, performance.now());
      } else {
        ctx.fillStyle = enemy.type === 'boss' ? 'red' : 'purple';
        ctx.beginPath();
        ctx.arc(enemy.position.x, enemy.position.y, enemy.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    
      ctx.fillStyle = 'black';
      ctx.fillRect(enemy.position.x - enemy.size / 2, enemy.position.y - enemy.size / 2 - 10, enemy.size, 5);
      ctx.fillStyle = 'green';
      ctx.fillRect(enemy.position.x - enemy.size / 2, enemy.position.y - enemy.size / 2 - 10, enemy.size * (enemy.hp / enemy.maxHp), 5);
    });
    const now = performance.now();
    drawPlayerSprite(ctx, playerImageRef.current, player.position, playerSize, attackRange, now);    

    ctx.strokeStyle = 'rgba(0,0,255,0.5)';
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, attackRange, 0, Math.PI * 2);
    ctx.stroke();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const clickPos: Position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const boss = enemies.find(e => e.type === 'boss' && e.alive);
    const clickedEnemy = boss && distance(clickPos, boss.position) <= boss.size / 2;

    onRightClick(clickPos, !!clickedEnemy);
    setAttackTarget(clickedEnemy ? 'enemy' : null);
    setMoveTarget(clickedEnemy ? boss!.position : clickPos);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      onStopMove();
      setMoveTarget(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '1px solid #ccc',
        cursor: 'crosshair',
        userSelect: 'none',
        display: 'block',
      }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
}