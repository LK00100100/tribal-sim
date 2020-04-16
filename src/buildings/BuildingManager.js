import Village from "./villageBuildings/Village";
import BuildingFactory from "./BuildingFactory";

import GameUtilsBoard from "../utils/GameUtilsBoard";
// eslint-disable-next-line no-unused-vars
import SceneGame from "../SceneGame";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine";

export default class BuildingManager {

    /**
     * 
     * @param {SceneGame} gameScene 
     * @param {GameEngine} gameEngine 
     */
    constructor(gameScene ,gameEngine) {
        this.gameScene = gameScene;
        this.gameEngine = gameEngine;
    }

    /**
     * Adds building sprite to the board
     * @param {Number} row 
     * @param {Number} col 
     * @param {*} buildingSprite 
     */
    addBuildingToBoard(row, col, buildingSprite) {
        let gameEngine = this.gameEngine;
        gameEngine.board.boardBuildings[row][col] = buildingSprite;
    }

    /**
     * Destroy sprite, remove from board and player
     * @param {*} buildingSprite 
     */
    destroyBuilding(buildingSprite) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let building = buildingSprite.getData("data");
        let row = building.row;
        let col = building.col;
        let playerNumber = building.player;

        let playerBuildings = gameEngine.playerBuildings[playerNumber];
        for (let i = 0; i < playerBuildings.length; i++) {
            if (playerBuildings[i] == buildingSprite) {
                playerBuildings.splice(i, 1);
                break;
            }
        }

        gameEngine.board.boardBuildings[row][col] = null;
        gameEngine.board.destroyText(row, col);

        buildingSprite.destroy();
    }

    /**
    * Gets an array of buildings connected to target village.
    * including target village
    * @param {Village} targetVillage data
    * @returns array of {row, col}
    */
    getVillageBuildings(targetVillage) {
        let row = targetVillage.row;
        let col = targetVillage.col;

        return this.getVillageBuildingsHelper(targetVillage, row, col, new Set());
    }

    /**
     * used by getVillageBuildings()
     * @param {Village} targetVillage data of
     * @param {Number} row 
     * @param {Number} col 
     * @param {Set<{row, col}>} visited - a set of visited coordinates 
     */
    getVillageBuildingsHelper(targetVillage, row, col, visited) {
        let gameEngine = this.gameEngine;
        let board = gameEngine.board;

        let answer = [];

        if (board.isWithinBounds(row, col) == false)
            return answer;

        let key = row + "," + col;

        if (visited.has(key))
            return answer;

        visited.add(key);

        let building = board.boardBuildings[row][col];

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
        if (building.village == targetVillage) {
            answer.push({ row: row, col: col });

            for (let d = 0; d < board.directions.length; d++) {
                let i = board.directions[d][0];
                let j = board.directions[d][1];
                answer = answer.concat(this.getVillageBuildingsHelper(targetVillage, row + i, col + j, visited));
            }
        }

        return answer;
    }

    /**
     * places building on the board
     * @param {*} selectedVillage sprite
     * @param {*} terrainSprite sprite
     * @param {*} buildingType text of building ("Farm", "Quarry")
     */
    placeBuilding(selectedVillage, terrainSprite, buildingType) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;
        let board = gameEngine.board;
        let row = terrainSprite.getData("row");
        let col = terrainSprite.getData("col");
        let x = GameUtilsBoard.convertColToPixel(col);
        let y = GameUtilsBoard.convertRowToPixel(row);

        //already occupied
        if (board.boardBuildings[row][col] != null)
            return;

        let village = selectedVillage.getData("data");

        //TODO: change this later to reflect 'final' building costs
        //TODO: put building costs into the building class
        if (village.amountWood < 100)
            return;

        village.amountWood -= 100;
        
        let building = BuildingFactory.getVillageBuilding(buildingType, row, col, village);
        //TODO: move this?
        let tempSprite = gameScene.add.sprite(x, y, "build" + buildingType)
            .setInteractive()
            .setDataEnabled()
            .setDepth(1)
            .on("pointerdown", gameScene.clickedBuilding);

        tempSprite.data.set("row", row);
        tempSprite.data.set("col", col);
        tempSprite.data.set("data", building);

        board.boardBuildings[row][col] = tempSprite;
        gameEngine.playerBuildings[village.player].push(tempSprite);
    }

    placeBuildingPlayer(pointer, terrainSprite) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;
        let board = gameEngine.board;

        let row = terrainSprite.data.get("row");
        let col = terrainSprite.data.get("col");

        if (gameEngine.selectedBuyBuilding == null)
            return;

        if (gameEngine.possibleMoves == null)
            return;

        if (gameEngine.selectedVillage == null)
            return;

        //not in possible moves
        let isIn = false;
        for (let i = 0; i < gameEngine.possibleMoves.length; i++) {
            if (gameEngine.possibleMoves[i].row == row && gameEngine.possibleMoves[i].col == col)
                isIn = true;
        }

        if (!isIn)
            return false;

        gameEngine.buildingManager.placeBuilding(gameEngine.selectedVillage, terrainSprite, gameEngine.selectedBuyBuilding);

        //re-calculate income
        gameScene.updateUi();

        //we're done here
        board.unhighlightTiles(gameEngine.possibleMoves);
        gameEngine.possibleMoves = null;
        gameEngine.selectedBuyBuilding = null;
        gameScene.humanVillageInfoScene.updateUi();
    }

    /**
     * Gets only buildable neighbors of tiles.
     * @param {Array<{row, col}>} tiles 
     */
    getBuildableNeighbors(tiles) {
        let board = this.gameEngine.board;

        let answer = [];

        let visited = new Set();

        tiles.forEach(tile => {
            let row = tile.row;
            let col = tile.col;

            visited.add(row + "," + col);

            for (let d = 0; d < board.directions.length; d++) {
                let i = board.directions[d][0];
                let j = board.directions[d][1];

                let key = (row + i) + "," + (col + j);

                if (!board.isWithinBounds(row + i, col + j))
                    continue;

                if (!board.isBuildable(row + i, col + j)) {
                    continue;
                }

                if (visited.has(key))
                    continue;

                answer.push({ row: row + i, col: col + j });
            }
        });

        return answer;
    }

}