
import Phaser from "phaser";

import DirectionObj from "../../board/Direction";
const { Direction } = DirectionObj;

import GameUtils from "../../utils/GameUtils";
import GameUtilsUi from "../../utils/GameUtilsUi";

/**
 * Contains the Ui that displays the human-player's army info and actions
 */
//TODO: rename HumanArmyInfoScene
export default class ArmyInfoScene extends Phaser.Scene {

    constructor(gameScene) {
        super("armyInfoScene");
        this.handle = "armyInfoScene";

        this.gameScene = gameScene;

        //ui element groupings
        this.uiArmyText = [];
        this.uiArmyButtons = [];
        this.uiArmyBuildButtons = [];

        //the human-player desired build function
        this.selectedArmyBuildFunc = null;
    }

    //preload assets
    preload() {
        let scene = this;

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
        //set cam
        var zoomLevel = 0.5;
        this.cam = this.cameras.main.setZoom(zoomLevel);

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
        this.btnArmyGetUnits = this.createUiButtonHelper(x, y + 290, "btnArmyGetUnits", this.clickedArmyGetUnits);
        this.btnArmyDisbandUnits = this.createUiButtonHelper(x, y + 430, "btnArmyDisbandUnits", this.clickedArmyDisbandUnits);
        this.btnArmyGetFood = this.createUiButtonHelper(x, y + 570, "btnArmyGetFood", this.clickedArmyGetFood);
        this.btnArmyGetWood = this.createUiButtonHelper(x, y + 710, "btnArmyGetWood", this.clickedArmyGetWood);
        this.btnArmyBuild = this.createUiButtonHelper(x, y + 850, "btnArmyBuild", this.clickedArmyBuild);

        //TODO: clickedSomething functions
        this.uiArmyButtons.push(this.btnArmyGetUnits);
        this.uiArmyButtons.push(this.btnArmyDisbandUnits);
        this.uiArmyButtons.push(this.btnArmyGetFood);
        this.uiArmyButtons.push(this.btnArmyGetWood);
        this.uiArmyButtons.push(this.btnArmyBuild);

        /**
         * army, build buttons
         */
        this.btnArmyBuildCancel = this.createUiButtonHelper(x, y + 290, "btnArmyCancel", this.clickedArmyBuildCancel);
        this.btnArmyBuildWallWood = this.createUiButtonHelper(x, y + 430, "btnArmyBuildWallWood", this.clickedBuildWallWood);

        this.uiArmyBuildButtons.push(this.btnArmyBuildCancel);
        this.uiArmyBuildButtons.push(this.btnArmyBuildWallWood);

        this.btnArmyBuildEast = this.createUiButtonHelper(x + 420, y + 360, "btnArmyBuildEast")
            .on("pointerdown", function () {
                this.clickedBuildDirection(Direction.EAST);
            }, this);

        this.btnArmyBuildNorth = this.createUiButtonHelper(x + 350, y + 290, "btnArmyBuildNorth")
            .on("pointerdown", function () {
                this.clickedBuildDirection(Direction.NORTH);
            }, this);

        this.btnArmyBuildSouth = this.createUiButtonHelper(x + 350, y + 430, "btnArmyBuildSouth")
            .on("pointerdown", function () {
                this.clickedBuildDirection(Direction.SOUTH);
            }, this);

        this.btnArmyBuildWest = this.createUiButtonHelper(x + 280, y + 360, "btnArmyBuildWest")
            .on("pointerdown", function () {
                this.clickedBuildDirection(Direction.WEST);
            }, this);

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

        if (buttonFunc) {
            let bindTo = this;
            uiButtonElement.on("pointerdown", buttonFunc, bindTo);
        }

        return uiButtonElement;
    }

    /**
     * Resets this scene to its original state.
     */
    resetUi() {
        let selectedArmy = this.gameScene.selectedArmy.getData("data");

        GameUtilsUi.showGameObjects(this.uiArmyText);

        this.updateTextArmy(selectedArmy);
        this.showUiArmyButtons(selectedArmy);
    }

