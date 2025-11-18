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
    this.assistAudio = new Audio('./assets/sounds/assist.mp3');
  }

  setGameController(gameController) {
    this.gameController = gameController;
  }

  createView() {
    const main = this.getElement();
    if (!main.parentNode) {
      document.body.append(main);
    }
    this.gameController.setupHeaderHandler();
    this.gameController.setupAutoSave();

    const headerView = this.gameController.getHeaderView();
    headerView.gameMode = this.gameController.getGameModel().gameMode;
    const gameState = this.gameController.getGameModel().gameState;
    const isStartScreen = gameState !== 'playing';
    const headerElement = headerView.createView(isStartScreen);
    main.append(headerElement);

    if (gameState === 'playing') {
      this.createGameView();
    } else {
      this.createStartScreen();
    }
  }

  createStartScreen() {
    const main = this.getElement();
    const startButtonsPanel = new ElementCreator({
      tag: 'div',
      classNames: ['control-buttons-panel'],
    });

    const continueButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'continue', 'disabled'],
      attrubutesNames: [
        ['type', 'button'],
        ['disabled', 'true'],
      ],
      textContent: 'continue',
      callback: (event) => {
        if (event.target.disabled || event.target.classList.contains('disabled')) {
          return;
        }
        if (this.gameController.audioSettingsService.getSetting('assistTools')) {
          this.assistAudio.currentTime = 0;
          this.assistAudio.play();
        }
        this.gameController.startSavedGame();
      },
    });

    const savedGame = this.gameController.localStorageService.getSavedGameResults();
    if (savedGame && savedGame.mode) {
      continueButton.getElement().disabled = false;
      continueButton.getElement().classList.remove('disabled');
    }

    const scoreTableButton = new ElementCreator({
      tag: 'button',
      classNames: ['btn', 'score-table'],
      attrubutesNames: [['type', 'button']],
      textContent: 'Score Table',
      callback: () => {
        this.gameController.showScoreTable();
        if (this.gameController.audioSettingsService.getSetting('assistTools')) {
          this.assistAudio.currentTime = 0;
          this.assistAudio.play();
        }
      },
    });

    startButtonsPanel.addInnerElement(continueButton);
    startButtonsPanel.addInnerElement(scoreTableButton);
    main.append(startButtonsPanel.getElement());
  }

  createGameView() {
    const main = this.getElement();
    const controlButtonsPanelView = this.controlButtonsPanel.createView(this.gameController);
    main.append(controlButtonsPanelView);

    const currentGameIndicatorsView = this.gameController.getCurrentGameIndicatorsView();
    const indicatorsElement = currentGameIndicatorsView.createView(
      this.gameController.getGameModel().score
    );
    main.append(indicatorsElement);

    const gameFieldView = this.gameController.init();
    main.append(gameFieldView);

    const assistButtonsPanelView = this.assistButtonsPanel.createView(this.gameController);
    main.append(assistButtonsPanelView);

    if (
      this.gameController.gameFieldView.revertPair &&
      this.gameController.gameFieldView.revertPair.length > 0
    ) {
      const revertButton = this.assistButtonsPanel.getElement().querySelector('.revert');
      if (revertButton) {
        revertButton.disabled = false;
        revertButton.classList.remove('disabled');
      }
    }

    if (!this.isResumingGame && currentGameIndicatorsView.totalSeconds === 0) {
      currentGameIndicatorsView.resetTimer();
      currentGameIndicatorsView.startTimer();
    }
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
      const completedGames = gameResult || [];

      const modalInfo = new ElementCreator({
        tag: 'h2',
        classNames: ['modal-info'],
        textContent: 'Score Table',
      });
      modalContent.addInnerElement(modalInfo);
      const lastFiveGames = [...completedGames].sort((a, b) => a.time - b.time);

      if (lastFiveGames.length === 0) {
        const emptyMessage = new ElementCreator({
          tag: 'div',
          classNames: ['score-table-empty'],
          textContent: 'No completed games yet. Play to see your results!',
        });
        modalContent.addInnerElement(emptyMessage);
      } else {
        const scoreTableList = new ElementCreator({
          tag: 'div',
          classNames: ['score-table-list'],
        });

        lastFiveGames.forEach((game, index) => {
          const gameItem = new ElementCreator({
            tag: 'div',
            classNames: [
              'score-table-item',
              game.state === 'win' ? 'score-table-item-win' : 'score-table-item-lose',
            ],
          });

          if (game.state === 'win') {
            const trophyIcon = new ElementCreator({
              tag: 'span',
              classNames: ['trophy-icon'],
              textContent: '⭐',
            });
            gameItem.addInnerElement(trophyIcon);
          }
          const gameInfo = new ElementCreator({
            tag: 'div',
            classNames: ['score-table-game-info'],
          });
          const modeLabel = new ElementCreator({
            tag: 'span',
            classNames: ['score-table-mode'],
            textContent: game.mode.charAt(0).toUpperCase() + game.mode.slice(1),
          });
          gameInfo.addInnerElement(modeLabel);

          const resultLabel = new ElementCreator({
            tag: 'span',
            classNames: [
              'score-table-result',
              game.state === 'win' ? 'score-table-result-win' : 'score-table-result-lose',
            ],
            textContent: game.state === 'win' ? 'Win' : 'Lose',
          });
          gameInfo.addInnerElement(resultLabel);

          const gameDetails = new ElementCreator({
            tag: 'div',
            classNames: ['score-table-details'],
          });

          const scoreDetail = new ElementCreator({
            tag: 'div',
            classNames: ['score-table-detail'],
          });
          const scoreLabel = new ElementCreator({
            tag: 'span',
            classNames: ['score-table-detail-label'],
            textContent: `Score: ${game.score || 0}`,
          });
          scoreDetail.addInnerElement(scoreLabel);
          gameDetails.addInnerElement(scoreDetail);

          const minutes = Math.floor(game.time / 60);
          const seconds = game.time % 60;
          const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          const timeDetail = new ElementCreator({
            tag: 'div',
            classNames: ['score-table-detail'],
          });
          const timeLabel = new ElementCreator({
            tag: 'span',
            classNames: ['score-table-detail-label'],
            textContent: `Time: ${formattedTime}`,
          });

          timeDetail.addInnerElement(timeLabel);
          gameDetails.addInnerElement(timeDetail);

          const movesDetail = new ElementCreator({
            tag: 'div',
            classNames: ['score-table-detail'],
          });
          const movesLabel = new ElementCreator({
            tag: 'span',
            classNames: ['score-table-detail-label'],
            textContent: `Moves: ${game.amountOfMoves || 0}`,
          });

          movesDetail.addInnerElement(movesLabel);
          gameDetails.addInnerElement(movesDetail);

          gameItem.addInnerElement(gameInfo);
          gameItem.addInnerElement(gameDetails);
          scoreTableList.addInnerElement(gameItem);
        });

        modalContent.addInnerElement(scoreTableList);
      }

      const modalButton = new ElementCreator({
        tag: 'button',
        classNames: ['modal-button', 'btn'],
        textContent: 'Close',
        callback: () => {
          this.closeModal();
        },
      });
      modalContent.addInnerElement(modalButton);
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

      const buttonsContainer = new ElementCreator({
        tag: 'div',
        classNames: ['modal-buttons-container'],
      });

      const playAgainButton = new ElementCreator({
        tag: 'button',
        classNames: ['modal-button', 'btn', 'play-again-btn'],
        textContent: 'Play Again',
        callback: () => {
          this.gameController.restartGameWithSameSettings();
          this.updateRootView();
        },
      });
      buttonsContainer.addInnerElement(playAgainButton);

      const newGameButton = new ElementCreator({
        tag: 'button',
        classNames: ['modal-button', 'btn', 'new-game-btn'],
        textContent: 'Start Screen',
        callback: () => {
          this.gameController.getGameModel().gameState = 'waiting';
          this.closeModal();
          this.updateRootView();
        },
      });
      buttonsContainer.addInnerElement(newGameButton);

      modalContent.addInnerElement(buttonsContainer);
    }

    modal.addInnerElement(modalContent);
    main.append(modal.getElement());
  }
  closeModal() {
    const main = this.getElement();
    const modal = main.querySelector('.modal-bg');
    if (modal) {
      modal.remove();
    }
  }

  updateRootView(isResumingGame = false) {
    const main = this.getElement();
    const modal = main.querySelector('.modal-bg');
    if (modal) {
      modal.remove();
    }
    main.innerHTML = '';
    this.isResumingGame = isResumingGame;
    this.createView();
  }
}
