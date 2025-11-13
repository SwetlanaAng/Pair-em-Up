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
      const updatedGameFieldData = this.gameModel.getGameField();
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
}
