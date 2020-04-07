import ArmyInfoScene from "./ui/scenes/ArmyInfoScene";
import HumanVillageInfoScene from "./ui/scenes/HumanVillageInfoScene";

import GameUtilsUi from "./utils/GameUtilsUi";

import Board from "./board/Board";
import TerrainObj from "./board/Terrain";
const { Terrain, TerrainSpriteName } = TerrainObj;

import Village from "./buildings/villageBuildings/Village";

import ArmyManager from "./army/ArmyManager";

import RaceObj from "./Race";
let { Race } = RaceObj;

import CatAi from "./ai/CatAi";
import CavemanAi from "./ai/CavemanAi";
import GorillaAi from "./ai/GorillaAi";
import MeerkatAi from "./ai/MeerkatAi";
import TigerAi from "./ai/TigerAi";
import RatsAi from "./ai/RatAi";

import BuildingManager from "./buildings/BuildingManager";

//phaser imports
import Phaser from "../node_modules/phaser/src/phaser";

// eslint-disable-next-line no-unused-vars
import Army from "./army/Army";
import GameEngine from "./engine/GameEngine";

/**
 * This scene draws out the board and players.
 * It calls other sub scenes such as UI elements when needed
 */
export default class SceneGame extends Phaser.Scene {

    constructor() {
        super("SceneGame");
        this.handle = "SceneGame";

        //TODO: separate scene from game info

        //TODO: singleton for gameengine
        this.gameEngine = new GameEngine(this);
        this.board = new Board();

        //TODO: read all this stuff from external source
        //1-indexed
        this.playerRace = [
            "", //no player
            Race.CAVEMAN,
            Race.CAVEMAN,
            Race.RAT,
            Race.RAT,
            Race.CAVEMAN,
            Race.GORILLA,
            Race.TIGER,
            Race.MEERKAT,
            Race.CAT,
            Race.CAVEMAN
        ];
        this.numPlayers = this.playerRace.length - 1;

        this.playerHuman = 1;   //this is you

        //TODO: temporary. do fix
        this.buildings = [
            {
                row: 5, col: 2,
                name: "mad katz",
                type: "village",
                player: 1,
                population: 20,
                amountFood: 1000,
                amountStone: 250,
                amountWood: 500
            },
            {
                row: 16, col: 10,
                name: "stompers",
                type: "village",
                player: 2,
                population: 10,
                amountFood: 100,
                amountStone: 25,
                amountWood: 50
            },
            {
                row: 6, col: 7,
                name: "rabid rats",
                type: "village",
                player: 3,
                population: 10,
                amountFood: 200,
                amountStone: 0,
                amountWood: 0
            },
            {
                row: 12, col: 1,
                name: "desert rats",
                type: "village",
                player: 4,
                population: 10,
                amountFood: 200,
                amountStone: 0,
                amountWood: 0
            },
            {
                row: 11, col: 7,
                name: "crazy rats",
                type: "village",
                player: 3,
                population: 10,
                amountFood: 200,
                amountStone: 0,
                amountWood: 0
            },
            {
                row: 10, col: 13,
                name: "clubbers",
                type: "village",
                player: 5,
                population: 10,
                amountFood: 200,
                amountStone: 0,
                amountWood: 0
            },
            {
                row: 16, col: 1,
                name: "grunters",
                type: "village",
                player: 10,
                population: 10,
                amountFood: 200,
                amountStone: 0,
                amountWood: 0
            }
        ];

        //for input and camera
        this.controls;
        this.defaultZoomLevel = 0.5;

        this.day;   //what day on earth it is. ex: Day 100

        this.gameOver = false;

        //[player #] = array of army pieces
        //sprites
        this.playerArmies = [];
        this.playerBuildings = [];
        for (let playerNum = 0; playerNum <= this.numPlayers; playerNum++) {
            this.playerArmies[playerNum] = [];
            this.playerBuildings[playerNum] = [];
        }

        this.playersAi = [];

        //ui for the human-player
        this.uiVillage = [];            //main village actions
        this.uiBuilding = [];           //main building actions
        this.uiArmyEnemy = [];          //options against enemy armies
        this.uiArmyEnemyBuilding = [];  //options against enemy buildings

        this.groupTerrain;
        this.groupGrid;

        this.cam;

        //Phaser sprites, human-player selected
        //TODO: data to be held in class: GameEngine.
        this.selectedVillage;
        this.selectedBuilding;  //TODO: consolidate this and selectedVillage?
        this.selectedArmy;

        this.selectedEnemyArmyCoordinates;     //{row, col}
        this.selectedArmyPossibleMoves;
        this.selectedVillageBuildings;

        //TODO: considate army and village moves
        this.possibleMoves;

        //TODO: move this into gameengine
        //managers
        this.buildingManager = new BuildingManager(this);
        this.armyManager = new ArmyManager(this);

        //sub-ui scenes
        this.alreadyOnScenes = new Set(); //unique handle strings.
        this.armyInfoScene;
        this.humanVillageInfoScene;
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

        /**
         * ui stuff
         */
        this.load.image("btnEndTurn", "assets/btn-end-turn.png");

        //ui, buildings
        this.load.image("btnBuildDestroy", "assets/btn-build-destroy.png");

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

        this.board.initBoard();
        console.log(this.board.boardTerrain);
        this.groupTerrain = this.add.group();
        this.groupGrid = this.add.group();
        let theBoard = this.board.boardTerrain;
        for (let row = 0; row < this.board.boardTerrain.length; row++) {
            y = topY + (row * 256);
            for (let col = 0; col < this.board.boardTerrain[0].length; col++) {
                x = topX + (col * 256);

                if (Terrain.getValue(theBoard[row][col])) {
                    throw "terrain type does not exist at: " + row + "," + col;
                }

                let currentTerrainName = TerrainSpriteName.getSpriteNameFromNumber(theBoard[row][col]);

                //tile of terrain
                tempSprite = this.add.sprite(x, y, currentTerrainName)
                    .setInteractive()
                    .setDepth(0)
                    .setDataEnabled()
                    .on("pointerdown", this.clickedTerrain);

                tempSprite.data.set("row", row);
                tempSprite.data.set("col", col);

                this.groupTerrain.add(tempSprite);
                this.board.boardTerrainSprites[row][col] = tempSprite;

                //draw grid
                tempImage = this.add.image(x, y, "tileGrid");
                this.groupGrid.add(tempImage);

            }
        }

        /**
        * draw buildings
        */
        this.buildings.forEach(building => {
            x = topX + (building.col * 256);
            y = topY + (building.row * 256);
            let name = building.name;
            let player = building.player;
            let row = building.row;
            let col = building.col;

            let imageName, data;
            let race = this.playerRace[building.player];

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

            this.buildingManager.addBuildingToBoard(row, col, tempSprite);

            this.playerBuildings[building.player].push(tempSprite);

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

            this.board.addText(row, col, tempText);

        });

        /**
        * draw UI
        */

        this.txtDay = this.createUiTextHelper(1180, 980)
            .setOrigin(1, 0); //right-to-left text;

        y = -375;

        //TODO: move to PlayerTimeScene
        //button, end turn
        this.btnEndTurn = this.createUiButtonHelper(1050, 1100, "btnEndTurn", this.clickedEndTurn);

        /**
         * placing units
         */
        //TODO: temporary, place gorillas
        let gorillaPlayerNumber = 6;
        this.armyManager.createArmyFromCoordinate(gorillaPlayerNumber, 3, 10, "Atomrilla");

        //TODO: temporary, place tigers
        let tigerPlayerNumber = 7;
        this.armyManager.createArmyFromCoordinate(tigerPlayerNumber, 6, 12, "Mad Katz");
        this.armyManager.createArmyFromCoordinate(tigerPlayerNumber, 14, 4, "Tree Katz");

        //TODO: temporary, place meerkats
        let meerkatPlayerNumber = 8;
        this.armyManager.createArmyFromCoordinate(meerkatPlayerNumber, 9, 3, "Timons");
        this.armyManager.createArmyFromCoordinate(meerkatPlayerNumber, 13, 5, "Pumbas");

        //TODO: temporary, place cats
        let catPlayerNumber = 9;
        this.armyManager.createArmyFromCoordinate(catPlayerNumber, 4, 13, "Krazy Kats");

        /**
         * UI - building
         */
        //TODO: put in own scene
        y = -120;

        this.txtBuildName = this.createUiTextHelper(-375, y);
        this.btnBuildDestroy = this.createUiButtonHelper(-200, y + 140, "btnBuildDestroy", this.buildingManager.clickedDestroyBuilding);

        this.uiBuilding.push(this.txtBuildName);
        this.uiBuilding.push(this.btnBuildDestroy);

        /**
         * ui enemy elements
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

        this.btnArmyEnemyAttack = this.createUiButtonHelper(-200, y + 360, "btnArmyAttack", this.armyManager.armyAttack)
            .setOrigin(1, 0); //right-to-left text

        this.btnArmyEnemyCancel = this.createUiButtonHelper(-200, y + 500, "btnArmyCancel", this.armyManager.armyAttackCancel)
            .setOrigin(1, 0); //right-to-left text

        this.uiArmyEnemy.push(this.txtArmyEnemyName);
        this.uiArmyEnemy.push(this.txtArmyEnemyUnits);
        this.uiArmyEnemy.push(this.txtArmyEnemyAttackBase);
        this.uiArmyEnemy.push(this.txtArmyEnemyDefenseBase);
        this.uiArmyEnemy.push(this.btnArmyEnemyAttack);
        this.uiArmyEnemy.push(this.btnArmyEnemyCancel);

        /**
        * ui enemy elements building
        */

        //TODO: set to previous default after separating attack building/unit
        x = 1150;
        y = -160;

        this.txtEnemyBuildingPlayer = this.createUiTextHelper(x, y)
            .setOrigin(1, 0); //right-to-left text

        this.txtEnemyBuildingHealth = this.createUiTextHelper(x, y + 300)
            .setOrigin(1, 0); //right-to-left text

        this.btnEnemyBuildingAttack = this.createUiButtonHelper(-200, y + 660, "btnArmyAttackBuilding", this.armyManager.clickedArmyAttackBuilding)
            .setOrigin(1, 0); //right-to-left text

        this.uiArmyEnemyBuilding.push(this.txtEnemyBuildingPlayer);
        this.uiArmyEnemyBuilding.push(this.txtEnemyBuildingHealth);
        this.uiArmyEnemyBuilding.push(this.btnEnemyBuildingAttack);

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

        /**
         * init variables
         */

        //init variables
        this.turnOfPlayer = 1;
        this.day = 1;

        //TODO: initial inputs
        //TODO: make dynamic-y
        this.playersAi[2] = new CavemanAi(this, 2);
        this.playersAi[3] = new RatsAi(this, 3);
        this.playersAi[4] = new RatsAi(this, 4);
        this.playersAi[5] = new CavemanAi(this, 5);
        this.playersAi[6] = new GorillaAi(this, 6);
        this.playersAi[7] = new TigerAi(this, 7);
        this.playersAi[8] = new MeerkatAi(this, 8);
        this.playersAi[9] = new CatAi(this, 9);
        this.playersAi[10] = new CavemanAi(this, 10);


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
        //TODO: replace with icons later
        this.txtDay.setText("Day: " + this.day);

        //building UI
        if (this.selectedBuilding != null) {
            GameUtilsUi.showGameObjects(this.uiBuilding);

            let building = this.selectedBuilding.getData("data");
            this.txtBuildName.setText(building.name);
        }

        //army UI
        if (this.selectedArmy != null) {
            this.armyInfoScene = new ArmyInfoScene(this);
            this.turnOnSubSceneOnce(this.armyInfoScene);
        }

    }

