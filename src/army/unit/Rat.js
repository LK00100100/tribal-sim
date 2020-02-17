import Unit from "./Unit.js";

export default class Rat extends Unit {

    constructor(){
        super(20);

        this.cost = 0;  //they feast off of the land
        this.moveMax = 2;   //TODO: check movement

        this.attackBase = 1;
        this.attackBonusMin = 0;
        this.attackBonusMax = 4;

        this.defenseBase = 1;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 2;

        this.healBase = 1;
        this.healBonusMin = 0;
        this.healBonusMax = 1;
    }

}
