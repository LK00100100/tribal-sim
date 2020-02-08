import Unit from "./Unit.js";

export default class Gorilla extends Unit {

    constructor() {
        super(250);

        this.cost = 0;  //they feast off of the land
        this.moveMax = 1;

        this.attackBase = 15;
        this.attackBonusMin = 0;
        this.attackBonusMax = 10;

        this.defenseBase = 10;
        this.defenseBonusMin = 3;
        this.defenseBonusMax = 10;

        this.healBase = 3;
        this.healBonusMin = 2;
        this.healBonusMax = 5;
    }

}
