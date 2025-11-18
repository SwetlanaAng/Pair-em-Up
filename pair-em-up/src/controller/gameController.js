import GameModel from '../model/gameModel.js';
import GameFieldView from '../view/gameFieldView.js';
import HeaderView from '../view/headerView.js';
import CurrentGameIndicatorsView from '../view/currentGameIndicators.js';
import LocalStorageService from '../utils/localStorageService.js';

export default class GameController {
  constructor(rootView) {
    this.gameModel = new GameModel();
    this.gameFieldView = new GameFieldView(this);
    this.headerView = new HeaderView();
    this.rootView = rootView;
    this.currentGameIndicatorsView = new CurrentGameIndicatorsView(rootView);
    this.assistButtonsPanel = this.rootView.assistButtonsPanel;
    this.controlButtonsPanel = this.rootView.controlButtonsPanel;
    this.localStorageService = new LocalStorageService();
    this.winAudio = new Audio('./assets/sounds/win.mp3');
    this.loseAudio = new Audio('./assets/sounds/lose.mp3');
    this.startNewGameAudio = new Audio('./assets/sounds/start.mp3');
    this.audioSettingsService = this.headerView.getAudioSettingsService();
    this.themeService = this.headerView.getThemeService();
  }

  init() {
    const gameFieldData = this.gameModel.getGameField();
    return this.gameFieldView.createView(gameFieldData);
  }

