export default class ThemeService {
  constructor() {
    this.THEME_KEY = 'pair-em-up-theme';
    this.currentTheme = this.loadTheme();
    this.applyTheme(this.currentTheme);
  }

  loadTheme() {
    const saved = localStorage.getItem(this.THEME_KEY);
    return saved || 'dark';
  }

  saveTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
    this.currentTheme = theme;
  }

  getTheme() {
    return this.currentTheme;
  }

  setTheme(theme) {
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
