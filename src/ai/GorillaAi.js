
import GameUtils from "../utils/GameUtils";
import Gorilla from "../army/unit/Gorilla";
import Ai from "./Ai.js";

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
     * @param {*} scene Phaser Scene
     * @param {Number} playerNumber 
     */
    constructor(scene, playerNumber) {
        super(scene, playerNumber, scene.playerArmies[playerNumber], scene.playerBuildings[playerNumber]);

        this.reproductionChance = 0.05; //TODO: should be dependent on the population. more = high chance
        this.reproduceAmount = 1;
    }

    calculateTurn() {
        let scene = this.scene;
        console.log("gorillas doing gorilla stuff...");

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

                if (armyData.size() < 50) {
                    for (let i = 0; i < this.reproduceAmount; i++) {
                        let rat = new Gorilla();
                        armyData.addUnit(rat);
                    }
                }
                return;
            }

            let possibleMovesArmy = scene.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //TODO: hard hack reeeee
            //move in forests only
            let possibleMovesForest = possibleMovesArmy.filter((coordinate) => {
                return scene.board.boardTerrain[coordinate.row][coordinate.col] == 4;
            });

            //pick a random square to move to
            let pickedIndex = GameUtils.getRandomInt(possibleMovesForest.length);
            let pickedCoordinate = possibleMovesForest[pickedIndex];

            let terrainSprite = scene.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
            scene.armyManager.moveArmy(armySprite, terrainSprite, possibleMovesForest);
        });
    }

}