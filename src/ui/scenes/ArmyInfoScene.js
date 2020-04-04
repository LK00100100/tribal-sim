
import Phaser from "phaser";

import DirectionObj from "../../board/Direction";
const { Direction } = DirectionObj;

import GameUtils from "../../utils/GameUtils";
import GameUtilsUi from "../../utils/GameUtilsUi";

export default class ArmyInfoScene extends Phaser.Scene {

    constructor(gameScene) {
        super("ArmyInfoScene");

        this.gameScene = gameScene;
    }

    //preload assets
    preload() {
        let scene = this;

        //set cam
        var zoomLevel = 0.5;

        this.cam = this.cameras.main.setZoom(zoomLevel);

        //ui, army
        scene.load.image("btnArmyGetUnits", "assets/btn-army-get-units.png");
        scene.load.image("btnArmyDisbandUnits", "assets/btn-army-disband-units.png");
        scene.load.image("btnArmyGetFood", "assets/btn-army-get-food.png");
        scene.load.image("btnArmyGetWood", "assets/btn-army-get-wood.png");
        scene.load.image("btnArmyAttack", "assets/btn-army-attack.png");
        scene.load.image("btnArmyAttackBuilding", "assets/btn-army-attack-building.png");
        scene.load.image("btnArmyBuild", "assets/btn-army-build.png");

        //ui, army build
        scene.load.image("btnArmyCancel", "assets/btn-army-cancel.png");
        scene.load.image("btnArmyBuildEast", "assets/btn-army-build-east.png");
        scene.load.image("btnArmyBuildNorth", "assets/btn-army-build-north.png");
        scene.load.image("btnArmyBuildSouth", "assets/btn-army-build-south.png");
        scene.load.image("btnArmyBuildWest", "assets/btn-army-build-west.png");
        scene.load.image("btnArmyBuildWallWood", "assets/btn-army-build-wall-wood.png");
    }

