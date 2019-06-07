
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

        //either distance from village buildings
        //or distance from one point
        this.territorySize = 0;

        //stores "row,col" => level. 
        //This is the location of threats
        //level is the threat level. Threats will slowly be forgotten with time.
        this.threats = new Map();
        //higher number = more danger.
        this.threatLevel = 0;   //1 person killed = +1 level
        this.threatMemory = 30; //time length to remember threats. in days

        //the later phases indicate they we need more buildings and armies
        this.buildingPhase = 1;
    }

    calculateTurn() { }

    isAlive() {
        if (armies.length == 0 && buildings.length == 0)
            return false;

        return true;
    }

}