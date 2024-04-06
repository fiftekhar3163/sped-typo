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

// Function to start the game
function startGame() {

  backgroundSound.loop = true;
  backgroundSound.volume = 0.3;
  setTimeout(function(){
    backgroundSound.play();
  },1000)
  buttonSound.play();
  const max = 90;
  const min = 0;
  currentWordIndex = Math.floor(Math.random() * (max - min + 1)) + min;

  //focus to input;
  userInput.focus();
  if (!isPlaying) {
    isPlaying = true;
    startBtn.disabled = true;
    startBtn.textContent = "Playing...";

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
  const percentage = Math.floor((hits / words.length) * 100);

  // Create Score object
  const date = new Date().toLocaleDateString();
  const score = new Score(date, hits, percentage);

  popupDate.innerText = `Date: ${score.date}`;
  popupHits.innerText = `Hits: ${score.hits}`;
  popupPercentage.innerText = `Percentage: ${score.percentage}%`;

  openPopup();
  // Reset game variables
  currentWordIndex = 0;
  hits = 0;
  scoreDisplay.textContent = "";
}

function openPopup() {
  popup.style.display = "block"; // Display the popup
}

// Function to close the popup
function closePopup() {
  window.location.reload();
  popup.style.display = "none"; // Hide the popup
}

// Event listener for start button
startBtn.addEventListener("click", startGame);
closeBtn.addEventListener("click", closePopup);
