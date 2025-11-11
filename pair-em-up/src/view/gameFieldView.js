import ElementCreator from '../utils/element-creator.js';

export default class GameFieldView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['game-field'],
    });
  }
  
  createView(gameFieldData) {
    const gameField = this.getElement();
    const gridContainer = new ElementCreator({
      tag: 'div',
      classNames: ['grid-container'],
    });

    gameFieldData.forEach((row, rowIndex) => {
      const rowElement = new ElementCreator({
        tag: 'div',
        classNames: ['grid-row'],
        attributesNames: [['data-row-index', rowIndex.toString()]],
      });

      row.forEach((cellValue, cellIndex) => {
        const cell = new ElementCreator({
          tag: 'div',
          classNames: ['grid-cell'],
          textContent: cellValue.toString(),
          attributesNames: [
            ['data-row', rowIndex.toString()],
            ['data-col', cellIndex.toString()],
          ],
        });

        rowElement.addInnerElement(cell);
      });

      gridContainer.addInnerElement(rowElement);
    });

    gameField.append(gridContainer.getElement());
    return gameField;
  }
  updateView(gameFieldData){
    const gameField = this.getElement();
    gameField.innerHTML = '';
    this.createView(gameFieldData);
  }
}
