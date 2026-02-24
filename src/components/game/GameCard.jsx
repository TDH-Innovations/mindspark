import React from 'react';

const gameDescriptions = {
  'quick-tap': 'Test your memory & speed',
  'word-chain': 'Build words from letters',
  'color-match': 'Find the different shade',
  'number-ninjas': 'Lightning-fast math',
  'daily-goals': 'Set your daily intentions',
};

export default function GameCard({ game, onClick }) {
  const completed = game.completed;
  return (
    <div onClick={onClick} style={{
      background: completed ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'white',
      border: completed ? '2px solid #10b981' : '2px solid transparent',
      borderRadius: 20, padding: 20, cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s', fontFamily: 'sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 48 }}>{game.emoji}</span>
        {completed && (
          <span style={{ background: '#10b981', color: 'white', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>✓</span>
        )}
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>{game.title}</h3>
      <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>{gameDescriptions[game.type]}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
          background: game.difficulty === 'easy' ? '#dcfce7' : game.difficulty === 'medium' ? '#fef3c7' : '#fee2e2',
          color: game.difficulty === 'easy' ? '#166534' : game.difficulty === 'medium' ? '#92400e' : '#991b1b',
        }}>{game.difficulty}</span>
        {completed && game.score && (
          <span style={{ background: '#667eea', color: 'white', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{game.score} pts</span>
        )}
      </div>
    </div>
  );
}