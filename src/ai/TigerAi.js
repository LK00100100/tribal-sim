
import GameUtils from "../utils/GameUtils";
import Tiger from "../army/unit/Tiger";
import Ai from "./Ai";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine";

/**
 * Tiger
 * 
 * Medium units with a semi-hostile disposition.
 * Will not attack armies with a stronger base.
 * Wanders jungles.
 * Never attacks unless provoked
 * No buildings
 */
export default class TigerAi extends Ai {

    //TODO: separate scene and the blob of game data
    /**
     * 
     * @param {GameEngine} gameEngine
     * @param {Number} playerNumber 
     */
    constructor(gameEngine, playerNumber) {
        super(gameEngine, playerNumber);

        this.reproductionChance = 0.1; //TODO: should be dependent on the population. more = high chance
        this.reproduceAmount = 1;   //TODO: research reproduction rate

        this.maxGroupSize = 30;
    }

    calculateTurn() {
        let gameEngine = this.gameEngine;
        console.log("tigers doing tiger stuff...");

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
                        let tiger = new Tiger();
                        armyData.addUnit(tiger);
                    }
                }
                return;
            }

            //TODO: move 

            //TODO: attack all weaker armies (if they randomly feel like it.)

            let possibleMovesArmy = gameEngine.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //TODO: hard hack reeeee
            //move in forests only
            let possibleMovesForest = possibleMovesArmy.filter((coordinate) => {
                return gameEngine.board.boardTerrain[coordinate.row][coordinate.col] == 4;
            });

            //if we have movement
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