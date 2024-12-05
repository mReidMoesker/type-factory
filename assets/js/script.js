const startButton = document.querySelector(".start-button");
const resetButton = document.querySelector(".reset-button");
const timerDisplay = document.querySelector(".timer");
const wordDisplay = document.querySelector(".generate-word");
const scoreDisplay = document.querySelector(".score");
const textInput = document.querySelector(".text-input");
const backgroundMusic = document.getElementById("background-music");
const sidebar = document.querySelector(".sidebar");
const topScoresList = document.querySelector(".top-scores");

const topScores = [];

let timer;
let timeRemaining = 60;
let score = 0; 
let totalHits = 0;
let currentScore;

const wordBank = [
  'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
  'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
  'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
  'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
  'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'phone',
  'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
  'velvet', 'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze',
  'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology',
  'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
  'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
  'butterfly', 'discovery', 'ambition', 'music', 'eagle', 'crown',
  'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'door', 'bird',
  'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
  'beach', 'economy', 'interview', 'awesome', 'challenge', 'science',
  'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software',
  'update', 'yellow', 'keyboard', 'window', 'beans', 'truck', 'sheep',
  'blossom', 'secret', 'wonder', 'enchantment', 'destiny', 'quest', 'sanctuary',
  'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil',
  'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
  'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort',
  'mask', 'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media',
  'orchestra', 'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond',
  'illusion', 'firefly', 'ocean', 'cascade', 'journey', 'laughter', 'horizon',
  'exploration', 'serendipity', 'infinity', 'silhouette', 'wanderlust',
  'marvel', 'nostalgia', 'serenity', 'reflection', 'twilight', 'harmony',
  'symphony', 'solitude', 'essence', 'melancholy', 'melody', 'vision',
  'silence', 'whimsical', 'eternity', 'cathedral', 'embrace', 'poet', 'ricochet',
  'mountain', 'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo',
  'fantasy', 'radiant', 'serene', 'legend', 'starlight', 'light', 'pressure',
  'bread', 'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle',
  'film', 'jupiter'
]

class Score {
  constructor(date = new Date(), hits = 0) {
    this.date = date;
    this.hits = hits;
  }

  get hits() {
    return this._hits;
  }

  set hits(value) {
    this._hits = value;
    this.calculatePercentage();
  }

  get percentage() {
    return this._percentage;
  }

  calculatePercentage() {
    // Calculate the percentage based on wordBank length instead of totalHits
    if (wordBank.length > 0) {
      this._percentage = ((this._hits / wordBank.length) * 100).toFixed(2);
    } else {
      this._percentage = 0;
    }
  }

  getDate() {
    return this.date.toLocaleString();
  }

  getHits() {
    return this.hits;
  }
}

function startGame() {
  currentScore = new Score();
  resetGame();
  generateWord();
  startTimer();
  textInput.focus();
  sidebar.classList.remove('visible');

  if (backgroundMusic) {
    try {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
    } catch (error) {
      console.warn('Background music not workning', error);
    }
  }
};

function resetGame() {
  clearInterval(timer);
  timeRemaining = 60;
  score = 0;
  totalHits = 0;
  timerDisplay.innerText = "01:00";
  scoreDisplay.innerText = "0";
  wordDisplay.innerText = "PRESS START";
  textInput.value = "";
  textInput.disabled = false;
  sidebar.classList.remove("visible");

  if (backgroundMusic) {
    try {
      backgroundMusic.pause();
    } catch (error) {
      console.warn("Background music could not be paused:", error);
    }
  }
};

function startTimer() {
  timerDisplay.innerText = formatTime(timeRemaining);
  timer = setInterval(() => {
    timeRemaining--;
    timerDisplay.innerText = formatTime(timeRemaining);
    if (timeRemaining <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function endGame() {
  wordDisplay.innerText = "TIME'S UP!";
  textInput.disabled = true;
  saveScore();
  showScoreBoard();
  
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

function generateWord() {
  const randomIndex = Math.floor(Math.random() * wordBank.length);
  wordDisplay.innerText = wordBank[randomIndex];
  totalHits++;
}

function checkInput() {
  if (textInput.value.trim().toLowerCase() === wordDisplay.innerText.toLowerCase()) {
    score++;
    scoreDisplay.innerText = score;
    textInput.value = '';
    currentScore.hits = score;
    generateWord();
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

  function saveScore() {
  currentScore.hits = score;
  topScores.push(currentScore);
  topScores = topScores.sort((a, b) => b.hits - a.hits).slice(0, 5);
}

function showScoreBoard() {
  topScoresList.innerHTML = '';
  topScores.forEach((scoreObj, index) => {
    const li = document.createElement('li');
    li.innerText = `#${index + 1} - Hits: ${scoreObj.getHits()} - ${scoreObj.percentage}% of words - Date: ${scoreObj.getDate()}`;
    topScoresList.appendChild(li);
  });
  sidebar.classList.add('visible');
  sidebar.style.display = 'flex';}

function hideSidebar() {
  sidebar.classList.remove('visible');
  sidebar.style.display = 'none';
}

resetButton.addEventListener('click', hideSidebar);
startButton.addEventListener('click', startGame);
textInput.addEventListener('input', checkInput);
