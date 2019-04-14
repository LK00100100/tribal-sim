import VillageBuilding from './VillageBuilding.js';
import Races from '../../Races.js';

export default class Village extends VillageBuilding {

    constructor(row, col, x, y, player, name) {
        super(row, col, x, y, player);
        this.village = this;

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

        //when people are starving, this is calculated only once and reused.
        this.starvationAmount = 0;

        this.health = 1000;
    }

    /**
     * @param {*} connectedBuildings a list of connected buildings data
     */
    calculateDay(countsOfBuildings) {

        this.calculateIncome(countsOfBuildings);

        this.simulatePopulationGrowth(countsOfBuildings.countHousing);

        //TODO: simulate starvation abandonment

        //TODO: simulate abandoned settlement

        this.amountFood += this.incomeFood;

        if (this.amountFood < 0)
            this.amountFood = 0;

        //rats cant gather wood and stone
        if (this.race == Races.RATS)
            return;

        this.amountStone += this.incomeStone;
        this.amountWood += this.incomeWood;
    }

    simulatePopulationGrowth(countHousing) {
        //TODO: different races grow at different rates

        //simulate starvation (always 1 if starving)
        if (this.amountFood == 0 && this.starvationAmount == 0) {
            this.starvationAmount = Math.ceil(this.population / 20);
        }

        if (this.amountFood > 0)
            this.starvationAmount = 0;

        //note: population growth is always there even with a population of one
        if (this.starvationAmount == 0) {
            let populationGrowth = this.getPopulationGrowthDay();

            this.population += populationGrowth;

            //TODO: dont hard code. pull this out to a function
            //village itself + housing
            let maxPopulation = 20 + (countHousing * 20);

            if (this.population > maxPopulation)
                this.population = maxPopulation;

        }
        //starvation
        else {
            this.population -= this.starvationAmount;
        }

    }

    getPopulationGrowthDay(countHousing) {

        if (this.starvationAmount > 0)
            return this.starvationAmount * -1;

        if(this.population == 0)
            return 0;

        let populationGrowth = Math.floor(this.population * 0.01);

        if (populationGrowth < 1)
            populationGrowth = 1;

        //TODO: dont hard code
        //village itself + housing
        let maxPopulation = 20 + (countHousing * 20);

        if (this.population >= maxPopulation)
            return 0;

        return populationGrowth;
    }

    calculateIncome(countsOfBuildings) {

        if(this.population == 0){
            this.incomeFood = 0;
            this.incomeStone = 0;
            this.incomeWood = 0;
            return;
        }

        //income = village itself + (building * amount)
        this.incomeFood = 20 + (countsOfBuildings.countFarm * 15);
        this.incomeFood -= this.population;

        this.incomeStone = 5 + (countsOfBuildings.countQuarry * 5);
        this.incomeWood = 10 + (countsOfBuildings.countLumberMill * 10);

    }

}
