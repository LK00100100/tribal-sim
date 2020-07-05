// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine";

export default class Ai {

    //TODO: enemies and hate-points itemized calculation
    //TODO: and neutral...
    //TODO: friends and like-points itemized calculation
    /**
     * @param {GameEngine} gameEngine
     * @param {Number} playerNumber 
     */
    constructor(gameEngine, playerNumber) {
        this.gameEngine = gameEngine;
        
        this.playerNumber = playerNumber;
        this.armies = this.gameEngine.playerArmies[playerNumber]; //array of armySprites
        this.buildings = this.gameEngine.playerBuildings[playerNumber]; //array of buildingSprites

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
        if (this.armies.length == 0 && this.buildings.length == 0)
            return false;

        return true;
    }

}