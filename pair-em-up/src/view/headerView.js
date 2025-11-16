import ElementCreator from '../utils/element-creator.js';

export default class HeaderView extends ElementCreator {
  constructor() {
    super({
      tag: 'header',
      classNames: ['header'],
    });
    this.gameMode = 'classic';
    this.onSelectHandler = null;
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
  updateView(mode){
    const header = this.getElement();
    const modeSelect = header.querySelector('.mode-select');
    modeSelect.value = mode;
  }
}
