import VillageBuilding from './VillageBuilding.js';

export default class Housing extends VillageBuilding {

    constructor(row, col, x, y, player, village) {
        super(row, col, x, y, player, village);
        this.health = 100;
    }

}
