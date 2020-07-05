
import GameUtils from "../utils/GameUtils";
import Cat from "../army/unit/Cat";
import Ai from "./Ai";
// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine";

/**
 * Cat
 * 
 *  Sits there and does nothing
 */
export default class CatAi extends Ai {

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

        console.log("doing cat stuff...");

        //let scene = this.scene;

        //TODO: complete

        /**
         * do nothing
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
                        let unit = new Cat();
                        armyData.addUnit(unit);
                    }
                }
                return;
            }

            //TODO: move 
            //TODO: attack all weaker armies (if they randomly feel like it.)
            let possibleMovesArmy = gameEngine.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //pick a random square to move to
            let pickedIndex = GameUtils.getRandomInt(possibleMovesArmy.length);
            let pickedCoordinate = possibleMovesArmy[pickedIndex];

            let terrainSprite = gameEngine.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
            gameEngine.armyManager.moveArmy(armySprite, terrainSprite, possibleMovesArmy);
        });
    }

}