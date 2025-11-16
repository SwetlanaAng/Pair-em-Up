export default class LocalStorageService {
  constructor() {
    this.COMPLETED_GAMES_RESULTS_KEY = 'pair-em-up-game-results';
    this.SAVED_GAME_KEY = 'pair-em-up-saved-game';
    this.maxResults = 5;
  }

  saveGameToStorage(gameResult) {
    // gameResult - это объект с данными - field. mode. time. score. undo history. assist buttons hist. amount of moves
    localStorage.setItem(this.SAVED_GAME_KEY, JSON.stringify(gameResult));
    console.log(gameResult);
    /* const maxResults = 5;
    const limitedResults = results.slice(0, maxResults); */

    //localStorage.setItem(this.GAME_RESULTS_KEY, JSON.stringify(limitedResults));
  }

  getSavedGameResults() {
    const results = localStorage.getItem(this.SAVED_GAME_KEY);
    return results ? JSON.parse(results) : {}; // что вернет?
  }

  clearSavedGame() {
    localStorage.removeItem(this.SAVED_GAME_KEY);
  }

  getCompletedGamesList() {
    const completedGames = localStorage.getItem(this.COMPLETED_GAMES_RESULTS_KEY);
    return completedGames ? JSON.parse(completedGames) : [];
  }
  setCompletedGameToStorage(gameResult) {
    // gameResult - это объект с данными - mode. time. score.  amount of moves. win/lose
    const completedGames = this.getCompletedGamesList();
    completedGames.push(gameResult);
    const limitedCompletedGames = completedGames.slice(0, this.maxResults);
    localStorage.setItem(this.COMPLETED_GAMES_RESULTS_KEY, JSON.stringify(limitedCompletedGames));
  }
}
