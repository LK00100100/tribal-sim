import Building from "./Building.js";

export default class Village extends Building {

    constructor(row, col, x, y, player, name) {
        super(row, col, x, y, player);

        this.name = name;

        this.villageId;
        this.population;

        this.amountFood;
        this.amountStone;
        this.amountWood;

        this.incomeFood = 20;
        this.incomeStone = 5;
        this.incomeWood = 10;
    }

    calculateDay() {
        //note: population growth is always there even with a population of one
        let populationGrowth = Math.floor(this.population * 0.01);

        if (populationGrowth < 1)
            populationGrowth = 1;

        this.population += populationGrowth;

        this.amountFood += this.incomeFood;
        this.amountStone += this.incomeStone;
        this.amountWood += this.incomeWood;
    }

}
