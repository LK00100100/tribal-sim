import Races from "../../Races.js";

import Caveman from "./Caveman.js";
import Gorilla from "./Gorilla";
import Rat from "./Rat.js";

export default class UnitFactory {

    /**
     * Get specific Unit object from race
     * @param {Races} race 
     */
    static getUnit(race) {

        switch (race) {
        case Races.CAVEMEN:
            return new Caveman();
        case Races.GORILLA:
            return new Gorilla();
        case Races.RATS:
            return new Rat();
        default:
            throw "no such race: " + race;
        }

    }

    //TODO: refactor this to get just the unit sprite
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Village} village 
     * @param {Races} race 
     */
    static getUnitSprite(scene, village, race) {

        //TODO: shove in unit?
        //TODO: remove card code stuff
        //TODO: repeat code
        let armySprite;
        switch (race) {
        case Races.CAVEMEN:
            armySprite = scene.add.sprite(village.x, village.y, "armyCaveman")
                .setInteractive()
                .on("pointerdown", scene.armyManager.clickedArmy);
            break;
        case Races.GORILLA:
            armySprite = scene.add.sprite(village.x, village.y, "armyGorilla")
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