import ElementCreator from '../utils/element-creator.js';
import AssistButtonsPanelView from './assistButtonsPanel.js';
import ControlButtonsPanelView from './controlButtonsPanel.js';

export default class RootView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['root-view'],
    });
    this.gameController = null;
    this.controlButtonsPanel = new ControlButtonsPanelView();
    this.assistButtonsPanel = new AssistButtonsPanelView();
  }

  setGameController(gameController) {
    this.gameController = gameController;
  }

  createView() {
    const main = this.getElement();
    if (!main.parentNode) {
      document.body.append(main);
    }
    const headerView = this.gameController.getHeaderView().createView();
    main.append(headerView);
    const controlButtonsPanelView = this.controlButtonsPanel.createView(this.gameController);
    main.append(controlButtonsPanelView);
    const currentGameIndicatorsView = this.gameController
      .getCurrentGameIndicatorsView()
      .createView();
    main.append(currentGameIndicatorsView);

    const gameFieldView = this.gameController.init();
    main.append(gameFieldView);

    const assistButtonsPanelView = this.assistButtonsPanel.createView(this.gameController);
    main.append(assistButtonsPanelView);
  }

  createModal(state, gameResult) {
    const main = this.getElement();
    const modal = new ElementCreator({
      tag: 'div',
      classNames: ['modal-bg'],
    });
    const modalContent = new ElementCreator({
      tag: 'div',
      classNames: ['modal-content'],
    });

    if (state === 'score-table') {
      // список из 5 последних игр с отметками побед
    } else if (state === 'win' || state === 'lose') {
      const modalInfo = new ElementCreator({
        tag: 'h2',
        classNames: ['modal-info'],
        textContent:
          state === 'win'
            ? 'Congratulations! You completed the game!'
            : 'Game Over! Better luck next time!',
      });
      modalContent.addInnerElement(modalInfo);

      const resultsContainer = new ElementCreator({
        tag: 'div',
        classNames: ['modal-results'],
      });

      const scoreInfo = new ElementCreator({
        tag: 'div',
        classNames: ['modal-score'],
      });
      const scoreLabel = new ElementCreator({
        tag: 'span',
        classNames: ['modal-label'],
        textContent: `Final Score: ${gameResult.score || 0}`,
      });

      scoreInfo.addInnerElement(scoreLabel);
      resultsContainer.addInnerElement(scoreInfo);

      const minutes = Math.floor(gameResult.time / 60);
      const seconds = gameResult.time % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      const timeInfo = new ElementCreator({
        tag: 'div',
        classNames: ['modal-time'],
      });
      const timeLabel = new ElementCreator({
        tag: 'span',
        classNames: ['modal-label'],
        textContent: `Time: ${formattedTime}`,
      });

      timeInfo.addInnerElement(timeLabel);
      resultsContainer.addInnerElement(timeInfo);

      const movesInfo = new ElementCreator({
        tag: 'div',
        classNames: ['modal-moves'],
      });
      const movesLabel = new ElementCreator({
        tag: 'span',
        classNames: ['modal-label'],
        textContent: `Moves: ${gameResult.amountOfMoves}`,
      });

      movesInfo.addInnerElement(movesLabel);
      resultsContainer.addInnerElement(movesInfo);

      modalContent.addInnerElement(resultsContainer);

      const modalButton = new ElementCreator({
        tag: 'button',
        classNames: ['modal-button', 'btn'],
        textContent: 'Play again',
        callback: () => {
          this.gameController.startNewGame();
          this.updateRootView();
        },
      });
      modalContent.addInnerElement(modalButton);
    }

    modal.addInnerElement(modalContent);
    main.append(modal.getElement());
  }
  updateRootView() {
    const main = this.getElement();
    const modal = main.querySelector('.modal-bg');
    if (modal) {
      modal.remove();
    }
    this.gameController.updateGameFieldData();
    this.gameController.setGameState('playing');
    this.gameController.getCurrentGameIndicatorsView().resetTimer();
    main.innerHTML = '';
    this.createView();
  }
}
