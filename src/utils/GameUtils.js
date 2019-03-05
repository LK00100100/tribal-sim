
export default class GameUtils {

    //input: an array of gameobjects
    static hideGameObjects(array) {
        array.forEach(gameObject => gameObject.visible = false);
    }

    static showGameObjects(array) {
        array.forEach(gameObject => gameObject.visible = true);
    }

    static clearTintArray(array) {
        array.forEach(gameObject => gameObject.clearTint());
    }

    /**
     * generates a number from 0 to max (excluding max)
     * @param {*} max 
     */
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * 
     * @param {*} coordinates1 an array of {row, col}
     * @param {*} coordinates2 an array of {row, col}
     */
    static getIntersectionCoordinates(coordinates1, coordinates2) {

        let set1 = new Set();
        let answer = [];

        coordinates1.forEach(coordinate => {
            let row = coordinate.row;
            let col = coordinate.col;

            let key = row + "," + col;
            set1.add(key);
        });

        coordinates2.forEach(coordinate => {
            let row = coordinate.row;
            let col = coordinate.col;

            let key = row + "," + col;

            if (set1.has(key)) {
                answer.push(coordinate);
            }

        });

        return answer;

    }
}