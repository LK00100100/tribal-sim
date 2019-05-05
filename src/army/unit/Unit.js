import GameUtils from "../../utils/GameUtils";

export default class Unit {

    constructor(health) {
        this.health = health;
        this.healthMax = health;

        this.moveMax = 1;
        this.cost = 1;

        this.attackBase = 1;
        this.attackBonusMin = 0;
        this.attackBonusMax = 0;

        this.defenseBase = 1;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 0;

        this.healBase = 1;
        this.healBonusMin = 0;
        this.healBonusMax = 1;
    }

    /**
     * adds (or subs) health. respects health limits.
     * @param {*} amount +/- number that'll be rounded up.
     */
    addHealth(amount){
        amount = Math.ceil(amount);

        this.health += amount;

        if(this.health < 0)
            this.health = 0;

        if(this.health > this.healthMax)
            this.health = this.healthMax;
    }

    /**
     * post turn food cost
     */
    getCost() {
        return this.cost;
    }

    getMovementMax() {
        return this.moveMax;
    }

    rollAttack() {
        let bonus = GameUtils.getRandomIntFromRange(this.attackBonusMin, this.attackBonusMax);
        return this.attackBase + bonus;
    }

    rollDefense() {
        let bonus = GameUtils.getRandomIntFromRange(this.defenseBonusMin, this.defenseBonusMax);
        return this.defenseBase + bonus;
    }

    rollHeal(){
        let bonus = GameUtils.getRandomIntFromRange(this.healBonusMin, this.healBonusMax);
        return this.healBase + bonus;
    }

}