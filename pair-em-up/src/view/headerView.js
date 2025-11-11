import ElementCreator from '../utils/element-creator.js';
export default class HeaderView extends ElementCreator {
  constructor() {
    super({
      tag: 'header',
      classNames: ['header'],
    });
  }
  createView() {
    const header = this.getElement();
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
      textContent: 'by Swetlana Ang',
      attributesNames: [['href', 'https://github.com/swetlanaang']],
    });

    const modeSelect = new ElementCreator({
      tag: 'select',
      classNames: ['mode-select'],
      attributesNames: [
        ['id', 'game-mode'],
        ['name', 'game-mode'],
      ],
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

    const settingsSelect = new ElementCreator({
      tag: 'select',
      classNames: ['settings-select'],
      attributesNames: [
        ['id', 'settings'],
        ['name', 'settings'],
      ],
    });
    const audioOption = new ElementCreator({
      tag: 'option',
      attributesNames: [['value', 'audio']],
      textContent: 'audio',
    });

    const themeOption = new ElementCreator({
      tag: 'option',
      attributesNames: [['value', 'theme']],
      textContent: 'theme',
    });

    settingsSelect.addInnerElement(audioOption);
    settingsSelect.addInnerElement(themeOption);

    modeSelect.addInnerElement(classicOption);
    modeSelect.addInnerElement(randomOption);
    modeSelect.addInnerElement(chaoticOption);

    headingBox.addInnerElement(heading);
    headingBox.addInnerElement(gitLink);

    header.append(headingBox.getElement());
    header.append(modeSelect.getElement());
    header.append(settingsSelect.getElement());
    return header;
  }
}
