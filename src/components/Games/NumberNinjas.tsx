import React, { useState, useEffect, useRef } from 'react';
import { NumberNinjasGame, MathProblem } from '../../types/game.types';
import { calculateNumberNinjasScore } from '../../data/numberNinjas';
import './NumberNinjas.css';

interface NumberNinjasProps {
  game: NumberNinjasGame;
  onComplete: (success: boolean, score: number) => void;
  onBack: () => void;
}

const NumberNinjas: React.FC<NumberNinjasProps> = ({ game, onComplete, onBack }) => {
  const [problems, setProblems] = useState<MathProblem[]>(game.problems);
  const [currentProblem, setCurrentProblem] = useState(game.currentProblem);
  const [userAnswer, setUserAnswer] = useState('');
  const [streak, setStreak] = useState(game.streak);
  const [lives, setLives] = useState(game.lives);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentProblemData = problems[currentProblem];

  // Problem timer
  useEffect(() => {
    if (isPlaying && currentProblemData) {
      setTimeRemaining(game.timeLimit);
      
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeout();
            return game.timeLimit;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPlaying, currentProblem]);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current && isPlaying) {
      inputRef.current.focus();
    }
  }, [currentProblem, isPlaying]);

  const handleTimeout = () => {
    // Treat as wrong answer
    handleWrongAnswer();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer || !currentProblemData) return;

    const answer = parseFloat(userAnswer);
    
    if (answer === currentProblemData.correctAnswer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleCorrectAnswer = () => {
    setFeedback('correct');
    setStreak(prev => prev + 1);

    const updatedProblems = [...problems];
    updatedProblems[currentProblem] = {
      ...currentProblemData!,
      userAnswer: parseFloat(userAnswer),
      isCorrect: true,
    };
    setProblems(updatedProblems);

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      moveToNext();
    }, 600);
  };

  const handleWrongAnswer = () => {
    setFeedback('wrong');
    setStreak(0);
    setLives(prev => prev - 1);

    const updatedProblems = [...problems];
    updatedProblems[currentProblem] = {
      ...currentProblemData!,
      userAnswer: userAnswer ? parseFloat(userAnswer) : undefined,
      isCorrect: false,
    };
    setProblems(updatedProblems);

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      
      if (lives <= 1) {
        handleGameOver();
      } else {
        moveToNext();
      }
    }, 800);
  };

  const moveToNext = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(prev => prev + 1);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const score = calculateNumberNinjasScore(problems, streak, lives);
    onComplete(true, score);
  };

  if (game.completed) {
    return (
      <div className="number-ninjas-game completed">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>🔢 Number Ninjas</h2>
        </div>
        <div className="completion-card">
          <div className="completion-icon">✅</div>
          <h3>Already Completed!</h3>
          <p>Problems solved: {game.problems.filter(p => p.isCorrect).length}/{game.problems.length}</p>
          <div className="score-display">
            Score: <strong>{game.score}</strong>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProblemData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="number-ninjas-game">
      {/* Header */}
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-info">
          <h2>🔢 Number Ninjas</h2>
          <span className={`difficulty-badge ${game.difficulty}`}>
            {game.difficulty}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className={`stat-value ${timeRemaining <= 2 ? 'critical' : timeRemaining <= 4 ? 'warning' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Problem</span>
          <span className="stat-value">
            {currentProblem + 1}/{problems.length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Streak</span>
          <span className="stat-value streak">
            {streak}🔥
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Lives</span>
          <span className="stat-value lives">
            {'❤️'.repeat(lives)}
          </span>
        </div>
      </div>

      {/* Problem Display */}
      <div className={`problem-card ${feedback || ''}`}>
        <div className="problem-equation">
          {currentProblemData.num1} {currentProblemData.operation} {currentProblemData.num2} = ?
        </div>
      </div>

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="answer-form">
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer..."
          className={`answer-input ${feedback || ''}`}
          disabled={!isPlaying}
          inputMode="numeric"
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={!userAnswer || !isPlaying}
        >
          Submit
        </button>
      </form>

      {/* Feedback */}
      {feedback === 'correct' && (
        <div className="feedback-flash success">
          <div className="feedback-icon">✓</div>
          <div className="feedback-text">Correct!</div>
        </div>
      )}

      {feedback === 'wrong' && (
        <div className="feedback-flash error">
          <div className="feedback-icon">✗</div>
          <div className="feedback-text">
            Wrong! Answer: {currentProblemData.correctAnswer}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-label">Overall Progress</div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentProblem + 1) / problems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <span className="stat-icon">✓</span>
          <span>{problems.filter(p => p.isCorrect).length} Correct</span>
        </div>
        <div className="quick-stat">
          <span className="stat-icon">✗</span>
          <span>{problems.filter(p => p.isCorrect === false).length} Wrong</span>
        </div>
      </div>

      {/* Tip */}
      <div className="tip-box">
        💡 <strong>Pro tip:</strong> Speed matters! Answer quickly to maintain your streak!
      </div>
    </div>
  );
};

export default NumberNinjas;
