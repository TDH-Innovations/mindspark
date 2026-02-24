import React, { useState } from 'react';
import { useDailyGames } from './hooks/useDailyGames';
import { useGameProgress } from './hooks/useGameProgress';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import StatsScreen from './screens/StatsScreen';
import Header from './components/Layout/Header';
import './App.css';

type Screen = 'home' | 'game' | 'stats';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const dailyGamesContext = useDailyGames();
  const progressContext = useGameProgress();

  const navigateToGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentScreen('game');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
    setSelectedGameId(null);
  };

  const navigateToStats = () => {
    setCurrentScreen('stats');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            dailyGamesContext={dailyGamesContext}
            progressContext={progressContext}
            onGameSelect={navigateToGame}
            onStatsClick={navigateToStats}
          />
        );
      case 'game':
        if (!selectedGameId) {
          navigateToHome();
          return null;
        }
        return (
          <GameScreen
            gameId={selectedGameId}
            dailyGamesContext={dailyGamesContext}
            progressContext={progressContext}
            onBack={navigateToHome}
          />
        );
      case 'stats':
        return (
          <StatsScreen
            stats={progressContext.stats}
            onBack={navigateToHome}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header onStatsClick={navigateToStats} onHomeClick={navigateToHome} />
      <main className="main-content">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
