import Building from "../Building.js";

/**
 * A building connected to a village.
 * a village is connected to itself.
 */
export default class VillageBuilding extends Building {

    //TODO: remove x, y. make gameutils convert row -> x
    /**
     * 
     * @param {*} row board row
     * @param {*} col board col
     * @param {*} x pixel location
     * @param {*} y pixel location
     * @param {*} player player number
     * @param {*} village Village data it's linked to
     */
    constructor(row, col, x, y, player, village) {
        super(row, col, x, y, player);

        this.village = village;
    }

}
