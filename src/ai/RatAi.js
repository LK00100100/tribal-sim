import Village from "../buildings/villageBuildings/Village.js";
import GameUtils from "../utils/GameUtils.js";
import GameUtilsArmy from "../utils/GameUtilsArmy.js";
import Rat from "../army/unit/Rat.js";
import Ai from "./Ai.js";

// eslint-disable-next-line no-unused-vars
import SceneGame from "../SceneGame";

export default class RatAi extends Ai {

    /**
     * 
     * @param {SceneGame} scene 
     * @param {*} playerNumber 
     */
    constructor(scene, playerNumber) {
        super(scene, playerNumber, scene.playerArmies[playerNumber], scene.playerBuildings[playerNumber]);

        this.scene = scene;
        this.territorySize = 3;
        this.reproductionChance = 0.33;
        this.reproduceAmount = 1;
    }

    calculateTurn() {
        console.log("rats doing rat stuff...");
        let scene = this.scene;

        this.buildings.forEach(building => {
            let buildingData = building.data.get("data");

            if (buildingData instanceof Village) {
                console.log("rat village:");
                console.log("   rat village food:" + buildingData.amountFood);
                console.log("   rat village pop:" + buildingData.population);
                console.log("   rat village starvation pop:" + buildingData.starvationAmount);

                //constantly produce rat armies when you can
                if (buildingData.population >= 20) {
                    let armySprite = scene.armyManager.createArmy(this.playerNumber, buildingData);

                    if (armySprite != null)
                        armySprite.getData("data").name = "Wild Rats";
                }

            }

        });

        /**
         * the territory is 3 movement points from the rat cave
         * rats should wander their "territory"
         * rats attack & pursue anything within their movement range and within their territory.
         */

        this.armies.forEach(armySprite => {
            let armyData = armySprite.data.get("data");
            let row = armyData.row;
            let col = armyData.col;
            let village = armyData.village;

            //TODO: fix this. ignore units on board and "move through" them
            let territory = scene.board.getTerritory(village.row, village.col, this.territorySize);
            let possibleMovesArmy = scene.armyManager.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //move in territory
            let territoryMoves = GameUtils.getIntersectionCoordinates(possibleMovesArmy, territory);

            //add itself (no movement)
            let startArmy = { row: armyData.row, col: armyData.col, cost: 0 };
            territoryMoves.push(startArmy);

            //check adjacent squares for enemy
            let neighbors = scene.board.getNeighboringTiles(armyData.row, armyData.col);
            let enemySprite = null;
            neighbors.forEach(neighbor => {
                let unit = scene.board.getUnit(neighbor.row, neighbor.col);

                if (unit == null)
                    return;

                let unitData = unit.getData("data");
                //TODO: actually see if it's an enemy (use set)
                if (unitData.player != this.playerNumber) {
                    enemySprite = unit;
                }
            });

            //attack enemy neighbors
            if (enemySprite != null) {
                scene.armyManager.simulateArmiesAttacking(armyData, enemySprite.getData("data"));
            }
            else {
                let enemySprites = GameUtilsArmy.filterCoordinatesEnemies(scene.board, territoryMoves, this.playerNumber);

                let buildingSprite = scene.board.getBuilding(row, col);

                //if we're standing on a building and it's not ours,
                //attack it and end turn
                if (buildingSprite != null) {
                    let building = buildingSprite.getData("data");
                    if (building.player != this.playerNumber) {
                        scene.armyManager.armyAttackBuilding(armySprite, buildingSprite);
                        return;
                    }
                }

                //if there's an enemy in range, move to it and attack it.
                if (enemySprites.length > 0) {
                    let enemySprite = enemySprites[0];
                    let enemyData = enemySprite.getData("data");
                    let targetTerrain = scene.board.getTerrain(enemyData.row, enemyData.col);
                    scene.armyManager.moveArmyCloser(armySprite, targetTerrain);

                    scene.armyManager.simulateArmiesAttacking(armyData, enemyData);
                }
                //no enemies around
                else {
                    //roll for reproduction. 
                    //if success, reproduce and stop
                    let reproduce = GameUtils.getRandomInt(1 / this.reproductionChance);
                    if (reproduce == 1) {
                        console.log("reproducing at: " + armyData.row + "," + armyData.col);

                        if (armyData.size() < 50) {
                            for (let i = 0; i < this.reproduceAmount; i++) {
                                let rat = new Rat();
                                armyData.addUnit(rat);
                            }
                        }
                        return;
                    }

                    //pick a random square to move to
                    let pickedIndex = GameUtils.getRandomInt(territoryMoves.length);
                    let pickedCoordinate = territoryMoves[pickedIndex];

                    let terrainSprite = scene.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
                    scene.armyManager.moveArmy(armySprite, terrainSprite, territoryMoves);
            
                }
            }

        });

    }

}