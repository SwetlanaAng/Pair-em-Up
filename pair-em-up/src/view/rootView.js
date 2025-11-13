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
    const currentGameIndicatorsView = this.gameController
      .getCurrentGameIndicatorsView()
      .createView();
    main.append(currentGameIndicatorsView);
    const gameFieldView = this.gameController.init();
    main.append(gameFieldView);
    const controlButtonsPanelView = this.controlButtonsPanel.createView();
    main.append(controlButtonsPanelView);
    const assistButtonsPanelView = this.assistButtonsPanel.createView(this.gameController);
    main.append(assistButtonsPanelView);
  }

  createModal(state) {
    const main = this.getElement();
    const modal = new ElementCreator({
      tag: 'div',
      classNames: ['modal-bg'],
    });
    const modalContent = new ElementCreator({
      tag: 'div',
      classNames: ['modal-content'],
    });
    const modalInfo = new ElementCreator({
      tag: 'h2',
      classNames: ['modal-info'],
      textContent: state === 'win' ? 'You win!' : 'You lose!',
    });
    const modalButton = new ElementCreator({
      tag: 'button',
      classNames: ['modal-button', 'btn'],
      textContent: 'Play again',
      callback: () => {
        this.updateRootView();
      },
    });
    modalContent.addInnerElement(modalInfo);
    modalContent.addInnerElement(modalButton);
    modal.addInnerElement(modalContent);
    main.append(modal.getElement());
  }
  updateRootView() {
    const main = this.getElement();
    this.gameController.updateGameFieldData();
    this.gameController.setGameState('playing');
    main.innerHTML = '';
    this.createView();
  }
}
