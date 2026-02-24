import { useState, useEffect } from 'react';
import { DailyChallenge, GameUnion } from '../types/game.types';
import { generateDailyGames, getTodayDate, calculateTotalScore } from '../utils/gameGenerator';
import { useLocalStorage } from './useLocalStorage';

export const useDailyGames = () => {
  const [currentChallenge, setCurrentChallenge] = useLocalStorage<DailyChallenge | null>(
    'currentChallenge',
    null
  );
  const [challengeHistory, setChallengeHistory] = useLocalStorage<DailyChallenge[]>(
    'challengeHistory',
    []
  );

  useEffect(() => {
    const today = getTodayDate();

    // If no current challenge or it's a new day, generate new games
    if (!currentChallenge || currentChallenge.date !== today) {
      const newChallenge = generateDailyGames(today);
      setCurrentChallenge(newChallenge);
    }
  }, []);

  const updateGameCompletion = (gameId: string, completed: boolean, score?: number) => {
    if (!currentChallenge) return;

    const updatedGames = currentChallenge.games.map(game => {
      if (game.id === gameId) {
        return { ...game, completed, score };
      }
      return game;
    });

    const allCompleted = updatedGames.every(game => game.completed);
    const updatedChallenge: DailyChallenge = {
      ...currentChallenge,
      games: updatedGames,
      completed: allCompleted,
      totalScore: calculateTotalScore({ ...currentChallenge, games: updatedGames }),
    };

    setCurrentChallenge(updatedChallenge);

    // If all games completed, add to history
    if (allCompleted) {
      const existingIndex = challengeHistory.findIndex(c => c.date === updatedChallenge.date);
      if (existingIndex >= 0) {
        const newHistory = [...challengeHistory];
        newHistory[existingIndex] = updatedChallenge;
        setChallengeHistory(newHistory);
      } else {
        setChallengeHistory([...challengeHistory, updatedChallenge]);
      }
    }
  };

  const getGameById = (gameId: string): GameUnion | undefined => {
    return currentChallenge?.games.find(game => game.id === gameId);
  };

  const resetToday = () => {
    const today = getTodayDate();
    const newChallenge = generateDailyGames(today);
    setCurrentChallenge(newChallenge);
  };

  return {
    currentChallenge,
    updateGameCompletion,
    getGameById,
    resetToday,
    challengeHistory,
  };
};
