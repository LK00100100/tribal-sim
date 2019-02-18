
import GameUtils from './GameUtils.js';

import Board from './Board.js';
import Village from './buildings/Village.js';

import Army from './Army.js';
import Spearman from './army/Caveman.js';

export default class SceneGame extends Phaser.Scene {

    constructor() {
        //this = sys

        super('SceneGame');

        this.board = new Board();
        this.playerType = ["", "cavemen", "cavemen", "rats"];

        //TODO: temporary fix
        //TODO: handle collisions?
        this.buildings = [
            {
                row: 2, col: 2,
                name: "mad katz",
                type: "village",
                player: 1,
                population: 100,
                amountFood: 200,
                amountStone: 50,
                amountWood: 100
            },
            {
                row: 6, col: 6,
                name: "baddies",
                type: "village",
                player: 2,
                population: 100,
                amountFood: 200,
                amountStone: 50,
            },
            {
                row: 2, col: 6,
                name: "rabid rats",
                type: "village",
                player: 3,
                population: 100,
                amountFood: 200,
                amountStone: 50,
            }
        ];

        //for input and camera
        this.controls;

        this.gameOver = false;

        this.numPlayers;

        this.cashPlayers = [];
        //[player #] = array of army pieces
        this.armyPlayers = [];

        //ui
        this.uiVillage = [];
        this.txtCash = [];
        this.txtCashIncome = [];
        this.txtCashCost = [];

        this.groupTerrain;
        this.groupGrid;

        this.cam;

        //gameObjects
        this.selectedVillage;
        this.selectedArmy;

        this.selectedArmyPossibleMoves;

        this.uiArmy = [];
        this.textsVillageName = [];
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

        this.load.image('buildVillage', 'assets/build-village.png');
        this.load.image('buildRatCave', 'assets/build-rat-cave.png');

        //ui stuff
        this.load.image('btnEndTurn', 'assets/btn-end-turn.png');
        this.load.image('btnCreateArmy', 'assets/btn-create-army.png');

        //armies
        this.load.image('armyClubmen', 'assets/army-clubmen.png');
        this.load.image('armySpearmen', 'assets/army-spearmen.png');
    }

