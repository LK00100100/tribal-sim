import Races from "../../Races";

import Caveman from "./Caveman";
import Gorilla from "./Gorilla";
import Meerkat from "./Meerkat";
import Rat from "./Rat.js";
import Tiger from "./Tiger";
// eslint-disable-next-line no-unused-vars
import Unit from "./Unit";

export default class UnitFactory {

    /**
     * Get specific Unit object from race
     * @param {Races} race 
     * @returns {Unit}
     */
    static getUnit(race) {

        //TODO: singular noun
        //TODO: array? or map?
        switch (race) {
        case Races.CAVEMEN:
            return new Caveman();
        case Races.GORILLA:
            return new Gorilla();
        case Races.MEERKAT:
            return new Meerkat();
        case Races.RATS:
            return new Rat();
        case Races.TIGER:
            return new Tiger();
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
        //TODO: handle no villages
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
        case Races.MEERKAT:
            armySprite = scene.add.sprite(village.x, village.y, "armyMeerkat")
                .setInteractive()
                .on("pointerdown", scene.armyManager.clickedArmy);
            break;
        case Races.RATS:
            armySprite = scene.add.sprite(village.x, village.y, "armyRat")
                .setInteractive()
                .on("pointerdown", scene.armyManager.clickedArmy);
            break;
        case Races.TIGER:
            armySprite = scene.add.sprite(village.x, village.y, "armyTiger")
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