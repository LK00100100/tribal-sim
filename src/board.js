
export default class Board {

    constructor(){
        this.boardTerrain = [[]];
        this.boardUnits = [[]];
    }

    initBoard(someInputHereLater){

        //TODO: make this more dynamic later

        this.boardTerrain = [
            [1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1]
        ];

        this.boardUnits = [];

        for(let row = 0; row < 8; row++){
            let theRow = [];
            for(let col = 0; col < 8; col++){
                theRow.push(null);
            }
            this.boardUnits.push(theRow);
        }

    }

    addArmy(row, col, army){
        this.boardUnits[row][col] = army;
    }


}
