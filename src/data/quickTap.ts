import { QuickTapGame } from '../types/game.types';
import { SeededRandom } from '../utils/gameGenerator';

/**
 * Generate Quick Tap Challenge
 * Player must tap buttons in the correct sequence
 */
export const generateQuickTapGame = (
  dateString: string,
  random: SeededRandom
): QuickTapGame => {
  
  // Determine difficulty and sequence length
  const difficultyRoll = random.nextInt(1, 3);
  let sequenceLength: number;
  let difficulty: 'easy' | 'medium' | 'hard';
  let timeLimit: number;

  if (difficultyRoll === 1) {
    sequenceLength = 5;
    difficulty = 'easy';
    timeLimit = 30;
  } else if (difficultyRoll === 2) {
    sequenceLength = 7;
    difficulty = 'medium';
    timeLimit = 25;
  } else {
    sequenceLength = 10;
    difficulty = 'hard';
    timeLimit = 20;
  }

  // Generate random sequence (0-8 for 3x3 grid)
  const sequence: number[] = [];
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(random.nextInt(0, 8));
  }

  return {
    id: `quick-tap-${dateString}`,
    type: 'quick-tap',
    title: 'Quick Tap',
    emoji: '🎯',
    difficulty,
    completed: false,
    sequence,
    currentStep: 0,
    mistakes: 0,
    timeLimit,
    comboMultiplier: 1,
  };
};

/**
 * Calculate score for Quick Tap game
 * Based on: speed, accuracy, combo multipliers
 */
export const calculateQuickTapScore = (
  sequence: number[],
  mistakes: number,
  timeRemaining: number,
  comboMultiplier: number
): number => {
  const baseScore = sequence.length * 10;
  const accuracyBonus = Math.max(0, 50 - (mistakes * 10));
  const speedBonus = Math.floor(timeRemaining * 2);
  const comboBonus = (comboMultiplier - 1) * 20;

  return baseScore + accuracyBonus + speedBonus + comboBonus;
};
