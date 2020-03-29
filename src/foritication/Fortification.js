
/**
 * A man-made structure which alters the landscape.
 * Can have several fortifications per Board square
 * No real owners.
 */
export default class Fortication {

    constructor(row, col) {
        this.row = row;
        this.col = col;

        this.health = 100;
    }

}
