import React from 'react';
import { UserStats } from '../types/game.types';
import CompletionBadge from '../components/Common/CompletionBadge';
import './StatsScreen.css';

interface StatsScreenProps {
  stats: UserStats;
  onBack: () => void;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ stats, onBack }) => {
  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const lockedAchievements = stats.achievements.filter(a => !a.unlocked);

  return (
    <div className="stats-screen">
      <div className="stats-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>Your Statistics</h1>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.longestStreak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalGamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalScore}</div>
            <div className="stat-label">Total Score</div>
          </div>
        </div>
      </div>

      <div className="game-breakdown">
        <h2>Games Completed</h2>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <span className="breakdown-icon">🎯</span>
            <span className="breakdown-label">Quick Tap</span>
            <span className="breakdown-value">{stats.gamesCompleted['quick-tap']}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-icon">🧠</span>
            <span className="breakdown-label">Word Chain</span>
            <span className="breakdown-value">{stats.gamesCompleted['word-chain']}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-icon">🎨</span>
            <span className="breakdown-label">Color Match</span>
            <span className="breakdown-value">{stats.gamesCompleted['color-match']}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-icon">🔢</span>
            <span className="breakdown-label">Number Ninjas</span>
            <span className="breakdown-value">{stats.gamesCompleted['number-ninjas']}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-icon">✅</span>
            <span className="breakdown-label">Daily Goals</span>
            <span className="breakdown-value">{stats.gamesCompleted['daily-goals']}</span>
          </div>
        </div>
      </div>

      <div className="high-scores-section">
        <h2>High Scores</h2>
        <div className="high-scores-grid">
          <div className="high-score-item">
            <span>🎯 Quick Tap</span>
            <strong>{stats.highScores['quick-tap']}</strong>
          </div>
          <div className="high-score-item">
            <span>🧠 Word Chain</span>
            <strong>{stats.highScores['word-chain']}</strong>
          </div>
          <div className="high-score-item">
            <span>🎨 Color Match</span>
            <strong>{stats.highScores['color-match']}</strong>
          </div>
          <div className="high-score-item">
            <span>🔢 Number Ninjas</span>
            <strong>{stats.highScores['number-ninjas']}</strong>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements</h2>
        
        {unlockedAchievements.length > 0 && (
          <div className="achievements-group">
            <h3>Unlocked ({unlockedAchievements.length})</h3>
            <div className="achievements-grid">
              {unlockedAchievements.map(achievement => (
                <CompletionBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={true}
                />
              ))}
            </div>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div className="achievements-group">
            <h3>Locked ({lockedAchievements.length})</h3>
            <div className="achievements-grid">
              {lockedAchievements.map(achievement => (
                <CompletionBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsScreen;
