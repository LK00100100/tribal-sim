import Building from "./Building.js";

export default class VillageBuilding extends Building {

    constructor(row, col, x, y, player, village) {
        super(row, col, x, y, player);

        this.village = village;
    }

}
