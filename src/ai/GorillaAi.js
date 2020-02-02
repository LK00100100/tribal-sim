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
        console.log("gorillas doing gorilla stuff...");

        //let scene = this.scene;

        //TODO: complete

        /**
         * wander the jungle or the land until you land in a jungle.
         * only attack hostiles
         */
        this.armies.forEach(armySprite => {
            console.log(armySprite);
        });
    }

}