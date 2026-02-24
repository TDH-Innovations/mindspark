import React from 'react';
import { GameUnion } from '../../types/game.types';
import './GameCard.css';

interface GameCardProps {
  game: GameUnion;
  onClick: () => void;
}

const gameDescriptions: Record<string, string> = {
  'quick-tap': 'Test your memory & speed',
  'word-chain': 'Build words from letters',
  'color-match': 'Find the different shade',
  'number-ninjas': 'Lightning-fast math',
  'daily-goals': 'Set your daily intentions',
};

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div
      className={`game-card ${game.completed ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div className="game-card-header">
        <span className="game-icon">{game.emoji}</span>
        {game.completed && <span className="completed-badge">✓</span>}
      </div>
      
      <div className="game-card-content">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-description">{gameDescriptions[game.type]}</p>
        
        <div className="game-card-footer">
          <span className={`difficulty-badge ${game.difficulty}`}>
            {game.difficulty}
          </span>
          {game.completed && game.score && (
            <span className="score-badge">{game.score} pts</span>
          )}
        </div>
      </div>

      <div className="play-overlay">
        {game.completed ? 'Review' : 'Play Now'}
      </div>
    </div>
  );
};

export default GameCard;
