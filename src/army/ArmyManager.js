
import Army from './Army.js';
import Caveman from './unit/Caveman.js';

import UnitFactory from './unit/UnitFactory'

/**
 * Manages army data on the board.
 */
export default class ArmyManager {

    constructor(scene) {
        this.scene = scene;
    }

    moveArmy(spriteArmy, squareTerrain) {

        let scene = this.scene;

        let army = spriteArmy.data.get('data');

        let targetRow = squareTerrain.data.get('row');
        let targetCol = squareTerrain.data.get('col');

        console.log('terrain right clicked with army');

        //highlight allowed movement
        console.log('squareTerrain.x: ' + squareTerrain.x);
        console.log('squareTerrain.y: ' + squareTerrain.y);

        //move visually and internally (row, col);

        let cost = this.getMovementCost(targetRow, targetCol);

        if (cost > army.moveAmount)
            return;

        //remove army
        scene.board.removeArmy(army.row, army.col);
        scene.board.unhighlightTiles(scene.selectedArmyPossibleMoves);

        army.moveAmount -= cost;
        army.row = targetRow;
        army.col = targetCol;

        scene.updateTextArmy(army);

        //place army
        //TODO: dont make it a direct move.
        scene.tweens.add({
            targets: scene.selectedArmy,
            x: squareTerrain.x,
            y: squareTerrain.y,
            ease: 'Linear',
            duration: 500
        });

        let possibleMoves = scene.board.getPossibleMoves(army.row, army.col, army.moveAmount);
        scene.selectedArmyPossibleMoves = possibleMoves;

        scene.board.highlightTiles(scene.selectedArmyPossibleMoves);
        scene.board.addArmy(targetRow, targetCol, spriteArmy);

        scene.updateUI(army);

    }

    //call getPossibleArmyMoves first
    getMovementCost(row, col) {

        let target = null;

        for (let i = 0; i < this.scene.selectedArmyPossibleMoves.length; i++) {
            let move = this.scene.selectedArmyPossibleMoves[i];

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

        let army = new Army(1, village);
        //TODO: set army moveAmount dynamically
        army.moveAmount = 3;
        army.moveMax = 3;
        army.amountFood += 10;

        //TODO: change this later
        for (let i = 0; i < 10; i++) {
            let unit = UnitFactory.getUnit(race);
            army.addUnit(unit);
        }

        armySprite.data.set('data', army);
        scene.playerArmies[player].push(armySprite);
        scene.board.addArmy(row, col, armySprite);

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

    selectArmy(pointer) {
        let scene = this.scene;

        //double click panning
        if (pointer.leftButtonDown() && scene.selectedArmy == this) {
            scene.cam.pan(this.x, this.y, 500);
        }

        if (pointer.rightButtonDown())
            return;

        let army = this.data.get('data');

        scene.deselectEverything();

        scene.selectedArmy = this;
        console.log('selecting army');

        this.setTint(0xffff00);

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


}