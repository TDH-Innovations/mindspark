import { 
  DailyChallenge, 
  GameUnion
} from '../types/game.types';
import { generateQuickTapGame } from '../data/quickTap';
import { generateWordChainGame } from '../data/wordChain';
import { generateColorMatchGame } from '../data/colorMatch';
import { generateNumberNinjasGame } from '../data/numberNinjas';
import { generateDailyGoals } from '../data/goals';

/**
 * Simple seeded random number generator
 * Uses the date string as a seed to ensure same games for same date
 */
export class SeededRandom {
  private seed: number;

  constructor(seedString: string) {
    this.seed = this.hashCode(seedString);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return formatDate(new Date());
};

/**
 * Check if a date string is today
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDate();
};

/**
 * Generate daily games based on the date
 * Uses date as seed to ensure consistency
 */
export const generateDailyGames = (dateString: string): DailyChallenge => {
  const random = new SeededRandom(dateString);

  // Generate all 5 games
  const quickTap = generateQuickTapGame(dateString, random);
  const wordChain = generateWordChainGame(dateString, random);
  const colorMatch = generateColorMatchGame(dateString, random);
  const numberNinjas = generateNumberNinjasGame(dateString, random);
  const dailyGoals = generateDailyGoals(dateString, random);

  const games: GameUnion[] = [quickTap, wordChain, colorMatch, numberNinjas, dailyGoals];

  return {
    date: dateString,
    games,
    completed: false,
    totalScore: 0,
  };
};

/**
 * Calculate score based on game completion and performance
 */
export const calculateGameScore = (game: GameUnion): number => {
  if (!game.completed || !game.score) return 0;
  return game.score;
};

/**
 * Calculate total challenge score
 */
export const calculateTotalScore = (challenge: DailyChallenge): number => {
  return challenge.games.reduce((total, game) => {
    return total + calculateGameScore(game);
  }, 0);
};

/**
 * Generate a random hex color
 */
export const generateRandomColor = (random: SeededRandom): string => {
  const r = random.nextInt(0, 255);
  const g = random.nextInt(0, 255);
  const b = random.nextInt(0, 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Create a slightly different color (for color match game)
 */
export const createSimilarColor = (hexColor: string, difference: number): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const newR = Math.max(0, Math.min(255, r + difference));
  const newG = Math.max(0, Math.min(255, g + difference));
  const newB = Math.max(0, Math.min(255, b + difference));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};
