import ElementCreator from '../utils/element-creator.js';

export default class GameFieldView extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['game-field'],
    });
  }

  createView() {
    const gameField = this.getElement();
    const gridContainer = new ElementCreator({
      tag: 'div',
      classNames: ['grid-container'],
    });
    const initialData = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 1, 1, 2, 1, 3, 1, 4, 1],
      [5, 1, 6, 1, 7, 1, 8, 1, 9],
    ];

    initialData.forEach((row, rowIndex) => {
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
}
