const words = [
  "dinosaur",
  "love",
  "pineapple",
  "calendar",
  "robot",
  "building",
  "population",
  "weather",
  "bottle",
  "history",
  "dream",
  "character",
  "money",
  "absolute",
  "discipline",
  "machine",
  "accurate",
  "connection",
  "rainbow",
  "bicycle",
  "eclipse",
  "calculator",
  "trouble",
  "watermelon",
  "developer",
  "philosophy",
  "database",
  "periodic",
  "capitalism",
  "abominable",
  "component",
  "future",
  "pasta",
  "microwave",
  "jungle",
  "wallet",
  "canada",
  "coffee",
  "beauty",
  "agency",
  "chocolate",
  "eleven",
  "technology",
  "alphabet",
  "knowledge",
  "magician",
  "professor",
  "triangle",
  "earthquake",
  "baseball",
  "beyond",
  "evolution",
  "banana",
  "perfumer",
  "computer",
  "management",
  "discovery",
  "ambition",
  "music",
  "eagle",
  "crown",
  "chess",
  "laptop",
  "bedroom",
  "delivery",
  "enemy",
  "button",
  "superman",
  "library",
  "unboxing",
  "bookstore",
  "language",
  "homework",
  "fantastic",
  "economy",
  "interview",
  "awesome",
  "challenge",
  "science",
  "mystery",
  "famous",
  "league",
  "memory",
  "leather",
  "planet",
  "software",
  "update",
  "yellow",
  "keyboard",
  "window",
];

class Score {
  #date;
  #hits;
  #percentage;

  constructor(date, hits, percentage) {
    this.#date = date;
    this.#hits = hits;
    this.#percentage = percentage;
  }

  get date() {
    return this.#date;
  }

  get hits() {
    return this.#hits;
  }

  get percentage() {
    return this.#percentage;
  }
}

let currentWordIndex = 0;
let hits = 0;
let timer;
let isPlaying = false;
let gameScores = [];

const wordDisplay = document.getElementById("word");
const userInput = document.getElementById("user-input");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closePopup");

const popupDate = document.getElementById("popup-date");
const popupHits = document.getElementById("popup-hits");
const popupPercentage = document.getElementById("popup-percentage");

const buttonSound = new Audio("./assets/audio/button-click.wav");
const pingSound = new Audio("./assets/audio/ping-sound.mp3");
const backgroundSound = new Audio("./assets/audio/bg.wav");

const highScoresList = document.getElementById("highScoresList");

function updateHighScore() {
  const previousScores = localStorage.getItem("highScores");
  if (!previousScores) {
    const noGameBefore = `No games have been played`;
    highScoresList.innerHTML = `<li>${noGameBefore}</li>`;
  } else {
    const scoreArr = JSON.parse(previousScores);
    highScoresList.innerHTML = "";
    scoreArr.map((p, ind) => {
      const gameId = ind + 1;
      const gameHits = p.hits;
      const gamePercentage = p.percentage;
      const li = document.createElement("li");
      li.className = "highScoresItem";
      li.innerHTML = `<span>#${gameId}</span> <span>${gameHits} words</span><span> ${gamePercentage}</span>`;
      //append to highScoresList
      highScoresList.appendChild(li);
    });
  }
}

//disable the input
userInput.disabled = true;

updateHighScore();

// Function to start the game
function startGame() {
  backgroundSound.loop = true;
  backgroundSound.volume = 0.3;
  setTimeout(function () {
    backgroundSound.play();
  }, 1000);
  buttonSound.play();
  const max = 90;
  const min = 0;
  currentWordIndex = Math.floor(Math.random() * (max - min + 1)) + min;

  //focus to input;
  userInput.disabled = false;
  userInput.focus();

  if (!isPlaying) {
    isPlaying = true;
    startBtn.textContent = "Restart";
    // Start the timer
    let seconds = 20;
    timer = setInterval(() => {
      seconds--;
      timerDisplay.textContent = seconds;
      if (seconds === 0) {
        endGame();
      }
    }, 1000);

    // Display the first word
    showWord(words[currentWordIndex]);

    // Check input
    userInput.addEventListener("input", checkInput);
  } else {
    //restart the game
    buttonSound.play();
    clearInterval(timer);
    isPlaying = false;
    startBtn.disabled = false;
    startBtn.textContent = "Start";
    userInput.removeEventListener("input", checkInput);
    endGame();
  }
}

// Function to show a word
function showWord(word) {
  wordDisplay.textContent = word;
}

// Function to check input
function checkInput() {
  const typedWord = userInput.value.trim().toLowerCase();
  const currentWord = words[currentWordIndex];

  if (typedWord === currentWord) {
    pingSound.play();
    hits++;
    scoreDisplay.textContent = `Hits: ${hits}`;
    currentWordIndex++;
    userInput.value = "";

    // If all words are typed
    if (currentWordIndex === words.length) {
      endGame();
    } else {
      showWord(words[currentWordIndex]);
    }
  }
}

// Function to end the game
function endGame() {
  clearInterval(timer);
  isPlaying = false;
  startBtn.disabled = false;
  startBtn.textContent = "Start";
  userInput.removeEventListener("input", checkInput);

  // Calculate percentage
  const percentage = ((hits / words.length) * 100).toFixed(1) + "%";

  // Create Score object
  const date = new Date().toLocaleDateString();
  const score = {
    hits,
    date,
    percentage,
  };

  popupDate.innerText = `Date: ${date}`;
  popupHits.innerText = `Hits: ${hits}`;
  popupPercentage.innerText = `Percentage: ${percentage}`;

  //pushing score data to array;
  gameScores.push(score);

  //setting scores into localstorage

  const previousScores = localStorage.getItem("highScores");

  if (previousScores) {
    const preScoreArr = JSON.parse(previousScores);
    console.log(preScoreArr, gameScores);
    //assigning to gameScore array
    gameScores = [...gameScores, ...preScoreArr]
      .sort((a, b) => b.hits - a.hits)
      .splice(0, 9);
  }

  localStorage.setItem("highScores", JSON.stringify(gameScores));

  //empty the gameScores array
  gameScores = [];

  openPopup();
  updateHighScore();

  // Reset game variables
  currentWordIndex = 0;
  hits = 0;
}

function openPopup() {
  popup.style.display = "block"; // Display the popup
  userInput.disabled = true;
  userInput.value = "";
  timerDisplay.textContent = "20";
}

// Function to close the popup
function closePopup() {
  popup.style.display = "none"; // Hide the popup
  scoreDisplay.innerHTML = "Hits:0";
  wordDisplay.innerText = "";
  backgroundSound.pause();
}

// Event listener for start button
startBtn.addEventListener("click", startGame);
closeBtn.addEventListener("click", closePopup);
