/**
 * Holds values related to direction.
 */

let direction  = {
    EAST: "e",
    NORTH: "n",
    SOUTH: "s",
    WEST: "w"
};

//array of all [row, col] directional values
let directionVal = [[0, 1], [-1, 0], [1, 0], [0, -1]];

export default {
    Direction: direction,
    DirectionVal: directionVal,
};
