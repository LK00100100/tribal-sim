
import Village from "../buildings/village_buildings/Village.js";
import Farm from "../buildings/village_buildings/Farm.js";
import LumberMill from "../buildings/village_buildings/LumberMill.js";
import Quarry from "../buildings/village_buildings/Quarry.js";
import Housing from "../buildings/village_buildings/Housing.js";

import GameUtils from '../utils/GameUtils.js';

import BuildingFactory from '../buildings/BuildingFactory.js';

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

                if (village.data.get("data").player == 1)
                    this.boardTerrainSprites[row][col].setTint("0x00aaff");
                else
                    this.boardTerrainSprites[row][col].setTint("0xaa0000");
            }
            //plain terrain
            else {
                this.boardTerrainSprites[row][col].setTint("0x00aaff");
            }

        });
    }

    placeBuilding(pointer, terrainSprite) {

        let scene = terrainSprite.scene;

        let row = terrainSprite.data.get("row");
        let col = terrainSprite.data.get("col");

        let x = terrainSprite.x;
        let y = terrainSprite.y;

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

        let village = scene.selectedVillage.data.get("data");

        let building = BuildingFactory
            .getVillageBuilding(scene.selectedBuyBuilding, row, col, x, y, village);

        let tempSprite = scene.add.sprite(x, y, "build" + scene.selectedBuyBuilding)
            .setInteractive()
            .setDataEnabled()
            .setDepth(1)
            .on("pointerdown", scene.clickedBuilding);

        tempSprite.data.set("row", row);
        tempSprite.data.set("col", col);
        tempSprite.data.set("data", building);

        this.boardBuildings[row][col] = tempSprite;
        scene.playersBuilding[village.player].push(tempSprite);

        //TODO: change this later to reflect "final" building costs
        village.amountWood -= 100;

        //re-calculate income
        scene.updateUI();

        //we're done here
        GameUtils.clearTintArray(scene.uiVillage);
        this.unhighlightTiles(scene.possibleMoves);
        scene.possibleMoves = null;
        scene.selectedBuyBuilding = null;
    }

    buyBuilding(pointer, gameSprite, buildingType) {

        let scene = gameSprite.scene;

        if (pointer.rightButtonDown())
            return;

        if (gameSprite.isTinted) {
            gameSprite.clearTint();
            scene.board.unhighlightTiles(scene.possibleMoves);
            scene.possibleMoves = null;
            scene.selectedBuyBuilding = null;
            return;
        }

        console.log("before: build a " + buildingType);

        let village = scene.selectedVillage.data.get("data");

        //TODO: ensure enough resources from this specific village
        if (village.amountWood < 100) {
            console.log("not enough wood. need 100");
            return;
        }

        scene.selectedBuyBuilding = buildingType;
        GameUtils.clearTintArray(scene.uiVillage);
        gameSprite.setTint("0x00ff00");

        scene.possibleMoves = scene.board.getRelatedBuildings(village);
        scene.possibleMoves = scene.board.getNeighbors(scene.possibleMoves);

        //filter out impossible moves
        for (let i = scene.possibleMoves.length - 1; i >= 0; i--) {
            let row = scene.possibleMoves[i].row;
            let col = scene.possibleMoves[i].col;

            if (!scene.board.isBuildable(row, col)) {
                scene.possibleMoves.splice(i, 1);
            }

        }

        scene.board.highlightTiles(scene.possibleMoves);

    }

    countBuildings(connectedBuildings) {

        let countsOfBuildings = {
            countFarm: 0,
            countLumberMill: 0,
            countQuarry: 0,
            countHousing: 0,
        }

        connectedBuildings.forEach(building => {

            if (building instanceof Village) {
                //do nothing    
            }
            else if (building instanceof Farm) {
                countsOfBuildings.countFarm++;

            }
            else if (building instanceof LumberMill) {
                countsOfBuildings.countLumberMill++;

            }
            else if (building instanceof Quarry) {
                countsOfBuildings.countQuarry++;

            }
            else if (building instanceof Housing) {

                countsOfBuildings.countHousing++;
            }
            else
                console.log("cannot count this building");
        });

        return countsOfBuildings;

    }

}