    /**
     * Turns on a brand new scene. makes sure there's only one scene.
     * @param {Phaser.Scene} subScene
     */
    turnOnSubSceneOnce(subScene) {
        let handle = subScene.handle;
        let gameScene = subScene.gameScene;

        if(gameScene.alreadyOnScenes.has(handle))
            return;

        let autoStart = true;
        try {
            gameScene.scene.add(handle, subScene, autoStart);
            gameScene.alreadyOnScenes.add(handle);
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

        if(!this.alreadyOnScenes.has(handle))
            return;

        this.scene.remove(handle);
        this.alreadyOnScenes.delete(handle);
    }

    clickedEndTurn(pointer) {
        if (pointer != null && pointer.rightButtonDown())
            return;

        this.gameEngine.endTurn();
    }

    //TODO: move to BuildingManager later
    clickedVillage(pointer) {
        let gameScene = this.scene;

        //already selected? center camera
        if (gameScene.selectedVillage == this) {
            gameScene.cam.pan(this.x, this.y, 500); //(x, y, duration) 
        }

        console.log("village clicked");
        console.log("pop: " + this.getData("data").population);
        console.log("food: " + this.getData("data").amountFood);
        console.log("stone: " + this.getData("data").amountStone);
        console.log("wood: " + this.getData("data").amountWood);

        //attacking
        if (pointer.rightButtonDown()) {
            if (gameScene.selectedArmy == null)
                return;

            gameScene.processArmyAction(this);
            return;
        }

        let village = this.data.get("data");

        if (village.player != 1)
            return;

        gameScene.deselectEverything();
        gameScene.selectedVillage = this;

        //turn on human village info screen
        if (gameScene.humanVillageInfoScene == null) {
            gameScene.humanVillageInfoScene = new HumanVillageInfoScene(gameScene);
            gameScene.turnOnSubSceneOnce(gameScene.humanVillageInfoScene);
        }

        gameScene.updateUi();
    }

    /**
     * populates and shows enemy army data
     * @param {Number} row
     * @param {Number} col
     */
    showUiArmyEnemy(row, col) {

        let enemyArmy = this.board.boardUnits[row][col].getData("data");

        this.txtArmyEnemyUnits.setText(enemyArmy.units.length + " :Enemy Units");
        this.txtArmyEnemyName.setText(enemyArmy.name);
        this.txtArmyEnemyAttackBase.setText(enemyArmy.calculateAttackBase() + " :Attack Base");
        this.txtArmyEnemyDefenseBase.setText(enemyArmy.calculateDefenseBase() + " :Defense Base");

        GameUtilsUi.showGameObjects(this.uiArmyEnemy);

        //TODO: if not enough moves left, highlight attack red
    }

    /**
     * deselects: army, enemy army and/or the selected building
     */
    deselectEverything() {
        GameUtilsUi.hideGameObjects(this.uiVillage);
        GameUtilsUi.hideGameObjects(this.uiBuilding);
        GameUtilsUi.hideGameObjects(this.uiArmyEnemy);
        GameUtilsUi.hideGameObjects(this.uiArmyEnemyBuilding);

        if (this.selectedBuyBuilding != null) {
            this.board.unhighlightTiles(this.possibleMoves);
            this.selectedBuyBuilding = null;
        }

        if (this.selectedVillage != null) {
            this.selectedVillage.clearTint();
            this.selectedVillage = null;

            this.turnOffSubScene(this.humanVillageInfoScene);
            this.humanVillageInfoScene = null;
        }

        if (this.selectedBuilding != null) {
            this.selectedBuilding.clearTint();
            this.selectedBuilding = null;
        }

        if (this.selectedArmy != null) {
            this.selectedArmy.clearTint();
            this.board.unhighlightTiles(this.selectedArmyPossibleMoves);
            this.selectedArmy = null;

            this.turnOffSubScene(this.armyInfoScene);
            this.armyInfoScene = null;
        }

        if (this.possibleMoves != null) {
            this.board.unhighlightTiles(this.possibleMoves);
            this.possibleMoves = null;
        }
    }

    //only used for moving armies.
    clickedTerrain(pointer) {
        console.log("terrain clicked...");

        let scene = this.scene;

        if (pointer.leftButtonDown()) {

            //place building
            if (scene.selectedBuyBuilding != null) {
                //TODO: move building stuff
                scene.buildingManager.placeBuildingPlayer(pointer, this);
                return;
            }

            this.scene.deselectEverything();
            return;
        }

        if (pointer.rightButtonDown()) {
            //process action of army of player 1
            if (scene.selectedArmy != null) {
                scene.processArmyAction(this);
            }
        }

    }

    clickedBuilding(pointer) {
        //this = selectedBuildingSprite
        let gameScene = this.scene;

        console.log("building clicked");

        let building = this.getData("data");
        console.log(building.health);

        //select
        if (pointer.leftButtonDown()) {
            gameScene.deselectEverything();

            if (building.player == gameScene.playerHuman)
                gameScene.selectedBuilding = this;

            gameScene.updateUi();
        }

        //commit 
        if (pointer.rightButtonDown()) {
            if (gameScene.selectedArmy == null)
                return;

            gameScene.processArmyAction(this);
            return;
        }

    }


    /**
     * updates and shows UI
     * @param {*} buildingData 
     */
    showUiBuildingEnemy(buildingData) {
        let scene = this;

        scene.txtEnemyBuildingPlayer.setText(buildingData.player + " :Building, Player");
        scene.txtEnemyBuildingHealth.setText(buildingData.health + " :Building, Health");
        GameUtilsUi.showGameObjects(scene.uiArmyEnemyBuilding);
    }

}