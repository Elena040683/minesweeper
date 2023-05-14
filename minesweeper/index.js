


function startGame (width, height, bombsCount) {
  const container = document.createElement('div');

  container.classList.add('field');
  const cells = width * height;
  container.innerHTML = `<button class="button"></button>`.repeat(cells);

  const allCells = [...container.children];


  document.body.prepend(container);

  [... Array(cells).keys()].sort(() => Math.random() - 0.5).slice(0, bombsCount);

  container.addEventListener('click', (event) => {
    if (event.target !== 'BUTTON') {
      return;
    }
    const index = allCells.indexOf(event.target);
    event.target.innerHTML = isBomb() ? 'X' : ' ';
  });

  function isBomb(row, column) {
    const index = row * width + column;

    return bombs.includes(index);
  }
  
}

startGame(10, 10, 15);