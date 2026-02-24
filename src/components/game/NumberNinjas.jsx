import React, { useState, useEffect, useRef } from 'react';
import { calculateNumberNinjasScore } from './gameGenerator';

const s = {
  game: { minHeight: '100vh', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 16, fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  h2: { color: 'white', fontSize: 24, fontWeight: 700, margin: 0 },
  backBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  statsBar: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 },
  stat: { background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' },
  statLabel: { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { display: 'block', color: 'white', fontSize: 18, fontWeight: 700 },
  problemCard: { background: 'white', borderRadius: 24, padding: '48px 24px', margin: '32px 0', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center', minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  equation: { fontSize: 48, fontWeight: 700, color: '#0f172a', letterSpacing: 4 },
  answerForm: { display: 'flex', gap: 12, margin: '24px 0' },
  answerInput: { flex: 1, background: 'white', border: '3px solid rgba(255,255,255,0.5)', borderRadius: 16, padding: 20, fontSize: 28, fontWeight: 700, textAlign: 'center', color: '#0f172a' },
  submitBtn: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: 16, padding: '20px 32px', fontSize: 18, fontWeight: 700, cursor: 'pointer', minWidth: 120 },
  feedbackFlash: (type) => ({ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '32px 48px', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', zIndex: 1000, textAlign: 'center' }),
  progressContainer: { margin: '24px 0' },
  progressLabel: { color: 'white', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, opacity: 0.9 },
  progressBar: { width: '100%', height: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: 10, transition: 'width 0.3s ease' },
  quickStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '24px 0' },
  quickStat: { background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, color: 'white', fontWeight: 600 },
  tipBox: { background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: 'white', fontSize: 13, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', marginTop: 24 },
  completionCard: { background: 'white', borderRadius: 24, padding: '40px 24px', textAlign: 'center', marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  scoreDisplay: { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: 16, borderRadius: 12, fontSize: 18 },
  diffBadge: (diff) => ({ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: diff === 'easy' ? '#34d399' : diff === 'medium' ? '#fbbf24' : '#f87171', color: diff === 'easy' ? '#064e3b' : diff === 'medium' ? '#78350f' : '#7f1d1d' }),
};

export default function NumberNinjas({ game, onComplete, onBack }) {
  const [problems, setProblems] = useState(game.problems);
  const [currentProblem, setCurrentProblem] = useState(game.currentProblem);
  const [userAnswer, setUserAnswer] = useState('');
  const [streak, setStreak] = useState(game.streak);
  const [lives, setLives] = useState(game.lives);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const currentProblemData = problems[currentProblem];

  useEffect(() => {
    if (isPlaying && currentProblemData) {
      setTimeRemaining(game.timeLimit);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => { if (prev <= 1) { handleWrongAnswer(); return game.timeLimit; } return prev - 1; });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [isPlaying, currentProblem]);

  useEffect(() => { if (inputRef.current && isPlaying) inputRef.current.focus(); }, [currentProblem, isPlaying]);

  const moveToNext = () => {
    if (currentProblem < problems.length - 1) setCurrentProblem(prev => prev + 1);
    else handleGameOver();
  };

  const handleCorrectAnswer = () => {
    setFeedback('correct'); setStreak(prev => prev + 1);
    const updatedProblems = [...problems];
    updatedProblems[currentProblem] = { ...currentProblemData, userAnswer: parseFloat(userAnswer), isCorrect: true };
    setProblems(updatedProblems);
    setTimeout(() => { setFeedback(null); setUserAnswer(''); moveToNext(); }, 600);
  };

  const handleWrongAnswer = () => {
    setFeedback('wrong'); setStreak(0);
    const newLives = lives - 1; setLives(newLives);
    const updatedProblems = [...problems];
    updatedProblems[currentProblem] = { ...currentProblemData, userAnswer: userAnswer ? parseFloat(userAnswer) : undefined, isCorrect: false };
    setProblems(updatedProblems);
    setTimeout(() => { setFeedback(null); setUserAnswer(''); if (newLives <= 0) handleGameOver(); else moveToNext(); }, 800);
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const score = calculateNumberNinjasScore(problems, streak, lives);
    onComplete(true, score);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer || !currentProblemData) return;
    if (parseFloat(userAnswer) === currentProblemData.correctAnswer) handleCorrectAnswer();
    else handleWrongAnswer();
  };

  if (game.completed) {
    return (
      <div style={s.game}>
        <div style={s.header}><button style={s.backBtn} onClick={onBack}>← Back</button><h2 style={s.h2}>🔢 Number Ninjas</h2></div>
        <div style={s.completionCard}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h3>Already Completed!</h3>
          <p style={{ color: '#64748b' }}>Problems: {game.problems.filter(p => p.isCorrect).length}/{game.problems.length}</p>
          <div style={s.scoreDisplay}>Score: <strong style={{ fontSize: 28 }}>{game.score}</strong></div>
        </div>
      </div>
    );
  }
  if (!currentProblemData) return <div style={s.game}><p style={{ color: 'white' }}>Loading...</p></div>;

  return (
    <div style={s.game}>
      {feedback && (
        <div style={s.feedbackFlash(feedback)}>
          <div style={{ fontSize: 64, color: feedback === 'correct' ? '#10b981' : '#ef4444' }}>{feedback === 'correct' ? '✓' : '✗'}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 12 }}>
            {feedback === 'correct' ? 'Correct!' : `Wrong! Answer: ${currentProblemData.correctAnswer}`}
          </div>
        </div>
      )}
      <div style={s.header}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <div style={s.headerInfo}><h2 style={s.h2}>🔢 Number Ninjas</h2><span style={s.diffBadge(game.difficulty)}>{game.difficulty}</span></div>
      </div>
      <div style={s.statsBar}>
        {[['Time', `${timeRemaining}s`], ['Problem', `${currentProblem + 1}/${problems.length}`], ['Streak', `${streak}🔥`], ['Lives', '❤️'.repeat(lives)]].map(([label, val]) => (
          <div key={label} style={s.stat}><span style={s.statLabel}>{label}</span><span style={s.statValue}>{val}</span></div>
        ))}
      </div>
      <div style={s.problemCard}>
        <div style={s.equation}>{currentProblemData.num1} {currentProblemData.operation} {currentProblemData.num2} = ?</div>
      </div>
      <form onSubmit={handleSubmit} style={s.answerForm}>
        <input ref={inputRef} type="number" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
          placeholder="Your answer..." style={s.answerInput} disabled={!isPlaying} inputMode="numeric" />
        <button type="submit" style={{ ...s.submitBtn, opacity: (!userAnswer || !isPlaying) ? 0.5 : 1 }} disabled={!userAnswer || !isPlaying}>Submit</button>
      </form>
      <div style={s.progressContainer}>
        <div style={s.progressLabel}>Overall Progress</div>
        <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${((currentProblem + 1) / problems.length) * 100}%` }} /></div>
      </div>
      <div style={s.quickStats}>
        <div style={s.quickStat}><span style={{ fontSize: 24 }}>✓</span><span>{problems.filter(p => p.isCorrect).length} Correct</span></div>
        <div style={s.quickStat}><span style={{ fontSize: 24 }}>✗</span><span>{problems.filter(p => p.isCorrect === false).length} Wrong</span></div>
      </div>
      <div style={s.tipBox}>💡 <strong>Pro tip:</strong> Speed matters! Answer quickly to maintain your streak!</div>
    </div>
  );
}