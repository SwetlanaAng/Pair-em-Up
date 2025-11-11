import ElementCreator from '../utils/element-creator.js';
import CurrentGameIndicatorsView from './currentGameIndicators.js';
import AssistButtonsPanelView from './assistButtonsPanel.js';
import ControlButtonsPanelView from './controlButtonsPanel.js';

export default class RootView extends ElementCreator {
  constructor(gameController) {
    super({
      tag: 'div',
      classNames: ['root-view'],
    });
    this.gameController = gameController;
    this.currentGameIndicators = new CurrentGameIndicatorsView();
    this.controlButtonsPanel = new ControlButtonsPanelView();
    this.assistButtonsPanel = new AssistButtonsPanelView();
  }
  createView() {
    const main = this.getElement();
    document.body.append(main);
    const headerView = this.gameController.getHeaderView().createView();
    main.append(headerView);
    const currentGameIndicatorsView = this.currentGameIndicators.createView();
    main.append(currentGameIndicatorsView);
    const gameFieldView = this.gameController.init();
    main.append(gameFieldView);
    const controlButtonsPanelView = this.controlButtonsPanel.createView();
    main.append(controlButtonsPanelView);
    const assistButtonsPanelView = this.assistButtonsPanel.createView();
    main.append(assistButtonsPanelView);
  }
}
