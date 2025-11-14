import ElementCreator from '../utils/element-creator.js';
export default class AssistButtonsPanelView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['assist-buttons-panel'],
    });
    this.gameController = null;
    //this.gameFieldView = null
  }
  createView(gameController) {
    this.gameController = gameController;
    //this.gameFieldView = gameController.gameFieldView;
    const assistButtons = this.getElement();
    assistButtons.innerHTML = '';
    const hintButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'hint'],
      attrubutesNames: [['type', 'button']],
      textContent: `hint (${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`,
    });
    const addNumbersButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'add-numbers'],
      attrubutesNames: [['type', 'button']],
      textContent: `Add Numbers (${this.gameController.gameModel.addNumberCount})`,
      callback: (event) => {
        this.gameController.addNumbersToGameField();
        event.target.textContent = `Add Numbers (${this.gameController.gameModel.addNumberCount})`;
        hintButton.getElement().textContent = `hint (
        ${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`;
        if (this.gameController.gameModel.addNumberCount === 0) {
          event.target.disabled = true;
          event.target.classList.add('disabled');
        }
        if (this.gameController.gameModel.gameState === 'lose') {
          this.gameController.rootView.createModal('lose');
        }
      },
    });
    const revertButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'revert'],
      attrubutesNames: [['type', 'button']],
      textContent: 'Revert',
    });
    const shuffleButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'shuffle'],
      attrubutesNames: [['type', 'button']],
      textContent: `Shuffle (${this.gameController.gameModel.shuffleCount})`,
      callback: (event) => {
        this.gameController.shuffleGameField();
        event.target.textContent = `Shuffle (${this.gameController.gameModel.shuffleCount})`;
        hintButton.getElement().textContent = `hint (
        ${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`;
        if (this.gameController.gameModel.shuffleCount === 0) {
          event.target.disabled = true;
          event.target.classList.add('disabled');
        }
      },
    });
    const eraserButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'eraser', 'disabled'],
      attrubutesNames: [['type', 'button']],
      textContent: `Eraser (${this.gameController.gameModel.eraserCount})`,
      callback: (event) => {
        const [row, col] = this.gameController.gameFieldView.selectedCells[0]
          .split('-')
          .map(Number);
        this.gameController.eraseCell(row, col);
        event.target.textContent = `Eraser (${this.gameController.gameModel.eraserCount})`;
        hintButton.getElement().textContent = `hint (
        ${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`;
        if (this.gameController.gameModel.eraserCount === 0) {
          event.target.disabled = true;
          event.target.classList.add('disabled');
        }
      },
    });

    assistButtons.append(hintButton.getElement());
    assistButtons.append(addNumbersButton.getElement());
    assistButtons.append(revertButton.getElement());
    assistButtons.append(shuffleButton.getElement());
    assistButtons.append(eraserButton.getElement());

    return assistButtons;
  }
  updateView(controller) {
    this.createView(controller);
  }
}
