
export default class Ai {

    /**
     * @param {*} scene game
     * @param {*} playerNumber 
     * @param {*} armies array of armySprites
     * @param {*} buildings array of buildingSprites
     */
    constructor(scene, playerNumber, armies, buildings) {
        this.scene = scene;
        this.playerNumber = playerNumber;
        this.armies = armies;
        this.buildings = buildings;

        //either distance from buildings
        //or distance from one point
        this.territorySize = 0;
        this.threatMemory = 30; //length to remember threats
    }

    calculateTurn() { }

    isAlive() {
        if (armies.length == 0 && buildings.length == 0)
            return false;

        return true;
    }

}