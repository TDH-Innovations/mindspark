import { WordChainGame } from '../types/game.types';
import { SeededRandom } from '../utils/gameGenerator';

// Common 3-5 letter words for validation
const WORD_DICTIONARY = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day',
  'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'time', 'two', 'way', 'who', 'boy',
  'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'had', 'may', 'oil', 'own', 'run', 'set', 'try',
  'able', 'back', 'ball', 'bear', 'beat', 'been', 'bell', 'best', 'bill', 'bird', 'blow', 'blue', 'boat',
  'book', 'born', 'both', 'burn', 'busy', 'call', 'came', 'camp', 'card', 'care', 'case', 'cash', 'cast',
  'cent', 'city', 'club', 'coal', 'coat', 'code', 'cold', 'come', 'cook', 'cool', 'cope', 'copy', 'corn',
  'cost', 'crew', 'crop', 'dark', 'data', 'date', 'dawn', 'dead', 'deal', 'dear', 'debt', 'deep', 'deny',
  'desk', 'dial', 'diet', 'disc', 'disk', 'door', 'down', 'drag', 'draw', 'drew', 'drop', 'drug', 'dual',
  'duck', 'duke', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy', 'edge', 'else', 'even', 'ever',
  'face', 'fact', 'fail', 'fair', 'fall', 'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'feet', 'fell',
  'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five', 'flat', 'flow', 'folk',
  'food', 'foot', 'ford', 'form', 'fort', 'four', 'free', 'from', 'fuel', 'full', 'fund', 'gain', 'game',
  'gate', 'gave', 'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'goal', 'goes', 'gold', 'golf', 'gone',
  'good', 'gray', 'grew', 'grey', 'grow', 'gulf', 'hair', 'half', 'hall', 'hand', 'hang', 'hard', 'harm',
  'hate', 'have', 'head', 'hear', 'heat', 'held', 'hell', 'help', 'here', 'hero', 'hide', 'high', 'hill',
  'hire', 'hold', 'hole', 'holy', 'home', 'hope', 'horn', 'host', 'hour', 'huge', 'hung', 'hunt', 'hurt',
  'idea', 'inch', 'into', 'iron', 'item', 'jack', 'jane', 'jean', 'john', 'join', 'jump', 'jury', 'just',
  'keen', 'keep', 'kent', 'kept', 'kick', 'kill', 'kind', 'king', 'knee', 'knew', 'know', 'lack', 'lady',
  'laid', 'lake', 'land', 'lane', 'last', 'late', 'lead', 'left', 'less', 'life', 'lift', 'like', 'line',
  'link', 'list', 'live', 'load', 'loan', 'lock', 'long', 'look', 'lord', 'lose', 'loss', 'lost', 'loud',
  'love', 'luck', 'made', 'mail', 'main', 'make', 'male', 'mall', 'many', 'mark', 'mass', 'mate', 'math',
  'meal', 'mean', 'meat', 'meet', 'menu', 'mere', 'mile', 'milk', 'mill', 'mind', 'mine', 'miss', 'mode',
  'moon', 'more', 'most', 'move', 'much', 'must', 'name', 'near', 'neck', 'need', 'news', 'next', 'nice',
  'nine', 'none', 'noon', 'norm', 'north', 'nose', 'note', 'once', 'only', 'onto', 'open', 'oral', 'over',
  'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'pale', 'palm', 'park', 'part', 'pass', 'past', 'path',
  'peak', 'pick', 'pink', 'pipe', 'plan', 'play', 'plot', 'plus', 'poem', 'poet', 'pole', 'poll', 'pond',
  'pool', 'poor', 'port', 'pose', 'post', 'pour', 'pray', 'prep', 'price', 'prime', 'pure', 'push', 'race',
  'rail', 'rain', 'rank', 'rare', 'rate', 'read', 'real', 'rear', 'rely', 'rent', 'rest', 'rice', 'rich',
  'ride', 'ring', 'rise', 'risk', 'road', 'rock', 'role', 'roll', 'roof', 'room', 'root', 'rope', 'rose',
  'rude', 'rule', 'rush', 'safe', 'said', 'sake', 'sale', 'salt', 'same', 'sand', 'save', 'seat', 'seed',
  'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'ship', 'shop', 'shot', 'show', 'shut', 'sick',
  'side', 'sign', 'sing', 'sink', 'site', 'size', 'skin', 'slip', 'slow', 'snow', 'soft', 'soil', 'sold',
  'sole', 'some', 'song', 'soon', 'sort', 'soul', 'spot', 'star', 'stay', 'step', 'stop', 'such', 'suit',
  'sure', 'take', 'tale', 'talk', 'tall', 'tank', 'tape', 'task', 'team', 'tear', 'tell', 'tend', 'term',
  'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin', 'this', 'thus', 'tide', 'till', 'time',
  'tiny', 'told', 'toll', 'tone', 'took', 'tool', 'tops', 'torn', 'tour', 'town', 'tree', 'trip', 'true',
  'tune', 'turn', 'twin', 'type', 'unit', 'upon', 'used', 'user', 'vary', 'vast', 'very', 'vice', 'view',
  'vote', 'wage', 'wait', 'wake', 'walk', 'wall', 'want', 'warm', 'warn', 'wash', 'wave', 'ways', 'weak',
  'wear', 'week', 'well', 'went', 'were', 'west', 'what', 'when', 'whom', 'wide', 'wife', 'wild', 'will',
  'wind', 'wine', 'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word', 'wore', 'work', 'worn', 'yard',
  'yeah', 'year', 'your', 'zero', 'zone',
  // 5-letter words
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree',
  'ahead', 'alarm', 'album', 'alert', 'align', 'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'angel',
  'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'array', 'arrow', 'aside',
  'asset', 'await', 'award', 'aware', 'badly', 'baker', 'bases', 'basic', 'basis', 'beach', 'began', 'begin',
  'being', 'below', 'bench', 'billy', 'birth', 'black', 'blade', 'blame', 'blank', 'blind', 'block', 'blood',
  'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'brave', 'bread', 'break', 'breed', 'brief', 'bring',
  'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch', 'cause', 'chain',
  'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'china', 'chose', 'civil', 'claim',
  'class', 'clean', 'clear', 'click', 'clock', 'close', 'coach', 'coast', 'could', 'count', 'court', 'cover',
  'craft', 'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd', 'crown', 'crude', 'curve', 'cycle', 'daily',
  'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'delta', 'dense', 'depth', 'doing', 'doubt', 'dozen',
  'draft', 'drama', 'drank', 'dream', 'dress', 'drill', 'drink', 'drive', 'drove', 'dying', 'eager', 'early',
  'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every',
  'exact', 'exist', 'extra', 'faith', 'false', 'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final',
  'first', 'fixed', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found',
  'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant', 'given', 'glass', 'globe',
  'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'great', 'green', 'gross', 'group', 'grown', 'guard',
  'guess', 'guest', 'guide', 'happy', 'harry', 'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house',
  'human', 'ideal', 'image', 'imply', 'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones',
  'judge', 'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave',
  'legal', 'lemon', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'logic', 'loose', 'lower',
  'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor', 'meant',
  'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount',
  'mouse', 'mouth', 'moved', 'movie', 'music', 'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted',
  'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other', 'ought', 'outer', 'owned', 'owner',
  'paint', 'panel', 'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch',
  'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime',
  'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise',
  'range', 'rapid', 'ratio', 'reach', 'ready', 'refer', 'right', 'river', 'robin', 'roger', 'roman', 'rough',
  'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall',
  'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'short',
  'shown', 'sight', 'since', 'sixth', 'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile',
  'smith', 'smoke', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend',
  'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam', 'steel',
  'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff',
  'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'taken', 'taste', 'taxes', 'teach', 'tenth', 'texas',
  'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three',
  'threw', 'throw', 'tight', 'times', 'title', 'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track',
  'trade', 'trail', 'train', 'trait', 'treat', 'trend', 'trial', 'tribe', 'tried', 'tries', 'truck', 'truly',
  'trust', 'truth', 'twice', 'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset', 'urban', 'usage',
  'usual', 'valid', 'value', 'video', 'virus', 'visit', 'vital', 'vocal', 'voice', 'waste', 'watch', 'water',
  'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse',
  'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'young', 'youth',
];

