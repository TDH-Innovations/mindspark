import { NumberNinjasGame, MathProblem } from '../types/game.types';
import { SeededRandom } from '../utils/gameGenerator';

/**
 * Generate Number Ninjas game
 * Rapid-fire mental math challenges
 */
export const generateNumberNinjasGame = (
  dateString: string,
  random: SeededRandom
): NumberNinjasGame => {
  
  // Determine difficulty
  const difficultyRoll = random.nextInt(1, 3);
  let problemCount: number;
  let difficulty: 'easy' | 'medium' | 'hard';
  let timeLimit: number;
  let lives: number;
  let numRange: { min: number; max: number };

  if (difficultyRoll === 1) {
    problemCount = 10;
    difficulty = 'easy';
    timeLimit = 8; // seconds per problem
    lives = 3;
    numRange = { min: 1, max: 20 };
  } else if (difficultyRoll === 2) {
    problemCount = 12;
    difficulty = 'medium';
    timeLimit = 6;
    lives = 3;
    numRange = { min: 5, max: 50 };
  } else {
    problemCount = 15;
    difficulty = 'hard';
    timeLimit = 5;
    lives = 2;
    numRange = { min: 10, max: 100 };
  }

  // Generate math problems
  const problems: MathProblem[] = [];
  const operations: Array<'+' | '-' | '×' | '÷'> = ['+', '-', '×', '÷'];

  for (let i = 0; i < problemCount; i++) {
    const operation = operations[random.nextInt(0, operations.length - 1)];
    
    let num1: number;
    let num2: number;
    let correctAnswer: number;

    switch (operation) {
      case '+':
        num1 = random.nextInt(numRange.min, numRange.max);
        num2 = random.nextInt(numRange.min, numRange.max);
        correctAnswer = num1 + num2;
        break;

      case '-':
        // Ensure positive result
        const larger = random.nextInt(numRange.min, numRange.max);
        const smaller = random.nextInt(numRange.min, larger);
        num1 = larger;
        num2 = smaller;
        correctAnswer = num1 - num2;
        break;

      case '×':
        // Smaller numbers for multiplication
        const maxMult = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 15 : 20;
        num1 = random.nextInt(2, maxMult);
        num2 = random.nextInt(2, maxMult);
        correctAnswer = num1 * num2;
        break;

      case '÷':
        // Ensure clean division
        const divisor = random.nextInt(2, difficulty === 'easy' ? 10 : 15);
        const quotient = random.nextInt(2, difficulty === 'easy' ? 10 : 15);
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
        break;

      default:
        num1 = 0;
        num2 = 0;
        correctAnswer = 0;
    }

    problems.push({
      num1,
      num2,
      operation,
      correctAnswer,
    });
  }

  return {
    id: `number-ninjas-${dateString}`,
    type: 'number-ninjas',
    title: 'Number Ninjas',
    emoji: '🔢',
    difficulty,
    completed: false,
    problems,
    currentProblem: 0,
    streak: 0,
    timeLimit,
    lives,
  };
};

/**
 * Calculate score for Number Ninjas game
 */
export const calculateNumberNinjasScore = (
  problems: MathProblem[],
  streak: number,
  lives: number
): number => {
  const correctCount = problems.filter(p => p.isCorrect).length;
  const baseScore = correctCount * 15;
  const streakBonus = streak * 10;
  const livesBonus = lives * 30;

  // Perfect score bonus
  const perfectBonus = correctCount === problems.length ? 150 : 0;

  return baseScore + streakBonus + livesBonus + perfectBonus;
};
