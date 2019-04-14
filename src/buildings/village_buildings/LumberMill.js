import VillageBuilding from './VillageBuilding.js';

export default class LumberMill extends VillageBuilding {

    constructor(row, col, x, y, player, village) {
        super(row, col, x, y, player, village);
        this.health = 300;
    }

}
