// Game Types
export type GameType = 'quick-tap' | 'word-chain' | 'color-match' | 'number-ninjas' | 'daily-goals';

export interface Game {
  id: string;
  type: GameType;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  score?: number;
  emoji: string;
}

// Quick Tap Challenge - Memory sequence game
export interface QuickTapGame extends Game {
  type: 'quick-tap';
  sequence: number[]; // Array of button positions (0-8 for a 3x3 grid)
  currentStep: number;
  mistakes: number;
  timeLimit: number; // seconds
  comboMultiplier: number;
}

// Word Chain - Swipe letters to make words
export interface WordChainGame extends Game {
  type: 'word-chain';
  letters: string[]; // 9-12 random letters
  foundWords: string[];
  minWordLength: number;
  timeLimit: number; // seconds
  possibleWords: string[]; // All valid words for this set
}

// Color Match - Find the odd color out
export interface ColorMatchGame extends Game {
  type: 'color-match';
  rounds: ColorRound[];
  currentRound: number;
  streak: number;
  timeLimit: number; // Total time for all rounds
}

export interface ColorRound {
  gridSize: number; // 3x3, 4x4, 5x5
  baseColor: string; // RGB hex
  differentColor: string; // RGB hex (slightly different)
  differentPosition: number; // Index of the different color
  completed: boolean;
  timeToComplete?: number;
}

// Number Ninjas - Quick mental math
export interface NumberNinjasGame extends Game {
  type: 'number-ninjas';
  problems: MathProblem[];
  currentProblem: number;
  streak: number;
  timeLimit: number; // seconds per problem
  lives: number;
}

export interface MathProblem {
  num1: number;
  num2: number;
  operation: '+' | '-' | '×' | '÷';
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

// Daily Goals - Set intentions
export interface DailyGoalsGame extends Game {
  type: 'daily-goals';
  goals: Goal[];
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category: 'health' | 'productivity' | 'learning' | 'social' | 'creative';
}

export type GameUnion = QuickTapGame | WordChainGame | ColorMatchGame | NumberNinjasGame | DailyGoalsGame;

export interface DailyChallenge {
  date: string; // YYYY-MM-DD format
  games: GameUnion[];
  completed: boolean;
  totalScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  requirement: number;
  progress: number;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  gamesCompleted: {
    'quick-tap': number;
    'word-chain': number;
    'color-match': number;
    'number-ninjas': number;
    'daily-goals': number;
  };
  highScores: {
    'quick-tap': number;
    'word-chain': number;
    'color-match': number;
    'number-ninjas': number;
  };
  achievements: Achievement[];
  lastPlayedDate: string;
}

// UI Animation Types
export interface ParticleEffect {
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  lifetime: number;
}

export interface ComboAnimation {
  count: number;
  multiplier: number;
  position: { x: number; y: number };
  timestamp: number;
}