    create() {

        let x, y;
        let tempImage, tempSprite, tempText;

        //draw checkerboard
        this.add.image(0, 0, 'grid').setOrigin(0);

        /**
        * draw the board with images
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
                    throw "terrain type does not exist at: " + row + "," + col;
                }

                let currentTerrainName = this.board.terrainType[theBoard[row][col]];

                //tile of terrain
                tempSprite = this.add.sprite(x, y, currentTerrainName)
                    .setInteractive()
                    .setDataEnabled()
                    .on('pointerdown', this.terrainClicked);

                tempSprite.data.set("row", row);
                tempSprite.data.set("col", col);

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

        console.log("in create, 'this' is:" + typeof (this));

        this.buildings.forEach(building => {
            x = 256 + (building.col * 256);
            y = 256 + (building.row * 256);
            let name = building.name;
            let player = building.player;

            let imageName, data;
            switch (building.type) {
                case "village":
                    switch(this.playerType[building.player]){
                        case "cavemen":
                            imageName = "buildVillage";
                            break;
                        case "rats":
                            imageName = "buildRatCave";
                            break;
                        default:
                            throw "undefined building type for this race"
                    }
                    
                    data = new Village(building.row, building.col, x, y, player, name);
                    data.population = building.population;
                    data.amountFood = building.amountFood;
                    break;
                default:
                    throw "undefined building type loaded";
            }

            tempSprite = this.add.sprite(x, y, imageName)
                .setInteractive()
                .setDataEnabled()
                .on("pointerdown", this.villageClicked);

            this.board.boardBuildings[building.row][building.col] = tempSprite;

            tempSprite.data.set("row", building.row);
            tempSprite.data.set("col", building.col);
            tempSprite.data.set("data", data);

            tempText = this.add.text(x, y + 100)
                .setText(building.name)
                .setFontSize(38)
                .setAlign("center")
                .setOrigin(0.5)
                .setBackgroundColor("#000000");

            this.textsVillageName.push(tempText);

        });

        /**
        * draw UI
        */

        //UI cash
        //TODO: consolidate texts?
        //TODO: experiment with overlapping scenes
        y = -375
        this.txtCash[1] = this.add.text(-375, y)
            .setScrollFactor(0)
            .setFontSize(100)
            .setDepth(100)
            .setShadow(1, 1, '#000000', 2);

        this.txtCashIncome[1] = this.add.text(-375, y + 90)
            .setScrollFactor(0)
            .setFontSize(70)
            .setDepth(100)
            .setShadow(1, 1, '#000000', 2);

        this.txtCashCost[1] = this.add.text(-375, y + 150)
            .setScrollFactor(0)
            .setFontSize(70)
            .setDepth(100)
            .setShadow(1, 1, '#000000', 2);

        //button, end turn
        this.btnEndTurn = this.add.sprite(1050, 1100, 'btnEndTurn')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', this.endTurn);


        /**
         * UI - village
         */

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

        this.btnCreateArmy = this.add.sprite(-200, 200, 'btnCreateArmy')
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(100)
            .on('pointerdown', this.createArmy);


        this.uiVillage.push(this.txtVillagePopulation);
        this.uiVillage.push(this.txtVillageFood);
        this.uiVillage.push(this.btnCreateArmy);

        //UI - army

        y = -120;

        this.txtArmySize = this.add.text(-375, y)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyVillage = this.add.text(-375, y + 60)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyMoves = this.add.text(-375, y + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setDepth(100)
            .setShadow(3, 3, '#000000', 3);

        this.uiArmy.push(this.txtArmySize);
        this.uiArmy.push(this.txtArmyVillage);
        this.uiArmy.push(this.txtArmyMoves);

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
        * mouse
        */

        this.input.mouse.disableContextMenu();

        /**
         * init variables
         */

        //init variables
        this.numPlayers = 3;

        //init cash
        for (let i = 1; i <= this.numPlayers; i++) {
            this.cashPlayers[i] = 0;
            this.addCash(i, 200);
        }

        this.turnOfPlayer = 1;

        this.updateUI();
    }

    update(time, delta) {
        this.controls.update(delta);
    }

    updateUI() {

        //TODO: replace with icons later

        //cash
        this.txtCash[1].setText('$' + this.cashPlayers[1]);
        this.txtCashIncome[1].setText("income: $" + this.calculatePlayerIncome(1));
        this.txtCashCost[1].setText("cost: $" + this.calculatePlayerCosts(1));

        //village UI
        if (this.selectedVillage != null) {
            let village = this.selectedVillage.data.get("data");

            this.txtVillagePopulation.setText("Population: " + village.population);
            this.txtVillageFood.setText("Food: " + village.amountFood)
        }

    }

    //TODO: change the instance variables to deal with multiple players.
    addCash(player, cash) {

        this.cashPlayers[player] += cash;

        if (player != 1)
            return;

        this.updateUI();
    }


    //TODO: make it for every player
    endTurn(pointer) {

        let scene = this.scene;

        if (pointer.rightButtonDown())
            return;

        scene.deselectEverything();

        //disable all game controls
        scene.btnEndTurn.setTint(0xff0000);

        //TODO: fix this later
        for (let i = 2; i <= this.numPlayers; i++) {

            scene.turnOfPlayer = i;
            scene.calculateTurnPlayer(scene.turnOfPlayer);
        }

        //now player 1's turn
        scene.turnOfPlayer = 1;
        scene.replenishPhase(scene.turnOfPlayer);

        //TODO: disable button when needed
        scene.btnEndTurn.clearTint();
    }

    calculateTurnPlayer(player) {

        console.log("calculating turn: player: " + player);

        this.replenishPhase(player);

        //do something for player

        //TODO: replace this function with more functions
        if (this.turnOfPlayer == 3)
            logicRats();

        console.log("ending turn: player2...");
    }

    replenishPhase(playerNumber) {

        /**
         * money stuff
         */

        let income = this.calculatePlayerIncome(1) - this.calculatePlayerCosts(1);
        this.addCash(playerNumber, income);

        /**
         * army stuff
         */
        let armies = this.armyPlayers[playerNumber];

        if (armies != null) {
            armies.forEach(army => {
                army.moveAmount = army.moveMax;
            });
        }

        console.log("cash of " + playerNumber + ": " + this.cashPlayers[playerNumber]);
    }

    logicRats() {

    }

    villageClicked(pointer) {

        let scene = this.scene;

        console.log("village clicked");

        if (pointer.rightButtonDown()) {
            if (scene.selectedArmy == null)
                return;

            scene.moveArmy(scene.selectedArmy, this);
            return;
        }

        let village = this.data.get("data");

        scene.deselectEverything();

        if (village.player != 1)
            return;

        scene.selectedVillage = this;
        scene.selectedVillage.setTint("0xffff00");

        //TODO: do only on double click.
        scene.cam.pan(this.x, this.y, 500); //(x, y, duration)

        scene.updateUI();
        GameUtils.showGameObjects(scene.uiVillage);
    }

    createArmy(pointer) {

        if (pointer.rightButtonDown())
            return;

        let scene = this.scene;
        let selectedVillage = scene.selectedVillage.data.get("data");
        let row = selectedVillage.row;
        let col = selectedVillage.col;

        //space already occupied

        if (scene.board.boardUnits[row][col] != null) {
            console.log("already occupied");
            return;
        }

        //TODO: change this later
        if (scene.cashPlayers[1] < 100) {
            console.log("not enough $");
            return;
        }

        scene.addCash(1, -100);

        let armySprite = scene.add.sprite(selectedVillage.x, selectedVillage.y, 'armyClubmen')
            .setInteractive()
            .setDataEnabled()
            .on('pointerdown', scene.selectArmy);

        let army = new Army(row, col, 1, selectedVillage);
        army.moveAmount = 2;
        army.moveMax = 2;

        //TODO: change this later
        for (let i = 0; i < 10; i++) {
            let spearman = new Spearman();
            army.addUnit(spearman);
        }

        armySprite.data.set("data", army);

        //TODO: change later?
        if (scene.armyPlayers[1] == null)
            scene.armyPlayers[1] = [];

        scene.armyPlayers[1].push(army);

        scene.board.addArmy(row, col, army);

        scene.updateUI();

    }

    selectArmy(pointer) {

        if (pointer.rightButtonDown())
            return;

        let scene = this.scene;
        let army = this.data.get("data");

        scene.deselectEverything();

        scene.selectedArmy = this;

        //display army texts
        GameUtils.showGameObjects(scene.uiArmy);
        scene.updateTextArmy(army);

        //TODO: do only on double click.
        scene.cam.pan(this.x, this.y, 500);

        GameUtils.showGameObjects(scene.uiArmy);

        console.log("selecting army");

        this.setTint(0xffff00);

        scene.getPossibleArmyMoves(army);
        scene.highlightTiles(scene.selectedArmyPossibleMoves);

    }

    updateTextArmy(army) {
        this.txtArmySize.setText("Units: " + army.units.length);
        this.txtArmyVillage.setText("Village: " + army.village.name);
        this.txtArmyMoves.setText("Moves: " + army.moveAmount + "/" + army.moveMax);
    }

    deselectEverything() {

        GameUtils.hideGameObjects(this.uiVillage);
        GameUtils.hideGameObjects(this.uiArmy);

        if (this.selectedVillage != null) {
            this.selectedVillage.clearTint();
            this.selectedVillage = null;
        }

        if (this.selectedArmy != null) {
            this.selectedArmy.clearTint();
            this.unhighlightTiles(this.selectedArmyPossibleMoves);
        }
        this.selectedArmy = null;
    }

    //only used for moving armies.
    terrainClicked(pointer) {

        console.log("terrain clicked...");

        let scene = this.scene;

        if (pointer.leftButtonDown()) {
            this.scene.deselectEverything();
            return;
        }

        if (scene.selectedArmy == null)
            return;

        scene.moveArmy(scene.selectedArmy, this);

    }

    moveArmy(spriteArmy, squareTerrain) {

        let army = spriteArmy.data.get("data");

        let targetRow = squareTerrain.data.get("row");
        let targetCol = squareTerrain.data.get("col");

        console.log("terrain right clicked with army");

        //highlight allowed movement
        console.log("squareTerrain.x: " + squareTerrain.x);
        console.log("squareTerrain.y: " + squareTerrain.y);

        //move visually and internally (row, col);

        let cost = this.getMovementCost(targetRow, targetCol);

        if (cost > army.moveAmount)
            return;

        //remove army
        this.board.removeArmy(army.row, army.col);
        this.unhighlightTiles(this.selectedArmyPossibleMoves);

        army.moveAmount -= cost;
        army.row = targetRow;
        army.col = targetCol;

        this.updateTextArmy(army);

        //place army
        //TODO: dont make it a direct move.
        this.tweens.add({
            targets: this.selectedArmy,
            x: squareTerrain.x,
            y: squareTerrain.y,
            ease: 'Linear',
            duration: 500
        });

        this.getPossibleArmyMoves(army);
        this.highlightTiles(this.selectedArmyPossibleMoves);
        this.board.addArmy(targetRow, targetCol, army);

    }

    //TODO: almost working
    getPossibleArmyMoves(army) {

        let possibleMoves = [];

        let visited = new Set();

        let startPoint = {
            row: army.row,
            col: army.col,
            cost: 0
        }

        //up, down, left, right
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        let armyMoveAmount = army.moveAmount;

        let tempSquare;

        let queue = [];
        queue.push(startPoint);

        while (queue.length > 0) {

            let queueLength = queue.length;
            queue.sort();

            let smallestMove = queue[0].cost;

            //check around this level
            for (let x = 0; x < queueLength; x++) {
                tempSquare = queue.shift();

                let row = tempSquare.row;
                let col = tempSquare.col;
                let cost = tempSquare.cost;

                //too costly for now.
                if (cost > smallestMove) {
                    queue.push(tempSquare);
                    continue;
                }

                //check up, down, left, right
                for (let d = 0; d < directions.length; d++) {
                    let i = directions[d][0];
                    let j = directions[d][1];

                    let coordinate = (row + i) + "," + (col + j);

                    if (visited.has(coordinate))
                        continue;

                    visited.add(coordinate);

                    if (this.board.isWalkable(row + i, col + j)) {
                        let terrainCost = this.board.movementCost(row + i, col + j);

                        if (armyMoveAmount >= cost + terrainCost) {

                            tempSquare = {
                                row: row + i,
                                col: col + j,
                                cost: cost + terrainCost
                            };

                            possibleMoves.push(tempSquare);
                            queue.push(tempSquare);
                        }
                    }

                }

            }

        }

        this.selectedArmyPossibleMoves = possibleMoves;
    }

    //call getPossibleArmyMoves first
    getMovementCost(row, col) {

        let target = null;

        for (let i = 0; i < this.selectedArmyPossibleMoves.length; i++) {
            let move = this.selectedArmyPossibleMoves[i];

            if (move.row == row && move.col == col) {
                target = move;
                break;
            }
        };

        if (target == null) {
            console.log("not a possible move");
            return 9999;
        }

        return target.cost;

    }

    highlightTiles(tiles) {
        if (tiles == null)
            return;

        tiles.forEach(tile => {
            let row = tile.row;
            let col = tile.col;

            //village
            if (this.board.boardBuildings[row][col] != null) {
                let village = this.board.boardBuildings[row][col];

                if (village.data.get("data").player == 1)
                    this.board.boardTerrainSprites[row][col].setTint("0x00aaff");
                else
                    this.board.boardTerrainSprites[row][col].setTint("0xaa0000");
            }
            //plain terrain
            else {
                this.board.boardTerrainSprites[row][col].setTint("0x00aaff");
            }

        });
    }

    unhighlightTiles(tiles) {
        if (tiles == null)
            return;

        tiles.forEach(tile => {
            this.board.boardTerrainSprites[tile.row][tile.col].clearTint();
        });
    }

    calculatePlayerIncome(player) {

        //TODO: complete this
        return 10;
    }

    calculatePlayerCosts(player) {

        //TODO: complete this

        let totalCost = 0;

        if (this.armyPlayers[player] == null)
            return 0;

        this.armyPlayers[player].forEach(army => {
            totalCost += army.calculateCost();
        });

        return totalCost;

    }

    ratCaveClicked(pointer) {

        let scene = this.scene;

    }

}