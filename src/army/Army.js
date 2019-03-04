
export default class Army {

    constructor(row, col, player, village) {

        this.row = row;
        this.col = col;
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

        for(let i = 0; i < this.size(); i++){
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

}
