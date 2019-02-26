
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
    }

    addUnit(unit) {
        this.units.push(unit);
    }

    //returns the complete size of the army    
    size() {

        let total = 0;

        total += this.units.length;

        //TODO: implement wounded later

        return total;

    }

    calculateCostDay() {

        //TODO: complete this later

        return this.units.length;

    }

    calculateAttrition() {

        return;
    }

}