  setupAutoSave() {
    if (this.autoSaveSetup) {
      return;
    }
    this.autoSaveSetup = true;
    window.addEventListener('beforeunload', () => {
      this.autoSaveGame();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.autoSaveGame();
      }
    });
  }

  autoSaveGame() {
    if (this.gameModel.gameState === 'playing') {
      this.saveGame();
    }
  }

  setupHeaderHandler() {
    this.headerView.onSelect((gameMode) => {
      const wasPlaying = this.gameModel.gameState === 'playing';
      this.gameModel.setGameMode(gameMode);
      this.headerView.updateView(gameMode);
      if (!wasPlaying) {
        this.startNewGame();
      } else {
        this.startNewGame();
        const updatedGameFieldData = this.gameModel.getGameField();
        this.gameFieldView.updateView(updatedGameFieldData);
        this.currentGameIndicatorsView.updateTimer('00', '00');
      }
      this.startNewGameAudio.play();
    });
  }

  handleCellPairSelection(row1, col1, row2, col2) {
    const val1 = this.gameModel.getCellValue(row1, col1);
    const val2 = this.gameModel.getCellValue(row2, col2);
    const isValid = this.gameModel.onCheckedValidPair(row1, col1, row2, col2, val1, val2);

    if (isValid) {
      const updatedGameFieldData = this.gameModel.getGameField();
      this.gameFieldView.updateView(updatedGameFieldData);
      this.currentGameIndicatorsView.updateView(this.gameModel.score, this.gameModel.gameState);
      this.isWinOrLose();
    }

    return isValid;
  }

  getGameFieldView() {
    return this.gameFieldView;
  }

  getHeaderView() {
    return this.headerView;
  }

  getGameModel() {
    return this.gameModel;
  }

  getCurrentGameIndicatorsView() {
    return this.currentGameIndicatorsView;
  }
  updateGameFieldData(gameMode = 'classic') {
    return this.gameModel.setGameMode(gameMode);
  }
  setGameState(gameState) {
    return (this.gameModel.gameState = gameState);
  }
  updateView() {
    const gameFieldData = this.gameModel.getGameField();
    return this.gameFieldView.createView(gameFieldData);
  }
  addNumbersToGameField() {
    this.gameModel.addNumbersToGameField();
    const updatedGameFieldData = this.gameModel.getGameField();
    this.gameFieldView.updateView(updatedGameFieldData);
  }
  getValidPairsCount() {
    if (this.gameModel.gameState === 'lose') {
      return 0;
    }
    const validPairsCount = this.gameModel.getNumberValidPairs(this.gameModel.gameField);
    if (this.isFailed()) {
      this.isWinOrLose();
      return 0;
    }
    return validPairsCount;
  }
  shuffleGameField() {
    this.gameModel.shuffleGameField();
    const updatedGameFieldData = this.gameModel.getGameField();
    this.gameFieldView.updateView(updatedGameFieldData);
  }
  getEraserButton() {
    return this.assistButtonsPanel.getElement().querySelector('.eraser');
  }
  eraseCell(row, col) {
    this.gameModel.eraseCell(row, col);
    const updatedGameFieldData = this.gameModel.getGameField();
    this.gameFieldView.updateView(updatedGameFieldData);
  }
  startNewGame() {
    this.winAudio.pause();
    this.winAudio.currentTime = 0;
    this.loseAudio.pause();
    this.loseAudio.currentTime = 0;
    this.startNewGameAudio.play();

    this.gameFieldView.revertPair = [];
    this.gameModel.startNewGame();
    this.gameModel.gameState = 'playing';
    this.assistButtonsPanel.addNumbersIsDisabled = false;
    this.assistButtonsPanel.shuffleIsDisabled = false;

    this.rootView.updateRootView();
  }
  revertPair(row1, col1, row2, col2, val1, val2) {
    this.gameModel.revertPair(row1, col1, row2, col2, val1, val2);
    const updatedGameFieldData = this.gameModel.getGameField();
    this.gameFieldView.updateView(updatedGameFieldData);
    this.currentGameIndicatorsView.updateView(this.gameModel.score, this.gameModel.gameState);
  }
  getCellValue(row, col) {
    return this.gameModel.getCellValue(row, col);
  }
  saveGame() {
    const theme = this.themeService.getTheme();
    const audioSettings = this.audioSettingsService.getAllSettings();
    this.gameModel.saveGame(
      this.currentGameIndicatorsView.totalSeconds,
      this.gameFieldView.revertPair,
      theme,
      audioSettings
    );
    this.updateContinueButton();
  }
  updateGame(min, sec) {
    this.gameFieldView.updateView(this.gameModel.gameField);
    this.headerView.updateView(this.gameModel.gameMode);
    this.currentGameIndicatorsView.updateView(this.gameModel.score, this.gameModel.gameState);
    this.assistButtonsPanel.updateView(this);
    this.currentGameIndicatorsView.updateTimer(min, sec);
  }
  startSavedGame() {
    this.startNewGameAudio.play();
    const savedGame = this.gameModel.localStorageService.getSavedGameResults();
    this.gameModel.gameMode = savedGame.mode;
    this.gameModel.gameField = savedGame.field;
    this.gameModel.score = savedGame.score;
    this.gameModel.addNumberCount = savedGame.addNumberCount;
    this.gameModel.shuffleCount = savedGame.shuffleCount;
    this.gameModel.eraserCount = savedGame.eraserCount;
    this.gameModel.amountOfMovesCount = savedGame.amountOfMoves;

    if (savedGame.revertPair && savedGame.revertPair.length > 0) {
      this.gameFieldView.revertPair = savedGame.revertPair;
    } else {
      this.gameFieldView.revertPair = [];
    }

    if (savedGame.theme) {
      this.themeService.setTheme(savedGame.theme);
    }

    if (savedGame.audioSettings) {
      Object.keys(savedGame.audioSettings).forEach((key) => {
        this.audioSettingsService.setSetting(key, savedGame.audioSettings[key]);
      });
    }

    this.gameModel.gameState = 'playing';

    this.rootView.updateRootView(true);

    if (savedGame.time && savedGame.time > 0) {
      this.currentGameIndicatorsView.totalSeconds = savedGame.time;
      const minutes = Math.floor(savedGame.time / 60);
      const seconds = savedGame.time % 60;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      this.currentGameIndicatorsView.updateTimer(formattedMinutes, formattedSeconds);
      this.currentGameIndicatorsView.resumeTimer();
    }
  }
  resetGame() {
    this.startNewGameAudio.play();
    this.gameModel.resetGame();
    this.currentGameIndicatorsView.resetTimer();
    this.currentGameIndicatorsView.startTimer();
    this.updateGame('00', '00');
  }
  restartGameWithSameSettings() {
    const currentMode = this.gameModel.gameMode;
    this.gameModel.setGameMode(currentMode);
    this.startNewGame();
    this.updateGame('00', '00');
  }
  resetToStartScreen() {
    this.themeService.setTheme('dark');

    const defaultSettings = {
      cellClick: true,
      successfulMatch: true,
      invalidPair: true,
      assistTools: true,
      gameEvents: true,
    };
    Object.keys(defaultSettings).forEach((key) => {
      this.audioSettingsService.setSetting(key, defaultSettings[key]);
    });

    this.gameModel.setGameMode('classic');
    this.startNewGame();
    this.updateGame('00', '00');
  }
  showScoreTable() {
    const completedGames = this.localStorageService.getCompletedGamesList();
    this.rootView.createModal('score-table', completedGames);
  }
  isFailed() {
    if (this.gameModel.isFailed() || this.gameModel.gameState === 'lose') return true;
    else return false;
  }
  isWinOrLose() {
    if (this.gameModel.gameState === 'playing') {
      return;
    }

    const gameResult = {
      mode: this.gameModel.gameMode,
      score: this.gameModel.score,
      time: this.currentGameIndicatorsView.totalSeconds,
      amountOfMoves: this.gameModel.amountOfMovesCount,
      state: this.gameModel.gameState,
    };
    if (this.gameModel.gameState === 'win') {
      if (this.audioSettingsService.getSetting('gameEvents')) {
        this.winAudio.play();
      }
      this.localStorageService.clearSavedGame();
      this.updateContinueButton();
      this.rootView.createModal('win', gameResult);
      this.localStorageService.setCompletedGameToStorage(gameResult);
    } else if (this.gameModel.gameState === 'lose') {
      if (this.audioSettingsService.getSetting('gameEvents')) {
        this.loseAudio.play();
      }
      this.localStorageService.clearSavedGame();
      this.updateContinueButton();
      this.rootView.createModal('lose', gameResult);
      this.localStorageService.setCompletedGameToStorage(gameResult);
    }
  }

  updateContinueButton() {
    const continueButton = document.querySelector('.btn.continue');
    if (continueButton) {
      const hasSavedGame = !!this.localStorageService.getSavedGameResults().mode;
      if (hasSavedGame) {
        continueButton.disabled = false;
        continueButton.classList.remove('disabled');
      } else {
        continueButton.disabled = true;
        continueButton.classList.add('disabled');
      }
    }
  }
}
