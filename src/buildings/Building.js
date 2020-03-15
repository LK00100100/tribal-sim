import GameUtilsBoard from "../utils/GameUtilsBoard";

/**
 * A main structure owned by a player
 * Only one per board square.
 */
export default class Building {

    constructor(row, col, player) {
        this.row = row;
        this.col = col;

        this.y = GameUtilsBoard.convertRowToPixel(row);
        this.x = GameUtilsBoard.convertColToPixel(col);

        this.player = player;

        this.health = 100;
    }

}
