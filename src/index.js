
import Phaser from "../node_modules/phaser/src/phaser";
import SceneGame from "./SceneGame.js";

var sceneGame = new SceneGame();

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: [sceneGame]  //TODO: put more scenes here. main menu?
};

window.game = new Phaser.Game(config);
