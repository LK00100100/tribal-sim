//phaser imports
import Phaser from "../node_modules/phaser/src/phaser";

//sub scenes
import EnemyArmyInfoScene from "./ui/scenes/EnemyArmyInfoScene";
import EnemyBuildingInfoScene from "./ui/scenes/EnemyBuildingInfoScene";
import HumanArmyInfoScene from "./ui/scenes/HumanArmyInfoScene";
import HumanBuildingInfoScene from "./ui/scenes/HumanBuildingInfoScene";
import HumanVillageInfoScene from "./ui/scenes/HumanVillageInfoScene";
import TimeInfoScene from "./ui/scenes/TimeInfoScene";

import TerrainObj from "./board/Terrain";
const { Terrain, TerrainSpriteName } = TerrainObj;

import Village from "./buildings/villageBuildings/Village";

// eslint-disable-next-line no-unused-vars
import GameEngine from "./engine/GameEngine";

import RaceObj from "./Race";
let { Race } = RaceObj;

/**
 * This scene draws out the board and players.
 * It calls other sub scenes such as UI elements when needed
 */
export default class SceneGame extends Phaser.Scene {

    /**
     * @param {GameEngine} gameEngine 
     */
    constructor(gameEngine) {
        super("SceneGame");
        this.handle = "SceneGame";

        this.gameEngine = gameEngine;
        gameEngine.setGameScene(this);

        //for input and camera
        this.controls;
        this.cam;
        this.defaultZoomLevel = 0.5;

        //TODO: use this later to disable the grid
        this.groupTerrain;
        this.groupGrid;

        //sub-ui scenes. 
        //note: don't forget to add new stuff to the init function in create()
        this.launchedScenes = new Set();
        this.humanArmyInfoScene = new HumanArmyInfoScene(this, this.gameEngine);
        this.humanVillageInfoScene = new HumanVillageInfoScene(this, this.gameEngine);
        this.humanBuildingInfoScene = new HumanBuildingInfoScene(this, this.gameEngine);

        this.timeInfoScene = new TimeInfoScene(this, this.gameEngine);

        this.enemyArmyInfoScene = new EnemyArmyInfoScene(this, this.gameEngine);
        this.enemyBuildingInfoScene = new EnemyBuildingInfoScene(this, this.gameEngine);
    }

    /**
     * Phaser function
     * preload assets that need downloading
     */
    preload() {
        //TODO: make a ton of enums for the keys

        //terrain
        this.load.image(TerrainSpriteName.GRASS, "assets/tile-grass.png");
        this.load.image(TerrainSpriteName.OCEAN, "assets/tile-ocean.png");
        this.load.image(TerrainSpriteName.HILL, "assets/tile-hill.png");
        this.load.image(TerrainSpriteName.DESERT, "assets/tile-desert.png");
        this.load.image(TerrainSpriteName.FOREST, "assets/tile-forest.png");
        this.load.image("tileGrid", "assets/tile-grid.png");

        //buildings
        this.load.image("buildVillage", "assets/build-village.png");
        this.load.image("buildRatCave", "assets/build-rat-cave.png");
        this.load.image("buildFarm", "assets/build-farm.png");
        this.load.image("buildLumberMill", "assets/build-lumber-mill.png");
        this.load.image("buildQuarry", "assets/build-quarry.png");
        this.load.image("buildHousing", "assets/build-housing.png");

        //fortification
        this.load.image("fortWallWoodHorizontal", "assets/walls/wood/fort-wall-wood-horizontal.png");
        this.load.image("fortWallWoodVertical", "assets/walls/wood/fort-wall-wood-vertical.png");

        //armies
        this.load.image("armyCat", "assets/army-cat.png");
        this.load.image("armyCaveman", "assets/army-caveman.png");
        this.load.image("armyGorilla", "assets/army-gorilla.png");
        this.load.image("armyMeerkat", "assets/army-meerkat.png");
        this.load.image("armyRat", "assets/army-rat.png");
        this.load.image("armyTiger", "assets/army-tiger.png");
    }

