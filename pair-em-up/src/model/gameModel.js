export default class GameModel {
  constructor() {
    this.initialGameField = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    this.gameField = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 1, 1, 2, 1, 3, 1, 4, 1],
      [5, 1, 6, 1, 7, 1, 8, 1, 9],
    ];
    this.maxRows = 50;
    this.columns = 9;
    this.gameMode = 'classic';
    this.score = 0;
    this.gameState = 'playing';
    this.addNumberCount = 10;
    this.shuffleCount = 5;
  }
  getGameField() {
    return this.gameField;
  }

  getRowsCount() {
    return this.gameField.length;
  }

  setGameMode(gameMode) {
    this.gameMode = gameMode;
    if (this.gameMode === 'classic') {
      this.gameField = this.getClassicGameField();
    } else if (this.gameMode === 'chaotic') {
      this.gameField = this.getChaoticGameField();
    } else if (this.gameMode === 'random') {
      this.gameField = this.getRandomGameField();
    }
  }

  getGameFieldFromArray(array) {
    this.gameField = [];
    const interimArray = [];
    let chankArray = [];
    array.forEach((item) => {
      if (item / 10 > 1) {
        interimArray.push(1);
        interimArray.push(item % 10);
      } else {
        interimArray.push(item);
      }
      return item;
    });
    for (let i = 0; i < interimArray.length; i++) {
      chankArray = interimArray.slice(i, i + 9);
      this.gameField.push(chankArray);
      if (this.gameField.length > this.maxRows) {
        this.gameState = 'lose';
        this.score = 0;
        this.addNumberCount = 10;
        //return ????
      }
      i = i + 8;
    }
    return this.gameField;
  }
  getClassicGameField() {
    return this.getGameFieldFromArray(this.initialGameField);
  }
  getChaoticGameField() {
    this.gameField = [];
    for (let i = 0; i < 3; i++) {
      this.gameField.push(Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1));
    }
    return this.gameField;
  }
  getRandomGameField() {
    let interimArray = Array.from(this.initialGameField);
    return this.getGameFieldFromArray(interimArray.sort(() => Math.random() - 0.5));
  }

  getLeftNumbers() {
    return this.gameField.forEach((row) => {
      return row.filter((cell) => cell !== 0);
    });
  }

  getCellValue(row, col) {
    if (row >= 0 && row < this.gameField.length && col >= 0 && col < this.columns) {
      return this.gameField[row][col];
    }
    return null;
  }

  setCellValue(row, col, value) {
    if (row >= 0 && row < this.gameField.length && col >= 0 && col < this.columns) {
      this.gameField[row][col] = value;
      return true;
    }
    return false;
  }
  getPoints(val1, val2) {
    if (val1 === 5 && val2 === 5) {
      return 3;
    } else if (val1 === val2) {
      return 1;
    } else if (val1 + val2 === 10) {
      return 2;
    } else return false;
  }
  /*   isValidCell(array, row, col) {
    if (array[row][col] === 0) return false;
    if (row > 0) {
      //up
      if (this.getPoints(array[row][col], array[row - 1][col])) return true;
      if (array[row - 1][col] === 0) {
        let newRow = row;
        while (newRow > 0 && array[newRow - 1][col] === 0) newRow--;
        if (this.getPoints(array[row][col], array[newRow][col])) return true;
      }
    }
    if (row < array.length - 1) {
      //down
      if (this.getPoints(array[row][col], array[row + 1][col])) return true;
      if (array[row + 1][col] === 0) {
        let newRow = row;
        while (newRow < array.length - 1 && array[newRow + 1][col] === 0) newRow--;
        if (this.getPoints(array[row][col], array[newRow + 1][col])) return true;
      }
    }
    if (col > 0) {
      //left
      if (this.getPoints(array[row][col], array[row][col - 1])) return true;
      if (array[row][col - 1] === 0) {
        let newCol = col;
        let newRow = row;
        while (newCol > 0 && array[newRow][newCol - 1] === 0) {
          newCol--;
          if (newCol === 0) {
            newRow--;
            if (newRow < 0) break;
            newCol = 9;
          }
        }
        if (this.getPoints(array[row][col], array[row][newCol])) return true;
      }
    } else {
      let newCol = 9;
      if (this.getPoints(array[row][col], array[row][newCol])) return true;
      if (array[row][newCol] === 0) {
        let newRow = row;
        while (newCol > 0 && array[newRow][newCol - 1] === 0) {
          newCol--;
          if (newCol === 0) {
            newRow--;
            if (newRow < 0) break;
            newCol = 9;
          }
        }
        if (this.getPoints(array[row][col], array[row][newCol])) return true;
      }
    }

    if (col < array[row].length - 1) {
      //right
      if (this.getPoints(array[row][col], array[row][col + 1])) return true;
      if (array[row][col + 1] === 0) {
        let newCol = col;
        let newRow = row;
        while (newCol < array[row].length - 1 && array[newRow][newCol + 1] === 0) {
          newCol++;
          if (newCol === 9) {
            newRow++;
          }
        }
      }
    } else {
      if (this.getPoints(array[row][col], array[row + 1][0])) return true;
      if (array[row + 1][0] === 0) {
        let newRow = row;
        while (newRow < array.length - 1 && array[newRow + 1][0] === 0) newRow++;
        if (this.getPoints(array[row][col], array[newRow + 1][0])) return true;
      }
    }

    return false;
  } */
  getNumberValidPairs(array) {
    let numberValidPairs = 0;
    const flatArray = array.flat();

    for (let i = 0; i < flatArray.length; i++) {
      if (flatArray[i] === 0) continue;

      const row1 = Math.floor(i / this.columns);
      const col1 = i % this.columns;
      const val1 = flatArray[i];

      for (let j = i + 1; j < flatArray.length; j++) {
        if (flatArray[j] === 0) continue;

        const row2 = Math.floor(j / this.columns);
        const col2 = j % this.columns;
        const val2 = flatArray[j];

        if (this.checkValidPair(row1, col1, row2, col2, val1, val2, array)) {
          numberValidPairs++;
        }
      }
    }

    return numberValidPairs;
  }
  checkValidPair(row1, col1, row2, col2, val1, val2, gameFieldArray = null) {
    const field = gameFieldArray || this.gameField;

    if (this.getPoints(val1, val2)) {
      if (col1 === col2) {
        if (Math.abs(row1 - row2) === 1) {
          return true;
        } else {
          const minRow = Math.min(row1, row2);
          const maxRow = Math.max(row1, row2);
          for (let i = minRow + 1; i < maxRow; i++) {
            if (field[i][col1] !== 0) {
              return false;
            }
          }
          return true;
        }
      } else if (row1 === row2) {
        if (Math.abs(col1 - col2) === 1) {
          return true;
        } else {
          const minCol = Math.min(col1, col2);
          const maxCol = Math.max(col1, col2);
          for (let i = minCol + 1; i < maxCol; i++) {
            if (field[row1][i] !== 0) {
              return false;
            }
          }
          return true;
        }
      } else {
        const flatGameField = field.flat();
        const index1 = row1 * this.columns + col1;
        const index2 = row2 * this.columns + col2;
        const diffIndex = Math.abs(index1 - index2);

        if (diffIndex === 1) {
          return true;
        } else {
          const minIndex = Math.min(index1, index2);
          const maxIndex = Math.max(index1, index2);
          for (let i = minIndex + 1; i < maxIndex; i++) {
            if (flatGameField[i] !== 0) {
              return false;
            }
          }
          return true;
        }
      }
    } else return false;
  }
  onCheckedValidPair(row1, col1, row2, col2, val1, val2) {
    if (this.checkValidPair(row1, col1, row2, col2, val1, val2)) {
      this.gameField[row1][col1] = 0;
      this.gameField[row2][col2] = 0;
      this.score += this.getPoints(val1, val2);
      if (this.score >= 10) {
        //поменять на 100
        this.gameState = 'win';
        this.score = 0;
        this.addNumberCount = 10;
      }
      return true;
    } else return false;
  }
  addNumbersToGameField() {
    this.addNumberCount--;
    const currentGameField = this.gameField.flat();
    const leftNumbers = currentGameField.filter((cell) => cell !== 0);

    if (this.gameMode === 'classic') {
      this.getGameFieldFromArray(currentGameField.concat(leftNumbers));
    } else if (this.gameMode === 'random') {
      this.getGameFieldFromArray(
        currentGameField.concat(leftNumbers.sort(() => Math.random() - 0.5))
      );
    } else if (this.gameMode === 'chaotic') {
      const arr = Array.from(
        { length: leftNumbers.length },
        () => Math.floor(Math.random() * 9) + 1
      );
      this.getGameFieldFromArray(currentGameField.concat(arr));
    }
  }
  shuffleGameField() {
    this.shuffleCount--;
    this.gameField = this.gameField.sort(() => Math.random() - 0.5);
  }
}