    /**
     * shows the ui army main action buttons
     * hides non-main action buttons
     * @param {Army} armyData 
     */
    showUiArmyButtons(armyData) {
        let gameScene = this.gameScene;

        //TODO: refactor armyData as just selected
        GameUtilsUi.hideGameObjects(this.uiArmyBuildButtons);
        this.selectedArmyBuildFunc = null;

        let row = armyData.row;
        let col = armyData.col;

        let buildingSprite = gameScene.board.boardBuildings[row][col];

        //on-top-of-village buttons
        //TODO: be able to replenish in friendly villages through trade.
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

                //TODO: hardcode bad
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

    /**
     * shows the army build buttons.
     * hides all non army build buttons
     */
    showUiArmyBuildButtons() {
        let gameScene = this.gameScene;

        GameUtilsUi.hideGameObjects(this.uiArmyButtons);
        GameUtilsUi.showGameObjects(this.uiArmyBuildButtons);
        GameUtils.clearTintArray(this.uiArmyBuildButtons);

        let army = gameScene.selectedArmy.getData("data");
        this.updateUiArmyBuildButtons(army);
    }

    /**
     * main button actions
     */

    /**
     * human-player action
     * clicked army -> get units 
     * gets units from a village
     */
    clickedArmyGetUnits() {
        let gameScene = this.gameScene;

        let army = gameScene.selectedArmy.data.get("data");

        gameScene.armyManager.getUnits(army);

        gameScene.updateUi();
        this.updateUi();
    }

    /**
     * puts some people back into their own village
     * returns the last units in the "units" roster
     * @param {*} pointer
     */
    clickedArmyDisbandUnits() {
        let gameScene = this.gameScene;

        let army = gameScene.selectedArmy.getData("data");
        let row = army.row;
        let col = army.col;

        let disbandAmount = army.size() >= 10 ? 10 : army.size();

        let buildingSprite = gameScene.board.boardBuildings[row][col];
        let village;

        if (buildingSprite == null)
            return;

        let building = buildingSprite.data.get("data");

        //is this our village?
        if (building.player == army.player)
            village = building.village;
        else
            return;

        for (let i = 0; i < disbandAmount; i++) {
            army.units.pop();
        }

        village.population += disbandAmount;

        if (army.size() == 0)
            gameScene.armyManager.destroyArmy(army);

        gameScene.updateUi();
        this.updateUi();
    }

    /**
     * assumed that the army is on a friendly village.
     * restocks the arny with one day's worth of food
     * @param {Phaser.Pointer} pointer 
     */
    clickedArmyGetFood() {
        let gameScene = this.gameScene;

        let army = gameScene.selectedArmy.data.get("data");
        gameScene.armyManager.getFood(army);

        gameScene.updateUi();
        this.updateUi();
    }

    /**
     * human-player clicked army -> get wood
     */
    clickedArmyGetWood() {
        let gameScene = this.gameScene;

        let army = gameScene.selectedArmy.data.get("data");
        gameScene.armyManager.getWood(army);

        gameScene.updateUi();
        this.updateUi();
    }

    /**
     * human-player clicks army -> build.
     * Should just show stuff that can be built
     * @param {Phaser.Scene} scene
     */
    clickedArmyBuild() {
        this.showUiArmyBuildButtons();
    }

    /**
     * build actions
     */

    /**
     * human-player clicks "army > build > cancel build"
     * Should go back to the main army actions
     * @param {Phaser.Scene} scene
     */
    clickedArmyBuildCancel() {
        let gameScene = this.gameScene;

        let army = gameScene.selectedArmy.getData("data");

        this.showUiArmyButtons(army);
    }

    //TODO: just bind(this) functions
    clickedBuildWallWood() {
        let gameScene = this.gameScene;
        //TODO: activate buttons if you have enough resources. else display warning

        this.selectedArmyBuildFunc = gameScene.armyManager.armyBuildWallWood;

        this.updateUiArmyBuildDirectionButtons();
    }

    /**
     * build something if we can
     * @param {Direction} direction 
     */
    clickedBuildDirection(direction) {
        if (this.selectedArmyBuildFunc == null)
            return;

        //check if we can build there

        this.selectedArmyBuildFunc(direction);
    }
    /**
     * updates all elements of the ui for this scene with the correct visualization
     */
    updateUi() {
        let gameScene = this.gameScene;

        if (!gameScene.selectedArmy)
            return;

        let army = gameScene.selectedArmy.getData("data");

        this.updateTextArmy(army);
        this.updateUiArmyBuildButtons(army);
    }

    /**
     * Updates the ui text of the army
     * @param {Army} army 
     */
    updateTextArmy(army) {
        this.txtArmySize.setText("Units: " + army.units.length);
        this.txtArmyVillage.setText("Village: " + army.village.name);
        this.txtArmyMoves.setText("Moves: " + army.moveAmount + "/" + army.moveMax);
        this.txtArmyFood.setText("Food: " + army.amountFood);
        this.txtArmyWood.setText("Wood: " + army.amountWood);
    }

    /**
     * Updates the army build buttons tinting
     * @param {Army} army 
     */
    updateUiArmyBuildButtons(army) {
        //TODO: remove hardcode. maybe to json file -> load singleton
        if (army.amountWood < 100)
            this.btnArmyBuildWallWood.setTint("0xff0000");

        this.updateUiArmyBuildDirectionButtons();
    }

    updateUiArmyBuildDirectionButtons() {
        this.btnArmyBuildEast.setTint("0x777777");
        this.btnArmyBuildNorth.setTint("0x777777");
        this.btnArmyBuildSouth.setTint("0x777777");
        this.btnArmyBuildWest.setTint("0x777777");

        if (this.selectedArmyBuildFunc != null) {
            //TODO: grey out non-buildable.
            this.btnArmyBuildEast.clearTint();
            this.btnArmyBuildNorth.clearTint();
            this.btnArmyBuildSouth.clearTint();
            this.btnArmyBuildWest.clearTint();
        }
    }

}