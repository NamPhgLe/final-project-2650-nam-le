export type EnemyType = 'boss' | 'mushroom';

export interface Position {
  x: number;
  y: number;
}

export interface EnemyBase {
  id: string;
  type: EnemyType;
  position: Position;
  size: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  speed: number;
  direction?: 1 | -1; 
  slowDuration?: number;
  slowTimer?: number;
}
