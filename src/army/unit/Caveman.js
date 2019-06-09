import Unit from "./Unit.js";

export default class Caveman extends Unit {

    constructor(){
        super(100);

        this.cost = 1;  //1 food
        this.moveMax = 3;

        this.attackBase = 10;
        this.attackBonusMin = 0;
        this.attackBonusMax = 10;

        this.defenseBase = 5;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 5;

        this.healBase = 3;
        this.healBonusMin = 0;
        this.healBonusMax = 3;
    }
    
}
