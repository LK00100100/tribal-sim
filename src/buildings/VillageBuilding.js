import Building from "./Building.js";

export default class VillageBuilding extends Building {

    //TODO: remove x, y. make gameutils convert row -> x
    constructor(row, col, x, y, player, village) {
        super(row, col, x, y, player);

        this.village = village;
    }

}
