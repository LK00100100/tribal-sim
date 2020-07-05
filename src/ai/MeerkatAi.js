
import GameUtils from "../utils/GameUtils";
import Meerkat from "../army/unit/Meerkat";
import Ai from "./Ai";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine";

/**
 * Meerkat
 * 
 * Lives in a burrow.
 * Non-Hostile Defensive unit
 * Normally in groups of 3 to 50
 * Immune to poison
 */
export default class MeerkatAi extends Ai {

    //TODO: separate scene and the blob of game data
    /**
     * 
     * @param {GameEngine} gameEngine
     * @param {Number} playerNumber 
     */
    constructor(gameEngine, playerNumber) {
        super(gameEngine, playerNumber);

        this.reproductionChance = 0.3; //TODO: should be dependent on the population. more = high chance
        this.reproduceAmount = 1;

        this.maxGroupSize = 50;
    }

    calculateTurn() {
        let gameEngine = this.gameEngine;
        console.log("meerkats doing stuff...");

        //TODO: complete

        /**
         * wander the desert or the land until you land in a desert.
         * only attack hostiles
         */
        this.armies.forEach(armySprite => {
            let armyData = armySprite.data.get("data");

            //roll for reproduction. 
            //if success, reproduce and stop
            let reproduce = GameUtils.getRandomInt(1 / this.reproductionChance);
            if (reproduce == 1) {
                console.log("reproducing at: " + armyData.row + "," + armyData.col);

                //TODO: take out actual unit creation here. for tiger and gorilla
                if (armyData.size() < this.maxGroupSize) {
                    for (let i = 0; i < this.reproduceAmount; i++) {
                        let unit = new Meerkat();
                        armyData.addUnit(unit);
                    }
                }
                return;
            }

            //TODO: move 

            //TODO: attack all weaker armies (if they randomly feel like it.)

            let possibleMovesArmy = gameEngine.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //TODO: hard hack reeeee
            //move in deserts only
            let possibleMovesDesert = possibleMovesArmy.filter((coordinate) => {
                return gameEngine.board.boardTerrain[coordinate.row][coordinate.col] == 3;
            });

            //pick a random square to move to
            let pickedIndex = GameUtils.getRandomInt(possibleMovesDesert.length);
            let pickedCoordinate = possibleMovesDesert[pickedIndex];

            let terrainSprite = gameEngine.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
            gameEngine.armyManager.moveArmy(armySprite, terrainSprite, possibleMovesDesert);
        });
    }

}