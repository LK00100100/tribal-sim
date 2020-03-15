import Building from "../Building.js";

/**
 * A building connected to a village.
 * a village is connected to itself.
 */
export default class VillageBuilding extends Building {

    /**
     * 
     * @param {*} row board row
     * @param {*} col board col
     * @param {*} player player number
     * @param {*} village Village data it's linked to
     */
    constructor(row, col, player, village) {
        super(row, col, player);

        this.village = village;
    }

}
