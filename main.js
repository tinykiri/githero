// sounds
const soundError = new Audio("./error.mp3");
const soundTyping = new Audio("./keyboard-press.mp3");
const soundRemoved = new Audio("./laser-zap-removed_command.mp3");
const soundMissed = new Audio("./explosion_missed-command.mp3");
const soundSelect = new Audio("./8-bit-laser_move-arrows-press-enter.mp3");
const soundGameplay = new Audio("./short-chiptune-loop_gameplay.mp3");
const soundGameOver = new Audio("./videogame-death-sound_gameover.mp3");
const soundVictory = new Audio("./victory-sound.mp3");

soundGameplay.loop = true;

// volume 
soundGameplay.volume = 0.5;
soundGameOver.volume = 0.5;
soundVictory.volume = 1;
soundError.volume = 0.5;
soundTyping.volume = 0.5;
soundRemoved.volume = 0.5;
soundMissed.volume = 0.5;
soundSelect.volume = 0.5;

const bg = document.getElementById("playground");
const mainTitle = document.getElementById("game-title");
const fallingCommands = document.getElementById("falling-commands");
const terminal = document.getElementById("terminal");
const terminalInput = document.getElementById("terminal-input");
const stats = document.getElementById("stats");
const livesValue = document.getElementById("lives-value");
const scoreValue = document.getElementById("score-value");

let activeCommands = [];
let spawnTimeout;
let lives = 3;
let score = 0;
let speedMultiplier = 1;
let commandHistory = [];
let gameActive = false;
let speedInterval;
let restartHandler;

stats.style.visibility = "hidden";
terminal.style.visibility = "hidden";

// start game screen
function startGameScreen() {
  const startScreenButtons = document.createElement("div");
  startScreenButtons.className = "start-screen-buttons";

  const floatingArrow = document.createElement("div");
  floatingArrow.className = "floating-arrow";
  floatingArrow.innerHTML = ">";

  const startBtn = document.createElement("div");
  startBtn.className = "start-btn menu-item";
  startBtn.innerHTML = "start game";

  const howToPlay = document.createElement("div");
  howToPlay.className = "how-to-play menu-item";
  howToPlay.innerHTML = "how to play";

  const pressEnterHint = document.createElement("div");
  pressEnterHint.className = "press-enter-hint";
  pressEnterHint.innerHTML = `<p>press <span class="enter-esc-word">ENTER</span> or click to start</p>`;

  startScreenButtons.appendChild(floatingArrow);
  startScreenButtons.appendChild(startBtn);
  startScreenButtons.appendChild(howToPlay);
  startScreenButtons.appendChild(pressEnterHint);
  bg.appendChild(startScreenButtons);

  let selectedIndex = 0;

  function updateArrowPosition() {
    if (selectedIndex === 0) {
      floatingArrow.style.top = "64%";
      floatingArrow.style.left = "32%";
    } else {
      floatingArrow.style.top = "76%";
      floatingArrow.style.left = "32%";
    }
  }

  function handleStartGame() {
    startScreenButtons.remove();
    mainTitle.remove();
    document.removeEventListener("keydown", keyHandler);
    startGame();
  }

  // move arrow position between start screen and how to play screen
  function keyHandler(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      soundSelect.currentTime = 0;
      soundSelect.play();
      selectedIndex = selectedIndex === 0 ? 1 : 0;
      updateArrowPosition();
    } else if (e.key === "Enter") {
      soundSelect.currentTime = 0;
      soundSelect.play();
      if (selectedIndex === 0) {
        handleStartGame();
      } else {
        showHowToPlay();
      }
    }
  }

  startBtn.addEventListener("click", () => {
    soundSelect.currentTime = 0;
    soundSelect.play();
    handleStartGame();
  });
  howToPlay.addEventListener("click", () => {
    soundSelect.currentTime = 0;
    soundSelect.play();
    showHowToPlay();
  });
  document.addEventListener("keydown", keyHandler);

  updateArrowPosition();
}

function startGame() {
  soundGameplay.currentTime = 0;
  soundGameplay.play();

  gameActive = true;
  stats.style.visibility = "visible";
  terminal.style.visibility = "visible";
  terminalInput.focus();

  livesValue.innerHTML = lives;
  scoreValue.innerHTML = score;

  spawnFallingCommands();

  speedInterval = setInterval(() => {
    speedMultiplier += 0.2;
  }, 10000);
}

