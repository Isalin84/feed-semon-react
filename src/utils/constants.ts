import type { GameObjectConfig } from '../types/game.types';

export const GAME_CONFIG = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
  PLAYER_WIDTH: 100,
  PLAYER_HEIGHT: 150,
  OBJECT_SIZE: 70,
  PLAYER_SPEED: 10,
  INITIAL_OBJECT_SPEED: 3,
  MAX_OBJECTS: 3,
  SPAWN_DELAY: 50,
  COMBO_TIMEOUT: 2000,
  INITIAL_LIVES: 5,
  MAX_LIVES: 8,
  LEVEL_1_TARGET: 50,
  LEVEL_2_TARGET: 150,
  LEVEL_3_TARGET: 250,
  FPS: 60,
};

export const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GREEN: '#00C800',
  RED: '#FF0000',
  BLUE: '#0064FF',
  ORANGE: '#FFA500',
  COMBO_GOLD: '#FFD700',
  LIGHT_GRAY: '#E6E6E6',
  PINK: '#FF69B4',
  PURPLE: '#9B59B6',
};

export const OBJECT_CONFIGS: Record<string, GameObjectConfig> = {
  dill: { points: 5, lives: 0, category: 'good' },
  carrot: { points: 2, lives: 0, category: 'good' },
  zucchini: { points: 3, lives: 0, category: 'good' },
  pepper: { points: 10, lives: 0, category: 'bonus', combo: 2 },
  heart: { points: 0, lives: 1, category: 'bonus' },
  stone: { points: -10, lives: -2, category: 'bad' },
  chocolate: { points: -5, lives: -1, category: 'bad' },
};

export const SPAWN_PROBABILITIES = {
  GOOD: 0.50,
  BONUS: 0.65,
  BAD: 1.0,
};

const baseUrl = import.meta.env.BASE_URL;

export const OBJECT_IMAGES: Record<string, string> = {
  dill: `${baseUrl}assets/images/dill.png`,
  carrot: `${baseUrl}assets/images/carrot.png`,
  zucchini: `${baseUrl}assets/images/zucchini.png`,
  pepper: `${baseUrl}assets/images/pepper.png`,
  heart: `${baseUrl}assets/images/heart_bonus.png`,
  stone: `${baseUrl}assets/images/stone.png`,
  chocolate: `${baseUrl}assets/images/chocolate.png`,
};

