
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

        scene.scale.resize(800, 800);


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

    create(){

        this.uiArmyText = [];
        this.uiArmyButtons = [];
        this.uiArmyBuildButtons = [];
        
        //TODO: buttons have all clickedFunctions 
        /**
         * UI - army
         */
        //TODO: pull this out to a scene on top of another scene.

        let x = 20;
        let y = 20;

        this.txtArmySize = this.add.text(x, y)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, "#000000", 3);

        this.txtArmyVillage = this.add.text(x, y + 60)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, "#000000", 3);

        this.txtArmyMoves = this.add.text(x, y + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, "#000000", 3);

        this.txtArmyFood = this.add.text(x, y + 180)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, "#000000", 3);

        this.txtArmyWood = this.add.text(x, y + 240)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, "#000000", 3);

        //army buttons

        this.btnArmyGetUnits = this.add.sprite(x, y + 290, "btnArmyGetUnits")
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0)
            .on("pointerdown", this.gameScene.armyManager.armyGetUnits);

        this.btnArmyDisbandUnits = this.add.sprite(x, y + 430, "btnArmyDisbandUnits")
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0)
            .on("pointerdown", this.gameScene.armyManager.armyDisbandUnits);

        this.btnArmyGetFood = this.add.sprite(x, y + 570, "btnArmyGetFood")
            .setScrollFactor(0)
            .setInteractive()
            .setScale(.5)
            .setDepth(100)
            .setOrigin(0)
            .on("pointerdown", this.gameScene.armyManager.armyGetFood);

        this.btnArmyGetWood = this.add.sprite(x, y + 710, "btnArmyGetWood")
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0)
            .on("pointerdown", this.gameScene.armyManager.armyGetWood);

        this.btnArmyBuild = this.add.sprite(x, y + 850, "btnArmyBuild")
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0)
            .on("pointerdown", this.gameScene.armyManager.armyBuild);
        //TODO: clicked

        //TODO: alot of repeated code here and .setscrollfactor, etc
        this.uiArmyText.push(this.txtArmySize);
        this.uiArmyText.push(this.txtArmyVillage);
        this.uiArmyText.push(this.txtArmyMoves);
        this.uiArmyText.push(this.txtArmyFood);
        this.uiArmyText.push(this.txtArmyWood);
        this.uiArmyButtons.push(this.btnArmyGetUnits);
        this.uiArmyButtons.push(this.btnArmyDisbandUnits);
        this.uiArmyButtons.push(this.btnArmyGetFood);
        this.uiArmyButtons.push(this.btnArmyGetWood);
        this.uiArmyButtons.push(this.btnArmyBuild);

        this.btnArmyBuildCancel = this.add.sprite(x, y + 290, "btnArmyCancel")
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(0)
            .setDepth(100)
            .on("pointerdown", this.gameScene.armyManager.armyBuildCancel);

        this.btnArmyBuildWallWood = this.add.sprite(x, y + 430, "btnArmyBuildWallWood")
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0)
            .on("pointerdown", this.gameScene.clickedBuildWallWood);

        this.uiArmyBuildButtons.push(this.btnArmyBuildCancel);
        this.uiArmyBuildButtons.push(this.btnArmyBuildWallWood);

        this.btnArmyBuildEast = this.add.sprite(x + 420, y + 360, "btnArmyBuildEast")
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(0)
            .setDepth(100)
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.EAST);
            });

        this.btnArmyBuildNorth = this.add.sprite(x + 350, y + 290, "btnArmyBuildNorth")
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(0)
            .setDepth(100)
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.NORTH);
            });

        this.btnArmyBuildSouth = this.add.sprite(x + 350, y + 430, "btnArmyBuildSouth")
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(0)
            .setDepth(100)
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.SOUTH);
            });

        this.btnArmyBuildWest = this.add.sprite(x + 280, y + 360, "btnArmyBuildWest")
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(0)
            .setDepth(100)
            .on("pointerdown", function () {
                this.gameScene.scene.selectedArmyBuildFunc(Direction.WEST);
            });

        this.uiArmyBuildButtons.push(this.btnArmyBuildEast);
        this.uiArmyBuildButtons.push(this.btnArmyBuildNorth);
        this.uiArmyBuildButtons.push(this.btnArmyBuildSouth);
        this.uiArmyBuildButtons.push(this.btnArmyBuildWest);

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