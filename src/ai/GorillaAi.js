
import GameUtils from "../utils/GameUtils";
import Gorilla from "../army/unit/Gorilla";
import Ai from "./Ai.js";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine";

/**
 * Gorilla
 * 
 * Heavy units with a friendly disposition. 
 * Wanders jungles.
 * Never attacks unless provoked
 * No buildings
 */
export default class GorillaAi extends Ai {

    //TODO: separate scene and the blob of game data
    /**
     * 
     * @param {GameEngine} gameEngine
     * @param {Number} playerNumber 
     */
    constructor(gameEngine, playerNumber) {
        super(gameEngine, playerNumber);

        this.reproductionChance = 0.05; //TODO: should be dependent on the population. more = high chance
        this.reproduceAmount = 1;   //TODO: research reproduction rate

        this.maxGroupSize = 20;
    }

    calculateTurn() {
        let gameEngine = this.gameEngine;
        console.log("gorillas doing gorilla stuff...");

        //TODO: complete

        /**
         * wander the jungle or the land until you land in a jungle.
         * only attack hostiles
         */
        this.armies.forEach(armySprite => {
            let armyData = armySprite.data.get("data");

            //roll for reproduction. 
            //if success, reproduce and stop
            let reproduce = GameUtils.getRandomInt(1 / this.reproductionChance);
            if (reproduce == 1) {
                console.log("reproducing at: " + armyData.row + "," + armyData.col);

                if (armyData.size() < this.maxGroupSize) {
                    for (let i = 0; i < this.reproduceAmount; i++) {
                        let unit = new Gorilla();
                        armyData.addUnit(unit);
                    }
                }
                return;
            }

            let possibleMovesArmy = gameEngine.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //TODO: hard hack reeeee
            //move in forests only
            let possibleMovesForest = possibleMovesArmy.filter((coordinate) => {
                return gameEngine.board.boardTerrain[coordinate.row][coordinate.col] == 4;
            });

            //we have movement
            if (possibleMovesForest.length > 0) {
                //pick a random square to move to
                let pickedIndex = GameUtils.getRandomInt(possibleMovesForest.length);
                let pickedCoordinate = possibleMovesForest[pickedIndex];

                let terrainSprite = gameEngine.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
                gameEngine.armyManager.moveArmy(armySprite, terrainSprite, possibleMovesForest);
            }
        });
    }

}