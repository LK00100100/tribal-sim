
import Phaser from "phaser";
// eslint-disable-next-line no-unused-vars
import SceneGame from "../../SceneGame";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../../engine/GameEngine";


/**
 * Contains the Ui that displays time-related things.
 */
export default class TimeInfoScene extends Phaser.Scene {

    /**
     * 
     * @param {SceneGame} gameScene 
     * @param {GameEngine} gameEngine 
     */
    constructor(gameScene, gameEngine) {
        super("TimeInfoScene");
        this.handle = "TimeInfoScene";

        this.gameScene = gameScene;
        this.gameEngine = gameEngine;
    }

    //preload assets
    preload() {
        this.load.image("btnEndTurn", "assets/btn-end-turn.png");
    }

    create() {
        //set cam
        var zoomLevel = 0.5;
        this.cam = this.cameras.main.setZoom(zoomLevel);

        this.txtDay = this.createUiTextHelper(1180, 980)
            .setOrigin(1, 0); //right-to-left text;

        //button, end turn
        this.btnEndTurn = this.createUiButtonHelper(920, 1050, "btnEndTurn", this.clickedEndTurn);

        this.updateUi();
    }

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
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        //TODO: replace with icons later
        if (this.txtDay)
            this.txtDay.setText("Day: " + gameEngine.day);
    }

    clickedEndTurn(pointer) {
        if (pointer != null && pointer.rightButtonDown())
            return;

        this.gameEngine.endTurn();
    }

}