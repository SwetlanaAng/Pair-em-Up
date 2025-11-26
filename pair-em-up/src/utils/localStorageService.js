export default class LocalStorageService {
  constructor() {
    this.COMPLETED_GAMES_RESULTS_KEY = 'pair-em-up-game-results';
    this.SAVED_GAME_KEY = 'pair-em-up-saved-game';
    this.maxResults = 5;
  }

  saveGameToStorage(gameResult) {
    localStorage.setItem(this.SAVED_GAME_KEY, JSON.stringify(gameResult));
  }

  getSavedGameResults() {
    const results = localStorage.getItem(this.SAVED_GAME_KEY);
    return results ? JSON.parse(results) : {};
  }

  getCompletedGamesList() {
    const completedGames = localStorage.getItem(this.COMPLETED_GAMES_RESULTS_KEY);
    return completedGames ? JSON.parse(completedGames) : [];
  }
  setCompletedGameToStorage(gameResult) {
    const completedGames = this.getCompletedGamesList();
    completedGames.push(gameResult);

    const limitedCompletedGames = completedGames.slice(-this.maxResults);
    localStorage.setItem(this.COMPLETED_GAMES_RESULTS_KEY, JSON.stringify(limitedCompletedGames));
  }
}