    create() {

        this.uiArmyText = [];
        this.uiArmyButtons = [];
        this.uiArmyBuildButtons = [];

        //TODO: buttons have all clickedFunctions 
        /**
         * UI - army
         */
        //TODO: pull this out to a scene on top of another scene.

        let x = -350;
        let y = -100;

        this.txtArmySize = this.createUiTextHelper(x, y);
        this.txtArmyVillage = this.createUiTextHelper(x, y + 60);
        this.txtArmyMoves = this.createUiTextHelper(x, y + 120);
        this.txtArmyFood = this.createUiTextHelper(x, y + 180);
        this.txtArmyWood = this.createUiTextHelper(x, y + 240);

        this.uiArmyText.push(this.txtArmySize);
        this.uiArmyText.push(this.txtArmyVillage);
        this.uiArmyText.push(this.txtArmyMoves);
        this.uiArmyText.push(this.txtArmyFood);
        this.uiArmyText.push(this.txtArmyWood);

        //TODO: create enums
        //army buttons
        this.btnArmyGetUnits = this.createUiButtonHelper(x, y + 290, "btnArmyGetUnits", this.gameScene.armyManager.armyGetUnits);
        this.btnArmyDisbandUnits = this.createUiButtonHelper(x, y + 430, "btnArmyDisbandUnits", this.gameScene.armyManager.armyDisbandUnits);
        this.btnArmyGetFood = this.createUiButtonHelper(x, y + 570, "btnArmyGetFood", this.gameScene.armyManager.armyGetFood);
        this.btnArmyGetWood = this.createUiButtonHelper(x, y + 710, "btnArmyGetWood", this.gameScene.armyManager.armyGetWood);
        this.btnArmyBuild = this.createUiButtonHelper(x, y + 850, "btnArmyBuild", this.gameScene.armyManager.armyBuild);

        //TODO: clickedSomething functions
        this.uiArmyButtons.push(this.btnArmyGetUnits);
        this.uiArmyButtons.push(this.btnArmyDisbandUnits);
        this.uiArmyButtons.push(this.btnArmyGetFood);
        this.uiArmyButtons.push(this.btnArmyGetWood);
        this.uiArmyButtons.push(this.btnArmyBuild);

        //army, build buttons

        this.btnArmyBuildCancel = this.createUiButtonHelper(x, y + 290, "btnArmyCancel", this.gameScene.armyManager.armyBuildCancel);
        this.btnArmyBuildWallWood = this.createUiButtonHelper(x, y + 430, "btnArmyBuildWallWood", this.gameScene.clickedBuildWallWood);

        this.uiArmyBuildButtons.push(this.btnArmyBuildCancel);
        this.uiArmyBuildButtons.push(this.btnArmyBuildWallWood);

        this.btnArmyBuildEast = this.createUiButtonHelper(x + 420, y + 360, "btnArmyBuildEast")
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.EAST);
            });

        this.btnArmyBuildNorth = this.createUiButtonHelper(x + 350, y + 290, "btnArmyBuildNorth")
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.NORTH);
            });

        this.btnArmyBuildSouth = this.createUiButtonHelper(x + 350, y + 430, "btnArmyBuildSouth")
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.SOUTH);
            });

        this.btnArmyBuildWest = this.createUiButtonHelper(x + 280, y + 360, "btnArmyBuildWest")
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.WEST);
            });

        this.uiArmyBuildButtons.push(this.btnArmyBuildEast);
        this.uiArmyBuildButtons.push(this.btnArmyBuildNorth);
        this.uiArmyBuildButtons.push(this.btnArmyBuildSouth);
        this.uiArmyBuildButtons.push(this.btnArmyBuildWest);

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

        if (buttonFunc)
            uiButtonElement.on("pointerdown", this.gameScene.armyManager.armyGetUnits);

        return uiButtonElement;
    }

    //TODO: refactor elsewhere

    /**
     * shows the ui army main action buttons
     * hides non-main action buttons
     * @param {Army} armyData 
     */
    showUiArmyButtons(armyData) {

        //TODO: refactor armyData as just selected
        GameUtilsUi.hideGameObjects(this.uiArmyBuildButtons);
        this.selectedArmyBuildFunc = null;

        let row = armyData.row;
        let col = armyData.col;

        let buildingSprite = this.board.boardBuildings[row][col];

        //on-top-of-village buttons
        //TODO: be able to replenish in friendly villages through trade.
        //TODO: buttons in a list. text in a list.
        this.btnArmyGetFood.visible = false;
        this.btnArmyGetUnits.visible = false;
        this.btnArmyDisbandUnits.visible = false;
        if (buildingSprite != null) {

            let buildingData = buildingSprite.data.get("data");

            /** @type {Village} */
            let village = buildingData.village;

            if (village == null)
                return;

            //if this is your territory
            if (buildingData.player == armyData.player) {
                GameUtilsUi.showGameObjects(this.uiArmyButtons);
                GameUtils.clearTintArray(this.uiArmyButtons);

                /**
                 * adequate resources check
                 */
                //get food
                if (village.amountFood < 10)
                    this.btnArmyGetFood.setTint("0xff0000");
                else if (village.amountFood == 10)
                    this.btnArmyGetFood.setTint("0xffff00");

                //get units
                if (village.population < 10)
                    this.btnArmyGetUnits.setTint("0xff0000");
                else if (village.population == 10)
                    this.btnArmyGetUnits.setTint("0xffff00");

                //get wood
                if (village.amountWood < 10)
                    this.btnArmyGetWood.setTint("0xff0000");
                else if (village.amountWood == 10)
                    this.btnArmyGetWood.setTint("0xffff00");
            }
        }

    }

    //TODO: refactor elsewhere
    /**
     * shows the army build buttons.
     * hides all non army build buttons
     */
    showUiArmyBuildButtons() {
        GameUtilsUi.hideGameObjects(this.uiArmyButtons);
        GameUtilsUi.showGameObjects(this.uiArmyBuildButtons);
        GameUtils.clearTintArray(this.uiArmyBuildButtons);

        /** @type {Army} */
        let armyData = this.selectedArmy.getData("data");

        //TODO: remove hardcode. maybe to json file -> load singleton
        if (armyData.amountWood < 100)
            this.btnArmyBuildWallWood.setTint("0xff0000");

        this.updateUiArmyBuildDirectionButtons();
    }

}