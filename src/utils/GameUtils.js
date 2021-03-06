
export default class GameUtils {

    static clearTintArray(array) {
        array.forEach(gameObject => gameObject.clearTint());
    }

    /**
     * generates a number from 0 (inclusive) to max (excluding max)
     * @param {*} max 
     */
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * generates a number from min (inclusive) to max (inclusive)
     */
    static getRandomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * returns a new list of intersecting coordinates.
     * @param {Array} coordinates1 an array of {row, col}
     * @param {Array} coordinates2 an array of {row, col}
     * @returns coordinate1's intersecting objects
     */
    static getIntersectionCoordinates(coordinates1, coordinates2) {

        let set2 = new Set();
        let answer = [];

        coordinates2.forEach(coordinate => {
            let row = coordinate.row;
            let col = coordinate.col;

            let key = row + "," + col;
            set2.add(key);
        });

        coordinates1.forEach(coordinate => {
            let row = coordinate.row;
            let col = coordinate.col;

            let key = row + "," + col;

            if (set2.has(key)) {
                answer.push(coordinate);
            }

        });

        return answer;
    }

    /**
     * are these coordinates
     * exactly one vertical or one horizontal space away?
     * @param {*} rowA 
     * @param {*} colA 
     * @param {*} rowB 
     * @param {*} colB 
     */
    static areAdjacent(rowA, colA, rowB, colB) {

        //horizontally adjacent
        if (Math.abs(rowA - rowB) == 0) {
            if (Math.abs(colA - colB) == 1)
                return true;
        }

        //vertically adjacent
        if (Math.abs(colA - colB) == 0) {
            if (Math.abs(rowA - rowB) == 1)
                return true;
        }

        return false;

    }
}