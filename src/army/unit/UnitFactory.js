import RaceObj from "../../Race";
let {getRaceClass, getRaceSpriteName } = RaceObj;

// eslint-disable-next-line no-unused-vars
import Unit from "./Unit";

import GameUtilsBoard from "../../utils/GameUtilsBoard";
// eslint-disable-next-line no-unused-vars
import SceneGame from "../../SceneGame";

/**
 * This class makes it easier to create units and unit sprites.
 */
export default class UnitFactory {

    /**
     * Get specific Unit object from race
     * @param {Race} race 
     * @returns {Unit}
     */
    static getUnit(race) {
        let unitClass = getRaceClass(race);
        return new unitClass();
    }

    /**
     * Draws a sprite on the board. 
     * Does not place the sprite on the game Board
     * 
     * @param {SceneGame} gameScene 
     * @param {Village} village 
     * @param {Races} race 
     * @returns Phaser Sprite
     */
    static drawUnitSprite(gameScene, row, col, race) {
        let gameEngine = gameScene.gameEngine;

        let armySprite;
        let x = GameUtilsBoard.convertColToPixel(col);
        let y = GameUtilsBoard.convertRowToPixel(row);
        let spriteName = getRaceSpriteName(race);

        armySprite = gameScene.add.sprite(x, y, spriteName);
        armySprite.setDataEnabled()
            .setInteractive()
            .on("pointerdown", gameEngine.armyManager.clickedArmy)
            .setDepth(2);

        return armySprite;
    }

}