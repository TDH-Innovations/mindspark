import React from 'react';
import { GameUnion, GameType } from '../types/game.types';
import QuickTap from '../components/Games/QuickTap';
import WordChain from '../components/Games/WordChain';
import ColorMatch from '../components/Games/ColorMatch';
import NumberNinjas from '../components/Games/NumberNinjas';
import DailyGoals from '../components/Games/DailyGoals';
import './GameScreen.css';

interface GameScreenProps {
  gameId: string;
  dailyGamesContext: {
    currentChallenge: any;
    updateGameCompletion: (gameId: string, completed: boolean, score?: number) => void;
    getGameById: (gameId: string) => GameUnion | undefined;
  };
  progressContext: {
    recordGameCompletion: (gameType: GameType, score: number) => void;
  };
  onBack: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameId,
  dailyGamesContext,
  progressContext,
  onBack,
}) => {
  const game = dailyGamesContext.getGameById(gameId);

  if (!game) {
    return (
      <div className="game-screen">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Game not found</h2>
          <button className="back-button" onClick={onBack}>← Back to Home</button>
        </div>
      </div>
    );
  }

  const handleGameComplete = (success: boolean, score: number) => {
    if (success) {
      dailyGamesContext.updateGameCompletion(game.id, true, score);
      progressContext.recordGameCompletion(game.type, score);
    }
  };

  const renderGame = () => {
    switch (game.type) {
      case 'quick-tap':
        return (
          <QuickTap
            game={game}
            onComplete={handleGameComplete}
            onBack={onBack}
          />
        );
      case 'word-chain':
        return (
          <WordChain
            game={game}
            onComplete={handleGameComplete}
            onBack={onBack}
          />
        );
      case 'color-match':
        return (
          <ColorMatch
            game={game}
            onComplete={handleGameComplete}
            onBack={onBack}
          />
        );
      case 'number-ninjas':
        return (
          <NumberNinjas
            game={game}
            onComplete={handleGameComplete}
            onBack={onBack}
          />
        );
      case 'daily-goals':
        return (
          <DailyGoals
            game={game}
            onComplete={handleGameComplete}
            onBack={onBack}
          />
        );
      default:
        return <div>Unknown game type</div>;
    }
  };

  return (
    <div className="game-screen">
      {renderGame()}
    </div>
  );
};

export default GameScreen;
