import React, { useState, useEffect, useRef } from 'react';
import { calculateColorMatchScore } from './gameGenerator';

const s = {
  game: { minHeight: '100vh', background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', padding: 16, position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  h2: { color: 'white', fontSize: 24, fontWeight: 700, margin: 0 },
  backBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  statsBar: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 },
  stat: { background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, textAlign: 'center' },
  statLabel: { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { display: 'block', color: 'white', fontSize: 20, fontWeight: 700 },
  instructionCard: { background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  gameContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px 0', minHeight: 350 },
  progressContainer: { margin: '24px 0' },
  progressLabel: { color: 'white', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12, opacity: 0.9, textAlign: 'center' },
  progressDots: { display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  tipBox: { background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: 'white', fontSize: 13, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', marginTop: 24 },
  completionCard: { background: 'white', borderRadius: 24, padding: '40px 24px', textAlign: 'center', marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  scoreDisplay: { background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', color: 'white', padding: 16, borderRadius: 12, fontSize: 18 },
  diffBadge: (diff) => ({ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: diff === 'easy' ? '#34d399' : diff === 'medium' ? '#fbbf24' : '#f87171', color: diff === 'easy' ? '#064e3b' : diff === 'medium' ? '#78350f' : '#7f1d1d' }),
  feedbackOverlay: (type) => ({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none', background: type === 'correct' ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)' }),
};

export default function ColorMatch({ game, onComplete, onBack }) {
  const [rounds, setRounds] = useState(game.rounds);
  const [currentRound, setCurrentRound] = useState(game.currentRound);
  const [streak, setStreak] = useState(game.streak);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);
  const currentRoundData = rounds[currentRound];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => { if (prev <= 1) { handleGameOver(); return 0; } return prev - 1; });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [isPlaying]);

  const handleGameOver = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const score = calculateColorMatchScore(rounds, streak, timeRemaining);
    onComplete(true, score);
  };

  const handleColorClick = (position) => {
    if (!isPlaying || !currentRoundData) return;
    if (position === currentRoundData.differentPosition) {
      setFeedback('correct');
      const updatedRounds = [...rounds];
      updatedRounds[currentRound] = { ...currentRoundData, completed: true };
      setRounds(updatedRounds);
      setStreak(prev => prev + 1);
      setTimeout(() => {
        setFeedback(null);
        if (currentRound < rounds.length - 1) setCurrentRound(prev => prev + 1);
        else handleGameOver();
      }, 800);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => setFeedback(null), 500);
    }
  };

  if (game.completed) {
    return (
      <div style={s.game}>
        <div style={s.header}><button style={s.backBtn} onClick={onBack}>← Back</button><h2 style={s.h2}>🎨 Color Match</h2></div>
        <div style={s.completionCard}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h3>Already Completed!</h3>
          <p style={{ color: '#64748b' }}>Rounds: {game.rounds.filter(r => r.completed).length}/{game.rounds.length}</p>
          <div style={s.scoreDisplay}>Score: <strong style={{ fontSize: 28 }}>{game.score}</strong></div>
        </div>
      </div>
    );
  }
  if (!currentRoundData) return <div style={s.game}><p style={{ color: 'white' }}>Loading...</p></div>;

  const totalSquares = currentRoundData.gridSize * currentRoundData.gridSize;
  return (
    <div style={s.game}>
      {feedback && (
        <div style={s.feedbackOverlay(feedback)}>
          <div style={{ fontSize: 80, color: 'white' }}>{feedback === 'correct' ? '✓' : '✗'}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'white', marginTop: 16 }}>{feedback === 'correct' ? 'Perfect!' : 'Try again!'}</div>
        </div>
      )}
      <div style={s.header}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <div style={s.headerInfo}><h2 style={s.h2}>🎨 Color Match</h2><span style={s.diffBadge(game.difficulty)}>{game.difficulty}</span></div>
      </div>
      <div style={s.statsBar}>
        {[['Time', `${timeRemaining}s`], ['Round', `${currentRound + 1}/${rounds.length}`], ['Streak', `${streak}🔥`]].map(([label, val]) => (
          <div key={label} style={s.stat}><span style={s.statLabel}>{label}</span><span style={s.statValue}>{val}</span></div>
        ))}
      </div>
      <div style={s.instructionCard}>
        <h3 style={{ margin: '0 0 8px', fontSize: 20, color: '#1e293b' }}>👁️ Find the different color!</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Tap the square that's a slightly different shade</p>
      </div>
      <div style={s.gameContainer}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentRoundData.gridSize}, 1fr)`, gap: 8, maxWidth: 400, width: '100%', aspectRatio: '1' }}>
          {Array.from({ length: totalSquares }, (_, i) => (
            <button key={i} style={{ border: 'none', borderRadius: 12, cursor: isPlaying ? 'pointer' : 'not-allowed', minHeight: 60, backgroundColor: i === currentRoundData.differentPosition ? currentRoundData.differentColor : currentRoundData.baseColor, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
              onClick={() => handleColorClick(i)} disabled={!isPlaying} />
          ))}
        </div>
      </div>
      <div style={s.progressContainer}>
        <div style={s.progressLabel}>Round Progress</div>
        <div style={s.progressDots}>
          {rounds.map((round, index) => (
            <div key={index} style={{ width: 12, height: 12, borderRadius: '50%', background: round.completed ? '#10b981' : index === currentRound ? '#fbbf24' : 'rgba(255,255,255,0.3)', boxShadow: round.completed ? '0 0 8px rgba(16,185,129,0.6)' : index === currentRound ? '0 0 12px rgba(251,191,36,0.8)' : 'none' }} />
          ))}
        </div>
      </div>
      <div style={s.tipBox}>💡 <strong>Pro tip:</strong> Look for subtle differences in brightness or hue!</div>
    </div>
  );
}