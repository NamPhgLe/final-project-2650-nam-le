import React, { useEffect, useState } from 'react';
interface BackgroundProps {
    width: number;
    height: number;
    speed?: number;
    imageUrl: string;
  }
  
  export function Background({ width, height, speed = 1, imageUrl }: BackgroundProps) {
    const [scrollX, setScrollX] = useState(0);
  
    useEffect(() => {
      let animationFrameId: number;
  
      const update = () => {
        setScrollX(x => (x + speed) % width);
        animationFrameId = requestAnimationFrame(update);
      };
  
      animationFrameId = requestAnimationFrame(update);
      return () => cancelAnimationFrame(animationFrameId);
    }, [speed, width]);
    
    return (
      <div
        style={{
          width,
          height,
          position: 'relative',
          top: 0,
          left: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundRepeat: 'repeat-x',
          backgroundPositionX: -scrollX,
          backgroundPositionY: 0,
          backgroundSize: 'auto 100%',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: -1,
        }}
      />
    );
  }
  