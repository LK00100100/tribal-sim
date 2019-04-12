
export default class GameUtilsArmy {

    /**
     * gets a list of coordinates and filters out the list of enemies
     * @param {*} board class
     * @param {*} coordinates an array of {row, col}
     * @param {*} playerNumber you (not an enemy)
     * @returns array of enemy sprites
     */
    static filterCoordinatesEnemies(board, coordinates, playerNumber) {
        let enemies = [];

        coordinates.forEach(coordinate => {
            let unit = board.getUnits(coordinate.row, coordinate.col);
            if (unit == null)
                return;

            if (unit.getData("data").player != playerNumber)
                enemies.push(unit);
        });

        return enemies;
    }
}