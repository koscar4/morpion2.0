const imageOptions = [
  "001.Bulbizarre.png",
  "004.Salameche.png",
  "007.Carapuce.png",
  "108.Excelangue.png",
  "133.Evoli.png",
  "152.Germinion.png",
  "155.Hericendre.png",
  "158.Kaiminus.png",
  "25.Pikachu.png",
  "252.Arcko.png",
  "255.Poussifeu.png",
  "258.Gobou.png",
  "387.Tortipouss.png",
  "390.Ouisticram.png",
  "393.Tiplouf.png",
  "495.Vipelierre.png",
  "498.Gruikui.png",
  "501.Moustillon.png",
  "560.Baggaid.png",
  "650.Marisson.png",
  "653.Feunnec.png",
  "656.Grenousse.png",
  "722.Brindibou.png",
  "725.Flamiaou.png",
  "728.Otaquin.png",
  "81.Ouistempo.png",
  "82.Flambino.png",
  "83.Larmeleon.png",
  "Chochodile.png",
  "Coiffeton.png",
  "Poussacha.png"
];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const player1SkinEl = document.getElementById("player1Skin");
const player2SkinEl = document.getElementById("player2Skin");
const player1PreviewEl = document.getElementById("player1Preview");
const player2PreviewEl = document.getElementById("player2Preview");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

let board = Array(9).fill("");
let currentPlayer = "P1";
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function prettifyImageName(fileName) {
  return fileName.replace(".png", "");
}

function populateChoices() {
  const baseChoices = [
    { value: "X", label: "Croix (X)" },
    { value: "O", label: "Rond (O)" }
  ];

  [player1SkinEl, player2SkinEl].forEach((selectEl) => {
    selectEl.innerHTML = "";

    baseChoices.forEach((choice) => {
      const option = document.createElement("option");
      option.value = choice.value;
      option.textContent = choice.label;
      selectEl.appendChild(option);
    });

    imageOptions.forEach((img) => {
      const option = document.createElement("option");
      option.value = `images/${img}`;
      option.textContent = `Image: ${prettifyImageName(img)}`;
      selectEl.appendChild(option);
    });
  });

  player1SkinEl.value = "X";
  player2SkinEl.value = "O";
}

function getPlayerSkin(player) {
  return player === "P1" ? player1SkinEl.value : player2SkinEl.value;
}

function isImageSkin(skin) {
  return skin.startsWith("images/");
}

function renderSkinPreview(selectEl, previewEl) {
  const skin = selectEl.value;
  previewEl.innerHTML = "";

  if (isImageSkin(skin)) {
    const img = document.createElement("img");
    img.className = "preview-image";
    img.src = skin;
    img.alt = "Apercu du skin";
    previewEl.appendChild(img);
    return;
  }

  const text = document.createElement("span");
  text.className = "preview-text";
  text.textContent = skin;
  previewEl.appendChild(text);
}

function updateAllPreviews() {
  renderSkinPreview(player1SkinEl, player1PreviewEl);
  renderSkinPreview(player2SkinEl, player2PreviewEl);
}

function createCell(index) {
  const cell = document.createElement("button");
  cell.className = "cell";
  cell.type = "button";
  cell.dataset.index = String(index);
  cell.addEventListener("click", handleCellClick);
  return cell;
}

function renderBoard() {
  boardEl.innerHTML = "";

  board.forEach((value, index) => {
    const cell = createCell(index);

    if (value) {
      const skin = getPlayerSkin(value);
      if (isImageSkin(skin)) {
        const img = document.createElement("img");
        img.className = "token-image";
        img.src = skin;
        img.alt = value === "P1" ? "Jeton Joueur 1" : "Jeton Joueur 2";
        cell.appendChild(img);
      } else {
        const text = document.createElement("span");
        text.className = "token-text";
        text.textContent = skin;
        cell.appendChild(text);
      }
    }

    boardEl.appendChild(cell);
  });
}

function checkWinner(player) {
  return winPatterns.some((pattern) => pattern.every((index) => board[index] === player));
}

function updateStatus() {
  if (gameOver) {
    return;
  }
  statusEl.textContent = currentPlayer === "P1" ? "Tour du Joueur 1" : "Tour du Joueur 2";
}

function handleCellClick(event) {
  if (gameOver) {
    return;
  }

  const index = Number(event.currentTarget.dataset.index);
  if (board[index]) {
    return;
  }

  board[index] = currentPlayer;
  renderBoard();

  if (checkWinner(currentPlayer)) {
    gameOver = true;
    statusEl.textContent = currentPlayer === "P1" ? "Joueur 1 a gagne !" : "Joueur 2 a gagne !";
    return;
  }

  if (board.every((cell) => cell !== "")) {
    gameOver = true;
    statusEl.textContent = "Match nul !";
    return;
  }

  currentPlayer = currentPlayer === "P1" ? "P2" : "P1";
  updateStatus();
}

function startGame() {
  board = Array(9).fill("");
  currentPlayer = "P1";
  gameOver = false;
  renderBoard();
  updateStatus();
}

populateChoices();
startGame();
updateAllPreviews();

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", startGame);
player1SkinEl.addEventListener("change", updateAllPreviews);
player2SkinEl.addEventListener("change", updateAllPreviews);
