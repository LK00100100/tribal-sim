
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
        let row = terrainSprite.data("row");
        let col = terrainSprite.data("col");
        let army = armySprite.data.get("data");

        scene.board.unhighlightTiles(scene.selectedArmyPossibleMoves);

        let neighbors = scene.board.getNeighboringTiles(row, col);

        //remove unwalkable neighbors
        for (let i = neighbors.length - 1; i >= 0; i--) {
            let neighborRow = neighbors[i].row;
            let neighborCol = neighbors[i].col;

            if (!scene.board.isWalkable(neighborRow, neighborCol)) {
                neighbors.splice(i, 1);
            }
        }

        //remove bad moves
        //GameUtils.getIntersectionCoordinates
        //TODO: complete this
        //pick the cheapest move
        let targetSprite = null;


        this.moveArmyHelper(armySprite, targetSprite, scene.selectedArmyPossibleMoves)

        scene.selectedArmyPossibleMoves = scene.board.getPossibleMovesArmy(armySprite);
        scene.board.highlightTiles(scene.selectedArmyPossibleMoves);
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
        army.moveAmount = 3;
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
    clickedArmy(pointer) {
        let scene = this.scene;
        let army = this.data.get('data');

        console.log("clicked army")

        //clicked your own army
        if (army.player == 1) {
            scene.armyManager.selectArmy(pointer, this);
        }
        //clicked another player's army
        else {
            if (pointer.leftButtonDown()) {
                //show basic information
            }
            //attack army
            else if (pointer.rightButtonDown()) {

                if (scene.selectedArmy == null)
                    return;

                scene.armyManager.attackArmy(this);
            }
        }
    }

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

        armySprite.setTint(0xffff00);

        scene.showPossibleArmyMoves(army);

        scene.updateUI();
    }

    attackArmy(armySprite) {
        let scene = this.scene;
        let army = armySprite.data.get("data");

        console.log("right clicked hostile army w/ selected");

        //TODO: fill out

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
        if (buildingSprite != null) {
            let buildingData = buildingSprite.data.get('data');

            if (buildingData.player == army.player)
                village = buildingData.village;
            else
                return;
        }

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

    armyAttack(pointer){
        let scene = this.scene;

        console.log("ATTACKING");
    }

    armyAttackCancel(){
        let scene = this.scene;
        GameUtils.hideGameObjects(scene.uiArmyEnemy);
    }

}