import Farm from "./Farm.js";
import LumberMill from "./LumberMill.js";
import Quarry from "./Quarry.js";

export default class BuildingFactory {

    //TODO: reduce this method header (x, y)
    static getVillageBuilding(buildingType, row, col, x, y, village) {
        let player = village.player;

        switch (buildingType) {
            case "farm":
                return new Farm(row, col, x, y, player, village);
            case "lumberMill":
                return new LumberMill(row, col, x, y, player, village);
            case "quarry":
                return new Quarry(row, col, x, y, player, village);
        }
    }

}
