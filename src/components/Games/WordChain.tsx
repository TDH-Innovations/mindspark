import React, { useState, useEffect, useRef } from 'react';
import { WordChainGame } from '../../types/game.types';
import { calculateWordChainScore } from '../../data/wordChain';
import './WordChain.css';

interface WordChainProps {
  game: WordChainGame;
  onComplete: (success: boolean, score: number) => void;
  onBack: () => void;
}

const WordChain: React.FC<WordChainProps> = ({ game, onComplete, onBack }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>(game.foundWords);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState<'valid' | 'invalid' | 'duplicate' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    
    const score = calculateWordChainScore(
      foundWords,
      game.possibleWords,
      timeRemaining
    );
    onComplete(true, score);
  };

  const handleLetterClick = (letter: string) => {
    if (!isPlaying) return;
    setCurrentWord(prev => prev + letter);
  };

  const handleSubmit = () => {
    if (!currentWord) return;

    const wordLower = currentWord.toLowerCase();

    // Check if already found
    if (foundWords.map(w => w.toLowerCase()).includes(wordLower)) {
      setFeedback('duplicate');
      setTimeout(() => setFeedback(null), 1000);
      return;
    }

    // Check if valid
    if (game.possibleWords.includes(wordLower)) {
      setFoundWords(prev => [...prev, currentWord]);
      setCurrentWord('');
      setFeedback('valid');
      setTimeout(() => setFeedback(null), 500);
    } else {
      setFeedback('invalid');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleClear = () => {
    setCurrentWord('');
  };

  const handleFinish = () => {
    handleGameOver();
  };

  if (game.completed) {
    return (
      <div className="word-chain-game completed">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>🧠 Word Chain</h2>
        </div>
        <div className="completion-card">
          <div className="completion-icon">✅</div>
          <h3>Already Completed!</h3>
          <p>Words found: {game.foundWords.length}</p>
          <div className="score-display">
            Score: <strong>{game.score}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-chain-game">
      {/* Header */}
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-info">
          <h2>🧠 Word Chain</h2>
          <span className={`difficulty-badge ${game.difficulty}`}>
            {game.difficulty}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className={`stat-value ${timeRemaining < 15 ? 'warning' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Words</span>
          <span className="stat-value">{foundWords.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Possible</span>
          <span className="stat-value">{game.possibleWords.length}</span>
        </div>
      </div>

      {/* Letter Grid */}
      <div className="letter-grid">
        {game.letters.map((letter, index) => (
          <button
            key={index}
            className="letter-tile"
            onClick={() => handleLetterClick(letter)}
            disabled={!isPlaying}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Current Word Display */}
      <div className={`current-word-display ${feedback || ''}`}>
        <div className="word-text">
          {currentWord || 'Tap letters to form words'}
        </div>
        {currentWord && (
          <button className="clear-btn" onClick={handleClear}>✕</button>
        )}
      </div>

      {/* Feedback */}
      {feedback === 'valid' && (
        <div className="feedback success">✓ Great word!</div>
      )}
      {feedback === 'invalid' && (
        <div className="feedback error">✗ Not a valid word</div>
      )}
      {feedback === 'duplicate' && (
        <div className="feedback warning">Already found!</div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={!currentWord || !isPlaying}
        >
          Submit Word
        </button>
        <button 
          className="finish-btn" 
          onClick={handleFinish}
          disabled={!isPlaying}
        >
          Finish Game
        </button>
      </div>

      {/* Found Words */}
      <div className="found-words-section">
        <h3>Found Words ({foundWords.length})</h3>
        <div className="found-words-list">
          {foundWords.length === 0 ? (
            <p className="empty-state">No words found yet!</p>
          ) : (
            foundWords.map((word, index) => (
              <span key={index} className="found-word">
                {word} <small>({word.length * 10}pts)</small>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Hint Toggle */}
      <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>
        {showHint ? '🙈 Hide' : '💡 Show'} Hint
      </button>

      {showHint && (
        <div className="hint-box">
          <p><strong>Hint:</strong> There are {game.possibleWords.length} possible words!</p>
          <p>Try common 3-4 letter words first.</p>
        </div>
      )}
    </div>
  );
};

export default WordChain;
