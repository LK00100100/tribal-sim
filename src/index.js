
import 'phaser';
import SceneGame from './SceneGame.js';

var sceneGame = new SceneGame();

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: [sceneGame]
};

var game = new Phaser.Game(config);
