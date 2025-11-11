import ElementCreator from "../utils/element-creator.js";
import HeaderView from "./headerView.js";
import CurrentGameIndicatorsView from "./currentGameIndicators.js";
import GameFieldView from "./gameFieldView.js";
export default class RootView extends ElementCreator {
  constructor() {
    super({
      tag: "div",
      classNames: ["root-view"],
    });
    this.header = new HeaderView();
    this.currentGameIndicators = new CurrentGameIndicatorsView();
    this.gameField = new GameFieldView();
  }
  createView() {
    const main = this.getElement();
    document.body.append(main);
    const headerView = this.header.createView();
    main.append(headerView);
    const currentGameIndicatorsView = this.currentGameIndicators.createView();
    main.append(currentGameIndicatorsView);
    const gameFieldView = this.gameField.createView();
    main.append(gameFieldView);
  }
}