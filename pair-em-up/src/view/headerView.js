import ElementCreator from '../utils/element-creator.js';
import AudioSettingsService from '../utils/audioSettingsService.js';
import ThemeService from '../utils/themeService.js';

export default class HeaderView extends ElementCreator {
  constructor() {
    super({
      tag: 'header',
      classNames: ['header'],
    });
    this.gameMode = 'classic';
    this.onSelectHandler = null;
    this.audioSettingsService = new AudioSettingsService();
    this.themeService = new ThemeService();
  }

  onSelect(handler) {
    this.onSelectHandler = handler;
  }
  createView() {
    const header = this.getElement();
    header.innerHTML = '';
    const headingBox = new ElementCreator({
      tag: 'div',
      classNames: ['heading-box'],
    });
    const heading = new ElementCreator({
      tag: 'h1',
      classNames: ['h1'],
      textContent: "Pair 'em Up",
    });
    const gitLink = new ElementCreator({
      tag: 'a',
      classNames: ['git-link'],
      textContent: 'by @SwetlanaAng',
      attributesNames: [
        ['href', 'https://github.com/swetlanaang'],
        ['target', '_blank'],
      ],
    });

    headingBox.addInnerElement(heading);
    headingBox.addInnerElement(gitLink);

    const controlsBox = new ElementCreator({
      tag: 'div',
      classNames: ['controls-box'],
    });

    const gameModeWrapper = new ElementCreator({
      tag: 'div',
      classNames: ['select-wrapper'],
    });
    const gameModeLabel = new ElementCreator({
      tag: 'label',
      classNames: ['select-label'],
      textContent: 'Game mode',
      attributesNames: [['for', 'game-mode']],
    });
    const modeSelect = new ElementCreator({
      tag: 'select',
      classNames: ['mode-select'],
      attributesNames: [
        ['id', 'game-mode'],
        ['name', 'game-mode'],
      ],
      callback: (event) => {
        this.onSelectHandler?.(event.target.value);
      },
      eventName: 'change',
    });

    const classicOption = new ElementCreator({
      tag: 'option',
      attributesNames: [['value', 'classic']],
      textContent: 'Classic',
    });

    const randomOption = new ElementCreator({
      tag: 'option',
      attributesNames: [['value', 'random']],
      textContent: 'Random',
    });

    const chaoticOption = new ElementCreator({
      tag: 'option',
      attributesNames: [['value', 'chaotic']],
      textContent: 'Chaotic',
    });

    modeSelect.addInnerElement(classicOption);
    modeSelect.addInnerElement(randomOption);
    modeSelect.addInnerElement(chaoticOption);

    gameModeWrapper.addInnerElement(gameModeLabel);
    gameModeWrapper.addInnerElement(modeSelect);

    const settingsWrapper = new ElementCreator({
      tag: 'div',
      classNames: ['select-wrapper'],
    });
    const settingsSelect = new ElementCreator({
      tag: 'select',
      classNames: ['settings-select'],
      attributesNames: [
        ['id', 'settings'],
        ['name', 'settings'],
      ],
      callback: (event) => {
        if (event.target.value === 'audio') {
          this.showAudioSettings();
          event.target.value = '';
        } else if (event.target.value === 'theme') {
          this.showThemeSettings();
          event.target.value = '';
        }
      },
      eventName: 'change',
    });
    const settingsTitleOption = new ElementCreator({
      tag: 'option',
      attributesNames: [
        ['value', ''],
        ['disabled', ''],
        ['selected', ''],
      ],
      textContent: 'Settings',
    });

    const audioOption = new ElementCreator({
      tag: 'option',
      attributesNames: [['value', 'audio']],
      textContent: 'Audio',
    });

    const themeOption = new ElementCreator({
      tag: 'option',
      attributesNames: [['value', 'theme']],
      textContent: 'Theme',
    });

    settingsSelect.addInnerElement(settingsTitleOption);
    settingsSelect.addInnerElement(audioOption);
    settingsSelect.addInnerElement(themeOption);

    settingsWrapper.addInnerElement(settingsSelect);

    controlsBox.addInnerElement(settingsWrapper);
    controlsBox.addInnerElement(gameModeWrapper);
    header.append(headingBox.getElement());
    header.append(controlsBox.getElement());

    return header;
  }
  updateView(mode) {
    const header = this.getElement();
    const modeSelect = header.querySelector('.mode-select');
    modeSelect.value = mode;
  }

