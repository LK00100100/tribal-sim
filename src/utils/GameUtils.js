
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

    static getRandomBoolean() {

        let n = this.getRandomInt(2);

        if (n == 0)
            return true;

        return false;

    }
}