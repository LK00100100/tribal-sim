
export default class Army {

    constructor(player, village) {

        this.row = village.row;
        this.col = village.col;
        this.player = player;
        this.village = village;
        this.name;

        this.moveMax;
        this.moveAmount;
        this.units = [];

        this.amoundWood = 0;
        this.amountFood = 0;
        this.amountStone = 0;

        this.carryingCapcity;

        //for each attrition period, this is calculated only once
        this.attritionAmount = 0;
    }

    addUnit(unit) {
        //TODO: set max move amount according to slowest unit

        this.units.push(unit);
    }

    //returns the complete size of the army    
    size() {

        let total = 0;

        total += this.units.length;

        //TODO: implement wounded later

        return total;

    }

    getCostDay() {

        let cost = 0;

        for (let i = 0; i < this.size(); i++) {
            cost += this.units[i].cost();
        }

        return cost;
    }

    calculateCostDay() {

        this.calculateAttrition();

        this.amountFood -= this.getCostDay();

        if (this.amountFood < 0)
            this.amountFood = 0;

    }

    calculateAttrition() {

        //no attrition
        if (this.amountFood > 0) {
            this.attritionAmount = 0;
            return;
        }

        //some attrition
        if (this.attritionAmount == 0) {
            this.attritionAmount = Math.ceil(this.size() / 10);
        }

        this.removeUnits(this.attritionAmount);

    }

    /**
     * remove the last units up to numberToRemove
     * @param {*} numberToRemove 
     */
    removeUnits(numberToRemove) {

        if (numberToRemove > this.size())
            numberToRemove = this.size();

        for (let i = 0; i < numberToRemove; i++) {
            this.units.pop();
        }

    }

    calculateAttackBase() {

        let total = 0;
        this.units.forEach(unit => total += unit.attackBase);
        return total;
    }

    calculateDefenseBase() {

        let total = 0;
        this.units.forEach(unit => total += unit.defenseBase);
        return total;
    }

    sortUnitsByHealth() {
        this.units.sort(function (x, y) {
            if (x.health < y.health) return -1;
            if (x.health > y.health) return 1;
            return 0;
        });
    }

    /**
     * @returns an array of units health
     */
    getUnitsHealthStatus() {
        let healths = [];
        this.units.forEach(unit => healths.push(unit.health));
        return healths;
    }

    /**
     * returns an array of attacks rolls for all units
     */
    rollAttack() {
        let attacks = [];
        this.units.forEach(unit => attacks.push(unit.rollAttack()));
        return attacks;
    }

    /**
     * returns an array of defense rolls for all units
     */
    rollDefenses() {
        let defenses = [];
        this.units.forEach(unit => defenses.push(unit.rollDefense()));
        return defenses;
    }

}
