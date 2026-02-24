import { ColorMatchGame, ColorRound } from '../types/game.types';
import { SeededRandom, generateRandomColor, createSimilarColor } from '../utils/gameGenerator';

/**
 * Generate Color Match game
 * Player finds the slightly different colored square
 */
export const generateColorMatchGame = (
  dateString: string,
  random: SeededRandom
): ColorMatchGame => {
  
  // Determine difficulty
  const difficultyRoll = random.nextInt(1, 3);
  let roundCount: number;
  let difficulty: 'easy' | 'medium' | 'hard';
  let timeLimit: number;
  let colorDifference: number; // How different the odd color is

  if (difficultyRoll === 1) {
    roundCount = 5;
    difficulty = 'easy';
    timeLimit = 60;
    colorDifference = 40; // More noticeable
  } else if (difficultyRoll === 2) {
    roundCount = 7;
    difficulty = 'medium';
    timeLimit = 50;
    colorDifference = 25; // Moderate
  } else {
    roundCount = 10;
    difficulty = 'hard';
    timeLimit = 45;
    colorDifference = 15; // Subtle
  }

  // Generate rounds with increasing difficulty
  const rounds: ColorRound[] = [];
  
  for (let i = 0; i < roundCount; i++) {
    let gridSize: number;
    
    // Grid size increases with rounds
    if (i < 2) {
      gridSize = 3; // 3x3 = 9 squares
    } else if (i < 5) {
      gridSize = 4; // 4x4 = 16 squares
    } else {
      gridSize = 5; // 5x5 = 25 squares
    }

    const baseColor = generateRandomColor(random);
    const differentColor = createSimilarColor(baseColor, colorDifference);
    const differentPosition = random.nextInt(0, (gridSize * gridSize) - 1);

    rounds.push({
      gridSize,
      baseColor,
      differentColor,
      differentPosition,
      completed: false,
    });
  }

  return {
    id: `color-match-${dateString}`,
    type: 'color-match',
    title: 'Color Match',
    emoji: '🎨',
    difficulty,
    completed: false,
    rounds,
    currentRound: 0,
    streak: 0,
    timeLimit,
  };
};

/**
 * Calculate score for Color Match game
 */
export const calculateColorMatchScore = (
  rounds: ColorRound[],
  streak: number,
  timeRemaining: number
): number => {
  const completedRounds = rounds.filter(r => r.completed).length;
  const baseScore = completedRounds * 20;
  const streakBonus = streak * 15;
  const timeBonus = Math.floor(timeRemaining * 2);

  // Perfect round bonus
  const perfectBonus = completedRounds === rounds.length ? 100 : 0;

  return baseScore + streakBonus + timeBonus + perfectBonus;
};
