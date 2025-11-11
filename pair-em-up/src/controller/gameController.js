import GameModel from '../model/gameModel.js';
import GameFieldView from '../view/gameFieldView.js';
import HeaderView from '../view/headerView.js';

export default class GameController {
  constructor() {
    this.gameModel = new GameModel();
    this.gameFieldView = new GameFieldView();
    this.headerView = new HeaderView();
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

  getGameFieldView() {
    return this.gameFieldView;
  }

  getHeaderView() {
    return this.headerView;
  }

  getGameModel() {
    return this.gameModel;
  }

  updateView() {
    const gameFieldData = this.gameModel.getGameField();
    return this.gameFieldView.createView(gameFieldData);
  }
}

