import Unit from "./Unit.js";

export default class Cat extends Unit {

    //TODO: simulate starvation. feed off of other animals
    constructor() {
        super(50);

        this.cost = 0;  //they feast off of the land
        this.moveMax = 3;

        this.attackBase = 3;
        this.attackBonusMin = 0;
        this.attackBonusMax = 8;

        this.defenseBase = 4;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 5;

        this.healBase = 1;
        this.healBonusMin = 0;
        this.healBonusMax = 5;
    }

}
