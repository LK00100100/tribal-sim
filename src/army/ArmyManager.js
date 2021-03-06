import Army from "./Army.js";
import Caveman from "./unit/Caveman.js";

import UnitFactory from "./unit/UnitFactory";
import GameUtils from "../utils/GameUtils.js";
// eslint-disable-next-line no-unused-vars
import SceneGame from "../SceneGame.js";
import VillageBuilding from "../buildings/villageBuildings/VillageBuilding.js";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine.js";
// eslint-disable-next-line no-unused-vars
import Village from "../buildings/villageBuildings/Village.js";
// eslint-disable-next-line no-unused-vars
import Building from "../buildings/Building.js";

/**
 * Manages army data on the board.
 * 
 * Communicates with the gameScene to alter the scene.
 */
export default class ArmyManager {

    //TODO: rename scene to gamescene
    /**
     * 
     * @param {SceneGame} gameScene 
     * @param {GameEngine} gameEngine
     */
    constructor(gameScene, gameEngine) {
        this.gameScene = gameScene;
        this.gameEngine = gameEngine;
    }

    /**
     * moves army to the terrainSprite (if possible)
     * for the human-player
     * @param {*} armySprite army to move 
     * @param {*} terrainSprite target square
     */
    moveArmyPlayer(armySprite, terrainSprite) {
        let gameEngine = this.gameEngine;

        gameEngine.board.unhighlightTiles(gameEngine.selectedArmyPossibleMoves);

        this.moveArmy(armySprite, terrainSprite, gameEngine.selectedArmyPossibleMoves);

        gameEngine.selectedArmyPossibleMoves = this.getPossibleMovesArmy(armySprite);
        gameEngine.board.highlightTiles(gameEngine.selectedArmyPossibleMoves);
    }

    moveArmy(spriteArmy, terrainSprite, possibleMoves) {
        let scene = this.gameScene;
        let gameEngine = this.gameEngine;

        let army = spriteArmy.data.get("data");

        let targetRow = terrainSprite.data.get("row");
        let targetCol = terrainSprite.data.get("col");

        //no moves!
        if (possibleMoves.length == 0) {
            return;
        }

        //move visually and internally (row, col);
        let cost = this.getMovementCost(possibleMoves, targetRow, targetCol);

        //too expensive to move
        if (cost > army.moveAmount)
            return;

        //occupied by a unit already
        if (gameEngine.board.boardUnits[targetRow][targetCol] != null) {
            return;
        }

        this.removeArmyFromBoard(army.row, army.col);

        army.moveAmount -= cost;
        army.row = targetRow;
        army.col = targetCol;

        //place army
        //TODO: dont make it a direct move. move square to square
        scene.tweens.add({
            targets: spriteArmy,
            x: terrainSprite.x,
            y: terrainSprite.y,
            ease: "Linear",
            duration: 500
        });

        this.addArmyToBoard(targetRow, targetCol, spriteArmy);

        scene.updateUi();
    }

    /**
    * moves army next to the squareTerrain (if possible) with as few moves as possible
    * if there are ties, it picks top, bottom, left, then right.
    * @param {*} armySprite army to move 
    * @param {*} terrainSprite target square
    */
    moveArmyCloser(armySprite, terrainSprite) {
        let gameEngine = this.gameEngine;

        let row = terrainSprite.getData("row");
        let col = terrainSprite.getData("col");

        let neighbors = gameEngine.board.getNeighboringTiles(row, col);

        //remove unwalkable neighbors
        for (let i = neighbors.length - 1; i >= 0; i--) {
            let neighborRow = neighbors[i].row;
            let neighborCol = neighbors[i].col;

            if (!gameEngine.board.isWalkable(neighborRow, neighborCol)) {
                neighbors.splice(i, 1);
            }
        }

        let movesCost = gameEngine.armyManager.getPossibleMovesArmy(armySprite);
        let neighborMovesCost = GameUtils.getIntersectionCoordinates(movesCost, neighbors);

        //no where to move
        if (neighborMovesCost.length == 0)
            return;

        //get cheapest cost
        let targetRow = neighborMovesCost[0].row;
        let targetCol = neighborMovesCost[0].col;
        let lowestCost = neighborMovesCost[0].cost;
        for (let i = 1; i < neighborMovesCost.length; i++) {
            if (neighborMovesCost[i].cost < lowestCost) {
                targetRow = neighborMovesCost[i].row;
                targetCol = neighborMovesCost[i].col;
                lowestCost = neighborMovesCost[i].cost;
            }
        }

        let targetSprite = gameEngine.board.getTerrain(targetRow, targetCol);
        this.moveArmy(armySprite, targetSprite, movesCost);
    }

