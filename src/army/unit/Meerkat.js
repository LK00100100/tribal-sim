import Unit from "./Unit.js";

export default class Meerkat extends Unit {

    constructor(){
        super(35);

        this.cost = 0;  //they feast off of bugs, scorpions, and small animals on the land
        this.moveMax = 3;

        this.attackBase = 2;
        this.attackBonusMin = 0;
        this.attackBonusMax = 4;

        this.defenseBase = 2;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 3;

        this.healBase = 1;
        this.healBonusMin = 0;
        this.healBonusMax = 2;
    }

}
