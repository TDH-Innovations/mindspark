import React, { useState, useEffect } from 'react';
import { generateDailyGames, getTodayDate } from '../components/game/gameGenerator';
import { useGameProgress } from '../components/game/useGameProgress';
import { useLocalStorage } from '../components/game/useLocalStorage';
import GameCard from '../components/game/GameCard';
import QuickTap from '../components/game/QuickTap';
import ColorMatch from '../components/game/ColorMatch';
import NumberNinjas from '../components/game/NumberNinjas';
import WordChain from '../components/game/WordChain';
import DailyGoals from '../components/game/DailyGoals';
import StatsScreen from '../components/game/StatsScreen';

export default function Home() {
  const today = getTodayDate();
  const [dailyChallenge, setDailyChallenge] = useLocalStorage('mindspark_daily_' + today, null);
  const [currentGame, setCurrentGame] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const { stats, recordGameCompletion } = useGameProgress();

  useEffect(() => {
    if (!dailyChallenge) {
      setDailyChallenge(generateDailyGames(today));
    }
  }, []);

  const handleGameComplete = (gameId, success, score) => {
    if (!dailyChallenge) return;
    const updatedGames = dailyChallenge.games.map(g =>
      g.id === gameId ? { ...g, completed: true, score } : g
    );
    const allCompleted = updatedGames.every(g => g.completed);
    const totalScore = updatedGames.reduce((sum, g) => sum + (g.score || 0), 0);
    setDailyChallenge({ ...dailyChallenge, games: updatedGames, completed: allCompleted, totalScore });

    const game = dailyChallenge.games.find(g => g.id === gameId);
    if (game) recordGameCompletion(game.type, score);
    setCurrentGame(null);
  };

  const renderGame = (game) => {
    const props = {
      game,
      onComplete: (success, score) => handleGameComplete(game.id, success, score),
      onBack: () => setCurrentGame(null),
    };
    switch (game.type) {
      case 'quick-tap': return <QuickTap {...props} />;
      case 'color-match': return <ColorMatch {...props} />;
      case 'number-ninjas': return <NumberNinjas {...props} />;
      case 'word-chain': return <WordChain {...props} />;
      case 'daily-goals': return <DailyGoals {...props} />;
      default: return null;
    }
  };

  if (currentGame) return renderGame(currentGame);
  if (showStats) return <StatsScreen stats={stats} onBack={() => setShowStats(false)} />;

  const games = dailyChallenge?.games || [];
  const completedCount = games.filter(g => g.completed).length;
  const totalScore = dailyChallenge?.totalScore || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🧠</span>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', margin: 0 }}>MindSpark</h1>
          </div>
          <button onClick={() => setShowStats(true)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 48, height: 48, borderRadius: 12, fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            📊
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        {/* Daily Challenge Header */}
        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: 24, marginBottom: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Daily Challenge — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 4 }}>
            {completedCount}/{games.length} Complete
          </div>
          {totalScore > 0 && <div style={{ fontSize: 16, color: '#fbbf24', fontWeight: 600 }}>⭐ {totalScore} points today</div>}

          {/* Progress bar */}
          <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ height: '100%', width: `${games.length > 0 ? (completedCount / games.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #34d399, #10b981)', borderRadius: 4, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Streak card */}
        {stats.currentStreak > 0 && (
          <div style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🔥</span>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: 16 }}>{stats.currentStreak}-day streak!</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Keep it going — play every day</div>
            </div>
          </div>
        )}

        {/* Game Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {games.map(game => (
            <GameCard key={game.id} game={game} onClick={() => setCurrentGame(game)} />
          ))}
        </div>

        {dailyChallenge?.completed && (
          <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 20, padding: 24, marginTop: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <h3 style={{ color: 'white', fontSize: 22, margin: '0 0 8px' }}>Daily Challenge Complete!</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 12px', fontSize: 15 }}>Come back tomorrow for a new challenge</p>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24' }}>Total: {totalScore} points ⭐</div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 32 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>New games every day • Progress saved locally</p>
        </div>
      </div>
    </div>
  );
}