    /**
     * Phaser initialization
     */
    create() {
        let gameEngine = this.gameEngine;
        let board = gameEngine.board;
        /**
         * pre init
         */
        let x, y;
        let tempImage, tempSprite, tempText;
        /**
        * draw the terrain
        */
        //the top left corner of the drawn board
        let topY = 512;
        let topX = 512;

        board.initBoard();
        console.log(gameEngine.board.boardTerrain);
        this.groupTerrain = this.add.group();
        this.groupGrid = this.add.group();
        let terrainBoard = board.boardTerrain;
        for (let row = 0; row < gameEngine.board.boardTerrain.length; row++) {
            y = topY + (row * 256);
            for (let col = 0; col < gameEngine.board.boardTerrain[0].length; col++) {
                x = topX + (col * 256);

                if (Terrain.getValue(terrainBoard[row][col])) {
                    throw "terrain type does not exist at: " + row + "," + col;
                }

                let currentTerrainName = TerrainSpriteName.getSpriteNameFromNumber(terrainBoard[row][col]);

                //tile of terrain
                tempSprite = this.add.sprite(x, y, currentTerrainName)
                    .setInteractive()
                    .setDepth(0)
                    .setDataEnabled()
                    .on("pointerdown", this.clickedTerrain);

                tempSprite.data.set("row", row);
                tempSprite.data.set("col", col);

                this.groupTerrain.add(tempSprite);
                gameEngine.board.boardTerrainSprites[row][col] = tempSprite;

                //draw grid
                tempImage = this.add.image(x, y, "tileGrid");
                this.groupGrid.add(tempImage);
            }
        }

        /**
        * draw buildings
        */
        gameEngine.buildings.forEach(building => {
            x = topX + (building.col * 256);
            y = topY + (building.row * 256);
            let name = building.name;
            let player = building.player;
            let row = building.row;
            let col = building.col;

            let imageName, data;
            let race = gameEngine.playerRace[building.player];

            //TODO: pull this out to a building factory
            switch (building.type) {
            case "village":
                switch (race) {
                case Race.CAVEMAN:
                    imageName = "buildVillage";
                    break;
                case Race.RAT:
                    imageName = "buildRatCave";
                    break;
                default:
                    throw "undefined building type for this race: " + race;
                }

                data = new Village(row, col, player, name);
                data.population = building.population;
                data.amountFood = building.amountFood;
                data.amountStone = building.amountStone;
                data.amountWood = building.amountWood;
                data.race = race;

                break;
            default:
                throw "undefined building type loaded";
            }

            tempSprite = this.add.sprite(x, y, imageName)
                .setInteractive()
                .setDataEnabled()
                .on("pointerdown", this.clickedVillage);

            gameEngine.buildingManager.addBuildingToBoard(row, col, tempSprite);

            gameEngine.playerBuildings[building.player].push(tempSprite);

            tempSprite.data.set("row", row);
            tempSprite.data.set("col", col);
            tempSprite.data.set("data", data);

            tempText = this.add.text(x, y + 100)
                .setText(building.name)
                .setFontSize(38)
                .setAlign("center")
                .setOrigin(0.5)
                .setDepth(1)
                .setBackgroundColor("#000000");

            board.addText(row, col, tempText);
        });

        /**
        * draw UI
        */

        //hide some ui elements
        this.deselectEverything();

        /**
        * Camera stuff
        */
        //let cursors = this.input.keyboard.createCursorKeys(); //cursors.right
        let keys = this.input.keyboard.addKeys("W,S,A,D");
        var controlConfig = {
            camera: this.cameras.main,
            left: keys.A,
            right: keys.D,
            up: keys.W,
            down: keys.S,
            //TODO: this causes UI to shrink/expand. i dont know how to fix this now
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 1.00,
            drag: 0.01,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, 5000, 6000).setZoom(this.defaultZoomLevel);

        /**
         * keyboard
         */
        this.input.keyboard.on("keydown_ESC", function () {
            console.log("esc!");
            this.scene.deselectEverything();
        });

        this.input.keyboard.on("keydown_ENTER", function () {
            console.log("enter key!");
            this.gameEngine.endTurn();
        }, this);

        this.input.keyboard.on("keydown_SHIFT", function () {
            console.log("shift key!");
            this.gameEngine.endTurn();
        }, this);

        this.input.keyboard.on("keydown_R", function () {
            console.log("r!");
            let gameScene = this.scene;
            gameScene.cam.setZoom(gameScene.defaultZoomLevel);
        });

        /**
        * mouse
        */
        //so we can right click without that box appearing
        this.input.mouse.disableContextMenu();

        //TODO: move later
        /**
         * placing units
         */
        //TODO: temporary, place gorillas
        let gorillaPlayerNumber = 6;
        this.gameEngine.armyManager.createArmyFromCoordinate(gorillaPlayerNumber, 3, 10, "Atomrilla");

        //TODO: temporary, place tigers
        let tigerPlayerNumber = 7;
        this.gameEngine.armyManager.createArmyFromCoordinate(tigerPlayerNumber, 6, 12, "Mad Katz");
        this.gameEngine.armyManager.createArmyFromCoordinate(tigerPlayerNumber, 14, 4, "Tree Katz");

        //TODO: temporary, place meerkats
        let meerkatPlayerNumber = 8;
        this.gameEngine.armyManager.createArmyFromCoordinate(meerkatPlayerNumber, 9, 3, "Timons");
        this.gameEngine.armyManager.createArmyFromCoordinate(meerkatPlayerNumber, 13, 5, "Pumbas");

        //TODO: temporary, place cats
        let catPlayerNumber = 9;
        this.gameEngine.armyManager.createArmyFromCoordinate(catPlayerNumber, 4, 13, "Krazy Kats");

        /**
         * init sub-scenes (ui)
         */
        this.initSubScene(this.timeInfoScene);
        this.initSubScene(this.humanVillageInfoScene);
        this.initSubScene(this.humanBuildingInfoScene);
        this.initSubScene(this.humanArmyInfoScene);
        this.initSubScene(this.enemyArmyInfoScene);
        this.initSubScene(this.enemyBuildingInfoScene);

        /**
         * turn on sub scenes
         */
        this.turnOnSubSceneOnce(this.timeInfoScene);

        this.updateUi();

        //TODO:center to player 1 center. remove? make more dynamic?
        this.cam.pan(1000, 2000, 1000);
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
     * one time init of a scene which is subordinate to this gameScene. Does not turn the scene on.
     * This is required before you turn the scene on/off.
     * @param {Phaser.Scene} subScene 
     */
    initSubScene(subScene) {
        this.scene.add(subScene.handle, subScene, false);
    }

    //@Override
    update(time, delta) {
        this.controls.update(delta);
    }

    //TODO: maybe refactor? split up to function
    //TODO: split up to another class, UI manager?
    /**
     * updates and shows relevant UI
     */
    updateUi() {
        let gameEngine = this.gameEngine;

        this.timeInfoScene.updateUi();

        //TODO: turn this on directly when needed
        //turn on army UI
        if (gameEngine.selectedArmy != null) {
            this.turnOnSubSceneOnce(this.humanArmyInfoScene);
        }

    }

    /**
     * Turns on a brand new scene. makes sure there's only one scene.
     * @param {Phaser.Scene} subScene
     */
    turnOnSubSceneOnce(subScene) {
        let handle = subScene.handle;
        let gameScene = subScene.gameScene;

        try {
            if (gameScene.launchedScenes.has(handle)) {
                subScene.updateUi();
                gameScene.scene.wake(handle);
            }
            //first time being on
            else {
                gameScene.scene.launch(handle);
                gameScene.launchedScenes.add(handle);
            }
        }
        catch (err) {
            console.log("shouldn't be here... can't turn on scene: " + err);
        }
    }

    /**
     * Turns off a subScene from the gameScene
     * @param {Phaser.Scene} scene 
     */
    turnOffSubScene(scene) {
        let handle = scene.handle;

        try {
            this.scene.sleep(handle);
        }
        catch (err) {
            console.log(err);
        }
    }

    //TODO: move to BuildingManager later or "SpriteClickActions"
    clickedVillage(pointer) {
        /** @type {SceneGame} */
        let gameScene = this.scene;
        let gameEngine = gameScene.gameEngine;

        //already selected? center camera
        if (gameEngine.selectedVillage == this) {
            gameScene.cam.pan(this.x, this.y, 500); //(x, y, duration) 
        }

        console.log("village clicked");
        console.log("pop: " + this.getData("data").population);
        console.log("food: " + this.getData("data").amountFood);
        console.log("stone: " + this.getData("data").amountStone);
        console.log("wood: " + this.getData("data").amountWood);

        //attacking
        if (pointer.rightButtonDown()) {
            if (gameEngine.selectedArmy == null)
                return;

            gameEngine.armyManager.processHumanArmyAction(this);
            return;
        }

        let village = this.data.get("data");

        //enemy village. view info
        if (village.player != 1) {
            gameScene.deselectEverything();
            gameEngine.selectedEnemyBuilding = this;
            gameScene.turnOnSubSceneOnce(gameScene.enemyBuildingInfoScene);
            return;
        }

        gameScene.deselectEverything();
        gameEngine.selectedVillage = this;

        //turn on human village info screen
        gameScene.turnOnSubSceneOnce(gameScene.humanVillageInfoScene);

        gameScene.updateUi();
    }

    /**
     * turns off all subscenes.
     * deselects: army, enemy army, selections, etc.
     */
    deselectEverything() {
        let gameEngine = this.gameEngine;

        if (gameEngine.selectedBuyBuilding != null) {
            gameEngine.board.unhighlightTiles(gameEngine.possibleMoves);
            gameEngine.selectedBuyBuilding = null;
        }

        if (gameEngine.selectedVillage != null) {
            gameEngine.selectedVillage.clearTint();
            gameEngine.selectedVillage = null;

            this.turnOffSubScene(this.humanVillageInfoScene);
        }

        if (gameEngine.selectedBuilding != null) {
            gameEngine.selectedBuilding.clearTint();
            gameEngine.selectedBuilding = null;

            this.turnOffSubScene(this.humanBuildingInfoScene);
        }

        if (gameEngine.selectedArmy != null) {
            gameEngine.selectedArmy.clearTint();
            gameEngine.board.unhighlightTiles(gameEngine.selectedArmyPossibleMoves);
            gameEngine.selectedArmy = null;

            this.turnOffSubScene(this.humanArmyInfoScene);
        }

        if (gameEngine.possibleMoves != null) {
            gameEngine.board.unhighlightTiles(gameEngine.possibleMoves);
            gameEngine.possibleMoves = null;
        }

        /**
         * enemy-related info ui
         */

        if (gameEngine.selectedEnemyArmy != null) {
            this.turnOffSubScene(this.enemyArmyInfoScene);
            gameEngine.selectedEnemyArmy = null;
        }

        if (gameEngine.selectedEnemyBuilding != null) {
            this.turnOffSubScene(this.enemyBuildingInfoScene);
            gameEngine.selectedEnemyBuilding = null;
        }
    }

    /**
     * used for moving armies or placing buildings
     * @param {Phaser.Pointer} pointer 
     */
    clickedTerrain(pointer) {
        let terrainSprite = this;
        /** @type {SceneGame} */
        let gameScene = this.scene;
        let gameEngine = gameScene.gameEngine;

        console.log("terrain clicked...");

        if (pointer.leftButtonDown()) {

            //place building
            if (gameEngine.selectedBuyBuilding != null) {
                //TODO: move building stuff
                gameEngine.buildingManager.placeBuildingPlayer(pointer, terrainSprite);
                return;
            }

            gameScene.deselectEverything();
            return;
        }

        if (pointer.rightButtonDown()) {
            //process action of army of human-player
            if (gameEngine.selectedArmy != null) {
                gameEngine.armyManager.processHumanArmyAction(this);
            }
        }

    }

    /**
     * clicked a non-village building
     * @param {*} pointer 
     */
    clickedBuilding(pointer) {
        //this = selectedBuildingSprite
        /** @type {SceneGame} */
        let gameScene = this.scene;
        let gameEngine = gameScene.gameEngine;

        console.log("building clicked");

        let building = this.getData("data");
        console.log(building.health);

        //select
        if (pointer.leftButtonDown()) {
            gameScene.deselectEverything();

            //clicked our building
            if (building.player == gameEngine.playerHuman) {
                gameScene.deselectEverything();
                gameEngine.selectedBuilding = this;
                gameScene.turnOnSubSceneOnce(gameScene.humanBuildingInfoScene);
            }
            //clicked enemy building
            else {
                gameEngine.selectedEnemyBuilding = this;

                gameScene.turnOnSubSceneOnce(gameScene.enemyBuildingInfoScene);
            }

            gameScene.updateUi();
        }

        //commit 
        if (pointer.rightButtonDown()) {
            if (gameEngine.selectedArmy == null)
                return;

            gameEngine.armyManager.processHumanArmyAction(this);
            return;
        }

    }

}