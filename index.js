const rows = 10;
const columns = 10;

let board = [];

const minesCount = 10;
const minesLocation = []; //"2-3", "1-5","6-4"

let countCellsClicked = 0;
let flagEnabled = false;
let gameOver = false;

window.onload = function() {
  draw();
  startGame();
}

function setMines() {
  // minesLocation.push('1-1');
  // minesLocation.push('2-2');
  // minesLocation.push('3-3');
  // minesLocation.push('4-4');
  // minesLocation.push('5-5');

  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + '-' + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft -= 1;
    }
  }
}

function draw() {
  const container = document.createElement('div');
  const header = document.createElement('header');
  
  const buttonSmile = document.createElement('button');
  const buttonNewGame = document.createElement('button');
  const field = document.createElement('main');

  buttonSmile.addEventListener('click', onSetSmile);
  // buttonNewGame.addEventListener('click', startGame);
  
  buttonSmile.textContent = '🙂';
  buttonNewGame.textContent = 'New game';

  container.classList.add('container');
  header.classList.add('header');
  field.classList.add('board');
 
  buttonSmile.classList.add('smile-button');
  buttonNewGame.classList.add('new-game');

  header.append(buttonNewGame, buttonSmile, );
  container.append(header, field);
  document.body.prepend(container);
}


function startGame () {
  setMines();
  
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = r.toString() + '-' + c.toString();
      cell.addEventListener('click', onCellClick);
      const field = document.querySelector('.board');

      field.append(cell);
      row.push(cell)
    }
    board.push(row);
  }
  console.log(board);
}

function onSetSmile() {
  if (flagEnabled) {
    flagEnabled = false;
    document.querySelector('.smile-button').style.backgroundColor = 'rgb(52, 160, 160)';
  } else {
    flagEnabled = true;
    document.querySelector('.smile-button').style.backgroundColor = 'rgb(75, 87, 222)';
  }
}

function onCellClick() {
  console.log(event.target.id);
  const clickedCell = event.target;

  if (gameOver || clickedCell.classList.contains('cell-checked')) {
    return;
  }

  if (flagEnabled) {
    if (clickedCell.textContent === '') {
      clickedCell.textContent = '🙂';
    } else if (clickedCell.textContent === '🙂'){
      clickedCell.textContent = '';
    }
    return
  }

  if (minesLocation.includes(clickedCell.id)) {
    const lose = document.createElement('p');
    lose.classList.add('lose');
    lose.textContent = 'Game over. Try again';
    document.querySelector('.container').append(lose);
    gameOver = true;
    revealMines();
    document.querySelector('.new-game').addEventListener('click', onRestartGame)
    return;
  }
  
  let coords = clickedCell.id.split('-'); // "2-5" => ["2", "5"]
  console.log(coords);
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  
  checkMine(r, c);
}

function onRestartGame() {
  gameOver = false;
  document.querySelector('.board').innerHTML = '';
  document.querySelector('.lose').innerHTML = '';
  
  startGame();
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let cell = board[r][c];
      if (minesLocation.includes(cell.id)) {
        cell.textContent = '💣';
        cell.style.backgroundColor = 'red';
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c > columns) {
    return
  }

  if (board[r][c].classList.contains('cell-checked')) {
    return;
  }
  
  board[r][c].classList.add('cell-checked');
  countCellsClicked += 1;

  let minesFound = 0;

  //top 3
  minesFound += checkCell(r-1, c-1); //top left
  minesFound += checkCell(r-1, c); //top 
  minesFound += checkCell(r-1, c+1); //top right

  // left and right
  minesFound += checkCell(r, c-1); //left
  minesFound += checkCell(r, c+1); //right
  
  // bottom 3
  minesFound += checkCell(r+1, c-1); //bottom left
  minesFound += checkCell(r+1, c); //bottom 
  minesFound += checkCell(r+1, c+1); //bottom right
  
  if (minesFound > 0) {
    board[r][c].textContent = minesFound;
    board[r][c].classList.add("bomb" + minesFound.toString());
  }
  else {
    //top 3 
    checkCell(r-1, c-1); //top left
    checkCell(r-1, c); //top
    checkCell(r-1, c+1); //top right

    //left and right
    checkCell(r, c-1); //left
    checkCell(r, c+1); //right
    
    //bottom 3
    checkCell(r+1, c-1); //bottom left
    checkCell(r+1, c); //bottom 
    checkCell(r+1, c+1); //bottom right
  }

  if (countCellsClicked === rows * columns - minesCount) {
    const won = document.createElement('p');
    won.classList.add('won');
    won.textContent = 'You found all mines!!!'
    document.querySelector('.container').append(won);
    gameOver = true;
  }
}

function checkCell(r, c) {
  if (r < 0 || r >= rows || c < 0 || c > columns) {
    return 0;
  }

  if (minesLocation.includes(r + '-' + c)) {
    return 1;
  }
  return 0;
}