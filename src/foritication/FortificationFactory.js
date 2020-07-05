
import GameUtilsBoard from "../utils/GameUtilsBoard";
// eslint-disable-next-line no-unused-vars
import SceneGame from "../SceneGame";
// eslint-disable-next-line no-unused-vars
import Fortication from "./Fortification";
import WoodWall from "./wall/WoodWall";

import directionObj from "../board/Direction";
let { Direction } = directionObj;

/**
 * This class makes it easier to create fortications and its sprites.
 */
export default class FortificationFactory {

    /**
     * returns the sprite name
     * @param {Fortication} fortication instance
     * @param {Direction} direction
     * @returns {String}
     */
    static getFortificationSpriteName(fortication, direction) {
        let spriteName = "";
        let orientation;
        if (direction == Direction.WEST || direction == Direction.EAST)
            orientation = "Vertical";
        else if (direction == Direction.NORTH || direction == Direction.SOUTH)
            orientation = "Horizontal";
        else
            throw "not supported!";

        if (fortication instanceof WoodWall)
            spriteName = "fortWallWood";

        if (spriteName == "")
            throw "not supported!";

        return spriteName + orientation;
    }

    /**
     * Returns the drawing offset from the center of a tile.
     * For column offset.
     * @param {Direction} direction 
     */
    static getWallOffsetX(direction) {
        let halfWallThickness = 30 / 2;

        if (direction == Direction.WEST)
            return -128 + halfWallThickness;

        if (direction == Direction.EAST)
            return 128 - halfWallThickness;

        if (direction == Direction.NORTH || direction == Direction.SOUTH)
            return 0;

        throw "not supported";
    }

    /**
     * Returns the drawing offset from the center of a tile.
     * For row offset.
     * @param {Direction} direction 
     */
    static getWallOffsetY(direction) {
        let halfWallThickness = 30 / 2;

        if (direction == Direction.NORTH)
            return -128 + halfWallThickness;

        if (direction == Direction.SOUTH)
            return 128 - halfWallThickness;

        if (direction == Direction.EAST || direction == Direction.WEST)
            return 0;

        throw "not supported";
    }

    /**
     * Draws a new sprite on the gameScene.
     * Attaches fortication to the sprite's "data"
     * Does not place on the board.
     * @param {SceneGame} gameScene 
     * @param {Number} row 
     * @param {Number} col 
     * @param {Fortication} fortification an instance
     * @param {Direction} direction
     * @returns {Phaser.Sprite}
     */
    static drawFortificationSprite(gameScene, row, col, fortication, direction) {
        let gameEngine = gameScene.gameEngine;
        let x = GameUtilsBoard.convertColToPixel(col);
        let y = GameUtilsBoard.convertRowToPixel(row);
        x += FortificationFactory.getWallOffsetX(direction);
        y += FortificationFactory.getWallOffsetY(direction);

        //draw sprite
        let spriteName = FortificationFactory.getFortificationSpriteName(fortication, direction);
        let foriticationSprite = gameScene.add.sprite(x, y, spriteName);
        foriticationSprite.setDataEnabled()
            .setInteractive()
            .on("pointerdown", gameEngine.fortificationManager.clickedFortification)
            .setDepth(3);

        foriticationSprite.data.set("data", fortication);

        //rotate if needed
        if (direction == Direction.EAST || direction == Direction.SOUTH)
            foriticationSprite.angle += 180;

        return foriticationSprite;
    }

}