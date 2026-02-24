import React, { useState, useEffect, useRef } from 'react';
import { QuickTapGame } from '../../types/game.types';
import { calculateQuickTapScore } from '../../data/quickTap';
import './QuickTap.css';

interface QuickTapProps {
  game: QuickTapGame;
  onComplete: (success: boolean, score: number) => void;
  onBack: () => void;
}

const QuickTap: React.FC<QuickTapProps> = ({ game, onComplete, onBack }) => {
  const [gameState, setGameState] = useState(game);
  const [showSequence, setShowSequence] = useState(true);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [particles, setParticles] = useState<Array<{x: number, y: number, id: number}>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Show sequence animation
  useEffect(() => {
    if (showSequence && !isPlaying) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < game.sequence.length) {
          setSequenceIndex(index);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setShowSequence(false);
            setPlayerTurn(true);
            setIsPlaying(true);
          }, 500);
        }
      }, 800); // Show each button for 800ms

      return () => clearInterval(interval);
    }
  }, [showSequence]);

  // Game timer
  useEffect(() => {
    if (isPlaying && playerTurn) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleGameOver(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPlaying, playerTurn]);

  const handleButtonClick = (position: number, _event: React.MouseEvent) => {
    if (!playerTurn || gameState.currentStep >= game.sequence.length) return;

    const correctPosition = game.sequence[gameState.currentStep];

    if (position === correctPosition) {
      // Correct!
      setFeedback('correct');
      
      // Add particle effect
      setParticles(prev => [...prev, { x: event.clientX, y: event.clientY, id: Date.now() }]);
      setTimeout(() => setParticles(prev => prev.slice(1)), 600);

      const newStep = gameState.currentStep + 1;
      const newCombo = gameState.comboMultiplier + 0.1;

      setGameState(prev => ({
        ...prev,
        currentStep: newStep,
        comboMultiplier: newCombo,
      }));

      setTimeout(() => setFeedback(null), 200);

      // Check if completed
      if (newStep >= game.sequence.length) {
        handleGameOver(true);
      }
    } else {
      // Wrong!
      setFeedback('wrong');
      setGameState(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1,
        comboMultiplier: 1, // Reset combo
      }));

      setTimeout(() => setFeedback(null), 300);
    }
  };

  const handleGameOver = (success: boolean) => {
    setIsPlaying(false);
    setPlayerTurn(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (success) {
      const score = calculateQuickTapScore(
        game.sequence,
        gameState.mistakes,
        timeRemaining,
        gameState.comboMultiplier
      );
      onComplete(true, score);
    } else {
      onComplete(false, 0);
    }
  };

  const renderGrid = () => {
    const buttons = [];
    for (let i = 0; i < 9; i++) {
      const isHighlighted = showSequence && i === game.sequence[sequenceIndex];
      const isCorrectNext = playerTurn && i === game.sequence[gameState.currentStep];

      buttons.push(
        <button
          key={i}
          className={`tap-button ${isHighlighted ? 'highlight' : ''} ${
            feedback === 'correct' && isCorrectNext ? 'success-pulse' : ''
          } ${feedback === 'wrong' ? 'shake' : ''}`}
          onClick={(e) => handleButtonClick(i, e)}
          disabled={!playerTurn}
        >
          {playerTurn && isCorrectNext && (
            <span className="step-indicator">{gameState.currentStep + 1}</span>
          )}
        </button>
      );
    }
    return buttons;
  };

  if (game.completed) {
    return (
      <div className="quick-tap-game completed">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>🎯 Quick Tap</h2>
        </div>
        <div className="completion-card">
          <div className="completion-icon">✅</div>
          <h3>Already Completed!</h3>
          <p>You've mastered today's sequence</p>
          <div className="score-display">
            Score: <strong>{game.score}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-tap-game">
      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{ left: particle.x, top: particle.y }}
        />
      ))}

      {/* Header */}
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-info">
          <h2>🎯 Quick Tap</h2>
          <span className={`difficulty-badge ${game.difficulty}`}>
            {game.difficulty}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className={`stat-value ${timeRemaining < 10 ? 'warning' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Progress</span>
          <span className="stat-value">
            {gameState.currentStep}/{game.sequence.length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Combo</span>
          <span className="stat-value combo">
            {gameState.comboMultiplier.toFixed(1)}x
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Mistakes</span>
          <span className="stat-value error">
            {gameState.mistakes}
          </span>
        </div>
      </div>

      {/* Instructions */}
      {showSequence && (
        <div className="instruction-card pulse">
          <h3>👀 Watch the sequence!</h3>
          <p>Memorize the order of the flashing buttons</p>
        </div>
      )}

      {playerTurn && (
        <div className="instruction-card">
          <h3>🎮 Your turn!</h3>
          <p>Tap the buttons in the same order</p>
        </div>
      )}

      {/* Game Grid */}
      <div className="game-container">
        <div className="tap-grid">
          {renderGrid()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-label">Sequence Progress</div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(gameState.currentStep / game.sequence.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="tip-box">
        💡 <strong>Pro tip:</strong> Build combos by tapping correctly in a row!
      </div>
    </div>
  );
};

export default QuickTap;