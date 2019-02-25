import Building from "./Building.js";
import Races from "../Races.js";

export default class Village extends Building {

    constructor(row, col, x, y, player, name, ) {
        super(row, col, x, y, player);

        this.name = name;

        this.villageId;

        //TODO: cavemen, rats. implement?
        this.race;

        this.population;

        this.amountFood;
        this.amountStone;
        this.amountWood;

        //TODO: remove this hardcoded
        this.incomeFood = 20;
        this.incomeStone = 5;
        this.incomeWood = 10;
    }

    /**
     * @param {*} connectedBuildings a list of connected buildings data
     */
    calculateDay(countsOfBuildings) {

        this.simulatePopulationGrowth(countsOfBuildings.countHousing);

        this.calculateIncome(countsOfBuildings);

        this.amountFood += this.incomeFood;

        //rats cant gather wood and stone
        if (this.race == Races.RATS)
            return;

        this.amountStone += this.incomeStone;
        this.amountWood += this.incomeWood;
    }


    simulatePopulationGrowth(countHousing) {
        //TODO: different races grow at different rates

        //TODO: limit population growth by food and land

        //note: population growth is always there even with a population of one
        let populationGrowth = Math.floor(this.population * 0.01);

        if (populationGrowth < 1)
            populationGrowth = 1;

        this.population += populationGrowth;

        //village itself + housing
        let maxPopulation = 50 + (countHousing * 20);

        if (this.population > maxPopulation)
            this.population = maxPopulation;

    }

    calculateIncome(countsOfBuildings) {

        //income = village itself + (building * amount)
        this.incomeFood = 20 + (countsOfBuildings.countFarm * 20);
        this.incomeStone = 5 + (countsOfBuildings.countQuarry * 20);
        this.incomeWood = 10 + (countsOfBuildings.countLumberMill * 20);

    }

}
