import React, { useState, useEffect } from 'react';
import { calculateDailyGoalsScore } from './gameGenerator';

const categoryIcons = { health: '💪', productivity: '⚡', learning: '📚', social: '🤝', creative: '🎨' };
const categoryColors = { health: '#10b981', productivity: '#3b82f6', learning: '#8b5cf6', social: '#f59e0b', creative: '#ec4899' };

const s = {
  game: { minHeight: '100vh', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', padding: 16, fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  h2: { color: 'white', fontSize: 24, fontWeight: 700, margin: 0 },
  backBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  hero: { textAlign: 'center', color: 'white', marginBottom: 32 },
  heroH3: { fontSize: 28, margin: '0 0 8px', fontWeight: 700 },
  heroP: { fontSize: 16, margin: 0, opacity: 0.9 },
  progressCircleContainer: { position: 'relative', width: 120, height: 120, margin: '0 auto 32px' },
  progressText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  progressNumber: { fontSize: 32, fontWeight: 700, color: 'white', lineHeight: 1 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  goalsList: { display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' },
  goalCard: { background: 'white', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' },
  goalCardCompleted: { background: '#f0fdf4' },
  goalAccent: (color) => ({ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: color }),
  goalCheckbox: (completed) => ({ flexShrink: 0, width: 28, height: 28, border: completed ? 'none' : '3px solid #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: completed ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white' }),
  goalContent: { flex: 1 },
  goalHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  categoryLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b' },
  goalText: { fontSize: 15, color: '#1e293b', lineHeight: 1.5, margin: 0, fontWeight: 500 },
  goalTextCompleted: { textDecoration: 'line-through', opacity: 0.7 },
  successMessage: { background: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: '32px 24px', textAlign: 'center', margin: '24px 0', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  motivationBox: { background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 20, margin: '24px 0', border: '1px solid rgba(255,255,255,0.2)' },
  tipBox: { background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: 'white', fontSize: 13, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', marginTop: 24 },
  completionCard: { background: 'white', borderRadius: 24, padding: '40px 24px', textAlign: 'center', marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  scoreDisplay: { background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', padding: 16, borderRadius: 12, fontSize: 18, marginBottom: 20 },
};

export default function DailyGoals({ game, onComplete, onBack }) {
  const [goals, setGoals] = useState(game.goals);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const allCompleted = goals.every(goal => goal.completed);
    if (allCompleted && goals.length > 0 && !game.completed) {
      const score = calculateDailyGoalsScore(goals);
      setShowConfetti(true);
      setTimeout(() => onComplete(true, score), 1500);
    }
  }, [goals]);

  const toggleGoal = (goalId) => {
    setGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, completed: !goal.completed } : goal));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = (completedCount / goals.length) * 100;
  const circumference = 2 * Math.PI * 52;

  if (game.completed) {
    return (
      <div style={s.game}>
        <div style={s.header}><button style={s.backBtn} onClick={onBack}>← Back</button><h2 style={s.h2}>✅ Daily Goals</h2></div>
        <div style={s.completionCard}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h3>All Set!</h3><p style={{ color: '#64748b' }}>You've planned your day perfectly</p>
          <div style={s.scoreDisplay}>Score: <strong style={{ fontSize: 28 }}>{game.score}</strong></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
            {game.goals.map(goal => (
              <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 14, color: '#1e293b' }}>
                <span style={{ color: '#10b981', fontSize: 18, fontWeight: 700 }}>✓</span><span>{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.game}>
      {showConfetti && <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 120, zIndex: 1000, pointerEvents: 'none' }}>🎉</div>}
      <div style={s.header}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <div style={s.headerInfo}><h2 style={s.h2}>✅ Daily Goals</h2><span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: '#34d399', color: '#064e3b' }}>Intentions</span></div>
      </div>
      <div style={s.hero}><h3 style={s.heroH3}>☀️ Set Your Intentions</h3><p style={s.heroP}>Choose the goals you want to achieve today</p></div>
      <div style={s.progressCircleContainer}>
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          <circle stroke="#e5e7eb" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60" />
          <circle stroke="url(#grad)" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
        </svg>
        <div style={s.progressText}><div style={s.progressNumber}>{completedCount}/{goals.length}</div><div style={s.progressLabel}>Goals</div></div>
      </div>
      <div style={s.goalsList}>
        {goals.map(goal => (
          <div key={goal.id} style={{ ...s.goalCard, ...(goal.completed ? s.goalCardCompleted : {}) }} onClick={() => toggleGoal(goal.id)}>
            <div style={s.goalAccent(categoryColors[goal.category])} />
            <div style={s.goalCheckbox(goal.completed)}>{goal.completed && <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>✓</span>}</div>
            <div style={s.goalContent}>
              <div style={s.goalHeader}><span style={{ fontSize: 18 }}>{categoryIcons[goal.category]}</span><span style={s.categoryLabel}>{goal.category}</span></div>
              <p style={{ ...s.goalText, ...(goal.completed ? s.goalTextCompleted : {}) }}>{goal.text}</p>
            </div>
          </div>
        ))}
      </div>
      {completedCount === goals.length && (
        <div style={s.successMessage}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌟</div>
          <h4 style={{ fontSize: 24, margin: '0 0 8px', color: '#1e293b' }}>Amazing! All goals set!</h4>
          <p style={{ fontSize: 16, margin: 0, color: '#64748b' }}>Now go make them happen!</p>
        </div>
      )}
      <div style={s.motivationBox}>
        <p style={{ color: 'white', fontSize: 14, fontStyle: 'italic', margin: 0, textAlign: 'center', lineHeight: 1.6 }}>"The secret of getting ahead is getting started." - Mark Twain</p>
      </div>
      <div style={s.tipBox}>💡 <strong>Tip:</strong> Come back throughout the day to check off completed goals!</div>
    </div>
  );
}