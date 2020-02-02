// eslint-disable-next-line no-unused-vars
import Village from "../buildings/villageBuildings/Village";

/**
 * Holds a group of Individual Units
 */
export default class Army {

    /**
     * Either set the army's starting coordinates to village or row/col
     * @param {Number} player playerNumber
     * @param {Village} village 
     * @param {Number} row 
     * @param {Number} col 
     */
    //TODO: remove village
    constructor(player, village, row, col) {

        //set starting coordinates and starting village (if applicable)
        if(village != null){
            this.village = village;
            this.row = village.row;
            this.col = village.col;
        }
        else{
            if(row != null)
                this.row = row;

            if(col != null)
                this.col = col;

            this.village = null;
        }

        this.player = player;   //player number
        this.name;

        this.moveMax;
        this.moveAmount;
        this.units = [];

        this.amoundWood = 0;
        this.amountFood = 0;
        this.amountStone = 0;

        this.carryingCapcity;
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
            cost += this.units[i].getCost();
        }

        return cost;
    }

    /**
     * simulates cost of a day and people starving
     */
    simulateCostDay() {

        this.calculateAttrition();

        this.amountFood -= this.getCostDay();

        if (this.amountFood < 0)
            this.amountFood = 0;

    }

    calculateAttrition() {

        //no attrition
        if (this.amountFood > 0) {
            return;
        }

        console.log("units starving");

        for (let i = this.units.length - 1; i >= 0; i--) {
            let unit = this.units[i];
            let starvationAmount = unit.rollStarvation();
            unit.addHealth(starvationAmount * -1);

            //remove dead
            if (unit.health <= 0) {
                this.units.splice(i, 1);
            }
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

    /**
     * if we have food,
     * simulate healing on units.
     */
    simulateHealing() {
        if (this.amountFood == 0)
            return;

        this.units.forEach(unit => {

            if (unit.health == unit.maxHealth)
                return; //continue

            let healAmount = unit.rollHeal();
            unit.addHealth(healAmount);
        });
    }

    /**
     * sorts by health. low to high
     */
    sortUnitsByHealth() {
        this.units.sort(function (x, y) {
            if (x.health < y.health) return -1;
            if (x.health > y.health) return 1;
            return 0;
        });
    }

    /**
     * sorts by health. high to low
     */
    sortUnitsByHealthReverse() {
        this.units.sort(function (x, y) {
            if (x.health < y.health) return 1;
            if (x.health > y.health) return -1;
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

    //TODO: rename rollAttacks
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
