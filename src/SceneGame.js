
import GameUtils from './utils/GameUtils.js';
import Board from './board/Board.js';
import Village from './buildings/village_buildings/Village.js';

import ArmyManager from './army/ArmyManager.js';

import Races from './Races.js';

import RatsAi from './ai/RatsAi.js';
import CavemenAi from './ai/CavemenAi.js';

export default class SceneGame extends Phaser.Scene {

    constructor() {
        //this = sys

        super('SceneGame');

        this.board = new Board();
        this.playerRace = ['', 'cavemen', 'cavemen', 'rats'];

        this.playerHuman = 1;

        //TODO: temporary. do fix
        this.buildings = [
            {
                row: 2, col: 2,
                name: 'mad katz',
                type: 'village',
                player: 1,
                population: 20,
                amountFood: 1000,
                amountStone: 250,
                amountWood: 500
            },
            {
                row: 10, col: 8,
                name: 'baddies',
                type: 'village',
                player: 2,
                population: 10,
                amountFood: 100,
                amountStone: 25,
                amountWood: 50
            },
            {
                row: 3, col: 7,
                name: 'rabid rats',
                type: 'village',
                player: 3,
                population: 10,
                amountFood: 200,
                amountStone: 0,
                amountWood: 0
            }
        ];

        //for input and camera
        this.controls;

        this.day;

        this.gameOver = false;

        this.numPlayers;

        //[player #] = array of army pieces
        //sprites
        this.playerArmies = [];
        this.playerBuildings = [];

        //ui
        this.uiVillage = [];

        this.groupTerrain;
        this.groupGrid;

        this.cam;

        //sprites
        this.selectedVillage;
        this.selectedArmy;
        this.selectedBuyBuilding;

        this.selectedEnemyArmyCoordinates;     //{row, col}
        this.selectedArmyPossibleMoves;
        this.selectedVillageBuildings;
        //TODO: considate army and village moves
        this.possibleMoves;

        this.uiArmy = [];
        this.uiArmyEnemy = [];
        this.uiArmyEnemyBuilding = [];

        this.armyManager;
    }

    preload() {
        //terrain
        this.load.image('grid', 'assets/uv-grid-4096-ian-maclachlan.png');
        this.load.image(this.board.terrainType[0], 'assets/tile-grass.png');
        this.load.image(this.board.terrainType[1], 'assets/tile-ocean.png');
        this.load.image(this.board.terrainType[2], 'assets/tile-hill.png');
        this.load.image(this.board.terrainType[3], 'assets/tile-desert.png');
        this.load.image(this.board.terrainType[4], 'assets/tile-forest.png');
        this.load.image('tileGrid', 'assets/tile-grid.png');

        //buildings
        this.load.image('buildVillage', 'assets/build-village.png');
        this.load.image('buildRatCave', 'assets/build-rat-cave.png');
        this.load.image('buildFarm', 'assets/build-farm.png');
        this.load.image('buildLumberMill', 'assets/build-lumber-mill.png');
        this.load.image('buildQuarry', 'assets/build-quarry.png');
        this.load.image('buildHousing', 'assets/build-housing.png');

        /**
         * ui stuff
         */
        this.load.image('btnEndTurn', 'assets/btn-end-turn.png');

        //ui, village
        this.load.image('btnCreateArmy', 'assets/btn-create-army.png');
        this.load.image('btnBuildFarm', 'assets/btn-build-farm.png');
        this.load.image('btnBuildQuarry', 'assets/btn-build-quarry.png');
        this.load.image('btnBuildLumberMill', 'assets/btn-build-lumber-mill.png');
        this.load.image('btnBuildHousing', 'assets/btn-build-housing.png');

        //ui, army
        this.load.image('btnArmyGetUnits', 'assets/btn-army-get-units.png');
        this.load.image('btnArmyGetFood', 'assets/btn-army-get-food.png');
        this.load.image('btnArmyAttack', 'assets/btn-army-attack.png');
        this.load.image('btnArmyAttackBuilding', 'assets/btn-army-attack-building.png');
        this.load.image('btnArmyCancel', 'assets/btn-army-cancel.png');

        //armies
        this.load.image('armyCaveman', 'assets/army-caveman.png');
        this.load.image('armyRat', 'assets/army-rat.png');

    }

