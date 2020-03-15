import Farm from "./villageBuildings/Farm.js";
import LumberMill from "./villageBuildings/LumberMill.js";
import Quarry from "./villageBuildings/Quarry.js";
import Housing from "./villageBuildings/Housing.js";
import Village from "./villageBuildings/Village.js";

export default class BuildingFactory {

    //TODO: use enums like races
    static getVillageBuilding(buildingType, row, col, village) {
        let player = village.player;

        switch (buildingType) {
        case "Farm":
            return new Farm(row, col, player, village);
        case "LumberMill":
            return new LumberMill(row, col, player, village);
        case "Quarry":
            return new Quarry(row, col, player, village);
        case "Housing":
            return new Housing(row, col, player, village);
        case "Village":
            return new Village(row, col, player);
        default:
            throw "no such building type: " + buildingType;
        }
    }

}
