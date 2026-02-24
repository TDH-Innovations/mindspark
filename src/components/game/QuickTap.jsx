import React, { useState, useEffect, useRef } from 'react';
import { calculateQuickTapScore } from './gameGenerator';

const s = {
  game: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 16, position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  h2: { color: 'white', fontSize: 24, fontWeight: 700, margin: 0 },
  backBtn: { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  statsBar: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 },
  stat: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: 12, textAlign: 'center' },
  statLabel: { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  statValue: { display: 'block', color: 'white', fontSize: 20, fontWeight: 700 },
  instructionCard: { background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  instructionH3: { margin: '0 0 8px 0', fontSize: 20, color: '#1e293b' },
  instructionP: { margin: 0, color: '#64748b', fontSize: 14 },
  gameContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px 0' },
  tapGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 400, width: '100%', aspectRatio: '1' },
  tapBtn: { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '3px solid rgba(255,255,255,0.3)', borderRadius: 20, cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: 100 },
  tapBtnHighlight: { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', border: '3px solid #fbbf24', transform: 'scale(1.1)', boxShadow: '0 0 30px rgba(251,191,36,0.6)' },
  tapBtnDisabled: { cursor: 'not-allowed', opacity: 0.6 },
  stepIndicator: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', color: '#667eea', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
  progressContainer: { margin: '24px 0' },
  progressLabel: { color: 'white', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, opacity: 0.9 },
  progressBar: { width: '100%', height: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)', borderRadius: 10, transition: 'width 0.3s ease' },
  tipBox: { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: 14, color: 'white', fontSize: 13, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' },
  completionCard: { background: 'white', borderRadius: 24, padding: '40px 24px', textAlign: 'center', marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  completionIcon: { fontSize: 64, marginBottom: 16 },
  scoreDisplay: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: 16, borderRadius: 12, fontSize: 18 },
  diffBadge: (diff) => ({ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, background: diff === 'easy' ? '#34d399' : diff === 'medium' ? '#fbbf24' : '#f87171', color: diff === 'easy' ? '#064e3b' : diff === 'medium' ? '#78350f' : '#7f1d1d' }),
};

export default function QuickTap({ game, onComplete, onBack }) {
  const [gameState, setGameState] = useState(game);
  const [showSequence, setShowSequence] = useState(true);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (showSequence && !isPlaying) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < game.sequence.length) { setSequenceIndex(index); index++; }
        else { clearInterval(interval); setTimeout(() => { setShowSequence(false); setPlayerTurn(true); setIsPlaying(true); }, 500); }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [showSequence]);

  useEffect(() => {
    if (isPlaying && playerTurn) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => { if (prev <= 1) { handleGameOver(false); return 0; } return prev - 1; });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [isPlaying, playerTurn]);

  const handleButtonClick = (position) => {
    if (!playerTurn || gameState.currentStep >= game.sequence.length) return;
    const correctPosition = game.sequence[gameState.currentStep];
    if (position === correctPosition) {
      const newStep = gameState.currentStep + 1;
      const newCombo = gameState.comboMultiplier + 0.1;
      setGameState(prev => ({ ...prev, currentStep: newStep, comboMultiplier: newCombo }));
      if (newStep >= game.sequence.length) handleGameOver(true);
    } else {
      setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1, comboMultiplier: 1 }));
    }
  };

  const handleGameOver = (success) => {
    setIsPlaying(false); setPlayerTurn(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (success) {
      const score = calculateQuickTapScore(game.sequence, gameState.mistakes, timeRemaining, gameState.comboMultiplier);
      onComplete(true, score);
    } else { onComplete(false, 0); }
  };

  if (game.completed) {
    return (
      <div style={s.game}>
        <div style={s.header}><button style={s.backBtn} onClick={onBack}>← Back</button><h2 style={s.h2}>🎯 Quick Tap</h2></div>
        <div style={s.completionCard}>
          <div style={s.completionIcon}>✅</div>
          <h3>Already Completed!</h3><p style={{ color: '#64748b' }}>You've mastered today's sequence</p>
          <div style={s.scoreDisplay}>Score: <strong style={{ fontSize: 28 }}>{game.score}</strong></div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.game}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <div style={s.headerInfo}><h2 style={s.h2}>🎯 Quick Tap</h2><span style={s.diffBadge(game.difficulty)}>{game.difficulty}</span></div>
      </div>
      <div style={s.statsBar}>
        {[['Time', `${timeRemaining}s`], ['Progress', `${gameState.currentStep}/${game.sequence.length}`], ['Combo', `${gameState.comboMultiplier.toFixed(1)}x`], ['Mistakes', gameState.mistakes]].map(([label, val]) => (
          <div key={label} style={s.stat}><span style={s.statLabel}>{label}</span><span style={s.statValue}>{val}</span></div>
        ))}
      </div>
      {showSequence && <div style={s.instructionCard}><h3 style={s.instructionH3}>👀 Watch the sequence!</h3><p style={s.instructionP}>Memorize the order of the flashing buttons</p></div>}
      {playerTurn && <div style={s.instructionCard}><h3 style={s.instructionH3}>🎮 Your turn!</h3><p style={s.instructionP}>Tap the buttons in the same order</p></div>}
      <div style={s.gameContainer}>
        <div style={s.tapGrid}>
          {Array.from({ length: 9 }, (_, i) => {
            const isHighlighted = showSequence && i === game.sequence[sequenceIndex];
            const isCorrectNext = playerTurn && i === game.sequence[gameState.currentStep];
            return (
              <button key={i} style={{ ...s.tapBtn, ...(isHighlighted ? s.tapBtnHighlight : {}), ...(!playerTurn ? s.tapBtnDisabled : {}) }}
                onClick={() => handleButtonClick(i)} disabled={!playerTurn}>
                {playerTurn && isCorrectNext && <div style={s.stepIndicator}>{gameState.currentStep + 1}</div>}
              </button>
            );
          })}
        </div>
      </div>
      <div style={s.progressContainer}>
        <div style={s.progressLabel}>Sequence Progress</div>
        <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${(gameState.currentStep / game.sequence.length) * 100}%` }} /></div>
      </div>
      <div style={s.tipBox}>💡 <strong>Pro tip:</strong> Build combos by tapping correctly in a row!</div>
    </div>
  );
}