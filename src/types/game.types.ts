export type ObjectCategory = 'good' | 'bonus' | 'bad';

export interface GameObjectConfig {
  points: number;
  lives: number;
  category: ObjectCategory;
  combo?: number;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  type: string;
  width: number;
  height: number;
  speed: number;
  image: HTMLImageElement;
  config: GameObjectConfig;
}

export interface GameState {
  score: number;
  lives: number;
  maxLives: number;
  level: number;
  targetScore: number;
  comboCounter: number;
  comboMultiplier: number;
  lastCatchTime: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  victory: boolean;
}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  lifetime: number;
  maxLifetime: number;
}

export type GameScreen = 'intro' | 'menu' | 'playing' | 'levelTransition' | 'gameOver' | 'victory';

