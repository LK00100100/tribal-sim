import VillageBuilding from "./VillageBuilding";

export default class Farm extends VillageBuilding {

    //TODO: remove x, y (and all the other village buildings)
    constructor(row, col, player, village) {
        super(row, col, player, village);
        this.health = 300;

        this.name = "Farm";
    }

}
