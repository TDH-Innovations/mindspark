import React, { useState } from 'react';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: 'white', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧠</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px' }}>Brain Boost</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '40px' }}>Your daily mental warm-up — 5 fun brain games</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { emoji: '🎯', name: 'Quick Tap', desc: 'Memory sequence' },
            { emoji: '🔢', name: 'Number Ninjas', desc: 'Math challenges' },
            { emoji: '🎨', name: 'Color Match', desc: 'Spot the difference' },
            { emoji: '📝', name: 'Word Chain', desc: 'Word building' },
            { emoji: '🏆', name: 'Daily Goals', desc: 'Track your streak' },
          ].map((game) => (
            <div
              key={game.name}
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{game.emoji}</div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{game.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{game.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ opacity: 0.7, fontSize: '0.85rem' }}>🚀 Full game logic coming soon — app is live!</p>
      </div>
    </div>
  );
}