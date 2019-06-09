import Village from "./village_buildings/Village";
import BuildingFactory from "./BuildingFactory";

import GameUtils from "../utils/GameUtils";

export default class BuildingManager {

    constructor(scene) {
        this.scene = scene;
    }

    //TODO: move to UI manager?
    clickedDestroyBuilding() {
        let scene = this.scene;

        console.log("destroying building");

        scene.buildingManager.destroyBuilding(scene.selectedBuilding);

        scene.deselectEverything();
        scene.updateUI();
    }

    /**
     * adds building to the board
     * @param {*} row 
     * @param {*} col 
     * @param {*} buildingSprite 
     */
    addBuildingToBoard(row, col, buildingSprite) {
        let scene = this.scene;
        scene.board.boardBuildings[row][col] = buildingSprite;
    }

    /**
     * destroy sprite, remove from board and player
     * @param {*} buildingSprite 
     */
    destroyBuilding(buildingSprite) {
        let scene = this.scene;

        let building = buildingSprite.getData("data");
        let row = building.row;
        let col = building.col;
        let playerNumber = building.player;

        let playerBuildings = scene.playerBuildings[playerNumber];
        for (let i = 0; i < playerBuildings.length; i++) {
            if (playerBuildings[i] == buildingSprite) {
                playerBuildings.splice(i, 1);
                break;
            }
        }

        scene.board.boardBuildings[row][col] = null;
        scene.board.destroyText(row, col);

        buildingSprite.destroy();
    }

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
        let scene = this.scene;
        let board = scene.board;

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

    clickedBuyBuilding(pointer, gameSprite, buildingType) {
        let scene = gameSprite.scene;

        if (pointer.rightButtonDown())
            return;


        let village = scene.selectedVillage.data.get("data");

        //TODO: ensure enough resources from this specific building
        if (village.amountWood < 100) {
            console.log("not enough wood. need 100");
            return;
        }

        //deselect
        if (gameSprite.isTinted) {
            gameSprite.clearTint();
            scene.board.unhighlightTiles(scene.possibleMoves);
            scene.possibleMoves = null;
            scene.selectedBuyBuilding = null;
            return;
        }

        console.log("before: build a " + buildingType);

        scene.selectedBuyBuilding = buildingType;
        GameUtils.clearTintArray(scene.uiVillage);
        gameSprite.setTint("0x00ff00");

        scene.possibleMoves = scene.buildingManager.getVillageBuildings(village);
        scene.possibleMoves = scene.buildingManager.getBuildableNeighbors(scene.possibleMoves);

        scene.board.highlightTiles(scene.possibleMoves);
    }

    /**
     * places building on the board
     * @param {*} selectedVillage sprite
     * @param {*} terrainSprite sprite
     * @param {*} buildingType text of building ("Farm", "Quarry")
     */
    placeBuilding(selectedVillage, terrainSprite, buildingType) {
        let scene = this.scene;
        let board = scene.board;
        let row = terrainSprite.getData("row");
        let col = terrainSprite.getData("col");
        let x = terrainSprite.x;
        let y = terrainSprite.y;

        //already occupied
        if (board.boardBuildings[row][col] != null)
            return;

        let village = selectedVillage.getData("data");

        //TODO: change this later to reflect 'final' building costs
        if (village.amountWood < 100)
            return;

        village.amountWood -= 100;

        let building = BuildingFactory
            .getVillageBuilding(buildingType, row, col, x, y, village);

        let tempSprite = scene.add.sprite(x, y, "build" + buildingType)
            .setInteractive()
            .setDataEnabled()
            .setDepth(1)
            .on("pointerdown", scene.clickedBuilding);

        tempSprite.data.set("row", row);
        tempSprite.data.set("col", col);
        tempSprite.data.set("data", building);

        board.boardBuildings[row][col] = tempSprite;
        scene.playerBuildings[village.player].push(tempSprite);
    }

    placeBuildingPlayer(pointer, terrainSprite) {
        let scene = this.scene;
        let board = scene.board;

        let row = terrainSprite.data.get("row");
        let col = terrainSprite.data.get("col");

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

        scene.buildingManager.placeBuilding(scene.selectedVillage, terrainSprite, scene.selectedBuyBuilding);

        //re-calculate income
        scene.updateUI();

        //we're done here
        board.unhighlightTiles(scene.possibleMoves);
        scene.possibleMoves = null;
        scene.selectedBuyBuilding = null;
    }

    /**
     * gets only buildable neighbors of tiles.
     * @param {*} tiles 
     */
    getBuildableNeighbors(tiles) {
        let board = this.scene.board;

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