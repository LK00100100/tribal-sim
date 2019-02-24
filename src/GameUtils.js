
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
}