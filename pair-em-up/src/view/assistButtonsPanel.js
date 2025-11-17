import ElementCreator from '../utils/element-creator.js';
export default class AssistButtonsPanelView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['assist-buttons-panel'],
    });
    this.gameController = null;
    this.addNumbersIsDisabled = false;
    this.shuffleIsDisabled = false;
    this.assistAudio = new Audio('./assets/sounds/assist.mp3');
  }

  playAssistSound() {
    this.assistAudio.currentTime = 0;
    this.assistAudio.play();
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
        if (!event.target.disabled && !event.target.classList.contains('disabled')) {
          this.gameController.addNumbersToGameField();
          this.playAssistSound();
          event.target.textContent = `Add Numbers (${this.gameController.gameModel.addNumberCount})`;
          hintButton.getElement().textContent = `hint (
          ${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`;
          if (this.gameController.gameModel.addNumberCount === 0) {
            this.addNumbersIsDisabled = true;
          }
          if (this.gameController.gameModel.gameState === 'lose') {
            this.gameController.isWinOrLose();
          }
          if (this.addNumbersIsDisabled) {
            event.target.disabled = true;
            event.target.classList.add('disabled');
          }
        }
      },
    });
    const revertButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'revert', 'disabled'],
      attrubutesNames: [
        ['type', 'button'],
        ['disabled', 'true'],
      ],
      textContent: 'Revert',
      callback: (event) => {
        if (!event.target.disabled && !event.target.classList.contains('disabled')) {
          const pairData = this.gameController.gameFieldView.revertPair;
          this.gameController.revertPair(
            pairData[0][0],
            pairData[0][1],
            pairData[1][0],
            pairData[1][1],
            pairData[2][0],
            pairData[2][1]
          );
          this.playAssistSound();
          hintButton.getElement().textContent = `hint (
          ${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`;
          this.gameController.gameFieldView.revertPair = [];
          this.gameController.assistButtonsPanel.getElement().querySelector('.revert').disabled =
            true;
          this.gameController.assistButtonsPanel
            .getElement()
            .querySelector('.revert')
            .classList.add('disabled');
        }
      },
    });
    const shuffleButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'shuffle'],
      attrubutesNames: [['type', 'button']],
      textContent: `Shuffle (${this.gameController.gameModel.shuffleCount})`,
      callback: (event) => {
        if (!event.target.disabled && !event.target.classList.contains('disabled')) {
          this.gameController.shuffleGameField();
          this.playAssistSound();
          event.target.textContent = `Shuffle (${this.gameController.gameModel.shuffleCount})`;
          hintButton.getElement().textContent = `hint (
          ${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`;
          if (this.gameController.gameModel.shuffleCount === 0) {
            this.shuffleIsDisabled = true;
            event.target.disabled = true;
            event.target.classList.add('disabled');
          }
        }
      },
    });
    const eraserButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'eraser', 'disabled'],
      attrubutesNames: [['type', 'button']],
      textContent: `Eraser (${this.gameController.gameModel.eraserCount})`,
      callback: (event) => {
        if (!event.target.disabled && !event.target.classList.contains('disabled')) {
          const [row, col] = this.gameController.gameFieldView.selectedCells[0]
            .split('-')
            .map(Number);
          this.gameController.eraseCell(row, col);
          this.playAssistSound();
          event.target.textContent = `Eraser (${this.gameController.gameModel.eraserCount})`;
          hintButton.getElement().textContent = `hint (
          ${this.gameController.getValidPairsCount() > 5 ? '5+' : this.gameController.getValidPairsCount()})`;
          if (this.gameController.gameModel.eraserCount === 0) {
            event.target.disabled = true;
            event.target.classList.add('disabled');
          }
        }
      },
    });
    if (this.gameController.gameFieldView.revertPair.length > 1) {
      revertButton.getElement().disabled = false;
      revertButton.getElement().classList.remove('disabled');
    } else {
      revertButton.getElement().disabled = true;
      revertButton.getElement().classList.add('disabled');
    }
    if (this.addNumbersIsDisabled) {
      addNumbersButton.getElement().disabled = true;
      addNumbersButton.getElement().classList.add('disabled');
    }
    if (this.shuffleIsDisabled) {
      shuffleButton.getElement().disabled = true;
      shuffleButton.getElement().classList.add('disabled');
    }
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
