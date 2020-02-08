import Unit from "./Unit.js";

export default class Tiger extends Unit {

    //TODO: simulate tiger starvation. feed off of other animals
    constructor() {
        super(150);

        this.cost = 0;  //they feast off of the land
        this.moveMax = 4;

        this.attackBase = 5;
        this.attackBonusMin = 0;
        this.attackBonusMax = 20;

        this.defenseBase = 3;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 5;

        this.healBase = 3;
        this.healBonusMin = 0;
        this.healBonusMax = 5;
    }

}
