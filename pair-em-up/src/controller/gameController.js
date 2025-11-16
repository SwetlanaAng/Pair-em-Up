import GameModel from '../model/gameModel.js';
import GameFieldView from '../view/gameFieldView.js';
import HeaderView from '../view/headerView.js';
import CurrentGameIndicatorsView from '../view/currentGameIndicators.js';

export default class GameController {
  constructor(rootView) {
    this.gameModel = new GameModel();
    this.gameFieldView = new GameFieldView(this);
    this.headerView = new HeaderView();
    this.rootView = rootView;
    this.currentGameIndicatorsView = new CurrentGameIndicatorsView(rootView);
    this.assistButtonsPanel = this.rootView.assistButtonsPanel;
    this.controlButtonsPanel = this.rootView.controlButtonsPanel;
  }

  init() {
    const gameFieldData = this.gameModel.getGameField();
    this.setupHeaderHandler();

    return this.gameFieldView.createView(gameFieldData);
  }

  setupHeaderHandler() {
    this.headerView.onSelect((gameMode) => {
      this.gameModel.setGameMode(gameMode);
      this.gameModel.score = 0;
      this.currentGameIndicatorsView.resetTimer();
      this.currentGameIndicatorsView.startTimer();
      const updatedGameFieldData = this.gameModel.getGameField();
      this.currentGameIndicatorsView.updateView(this.gameModel.score, gameMode);
      this.gameFieldView.updateView(updatedGameFieldData);
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
    return this.gameModel.getNumberValidPairs(this.gameModel.gameField);
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
    this.gameFieldView.revertPair = [];
    this.gameModel.startNewGame();
    this.currentGameIndicatorsView.resetTimer();
    this.currentGameIndicatorsView.startTimer();
    /* const updatedGameFieldData = this.gameModel.getGameField(); //пока не знаю
    this.gameFieldView.updateView(updatedGameFieldData);
    this.currentGameIndicatorsView.updateView(this.gameModel.score, this.gameModel.gameState);
    this.assistButtonsPanel.updateView(this); */
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
    this.gameModel.saveGame(
      this.currentGameIndicatorsView.totalSeconds,
      this.gameFieldView.revertPair
    );
  }
  updateGame(min, sec) {
    this.gameFieldView.updateView(this.gameModel.gameField);
    this.headerView.updateView(this.gameModel.gameMode);
    this.currentGameIndicatorsView.updateView(this.gameModel.score, this.gameModel.gameState);
    this.assistButtonsPanel.updateView(this);
    this.currentGameIndicatorsView.updateTimer(min, sec);
  }
  startSavedGame() {
    const savedGame = this.gameModel.localStorageService.getSavedGameResults();
    console.log(savedGame);
    this.gameModel.gameMode = savedGame.mode;
    this.gameModel.gameField = savedGame.field;
    this.gameModel.score = savedGame.score;
    this.gameModel.addNumberCount = savedGame.addNumberCount;
    this.gameModel.shuffleCount = savedGame.shuffleCount;
    this.gameModel.eraserCount = savedGame.eraserCount;
    this.gameModel.amountOfMovesCount = savedGame.amountOfMoves;
    this.currentGameIndicatorsView.totalSeconds = savedGame.time;
    const minutes = Math.floor(this.currentGameIndicatorsView.totalSeconds / 60);
    const seconds = this.currentGameIndicatorsView.totalSeconds % 60;
    this.updateGame(minutes, seconds);
  }
  resetGame() {
    this.gameModel.resetGame();
    this.updateGame('00', '00');
  }
}
