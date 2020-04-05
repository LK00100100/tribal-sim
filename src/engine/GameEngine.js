import GameUtilsBuilding from "../utils/GameUtilsBuilding";
import Village from "../buildings/villageBuildings/Village";


export default class GameEngine {

    constructor(gameScene){
        this.gameScene = gameScene;
    }

    //TODO: make it for every player
    endTurn() {
        let scene = this.gameScene;

        //TODO: lock it
        //disable all game controls
        scene.btnEndTurn.setTint(0xff0000);

        //unhighlight moves
        if (scene.selectedArmy != null) {
            scene.board.unhighlightTiles(scene.selectedArmyPossibleMoves);
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
            scene.armyManager.showPossibleArmyMoves(scene.selectedArmy.data.get("data"));

        scene.btnEndTurn.clearTint();

        console.log("===================================");
        console.log("\nstart of your turn: ");
        scene.updateUI();
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