/**
 * Generate Word Chain game
 * Player creates words from a set of letters
 */
export const generateWordChainGame = (
  dateString: string,
  random: SeededRandom
): WordChainGame => {
  
  // Common vowels and consonants for balanced letter sets
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'Y'];

  // Determine difficulty
  const difficultyRoll = random.nextInt(1, 3);
  let letterCount: number;
  let difficulty: 'easy' | 'medium' | 'hard';
  let timeLimit: number;
  let minWordLength: number;

  if (difficultyRoll === 1) {
    letterCount = 9;
    difficulty = 'easy';
    timeLimit = 90;
    minWordLength = 3;
  } else if (difficultyRoll === 2) {
    letterCount = 10;
    difficulty = 'medium';
    timeLimit = 75;
    minWordLength = 3;
  } else {
    letterCount = 12;
    difficulty = 'hard';
    timeLimit = 60;
    minWordLength = 3;
  }

  // Generate balanced letter set (mix of vowels and consonants)
  const letters: string[] = [];
  const vowelCount = Math.floor(letterCount / 3);
  const consonantCount = letterCount - vowelCount;

  for (let i = 0; i < vowelCount; i++) {
    letters.push(vowels[random.nextInt(0, vowels.length - 1)]);
  }
  for (let i = 0; i < consonantCount; i++) {
    letters.push(consonants[random.nextInt(0, consonants.length - 1)]);
  }

  // Shuffle letters
  const shuffledLetters = random.shuffle(letters);

  // Find all possible words from this letter set
  const possibleWords = findPossibleWords(shuffledLetters, minWordLength);

  return {
    id: `word-chain-${dateString}`,
    type: 'word-chain',
    title: 'Word Chain',
    emoji: '🧠',
    difficulty,
    completed: false,
    letters: shuffledLetters,
    foundWords: [],
    minWordLength,
    timeLimit,
    possibleWords,
  };
};

