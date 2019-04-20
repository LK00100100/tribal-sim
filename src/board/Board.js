
import Village from '../buildings/village_buildings/Village.js';

import GameUtils from '../utils/GameUtils.js';

import BuildingFactory from '../buildings/BuildingFactory.js';

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
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 2, 4, 4, 4, 1, 1, 1],
            [1, 0, 0, 0, 2, 4, 4, 4, 4, 1, 1],
            [1, 0, 0, 0, 0, 4, 4, 0, 4, 1, 1],
            [1, 0, 0, 0, 1, 2, 4, 1, 1, 1, 1],
            [1, 1, 3, 1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 3, 3, 1, 1, 0, 0, 1, 1, 1],
            [1, 3, 3, 3, 3, 2, 2, 0, 1, 1, 1],
            [1, 3, 3, 3, 3, 2, 0, 0, 0, 1, 1],
            [1, 3, 3, 3, 3, 3, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 3, 3, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

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

    addArmy(row, col, armySprite) {
        this.boardUnits[row][col] = armySprite;
    }

    addBuilding(row, col, buildingSprite) {
        this.boardBuildings[row][col] = buildingSprite;
    }

    addText(row, col, text) {
        this.boardText[row][col] = text;
    }

    removeArmy(row, col) {
        this.boardUnits[row][col] = null;
    }

    removeBuilding(row, col) {
        this.boardBuildings[row][col] = null;
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

    //TODO: pull this out to buildingsManager
    /**
     * gets an array of buildings connected to target village.
     * including target village
     * @param {*} targetVillage data
     * @returns array of {row, col}
     */
    getVillageBuildings(targetVillage) {
        let row = targetVillage.row;
        let col = targetVillage.col;

        return this.getVillageBuildingsHelper(targetVillage, row, col, new Set());
    }

    /**
     * used by getVillageBuildings()
     * @param {*} targetVillage data of
     * @param {*} row 
     * @param {*} col 
     * @param {*} visited - a set of visited coordinates 
     */
    getVillageBuildingsHelper(targetVillage, row, col, visited) {

        let answer = [];

        if (this.isWithinBounds(row, col) == false)
            return answer;

        let key = row + ',' + col;

        if (visited.has(key))
            return answer;

        visited.add(key);

        let building = this.boardBuildings[row][col];

        //no building here
        if (building == null)
            return answer;

        building = building.data.get('data');

        //if this village is not ours
        if (building instanceof Village) {
            if (building != targetVillage)
                return answer;
        }
        //if building does not have a target village
        else if (building.village == null)
            return answer;

        //connection found, so spread
        if (building.village == targetVillage) {
            answer.push({ row: row, col: col });

            for (let d = 0; d < this.directions.length; d++) {
                let i = this.directions[d][0];
                let j = this.directions[d][1];
                answer = answer.concat(this.getVillageBuildingsHelper(targetVillage, row + i, col + j, visited));
            }
        }

        return answer;
    }

    /**
     * gets only neighbors of tiles.
     * @param {*} tiles 
     */
    getBuildableNeighbors(tiles) {

        let answer = [];

        let visited = new Set();

        tiles.forEach(tile => {
            let row = tile.row;
            let col = tile.col;

            visited.add(row + ',' + col);

            for (let d = 0; d < this.directions.length; d++) {
                let i = this.directions[d][0];
                let j = this.directions[d][1];

                let key = (row + i) + ',' + (col + j);

                if (!this.isWithinBounds(row + i, col + j))
                    continue;

                if (!this.isBuildable(row + i, col + j)) {
                    continue
                }

                if (visited.has(key))
                    continue;

                answer.push({ row: row + i, col: col + j });
            }
        });

        return answer;
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
     * returns a unitSprite or null if none
     */
    getUnits(row, col) {
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

    //TODO: put in building mangaer
    placeBuildingPlayer(pointer, terrainSprite) {

        let scene = terrainSprite.scene;

        let row = terrainSprite.data.get('row');
        let col = terrainSprite.data.get('col');

        if (scene.selectedBuyBuilding == null)
            return;

        if (scene.possibleMoves == null)
            return;

        if (scene.selectedVillage == null)
            return;

        //not in possible moves
        let isIn = false;
        for (let i = 0; i < scene.possibleMoves.length; i++) {
            if (scene.possibleMoves[i].row == row && scene.possibleMoves[i].col == col)
                isIn = true;
        }

        if (!isIn)
            return false;

        this.placeBuilding(scene.selectedVillage, terrainSprite, scene.selectedBuyBuilding);

        //re-calculate income
        scene.updateUI();

        //we're done here
        GameUtils.clearTintArray(scene.uiVillage);
        this.unhighlightTiles(scene.possibleMoves);
        scene.possibleMoves = null;
        scene.selectedBuyBuilding = null;
    }

    //TODO: put in building mangaer
    /**
     * places building on the board
     * @param {*} selectedVillage sprite
     * @param {*} terrainSprite sprite
     * @param {*} buildingType text of building ("Farm", "Quarry")
     */
    placeBuilding(selectedVillage, terrainSprite, buildingType) {
        let scene = selectedVillage.scene;  //TODO: do this.scene after placed in buildingmanager.
        let row = terrainSprite.getData('row');
        let col = terrainSprite.getData('col');
        let x = terrainSprite.x;
        let y = terrainSprite.y;

        let village = selectedVillage.getData('data');

        //TODO: change this later to reflect 'final' building costs
        if (village.amountWood < 100)
            return;

        village.amountWood -= 100;

        let building = BuildingFactory
            .getVillageBuilding(buildingType, row, col, x, y, village);

        let tempSprite = scene.add.sprite(x, y, 'build' + buildingType)
            .setInteractive()
            .setDataEnabled()
            .setDepth(1)
            .on('pointerdown', scene.clickedBuilding);

        tempSprite.data.set('row', row);
        tempSprite.data.set('col', col);
        tempSprite.data.set('data', building);

        this.boardBuildings[row][col] = tempSprite;
        scene.playerBuildings[village.player].push(tempSprite);
    }

    //TODO: rename to selectBuy
    buyBuilding(pointer, gameSprite, buildingType) {

        let scene = gameSprite.scene;

        if (pointer.rightButtonDown())
            return;

        //deselect
        if (gameSprite.isTinted) {
            gameSprite.clearTint();
            scene.board.unhighlightTiles(scene.possibleMoves);
            scene.possibleMoves = null;
            scene.selectedBuyBuilding = null;
            return;
        }

        console.log('before: build a ' + buildingType);

        let village = scene.selectedVillage.data.get('data');

        //TODO: ensure enough resources from this specific building
        if (village.amountWood < 100) {
            console.log('not enough wood. need 100');
            return;
        }

        scene.selectedBuyBuilding = buildingType;
        GameUtils.clearTintArray(scene.uiVillage);
        gameSprite.setTint('0x00ff00');

        scene.possibleMoves = scene.board.getVillageBuildings(village);
        scene.possibleMoves = scene.board.getBuildableNeighbors(scene.possibleMoves);

        scene.board.highlightTiles(scene.possibleMoves);

    }

    /**
     * does the same thing as getPossibleMoves()
     * @param {*} armySprite 
     */
    getPossibleMovesArmy(armySprite) {
        let army = armySprite.data.get("data");

        return this.getPossibleMoves(army.row, army.col, army.moveAmount);
    }

    /**
     * gets squares that you can move to.
     * also returns squares with enemy units.
     * @param {*} row 
     * @param {*} col 
     * @param {*} moveAmount 
     * @returns an array of {row, col, cost}
     */
    getPossibleMoves(row, col, moveAmount) {
        //TODO: redo this whole thing to be correct. BFS from 1 to moveAmount

        let possibleMoves = [];

        let startPoint = {
            row: row,
            col: col,
            cost: 0
        }

        let coordinate = row + ',' + col;

        let visited = new Set();
        visited.add(coordinate);

        let queue = [];
        queue.push(startPoint);

        let currentAllowableCost = -1;

        while (queue.length > 0) {

            let queueLength = queue.length;

            currentAllowableCost++;

            //check around this level
            for (let x = 0; x < queueLength; x++) {
                let tempSquare = queue.shift();

                let row = tempSquare.row;
                let col = tempSquare.col;
                let cost = tempSquare.cost;

                //too costly for now.
                if (cost > currentAllowableCost) {
                    queue.push(tempSquare);
                    continue;
                }

                //check up, down, left, right
                for (let d = 0; d < this.directions.length; d++) {
                    let i = this.directions[d][0];
                    let j = this.directions[d][1];

                    coordinate = (row + i) + ',' + (col + j);

                    if (visited.has(coordinate))
                        continue;

                    visited.add(coordinate);

                    let terrainCost = this.movementCost(row + i, col + j);
                    tempSquare = {
                        row: row + i,
                        col: col + j,
                        cost: cost + terrainCost
                    };

                    if (this.isWalkable(row + i, col + j)) {
                        if (moveAmount >= cost + terrainCost) {
                            possibleMoves.push(tempSquare);
                            queue.push(tempSquare);
                        }
                    }
                    //you can't walk here since there is a unit
                    //but you may interact with it (shown as possible move)
                    else if (this.boardUnits[row + i][col + j] != null) {
                        let unit = this.boardUnits[row + i][col + j].data.get("data");

                        if (moveAmount >= cost + terrainCost) {
                            possibleMoves.push(tempSquare);
                        }

                    }

                }

            }

        }

        return possibleMoves;
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

    /**
     * get the surrounding area (water and impassable land included)
     * breadth-first search of distance
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
