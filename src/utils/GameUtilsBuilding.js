import Village from "../buildings/village_buildings/Village.js";
import Farm from "../buildings/village_buildings/Farm.js";
import LumberMill from "../buildings/village_buildings/LumberMill.js";
import Quarry from "../buildings/village_buildings/Quarry.js";
import Housing from "../buildings/village_buildings/Housing.js";

export default class GameUtilsBuilding {

    static countBuildings(connectedBuildings) {

        let countsOfBuildings = {
            countFarm: 0,
            countLumberMill: 0,
            countQuarry: 0,
            countHousing: 0,
            countVillage: 0
        };

        connectedBuildings.forEach(building => {

            if (building instanceof Village) {
                countsOfBuildings.countVillage++;
            }
            else if (building instanceof Farm) {
                countsOfBuildings.countFarm++;
            }
            else if (building instanceof LumberMill) {
                countsOfBuildings.countLumberMill++;
            }
            else if (building instanceof Quarry) {
                countsOfBuildings.countQuarry++;
            }
            else if (building instanceof Housing) {
                countsOfBuildings.countHousing++;
            }
            else
                console.log("cannot count this building");
        });

        return countsOfBuildings;

    }

}