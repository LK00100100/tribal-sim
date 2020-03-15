
import GameUtils from "../utils/GameUtils";
import Tiger from "../army/unit/Tiger";
import Ai from "./Ai";

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
     * @param {*} scene Phaser Scene
     * @param {Number} playerNumber 
     */
    constructor(scene, playerNumber) {
        super(scene, playerNumber, scene.playerArmies[playerNumber], scene.playerBuildings[playerNumber]);

        this.reproductionChance = 0.1; //TODO: should be dependent on the population. more = high chance
        this.reproduceAmount = 1;   //TODO: research reproduction rate

        this.maxGroupSize = 30;
    }

    calculateTurn() {
        let scene = this.scene;
        console.log("tigers doing tiger stuff...");

        //let scene = this.scene;

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

            let possibleMovesArmy = scene.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //TODO: hard hack reeeee
            //move in forests only
            let possibleMovesForest = possibleMovesArmy.filter((coordinate) => {
                return scene.board.boardTerrain[coordinate.row][coordinate.col] == 4;
            });

            //if we have movement
            if (possibleMovesForest.length > 0) {
                //pick a random square to move to
                let pickedIndex = GameUtils.getRandomInt(possibleMovesForest.length);
                let pickedCoordinate = possibleMovesForest[pickedIndex];

                let terrainSprite = scene.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
                scene.armyManager.moveArmy(armySprite, terrainSprite, possibleMovesForest);
            }
        });
    }

}