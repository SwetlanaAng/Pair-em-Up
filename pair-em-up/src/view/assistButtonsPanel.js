import ElementCreator from '../utils/element-creator.js';
export default class AssistButtonsPanelView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['assist-buttons-panel'],
    });
    this.gameController = null;
  }
  createView(gameController) {
    this.gameController = gameController;
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
      textContent: 'Shuffle',
    });
    const eraserButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'eraser'],
      attrubutesNames: [['type', 'button']],
      textContent: 'Eraser',
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
