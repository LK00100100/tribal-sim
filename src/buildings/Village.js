import Building from "./Building.js";

export default class Village extends Building {

    constructor(row, col, x, y, player, name){
        super(row, col, x, y, player);

        this.name = name;

        this.villageId;
        this.population;

        this.incomeFood;
        this.incomeStone;
        this.incomeWood;
        
        this.amountFood;
        this.amountStone;
        this.amountWood;
    }

}
