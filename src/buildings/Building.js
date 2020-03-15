
/**
 * 
 */
export default class Building {

    constructor(row, col, x, y, player) {
        this.row = row;
        this.col = col;

        this.x = x;
        this.y = y;

        this.player = player;

        this.health = 100;
    }

}
