/**
 * Simple seeded random number generator
 */
export class SeededRandom {
  constructor(seedString) {
    this.seed = this.hashCode(seedString);
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayDate = () => formatDate(new Date());

export const generateRandomColor = (random) => {
  const r = random.nextInt(0, 255);
  const g = random.nextInt(0, 255);
  const b = random.nextInt(0, 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const createSimilarColor = (hexColor, difference) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const newR = Math.max(0, Math.min(255, r + difference));
  const newG = Math.max(0, Math.min(255, g + difference));
  const newB = Math.max(0, Math.min(255, b + difference));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

// --- QuickTap ---
export const generateQuickTapGame = (dateString, random) => {
  const difficultyRoll = random.nextInt(1, 3);
  let sequenceLength, difficulty, timeLimit;
  if (difficultyRoll === 1) { sequenceLength = 5; difficulty = 'easy'; timeLimit = 30; }
  else if (difficultyRoll === 2) { sequenceLength = 7; difficulty = 'medium'; timeLimit = 25; }
  else { sequenceLength = 10; difficulty = 'hard'; timeLimit = 20; }
  const sequence = [];
  for (let i = 0; i < sequenceLength; i++) sequence.push(random.nextInt(0, 8));
  return { id: `quick-tap-${dateString}`, type: 'quick-tap', title: 'Quick Tap', emoji: '🎯', difficulty, completed: false, sequence, currentStep: 0, mistakes: 0, timeLimit, comboMultiplier: 1 };
};

export const calculateQuickTapScore = (sequence, mistakes, timeRemaining, comboMultiplier) => {
  const baseScore = sequence.length * 10;
  const accuracyBonus = Math.max(0, 50 - (mistakes * 10));
  const speedBonus = Math.floor(timeRemaining * 2);
  const comboBonus = (comboMultiplier - 1) * 20;
  return baseScore + accuracyBonus + speedBonus + comboBonus;
};

// --- ColorMatch ---
export const generateColorMatchGame = (dateString, random) => {
  const difficultyRoll = random.nextInt(1, 3);
  let roundCount, difficulty, timeLimit, colorDifference;
  if (difficultyRoll === 1) { roundCount = 5; difficulty = 'easy'; timeLimit = 60; colorDifference = 40; }
  else if (difficultyRoll === 2) { roundCount = 7; difficulty = 'medium'; timeLimit = 50; colorDifference = 25; }
  else { roundCount = 10; difficulty = 'hard'; timeLimit = 45; colorDifference = 15; }
  const rounds = [];
  for (let i = 0; i < roundCount; i++) {
    let gridSize = i < 2 ? 3 : i < 5 ? 4 : 5;
    const baseColor = generateRandomColor(random);
    const differentColor = createSimilarColor(baseColor, colorDifference);
    const differentPosition = random.nextInt(0, (gridSize * gridSize) - 1);
    rounds.push({ gridSize, baseColor, differentColor, differentPosition, completed: false });
  }
  return { id: `color-match-${dateString}`, type: 'color-match', title: 'Color Match', emoji: '🎨', difficulty, completed: false, rounds, currentRound: 0, streak: 0, timeLimit };
};

export const calculateColorMatchScore = (rounds, streak, timeRemaining) => {
  const completedRounds = rounds.filter(r => r.completed).length;
  const baseScore = completedRounds * 20;
  const streakBonus = streak * 15;
  const timeBonus = Math.floor(timeRemaining * 2);
  const perfectBonus = completedRounds === rounds.length ? 100 : 0;
  return baseScore + streakBonus + timeBonus + perfectBonus;
};

// --- NumberNinjas ---
export const generateNumberNinjasGame = (dateString, random) => {
  const difficultyRoll = random.nextInt(1, 3);
  let problemCount, difficulty, timeLimit, lives, numRange;
  if (difficultyRoll === 1) { problemCount = 10; difficulty = 'easy'; timeLimit = 8; lives = 3; numRange = { min: 1, max: 20 }; }
  else if (difficultyRoll === 2) { problemCount = 12; difficulty = 'medium'; timeLimit = 6; lives = 3; numRange = { min: 5, max: 50 }; }
  else { problemCount = 15; difficulty = 'hard'; timeLimit = 5; lives = 2; numRange = { min: 10, max: 100 }; }
  const problems = [];
  const operations = ['+', '-', '×', '÷'];
  for (let i = 0; i < problemCount; i++) {
    const operation = operations[random.nextInt(0, operations.length - 1)];
    let num1, num2, correctAnswer;
    if (operation === '+') { num1 = random.nextInt(numRange.min, numRange.max); num2 = random.nextInt(numRange.min, numRange.max); correctAnswer = num1 + num2; }
    else if (operation === '-') { const larger = random.nextInt(numRange.min, numRange.max); const smaller = random.nextInt(numRange.min, larger); num1 = larger; num2 = smaller; correctAnswer = num1 - num2; }
    else if (operation === '×') { const maxMult = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 15 : 20; num1 = random.nextInt(2, maxMult); num2 = random.nextInt(2, maxMult); correctAnswer = num1 * num2; }
    else { const divisor = random.nextInt(2, difficulty === 'easy' ? 10 : 15); const quotient = random.nextInt(2, difficulty === 'easy' ? 10 : 15); num1 = divisor * quotient; num2 = divisor; correctAnswer = quotient; }
    problems.push({ num1, num2, operation, correctAnswer });
  }
  return { id: `number-ninjas-${dateString}`, type: 'number-ninjas', title: 'Number Ninjas', emoji: '🔢', difficulty, completed: false, problems, currentProblem: 0, streak: 0, timeLimit, lives };
};

export const calculateNumberNinjasScore = (problems, streak, lives) => {
  const correctCount = problems.filter(p => p.isCorrect).length;
  const baseScore = correctCount * 15;
  const streakBonus = streak * 10;
  const livesBonus = lives * 30;
  const perfectBonus = correctCount === problems.length ? 150 : 0;
  return baseScore + streakBonus + livesBonus + perfectBonus;
};

// --- WordChain ---
const WORD_DICTIONARY = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day',
  'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy',
  'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'had', 'may', 'oil', 'own', 'run', 'set', 'try',
  'able', 'back', 'ball', 'bear', 'beat', 'been', 'bell', 'best', 'bill', 'bird', 'blow', 'blue', 'boat',
  'book', 'born', 'both', 'burn', 'busy', 'call', 'came', 'card', 'care', 'case', 'cast', 'city', 'club',
  'coal', 'coat', 'code', 'cold', 'come', 'cook', 'cool', 'cope', 'copy', 'corn', 'cost', 'crew', 'crop',
  'dark', 'data', 'date', 'dawn', 'dead', 'deal', 'dear', 'debt', 'deep', 'deny', 'desk', 'diet', 'door',
  'down', 'drag', 'draw', 'drop', 'drug', 'duck', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy',
  'edge', 'even', 'ever', 'face', 'fact', 'fail', 'fair', 'fall', 'farm', 'fast', 'fate', 'fear', 'feed',
  'feel', 'feet', 'fell', 'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five',
  'flat', 'flow', 'folk', 'food', 'foot', 'form', 'fort', 'four', 'free', 'from', 'fuel', 'full', 'fund',
  'gain', 'game', 'gate', 'gave', 'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'goal', 'goes', 'gold',
  'golf', 'gone', 'good', 'gray', 'grew', 'grey', 'grow', 'gulf', 'hair', 'half', 'hall', 'hand', 'hang',
  'hard', 'harm', 'hate', 'have', 'head', 'hear', 'heat', 'held', 'hell', 'help', 'here', 'hero', 'hide',
  'high', 'hill', 'hire', 'hold', 'hole', 'holy', 'home', 'hope', 'horn', 'host', 'hour', 'huge', 'hung',
  'hunt', 'hurt', 'idea', 'inch', 'into', 'iron', 'item', 'jack', 'join', 'jump', 'jury', 'just', 'keep',
  'kept', 'kick', 'kill', 'kind', 'king', 'knew', 'know', 'lack', 'lady', 'laid', 'lake', 'land', 'lane',
  'last', 'late', 'lead', 'left', 'less', 'life', 'lift', 'like', 'line', 'link', 'list', 'live', 'load',
  'loan', 'lock', 'long', 'look', 'lord', 'lose', 'loss', 'lost', 'loud', 'love', 'luck', 'made', 'mail',
  'main', 'make', 'male', 'many', 'mark', 'mass', 'mate', 'math', 'meal', 'mean', 'meat', 'meet', 'menu',
  'mile', 'milk', 'mill', 'mind', 'mine', 'miss', 'mode', 'moon', 'more', 'most', 'move', 'much', 'must',
  'name', 'near', 'neck', 'need', 'news', 'next', 'nice', 'nine', 'none', 'noon', 'nose', 'note', 'once',
  'only', 'onto', 'open', 'over', 'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'pale', 'palm', 'park',
  'part', 'pass', 'past', 'path', 'peak', 'pick', 'pink', 'pipe', 'plan', 'play', 'plot', 'plus', 'poem',
  'poet', 'pole', 'poll', 'pond', 'pool', 'poor', 'port', 'pose', 'post', 'pour', 'pray', 'pure', 'push',
  'race', 'rail', 'rain', 'rank', 'rare', 'rate', 'read', 'real', 'rear', 'rely', 'rent', 'rest', 'rice',
  'rich', 'ride', 'ring', 'rise', 'risk', 'road', 'rock', 'role', 'roll', 'roof', 'room', 'root', 'rope',
  'rose', 'rude', 'rule', 'rush', 'safe', 'said', 'sake', 'sale', 'salt', 'same', 'sand', 'save', 'seat',
  'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'ship', 'shop', 'shot', 'show', 'shut',
  'sick', 'side', 'sign', 'sing', 'sink', 'site', 'size', 'skin', 'slip', 'slow', 'snow', 'soft', 'soil',
  'sold', 'sole', 'some', 'song', 'soon', 'sort', 'soul', 'spot', 'star', 'stay', 'step', 'stop', 'such',
  'suit', 'sure', 'take', 'tale', 'talk', 'tall', 'tank', 'tape', 'task', 'team', 'tear', 'tell', 'tend',
  'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin', 'this', 'thus', 'tide', 'till',
  'tiny', 'told', 'toll', 'tone', 'took', 'tool', 'torn', 'tour', 'town', 'tree', 'trip', 'true', 'tune',
  'turn', 'twin', 'type', 'unit', 'used', 'user', 'vary', 'vast', 'very', 'vice', 'view', 'vote', 'wage',
  'wait', 'wake', 'walk', 'wall', 'want', 'warm', 'warn', 'wash', 'wave', 'ways', 'weak', 'wear', 'week',
  'well', 'went', 'were', 'west', 'what', 'when', 'whom', 'wide', 'wife', 'wild', 'will', 'wind', 'wine',
  'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word', 'wore', 'work', 'worn', 'yard', 'year', 'your',
  'zero', 'zone', 'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adult', 'after', 'again', 'agent',
  'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'angel',
  'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'array', 'arrow', 'aside',
  'asset', 'await', 'award', 'aware', 'badly', 'baker', 'bases', 'basic', 'basis', 'beach', 'began', 'begin',
  'being', 'below', 'bench', 'birth', 'black', 'blade', 'blame', 'blank', 'blind', 'block', 'blood', 'board',
  'boost', 'booth', 'bound', 'brain', 'brand', 'brave', 'bread', 'break', 'breed', 'brief', 'bring', 'broad',
  'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'carry', 'catch', 'cause', 'chain', 'chair', 'chart',
  'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'chose', 'civil', 'claim', 'class', 'clean', 'clear',
  'click', 'clock', 'close', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft', 'crash', 'crazy',
  'cream', 'crime', 'cross', 'crowd', 'crown', 'crude', 'curve', 'cycle', 'daily', 'dance', 'dealt', 'death',
  'debut', 'delay', 'delta', 'dense', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'dream', 'dress',
  'drink', 'drive', 'drove', 'dying', 'eager', 'early', 'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy',
  'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fault',
  'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash', 'fleet', 'floor', 'fluid',
  'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit',
  'fully', 'funny', 'giant', 'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass',
  'great', 'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'heart', 'heavy',
  'hence', 'horse', 'hotel', 'house', 'human', 'ideal', 'image', 'imply', 'index', 'inner', 'input', 'issue',
  'judge', 'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave',
  'legal', 'lemon', 'level', 'light', 'limit', 'links', 'lives', 'local', 'logic', 'loose', 'lower', 'lucky',
  'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal',
  'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth',
  'moved', 'movie', 'music', 'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse',
  'occur', 'ocean', 'offer', 'often', 'order', 'other', 'ought', 'outer', 'owned', 'owner', 'paint', 'panel',
  'paper', 'party', 'peace', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane',
  'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize',
  'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio',
  'reach', 'ready', 'refer', 'right', 'river', 'roman', 'rough', 'round', 'route', 'royal', 'rural', 'scale',
  'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf',
  'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sight', 'since', 'sixth', 'sixty',
  'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smoke', 'solid', 'solve', 'sorry', 'sound',
  'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'staff', 'stage',
  'stake', 'stand', 'start', 'state', 'steam', 'steel', 'stick', 'still', 'stock', 'stone', 'stood', 'store',
  'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table',
  'taken', 'taste', 'taxes', 'teach', 'tenth', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick',
  'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'tight', 'times', 'title', 'today', 'topic',
  'total', 'touch', 'tough', 'tower', 'track', 'trade', 'trail', 'train', 'trait', 'treat', 'trend', 'trial',
  'tribe', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice', 'under', 'union', 'unity', 'until',
  'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit', 'vital', 'vocal',
  'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman',
  'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'young', 'youth',
];

export const generateWordChainGame = (dateString, random) => {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'Y'];
  const difficultyRoll = random.nextInt(1, 3);
  let letterCount, difficulty, timeLimit, minWordLength;
  if (difficultyRoll === 1) { letterCount = 9; difficulty = 'easy'; timeLimit = 90; minWordLength = 3; }
  else if (difficultyRoll === 2) { letterCount = 9; difficulty = 'medium'; timeLimit = 60; minWordLength = 3; }
  else { letterCount = 9; difficulty = 'hard'; timeLimit = 45; minWordLength = 4; }

  const vowelCount = Math.floor(letterCount * 0.4);
  const consonantCount = letterCount - vowelCount;
  const letters = [];
  for (let i = 0; i < vowelCount; i++) letters.push(vowels[random.nextInt(0, vowels.length - 1)]);
  for (let i = 0; i < consonantCount; i++) letters.push(consonants[random.nextInt(0, consonants.length - 1)]);
  const shuffledLetters = random.shuffle(letters);
  const letterSet = shuffledLetters.map(l => l.toLowerCase());

  const possibleWords = WORD_DICTIONARY.filter(word => {
    if (word.length < minWordLength) return false;
    const wordLetters = word.toLowerCase().split('');
    const available = [...letterSet];
    return wordLetters.every(letter => {
      const idx = available.indexOf(letter);
      if (idx === -1) return false;
      available.splice(idx, 1);
      return true;
    });
  });

  return {
    id: `word-chain-${dateString}`, type: 'word-chain', title: 'Word Chain', emoji: '📝',
    difficulty, completed: false, letters: shuffledLetters, foundWords: [], minWordLength, timeLimit, possibleWords,
  };
};

export const calculateWordChainScore = (foundWords, possibleWords, timeRemaining) => {
  const baseScore = foundWords.reduce((sum, word) => sum + (word.length * 10), 0);
  const timeBonus = Math.floor(timeRemaining * 1.5);
  const completionRate = possibleWords.length > 0 ? foundWords.length / possibleWords.length : 0;
  const completionBonus = completionRate >= 0.5 ? 100 : completionRate >= 0.25 ? 50 : 0;
  return baseScore + timeBonus + completionBonus;
};

// --- DailyGoals ---
const goalTemplates = {
  health: [
    "Drink 8 glasses of water today 💧", "Take a 20-minute walk 🚶‍♂️",
    "Do 10 minutes of stretching 🧘", "Eat at least 3 servings of vegetables 🥗",
    "Get 7-8 hours of sleep tonight 😴", "Practice deep breathing for 5 minutes 🫁",
    "Take the stairs instead of elevator 🪜", "Stand up and move every hour ⏰",
    "Meditate for 10 minutes 🧘‍♀️", "Avoid sugary snacks today 🚫🍭",
  ],
  productivity: [
    "Complete your top priority task ⭐", "Clear your email inbox 📧",
    "Organize your workspace 🗂️", "Plan tomorrow's schedule 📅",
    "Finish one pending task you've been avoiding ✅", "Review and update your to-do list 📝",
    "Spend 30 minutes learning something new 📚", "Back up important files ☁️",
    "Declutter one area of your space 🧹", "Set 3 clear goals for the week 🎯",
  ],
  learning: [
    "Read for 20 minutes 📖", "Watch an educational video 🎥",
    "Practice a new skill for 15 minutes 🎓", "Learn 5 new words in a foreign language 🗣️",
    "Listen to a podcast episode 🎧", "Take notes on something interesting you learned 📔",
    "Solve a puzzle or brain teaser 🧩", "Research a topic you're curious about 🔍",
    "Try a new recipe or cooking technique 👨‍🍳", "Practice a musical instrument 🎸",
  ],
  social: [
    "Call or message a friend or family member 📱", "Give someone a genuine compliment 💬",
    "Help someone with a small task 🤝", "Share something positive 😊",
    "Express gratitude to someone 🙏", "Spend quality time with loved ones ❤️",
    "Reach out to someone you haven't talked to in a while 💌", "Practice active listening in a conversation 👂",
    "Make someone smile today 😁", "Show appreciation to a colleague 👏",
  ],
  creative: [
    "Write in a journal for 10 minutes ✍️", "Take a creative photo 📸",
    "Doodle or sketch for fun 🎨", "Try a new recipe or cooking technique 🍳",
    "Rearrange or decorate a small space 🏠", "Listen to music you haven't heard before 🎵",
    "Write a short story or poem 📜", "Work on a hobby project for 20 minutes 🛠️",
    "Create something with your hands 🙌", "Experiment with a new art medium 🖌️",
  ],
};

export const generateDailyGoals = (dateString, random) => {
  const categories = ['health', 'productivity', 'learning', 'social', 'creative'];
  const selectedGoals = [];
  const usedCategories = new Set();
  const numberOfGoals = 4;
  while (selectedGoals.length < numberOfGoals && usedCategories.size < categories.length) {
    const categoryIndex = random.nextInt(0, categories.length - 1);
    const category = categories[categoryIndex];
    if (!usedCategories.has(category)) {
      const categoryGoals = goalTemplates[category];
      const goalIndex = random.nextInt(0, categoryGoals.length - 1);
      selectedGoals.push({ id: `goal-${dateString}-${selectedGoals.length}`, text: categoryGoals[goalIndex], completed: false, category });
      usedCategories.add(category);
    }
  }
  return { id: `daily-goals-${dateString}`, type: 'daily-goals', title: 'Daily Goals', emoji: '✅', difficulty: 'easy', completed: false, goals: selectedGoals };
};

export const calculateDailyGoalsScore = (goals) => {
  const completedCount = goals.filter(g => g.completed).length;
  const baseScore = completedCount * 25;
  const perfectBonus = completedCount === goals.length ? 50 : 0;
  return baseScore + perfectBonus;
};

// --- Main generator ---
export const generateDailyGames = (dateString) => {
  const random = new SeededRandom(dateString);
  const games = [
    generateQuickTapGame(dateString, random),
    generateWordChainGame(dateString, random),
    generateColorMatchGame(dateString, random),
    generateNumberNinjasGame(dateString, random),
    generateDailyGoals(dateString, random),
  ];
  return { date: dateString, games, completed: false, totalScore: 0 };
};