
import Phaser from "phaser";

import GameUtils from "../../utils/GameUtils";
import GameUtilsBuilding from "../../utils/GameUtilsBuilding";
import GameUtilsUi from "../../utils/GameUtilsUi";


/**
 * Ui that displays a human-player's village information and actions
 */
export default class HumanVillageInfoScene extends Phaser.Scene {

    constructor(gameScene) {
        super("HumanVillageInfoScene");
        this.handle = "HumanVillageInfoScene";

        this.gameScene = gameScene;

        this.selectedBuyBuilding;

        //ui elements
        this.uiVillage = [];
    }

    preload() {
        //ui, village
        this.load.image("btnCreateArmy", "assets/btn-create-army.png");
        this.load.image("btnBuildFarm", "assets/btn-build-farm.png");
        this.load.image("btnBuildQuarry", "assets/btn-build-quarry.png");
        this.load.image("btnBuildLumberMill", "assets/btn-build-lumber-mill.png");
        this.load.image("btnBuildHousing", "assets/btn-build-housing.png");
    }

    create() {
        let gameScene = this.gameScene;

        let y;

        //set cam
        var zoomLevel = 0.5;
        this.cam = this.cameras.main.setZoom(zoomLevel);

        /**
         * UI - village
         */
        y = -120;

        this.txtVillagePopulation = this.createUiTextHelper(-375, y);
        this.txtVillageStone = this.createUiTextHelper(-375, y + 120);
        this.txtVillageWood = this.createUiTextHelper(-375, y + 180);

        this.btnCreateArmy = this.createUiButtonHelper(-200, y + 300, "btnCreateArmy", gameScene.armyManager.createArmyButton);
        this.btnBuildFarm = this.createUiButtonHelper(-200, y + 440, "btnBuildFarm")
            .on("pointerdown", function (pointer) {
                gameScene.buildingManager.clickedBuyBuilding(pointer, this, "Farm");
            }, this);

        this.btnBuildLumberMill = this.createUiButtonHelper(-200, y + 580, "btnBuildLumberMill")
            .on("pointerdown", function (pointer) {
                gameScene.buildingManager.clickedBuyBuilding(pointer, this, "LumberMill");
            }, this);

        this.btnBuildQuarry = this.createUiButtonHelper(-200, y + 720, "btnBuildQuarry")
            .on("pointerdown", function (pointer) {
                gameScene.buildingManager.clickedBuyBuilding(pointer, this, "Quarry");
            }, this);

        this.btnBuildHousing = this.createUiButtonHelper(-200, y + 860, "btnBuildHousing")
            .on("pointerdown", function (pointer) {
                gameScene.buildingManager.clickedBuyBuilding(pointer, this, "Housing");
            }, this);

        this.uiVillage.push(this.txtVillagePopulation);
        this.uiVillage.push(this.txtVillageFood);
        this.uiVillage.push(this.txtVillageStone);
        this.uiVillage.push(this.txtVillageWood);
        this.uiVillage.push(this.btnCreateArmy);
        this.uiVillage.push(this.btnBuildFarm);
        this.uiVillage.push(this.btnBuildLumberMill);
        this.uiVillage.push(this.btnBuildQuarry);
        this.uiVillage.push(this.btnBuildHousing);
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

    resetUi(){
        let gameScene = this.gameScene;
        gameScene.selectedVillage.setTint("0xffff00");

        //show village buttons
        GameUtils.clearTintArray(this.uiVillage);
        GameUtilsUi.showGameObjects(this.uiVillage);

        let village = gameScene.selectedVillage.data.get("data");

        //TODO: put this in some sort of village manager. updateUi should do no calcs
        let coordinates = gameScene.buildingManager.getVillageBuildings(village);
        let buildingsData = gameScene.board.getBuildingsData(coordinates);
        let countsOfBuildings = GameUtilsBuilding.countBuildings(buildingsData);
        village.calculateIncome(countsOfBuildings);

        let populationGrowth = village.getPopulationGrowthDay(countsOfBuildings.countHousing);

        this.txtVillagePopulation.setText("Population: " + village.population + " (" + populationGrowth + ")");
        this.txtVillageFood.setText("Food: " + village.amountFood + " (" + village.incomeFood + ")");
        this.txtVillageStone.setText("Stone: " + village.amountStone + " (" + village.incomeStone + ")");
        this.txtVillageWood.setText("Wood: " + village.amountWood + " (" + village.incomeWood + ")");

        //depopulation warning 
        this.btnCreateArmy.clearTint();
        if (village.population == 10)
            this.btnCreateArmy.setTint("0xffff00");

        //TODO: set red tint variable in some global config file
        //TODO: change this later. more dynamic
        if (village.amountWood < 100) {
            this.btnBuildFarm.setTint("0xff0000");
            this.btnBuildHousing.setTint("0xff0000");
            this.btnBuildLumberMill.setTint("0xff0000");
            this.btnBuildQuarry.setTint("0xff0000");
        }

        if (this.selectedBuyBuilding != null) {
            this.selectedBuyBuilding = null;
            this.board.unhighlightTiles(this.possibleMoves);
        }
    }

    /**
     * main village actions
     */
     
    clickedBuyBuilding(pointer, gameSprite, buildingType) {
        let scene = gameSprite.scene;

        if (pointer.rightButtonDown())
            return;


        let village = scene.selectedVillage.data.get("data");

        //TODO: ensure enough resources from this specific building
        if (village.amountWood < 100) {
            console.log("not enough wood. need 100");
            return;
        }

        //deselect
        if (gameSprite.isTinted) {
            gameSprite.clearTint();
            scene.board.unhighlightTiles(scene.possibleMoves);
            scene.possibleMoves = null;
            scene.selectedBuyBuilding = null;
            return;
        }

        console.log("before: build a " + buildingType);

        scene.selectedBuyBuilding = buildingType;
        GameUtils.clearTintArray(scene.uiVillage);
        gameSprite.setTint("0x00ff00");

        scene.possibleMoves = scene.buildingManager.getVillageBuildings(village);
        scene.possibleMoves = scene.buildingManager.getBuildableNeighbors(scene.possibleMoves);

        scene.board.highlightTiles(scene.possibleMoves);
    }

}