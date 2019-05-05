
import Army from './Army.js';
import Caveman from './unit/Caveman.js';

import UnitFactory from './unit/UnitFactory'
import GameUtils from '../utils/GameUtils.js';

/**
 * Manages army data on the board.
 */
export default class ArmyManager {

    constructor(scene) {
        this.scene = scene;
    }

    /**
     * moves army to the terrainSprite (if possible)
     * for the human-player
     * @param {*} armySprite army to move 
     * @param {*} terrainSprite target square
     */
    moveArmyPlayer(armySprite, terrainSprite) {
        let scene = this.scene;

        scene.board.unhighlightTiles(scene.selectedArmyPossibleMoves);

        this.moveArmy(armySprite, terrainSprite, scene.selectedArmyPossibleMoves)

        scene.selectedArmyPossibleMoves = scene.board.getPossibleMovesArmy(armySprite);
        scene.board.highlightTiles(scene.selectedArmyPossibleMoves);
    }

    moveArmy(spriteArmy, terrainSprite, possibleMoves) {

        let scene = this.scene;

        let army = spriteArmy.data.get('data');

        let targetRow = terrainSprite.data.get('row');
        let targetCol = terrainSprite.data.get('col');

        //move visually and internally (row, col);
        let cost = this.getMovementCost(possibleMoves, targetRow, targetCol);

        //too expensive to move
        if (cost > army.moveAmount)
            return;

        //occupied by a unit already
        if (scene.board.boardUnits[targetRow][targetCol] != null) {
            return;
        }

        scene.board.removeArmy(army.row, army.col);

        army.moveAmount -= cost;
        army.row = targetRow;
        army.col = targetCol;

        //place army
        //TODO: dont make it a direct move. move square to square
        scene.tweens.add({
            targets: spriteArmy,
            x: terrainSprite.x,
            y: terrainSprite.y,
            ease: 'Linear',
            duration: 500
        });

        scene.board.addArmy(targetRow, targetCol, spriteArmy);

        scene.updateUI();

    }

    /**
    * moves army next to the squareTerrain (if possible) with as few moves as possible
    * if there are ties, it picks top, bottom, left, then right.
    * @param {*} armySprite army to move 
    * @param {*} terrainSprite target square
    */
    moveArmyCloser(armySprite, terrainSprite) {
        let scene = this.scene;
        let row = terrainSprite.getData("row");
        let col = terrainSprite.getData("col");

        let neighbors = scene.board.getNeighboringTiles(row, col);

        //remove unwalkable neighbors
        for (let i = neighbors.length - 1; i >= 0; i--) {
            let neighborRow = neighbors[i].row;
            let neighborCol = neighbors[i].col;

            if (!scene.board.isWalkable(neighborRow, neighborCol)) {
                neighbors.splice(i, 1);
            }
        }

        let movesCost = scene.board.getPossibleMovesArmy(armySprite);
        let neighborMovesCost = GameUtils.getIntersectionCoordinates(movesCost, neighbors);

        //no where to move
        if (neighborMovesCost.length == 0)
            return;

        //get cheapest cost
        let targetRow = neighborMovesCost[0].row
        let targetCol = neighborMovesCost[0].col;
        let lowestCost = neighborMovesCost[0].cost;
        for (let i = 1; i < neighborMovesCost.length; i++) {
            if (neighborMovesCost[i].cost < lowestCost) {
                targetRow = neighborMovesCost[i].row;
                targetCol = neighborMovesCost[i].col;
                lowestCost = neighborMovesCost[i].cost;
            }
        }

        let targetSprite = scene.board.getTerrain(targetRow, targetCol);
        this.moveArmy(armySprite, targetSprite, movesCost);
    }

