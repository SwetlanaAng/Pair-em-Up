import ElementCreator from '../utils/element-creator.js';

export default class GameFieldView extends ElementCreator {
  constructor(gameController) {
    super({
      tag: 'div',
      classNames: ['game-field'],
    });
    this.gameController = gameController;
    this.selectedCells = [];
    this.maxSelected = 2;
    this.audio = new Audio('./assets/sounds/69880c1f5e57698.mp3');
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play();
  }

  handleCellClick(event) {
    const cell = event.currentTarget;
    const row = +cell.dataset.row;
    const col = +cell.dataset.col;
    const cellId = `${row}-${col}`;
    const isSelected = cell.classList.contains('selected');

    this.playSound();

    if (isSelected) {
      cell.classList.remove('selected');
      this.selectedCells = this.selectedCells.filter((id) => id !== cellId);
    } else {
      cell.classList.add('selected');
      this.selectedCells.push(cellId);

      if (this.selectedCells.length === this.maxSelected) {
        const [firstId, secondId] = this.selectedCells;
        const [row1, col1] = firstId.split('-').map(Number);
        const [row2, col2] = secondId.split('-').map(Number);

        const isValid = this.gameController.handleCellPairSelection(row1, col1, row2, col2);
        
        if (isValid) {
          this.selectedCells = [];
        } else {
          const firstCell = this.getElement().querySelector(
            `[data-row="${row1}"][data-col="${col1}"]`
          );
          const secondCell = this.getElement().querySelector(
            `[data-row="${row2}"][data-col="${col2}"]`
          );
          firstCell.classList.remove('selected');
          secondCell.classList.remove('selected');
          this.selectedCells = [];
        }
      }
    }
  }
  
  createView(gameFieldData) {
    const gameField = this.getElement();
    const gridContainer = new ElementCreator({
      tag: 'div',
      classNames: ['grid-container'],
    });

    this.selectedCells = [];

    gameFieldData.forEach((row, rowIndex) => {
      const rowElement = new ElementCreator({
        tag: 'div',
        classNames: ['grid-row'],
        attributesNames: [['data-row-index', rowIndex.toString()]],
      });

      row.forEach((cellValue, cellIndex) => {
        const cell = new ElementCreator({
          tag: 'div',
          classNames: ['grid-cell'],
          textContent: cellValue === 0 ? '' : cellValue.toString(),
          attributesNames: [
            ['data-row', rowIndex.toString()],
            ['data-col', cellIndex.toString()],
          ],
          callback: (event) => {
            this.handleCellClick(event);
          },
        });

        rowElement.addInnerElement(cell);
      });

      gridContainer.addInnerElement(rowElement);
    });

    gameField.append(gridContainer.getElement());
    return gameField;
  }

  updateView(gameFieldData) {
    const gameField = this.getElement();
    gameField.innerHTML = '';
    this.selectedCells = [];
    this.createView(gameFieldData);
  }
}
