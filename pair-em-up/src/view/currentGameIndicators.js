import ElementCreator from '../utils/element-creator.js';
export default class CurrentGameIndicatorsView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['score-display'],
    });
  }
  createView() {
    const currentGameIndicators = this.getElement();
    const scoreDisplay = new ElementCreator({
      tag: 'div',
      classNames: ['score-display'],
    });
    const currentScore = new ElementCreator({
      tag: 'span',
      classNames: ['current-score'],
      textContent: '0',
    });
    const targetScore = new ElementCreator({
      tag: 'span',
      classNames: ['target-score'],
      textContent: '/100',
    });

    const timerDisplay = new ElementCreator({
      tag: 'div',
      classNames: ['timer-display'],
    });
    const hours = new ElementCreator({
      tag: 'span',
      classNames: ['hours'],
      textContent: '00 : ',
    });
    const minutes = new ElementCreator({
      tag: 'span',
      classNames: ['minutes'],
      textContent: '00 : ',
    });
    const seconds = new ElementCreator({
      tag: 'span',
      classNames: ['seconds'],
      textContent: '00',
    });
    timerDisplay.addInnerElement(hours);
    timerDisplay.addInnerElement(minutes);
    timerDisplay.addInnerElement(seconds);

    scoreDisplay.addInnerElement(currentScore);
    scoreDisplay.addInnerElement(targetScore);

    currentGameIndicators.append(scoreDisplay.getElement());
    currentGameIndicators.append(timerDisplay.getElement());
    return currentGameIndicators;
  }
}
