export default class AudioSettingsService {
  constructor() {
    this.SETTINGS_KEY = 'pair-em-up-audio-settings';
    this.defaultSettings = {
      cellClick: true,
      successfulMatch: true,
      invalidPair: true,
      assistTools: true,
      gameEvents: true,
    };
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem(this.SETTINGS_KEY);
    if (saved) {
      return { ...this.defaultSettings, ...JSON.parse(saved) };
    }
    return { ...this.defaultSettings };
  }

  saveSettings() {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
  }

  getSetting(key) {
    return this.settings[key] !== undefined ? this.settings[key] : this.defaultSettings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }

  toggleSetting(key) {
    this.settings[key] = !this.settings[key];
    this.saveSettings();
    return this.settings[key];
  }
}
