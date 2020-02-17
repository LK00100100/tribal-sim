
import GameUtils from "../utils/GameUtils";
import Meerkat from "../army/unit/Meerkat";
import Ai from "./Ai";

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
     * @param {*} scene Phaser Scene
     * @param {Number} playerNumber 
     */
    constructor(scene, playerNumber) {
        super(scene, playerNumber, scene.playerArmies[playerNumber], scene.playerBuildings[playerNumber]);

        this.reproductionChance = 0.3; //TODO: should be dependent on the population. more = high chance
        this.reproduceAmount = 1;

        this.maxGroupSize = 50;
    }

    calculateTurn() {
        let scene = this.scene;
        console.log("meerkats doing stuff...");

        //let scene = this.scene;

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

            let possibleMovesArmy = scene.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //TODO: hard hack reeeee
            //move in deserts only
            let possibleMovesDesert = possibleMovesArmy.filter((coordinate) => {
                return scene.board.boardTerrain[coordinate.row][coordinate.col] == 3;
            });

            //pick a random square to move to
            let pickedIndex = GameUtils.getRandomInt(possibleMovesDesert.length);
            let pickedCoordinate = possibleMovesDesert[pickedIndex];

            let terrainSprite = scene.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
            scene.armyManager.moveArmy(armySprite, terrainSprite, possibleMovesDesert);
        });
    }

}