// how to play popup
function showHowToPlay() {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";
  popupContent.innerHTML = `
    <h2>HOW TO PLAY:</h2>
    <p class="rules-text">[1] git commands fall from the top</p>
    <p class="rules-text">[2] type the command exactly in the terminal</p>
    <p class="rules-text">[3] press ENTER to submit</p>
    <p class="rules-text">[4] wrong/missed command = lose 1 life</p>
    <p class="rules-text">[5] game ends when lives = 0</p>
    <br>
    <p class="tips-title">TIPS:</p>
    <p class="tips-text">> type any visible command - not just the lowest</p>
    <p class="tips-text">> commands get faster over time</p>
    <p class="tips-text">> keep your combo for bonus points</p>
    <br>
    <p class="close-hint">press <span class='enter-esc-word'>ESC</span> to close</p>
  `;

  popup.appendChild(popupContent);
  document.body.appendChild(popup);

  function closePopup() {
    popup.remove();
    document.removeEventListener("keydown", escHandler);
  }

  function escHandler(e) {
    if (e.key === "Escape") {
      soundSelect.currentTime = 0;
      soundSelect.play();
      closePopup();
    }
  }

  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener("keydown", escHandler);
}

// falling commands generator
function fallingCommandsGenerator(commandData) {
  const command = document.createElement("div");
  command.className = "falling-command";

  const commandText = document.createElement("span");
  commandText.className = "command-text";
  commandText.textContent = commandData.text;
  command.appendChild(commandText);
  command.style.color = commandData.color;

  const xPosition = getSafeXPosition(140);

  command.style.left = xPosition + "px";
  command.style.top = "0px";

  const commandTrail = document.createElement("div");
  commandTrail.className = "command-trail-growing";
  commandTrail.style.background = `linear-gradient(0deg, transparent 0%, ${commandData.color} 80%, ${commandData.color} 100%)`;
  commandTrail.style.left = xPosition + "px";
  commandTrail.style.top = "-20px";
  commandTrail.style.height = "0px";

  fallingCommands.appendChild(commandTrail);
  fallingCommands.appendChild(command);

  command._trail = commandTrail;
  activeCommands.push(command);

  let yPosition = 0;
  const baseSpeed = 0.3;

  const fallingInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(fallingInterval);
      return;
    }

    yPosition += baseSpeed * speedMultiplier;
    command.style.top = `${yPosition}px`;

    commandTrail.style.height = `${yPosition + 20}px`;
    const textWidth = commandText.offsetWidth;
    commandTrail.style.left = `${xPosition + (textWidth / 2)}px`;

    if (yPosition > bg.offsetHeight - 50) {
      clearInterval(fallingInterval);
      command.remove();
      commandTrail.remove();

      activeCommands = activeCommands.filter(cmd => cmd !== command);

      if (gameActive) {
        soundMissed.currentTime = 0;
        soundMissed.play();
        updateLives();
      }
    }

  }, 20);

  command._fallInterval = fallingInterval;
}

// gaps between commands
function getSafeXPosition(minDistance = 120) {
  const bgWidth = bg.offsetWidth;
  const centerX = bgWidth / 2;
  const spawnWidth = 600;
  const leftMargin = 300;

  const minX = centerX - spawnWidth / 2;
  const maxX = minX + (spawnWidth - leftMargin);

  for (let i = 0; i < 20; i++) {
    const x = minX + Math.random() * (maxX - minX);

    const tooClose = activeCommands.some(cmd => {
      const existingX = parseFloat(cmd.style.left);
      return Math.abs(existingX - x) < minDistance;
    });

    if (!tooClose) return x;
  }

  return minX + Math.random() * (maxX - minX);
}


function getMinVerticalGap() {
  let highestY = Infinity;

  activeCommands.forEach(cmd => {
    const y = parseFloat(cmd.style.top) || 0;
    if (y < highestY) highestY = y;
  });

  return highestY === Infinity ? 9999 : highestY;
}

function spawnFallingCommands() {
  if (!gameActive) return;

  const closestY = getMinVerticalGap();

  if (closestY < 120) {
    spawnTimeout = setTimeout(() => spawnFallingCommands(), 200);
    return;
  }

  if (activeCommands.length >= 5) {
    spawnTimeout = setTimeout(() => spawnFallingCommands(), 800);
    return;
  }

  const nextCommand = getRandomCommand();
  if (!nextCommand) {
    spawnTimeout = setTimeout(() => spawnFallingCommands(), 2000);
    return;
  }

  fallingCommandsGenerator(nextCommand);

  spawnTimeout = setTimeout(() => spawnFallingCommands(), 2000);
}

