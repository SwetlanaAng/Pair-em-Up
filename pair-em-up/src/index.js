import RootView from './view/rootView.js';
import GameController from './controller/gameController.js';

const gameController = new GameController();
const rootView = new RootView(gameController);
rootView.createView();
