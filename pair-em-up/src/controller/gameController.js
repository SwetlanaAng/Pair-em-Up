import GameModel from '../model/gameModel.js';
import GameFieldView from '../view/gameFieldView.js';
import HeaderView from '../view/headerView.js';
import CurrentGameIndicatorsView from '../view/currentGameIndicators.js';

export default class GameController {
  constructor() {
    this.gameModel = new GameModel();
    this.gameFieldView = new GameFieldView(this);
    this.headerView = new HeaderView();
    this.currentGameIndicatorsView = new CurrentGameIndicatorsView();
  }

  init() {
    const gameFieldData = this.gameModel.getGameField();
    
    this.setupHeaderHandler();

    return this.gameFieldView.createView(gameFieldData);
  }

  setupHeaderHandler() {
    this.headerView.onSelect((gameMode) => {
      this.gameModel.setGameMode(gameMode);
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
      this.currentGameIndicatorsView.updateView(isValid);
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

  updateView() {
    const gameFieldData = this.gameModel.getGameField();
    return this.gameFieldView.createView(gameFieldData);
  }
}

