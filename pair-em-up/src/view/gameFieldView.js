import ElementCreator from '../utils/element-creator.js';

export default class GameFieldView extends ElementCreator {
  constructor(gameController) {
    super({
      tag: 'div',
      classNames: ['game-field'],
    });
    this.gameController = gameController;
    this.selectedCells = [];
    this.selectedCellsValues = [];
    this.maxSelected = 2;
    this.clickAudio = new Audio('./assets/sounds/click.mp3');
    this.mistakeAudio = new Audio('./assets/sounds/mistake.mp3');
    this.doneAudio = new Audio('./assets/sounds/done.mp3');
    this.revertPair = [];
  }
  stopAllSounds() {
    this.clickAudio.pause();
    this.clickAudio.currentTime = 0;
    this.mistakeAudio.pause();
    this.mistakeAudio.currentTime = 0;
    this.doneAudio.pause();
    this.doneAudio.currentTime = 0;
  }

  playClickSound() {
    if (this.gameController.audioSettingsService.getSetting('cellClick')) {
      this.stopAllSounds();
      this.clickAudio.play();
    }
  }

  playMistakeSound() {
    if (this.gameController.audioSettingsService.getSetting('invalidPair')) {
      this.stopAllSounds();
      this.mistakeAudio.play();
    }
  }

  playDoneSound() {
    if (this.gameController.audioSettingsService.getSetting('successfulMatch')) {
      this.stopAllSounds();
      this.doneAudio.play();
    }
  }

  handleCellClick(event) {
    const cell = event.currentTarget;
    const row = +cell.dataset.row;
    const col = +cell.dataset.col;
    const cellId = `${row}-${col}`;
    const isSelected = cell.classList.contains('selected');
    const cellText = cell.textContent.trim();
    const cellValue = cellText ? +cellText : this.gameController.getCellValue(row, col);

    if (isSelected) {
      this.playClickSound();
      cell.classList.remove('selected');
      this.selectedCells = this.selectedCells.filter((id) => id !== cellId);

      this.selectedCellsValues = this.selectedCellsValues.filter((value) => value !== cellValue);
    } else {
      cell.classList.add('selected');
      this.selectedCells.push(cellId);
      this.selectedCellsValues.push(cellValue);

      if (this.selectedCells.length === this.maxSelected) {
        const [firstId, secondId] = this.selectedCells;
        const [row1, col1] = firstId.split('-').map(Number);
        const [row2, col2] = secondId.split('-').map(Number);

        const val1 = this.selectedCellsValues[0];
        const val2 = this.selectedCellsValues[1];

        const isValid = this.gameController.handleCellPairSelection(row1, col1, row2, col2);

        if (isValid) {
          this.revertPair = [];

          this.revertPair = [
            [row1, col1],
            [row2, col2],
            [val1, val2],
          ];
          this.gameController.assistButtonsPanel.getElement().querySelector('.revert').disabled =
            false;
          this.gameController.assistButtonsPanel
            .getElement()
            .querySelector('.revert')
            .classList.remove('disabled');
          this.gameController.assistButtonsPanel.updateView(this.gameController);
          this.playDoneSound();
          console.log(this.gameController.gameModel.gameField);
          this.selectedCells = [];
          this.selectedCellsValues = [];
        } else {
          this.playMistakeSound();
          const firstCell = this.getElement().querySelector(
            `[data-row="${row1}"][data-col="${col1}"]`
          );
          const secondCell = this.getElement().querySelector(
            `[data-row="${row2}"][data-col="${col2}"]`
          );
          if (firstCell) firstCell.classList.remove('selected');
          if (secondCell) secondCell.classList.remove('selected');
          this.selectedCells = [];
          this.selectedCellsValues = [];
        }
      } else {
        this.playClickSound();
      }
    }
    const eraserButton = this.gameController.getEraserButton();
    if (this.selectedCells.length !== 1) {
      eraserButton.disabled = true;
      eraserButton.classList.add('disabled');
    } else if (this.gameController.gameModel.eraserCount > 0) {
      eraserButton.disabled = false;
      eraserButton.classList.remove('disabled');
    }
  }

  createView(gameFieldData) {
    const gameField = this.getElement();
    gameField.innerHTML = '';
    const gridContainer = new ElementCreator({
      tag: 'div',
      classNames: ['grid-container'],
    });

    this.selectedCells = [];
    this.selectedCellsValues = [];

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
            if (cellValue !== 0) {
              this.handleCellClick(event);
            }
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
    /* this.selectedCells = []; //не уверена
    this.selectedCellsValues = []; */
    this.createView(gameFieldData);
  }
}
