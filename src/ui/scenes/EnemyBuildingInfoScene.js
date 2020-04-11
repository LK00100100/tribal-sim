import Phaser from "phaser";

// eslint-disable-next-line no-unused-vars
import SceneGame from "../../SceneGame";

/**
 * Ui that displays information on an enemy building. And actions against the enemy.
 * 
 * Opens when the human-player clicks on an enemy building.
 */
export default class EnemyBuildingInfoScene extends Phaser.Scene {

    /**
     * 
     * @param {SceneGame} gameScene 
     */
    constructor(gameScene) {
        super("EnemyBuildingInfoScene");    //has to be same as above"
        this.handle = "EnemyBuildingInfoScene";    //has to be same as above

        this.gameScene = gameScene;

        //ui elements
        this.uiEnemyBuilding = [];
    }

    preload() {
        this.load.image("btnArmyAttackBuilding", "assets/btn-army-attack-building.png");
    }

    create() {
        let x, y;

        //set cam
        var zoomLevel = 0.5;
        this.cam = this.cameras.main.setZoom(zoomLevel);

        /**
        * ui enemy elements building
        */

        x = 1150;
        y = -160;

        this.txtEnemyBuildingPlayer = this.createUiTextHelper(x, y)
            .setOrigin(1, 0); //right-to-left text

        this.txtEnemyBuildingHealth = this.createUiTextHelper(x, y + 60)
            .setOrigin(1, 0); //right-to-left text

        this.btnEnemyBuildingAttack = this.createUiButtonHelper(x, y + 130, "btnArmyAttackBuilding", this.clickedArmyAttackBuilding)
            .setOrigin(1, 0); //right-to-left text

        this.uiEnemyBuilding.push(this.txtEnemyBuildingPlayer);
        this.uiEnemyBuilding.push(this.txtEnemyBuildingHealth);
        this.uiEnemyBuilding.push(this.btnEnemyBuildingAttack);

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

        this.btnEnemyBuildingAttack.setTint("0x555555");
    }

    updateUiText(){
        let gameScene = this.gameScene;
        let enemyBuildingSprite = gameScene.selectedEnemyBuilding;
        let enemyBuilding = enemyBuildingSprite.getData("data");

        this.txtEnemyBuildingPlayer.setText(enemyBuilding.player + " :Building, Player");
        this.txtEnemyBuildingHealth.setText(enemyBuilding.health + " :Building, Health");
    }

    /**
     * main attacks
     */
    
    /**
      * you've clicked attack on this building
      */
    clickedArmyAttackBuilding() {
        console.log("clicked attacking building");
        let gameScene = this.gameScene;

        let armySprite = gameScene.selectedArmy;

        if (armySprite == null)
            return;

        let army = armySprite.getData("data");

        let buildingSprite = gameScene.board.getBuilding(army.row, army.col);

        gameScene.armyManager.armyAttackBuilding(armySprite, buildingSprite);

        gameScene.updateUi();
    }


}