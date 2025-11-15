import ElementCreator from '../utils/element-creator.js';

export default class CurrentGameIndicatorsView extends ElementCreator {
  constructor(rootView) {
    super({
      tag: 'div',
      classNames: ['indicators-display'],
    });
    this.rootView = rootView;
    this.gameController = null;
    this.minutes = '00';
    this.seconds = '00';
    this.timerInterval = null;
    this.totalSeconds = 0;
  }
  createView(points = 0) {
    const currentGameIndicators = this.getElement();
    currentGameIndicators.innerHTML = '';
    const scoreDisplay = new ElementCreator({
      tag: 'div',
      classNames: ['score-display'],
    });
    const currentScore = new ElementCreator({
      tag: 'span',
      classNames: ['current-score'],
      textContent: `${points}`,
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
    
    const minutes = new ElementCreator({
      tag: 'span',
      classNames: ['minutes'],
      textContent: `${this.minutes} : `,
    });
    const seconds = new ElementCreator({
      tag: 'span',
      classNames: ['seconds'],
      textContent: `${this.seconds}`,
    });
    timerDisplay.addInnerElement(minutes);
    timerDisplay.addInnerElement(seconds);

    scoreDisplay.addInnerElement(currentScore);
    scoreDisplay.addInnerElement(targetScore);

    currentGameIndicators.append(scoreDisplay.getElement());
    currentGameIndicators.append(timerDisplay.getElement());

    this.startTimer();
    
    return currentGameIndicators;
  }
  
  startTimer() {
    this.stopTimer();

    this.totalSeconds = 0;
 
    this.timerInterval = setInterval(() => {
      this.totalSeconds++;
      const minutes = Math.floor(this.totalSeconds / 60);
      const seconds = this.totalSeconds % 60;
      
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      
      this.updateTimer(formattedMinutes, formattedSeconds);
    }, 1000);
  }
  
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  resetTimer() {
    this.stopTimer();
    this.totalSeconds = 0;
    this.minutes = '00';
    this.seconds = '00';
    this.updateTimer('00', '00');
  }
  
  updateTimer(min, sec) {
    const currentGameIndicators = this.getElement();
    const minutes = currentGameIndicators.querySelector('.minutes');
    const seconds = currentGameIndicators.querySelector('.seconds');
    minutes.textContent = `${min} : `;
    seconds.textContent = `${sec}`;
    this.minutes = min;
    this.seconds = sec;
  }
  updateView(points = 0, gameState) {
    const currentGameIndicators = this.getElement();
    const currentScoreElement = currentGameIndicators.querySelector('.current-score');
    
    if (!currentScoreElement) {
      this.createView(points);
      return;
    }

    currentScoreElement.textContent = `${points}`;
    if (gameState === 'win' || gameState === 'lose') {
      this.stopTimer();
      if (gameState === 'win') {
        this.rootView.createModal('win');
      } else if (gameState === 'lose') {
        this.rootView.createModal('lose');
      }
    }
  }
}
