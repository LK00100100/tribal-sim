import Phaser from "phaser";

// eslint-disable-next-line no-unused-vars
import SceneGame from "../../SceneGame";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../../engine/GameEngine";

/**
 * Ui that displays information on a non-village building. And actions.
 * 
 * Opens when the human-player clicks on his own non-village building.
 */
export default class HumanBuildingInfoScene extends Phaser.Scene {

    /**
     * 
     * @param {SceneGame} gameScene 
     * @param {GameEngine} gameEngine
     */
    constructor(gameScene, gameEngine) {
        super("HumanBuildingInfoScene");    //has to be same as below
        this.handle = "HumanBuildingInfoScene";    //has to be same as above

        this.gameScene = gameScene;
        this.gameEngine = gameEngine;

        //ui elements
        this.uiBuilding = [];
    }

    preload() {
        //ui, buildings
        this.load.image("btnBuildDestroy", "assets/btn-build-destroy.png");
    }

    create() {
        let x, y;

        //set cam
        var zoomLevel = 0.5;
        this.cam = this.cameras.main.setZoom(zoomLevel);

        /**
         * UI - building
         */
        x = -375;
        y = -120;

        this.txtBuildName = this.createUiTextHelper(x, y);
        this.btnBuildDestroy = this.createUiButtonHelper(x, y + 60, "btnBuildDestroy", this.clickedDestroyBuilding);

        this.uiBuilding.push(this.txtBuildName);
        this.uiBuilding.push(this.btnBuildDestroy);

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
        let selectedBuildingSprite = gameScene.selectedBuilding;

        let building = selectedBuildingSprite.getData("data");

        this.txtBuildName.setText(building.name);
    }

    /**
     * main actions
     */

    /**
     * the human-player wants to destroy this building
     */
    clickedDestroyBuilding() {
        let gameScene = this.gameScene;

        gameScene.buildingManager.destroyBuilding(gameScene.selectedBuilding);

        gameScene.deselectEverything();
        gameScene.turnOffSubScene(this);
    }

}