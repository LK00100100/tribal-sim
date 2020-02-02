import Village from "../buildings/villageBuildings/Village.js";
import Farm from "../buildings/villageBuildings/Farm.js";
import LumberMill from "../buildings/villageBuildings/LumberMill.js";
import Quarry from "../buildings/villageBuildings/Quarry.js";
import Housing from "../buildings/villageBuildings/Housing.js";

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