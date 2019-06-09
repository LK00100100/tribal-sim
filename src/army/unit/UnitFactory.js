import Races from "../../Races.js";

import Caveman from "./Caveman.js";
import Rat from "./Rat.js";

export default class UnitFactory {

    static getUnit(race) {

        switch (race) {
        case Races.CAVEMEN:
            return new Caveman();
        case Races.RATS:
            return new Rat();
        default:
            throw "no such race: " + race;
        }

    }

    static getUnitSprite(scene, village, race) {

        //TODO: remove card code stuff
        //TODO: repeat code
        let armySprite;
        switch (race) {
        case Races.CAVEMEN:
            armySprite = scene.add.sprite(village.x, village.y, "armyCaveman")
                .setInteractive()
                .on("pointerdown", scene.armyManager.clickedArmy);
            break;
        case Races.RATS:
            armySprite = scene.add.sprite(village.x, village.y, "armyRat")
                .setInteractive()
                .on("pointerdown", scene.armyManager.clickedArmy);
            break;
        default:
            throw "no such race: " + race;
        }

        armySprite.setDataEnabled()
            .setDepth(2);

        return armySprite;

    }

}