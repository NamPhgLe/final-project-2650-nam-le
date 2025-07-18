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
import { drawPlayerStats } from '../Utils/drawPlayerStats';
import type { ItemData } from '../../../constants/itemData';

interface GameCanvasProps {
  width: number;
  height: number;
  rightClickDown: boolean;
  cursorPos: Position | null;
  onRightClick: (pos: Position, clickedEnemy: boolean) => void;
  onStopMove: () => void;
  stats: Record<string, number>;
  items: { item: ItemData; img: string }[];
  trinket?: { item: ItemData; img: string } | null;
  showAttackRangeCircle: boolean;
}

export function GameCanvas({
  width,
  height,
  rightClickDown,
  cursorPos,
  onRightClick,
  onStopMove,
  stats,
  items,
  trinket,
  showAttackRangeCircle  
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(new Image());
  const [bgLoaded, setBgLoaded] = useState(false);
  const scrollXRef = useRef(0);
  const scaledWidthRef = useRef(0);
  let attackRange = stats.attackRange;
  const playerSize = 50;
  const scrollSpeed = 2;
  const attackCooldown = 800;
  const lastAttackTimeRef = useRef(0);
  const playerImageRef = useRef<HTMLImageElement>(new Image());
  const mushroomImageRef = useRef<HTMLImageElement>(new Image());

  const {
    player,
    setPlayer,
    moveToward,
    setMoveTarget,
    setAttackTarget,
    applySlow,
  } = usePlayer({ x: 200, y: 200 }, stats);

  const {
    enemies,
    spawnBoss,
    spawnMushroom,
    damage,
    updateEnemies,
    killEnemy,
  } = useEnemy();

  const [maxHealth, setMaxHealth] = useState(player.stats.health);
  const [maxMana, setMaxMana] = useState(player.stats.mana);

  useEffect(() => {
    mushroomImageRef.current.src = mushroomSprite;
  }, []);

  useEffect(() => {
    playerImageRef.current.src = playerSprite;
  }, []);

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
    setMaxHealth(player.stats.health);
  }, []);

  useEffect(() => {
    setMaxMana(player.stats.mana);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const update = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      updateEnemies(deltaTime, width);
      handleCollisions();
      handlePlayerBehavior(now, deltaTime);

      scrollXRef.current = (scrollXRef.current + scrollSpeed) % (scaledWidthRef.current || width);
      draw();

      animationFrameId = requestAnimationFrame(update);
    };

    const handleCollisions = () => {
      enemies.forEach(enemy => {
        if (!enemy.alive) return;
        if (enemy.type !== 'mushroom') return;

        const distToPlayer = distance(enemy.position, player.position);
        const collision = distToPlayer < enemy.size / 2 + playerSize / 2;

        if (collision) {
          applySlow(enemy.slowDuration ?? 5000);
          setPlayer(prev => ({
            ...prev,
            stats: {
              ...prev.stats,
              health: Math.max(0, (prev.stats.health ?? 0) - 50),
            },
          }));
          killEnemy(enemy.id);
        }
      });
    };

    const handlePlayerBehavior = (now: number, deltaTime: number) => {
      const boss = enemies.find(e => e.type === 'boss' && e.alive);
      console.log(stats.attackRange)
      if (player.attackTarget === 'enemy' && boss) {
        attackRange = stats.attackRange ?? 100;
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
  }, [player, enemies, cursorPos, rightClickDown, bgLoaded, stats]);

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
      drawPlayerStats(ctx, player, 10, 20);
      drawPlayerSprite(ctx, playerImageRef.current, player.position, playerSize, now, {
      health: player.stats.health,
      mana: player.stats.mana,
      maxHealth,
      maxMana,  
      attackRange: stats.attackRange ?? 70,
    },  showAttackRangeCircle );


    const slotsPerRow = 5;
  const iconSize = 40;
  const padding = 8;
  const inventoryX = 10;
  let inventoryY = height - ((Math.ceil(items.length / slotsPerRow) + 1) * (iconSize + padding));

  let row = 0;
  let col = 0;

  items.slice(0, items.length).forEach(({ img }, index) => {
    const x = inventoryX + col * (iconSize + padding);
    const y = inventoryY + row * (iconSize + padding);
    const image = new Image();
    image.src = img;
    ctx.drawImage(image, x, y, iconSize, iconSize);

    col++;
    if (col >= slotsPerRow) {
      col = 0;
      row++;
    }
  });

  if (trinket) {
    const image = new Image();
    image.src = trinket.img;
    ctx.drawImage(image, inventoryX, inventoryY + row * (iconSize + padding), iconSize, iconSize);
  }
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
