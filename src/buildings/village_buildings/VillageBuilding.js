import Building from '../Building.js';

/**
 * A building connected to a village
 */
export default class VillageBuilding extends Building {

    //TODO: remove x, y. make gameutils convert row -> x
    constructor(row, col, x, y, player, village) {
        super(row, col, x, y, player);

        this.village = village;
    }

}
