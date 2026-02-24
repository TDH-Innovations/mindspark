import React from 'react';

export default function StatsScreen({ stats, onBack }) {
  const s = {
    screen: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: 16, fontFamily: 'sans-serif', color: 'white' },
    header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
    backBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: 12, fontSize: 16, cursor: 'pointer' },
    h1: { fontSize: 28, fontWeight: 700, margin: 0 },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 },
    statCard: { background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'center' },
    statNum: { fontSize: 40, fontWeight: 700, marginBottom: 4 },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 },
    section: { background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'rgba(255,255,255,0.9)' },
    achievementRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  };

  return (
    <div style={s.screen}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <h1 style={s.h1}>📊 Your Stats</h1>
      </div>

      <div style={s.statsGrid}>
        {[
          ['🎮', stats.totalGamesPlayed, 'Games Played'],
          ['⭐', stats.totalScore, 'Total Score'],
          ['🔥', stats.currentStreak, 'Current Streak'],
          ['🏆', stats.longestStreak, 'Best Streak'],
        ].map(([emoji, val, label]) => (
          <div key={label} style={s.statCard}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
            <div style={s.statNum}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>🏅 High Scores</div>
        {Object.entries(stats.highScores).map(([type, score]) => (
          <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{type.replace('-', ' ')}</span>
            <span style={{ fontWeight: 700, color: '#fbbf24' }}>{score} pts</span>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>🎖️ Achievements</div>
        {stats.achievements.map(achievement => (
          <div key={achievement.id} style={{ ...s.achievementRow, opacity: achievement.unlocked ? 1 : 0.5 }}>
            <div style={{ fontSize: 32, filter: achievement.unlocked ? 'none' : 'grayscale(100%)' }}>{achievement.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{achievement.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{achievement.description}</div>
              {!achievement.unlocked && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (achievement.progress / achievement.requirement) * 100)}%`, background: '#667eea', borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{achievement.progress}/{achievement.requirement}</div>
                </div>
              )}
              {achievement.unlocked && <div style={{ fontSize: 11, color: '#34d399', marginTop: 3 }}>✓ Unlocked!</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}