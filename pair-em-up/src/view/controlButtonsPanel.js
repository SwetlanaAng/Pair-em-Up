import ElementCreator from '../utils/element-creator.js';
export default class ControlButtonsPanelView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['control-buttons-panel'],
    });
    this.gameController = null;
  }
  createView(gameController) {
    this.gameController = gameController;
    const controlButtons = this.getElement();
    controlButtons.innerHTML = '';
    const resetButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'reset'],
      attrubutesNames: [['type', 'button']],
      textContent: 'reset',
    });
    const saveButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'save'],
      attrubutesNames: [['type', 'button']],
      textContent: 'save',
      callback: () => {
        this.gameController.saveGame();
      },
    });
    const continueButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'continue'],
      attrubutesNames: [['type', 'button']],
      textContent: 'continue',
    });

    controlButtons.append(resetButton.getElement());
    controlButtons.append(saveButton.getElement());
    controlButtons.append(continueButton.getElement());

    return controlButtons;
  }
}
