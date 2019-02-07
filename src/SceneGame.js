
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

        this.villageP1 = [{ row: 2, col: 2 }];

        //for input and camera
        this.controls;

        this.gameOver = false;

        this.cashPlayers = [];

        //ui
        this.buttonsVillage = [];
        this.txtCashPlayers = [];

        this.groupTerrain;
        this.groupGrid;

        this.cam;

        this.selectedVillage;
        this.selectedArmy;

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

        /*
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
                            .setInteractive();

                        tempSprite.on('pointerdown', function (pointer) {
                            //'this' is the selected sprite
                            if (this.isTinted) {
                                this.clearTint();
                            }
                            else {
                                this.setTint(0x550000);
                            }

                            this.scene.deselectEverything();

                        });

                        this.groupTerrain.add(tempSprite);
                        break;

                    //tile ocean
                    case 1:
                        tempSprite = this.add.sprite(x, y, 'tileOcean').setInteractive();
                        this.groupTerrain.add(tempSprite);
                        break;

                    default:
                        console.log("can't load board square at: ", row, col);
                        break;
                }

                //draw grid
                tempImage = this.add.image(x, y, 'tileGrid');
                this.groupGrid.add(tempImage);

            }
        }

        /*
        * draw villages
        */

        console.log(typeof (this));

        this.villageP1.forEach(village => {
            x = 256 + (village.row * 256);
            y = 256 + (village.col * 256);

            tempSprite = this.add.sprite(x, y, 'buildVillage')
                .setInteractive()
                .setDataEnabled()
                .on("pointerdown", this.villageClicked);

            village = new Village(village.row, village.col, x, y, 1, "cats are rats");

            tempSprite.data.set("data", village);

            tempText = this.add.text(x - 128, y + 80)
                .setText(village.name)
                .setFontSize(40)
                .setAlign("center")
                .setBackgroundColor("#000000")
                .setShadow(1, 1, '#000000', 2);

            this.textsVillageName.push(tempText);
        });

        /*
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
            .setShadow(5, 5, '#000000', 5);


            /*
        this.txtArmyVillage = this.add.text(-375, x + 60)
            .setScrollFactor(0)
            .setFontSize(50)
            .setShadow(1, 1, '#000000', 2);
            */

            /*
        this.txtArmyMoves = this.add.text(-375, x + 120)
            .setScrollFactor(0)
            .setFontSize(50)
            .setShadow(1, 1, '#000000', 2);
            */


        
        this.textsArmy.push(this.txtArmySize);
        //this.textsArmy.push(this.txtArmyVillage);
        //this.textsArmy.push(this.txtArmyMoves);
        

        //hide
        GameUtils.hideGameObjects(this.buttonsVillage);
        GameUtils.hideGameObjects(this.textsArmy);

        /*
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
        //this = btn

        let scene = this.scene;

        //disable all game controls
        scene.btnEndTurn.setTint(0xff0000);

        scene.turnOfPlayer = 2;

        scene.calculateTurnPlayer2();

        scene.addCash(1, 100);
    }

    calculateTurnPlayer2() {

        console.log("calculating turn: player2...");

        this.cashP2 += 100;

        //do something

        this.btnEndTurn.clearTint();
        this.turnOfPlayer = 1;
        console.log("ending turn: player2...");
    }

    villageClicked(pointer) {
        console.log("village clicked");

        //this = sprite
        let village = this.data.get("data");

        let scene = this.scene;

        scene.deselectEverything();

        scene.selectedVillage = this;
        scene.selectedVillage.setTint("0xffff00");

        //center camera on the village (x, y, duration)
        scene.cam.pan(this.x, this.y, 500);

        scene.btnCreateArmy.visible = true;
    }

    createArmy(pointer) {

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

        let army = new Army(1, selectedVillage);

        //TODO: change this later
        for (let i = 0; i < 10; i++) {
            let spearman = new Spearman();
            army.addUnit(spearman);
        }

        armySprite.data.set("data", army);

        scene.board.addArmy(row, col, army);

    }

    selectArmy(pointer) {

        let scene = this.scene;
        let army = this.data.get("data");

        scene.deselectEverything();

        //display army texts
        GameUtils.showGameObjects(scene.textsArmy);
        scene.updateTextArmy(army);

        scene.cam.pan(this.x, this.y, 500);

        scene.selectedArmy = this;

        GameUtils.showGameObjects(scene.textsArmy);

        console.log("selecting army");

        this.setTint(0xffff00);

    }

    updateTextArmy(army) {
        //this.txtArmySize.setText("Units: " + army.units.length);
        //this.txtArmyVillage.setText("Village: " + army.village.name);
        //this.txtArmyMoves.setText("Movem: " + army.moveAmount + "/" + army.moveMax);

    }

    deselectEverything(pointer) {

        GameUtils.hideGameObjects(this.buttonsVillage);
        GameUtils.hideGameObjects(this.textsArmy);

        if (this.selectedVillage != null)
            this.selectedVillage.clearTint();
        this.selectedVillage = null;

        if (this.selectedArmy != null)
            this.selectedArmy.clearTint();
        this.selectedArmy = null;
    }

}