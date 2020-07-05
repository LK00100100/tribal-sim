/**
 * Holds values related to direction.
 */

let directionEnum = {
    EAST: "e",
    NORTH: "n",
    SOUTH: "s",
    WEST: "w"
};

//array of all [row, col] directional values
let directionVal = [[0, 1], [-1, 0], [1, 0], [0, -1]];

class DirectionUtils {

    /**
     * converts DirectionVal to Direction enum.
     * Throws error if [row,col] doesn't exist in DirectionVal
     * @param {Number} row 
     * @param {Number} col 
     * @returns {direction}
     */
    static convertDirectionValToDirection(row, col) {
        let isFound = false;
        directionVal.forEach(coordinate => {
            let r = coordinate[0];
            let c = coordinate[1];

            if (r == row && c == col)
                isFound = true;
        });

        if (!isFound)
            throw `directionVal doesn't exist: ${row},${col}`;

        if (row == 0 && col == 1)
            return directionEnum.EAST;

        if (row == -1 && col == 0)
            return directionEnum.NORTH;

        if (row == 1 && col == 0)
            return directionEnum.SOUTH;

        if (row == 0 && col == -1)
            return directionEnum.WEST;
    }

    /**
     * Gets the opposite direction. If you give north, you'll get south.
     * If you give east, you'll get west.
     * @param {directionEnum} direction 
     */
    static getOppositeDirection(direction) {
        if (direction == directionEnum.EAST)
            return directionEnum.WEST;

        if (direction == directionEnum.NORTH)
            return directionEnum.SOUTH;

        if (direction == directionEnum.SOUTH)
            return directionEnum.NORTH;

        if (direction == directionEnum.WEST)
            return directionEnum.EAST;

        throw `direction doesn't exist: ${direction}`;
    }
}

export default {
    Direction: directionEnum,
    DirectionVal: directionVal,
    DirectionUtils: DirectionUtils
};
