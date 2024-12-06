'use strict';

import { wordBank } from "./data.js";
import { listen, select, selectAll } from './utils.js';

const startButton = select(".start-button");
const resetButton = select(".reset-button");
const timerDisplay = select(".timer");
const wordDisplay = select(".generate-word");
const scoreDisplay = select(".score");
const textInput = select(".text-input");
const backgroundMusic = select("#background-music");
const sidebar = select(".sidebar");
const topScoresList = select(".top-scores");

const topScores = [];

let timer;
let timeRemaining = 60;
let score = 0; 
let totalHits = 0;
let currentScore;

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
  startMusic();
  sidebar.classList.remove('visible');
  toggleStartButton(true);
  toggleResetButton(true);
}

function toggleStartButton(gameStarted) {
  startButton.style.display = gameStarted ? 'none' : 'inline-block';
}

function toggleResetButton(gameStarted) {
  resetButton.style.display = gameStarted ? 'inline-block' : 'none';
}

function resetScore() {
  score = 0;
  totalHits = 0;
}

function hideSidebar() {
  sidebar.classList.remove('visible');
  sidebar.style.display = 'none';
}

function resetClock() {
  timerDisplay.innerText = "01:00";
  scoreDisplay.innerText = "0";
  timeRemaining = 60;
}

function resetInput() {
  textInput.value = "";
  textInput.disabled = false;
}

function startMusic() {
  if (backgroundMusic) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
  }
}

function resetMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

function resetGame() {
  clearInterval(timer);
  hideSidebar();
  resetScore();
  resetClock();
  resetInput();
  resetMusic();
  toggleResetButton(false);
  toggleStartButton(false);
  wordDisplay.innerText = "PRESS START";
}

function timerEnds() {
  if (timeRemaining <= 0) {
    clearInterval(timer);
    endGame();
  }
}

function setTime() {
  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      timerDisplay.innerText = formatTime(timeRemaining);
    } else {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function startTimer() {
  timerDisplay.innerText = formatTime(timeRemaining);
  setTime();
  timerEnds();
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
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function saveScore() {
  currentScore.hits = score;
  topScores.push(currentScore);
  topScores.sort((a, b) => b.hits - a.hits);
  topScores.splice(9);
  localStorage.setItem('topScores', JSON.stringify(topScores));
}

function checkIfScores() {
  if (savedScores) {
    const parsedScores = JSON.parse(savedScores);
    topScores.length = 0;
    parsedScores.forEach(scoreData => {
      const recreatedScore = new Score(new Date(scoreData.date), scoreData.hits);
      topScores.push(recreatedScore);
    });
  }
}

function loadScores() {
  const savedScores = localStorage.getItem('topScores');
  checkIfScores();
}

function createScoresList() {
  topScores.forEach((scoreObj, index) => {
    const li = document.createElement('li');
    li.innerText = `#${index + 1} - Hits: ${scoreObj.getHits()} - ${scoreObj.percentage}% of words - Date: ${scoreObj.getDate()}`;
    topScoresList.appendChild(li);
  });
}

function showScoreBoard() {
  topScoresList.innerHTML = '';
  createScoresList();
  sidebar.classList.add('visible');
  sidebar.style.display = 'flex';
}

listen(resetButton, 'click', resetGame);
listen(startButton, 'click', startGame);
listen(textInput, 'input', checkInput);