    create() {

        /**
         * pre init
         */
        //TODO: make this dynamic-y
        this.numPlayers = 3;

        this.playerBuildings = [];
        this.playerArmies = [];
        for (let playerNum = 0; playerNum <= this.numPlayers; playerNum++) {
            this.playerBuildings[playerNum] = [];
            this.playerArmies[playerNum] = [];
        }

        this.playersAi = [];

        this.armyManager = new ArmyManager(this);

        let x, y;
        let tempImage, tempSprite, tempText;

        //draw checkerboard
        this.add.image(0, 0, 'grid').setOrigin(0);

        /**
        * draw the terrain
        */
        this.board.initBoard();
        console.log(this.board.boardTerrain);
        this.groupTerrain = this.add.group();
        this.groupGrid = this.add.group();
        let theBoard = this.board.boardTerrain;
        for (let row = 0; row < this.board.boardTerrain.length; row++) {
            y = 256 + (row * 256);
            for (let col = 0; col < this.board.boardTerrain[0].length; col++) {
                x = 256 + (col * 256);

                if (this.board.terrainType[theBoard[row][col]] == undefined) {
                    throw 'terrain type does not exist at: ' + row + ',' + col;
                }

                let currentTerrainName = this.board.terrainType[theBoard[row][col]];

                //tile of terrain
                tempSprite = this.add.sprite(x, y, currentTerrainName)
                    .setInteractive()
                    .setDepth(0)
                    .setDataEnabled()
                    .on('pointerdown', this.clickedTerrain);

                tempSprite.data.set('row', row);
                tempSprite.data.set('col', col);

                this.groupTerrain.add(tempSprite);
                this.board.boardTerrainSprites[row][col] = tempSprite;

                //draw grid
                tempImage = this.add.image(x, y, 'tileGrid');
                this.groupGrid.add(tempImage);

            }
        }

        /**
        * draw buildings
        */

        this.buildings.forEach(building => {
            x = 256 + (building.col * 256);
            y = 256 + (building.row * 256);
            let name = building.name;
            let player = building.player;
            let row = building.row;
            let col = building.col;

            let imageName, data;
            let race = this.playerRace[building.player];

            //TODO: pull this out to a building factory
            switch (building.type) {
                case 'village':
                    switch (race) {
                        case Races.CAVEMEN:
                            imageName = 'buildVillage';
                            break;
                        case Races.RATS:
                            imageName = 'buildRatCave';
                            break;
                        default:
                            throw 'undefined building type for this race: ' + race
                    }

                    data = new Village(row, col, x, y, player, name);
                    data.population = building.population;
                    data.amountFood = building.amountFood;
                    data.amountStone = building.amountStone;
                    data.amountWood = building.amountWood;
                    data.race = race;

                    break;
                default:
                    throw 'undefined building type loaded';
            }

            tempSprite = this.add.sprite(x, y, imageName)
                .setInteractive()
                .setDataEnabled()
                .on('pointerdown', this.clickedVillage);

            this.board.addBuilding(row, col, tempSprite);

            this.playerBuildings[building.player].push(tempSprite);

            tempSprite.data.set('row', row);
            tempSprite.data.set('col', col);
            tempSprite.data.set('data', data);

            tempText = this.add.text(x, y + 100)
                .setText(building.name)
                .setFontSize(38)
                .setAlign('center')
                .setOrigin(0.5)
                .setDepth(1)
                .setBackgroundColor('#000000');

            this.board.addText(row, col, tempText);

        });

        /**
        * draw UI
        */
        this.txtDay = this.add.text(1180, 980)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setOrigin(1, 0) //right-to-left text
            .setShadow(1, 1, '#000000', 2);

        //TODO: consolidate texts?
        //TODO: experiment with overlapping scenes
        y = -375;

        //button, end turn
        this.btnEndTurn = this.add.sprite(1050, 1100, 'btnEndTurn')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', this.clickedEndTurn);

        /**
         * UI - village
         */
        //TODO: pull this out to a scene on top of another scene.

        y = -120;

        this.txtVillagePopulation = this.add.text(-375, y)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtVillageFood = this.add.text(-375, y + 60)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtVillageStone = this.add.text(-375, y + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtVillageWood = this.add.text(-375, y + 180)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.btnCreateArmy = this.add.sprite(-200, y + 300, 'btnCreateArmy')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', this.armyManager.createArmyButton);

        this.btnBuildFarm = this.add.sprite(-200, y + 440, 'btnBuildFarm')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', function (pointer) {
                this.scene.board.buyBuilding(pointer, this, 'Farm');
            });

