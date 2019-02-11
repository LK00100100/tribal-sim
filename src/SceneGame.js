
import GameUtils from './GameUtils.js';

import Board from './Board.js';
import Village from './Village.js';
import Army from './Army.js';
import Spearman from './army/Spearman.js';

export default class SceneGame extends Phaser.Scene {

    constructor() {
        //this = sys

        super('SceneGame');

        this.board = new Board();

        this.villageP1 = [{ row: 2, col: 2, name: "mad katz" }];

        //for input and camera
        this.controls;

        this.gameOver = false;

        this.cashPlayers = [];
        //[player #] = array of army pieces
        this.armyPlayers = [];

        //ui
        this.buttonsVillage = [];
        this.txtCashPlayers = [];

        this.groupTerrain;
        this.groupGrid;

        this.cam;

        //gameObjects
        this.selectedVillage;
        this.selectedArmy;

        this.selectedArmyPossibleMoves;

        this.textsArmy = [];
        this.textsVillageName = [];
    }

    preload() {
        this.load.image('grid', 'assets/uv-grid-4096-ian-maclachlan.png');
        this.load.image('tileGrass', 'assets/tile-grass.png');
        this.load.image('tileOcean', 'assets/tile-ocean.png');
        this.load.image('tileGrid', 'assets/tile-grid.png');

        this.load.image('buildVillage', 'assets/build-village.png');

        //ui stuff
        this.load.image('btnEndTurn', 'assets/btn-end-turn.png');
        this.load.image('btnCreateArmy', 'assets/btn-create-army.png');

        //armies
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
            x = 256 + (row * 256);
            for (let col = 0; col < this.board.boardTerrain[0].length; col++) {
                y = 256 + (col * 256);

                switch (theBoard[row][col]) {
                    //tile grass
                    case 0:
                        tempSprite = this.add.sprite(x, y, 'tileGrass')
                            .setInteractive()
                            .setDataEnabled()
                            .on('pointerdown', this.terrainClicked);

                        break;

                    //tile ocean
                    case 1:
                        tempSprite = this.add.sprite(x, y, 'tileOcean')
                            .setInteractive()
                            .setDataEnabled()
                            .on('pointerdown', this.terrainClicked);

                        break;

                    default:
                        console.log("can't load board square at: ", row, col);
                        throw Exception();
                        break;
                }

                tempSprite.data.set("row", row);
                tempSprite.data.set("col", col);

                this.groupTerrain.add(tempSprite);
                this.board.boardSprites[row][col] = tempSprite;

                //draw grid
                tempImage = this.add.image(x, y, 'tileGrid');
                this.groupGrid.add(tempImage);

            }
        }

        /**
        * draw villages
        */

        console.log(typeof (this));

        this.villageP1.forEach(village => {
            x = 256 + (village.row * 256);
            y = 256 + (village.col * 256);
            let name = village.name;

            tempSprite = this.add.sprite(x, y, 'buildVillage')
                .setInteractive()
                .setDataEnabled()
                .on("pointerdown", this.villageClicked);

            village = new Village(village.row, village.col, x, y, 1, name);

            tempSprite.data.set("data", village);

            tempText = this.add.text(x, y + 100)
                .setText(village.name)
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
        this.txtCashPlayers[1] = this.add.text(-375, -375)
            .setText('$' + this.cashP1)
            .setScrollFactor(0)
            .setFontSize(100)
            .setShadow(1, 1, '#000000', 2);

        //button, end turn
        this.btnEndTurn = this.add.sprite(1050, 1100, 'btnEndTurn')
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerdown', this.endTurn);

        //UI - village

        this.btnCreateArmy = this.add.sprite(-200, 200, 'btnCreateArmy')
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerdown', this.createArmy);

        this.buttonsVillage.push(this.btnCreateArmy);

        //UI - army

        x = -275;

        this.txtArmySize = this.add.text(-375, x)
            .setScrollFactor(0)
            .setFontSize(50)
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyVillage = this.add.text(-375, x + 60)
            .setScrollFactor(0)
            .setFontSize(50)
            .setShadow(3, 3, '#000000', 3);

        this.txtArmyMoves = this.add.text(-375, x + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setShadow(3, 3, '#000000', 3);

        this.textsArmy.push(this.txtArmySize);
        this.textsArmy.push(this.txtArmyVillage);
        this.textsArmy.push(this.txtArmyMoves);

        //hide
        GameUtils.hideGameObjects(this.buttonsVillage);
        GameUtils.hideGameObjects(this.textsArmy);

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
        this.numPlayers = 2;

        //init cash
        for (let i = 1; i <= this.numPlayers; i++) {
            this.cashPlayers[i] = 0;
            this.addCash(i, 100);
        }

        this.turnOfPlayer = 1;

    }

    update(time, delta) {
        this.controls.update(delta);
    }

    //TODO: change the instance variables to deal with multiple players.
    addCash(player, cash) {

        this.cashPlayers[player] += cash;

        if (player != 1)
            return;

        this.txtCashPlayers[player].setText("$" + this.cashPlayers[player]);
    }

    //TODO: make it for every player
    endTurn(pointer) {

        let scene = this.scene;

        if (pointer.rightButtonDown())
            return;

        scene.deselectEverything();

        //disable all game controls
        scene.btnEndTurn.setTint(0xff0000);

        scene.turnOfPlayer = 2;

        //TODO: fix this later
        scene.calculateTurnPlayer2();

        scene.addCash(1, 100);
    }

    calculateTurnPlayer2() {

        console.log("calculating turn: player2...");

        this.cashP2 += 100;

        //do something

        this.btnEndTurn.clearTint();
        this.turnOfPlayer = 1;
        this.replenishPhase(this.turnOfPlayer);

        console.log("ending turn: player2...");
    }

    replenishPhase(playerNumber){
        
        let armies = this.armyPlayers[playerNumber];

        armies.forEach(army => {
            army.moveAmount = army.moveMax;
        });

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

        scene.selectedVillage = this;
        scene.selectedVillage.setTint("0xffff00");

        //TODO: do only on double click.
        scene.cam.pan(this.x, this.y, 500); //(x, y, duration)

        scene.btnCreateArmy.visible = true;
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

        let armySprite = scene.add.sprite(selectedVillage.x, selectedVillage.y, 'armySpearmen')
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

    }

    selectArmy(pointer) {

        if (pointer.rightButtonDown())
            return;

        let scene = this.scene;
        let army = this.data.get("data");

        scene.deselectEverything();

        scene.selectedArmy = this;

        //display army texts
        GameUtils.showGameObjects(scene.textsArmy);
        scene.updateTextArmy(army);

        //TODO: do only on double click.
        scene.cam.pan(this.x, this.y, 500);

        GameUtils.showGameObjects(scene.textsArmy);

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

    deselectEverything(pointer) {

        GameUtils.hideGameObjects(this.buttonsVillage);
        GameUtils.hideGameObjects(this.textsArmy);

        if (this.selectedVillage != null)
            this.selectedVillage.clearTint();
        this.selectedVillage = null;

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

        if(cost > army.moveAmount)
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
        tiles.forEach(tile => {
            //TODO: probably have to tint different terrain differently
            this.board.boardSprites[tile.row][tile.col].setTint("0x00aaff");
        });
    }

    unhighlightTiles(tiles) {
        tiles.forEach(tile => {
            this.board.boardSprites[tile.row][tile.col].clearTint();
        });
    }

}