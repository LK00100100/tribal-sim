
import Village from "./buildings/Village.js";

export default class Board {

    constructor() {

        //TODO: redo this?
        this.boardTerrain = [];
        this.boardWalkable = [];
        this.boardSailable = [];

        //these hold gameobjects (which hold data)
        this.boardTerrainSprites = []; //holds terrain sprites
        this.boardBuildings = []; //holds building sprites
        this.boardUnits = [];   //holds occupying units

        //TODO: make an enums for terrain
        this.terrainType = ["tileGrass", "tileOcean", "tileHill", "tileDesert", "tileForest"];

        //TODO: pull this out completely.
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    }

    initBoard(someInputHereLater) {

        //TODO: make this more dynamic-y later
        //TODO: replace this hardcoded board
        this.boardTerrain = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 4, 4, 4, 1],
            [1, 0, 0, 0, 4, 4, 4, 1],
            [1, 0, 0, 0, 0, 2, 2, 1],
            [1, 0, 0, 3, 1, 0, 0, 1],
            [1, 0, 3, 3, 0, 0, 0, 1],
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
            this.boardBuildings.push(theRow);
        }

    }

    addArmy(row, col, armySprite) {
        this.boardUnits[row][col] = armySprite;
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

        if (this.boardUnits[row][col] != null)
            return false;


        //TODO: probably remove this board in the future for more features
        return this.boardWalkable[row][col];
    }

    isBuildable(row, col) {

        if (this.isWithinBounds(row, col) == false)
            return false;

        //building already there
        if (this.boardBuildings[row][col] != null)
            return false;

        //difficult terrain
        switch (this.boardTerrain[row][col]) {
            //ocean
            case 1:
                return false;
            //hill
            case 2:
                return false;
            //forest
            case 4:
                return false;
        }

        return true;

    }

    //call isWalkable before you use this.
    movementCost(row, col) {

        let terrainType = this.boardTerrain[row][col];

        //TODO: replace with array?
        switch (terrainType) {
            //grass
            case 0:
                return 1;
            //hill
            case 2:
                return 2;
            //desert
            case 3:
                return 3;
            //forest
            case 4:
                return 1;
        }

        return 99999;

    }

    /**
     * gets an array of rows & cols of buildings connected to target village.
     * @param {*} targetVillage data of
     */
    getRelatedBuildings(targetVillage) {

        let row = targetVillage.row;
        let col = targetVillage.col;

        return this.getRelatedBuildingsHelper(targetVillage, row, col, new Set());
    }

    /**
     * returns an array of row/col with Buildings connected to the target village
     * @param {*} targetVillage data of
     * @param {*} row 
     * @param {*} col 
     * @param {*} visited - a set of visited coordinates 
     */
    getRelatedBuildingsHelper(targetVillage, row, col, visited) {

        let answer = [];

        if (this.isWithinBounds(row, col) == false)
            return answer;

        let key = row + "," + col;

        if (visited.has(key))
            return answer;

        visited.add(key);

        let building = this.boardBuildings[row][col];

        //no building here
        if (building == null)
            return answer;

        building = building.data.get("data");

        //if this village is not ours
        if (building instanceof Village) {
            if (building != targetVillage)
                return answer;
        }
        //if building does not have a target village
        else if (building.village == null)
            return answer;

        //connection found, so spread
        if (building.village == targetVillage || building instanceof Village) {
            answer.push({ row: row, col: col });

            for (let d = 0; d < this.directions.length; d++) {
                let i = this.directions[d][0];
                let j = this.directions[d][1];
                answer = answer.concat(this.getRelatedBuildingsHelper(targetVillage, row + i, col + j, visited));
            }
        }

        return answer;

    }

    /**
     * gets only neighbors of tiles.
     * @param {*} tiles 
     */
    getNeighbors(tiles) {

        let answer = [];

        let visited = new Set();

        tiles.forEach(tile => {
            let row = tile.row;
            let col = tile.col;

            visited.add(row + "," + col);

            for (let d = 0; d < this.directions.length; d++) {
                let i = this.directions[d][0];
                let j = this.directions[d][1];

                let key = (row + i) + "," + (col + j);

                if (!this.isWithinBounds(row + i, col + j))
                    continue;

                if (visited.has(key))
                    continue;

                answer.push({ row: row + i, col: col + j });
            }
        });

        return answer;
    }

    getBuildingsData(coordinates) {

        let buildingsData = [];

        coordinates.forEach(coordinate => {
            let row = coordinate.row;
            let col = coordinate.col;

            buildingsData.push(this.boardBuildings[row][col].data.get("data"));
        });

        return buildingsData;

    }

}