        this.btnBuildLumberMill = this.add.sprite(-200, y + 580, 'btnBuildLumberMill')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', function (pointer) {
                this.scene.board.buyBuilding(pointer, this, 'LumberMill');
            });

        this.btnBuildQuarry = this.add.sprite(-200, y + 720, 'btnBuildQuarry')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', function (pointer) {
                this.scene.board.buyBuilding(pointer, this, 'Quarry');
            });

        this.btnBuildHousing = this.add.sprite(-200, y + 860, 'btnBuildHousing')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', function (pointer) {
                this.scene.board.buyBuilding(pointer, this, 'Housing');
            });

        this.uiVillage.push(this.txtVillagePopulation);
        this.uiVillage.push(this.txtVillageFood);
        this.uiVillage.push(this.txtVillageStone);
        this.uiVillage.push(this.txtVillageWood);
        this.uiVillage.push(this.btnCreateArmy);
        this.uiVillage.push(this.btnBuildFarm);
        this.uiVillage.push(this.btnBuildLumberMill);
        this.uiVillage.push(this.btnBuildQuarry);
        this.uiVillage.push(this.btnBuildHousing);

        /**
         * UI - army
         */
        //TODO: pull this out to a scene on top of another scene.

        x = -375;
        y = -120;

        this.txtArmySize = this.add.text(x, y)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyVillage = this.add.text(x, y + 60)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyMoves = this.add.text(x, y + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyFood = this.add.text(x, y + 180)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.btnArmyGetUnits = this.add.sprite(x, y + 280, 'btnArmyGetUnits')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0)
            .on('pointerdown', this.armyManager.armyGetUnits);

        this.btnArmyGetFood = this.add.sprite(x, y + 420, 'btnArmyGetFood')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .setOrigin(0)
            .on('pointerdown', this.armyManager.armyGetFood);

        this.uiArmy.push(this.txtArmySize);
        this.uiArmy.push(this.txtArmyVillage);
        this.uiArmy.push(this.txtArmyMoves);
        this.uiArmy.push(this.txtArmyFood);
        this.uiArmy.push(this.btnArmyGetUnits);
        this.uiArmy.push(this.btnArmyGetFood);

        /**
         * ui enemy elements
         */

        x = 1150;
        y = -160;

        this.txtArmyEnemyName = this.add.text(x, y + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setOrigin(1, 0) //right-to-left text
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyEnemyUnits = this.add.text(x, y + 180)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setOrigin(1, 0) //right-to-left text
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyEnemyAttackBase = this.add.text(x, y + 240)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setOrigin(1, 0) //right-to-left text
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyEnemyDefenseBase = this.add.text(x, y + 300)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setOrigin(1, 0) //right-to-left text
            .setShadow(3, 3, '#000000', 3);

        this.btnArmyEnemyAttack = this.add.sprite(x, y + 360, 'btnArmyAttack')
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(1, 0) //right-to-left text
            .setDepth(100)
            .on('pointerdown', this.armyManager.armyAttack);

        this.btnArmyEnemyCancel = this.add.sprite(x, y + 500, 'btnArmyCancel')
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(1, 0) //right-to-left text
            .setDepth(100)
            .on('pointerdown', this.armyManager.armyAttackCancel);

        this.uiArmyEnemy.push(this.txtArmyEnemyName);
        this.uiArmyEnemy.push(this.txtArmyEnemyUnits);
        this.uiArmyEnemy.push(this.txtArmyEnemyAttackBase);
        this.uiArmyEnemy.push(this.txtArmyEnemyDefenseBase);
        this.uiArmyEnemy.push(this.btnArmyEnemyAttack);
        this.uiArmyEnemy.push(this.btnArmyEnemyCancel);

        /**
        * ui enemy elements building
        */

        x = 1150;
        y = -160;

        this.txtEnemyBuildingPlayer = this.add.text(x, y + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setOrigin(1, 0) //right-to-left text
            .setShadow(3, 3, '#000000', 3);

        this.txtEnemyBuildingHealth = this.add.text(x, y + 180)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setOrigin(1, 0) //right-to-left text
            .setShadow(3, 3, '#000000', 3);

        //TODO: redo naming
        this.btnEnemyBuildingAttack = this.add.sprite(x, y + 240, 'btnArmyAttackBuilding')
            .setScrollFactor(0)
            .setInteractive()
            .setOrigin(1, 0) //right-to-left text
            .setDepth(100)
            .on('pointerdown', this.armyManager.clickedArmyAttackBuilding);

        this.uiArmyEnemyBuilding.push(this.txtEnemyBuildingPlayer);
        this.uiArmyEnemyBuilding.push(this.txtEnemyBuildingHealth);
        this.uiArmyEnemyBuilding.push(this.btnEnemyBuildingAttack);

        //hide some ui elements
        this.deselectEverything();

        /**
        * Camera stuff
        */
        let cursors = this.input.keyboard.createCursorKeys();
        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            //TODO: this causes UI to shrink/expand. i dont know how to fix this now
            //zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            //zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 1.00,
            drag: 0.01,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.cam = this.cameras.main;
        var zoomLevel = 0.5;
        this.cam.setBounds(0, 0, 4096, 4096).setZoom(zoomLevel);

        /**
         * keyboard
         */
        this.input.keyboard.on('keydown_ESC', function (event) {
            console.log("esc!");
            this.scene.deselectEverything();
        });

        this.input.keyboard.on('keydown_ENTER', function (event) {
            console.log("enter key!");
            this.scene.endTurn(this.scene);
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

        this.playerBuildings;

        //TODO: make dynamic-y
        this.playersAi[2] = new CavemenAi(this);
        this.playersAi[3] = new RatsAi(this, 3);

        this.updateUI();
    }

    update(time, delta) {
        this.controls.update(delta);
    }

    /**
     * updates and shows relevant UI
     */
    updateUI() {
        let scene = this;

        //TODO: replace with icons later
        this.txtDay.setText('Day: ' + scene.day);

        //village UI
        if (scene.selectedVillage != null) {
            let village = scene.selectedVillage.data.get('data');

            //TODO: put this in some sort of village manager. updateUi should do no calcs
            let coordinates = scene.board.getVillageBuildings(village);
            let buildingsData = scene.board.getBuildingsData(coordinates);
            let countsOfBuildings = scene.board.countBuildings(buildingsData);
            village.calculateIncome(countsOfBuildings);

            let populationGrowth = village.getPopulationGrowthDay(countsOfBuildings.countHousing);

            scene.txtVillagePopulation.setText('Population: ' + village.population + ' (' + populationGrowth + ')');
            scene.txtVillageFood.setText('Food: ' + village.amountFood + ' (' + village.incomeFood + ')');
            scene.txtVillageStone.setText('Stone: ' + village.amountStone + ' (' + village.incomeStone + ')');
            scene.txtVillageWood.setText('Wood: ' + village.amountWood + ' (' + village.incomeWood + ')');

            //depopulation warning 
            scene.btnCreateArmy.clearTint();
            if (village.population == 10)
                scene.btnCreateArmy.setTint('0xffff00');
        }

        //army UI
        if (scene.selectedArmy != null) {
            let army = scene.selectedArmy.data.get('data');
            let row = army.row;
            let col = army.col;

            scene.updateTextArmy(army);

            //display army texts
            GameUtils.showGameObjects(scene.uiArmy);

            scene.showArmyButtons(army);

            //if you're standing on an enemy building
            GameUtils.hideGameObjects(scene.uiArmyEnemyBuilding);
            let building = scene.board.getBuilding(row, col);
            if (building != null) {
                let buildingData = building.getData("data");
                if (buildingData.player != scene.playerHuman) {
                    scene.showUiBuildingEnemy(buildingData);
                }
            }
        }

    }

    clickedEndTurn(pointer) {

        if (pointer != null && pointer.rightButtonDown())
            return;

        this.scene.endTurn(this.scene);

    }

    //TODO: make it for every player
    endTurn(scene) {

        //TODO: lock it
        //disable all game controls
        scene.btnEndTurn.setTint(0xff0000);

        if (scene.selectedArmy != null) {
            scene.board.unhighlightTiles(scene.selectedArmyPossibleMoves)
            scene.selectedArmyPossibleMoves = null;
        }

        scene.postTurnPhase(scene.turnOfPlayer);

        //TODO: fix this later
        for (let i = 2; i <= scene.numPlayers; i++) {
            scene.turnOfPlayer = i;
            scene.calculateTurnAiPlayer(scene.turnOfPlayer);
        }

        //TODO: disable button when needed
        scene.day++;

        //now player 1's turn
        scene.turnOfPlayer = 1;
        scene.preTurnPhase(scene.turnOfPlayer);

        if (scene.selectedArmy != null)
            scene.showPossibleArmyMoves(scene.selectedArmy.data.get('data'));

        scene.btnEndTurn.clearTint();

        console.log('===================================');
        console.log('\nstart of your turn: ');
        scene.updateUI();
    }

    /**
     * AI calculations
     * @param {*} player 
     */
    calculateTurnAiPlayer(player) {

        console.log('calculating turn: player: ' + player);

        this.preTurnPhase(player);

        let ai = this.playersAi[player];

        //TODO: replace this function with more functions
        if (this.turnOfPlayer == 3) {
            console.log('rats doing rat stuff...');

            ai.calculateTurn();
        }

        this.postTurnPhase(player);

        console.log('ending turn: player2...');
    }

    //replenishment
    preTurnPhase(playerNumber) {

        /**
         * army stuff
         */
        let armies = this.playerArmies[playerNumber];

        if (armies != null) {
            armies.forEach(army => {
                army = army.data.get('data');
                army.moveAmount = army.moveMax;
            });
        }

        /**
         * village stuff
         */

        let buildings = this.playerBuildings[playerNumber];

        buildings.forEach(building => {
            let data = building.data.get('data');

            if (data instanceof Village) {
                let coordinates = this.board.getVillageBuildings(data);
                let buildingsData = this.board.getBuildingsData(coordinates);
                let countsOfBuildings = this.board.countBuildings(buildingsData);

                data.calculateIncome(countsOfBuildings);
                data.calculateDay(countsOfBuildings);
            }
        });

    }

    postTurnPhase(playerNumber) {
        /**
         * army stuff
         */
        let armies = this.playerArmies[playerNumber];

        if (armies != null) {
            armies.forEach((army) => {
                army = army.data.get('data');

                army.calculateCostDay();

                //killed through attrition
                if (army.size() == 0) {
                    this.armyManager.destroyArmy(army);
                }
            });
        }

        if (this.selectedArmy == null && this.selectedVillage == null) {
            this.deselectEverything();
        }

    }

    clickedVillage(pointer) {

        //TODO: add unit attacking

        let scene = this.scene;

        if (scene.selectedVillage == this) {
            scene.cam.pan(this.x, this.y, 500); //(x, y, duration) 
        }

        console.log('village clicked');

        if (pointer.rightButtonDown()) {
            if (scene.selectedArmy == null)
                return;

            scene.processArmyAction(this);
            return;
        }

        let village = this.data.get('data');

        scene.deselectEverything();

        if (village.player != 1)
            return;

        scene.selectedVillage = this;
        scene.selectedVillage.setTint('0xffff00');

        //show village buttons
        GameUtils.clearTintArray(scene.uiVillage);
        GameUtils.showGameObjects(scene.uiVillage);

        scene.updateUI();

    }

    //TODO: remove? refactor?
    showPossibleArmyMoves(armyData) {
        let possibleMoves = this.board.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

        this.selectedArmyPossibleMoves = possibleMoves;

        this.board.highlightTiles(this.selectedArmyPossibleMoves);
    }

    /**
     * populates and shows enemy army data
     */
    showUiArmyEnemy(row, col) {

        let enemyArmy = this.board.boardUnits[row][col].getData("data");

        this.txtArmyEnemyUnits.setText(enemyArmy.units.length + " :Enemy Units");
        this.txtArmyEnemyName.setText(enemyArmy.name);
        this.txtArmyEnemyAttackBase.setText(enemyArmy.calculateAttackBase() + " :Attack Base");
        this.txtArmyEnemyDefenseBase.setText(enemyArmy.calculateDefenseBase() + " :Defense Base");

        GameUtils.showGameObjects(this.uiArmyEnemy);

        //TODO: if not enough moves left, highlight attack red
    }


    updateTextArmy(army) {
        //TODO: refactor and move
        this.txtArmySize.setText('Units: ' + army.units.length);
        this.txtArmyVillage.setText('Village: ' + army.village.name);
        this.txtArmyMoves.setText('Moves: ' + army.moveAmount + '/' + army.moveMax);
        this.txtArmyFood.setText('Food: ' + army.amountFood);
    }

    /**
     * deselects: army, enemy army and/or the selected building
     */
    deselectEverything() {

        GameUtils.hideGameObjects(this.uiVillage);
        GameUtils.hideGameObjects(this.uiArmy);
        GameUtils.hideGameObjects(this.uiArmyEnemy);
        GameUtils.hideGameObjects(this.uiArmyEnemyBuilding);

        if (this.selectedVillage != null) {
            this.selectedVillage.clearTint();
            this.selectedVillage = null;
        }

        if (this.selectedArmy != null) {
            this.selectedArmy.clearTint();
            this.board.unhighlightTiles(this.selectedArmyPossibleMoves);
            this.selectedArmy = null;
        }

        if (this.possibleMoves != null) {
            this.board.unhighlightTiles(this.possibleMoves);
            this.possibleMoves = null;
        }
    }

    //only used for moving armies.
    clickedTerrain(pointer) {

        console.log('terrain clicked...');

        let scene = this.scene;

        if (pointer.leftButtonDown()) {
            this.scene.deselectEverything();
            return;
        }

        if (pointer.rightButtonDown()) {
            //place building
            if (scene.selectedBuyBuilding != null) {
                scene.board.placeBuilding(pointer, this);
                return
            }

            //process action of army of player 1
            if (scene.selectedArmy != null) {
                scene.processArmyAction(this);
            }
        }

    }

    clickedRatCave(pointer) {

        let scene = this.scene;
        console.log("clicked rat cave");

    }

    clickedBuilding(pointer) {
        console.log('building clicked');

        let scene = this.scene;
        let building = this.getData("data");
        console.log(building.health);

        if (pointer.leftButtonDown()) {
            scene.deselectEverything();
        }

        if (pointer.rightButtonDown()) {
            if (scene.selectedArmy == null)
                return;

            scene.processArmyAction(this);
            return;
        }

    }

    /**
     * process army action such as move to targetSprite
     * @param {*} targetSprite building or terrain sprite
     */
    processArmyAction(targetSprite) {

        let scene = this;
        let targetRow = targetSprite.data.get("row");
        let targetCol = targetSprite.data.get("col");

        if (scene.selectedArmy == null)
            return;

        let armySprite = scene.selectedArmy;

        let playerOwner = scene.board.getTileOwnership(targetRow, targetCol);
        let selectedArmyRow = armySprite.data.get("data").row;
        let selectedArmyCol = armySprite.data.get("data").col;

        //empty terrain
        if (playerOwner == 0) {
            scene.armyManager.moveArmyPlayer(armySprite, targetSprite);
        }
        //enemy terrain
        else {
            //if adjacent, show attack info screen
            if (GameUtils.areAdjacent(selectedArmyRow, selectedArmyCol, targetRow, targetCol)) {
                console.log("attack!");

                scene.selectedEnemyArmyCoordinates = { row: targetRow, col: targetCol };
                scene.showUiArmyEnemy(targetRow, targetCol);
                scene.cam.pan(armySprite.x, armySprite.y, 500);
            }
            //move closer
            else {
                console.log("too far to attack! moving closer!");
                scene.board.unhighlightTiles(scene.selectedArmyPossibleMoves);

                scene.armyManager.moveArmyCloser(armySprite, targetSprite);

                scene.selectedArmyPossibleMoves = scene.board.getPossibleMovesArmy(armySprite);
                scene.board.highlightTiles(scene.selectedArmyPossibleMoves);
            }

        }

        return;

    }

    showArmyButtons(armyData) {

        let row = armyData.row;
        let col = armyData.col;

        let buildingSprite = this.board.boardBuildings[row][col];

        //on-top-of-village buttons
        //TODO: be able to replenish in friendly villages through trade.
        this.btnArmyGetFood.visible = false;
        this.btnArmyGetUnits.visible = false;
        if (buildingSprite != null) {
            let buildingData = buildingSprite.data.get('data');

            if (buildingData.player == armyData.player) {
                this.btnArmyGetFood.visible = true;
                this.btnArmyGetUnits.visible = true;

                /**
                 * adequate resources check
                 */
                this.btnArmyGetFood.clearTint();
                if (buildingData.village.amountFood < 10)
                    this.btnArmyGetFood.setTint('0xff0000');
                else if (buildingData.village.amountFood == 10)
                    this.btnArmyGetFood.setTint('0xffff00');

                this.btnArmyGetUnits.clearTint();
                if (buildingData.village.population < 10)
                    this.btnArmyGetUnits.setTint('0xff0000');
                else if (buildingData.village.population == 10)
                    this.btnArmyGetUnits.setTint('0xffff00');
            }

        }

    }

    /**
     * updates and shows UI
     * @param {*} buildingData 
     */
    showUiBuildingEnemy(buildingData) {
        let scene = this;

        scene.txtEnemyBuildingPlayer.setText(buildingData.player + " :Player");
        scene.txtEnemyBuildingHealth.setText(buildingData.health + " :Health");
        GameUtils.showGameObjects(scene.uiArmyEnemyBuilding);
    }
}