/**
 * Find all valid words that can be made from given letters
 */
function findPossibleWords(letters: string[], minLength: number): string[] {
  const letterCounts = new Map<string, number>();
  letters.forEach(letter => {
    const upper = letter.toUpperCase();
    letterCounts.set(upper, (letterCounts.get(upper) || 0) + 1);
  });

  const possibleWords: string[] = [];

  for (const word of WORD_DICTIONARY) {
    if (word.length < minLength) continue;

    const wordUpper = word.toUpperCase();
    const wordLetterCounts = new Map<string, number>();
    
    for (const letter of wordUpper) {
      wordLetterCounts.set(letter, (wordLetterCounts.get(letter) || 0) + 1);
    }

    let canMake = true;
    for (const [letter, count] of wordLetterCounts) {
      if (!letterCounts.has(letter) || letterCounts.get(letter)! < count) {
        canMake = false;
        break;
      }
    }

    if (canMake) {
      possibleWords.push(word);
    }
  }

  return possibleWords;
}

/**
 * Calculate score for Word Chain game
 */
export const calculateWordChainScore = (
  foundWords: string[],
  possibleWords: string[],
  timeRemaining: number
): number => {
  const wordPoints = foundWords.reduce((total, word) => {
    // Longer words worth more points
    return total + (word.length * 10);
  }, 0);

  const completionBonus = Math.floor((foundWords.length / possibleWords.length) * 100);
  const timeBonus = Math.floor(timeRemaining * 1.5);

  return wordPoints + completionBonus + timeBonus;
};
