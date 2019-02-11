
export default class Board {

    constructor() {

        //TODO: redo this?
        this.boardTerrain = [];
        this.boardWalkable = [];
        this.boardSailable = [];

        //these hold gameobjects (which hold data)
        this.boardTerrainSprites = []; //holds terrain sprites
        this.boardVillages = []; //holds terrain sprites
        this.boardUnits = [];   //holds occupying units
    }

    initBoard(someInputHereLater) {

        //TODO: make this more dynamic-y later
        //TODO: replace this hardcoded board
        this.boardTerrain = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 2, 2, 1],
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
            this.boardTerrainSprites.push(theRow);
        }

        //init board units
        for (let row = 0; row < 8; row++) {
            let theRow = [];
            for (let col = 0; col < 8; col++) {
                theRow.push(null);
            }
            this.boardUnits.push(theRow);
        }

        //init board villages
        for (let row = 0; row < 8; row++) {
            let theRow = [];
            for (let col = 0; col < 8; col++) {
                theRow.push(null);
            }
            this.boardVillages.push(theRow);
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

        switch(terrainType){
            case 0:
                return 1;
            case 2:
                return 2;
        }

        return 99999;

    }

}