    /**
     * gets the cost of moving to row/col according to what is in possibleMoves
     * @param {*} possibleMoves 
     * @param {*} row 
     * @param {*} col 
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
            console.log('not a possible move');
            return 9999;
        }

        return target.cost;

    }

    createArmyButton(pointer) {

        if (pointer.rightButtonDown())
            return;

        let scene = this.scene;
        let village = scene.selectedVillage.data.get('data');

        scene.board.unhighlightTiles(scene.possibleMoves);

        scene.armyManager.createArmy(1, village);

        scene.updateUI();

    }

    createArmy(player, village) {

        let scene = this.scene;
        let race = scene.playerRace[player];
        let row = village.row;
        let col = village.col;

        //space already occupied
        if (scene.board.boardUnits[row][col] != null) {
            console.log('already occupied');
            return;
        }

        //TODO: actual resource calculation
        if (village.amountFood < 10) {
            console.log('not enough food. need 10');
            return;
        }

        //TODO: make more precise
        if (village.population < 10) {
            console.log('not enough people. need 10');
            return;
        }

        //subtract cost
        village.amountFood -= 10;
        village.population -= 10;

        let armySprite = UnitFactory.getUnitSprite(scene, village, race);

        let army = new Army(player, village);
        //TODO: set army moveAmount dynamically
        army.moveAmount = 0;
        army.moveMax = 3;
        army.amountFood += 10;

        //TODO: generate random name

        //TODO: change this later
        for (let i = 0; i < 10; i++) {
            let unit = UnitFactory.getUnit(race);
            army.addUnit(unit);
        }

        armySprite.data.set('data', army);
        scene.playerArmies[player].push(armySprite);
        scene.board.addArmy(row, col, armySprite);

        return armySprite;
    }

    /**
     * assumed that the army is on a friendly village.
     * restocks the arny with one day's worth of food
     * @param {*} pointer 
     */
    armyGetFood(pointer) {

        let scene = this.scene;

        let army = scene.selectedArmy.data.get('data');
        let row = army.row;
        let col = army.col;
        let cost = army.getCostDay();

        let building = scene.board.boardBuildings[row][col].data.get('data');

        //transfer
        if (building.village.amountFood < cost) {
            console.log('not enough food. need 10');
            return;
        }

        building.village.amountFood -= cost;
        army.amountFood += cost;

        scene.updateUI();
    }

    //TODO: separate select and attack
    //TODO: replace inner code with scene.processArmyAction()
    clickedArmy(pointer) {
        let scene = this.scene;
        let otherArmy = this.data.get('data');
        let targetRow = otherArmy.row;
        let targetCol = otherArmy.col;

        console.log("clicked army")

        //clicked your own army
        if (otherArmy.player == 1) {
            scene.armyManager.selectArmy(pointer, this);
        }
        //clicked another player's army
        else {
            if (pointer.leftButtonDown()) {
                //show basic information
                console.log("units health: " + otherArmy.getUnitsHealthStatus());
            }
            //show "attack screen"
            else if (pointer.rightButtonDown()) {

                if (scene.selectedArmy == null)
                    return;

                //TODO: refactor this to be sprite
                scene.selectedEnemyArmyCoordinates = { row: targetRow, col: targetCol };
                let terrainSprite = scene.board.boardTerrainSprites[targetRow][targetCol];
                scene.processArmyAction(terrainSprite);
            }
        }
    }

    /**
     * you are selecting your own army. for human-players
     * @param {*} pointer 
     * @param {*} armySprite 
     */
    selectArmy(pointer, armySprite) {
        let scene = this.scene;

        //double click panning
        if (pointer.leftButtonDown() && scene.selectedArmy == armySprite) {
            scene.cam.pan(armySprite.x, armySprite.y, 500);
        }

        if (pointer.rightButtonDown())
            return;

        let army = armySprite.data.get('data');

        scene.deselectEverything();

        scene.selectedArmy = armySprite;
        console.log('selecting army');
        console.log("army health: " + army.getUnitsHealthStatus());

        armySprite.setTint(0xffff00);

        scene.showPossibleArmyMoves(army);

        scene.updateUI();
    }

    /**
     * get units from a village
     */
    armyGetUnits() {
        console.log('get more units');

        let scene = this.scene;
        let army = scene.selectedArmy.data.get('data');

        let row = army.row;
        let col = army.col;

        let buildingSprite = scene.board.boardBuildings[row][col];
        let village;

        if (buildingSprite == null)
            return;

        let buildingData = buildingSprite.data.get('data');

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

        scene.updateUI();
    }

