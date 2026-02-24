import React from 'react';
import { DailyChallenge, UserStats } from '../types/game.types';
import GameCard from '../components/Common/GameCard';
import ProgressIndicator from '../components/Common/ProgressIndicator';
import './HomeScreen.css';

interface HomeScreenProps {
  dailyGamesContext: {
    currentChallenge: DailyChallenge | null;
    updateGameCompletion: (gameId: string, completed: boolean, score?: number) => void;
    getGameById: (gameId: string) => any;
    resetToday: () => void;
    challengeHistory: DailyChallenge[];
  };
  progressContext: {
    stats: UserStats;
    recordGameCompletion: (gameType: any, score: number) => void;
    resetStats: () => void;
  };
  onGameSelect: (gameId: string) => void;
  onStatsClick: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  dailyGamesContext,
  progressContext,
  onGameSelect,
  onStatsClick,
}) => {
  const { currentChallenge } = dailyGamesContext;
  const { stats } = progressContext;

  if (!currentChallenge) {
    return (
      <div className="home-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading today's challenges...</p>
        </div>
      </div>
    );
  }

  const completedGames = currentChallenge.games.filter(g => g.completed).length;
  const totalGames = currentChallenge.games.length;
  const allCompleted = completedGames === totalGames;

  return (
    <div className="home-screen">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="app-title">🧠 Brain Boost</h1>
        <p className="tagline">Your daily mental warm-up</p>
        
        <div className="streak-cards">
          <div className="streak-card">
            <span className="streak-icon">🔥</span>
            <div className="streak-info">
              <span className="streak-number">{stats.currentStreak}</span>
              <span className="streak-label">Day Streak</span>
            </div>
          </div>
          <div className="streak-card">
            <span className="streak-icon">⭐</span>
            <div className="streak-info">
              <span className="streak-number">{stats.totalScore}</span>
              <span className="streak-label">Total Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <ProgressIndicator
        completed={completedGames}
        total={totalGames}
        label="Today's Progress"
      />

      {/* All Completed Banner */}
      {allCompleted && (
        <div className="completion-banner">
          <div className="confetti">🎉</div>
          <h2>Fantastic Work!</h2>
          <p>You've completed all of today's challenges!</p>
          <div className="score-badge">
            {currentChallenge.totalScore} points
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="games-section">
        <h2 className="section-title">
          {allCompleted ? "Today's Completed Games" : "Today's Challenges"}
        </h2>
        <div className="games-grid">
          {currentChallenge.games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => onGameSelect(game.id)}
            />
          ))}
        </div>
      </div>

      {/* Stats Button */}
      <div className="quick-stats">
        <button className="stats-button" onClick={onStatsClick}>
          📊 View Detailed Statistics
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
