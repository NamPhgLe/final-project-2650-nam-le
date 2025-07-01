
export function calculateLevelStat(base: number, perLevel: number, level: number): number {
  return base + perLevel * (level - 1);
}

export function calculateAttackSpeed(base: number, perLevel: number, level: number): number {
  return base * (1 + (perLevel / 100) * (level - 1));
}
