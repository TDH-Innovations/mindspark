import React, { useState, useEffect, useRef } from 'react';
import { calculateWordChainScore } from './gameGenerator';

const s = {
  game: { minHeight: '100vh', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', padding: 16, fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  h2: { color: 'white', fontSize: 24, fontWeight: 700, margin: 0 },
  backBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  statsBar: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 },
  stat: { background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, textAlign: 'center' },
  statLabel: { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { display: 'block', color: 'white', fontSize: 20, fontWeight: 700 },
  letterGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 400, margin: '0 auto 24px' },
  letterTile: { background: 'rgba(255,255,255,0.9)', border: '3px solid rgba(255,255,255,0.5)', borderRadius: 16, padding: 20, fontSize: 28, fontWeight: 700, color: '#0891b2', cursor: 'pointer', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  currentWordDisplay: { background: 'white', borderRadius: 16, padding: 20, margin: '24px 0', minHeight: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  wordText: { flex: 1, fontSize: 24, fontWeight: 600, color: '#0f172a', letterSpacing: 2, textTransform: 'uppercase' },
  clearBtn: { background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 },
  actionButtons: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '24px 0' },
  submitBtn: { padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' },
  finishBtn: { padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' },
  foundWordsSection: { background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 20, margin: '24px 0' },
  foundWordH3: { color: 'white', margin: '0 0 16px 0', fontSize: 18 },
  foundWordsList: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  foundWord: { background: 'white', color: '#0891b2', padding: '8px 12px', borderRadius: 20, fontWeight: 600, fontSize: 14 },
  hintToggle: { background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', margin: '16px 0' },
  hintBox: { background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 16, margin: '12px 0' },
  completionCard: { background: 'white', borderRadius: 24, padding: '40px 24px', textAlign: 'center', marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  scoreDisplay: { background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: 'white', padding: 16, borderRadius: 12, fontSize: 18 },
  diffBadge: (diff) => ({ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: diff === 'easy' ? '#34d399' : diff === 'medium' ? '#fbbf24' : '#f87171', color: diff === 'easy' ? '#064e3b' : diff === 'medium' ? '#78350f' : '#7f1d1d' }),
  feedback: (type) => ({ textAlign: 'center', padding: 12, borderRadius: 12, fontWeight: 600, margin: '16px 0', background: type === 'valid' ? '#d1fae5' : type === 'invalid' ? '#fee2e2' : '#fef3c7', color: type === 'valid' ? '#065f46' : type === 'invalid' ? '#991b1b' : '#92400e' }),
};

export default function WordChain({ game, onComplete, onBack }) {
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState(game.foundWords);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);

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
    const score = calculateWordChainScore(foundWords, game.possibleWords, timeRemaining);
    onComplete(true, score);
  };

  const handleLetterClick = (letter) => { if (!isPlaying) return; setCurrentWord(prev => prev + letter); };

  const handleSubmit = () => {
    if (!currentWord) return;
    const wordLower = currentWord.toLowerCase();
    if (foundWords.map(w => w.toLowerCase()).includes(wordLower)) {
      setFeedback('duplicate'); setTimeout(() => setFeedback(null), 1000); return;
    }
    if (game.possibleWords.includes(wordLower)) {
      setFoundWords(prev => [...prev, currentWord]); setCurrentWord(''); setFeedback('valid'); setTimeout(() => setFeedback(null), 500);
    } else {
      setFeedback('invalid'); setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (game.completed) {
    return (
      <div style={s.game}>
        <div style={s.header}><button style={s.backBtn} onClick={onBack}>← Back</button><h2 style={s.h2}>📝 Word Chain</h2></div>
        <div style={s.completionCard}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h3>Already Completed!</h3>
          <p style={{ color: '#64748b' }}>Words found: {game.foundWords.length}</p>
          <div style={s.scoreDisplay}>Score: <strong style={{ fontSize: 28 }}>{game.score}</strong></div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.game}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <div style={s.headerInfo}><h2 style={s.h2}>📝 Word Chain</h2><span style={s.diffBadge(game.difficulty)}>{game.difficulty}</span></div>
      </div>
      <div style={s.statsBar}>
        {[['Time', `${timeRemaining}s`], ['Words', foundWords.length], ['Possible', game.possibleWords.length]].map(([label, val]) => (
          <div key={label} style={s.stat}><span style={s.statLabel}>{label}</span><span style={s.statValue}>{val}</span></div>
        ))}
      </div>
      <div style={s.letterGrid}>
        {game.letters.map((letter, index) => (
          <button key={index} style={{ ...s.letterTile, opacity: !isPlaying ? 0.5 : 1, cursor: !isPlaying ? 'not-allowed' : 'pointer' }}
            onClick={() => handleLetterClick(letter)} disabled={!isPlaying}>{letter}</button>
        ))}
      </div>
      <div style={s.currentWordDisplay}>
        <div style={s.wordText}>{currentWord || 'Tap letters to form words'}</div>
        {currentWord && <button style={s.clearBtn} onClick={() => setCurrentWord('')}>✕</button>}
      </div>
      {feedback && <div style={s.feedback(feedback)}>{feedback === 'valid' ? '✓ Great word!' : feedback === 'invalid' ? '✗ Not a valid word' : 'Already found!'}</div>}
      <div style={s.actionButtons}>
        <button style={{ ...s.submitBtn, opacity: (!currentWord || !isPlaying) ? 0.5 : 1 }} onClick={handleSubmit} disabled={!currentWord || !isPlaying}>Submit Word</button>
        <button style={s.finishBtn} onClick={handleGameOver} disabled={!isPlaying}>Finish Game</button>
      </div>
      <div style={s.foundWordsSection}>
        <h3 style={s.foundWordH3}>Found Words ({foundWords.length})</h3>
        <div style={s.foundWordsList}>
          {foundWords.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', margin: 0 }}>No words found yet!</p>
            : foundWords.map((word, index) => (
              <span key={index} style={s.foundWord}>{word} <small style={{ color: '#64748b' }}>({word.length * 10}pts)</small></span>
            ))}
        </div>
      </div>
      <button style={s.hintToggle} onClick={() => setShowHint(!showHint)}>{showHint ? '🙈 Hide' : '💡 Show'} Hint</button>
      {showHint && (
        <div style={s.hintBox}>
          <p style={{ margin: '0 0 8px', color: '#1e293b', fontSize: 14 }}><strong>Hint:</strong> There are {game.possibleWords.length} possible words!</p>
          <p style={{ margin: 0, color: '#1e293b', fontSize: 14 }}>Try common 3-4 letter words first.</p>
        </div>
      )}
    </div>
  );
}