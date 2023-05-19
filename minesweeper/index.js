const rows = 10;
const columns = 10;

let board = [];

const minesCount = 5;
const minesLocation = []; //"2-3", "1-5","6-4"

let cellsClicked = 0;
let flagEnabled = false;
let gameOver = false;

window.onload = function() {
  startGame();
}

function setMines() {
  minesLocation.push('2-2');
  minesLocation.push('2-3');
  minesLocation.push('5-6');
  minesLocation.push('3-4');
  minesLocation.push('1-1');
}


function startGame () {
  const container = document.createElement('div');
  const title = document.createElement('h2');
  const button = document.createElement('button');
  const field = document.createElement('main');

  button.addEventListener('click', onSetSmile);
  
  button.textContent = '🙂';
  title.textContent = "Mines: " + minesCount;

  container.classList.add('container');
  field.classList.add('board');
  title.classList.add('title');
  button.classList.add('smile-button');

  container.append(title, button, field);
  document.body.prepend(container);
  
  setMines();

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = r + '-' + c;
      cell.addEventListener('click', onCellClick);
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
let clickedCell = event.target;

  if (flagEnabled) {
    if (clickedCell.textContent === '') {
      clickedCell.textContent = '🙂';
    } else if (clickedCell.textContent === '🙂'){
      clickedCell.textContent = '';
    }
    return
  }

  if (minesLocation.includes(clickedCell.id)) {
    // alert('GAME OVER');
    gameOver = true;
    revealMines();
    return;
  }

  let coords = clickedCell.id.split('-');
  console.log(coords);
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  
  checkMine(r, c);

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
  }
  else {
    //top 3 
    checkMine(r-1, c-1); //top left
    checkMine(r-1, c); //top
    checkMine(r-1, c+1); //top right

    //left and right
    checkMine(r, c-1); //left
    checkMine(r, c+1); //right
    
    //bottom 3
    checkMine(r+1, c-1); //bottom left
    checkMine(r+1, c); //bottom 
    checkMine(r+1, c+1); //bottom right
  }

  if (cellsClicked === rows * columns - minesCount) {
    title.textContent = 'Game over. Try again';
    gameOver = true;
  }
}

function checkCell(r, c) {
  if (r < 0 || r >= rows || c < 0 || c > columns) {
    return 0;
  }

  if (minesLocation.includes(r.toString() + '-' + c.toString())) {
    return 1;
  }
  return 0;
}