import GameUtilsBuilding from "../utils/GameUtilsBuilding";
import Village from "../buildings/villageBuildings/Village";
import Board from "../board/Board";
// eslint-disable-next-line no-unused-vars
import Ai from "../ai/Ai";

import GameUtilsAi from "../utils/GameUtilsAi";

import RaceObj from "../Race";
let { Race } = RaceObj;

//import managers
import ArmyManager from "../army/ArmyManager";
import BuildingManager from "../buildings/BuildingManager";
import FortificationManager from "../foritication/FortificationManager";

// eslint-disable-next-line no-unused-vars
import SceneGame from "../SceneGame";

/**
 * Does the main game logic.
 * Pre-move, move, post-move.
 * 
 * Also holds all of the gamedata
 * 
 * Be sure to call setGameScene() once
 */
export default class GameEngine {

    constructor() {
        /** @type {SceneGame} */
        this.gameScene; //use setGameScene() to set this
        
        //managers
        this.buildingManager;
        this.armyManager;
        this.fortificationManager;

        this.board = new Board();

        /** @type {Number} */
        this.day = 1;   //what day on earth it is. ex: Day 100
        this.turnOfPlayer = 1;

        this.isGameOver = false;

        //TODO: read all this stuff from external source
        //1-indexed
        this.playerRace = [
            "", //no player
            Race.CAVEMAN,   //this is the human-player
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
                amountFood: 100,
                amountStone: 1500,
                amountWood: 1500
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

        //[player #] = array of army pieces
        //sprites
        this.playerArmies = [];
        this.playerBuildings = [];
        for (let playerNum = 0; playerNum <= this.numPlayers; playerNum++) {
            this.playerArmies[playerNum] = [];
            this.playerBuildings[playerNum] = [];
        }

        //Phaser sprites, human-player selected
        this.selectedVillage;
        this.selectedBuilding;
        this.selectedArmy;
        this.selectedEnemyArmy;

        this.selectedEnemyArmyCoordinates;     //{row, col} TODO: remove? just get from selected enemyArmy
        this.selectedArmyPossibleMoves;
        this.selectedVillageBuildings;
        this.selectedEnemyBuilding;

        //TODO: considate army and village moves
        this.possibleMoves;
        
        /** @type {Array<Ai>} */
        this.playerAi = GameUtilsAi.initAiForPlayers(this, this.playerRace);
    }

    /**
     * Should be called after the scene is initialized.
     * @param {*} gameScene 
     */
    setGameScene(gameScene) {
        this.gameScene = gameScene;

        this.buildingManager = new BuildingManager(this.gameScene, this);
        this.armyManager = new ArmyManager(this.gameScene, this);
        this.fortificationManager = new FortificationManager(this.gameScene, this);
    }

    //TODO: make it for every player
    endTurn() {
        /** @type SceneGame */
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        let timeInfoScene = gameScene.timeInfoScene;

        //TODO: lock it
        //disable all game controls
        timeInfoScene.btnEndTurn.setTint(0xff0000);

        //unhighlight moves
        if (gameEngine.selectedArmy != null) {
            gameEngine.board.unhighlightTiles(gameEngine.selectedArmyPossibleMoves);
            gameEngine.selectedArmyPossibleMoves = null;
        }

        this.postTurnPhase(gameEngine.turnOfPlayer);

        //TODO: fix this later
        for (let i = 2; i <= gameEngine.numPlayers; i++) {
            gameEngine.turnOfPlayer = i;
            this.calculateTurnAiPlayer(gameEngine.turnOfPlayer);
        }

        //TODO: disable button when needed
        gameEngine.day++;

        //now player 1's turn
        gameEngine.turnOfPlayer = 1;
        this.preTurnPhase(gameEngine.turnOfPlayer);

        if (gameEngine.selectedArmy != null)
            gameEngine.armyManager.showPossibleArmyMoves(gameEngine.selectedArmy.data.get("data"));

        timeInfoScene.btnEndTurn.clearTint();

        console.log("===================================");
        console.log("\nstart of your turn: ");
        gameScene.deselectEverything();
    }

    /**
     * AI calculations
     * @param {Number} player 
     */
    calculateTurnAiPlayer(player) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        console.log("calculating turn: player: " + player);

        this.preTurnPhase(player);

        let ai = gameEngine.playerAi[player];

        //TODO: replace this function with more functions
        ai.calculateTurn();

        this.postTurnPhase(player);

        console.log("ending turn: player " + player);
    }

    //replenishment
    preTurnPhase(playerNumber) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        /**
         * army stuff
         */
        let armies = gameEngine.playerArmies[playerNumber];

        if (armies != null) {
            armies.forEach(army => {
                army = army.data.get("data");
                army.moveAmount = army.moveMax;
            });
        }

        /**
         * village stuff
         */

        let buildings = gameEngine.playerBuildings[playerNumber];

        buildings.forEach(building => {
            let data = building.data.get("data");

            if (data instanceof Village) {
                let coordinates = gameEngine.buildingManager.getVillageBuildings(data);
                let buildingsData = gameEngine.board.getBuildingsData(coordinates);
                let countsOfBuildings = GameUtilsBuilding.countBuildings(buildingsData);

                data.calculateIncome(countsOfBuildings);
                data.calculateDay(countsOfBuildings);
            }
        });

    }

    postTurnPhase(playerNumber) {
        let gameScene = this.gameScene;
        let gameEngine = gameScene.gameEngine;

        /**
         * army stuff
         */
        let armies = gameEngine.playerArmies[playerNumber];

        if (armies != null) {
            armies.forEach((army) => {
                army = army.data.get("data");

                army.simulateCostDay();

                //survivors heal (if they have food)
                army.simulateHealing();

                //killed through attrition
                if (army.size() == 0) {
                    gameEngine.armyManager.destroyArmy(army);
                }
            });
        }

        //if we're selecting nothing, turn off
        if (!gameEngine.selectedArmy == null && !gameEngine.selectedVillage && !gameEngine.selectedBuilding) {
            gameScene.deselectEverything();
        }

    }

}