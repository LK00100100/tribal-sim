
import Phaser from "../node_modules/phaser/src/phaser";
import SceneGame from "./SceneGame.js";
import GameEngine from "./engine/GameEngine";

var gameEngine = new GameEngine();
var sceneGame = new SceneGame(gameEngine);

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: [sceneGame]  //TODO: put more scenes here. main menu?
};

window.game = new Phaser.Game(config);
