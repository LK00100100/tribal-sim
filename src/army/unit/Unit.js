
export default class Unit {

    constructor(health) {
        this.health = health;

        this.attackBase = 1;
        this.attackBonusMin = 0;
        this.attackBonusMax = 0;

        this.defenseBase = 1;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 0;
    }

    //food cost
    cost(){
        return 1;
    }

    getMovementMax(){
        return 1;
    }

}