  showAudioSettings() {
    const header = this.getElement();
    const existingModal = header.querySelector('.audio-settings-modal-bg');
    if (existingModal) {
      existingModal.remove();
    }

    const modalBg = new ElementCreator({
      tag: 'div',
      classNames: ['audio-settings-modal-bg'],
    });

    const modalContent = new ElementCreator({
      tag: 'div',
      classNames: ['audio-settings-modal-content'],
    });

    const title = new ElementCreator({
      tag: 'h2',
      classNames: ['audio-settings-title'],
      textContent: 'Audio Settings',
    });
    modalContent.addInnerElement(title);

    const settingsList = new ElementCreator({
      tag: 'div',
      classNames: ['audio-settings-list'],
    });

    const settings = [
      { key: 'cellClick', label: 'Cell selection/deselection' },
      { key: 'successfulMatch', label: 'Successful pair matching' },
      { key: 'invalidPair', label: 'Invalid pair matching' },
      { key: 'assistTools', label: 'Assist and controls buttons usage' },
      { key: 'gameEvents', label: 'Game win and lose events' },
    ];

    settings.forEach((setting) => {
      const settingItem = new ElementCreator({
        tag: 'div',
        classNames: ['audio-settings-item'],
      });

      const label = new ElementCreator({
        tag: 'label',
        classNames: ['audio-settings-label'],
        textContent: setting.label,
        attributesNames: [['for', `audio-${setting.key}`]],
      });

      const checkbox = new ElementCreator({
        tag: 'input',
        classNames: ['audio-settings-checkbox'],
        attributesNames: [
          ['type', 'checkbox'],
          ['id', `audio-${setting.key}`],
        ],
        callback: () => {
          this.audioSettingsService.toggleSetting(setting.key);
        },
        eventName: 'change',
      });

      if (this.audioSettingsService.getSetting(setting.key)) {
        checkbox.getElement().checked = true;
      }

      settingItem.addInnerElement(checkbox);
      settingItem.addInnerElement(label);
      settingsList.addInnerElement(settingItem);
    });

    modalContent.addInnerElement(settingsList);

    const closeButton = new ElementCreator({
      tag: 'button',
      classNames: ['audio-settings-close', 'btn'],
      textContent: 'Close',
      callback: () => {
        modalBg.getElement().remove();
      },
    });
    modalContent.addInnerElement(closeButton);

    modalBg.addInnerElement(modalContent);
    header.append(modalBg.getElement());
  }

  getAudioSettingsService() {
    return this.audioSettingsService;
  }

  getThemeService() {
    return this.themeService;
  }

  showThemeSettings() {
    const header = this.getElement();
    const existingModal = header.querySelector('.theme-settings-modal-bg');
    if (existingModal) {
      existingModal.remove();
    }

    const modalBg = new ElementCreator({
      tag: 'div',
      classNames: ['theme-settings-modal-bg'],
    });

    const modalContent = new ElementCreator({
      tag: 'div',
      classNames: ['theme-settings-modal-content'],
    });

    const title = new ElementCreator({
      tag: 'h2',
      classNames: ['theme-settings-title'],
      textContent: 'Theme Settings',
    });
    modalContent.addInnerElement(title);

    const themeOptions = new ElementCreator({
      tag: 'div',
      classNames: ['theme-settings-options'],
    });

    const themes = [
      { key: 'dark', label: 'Dark Theme' },
      { key: 'light', label: 'Light Theme' },
    ];

    themes.forEach((theme) => {
      const themeOption = new ElementCreator({
        tag: 'div',
        classNames: ['theme-settings-option'],
      });

      const radio = new ElementCreator({
        tag: 'input',
        classNames: ['theme-settings-radio'],
        attributesNames: [
          ['type', 'radio'],
          ['name', 'theme'],
          ['id', `theme-${theme.key}`],
          ['value', theme.key],
        ],
        callback: () => {
          this.themeService.setTheme(theme.key);
          themeOptions
            .getElement()
            .querySelectorAll('.theme-settings-option')
            .forEach((opt) => {
              opt.classList.remove('selected');
            });
          themeOption.getElement().classList.add('selected');
        },
        eventName: 'change',
      });

      if (this.themeService.getTheme() === theme.key) {
        radio.getElement().checked = true;
        themeOption.getElement().classList.add('selected');
      }

      const label = new ElementCreator({
        tag: 'label',
        classNames: ['theme-settings-label'],
        textContent: theme.label,
        attributesNames: [['for', `theme-${theme.key}`]],
      });

      themeOption.addInnerElement(radio);
      themeOption.addInnerElement(label);
      themeOptions.addInnerElement(themeOption);
    });

    modalContent.addInnerElement(themeOptions);

    const closeButton = new ElementCreator({
      tag: 'button',
      classNames: ['theme-settings-close', 'btn'],
      textContent: 'Close',
      callback: () => {
        modalBg.getElement().remove();
      },
    });
    modalContent.addInnerElement(closeButton);

    modalBg.addInnerElement(modalContent);
    header.append(modalBg.getElement());
  }
}
