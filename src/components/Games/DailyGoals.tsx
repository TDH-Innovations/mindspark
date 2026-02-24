import React, { useState, useEffect } from 'react';
import { DailyGoalsGame, Goal } from '../../types/game.types';
import { calculateDailyGoalsScore } from '../../data/goals';
import './DailyGoals.css';

interface DailyGoalsProps {
  game: DailyGoalsGame;
  onComplete: (success: boolean, score: number) => void;
  onBack: () => void;
}

const categoryIcons: Record<Goal['category'], string> = {
  health: '💪',
  productivity: '⚡',
  learning: '📚',
  social: '🤝',
  creative: '🎨',
};

const categoryColors: Record<Goal['category'], string> = {
  health: '#10b981',
  productivity: '#3b82f6',
  learning: '#8b5cf6',
  social: '#f59e0b',
  creative: '#ec4899',
};

const DailyGoals: React.FC<DailyGoalsProps> = ({ game, onComplete, onBack }) => {
  const [goals, setGoals] = useState<Goal[]>(game.goals);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const allCompleted = goals.every(goal => goal.completed);
    if (allCompleted && goals.length > 0 && !game.completed) {
      const score = calculateDailyGoalsScore(goals);
      setShowConfetti(true);
      setTimeout(() => {
        onComplete(true, score);
      }, 1500);
    }
  }, [goals]);

  const toggleGoal = (goalId: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, completed: !goal.completed }
          : goal
      )
    );
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = (completedCount / goals.length) * 100;

  if (game.completed) {
    return (
      <div className="daily-goals-game completed">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>✅ Daily Goals</h2>
        </div>
        <div className="completion-card">
          <div className="completion-icon">✅</div>
          <h3>All Set!</h3>
          <p>You've planned your day perfectly</p>
          <div className="score-display">
            Score: <strong>{game.score}</strong>
          </div>
          <div className="goals-preview">
            {game.goals.map(goal => (
              <div key={goal.id} className="goal-preview">
                <span className="goal-check">✓</span>
                <span>{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-goals-game">
      {showConfetti && <div className="confetti-overlay">🎉</div>}

      {/* Header */}
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-info">
          <h2>✅ Daily Goals</h2>
          <span className="difficulty-badge easy">Intentions</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <h3>☀️ Set Your Intentions</h3>
        <p>Choose the goals you want to achieve today</p>
      </div>

      {/* Progress Circle */}
      <div className="progress-circle-container">
        <svg className="progress-ring" width="120" height="120">
          <circle
            className="progress-ring-circle-bg"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
          />
          <circle
            className="progress-ring-circle"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="progress-text">
          <div className="progress-number">{completedCount}/{goals.length}</div>
          <div className="progress-label">Goals</div>
        </div>
      </div>

      {/* Goals List */}
      <div className="goals-list">
        {goals.map(goal => (
          <div
            key={goal.id}
            className={`goal-card ${goal.completed ? 'completed' : ''}`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div 
              className="goal-accent"
              style={{ backgroundColor: categoryColors[goal.category] }}
            />
            <div className="goal-checkbox">
              {goal.completed && <span className="checkmark">✓</span>}
            </div>
            <div className="goal-content">
              <div className="goal-header">
                <span className="category-icon">{categoryIcons[goal.category]}</span>
                <span className="category-label">{goal.category}</span>
              </div>
              <p className="goal-text">{goal.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === goals.length && (
        <div className="success-message">
          <div className="success-icon">🌟</div>
          <h4>Amazing! All goals set!</h4>
          <p>Now go make them happen!</p>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="motivation-box">
        <p>"The secret of getting ahead is getting started." - Mark Twain</p>
      </div>

      {/* Tip */}
      <div className="tip-box">
        💡 <strong>Tip:</strong> Come back throughout the day to check off completed goals!
      </div>
    </div>
  );
};

export default DailyGoals;
