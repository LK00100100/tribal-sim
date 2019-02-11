
export default class Board {

    constructor() {

        this.boardTerrain = [];
        this.boardWalkable = [];
        this.boardSailable = [];
        this.boardSprites = []; //holds terrain sprites
        this.boardUnits = [];   //holds occupying units
    }

    initBoard(someInputHereLater) {

        //TODO: make this more dynamic-y later

        this.boardTerrain = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]];

        //init board of isWalkable
        let answer;
        for (let row = 0; row < 8; row++) {
            let theRow = [];
            for (let col = 0; col < 8; col++) {
                answer = true;

                if (this.boardTerrain[row][col] == 1)
                    answer = false;
                else
                    answer = true;

                theRow.push(answer);
            }
            this.boardWalkable.push(theRow);
        }

        //init board of terrain sprites
        for (let row = 0; row < 8; row++) {
            let theRow = [];
            for (let col = 0; col < 8; col++) {
                theRow.push(null);
            }
            this.boardSprites.push(theRow);
        }

        //init board units
        this.boardUnits = [];
        for (let row = 0; row < 8; row++) {
            let theRow = [];
            for (let col = 0; col < 8; col++) {
                theRow.push(null);
            }
            this.boardUnits.push(theRow);
        }

    }

    addArmy(row, col, army) {
        this.boardUnits[row][col] = army;
    }

    removeArmy(row, col) {
        this.boardUnits[row][col] = null;
    }

    isWithinBounds(row, col) {

        if (row < 0 || row > this.boardTerrain.length)
            return false;

        if (col < 0 || col > this.boardTerrain[0].length)
            return false;

        return true;
    }

    isWalkable(row, col) {

        if (this.isWithinBounds(row, col) == false)
            return false;

        if(this.boardUnits[row][col] != null)
            return false;

        return this.boardWalkable[row][col];
    }

    //call isWalkable before you use this.
    movementCost(row, col) {

        let terrainType = this.boardTerrain[row][col];

        if (terrainType == 0)
            return 1;

        return 99999;

    }

}
