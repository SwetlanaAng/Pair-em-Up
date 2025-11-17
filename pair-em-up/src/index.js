import RootView from './view/rootView.js';
import GameController from './controller/gameController.js';
import ThemeService from './utils/themeService.js';

// Инициализируем тему при загрузке страницы
const themeService = new ThemeService();

const rootView = new RootView();
const gameController = new GameController(rootView);
rootView.setGameController(gameController);
rootView.createView();
