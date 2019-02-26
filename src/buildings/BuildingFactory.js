import Farm from "./Farm.js";
import LumberMill from "./LumberMill.js";
import Quarry from "./Quarry.js";
import Housing from "./Housing.js";

export default class BuildingFactory {

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
        }
    }

}