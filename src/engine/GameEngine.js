import GameUtilsBuilding from "../utils/GameUtilsBuilding";
import Village from "../buildings/villageBuildings/Village";

/**
 * Does the main game logic.
 * Pre-move, move, post-move.
 */
export default class GameEngine {

    constructor(gameScene){
        this.gameScene = gameScene;
    }

    //TODO: make it for every player
    endTurn() {
        let gameScene = this.gameScene;

        //TODO: lock it
        //disable all game controls
        gameScene.btnEndTurn.setTint(0xff0000);

        //unhighlight moves
        if (gameScene.selectedArmy != null) {
            gameScene.board.unhighlightTiles(gameScene.selectedArmyPossibleMoves);
            gameScene.selectedArmyPossibleMoves = null;
        }

        gameScene.postTurnPhase(gameScene.turnOfPlayer);

        //TODO: fix this later
        for (let i = 2; i <= gameScene.numPlayers; i++) {
            gameScene.turnOfPlayer = i;
            gameScene.calculateTurnAiPlayer(gameScene.turnOfPlayer);
        }

        //TODO: disable button when needed
        gameScene.day++;

        //now player 1's turn
        gameScene.turnOfPlayer = 1;
        gameScene.preTurnPhase(gameScene.turnOfPlayer);

        if (gameScene.selectedArmy != null)
            gameScene.armyManager.showPossibleArmyMoves(gameScene.selectedArmy.data.get("data"));

        gameScene.btnEndTurn.clearTint();

        console.log("===================================");
        console.log("\nstart of your turn: ");
        gameScene.updateUI();
    }

    /**
     * AI calculations
     * @param {Number} player 
     */
    calculateTurnAiPlayer(player) {
        console.log("calculating turn: player: " + player);

        this.preTurnPhase(player);

        let ai = this.playersAi[player];

        //TODO: replace this function with more functions
        ai.calculateTurn();

        this.postTurnPhase(player);

        console.log("ending turn: player2...");
    }

    //replenishment
    preTurnPhase(playerNumber) {

        /**
         * army stuff
         */
        let armies = this.playerArmies[playerNumber];

        if (armies != null) {
            armies.forEach(army => {
                army = army.data.get("data");
                army.moveAmount = army.moveMax;
            });
        }

        /**
         * village stuff
         */

        let buildings = this.playerBuildings[playerNumber];

        buildings.forEach(building => {
            let data = building.data.get("data");

            if (data instanceof Village) {
                let coordinates = this.buildingManager.getVillageBuildings(data);
                let buildingsData = this.board.getBuildingsData(coordinates);
                let countsOfBuildings = GameUtilsBuilding.countBuildings(buildingsData);

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
                army = army.data.get("data");

                army.simulateCostDay();

                //survivors heal (if they have food)
                army.simulateHealing();

                //killed through attrition
                if (army.size() == 0) {
                    this.armyManager.destroyArmy(army);
                }
            });
        }

        //if we're selecting nothing, turn off
        if (!this.selectedArmy == null && !this.selectedVillage && !this.selectedBuilding) {
            this.deselectEverything();
        }

    }

}