    /**
     * gets the cost of moving to row/col according to what is in possibleMoves
     * @param {Array<{row, col}>} possibleMoves
     * @param {Number} row 
     * @param {Number} col 
     */
    getMovementCost(possibleMoves, row, col) {
        let target = null;

        for (let i = 0; i < possibleMoves.length; i++) {
            let move = possibleMoves[i];

            if (move.row == row && move.col == col) {
                target = move;
                break;
            }
        }

        if (target == null) {
            console.log("not a possible move");
            return 999999;
        }

        return target.cost;
    }

    /**
     * creates an army from a village.
     * requires resources and people
     * @param {Number} player player number
     * @param {Village} village 
     */
    createArmyFromVillage(player, village) {
        let gameScene = this.gameScene;
        let gameEngine = this.gameEngine;

        let race = gameEngine.playerRace[player];
        let row = village.row;
        let col = village.col;

        //space already occupied
        if (gameEngine.board.boardUnits[row][col] != null) {
            console.log("already occupied");
            return;
        }

        //TODO: actual resource calculation
        if (village.amountFood < 10) {
            console.log("not enough food. need 10");
            return;
        }

        //TODO: make more precise
        if (village.population < 10) {
            console.log("not enough people. need 10");
            return;
        }

        //subtract cost
        village.amountFood -= 10;
        village.population -= 10;

        let armySprite = UnitFactory.drawUnitSprite(gameScene, row, col, race);

        let army = new Army(player, row, col);
        army.setVillage(village);

        //TODO: generate random name

        //TODO: change this later
        let maxMove = 0;
        for (let i = 0; i < 10; i++) {
            let unit = UnitFactory.getUnit(race);
            army.addUnit(unit);

            if (unit.moveMax > maxMove)
                maxMove = unit.moveMax;
        }
        //set army properties
        army.moveAmount = 0;    //you should not be able to move on the first turn
        army.amountFood += 10;
        army.moveMax = maxMove;

        armySprite.data.set("data", army);
        gameEngine.playerArmies[player].push(armySprite);
        this.addArmyToBoard(row, col, armySprite);

        return armySprite;
    }

    //TODO: createArmy() and then placeArmy(row, col)
    /**
     * Creates an army and places it on the board.
     * Useful if there's no village
     * @param {Number} player player number
     * @param {Number} row 
     * @param {Number} col 
     * @param {String} name
     */
    createArmyFromCoordinate(player, row, col, name) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let race = gameEngine.playerRace[player];

        //space already occupied
        if (gameEngine.board.boardUnits[row][col] != null) {
            console.log("already occupied");
            return;
        }

        let armySprite = UnitFactory.drawUnitSprite(gameScene, row, col, race);

        let army = new Army(player, row, col);
        army.name = name;

        //TODO: generate random name

        let maxMove = 0;
        for (let i = 0; i < 10; i++) {
            let unit = UnitFactory.getUnit(race);
            army.addUnit(unit);

            if (unit.moveMax > maxMove)
                maxMove = unit.moveMax;
        }

        //TODO: set army moveAmount dynamically
        army.moveAmount = 0;
        army.moveMax = maxMove;
        army.amountFood += 1; //0 food = starvation

        armySprite.data.set("data", army);
        gameEngine.playerArmies[player].push(armySprite);
        this.addArmyToBoard(row, col, armySprite);

