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
      textContent: 'hint',
    });
    const addNumbersButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'add-numbers'],
      attrubutesNames: [['type', 'button']],
      textContent: 'Add Numbers',
      callback: () => {
        this.gameController.addNumbersToGameField();
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
}
