import RootView from './view/rootView.js';
import GameController from './controller/gameController.js';

const rootView = new RootView();
const gameController = new GameController(rootView);
rootView.setGameController(gameController);
rootView.createView();
