import React, { useState, useEffect, useRef } from 'react';
import { ColorMatchGame, ColorRound } from '../../types/game.types';
import { calculateColorMatchScore } from '../../data/colorMatch';
import './ColorMatch.css';

interface ColorMatchProps {
  game: ColorMatchGame;
  onComplete: (success: boolean, score: number) => void;
  onBack: () => void;
}

const ColorMatch: React.FC<ColorMatchProps> = ({ game, onComplete, onBack }) => {
  const [rounds, setRounds] = useState<ColorRound[]>(game.rounds);
  const [currentRound, setCurrentRound] = useState(game.currentRound);
  const [streak, setStreak] = useState(game.streak);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentRoundData = rounds[currentRound];

  // Game timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPlaying]);

  const handleGameOver = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const score = calculateColorMatchScore(rounds, streak, timeRemaining);
    onComplete(true, score);
  };

  const handleColorClick = (position: number) => {
    if (!isPlaying || !currentRoundData) return;

    if (position === currentRoundData.differentPosition) {
      // Correct!
      setFeedback('correct');
      
      const updatedRounds = [...rounds];
      updatedRounds[currentRound] = { ...currentRoundData, completed: true };
      setRounds(updatedRounds);
      setStreak(prev => prev + 1);

      setTimeout(() => {
        setFeedback(null);
        if (currentRound < rounds.length - 1) {
          setCurrentRound(prev => prev + 1);
        } else {
          // All rounds completed!
          handleGameOver();
        }
      }, 800);
    } else {
      // Wrong!
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const renderColorGrid = () => {
    if (!currentRoundData) return null;

    const { gridSize, baseColor, differentColor, differentPosition } = currentRoundData;
    const totalSquares = gridSize * gridSize;
    const squares = [];

    for (let i = 0; i < totalSquares; i++) {
      const color = i === differentPosition ? differentColor : baseColor;
      
      squares.push(
        <button
          key={i}
          className={`color-square ${feedback === 'correct' && i === differentPosition ? 'correct-pulse' : ''} ${
            feedback === 'wrong' ? 'shake' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => handleColorClick(i)}
          disabled={!isPlaying}
        />
      );
    }

    return squares;
  };

  if (game.completed) {
    return (
      <div className="color-match-game completed">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>🎨 Color Match</h2>
        </div>
        <div className="completion-card">
          <div className="completion-icon">✅</div>
          <h3>Already Completed!</h3>
          <p>Rounds completed: {game.rounds.filter(r => r.completed).length}/{game.rounds.length}</p>
          <div className="score-display">
            Score: <strong>{game.score}</strong>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRoundData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="color-match-game">
      {/* Header */}
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-info">
          <h2>🎨 Color Match</h2>
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
          <span className="stat-label">Round</span>
          <span className="stat-value">
            {currentRound + 1}/{rounds.length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Streak</span>
          <span className="stat-value streak">
            {streak}🔥
          </span>
        </div>
      </div>

      {/* Instruction */}
      <div className="instruction-card">
        <h3>👁️ Find the different color!</h3>
        <p>Tap the square that's a slightly different shade</p>
      </div>

      {/* Color Grid */}
      <div className="game-container">
        <div 
          className={`color-grid grid-${currentRoundData.gridSize}`}
          style={{
            gridTemplateColumns: `repeat(${currentRoundData.gridSize}, 1fr)`,
          }}
        >
          {renderColorGrid()}
        </div>
      </div>

      {/* Feedback */}
      {feedback === 'correct' && (
        <div className="feedback-overlay success">
          <div className="feedback-icon">✓</div>
          <div className="feedback-text">Perfect!</div>
        </div>
      )}

      {feedback === 'wrong' && (
        <div className="feedback-overlay error">
          <div className="feedback-icon">✗</div>
          <div className="feedback-text">Try again!</div>
        </div>
      )}

      {/* Progress */}
      <div className="progress-container">
        <div className="progress-label">Round Progress</div>
        <div className="progress-dots">
          {rounds.map((round, index) => (
            <div
              key={index}
              className={`progress-dot ${round.completed ? 'completed' : ''} ${
                index === currentRound ? 'current' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="tip-box">
        💡 <strong>Pro tip:</strong> Look for subtle differences in brightness or hue!
      </div>
    </div>
  );
};

export default ColorMatch;
