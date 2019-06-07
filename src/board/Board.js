
export default class Board {

    constructor() {

        //TODO: redo this?
        //TODO: probably call terrain sprites just terrain. refactor
        this.boardTerrain = [];
        this.boardWalkable = [];
        this.boardSailable = [];

        //these hold gameobjects (which hold data)
        this.boardTerrainSprites = []; //holds terrain sprites
        this.boardBuildings = [];       //holds building sprites
        this.boardText = [];            //holds text
        this.boardUnits = [];           //holds occupying units

        //TODO: make an enums for terrain
        this.terrainType = ['tileGrass', 'tileOcean', 'tileHill', 'tileDesert', 'tileForest'];

        //TODO: pull this out completely.
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    }

    initBoard(someInputHereLater) {

        //TODO: make this more dynamic-y later
        //TODO: replace this hardcoded board. research tilemaps
        this.boardTerrain = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 2, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 2, 4, 4, 4, 4, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 4, 4, 0, 4, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 2, 4, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 1, 3, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 3, 3, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],
            [1, 3, 3, 3, 3, 2, 2, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1],
            [1, 3, 3, 3, 3, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
            [1, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

        this.rows = this.boardTerrain.length;
        this.cols = this.boardTerrain[0].length;

        //init board of isWalkable
        let answer;
        for (let row = 0; row < this.rows; row++) {
            let theRow = [];
            for (let col = 0; col < this.cols; col++) {
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
        for (let row = 0; row < this.rows; row++) {
            let theRow = [];
            for (let col = 0; col < this.cols; col++) {
                theRow.push(null);
            }
            this.boardTerrainSprites.push(theRow);
        }

        //init board units
        for (let row = 0; row < this.rows; row++) {
            let theRow = [];
            for (let col = 0; col < this.cols; col++) {
                theRow.push(null);
            }
            this.boardUnits.push(theRow);
        }

        //init board buildings
        for (let row = 0; row < this.rows; row++) {
            let theRow = [];
            for (let col = 0; col < this.cols; col++) {
                theRow.push(null);
            }
            this.boardBuildings.push(theRow);
        }

        //init board text
        for (let row = 0; row < this.rows; row++) {
            let theRow = [];
            for (let col = 0; col < this.cols; col++) {
                theRow.push(null);
            }
            this.boardText.push(theRow);
        }

    }

    addText(row, col, text) {
        this.boardText[row][col] = text;
    }

    destroyText(row, col) {
        if (this.boardText[row][col] == null)
            return;

        this.boardText[row][col].destroy();
        this.boardText[row][col] = null;
    }

    /**
     * is this within the board?
     * @param {*} row 
     * @param {*} col 
     */
    isWithinBounds(row, col) {

        if (row < 0 || row >= this.boardTerrain.length)
            return false;

        if (col < 0 || col >= this.boardTerrain[0].length)
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

    /**
     * can we place one building in row, col
     * @param {*} row 
     * @param {*} col 
     */
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

    /**
     * returns the movement cost of a board's square
     * call isWalkable before you use this.
     * @param {*} row 
     * @param {*} col 
     */
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
     * get buildings's data from coordinates
     * @param {*} coordinates array of {row, col}
     */
    getBuildingsData(coordinates) {

        let buildingsData = [];

        coordinates.forEach(coordinate => {
            let row = coordinate.row;
            let col = coordinate.col;

            buildingsData.push(this.boardBuildings[row][col].data.get('data'));
        });

        return buildingsData;

    }

    /**
     * @param {*} row 
     * @param {*} col 
     * @returns a unitSprite or null if none
     */
    getUnit(row, col) {
        if (!this.isWithinBounds(row, col))
            return null;

        return this.boardUnits[row][col];
    }

    getBuilding(row, col) {
        if (!this.isWithinBounds(row, col))
            return null;

        return this.boardBuildings[row][col];
    }

    /**
     * returns buildingData. null if nothing
     * @param {*} row 
     * @param {*} col 
     */
    getBuildingData(row, col) {
        if (!this.isWithinBounds(row, col))
            return null;

        let sprite = this.boardBuildings[row][col];

        return sprite == null ? null : sprite.getData("data");
    }

    /**
     * returns player number of who is occupying it with a unit
     * 
     * a building by itself is not occupying
     * @param {*} row 
     * @param {*} col 
     */
    getTileOwnership(row, col) {

        let unitSprite = this.boardUnits[row][col];

        if (unitSprite == null)
            return 0;

        return unitSprite.data.get("data").player;
    }

    /**
     * gets the neighbors of one tile
     * @param {*} row 
     * @param {*} col 
     * @return an array of {row, col}
     */
    getNeighboringTiles(row, col) {
        let tiles = [];

        for (let d = 0; d < this.directions.length; d++) {
            let i = this.directions[d][0];
            let j = this.directions[d][1];

            if (this.isWithinBounds(row + i, col + j))
                tiles.push({
                    row: row + i,
                    col: col + j
                });
        }

        return tiles;
    }

    /**
     * like getNeighboringTiles but it returns all neighbors within a certain inclusive distance
     * @param {*} tiles - array of {row, col}
     * @param {*} distance - how far the neighbors should be
     * @return an array of {row, col} of neighbors within an inclusive distance
     */
    getFarNeighboringTiles(tiles, distance) {
        let totalNeighbors = [];

        if (distance <= 0)
            return totalNeighbors;

        //the previous layer of neighbors
        let prevNeighbors = tiles;

        //init visited
        let visited = new Set();
        tiles.forEach(tile => {
            let key = tile.row + "," + tile.col;
            visited.add(key);
        });

        for (let i = 0; i < distance; i++) {
            let nextNeighbors = [];

            //get first layer of neighbors
            prevNeighbors.forEach(tile => {
                let neighbors = this.getNeighboringTiles(tile.row, tile.col);
                neighbors.forEach(neighbor => {
                    let row = neighbor.row;
                    let col = neighbor.col;
                    let key = row + "," + col;

                    if (visited.has(key))
                        return; //continue;

                    if (!this.isWithinBounds(row, col))
                        return; //continue

                    visited.add(key);
                    nextNeighbors.push({ row: row, col: col });
                });
            });

            //process X-neighbors
            nextNeighbors.forEach(neighbor => totalNeighbors.push(neighbor));
            prevNeighbors = nextNeighbors;
        }

        return totalNeighbors;
    }

    unhighlightTiles(tiles) {
        if (tiles == null)
            return;

        tiles.forEach(tile => {
            this.boardTerrainSprites[tile.row][tile.col].clearTint();
        });
    }

    /**
     * @param {*} tiles an array of row/col
     */
    highlightTiles(tiles) {
        if (tiles == null)
            return;

        tiles.forEach(tile => {
            let row = tile.row;
            let col = tile.col;

            //village
            if (this.boardBuildings[row][col] != null) {
                let village = this.boardBuildings[row][col];

                //TODO: probably redo for friendlies
                if (village.data.get('data').player == 1)
                    this.boardTerrainSprites[row][col].setTint('0x00aaff');
                //enemy village
                else
                    this.boardTerrainSprites[row][col].setTint('0xaa0000');
            }
            //plain terrain
            else {
                this.boardTerrainSprites[row][col].setTint('0x00aaff');
            }

            //enemy units
            if (this.boardUnits[row][col] != null) {
                let unit = this.boardUnits[row][col].data.get("data");

                if (unit.player != 1) {
                    this.boardTerrainSprites[row][col].setTint('0xaa0000');
                }
            }

        });
    }

    /**
     * @param {*} row 
     * @param {*} col 
     * @returns terrainSprite or null
     */
    getTerrain(row, col) {
        if (!this.isWithinBounds(row, col))
            return null;

        return this.boardTerrainSprites[row][col];
    }

    //TODO: rename this to "getArea". name is misleading
    /**
     * get the surrounding area (water and impassable land included)
     * breadth-first search (BFS) of distance
     * @param {*} row 
     * @param {*} col 
     * @param {*} distance 
     */
    getTerritory(row, col, distance) {
        let answer = this.getTerritoryHelper(row, col, distance);

        return answer;
    }

    getTerritoryHelper(row, col, movesLeft) {

        let answer = [];
        let visited = new Set();

        let currentSquare = {
            row: row,
            col: col
        }

        let queue = [];
        queue.push(currentSquare);

        while (queue.length > 0 && movesLeft >= 0) {

            let levelSize = queue.length;

            //process a level
            for (let levelAmount = 0; levelAmount < levelSize; levelAmount++) {

                currentSquare = queue.shift();

                let coordinate = currentSquare.row + ',' + currentSquare.col;

                if (visited.has(coordinate))
                    continue;

                visited.add(coordinate);

                if (this.isWithinBounds(row, col) == false)
                    continue;

                answer.push(currentSquare);

                //check up, down, left, right
                for (let d = 0; d < this.directions.length; d++) {
                    let i = this.directions[d][0];
                    let j = this.directions[d][1];

                    let nextSquare = {
                        row: currentSquare.row + i,
                        col: currentSquare.col + j
                    }

                    queue.push(nextSquare);
                }

            }

            movesLeft--;

        }

        return answer;
    }

}
