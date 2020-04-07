import GameUtilsBuilding from "../utils/GameUtilsBuilding";
import Village from "../buildings/villageBuildings/Village";

/**
 * Does the main game logic.
 * Pre-move, move, post-move.
 */
export default class GameEngine {

    constructor(gameScene){
        //TODO: put all game info here. remove from gameScene
        this.gameScene = gameScene;
    }

    //TODO: make it for every player
    endTurn() {
        /** @type SceneGame */
        let gameScene = this.gameScene;
        let timeInfoScene = gameScene.timeInfoScene;

        //TODO: lock it
        //disable all game controls
        timeInfoScene.btnEndTurn.setTint(0xff0000);

        //unhighlight moves
        if (gameScene.selectedArmy != null) {
            gameScene.board.unhighlightTiles(gameScene.selectedArmyPossibleMoves);
            gameScene.selectedArmyPossibleMoves = null;
        }

        this.postTurnPhase(gameScene.turnOfPlayer);

        //TODO: fix this later
        for (let i = 2; i <= gameScene.numPlayers; i++) {
            gameScene.turnOfPlayer = i;
            this.calculateTurnAiPlayer(gameScene.turnOfPlayer);
        }

        //TODO: disable button when needed
        gameScene.day++;

        //now player 1's turn
        gameScene.turnOfPlayer = 1;
        this.preTurnPhase(gameScene.turnOfPlayer);

        if (gameScene.selectedArmy != null)
            gameScene.armyManager.showPossibleArmyMoves(gameScene.selectedArmy.data.get("data"));

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

        console.log("calculating turn: player: " + player);

        this.preTurnPhase(player);

        let ai = gameScene.playersAi[player];

        //TODO: replace this function with more functions
        ai.calculateTurn();

        this.postTurnPhase(player);

        console.log("ending turn: player " + player);
    }

    //replenishment
    preTurnPhase(playerNumber) {
        let gameScene = this.gameScene;

        /**
         * army stuff
         */
        let armies = gameScene.playerArmies[playerNumber];

        if (armies != null) {
            armies.forEach(army => {
                army = army.data.get("data");
                army.moveAmount = army.moveMax;
            });
        }

        /**
         * village stuff
         */

        let buildings = gameScene.playerBuildings[playerNumber];

        buildings.forEach(building => {
            let data = building.data.get("data");

            if (data instanceof Village) {
                let coordinates = gameScene.buildingManager.getVillageBuildings(data);
                let buildingsData = gameScene.board.getBuildingsData(coordinates);
                let countsOfBuildings = GameUtilsBuilding.countBuildings(buildingsData);

                data.calculateIncome(countsOfBuildings);
                data.calculateDay(countsOfBuildings);
            }
        });

    }

    postTurnPhase(playerNumber) {
        let gameScene = this.gameScene;

        /**
         * army stuff
         */
        let armies = gameScene.playerArmies[playerNumber];

        if (armies != null) {
            armies.forEach((army) => {
                army = army.data.get("data");

                army.simulateCostDay();

                //survivors heal (if they have food)
                army.simulateHealing();

                //killed through attrition
                if (army.size() == 0) {
                    gameScene.armyManager.destroyArmy(army);
                }
            });
        }

        //if we're selecting nothing, turn off
        if (!gameScene.selectedArmy == null && !gameScene.selectedVillage && !gameScene.selectedBuilding) {
            gameScene.deselectEverything();
        }

    }

}