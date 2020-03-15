import RaceObj from "../../Race";
let {getRaceClass, getRaceSpriteName } = RaceObj;

// eslint-disable-next-line no-unused-vars
import Unit from "./Unit";

import GameUtilsBoard from "../../utils/GameUtilsBoard";

export default class UnitFactory {

    /**
     * Get specific Unit object from race
     * @param {Race} race 
     * @returns {Unit}
     */
    static getUnit(race) {
        return getRaceClass(race);
    }

    /**
     * draws a sprite on the board. does not place the sprite on the game Board
     * 
     * @param {Phaser.Scene} scene 
     * @param {Village} village 
     * @param {Races} race 
     * @returns Phaser Sprite
     */
    static getUnitSprite(scene, row, col, race) {
        let armySprite;
        let x = GameUtilsBoard.convertColToPixel(col);
        let y = GameUtilsBoard.convertRowToPixel(row);
        let spriteName = getRaceSpriteName(race);

        armySprite = scene.add.sprite(x, y, spriteName);
        armySprite.setDataEnabled()
            .setInteractive()
            .on("pointerdown", scene.armyManager.clickedArmy)
            .setDepth(2);

        return armySprite;
    }

}