    //TODO: remove prefix army

    /**
     * puts some people back into their own village
     * returns the last units in the "units" roster
     * @param {*} pointer
     */
    armyDisbandUnits(pointer) {
        console.log("disbanding!");

        let scene = this.scene;
        let army = scene.selectedArmy.getData("data");

        let disbandAmount = army.size() >= 10 ? 10 : army.size();

        let row = army.row;
        let col = army.col;

        let buildingSprite = scene.board.boardBuildings[row][col];
        let village;

        if (buildingSprite == null)
            return;

        let buildingData = buildingSprite.data.get('data');

        //is this our village?
        if (buildingData.player == army.player)
            village = buildingData.village;
        else
            return;

        for (let i = 0; i < disbandAmount; i++) {
            army.units.pop();
        }

        village.population += disbandAmount;

        if (army.size() == 0)
            scene.armyManager.destroyArmy(army);

        scene.updateUI();

    }

    armyAttack(pointer) {
        let scene = this.scene;

        console.log("ATTACKING");
        let targetRow = scene.selectedEnemyArmyCoordinates.row;
        let targetCol = scene.selectedEnemyArmyCoordinates.col;

        let yourArmy = scene.selectedArmy.getData("data");
        let enemyArmy = scene.board.boardUnits[targetRow][targetCol].getData("data");

        //TODO: remove this later. let player decide how they want to sort (formation)
        yourArmy.sortUnitsByHealthReverse();
        enemyArmy.sortUnitsByHealthReverse();

        scene.armyManager.simulateArmiesAttacking(yourArmy, enemyArmy);

        //then calculate casualties
        //TODO: clean away casualties after confirming deaths

        //update your ui
        if (yourArmy.size() > 0) {
            scene.showPossibleArmyMoves(yourArmy);
            scene.updateUI();
        }

        //update enemy ui
        if (enemyArmy.size() > 0)
            scene.showUiArmyEnemy(targetRow, targetCol);

        if (yourArmy.size() == 0 || enemyArmy.size() == 0) {
            GameUtils.hideGameObjects(scene.uiArmyEnemy);
            scene.selectedEnemyArmyCoordinates = null;
        }
    }

    //TODO: pass sprites
    /**
     * simulates an army attacking the other army. and vice versa
     * @param {*} yourArmy data
     * @param {*} enemyArmy data
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

    //TODO: pass sprites
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
        let scene = this.scene;
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

        if (building.health <= 0)
            scene.buildingManager.destroyBuilding(buildingSprite);

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
     * @param {*} building data
     * @param {*} enemyArmy data
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

    clickedArmyAttackBuilding(pointer) {
        console.log("clicked attacking building");
        let scene = this.scene;

        if (scene.selectedArmy == null)
            return;

        let armySprite = scene.selectedArmy;
        let army = armySprite.getData("data");

        let buildingSprite = scene.board.getBuilding(army.row, army.col);

        scene.armyManager.armyAttackBuilding(armySprite, buildingSprite);

        scene.updateUI();
    }

    /**
     * attack the thing you are standing on
     * @param {*} armySprite 
     */
    armyAttackBuilding(armySprite, buildingSprite) {

        //TODO: take out some moves

        this.simulateArmyAttackingBuilding(armySprite, buildingSprite);
    }

    //TODO: probably just sprites argument
    destroyArmy(armyData) {
        let scene = this.scene;
        let row = armyData.row;
        let col = armyData.col;
        let playerNumber = armyData.player;

        let sprite = scene.board.boardUnits[row][col];

        let playersArmies = scene.playerArmies[playerNumber];
        for (let i = 0; i < playersArmies.length; i++) {
            if (playersArmies[i] == sprite) {
                playersArmies.splice(i, 1);
                break;
            }
        }

        scene.board.removeArmy(row, col);

        //TODO: probably just sprites
        if (scene.selectedArmy != null && scene.selectedArmy.getData("data") == armyData) {
            scene.deselectEverything();
        }

        sprite.destroy();
    }

    armyAttackCancel() {
        let scene = this.scene;
        GameUtils.hideGameObjects(scene.uiArmyEnemy);
    }

}