// submit command
function handleSubmit() {
  if (!gameActive) return;

  const typedCommand = terminalInput.value.trim();

  const visibleCommands = document.querySelectorAll(".falling-command");
  let commandFound = false;

  visibleCommands.forEach(commandElement => {
    const commandText = commandElement.querySelector(".command-text");

    if (commandText && commandText.textContent === typedCommand) {
      commandFound = true;

      if (commandElement._trail) {
        commandElement._trail.remove();
      }

      if (commandElement._fallInterval) {
        clearInterval(commandElement._fallInterval);
      }

      soundRemoved.currentTime = 0;
      soundRemoved.play();

      commandElement.remove();
      updateScore(10);

      commandHistory.push(typedCommand);
      activeCommands = activeCommands.filter(cmd => cmd !== commandElement);
    }
  });

  if (!commandFound) {
    soundError.currentTime = 0;
    soundError.play();
    terminal.style.borderColor = "red";
    terminal.style.animation = "shakingTerminal 0.4s ease"
    setTimeout(() => {
      terminal.style.borderColor = "";
      terminal.style.animation = "";
    }, 1000);
  }

  terminalInput.value = "";
  terminalInput.focus();
}

function updateScore(points) {
  let currentScore = parseInt(scoreValue.textContent) || 0;
  currentScore += points;
  scoreValue.textContent = currentScore;

  if (currentScore >= 200) {
    setTimeout(() => showEndScreen("victory"), 0);
  }
}

function updateLives() {
  let lives = parseInt(livesValue.textContent) || 3;
  lives--;
  livesValue.textContent = lives;

  if (lives === 0) {
    showEndScreen("gameOver");
  }
}

// typing sound for EVERY key 
terminalInput.addEventListener("keydown", (e) => {
  soundTyping.currentTime = 0;
  soundTyping.play();

  if (e.key === "Enter") handleSubmit();
});

// end screen function (game over/victory)
function showEndScreen(type) {
  gameActive = false;

  soundGameplay.pause();

  if (type === "gameOver") {
    soundGameOver.currentTime = 0;
    soundGameOver.play();
  } else {
    soundVictory.currentTime = 0;
    soundVictory.play();
  }

  if (spawnTimeout) clearTimeout(spawnTimeout);
  if (speedInterval) clearInterval(speedInterval);

  activeCommands.forEach(cmd => {
    if (cmd._fallInterval) clearInterval(cmd._fallInterval);
  });

  document.querySelectorAll(".falling-command").forEach(el => el.remove());
  document.querySelectorAll(".command-trail-growing").forEach(el => el.remove());

  activeCommands = [];

  terminal.style.visibility = "hidden";
  stats.style.visibility = "hidden";

  const gameOverOverlay = document.createElement("div");
  gameOverOverlay.className = "game-over-overlay";

  const titleImg = document.createElement("img");
  titleImg.src = type === "victory" ? "./victory-title.png" : "./game-over-title.png";
  titleImg.style.width = "600px";

  const scoreText = document.createElement("div");
  scoreText.className = "game-score";
  scoreText.innerHTML = `final score: ${scoreValue.textContent}`;

  const typedText = document.createElement("div");
  typedText.className = "game-typed-commands";
  typedText.innerHTML = `commands typed: ${commandHistory.length}`;

  const restartHint = document.createElement("div");
  restartHint.className = "press-enter-replay-hint";
  restartHint.innerHTML = `<p>press <span class="enter-esc-word">ENTER</span> to restart</p>`;

  gameOverOverlay.appendChild(titleImg);
  gameOverOverlay.appendChild(scoreText);
  gameOverOverlay.appendChild(typedText);
  gameOverOverlay.appendChild(restartHint);
  bg.appendChild(gameOverOverlay);

  if (restartHandler) {
    document.removeEventListener("keydown", restartHandler);
  }

  restartHandler = function (e) {
    if (e.key === "Enter") {
      document.removeEventListener("keydown", restartHandler);
      gameOverOverlay.remove();
      replayGame();
    }
  };

  document.addEventListener("keydown", restartHandler);
}

// replay function
function replayGame() {
  score = 0;
  lives = 3;
  speedMultiplier = 1;
  commandHistory = [];
  activeCommands = [];
  gameActive = true;

  // reset audio states
  soundGameOver.pause();
  soundVictory.pause();
  soundGameplay.currentTime = 0;
  soundGameplay.play();

  scoreValue.textContent = score;
  livesValue.textContent = lives;
  stats.style.visibility = "visible";
  terminal.style.visibility = "visible";
  terminalInput.value = "";
  terminalInput.focus();

  spawnFallingCommands();
  speedInterval = setInterval(() => {
    speedMultiplier += 0.2;
  }, 10000);
}

startGameScreen();