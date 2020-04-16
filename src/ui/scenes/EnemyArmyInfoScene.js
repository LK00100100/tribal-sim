import Phaser from "phaser";

// eslint-disable-next-line no-unused-vars
import SceneGame from "../../SceneGame";
import GameUtilsUi from "../../utils/GameUtilsUi";


/**
 * Ui that displays information on an enemy army. And actions against the enemy.
 * 
 * Opens when the human-player clicks on an enemy army.
 */
export default class EnemyArmyInfoScene extends Phaser.Scene {

    /**
     * 
     * @param {SceneGame} gameScene 
     * @param {GameEngine} gameEngine
     */
    constructor(gameScene, gameEngine) {
        super("EnemyArmyInfoScene");    //has to be same as above"
        this.handle = "EnemyArmyInfoScene";    //has to be same as above

        this.gameScene = gameScene;
        this.gameEngine = gameEngine;

        //ui elements
        this.uiArmyEnemy = [];
    }

    preload() {
        this.load.image("btnArmyAttack", "assets/btn-army-attack.png");
        this.load.image("btnArmyCancel", "assets/btn-army-cancel.png");
    }

    create() {
        let x, y;

        //set cam
        var zoomLevel = 0.5;
        this.cam = this.cameras.main.setZoom(zoomLevel);

        /**
         * UI - enemy army
         */
        x = 1150;
        y = -160;

        this.txtArmyEnemyName = this.createUiTextHelper(x, y + 120)
            .setOrigin(1, 0); //right-to-left text

        this.txtArmyEnemyUnits = this.createUiTextHelper(x, y + 180)
            .setOrigin(1, 0); //right-to-left text

        this.txtArmyEnemyAttackBase = this.createUiTextHelper(x, y + 240)
            .setOrigin(1, 0); //right-to-left text

        this.txtArmyEnemyDefenseBase = this.createUiTextHelper(x, y + 300)
            .setOrigin(1, 0); //right-to-left text

        this.btnArmyEnemyAttack = this.createUiButtonHelper(x, y + 360, "btnArmyAttack", this.clickedArmyAttack)
            .setOrigin(1, 0); //right-to-left text

        this.btnArmyEnemyCancel = this.createUiButtonHelper(x, y + 500, "btnArmyCancel", this.clickedArmyAttackCancel)
            .setOrigin(1, 0); //right-to-left text

        this.uiArmyEnemy.push(this.txtArmyEnemyName);
        this.uiArmyEnemy.push(this.txtArmyEnemyUnits);
        this.uiArmyEnemy.push(this.txtArmyEnemyAttackBase);
        this.uiArmyEnemy.push(this.txtArmyEnemyDefenseBase);
        this.uiArmyEnemy.push(this.btnArmyEnemyAttack);
        this.uiArmyEnemy.push(this.btnArmyEnemyCancel);

        this.updateUi();
    }

    //TODO: refactor to gameutils for this, army infoscene, and gamescene
    /**
     * a helper method to create a standard UI text element for this scene.
     * @param {Number} x 
     * @param {Number} y 
     */
    createUiTextHelper(x, y) {
        let uiTextElement = this.add.text(x, y)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, "#000000", 3);

        return uiTextElement;
    }

    /**
     * a helper method to create a standard UI button element for this scene.
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} buttonName
     * @param {Function} buttonFunc optional function
     */
    createUiButtonHelper(x, y, buttonName, buttonFunc) {
        let uiButtonElement = this.add.sprite(x, y, buttonName)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0);

        if (buttonFunc) {
            let bindTo = this;
            uiButtonElement.on("pointerdown", buttonFunc, bindTo);
        }

        return uiButtonElement;
    }

    updateUi() {
        this.updateUiText();
    }

    updateUiText(){
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        //no enemy army selected, turn this screen off.
        if(gameEngine.selectedEnemyArmy == null){
            gameScene.turnOffSubScene(this);
            return;
        }

        let enemyArmy = gameEngine.selectedEnemyArmy.getData("data");

        this.txtArmyEnemyUnits.setText(enemyArmy.units.length + " :Enemy Units");
        this.txtArmyEnemyName.setText(enemyArmy.name);
        this.txtArmyEnemyAttackBase.setText(enemyArmy.calculateAttackBase() + " :Attack Base");
        this.txtArmyEnemyDefenseBase.setText(enemyArmy.calculateDefenseBase() + " :Defense Base");
    }

    /**
     * main actions
     */
    
    /**
     * if you have your selected army, and then you right click an enemy (within range),
     * then you can click this and actually attack this enemy army.
     */
    clickedArmyAttack() {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let targetRow = gameEngine.selectedEnemyArmyCoordinates.row;
        let targetCol = gameEngine.selectedEnemyArmyCoordinates.col;

        let yourArmy = gameEngine.selectedArmy.getData("data");
        let enemyArmy = gameEngine.board.boardUnits[targetRow][targetCol].getData("data");

        //TODO: remove this later. let player decide how they want to sort (formation)
        yourArmy.sortUnitsByHealthReverse();
        enemyArmy.sortUnitsByHealthReverse();

        gameEngine.armyManager.simulateArmiesAttacking(yourArmy, enemyArmy);

        //then calculate casualties
        //TODO: clean away casualties after confirming deaths

        //update your ui
        if (yourArmy.size() > 0) {
            gameEngine.armyManager.showPossibleArmyMoves(yourArmy);
            gameScene.updateUi();
        }

        //update enemy ui
        if (enemyArmy.size() > 0)
            this.updateUi();

        //an army is destroyed. turn off all info scenes.
        if (yourArmy.size() == 0 || enemyArmy.size() == 0) {
            gameScene.turnOffSubScene(gameScene.humanArmyInfoScene);
            gameScene.turnOffSubScene(gameScene.enemyArmyInfoScene);

            gameScene.selectedEnemyArmy = null;
            gameScene.selectedEnemyArmyCoordinates = null;
        }
    }

    /**
     * enemy army -> attack cancel
     * Backs away from this menu.
     */
    clickedArmyAttackCancel() {
        let gameScene = this.gameScene;

        gameScene.turnOffSubScene(this);
    }

}