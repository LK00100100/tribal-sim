
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
    }

    calculateTurn() { }

    isAlive() {
        if (armies.length == 0 && buildings.length == 0)
            return false;

        return true;
    }

}