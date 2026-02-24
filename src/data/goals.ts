import { DailyGoalsGame, Goal } from '../types/game.types';
import { SeededRandom } from '../utils/gameGenerator';

const goalTemplates = {
  health: [
    "Drink 8 glasses of water today 💧",
    "Take a 20-minute walk 🚶‍♂️",
    "Do 10 minutes of stretching 🧘",
    "Eat at least 3 servings of vegetables 🥗",
    "Get 7-8 hours of sleep tonight 😴",
    "Practice deep breathing for 5 minutes 🫁",
    "Take the stairs instead of elevator 🪜",
    "Stand up and move every hour ⏰",
    "Meditate for 10 minutes 🧘‍♀️",
    "Avoid sugary snacks today 🚫🍭",
  ],
  productivity: [
    "Complete your top priority task ⭐",
    "Clear your email inbox 📧",
    "Organize your workspace 🗂️",
    "Plan tomorrow's schedule 📅",
    "Finish one pending task you've been avoiding ✅",
    "Review and update your to-do list 📝",
    "Spend 30 minutes learning something new 📚",
    "Back up important files ☁️",
    "Declutter one area of your space 🧹",
    "Set 3 clear goals for the week 🎯",
  ],
  learning: [
    "Read for 20 minutes 📖",
    "Watch an educational video 🎥",
    "Practice a new skill for 15 minutes 🎓",
    "Learn 5 new words in a foreign language 🗣️",
    "Listen to a podcast episode 🎧",
    "Take notes on something interesting you learned 📔",
    "Solve a puzzle or brain teaser 🧩",
    "Research a topic you're curious about 🔍",
    "Try a new recipe or cooking technique 👨‍🍳",
    "Practice a musical instrument 🎸",
  ],
  social: [
    "Call or message a friend or family member 📱",
    "Give someone a genuine compliment 💬",
    "Help someone with a small task 🤝",
    "Share something positive 😊",
    "Express gratitude to someone 🙏",
    "Spend quality time with loved ones ❤️",
    "Reach out to someone you haven't talked to in a while 💌",
    "Practice active listening in a conversation 👂",
    "Make someone smile today 😁",
    "Show appreciation to a colleague 👏",
  ],
  creative: [
    "Write in a journal for 10 minutes ✍️",
    "Take a creative photo 📸",
    "Doodle or sketch for fun 🎨",
    "Try a new recipe or cooking technique 🍳",
    "Rearrange or decorate a small space 🏠",
    "Listen to music you haven't heard before 🎵",
    "Write a short story or poem 📜",
    "Work on a hobby project for 20 minutes 🛠️",
    "Create something with your hands 🙌",
    "Experiment with a new art medium 🖌️",
  ],
};

export const generateDailyGoals = (
  dateString: string,
  random: SeededRandom
): DailyGoalsGame => {
  
  const categories: Array<'health' | 'productivity' | 'learning' | 'social' | 'creative'> = [
    'health',
    'productivity',
    'learning',
    'social',
    'creative',
  ];

  // Select 4 random goals from different categories
  const selectedGoals: Goal[] = [];
  const usedCategories = new Set<string>();
  const numberOfGoals = 4;

  while (selectedGoals.length < numberOfGoals && usedCategories.size < categories.length) {
    const categoryIndex = random.nextInt(0, categories.length - 1);
    const category = categories[categoryIndex];

    if (!usedCategories.has(category)) {
      const categoryGoals = goalTemplates[category];
      const goalIndex = random.nextInt(0, categoryGoals.length - 1);
      const goalText = categoryGoals[goalIndex];

      selectedGoals.push({
        id: `goal-${dateString}-${selectedGoals.length}`,
        text: goalText,
        completed: false,
        category,
      });

      usedCategories.add(category);
    }
  }

  return {
    id: `daily-goals-${dateString}`,
    type: 'daily-goals',
    title: 'Daily Goals',
    emoji: '✅',
    difficulty: 'easy',
    completed: false,
    goals: selectedGoals,
  };
};

/**
 * Calculate score for Daily Goals
 */
export const calculateDailyGoalsScore = (goals: Goal[]): number => {
  const completedCount = goals.filter(g => g.completed).length;
  const baseScore = completedCount * 25;
  const perfectBonus = completedCount === goals.length ? 50 : 0;
  
  return baseScore + perfectBonus;
};