        return armySprite;
    }

    /**
     * 
     * @param {*} row 
     * @param {*} col 
     * @param {*} armySprite 
     */
    addArmyToBoard(row, col, armySprite) {
        this.gameEngine.board.boardUnits[row][col] = armySprite;
    }

    //TODO: rename prefix to just player (for human players).

    //TODO: variable food amount
    /**
     * assumes that an army is on top of a village
     * @param {Army} army 
     */
    getFood(army) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let row = army.row;
        let col = army.col;
        let armyCost = army.getCostDay();

        let building = gameEngine.board.getBuildingData(row, col);

        if (building == null)
            return;

        //check if it's your building
        if (building.player != army.player)
            return;

        //not a village building
        if (!(building instanceof VillageBuilding))
            return;

        //transfer food
        if (building.village.amountFood < armyCost) {
            console.log("not enough food. need " + armyCost);
            return;
        }

        building.village.amountFood -= armyCost;
        army.amountFood += armyCost;
    }

    /**
     * Transfers wood from a village building to an army.
     * @param {Army} army The army to alter
     */
    getWood(army) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let row = army.row;
        let col = army.col;

        let building = gameEngine.board.getBuildingData(row, col);

        if (building == null)
            return;

        //check if it's your building
        if (building.player != army.player)
            return;

        //not a village building
        if (!(building instanceof VillageBuilding))
            return;

        //transfer food
        //TODO: dont hardcode
        let numWoodToMove = 100;
        if (building.village.amountWood < numWoodToMove) {
            console.log("not enough wood. need " + numWoodToMove);
            return;
        }

        building.village.amountWood -= numWoodToMove;
        army.amountWood += numWoodToMove;
    }

    /**
     * 
     * @param {Army} army 
     * @param {Direction} direction such as Direction.EAST
     */
    armyBuildWallWood(army, direction) {
        direction;

        //TODO: complete
        return army;
    }

    //TODO: separate select and attack. maybe move this
    /**
     * clicked an army. yours or otherwise
     * @param {Phaser.Pointer} pointer Phaser pointer
     */
    clickedArmy(pointer) {
        /** @type {SceneGame} */
        let gameScene = this.scene;
        let gameEngine = gameScene.gameEngine;

        /** @type {ArmyManager} */
        let armyManager = gameEngine.armyManager;

        let otherArmy = this.data.get("data");
        let targetRow = otherArmy.row;
        let targetCol = otherArmy.col;

        console.log("clicked army");

        //clicked your own human-player army
        if (otherArmy.player == 1) {
            gameEngine.armyManager.selectArmy(pointer, this);
            gameEngine.buildingManager.turnOnEnemyBuildingInfoSceneCheck();
        }
        //clicked another player's army
        else {
            if (pointer.leftButtonDown()) {
                gameScene.deselectEverything();

                gameEngine.selectedEnemyArmy = this;

                gameScene.turnOnSubSceneOnce(gameScene.enemyArmyInfoScene);

                //show basic information
                console.log("units health: " + otherArmy.getUnitsHealthStatus());
                console.log("units food: " + otherArmy.amountFood);
            }
            //show "attack screen"
            else if (pointer.rightButtonDown()) {

                if (gameEngine.selectedArmy == null)
                    return;

                //TODO: refactor this to be sprite
                gameEngine.selectedEnemyArmy = this;
                gameEngine.selectedEnemyArmyCoordinates = { row: targetRow, col: targetCol };
                let terrainSprite = gameEngine.board.boardTerrainSprites[targetRow][targetCol];
                armyManager.processHumanArmyAction(terrainSprite);
            }
        }
    }

    //TODO: put human in the human-related funcs
    /**
     * you are selecting your own army. for human-players
     * @param {*} pointer 
     * @param {*} armySprite 
     */
    selectArmy(pointer, armySprite) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        //double click panning
        if (pointer.leftButtonDown() && gameEngine.selectedArmy == armySprite) {
            gameScene.cam.pan(armySprite.x, armySprite.y, 500);
        }

        if (pointer.rightButtonDown())
            return;

        let army = armySprite.data.get("data");

        gameScene.deselectEverything();

        gameEngine.selectedArmy = armySprite;
        console.log("selecting army");
        console.log("army health: " + army.getUnitsHealthStatus());

        armySprite.setTint(0xffff00);

        this.showPossibleArmyMoves(army);

        gameScene.updateUi();
    }

    //TODO: make compatible with rats
    //TODO: make... not 10
    getUnits(army) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let row = army.row;
        let col = army.col;

        let buildingSprite = gameEngine.board.boardBuildings[row][col];
        let village;

        if (buildingSprite == null)
            return;

        let buildingData = buildingSprite.data.get("data");

        if (buildingData.player == army.player)
            village = buildingData.village;
        else
            return;

        if (village.population < 10)
            return;

        village.population -= 10;

        //TODO: change later.
        for (let i = 0; i < 10; i++) {
            let caveman = new Caveman();
            army.addUnit(caveman);
        }

    }

    //TODO: pass sprites
    /**
     * simulates an army attacking the other army. and vice versa
     * @param {Army} yourArmy data
     * @param {Army} enemyArmy data
     */
    simulateArmiesAttacking(yourArmy, enemyArmy) {
        this.simulateArmyAttackArmyOneWay(yourArmy, enemyArmy);
        this.simulateArmyAttackArmyOneWay(enemyArmy, yourArmy);

        console.log("army health: " + yourArmy.getUnitsHealthStatus());
        console.log("enemy army health: " + enemyArmy.getUnitsHealthStatus());
        console.log("purge dead");

        //TODO: probably remove
        this.purgeDeadUnits(yourArmy);
        this.purgeDeadUnits(enemyArmy);

        console.log("purged...");
        console.log("army health: " + yourArmy.getUnitsHealthStatus());
        console.log("enemy army health: " + enemyArmy.getUnitsHealthStatus());

        //TODO: probably remove
        //remove dead armies and deselect
        if (yourArmy.size() == 0)
            this.destroyArmy(yourArmy);

        if (enemyArmy.size() == 0)
            this.destroyArmy(enemyArmy);

    }

    simulateArmyAttackArmyOneWay(yourArmy, enemyArmy) {
        let yourUnits = yourArmy.units;
        let enemyUnits = enemyArmy.units;

        let currentTarget = 0;
        let defenseRolls = enemyArmy.rollDefenses();

        yourUnits.forEach(unit => {
            //your attack
            let attack = unit.rollAttack();

            //enemy defense
            let defense = (defenseRolls.length > 0) ? defenseRolls.shift() : 0;

            let damage = attack - defense;
            damage = damage > 0 ? damage : 0;

            let enemyUnit = enemyUnits[currentTarget];
            enemyUnit.health -= damage;

            currentTarget++;
            if (currentTarget >= enemyUnits.length)
                currentTarget = 0;
        });

    }

    /**
     * 
     * @param {*} armySprite
     * @param {*} buildingSprite
     */
    simulateArmyAttackingBuilding(armySprite, buildingSprite) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let army = armySprite.getData("data");
        let building = buildingSprite.getData("data");

        console.log("army health: " + army.getUnitsHealthStatus());
        console.log("enemy building HP: " + building.health);

        this.simulateArmyAttackingBuildingOneWay(army, building);
        this.simulateBuildingAttackingArmyOneWay(building, army);

        console.log("purge dead");
        this.purgeDeadUnits(army);
        console.log("purged...");

        console.log("army health: " + army.getUnitsHealthStatus());
        console.log("enemy building HP: " + building.health);

        //TODO: probably remove
        //remove dead armies and deselect
        if (army.size() == 0)
            this.destroyArmy(army);

        if (building.health <= 0){
            gameEngine.buildingManager.destroyBuilding(buildingSprite);
            
            //deselect building
            if(gameEngine.selectedEnemyBuilding == buildingSprite)
                gameEngine.selectedEnemyBuilding = null;
        }
    }

    /**
     * 
     * @param {*} yourArmy data
     * @param {*} building data
     */
    simulateArmyAttackingBuildingOneWay(yourArmy, building) {
        let yourUnits = yourArmy.units;

        yourUnits.forEach(unit => {
            //your attack
            let attack = unit.rollAttack();

            //enemy defense
            building.health -= attack;
        });
    }

    /**
     * a building (with population) fights back against an occupying army.
     * @param {Building} building data
     * @param {Army} enemyArmy data
     */
    simulateBuildingAttackingArmyOneWay(building, enemyArmy) {
        if (building.population == null)
            return;

        let enemyUnits = enemyArmy.units;

        let currentTarget = 0;
        let defenseRolls = enemyArmy.rollDefenses();

        for (let i = 0; i < building.population; i++) {

            //your attack
            let attack = building.rollAttack();

            //enemy defense
            let defense = (defenseRolls.length > 0) ? defenseRolls.shift() : 0;

            let damage = attack - defense;
            damage = damage > 0 ? damage : 0;

            let enemyUnit = enemyUnits[currentTarget];
            enemyUnit.health -= damage;

            currentTarget++;
            if (currentTarget >= enemyUnits.length)
                currentTarget = 0;

        }
    }

    purgeDeadUnits(armyData) {
        for (let i = armyData.units.length - 1; i >= 0; i--) {
            let unit = armyData.units[i];
            if (unit.health <= 0)
                armyData.units.splice(i, 1);
        }
    }

    //TODO: rename player-method
    /**
     * attack the thing you are standing on
     * @param {*} armySprite 
     * @param {*} buildingSprite
     */
    armyAttackBuilding(armySprite, buildingSprite) {

        //TODO: take out some moves

        this.simulateArmyAttackingBuilding(armySprite, buildingSprite);
    }

    //TODO: probably just sprites argument
    /**
     * Removes the army piece from the board and removes the army sprite.
     * @param {Army} armyData 
     */
    destroyArmy(armyData) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let row = armyData.row;
        let col = armyData.col;
        let playerNumber = armyData.player;

        let sprite = gameEngine.board.boardUnits[row][col];

        let playersArmies = gameEngine.playerArmies[playerNumber];
        for (let i = 0; i < playersArmies.length; i++) {
            if (playersArmies[i] == sprite) {
                playersArmies.splice(i, 1);
                break;
            }
        }

        this.removeArmyFromBoard(row, col);

        //TODO: probably just sprites
        if (gameEngine.selectedArmy != null && gameEngine.selectedArmy.getData("data") == armyData) {
            gameScene.deselectEverything();
        }

        sprite.destroy();
    }

    /**
     * This removes the army from the board.
     * This does not completely destroy the sprite and do any player's army book-keeping
     * @param {Number} row 
     * @param {Number} col 
     */
    removeArmyFromBoard(row, col) {
        let gameEngine = this.gameScene.gameEngine;

        gameEngine.board.boardUnits[row][col] = null;
    }

    /**
     * Gets squares that you can move to.
     * Also returns squares with enemy units.
     * @param {Number} row 
     * @param {Number} col 
     * @param {Number} moveAmount 
     * @returns {Array<{row, col, cost}>}
     */
    getPossibleMoves(row, col, moveAmount) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let board = gameEngine.board;
        //TODO: redo this whole thing to be correct. BFS from 1 to moveAmount

        let possibleMoves = [];

        let startPoint = {
            row: row,
            col: col,
            cost: 0
        };

        let coordinate = row + "," + col;

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
                for (let d = 0; d < board.directions.length; d++) {
                    let i = board.directions[d][0];
                    let j = board.directions[d][1];

                    coordinate = (row + i) + "," + (col + j);

                    if (visited.has(coordinate))
                        continue;

                    visited.add(coordinate);

                    let terrainCost = board.movementCost(row + i, col + j);
                    tempSquare = {
                        row: row + i,
                        col: col + j,
                        cost: cost + terrainCost
                    };

                    if (board.isWalkable(row + i, col + j)) {
                        if (moveAmount >= cost + terrainCost) {
                            possibleMoves.push(tempSquare);
                            queue.push(tempSquare);
                        }
                    }
                    //you can't walk here since there is a unit
                    //but you may interact with it (shown as possible move)
                    else if (board.boardUnits[row + i][col + j] != null) {
                        //let unit = board.boardUnits[row + i][col + j].data.get("data");

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
     * Highlights the squares that an army can move
     * @param {Army} armyData 
     */
    showPossibleArmyMoves(armyData) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let possibleMoves = this.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

        gameEngine.selectedArmyPossibleMoves = possibleMoves;

        gameEngine.board.highlightTiles(gameEngine.selectedArmyPossibleMoves);
    }

    /**
     * does the same thing as getPossibleMoves()
     * but you pass in an armySprite
     * @param {*} armySprite 
     */
    getPossibleMovesArmy(armySprite) {
        let army = armySprite.data.get("data");

        return this.getPossibleMoves(army.row, army.col, army.moveAmount);
    }
    
    /**
     * processes human-player army action
     * process army action such as move to targetSprite
     * @param {*} targetSprite building or terrain sprite
     */
    processHumanArmyAction(targetSprite) {
        /** @type {SceneGame} */
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;
        let board = gameEngine.board;

        let targetRow = targetSprite.data.get("row");
        let targetCol = targetSprite.data.get("col");

        if (gameEngine.selectedArmy == null)
            return;

        let armySprite = gameEngine.selectedArmy;
        /** @type {Army} */
        let army = armySprite.getData("data");

        let playerOwner = board.getTileOwnership(targetRow, targetCol);
        let selectedArmyRow = armySprite.data.get("data").row;
        let selectedArmyCol = armySprite.data.get("data").col;

        //own square
        if (army.row == targetRow && army.col == targetCol) {
            return; //do nothing
        }

        //empty terrain
        if (playerOwner == 0) {
            gameEngine.armyManager.moveArmyPlayer(armySprite, targetSprite);
        }
        //enemy terrain
        else {
            //if adjacent, show attack info screen
            if (GameUtils.areAdjacent(selectedArmyRow, selectedArmyCol, targetRow, targetCol)) {
                console.log("attack!");

                gameEngine.selectedEnemyArmyCoordinates = { row: targetRow, col: targetCol };
                gameScene.turnOnSubSceneOnce(gameScene.enemyArmyInfoScene);
                gameScene.cam.pan(armySprite.x, armySprite.y, 500);
            }
            //move closer
            else {
                console.log("too far to attack! moving closer!");
                board.unhighlightTiles(gameEngine.selectedArmyPossibleMoves);

                gameEngine.armyManager.moveArmyCloser(armySprite, targetSprite);

                gameEngine.selectedArmyPossibleMoves = gameEngine.armyManager.getPossibleMovesArmy(armySprite);
                board.highlightTiles(gameEngine.selectedArmyPossibleMoves);
            }

        }
        
        //after moving, if you're on top of an enemy building, show that info screen.
        gameEngine.buildingManager.turnOnEnemyBuildingInfoSceneCheck();
    }

}