import { useLocalStorage } from './useLocalStorage';
import { getTodayDate } from './gameGenerator';
// Note: useEffect removed as it's not needed here

const initialAchievements = [
  { id: 'first-game', title: 'First Steps', description: 'Complete your first game', icon: '🎯', unlocked: false, requirement: 1, progress: 0 },
  { id: 'week-streak', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false, requirement: 7, progress: 0 },
  { id: 'month-streak', title: 'Month Master', description: 'Maintain a 30-day streak', icon: '🏆', unlocked: false, requirement: 30, progress: 0 },
  { id: 'tap-master', title: 'Quick Hands', description: 'Complete 50 Quick Tap games', icon: '🎯', unlocked: false, requirement: 50, progress: 0 },
  { id: 'word-wizard', title: 'Word Wizard', description: 'Complete 50 Word Chain games', icon: '📚', unlocked: false, requirement: 50, progress: 0 },
  { id: 'eagle-eye', title: 'Eagle Eye', description: 'Complete 50 Color Match games', icon: '👁️', unlocked: false, requirement: 50, progress: 0 },
  { id: 'math-ninja', title: 'Math Ninja', description: 'Complete 50 Number Ninjas games', icon: '🔢', unlocked: false, requirement: 50, progress: 0 },
  { id: 'goal-crusher', title: 'Goal Crusher', description: 'Complete 50 Daily Goals', icon: '✅', unlocked: false, requirement: 50, progress: 0 },
  { id: 'century', title: 'Century Club', description: 'Complete 100 games total', icon: '💯', unlocked: false, requirement: 100, progress: 0 },
];

const initialStats = {
  totalGamesPlayed: 0, totalScore: 0, currentStreak: 0, longestStreak: 0,
  gamesCompleted: { 'quick-tap': 0, 'word-chain': 0, 'color-match': 0, 'number-ninjas': 0, 'daily-goals': 0 },
  highScores: { 'quick-tap': 0, 'word-chain': 0, 'color-match': 0, 'number-ninjas': 0 },
  achievements: initialAchievements,
  lastPlayedDate: '',
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useGameProgress = () => {
  const [stats, setStats] = useLocalStorage('mindspark_userStats', initialStats);

  const updateAchievements = (currentStats) => {
    return currentStats.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;
      let progress = 0;
      switch (achievement.id) {
        case 'first-game': progress = currentStats.totalGamesPlayed; break;
        case 'week-streak': progress = currentStats.currentStreak; break;
        case 'month-streak': progress = currentStats.currentStreak; break;
        case 'tap-master': progress = currentStats.gamesCompleted['quick-tap']; break;
        case 'word-wizard': progress = currentStats.gamesCompleted['word-chain']; break;
        case 'eagle-eye': progress = currentStats.gamesCompleted['color-match']; break;
        case 'math-ninja': progress = currentStats.gamesCompleted['number-ninjas']; break;
        case 'goal-crusher': progress = currentStats.gamesCompleted['daily-goals']; break;
        case 'century': progress = currentStats.totalGamesPlayed; break;
      }
      const unlocked = progress >= achievement.requirement;
      return { ...achievement, progress, unlocked, unlockedDate: unlocked && !achievement.unlocked ? getTodayDate() : achievement.unlockedDate };
    });
  };

  const recordGameCompletion = (gameType, score) => {
    const today = getTodayDate();
    setStats(prevStats => {
      const newStats = { ...prevStats, gamesCompleted: { ...prevStats.gamesCompleted }, highScores: { ...prevStats.highScores } };
      newStats.gamesCompleted[gameType]++;
      newStats.totalGamesPlayed++;
      newStats.totalScore += score;
      if (gameType !== 'daily-goals' && score > newStats.highScores[gameType]) {
        newStats.highScores[gameType] = score;
      }
      if (newStats.lastPlayedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = formatDate(yesterday);
        if (newStats.lastPlayedDate === yesterdayString) {
          newStats.currentStreak++;
        } else {
          newStats.currentStreak = 1;
        }
        if (newStats.currentStreak > newStats.longestStreak) newStats.longestStreak = newStats.currentStreak;
        newStats.lastPlayedDate = today;
      }
      newStats.achievements = updateAchievements(newStats);
      return newStats;
    });
  };

  const resetStats = () => setStats(initialStats);

  return { stats, recordGameCompletion, resetStats };
};