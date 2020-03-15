import VillageBuilding from "./VillageBuilding.js";

export default class Housing extends VillageBuilding {

    constructor(row, col, player, village) {
        super(row, col, player, village);
        this.health = 300;

        this.name = "Housing";
    }

}
