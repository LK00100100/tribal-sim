
import Board from './board.js';
import Village from './village.js';

export default class SceneGame extends Phaser.Scene {

    constructor() {
        super('SceneGame');

        this.board = new Board();

        this.villageP1 = [{ x: 2, y: 2 }];

        //for input and camera
        this.controls;

        this.gameOver = false;

        this.cashPlayers = [];

        //ui
        this.btnEndTurn;

        this.txtCashPlayers = [];

        this.groupTerrain;
        this.groupGrid;

        this.cam;
    }

    preload() {
        this.load.image('grid', 'assets/uv-grid-4096-ian-maclachlan.png');
        this.load.image('tileGrass', 'assets/tile-grass.png');
        this.load.image('tileOcean', 'assets/tile-ocean.png');
        this.load.image('tileGrid', 'assets/tile-grid.png');

        this.load.image('buildVillage', 'assets/build-village.png');

        //ui stuff
        this.load.image('btnEndTurn', 'assets/btn-end-turn.png');
    }

    create() {

        //draw checkerboard
        this.add.image(0, 0, 'grid').setOrigin(0);

        /*
        * draw the board with images
        */
        this.board.initBoard();
        console.log(this.board.board);
        let x, y;
        let imageTemp, spriteTemp;
        this.groupTerrain = this.add.group();
        this.groupGrid = this.add.group();
        let theBoard = this.board.board;
        for (let row = 0; row < this.board.board.length; row++) {
            x = 256 + (row * 256);
            for (let col = 0; col < this.board.board[0].length; col++) {
                y = 256 + (col * 256);

                switch (theBoard[row][col]) {
                    //tile grass
                    case 0:
                        spriteTemp = this.add.sprite(x, y, 'tileGrass')
                            .setInteractive();

                        //set data
                        spriteTemp.setDataEnabled();
                        spriteTemp.data.set('datax', x);

                        spriteTemp.on('pointerdown', function (pointer) {
                            //'this' is the selected sprite
                            this.setTint(0xff0000);

                            console.log("data x: ", this.data.get("datax"));
                            console.log("this.x: ", this.x);
                        });

                        this.groupTerrain.add(spriteTemp);
                        break;

                    //tile ocean
                    case 1:
                        spriteTemp = this.add.sprite(x, y, 'tileOcean').setInteractive();
                        this.groupTerrain.add(spriteTemp);
                        break;

                    default:
                        console.log("can't load board square at: ", row, col);
                        break;
                }

                //draw grid
                imageTemp = this.add.image(x, y, 'tileGrid');
                this.groupGrid.add(imageTemp);

            }
        }

        /*
        * draw villages
        */
       
        this.villageP1.forEach(village =>{
            x = 256 + (village.x * 256);
            y = 256 + (village.y * 256);

            spriteTemp = this.add.sprite(x, y, 'buildVillage')
                .setInteractive()
                .setDataEnabled()
                .on("pointerdown", this.villageClicked);

            spriteTemp.data.set("a", new Village(this, spriteTemp, 1));
                
        });
        
        /*
        * draw UI
        */

        //UI cash
        this.txtCashPlayers[1] = this.add.text(-375, -375)
            .setText('$' + this.cashP1)
            .setScrollFactor(0)
            .setFontSize(99)
            .setShadow(1, 1, '#000000', 2);

        //button, end turn
        this.btnEndTurn = this.add.sprite(1050, 1100, 'btnEndTurn')
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerdown', this.endTurn, this);

        //  Input Events
        let cursors = this.input.keyboard.createCursorKeys();

        /*
        * Camera stuff
        */

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
        for(let i = 1; i <= this.numPlayers; i++){
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

        if(player != 1)
            return;

        this.txtCashPlayers[player].setText("$" + this.cashPlayers[player]);
    }

    endTurn(pointer) {

        //disable all game controls
        this.btnEndTurn.setTint(0xff0000);

        this.turnOfPlayer = 2;

        this.calculateTurnPlayer2();

        this.addCash(1, 100);
    }

    calculateTurnPlayer2() {

        console.log("calculating turn: player2...");

        this.cashP2 += 100;

        //do something

        this.btnEndTurn.clearTint();
        this.turnOfPlayer = 1;
        console.log("ending turn: player2...");

    }

    villageClicked(pointer){
        
        //this = sprite
        let village = this.data.get("a");

        let scene = village.scene;

        //center camera on the village (x, y, duration)
        scene.cam.pan(village.gameObject.x, village.gameObject.y, 500);
    }

}