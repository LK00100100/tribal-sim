import Phaser from "phaser";

import GameUtils from "../../utils/GameUtils";
import GameUtilsBuilding from "../../utils/GameUtilsBuilding";
import GameUtilsUi from "../../utils/GameUtilsUi";
// eslint-disable-next-line no-unused-vars
import Village from "../../buildings/villageBuildings/Village";
// eslint-disable-next-line no-unused-vars
import SceneGame from "../../SceneGame";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../../engine/GameEngine";


/**
 * Ui that displays a human-player's village information and actions.
 * 
 * Opens when the human-player selects his village.
 */
export default class HumanVillageInfoScene extends Phaser.Scene {

    /**
     * 
     * @param {SceneGame} gameScene 
     * @param {GameEngine} gameEngine 
     */
    constructor(gameScene, gameEngine) {
        super("HumanVillageInfoScene");    //has to be same as above"
        this.handle = "HumanVillageInfoScene";    //has to be same as above

        this.gameScene = gameScene;
        this.gameEngine = gameEngine;

        //ui elements
        this.uiVillageText = [];
        this.uiVillageButtons = [];
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
        let x, y;

        //set cam
        var zoomLevel = 0.5;
        this.cam = this.cameras.main.setZoom(zoomLevel);

        /**
         * UI - village
         */
        x = -350;
        y = -120;

        this.txtVillagePopulation = this.createUiTextHelper(x, y);
        this.txtVillageFood = this.createUiTextHelper(x, y + 60);
        this.txtVillageStone = this.createUiTextHelper(x, y + 120);
        this.txtVillageWood = this.createUiTextHelper(x, y + 180);
        
        this.uiVillageText.push(this.txtVillagePopulation);
        this.uiVillageText.push(this.txtVillageFood);
        this.uiVillageText.push(this.txtVillageStone);
        this.uiVillageText.push(this.txtVillageWood);

        this.btnCreateArmy = this.createUiButtonHelper(x, y + 300, "btnCreateArmy", this.clickedCreateArmyButton);
        this.btnBuildFarm = this.createUiButtonHelper(x, y + 440, "btnBuildFarm", this.clickedBuyFarm);
        this.btnBuildLumberMill = this.createUiButtonHelper(x, y + 580, "btnBuildLumberMill", this.clickedBuyLumberMill);
        this.btnBuildQuarry = this.createUiButtonHelper(x, y + 720, "btnBuildQuarry", this.clickedBuyQuarry);
        this.btnBuildHousing = this.createUiButtonHelper(x, y + 860, "btnBuildHousing", this.clickedBuyHousing);

        this.uiVillageButtons.push(this.btnCreateArmy);
        this.uiVillageButtons.push(this.btnBuildFarm);
        this.uiVillageButtons.push(this.btnBuildLumberMill);
        this.uiVillageButtons.push(this.btnBuildQuarry);
        this.uiVillageButtons.push(this.btnBuildHousing);

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
        let gameScene = this.gameScene;
        gameScene.selectedVillage.setTint("0xffff00");
        
        this.selectedBuyBuilding = null;

        //show village ui
        GameUtils.clearTintArray(this.uiVillageButtons);
        GameUtilsUi.showGameObjects(this.uiVillageText);
        GameUtilsUi.showGameObjects(this.uiVillageButtons);

        let village = gameScene.selectedVillage.data.get("data");
        this.updateUiVillageText(village);

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

    }

    /**
     * main village actions
     */

    clickedCreateArmyButton(pointer) {
        if (pointer.rightButtonDown())
            return;

        let gameScene = this.gameScene;
        let village = gameScene.selectedVillage.data.get("data");

        gameScene.board.unhighlightTiles(gameScene.possibleMoves);

        gameScene.armyManager.createArmyFromVillage(1, village);

        gameScene.updateUi();
    }

    //TODO: repeated code

    clickedBuyFarm(pointer) {
        if (pointer.rightButtonDown())
            return;

        this.deselectBuyBuilding();

        let buyBuilding = "Farm";
        this.btnBuildFarm.setTint("0x00ff00");

        this.preBuyBuilding(buyBuilding);
    }

    clickedBuyQuarry(pointer) {
        if (pointer.rightButtonDown())
            return;

        this.deselectBuyBuilding();

        let buyBuilding = "Quarry";
        this.btnBuildQuarry.setTint("0x00ff00");

        this.preBuyBuilding(buyBuilding);
    }

    clickedBuyLumberMill(pointer) {
        if (pointer.rightButtonDown())
            return;

        this.deselectBuyBuilding();

        let buyBuilding = "LumberMill";
        this.btnBuildLumberMill.setTint("0x00ff00");

        this.preBuyBuilding(buyBuilding);
    }

    clickedBuyHousing(pointer) {
        if (pointer.rightButtonDown())
            return;

        this.deselectBuyBuilding();

        let buyBuilding = "Housing";
        this.btnBuildHousing.setTint("0x00ff00");

        this.preBuyBuilding(buyBuilding);
    }

    /**
     * deselect the pre-buy-build phase
     */
    deselectBuyBuilding() {
        let gameScene = this.gameScene;

        GameUtils.clearTintArray(this.uiVillageButtons);

        gameScene.board.unhighlightTiles(gameScene.possibleMoves);
        gameScene.possibleMoves = null;

        this.selectedBuyBuilding = null;
    }

    //TODO: use building enum instead
    /**
     * Show the user build options
     * @param {String} buildingType 
     */
    preBuyBuilding(buildingType) {
        let gameScene = this.gameScene;

        gameScene.selectedBuyBuilding = buildingType;

        let village = gameScene.selectedVillage.data.get("data");

        //TODO: ensure enough resources from this specific building
        if (village.amountWood < 100) {
            console.log("not enough wood. need 100");
            return;
        }

        console.log("before: build a " + buildingType);

        gameScene.possibleMoves = gameScene.buildingManager.getVillageBuildings(village);
        gameScene.possibleMoves = gameScene.buildingManager.getBuildableNeighbors(gameScene.possibleMoves);

        gameScene.board.highlightTiles(gameScene.possibleMoves);
    }

    /**
     * 
     * @param {Village} village 
     */
    updateUiVillageText(village){
        //TODO: put this in some sort of village manager. updateUi should do no calcs

        let gameScene = this.gameScene;
        
        let coordinates = gameScene.buildingManager.getVillageBuildings(village);
        let buildingsData = gameScene.board.getBuildingsData(coordinates);
        let countsOfBuildings = GameUtilsBuilding.countBuildings(buildingsData);
        village.calculateIncome(countsOfBuildings);

        let populationGrowth = village.getPopulationGrowthDay(countsOfBuildings.countHousing);

        this.txtVillagePopulation.setText("Population: " + village.population + " (" + populationGrowth + ")");
        this.txtVillageFood.setText("Food: " + village.amountFood + " (" + village.incomeFood + ")");
        this.txtVillageStone.setText("Stone: " + village.amountStone + " (" + village.incomeStone + ")");
        this.txtVillageWood.setText("Wood: " + village.amountWood + " (" + village.incomeWood + ")");
    }

}