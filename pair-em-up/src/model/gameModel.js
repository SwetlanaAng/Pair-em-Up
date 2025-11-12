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
    this.gameMode = 'classic'
  }
  getGameField() {
    if(this.gameMode === 'classic'){
      return this.getClassicGameField();
    } else if(this.gameMode === 'chaotic'){
      return this.getChaoticGameField();
    } else if(this.gameMode === 'random'){
      return this.getRandomGameField();
    }
  }

  getRowsCount() {
    return this.gameField.length;
  }

  setGameMode(gameMode){
    this.gameMode = gameMode;
  }

  getGameFieldFromArray(array){
    this.gameField = [];
    const interimArray = [];
    let chankArray = [];
    array.forEach((item)=>{
        if(item/10>1){
            interimArray.push(1);
            interimArray.push(item%10);
        }else {
            interimArray.push(item);
        } 
        return item;
    })
    for(let i = 0; i < interimArray.length; i++){
        chankArray = interimArray.slice(i, i + 9);
        if(chankArray.length<9){
            chankArray.push(...Array(9 - chankArray.length).fill(0));
        }
        this.gameField.push(chankArray);
        i = i+8;
    }
    return this.gameField;
  }
  getClassicGameField(){
    
    return this.getGameFieldFromArray(this.initialGameField)
  }
  getChaoticGameField(){
    this.gameField = [];
    for(let i = 0; i < 3; i++){
        this.gameField.push(Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1))
    }
    return this.gameField;
  }
  getRandomGameField(){
    let interimArray = Array.from(this.initialGameField);
    return this.getGameFieldFromArray(interimArray.sort(() => Math.random() - 0.5))
  }

  getLeftNumbers(){
    return this.gameField.forEach((row)=>{
        return row.filter((cell)=> cell !== 0)
    })
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
}

