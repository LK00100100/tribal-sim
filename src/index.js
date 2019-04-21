
import 'phaser';
import SceneGame from './SceneGame.js';

var sceneGame = new SceneGame();

var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 800,
    scene: [sceneGame]  //TODO: put more scenes here
};

var game = new Phaser.Game(config);
