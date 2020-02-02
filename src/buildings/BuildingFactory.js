import Farm from "./villageBuildings/Farm.js";
import LumberMill from "./villageBuildings/LumberMill.js";
import Quarry from "./villageBuildings/Quarry.js";
import Housing from "./villageBuildings/Housing.js";
import Village from "./villageBuildings/Village.js";

export default class BuildingFactory {

    //TODO: use enums like races
    //TODO: reduce this method header (x, y)
    static getVillageBuilding(buildingType, row, col, x, y, village) {
        let player = village.player;

        switch (buildingType) {
        case "Farm":
            return new Farm(row, col, x, y, player, village);
        case "LumberMill":
            return new LumberMill(row, col, x, y, player, village);
        case "Quarry":
            return new Quarry(row, col, x, y, player, village);
        case "Housing":
            return new Housing(row, col, x, y, player, village);
        case "Village":
            return new Village(row, col, x, y, player);
        default:
            throw "no such building type: " + buildingType;

        }
    }

}
