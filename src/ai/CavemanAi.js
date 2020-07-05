import Village from "../buildings/villageBuildings/Village.js";
import GameUtils from "../utils/GameUtils.js";
import GameUtilsArmy from "../utils/GameUtilsArmy";
import GameUtilsBuilding from "../utils/GameUtilsBuilding.js";
import Ai from "./Ai.js";

// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine.js";

/**
 * 
 * defensive AI
 * does not expand.
 * defends territory
 */
export default class CavemanAi extends Ai {

    /**
     * 
     * @param {GameEngine} gameEngine 
     * @param {Number} playerNumber 
     */
    constructor(gameEngine, playerNumber) {
        super(gameEngine, playerNumber);

        this.territorySize = 1;
        this.threatMemory = 60; //remember threats for 90 days

        this.armyDaysOfFood = 4;

    }

    calculateTurn() {
        console.log("cavemen doing cavemen stuff...");

        let gameEngine = this.gameEngine;

        let village = null; //the last village

        this.buildings.forEach(building => {
            let buildingData = building.data.get("data");

            //do village stuff
            if (buildingData instanceof Village) {
                village = buildingData;
                console.log("---------------------");
                console.log("caveman village:");
                console.log("   village food:" + buildingData.amountFood);
                console.log("   village pop:" + buildingData.population);
                console.log("   village starvation pop:" + buildingData.starvationAmount);

                //get buildable tiles
                let villageBuildingTiles = gameEngine.buildingManager.getVillageBuildings(buildingData);
                let buildingsData = gameEngine.board.getBuildingsData(villageBuildingTiles);
                let buildableTiles = gameEngine.buildingManager.getBuildableNeighbors(villageBuildingTiles);

                //count buildings
                let buildingCounts = GameUtilsBuilding.countBuildings(buildingsData);

                //if we have a spot to build
                if (buildableTiles.length > 0) {
                    //TODO: pick semi-random? based off of distance?
                    let randomIndex = GameUtils.getRandomInt(buildableTiles.length);
                    let pickedTile = buildableTiles[randomIndex];
                    let terrainSprite = gameEngine.board.getTerrain(pickedTile.row, pickedTile.col);

                    this.stageOneBuilding(buildingCounts, building, terrainSprite);

                    if(this.buildingPhase >= 2)
                        this.stageTwoBuilding(buildingCounts, building, terrainSprite);

                    if(this.buildingPhase >= 3)
                        this.stageThreeBuilding(buildingCounts, building, terrainSprite);
                }

            }

        });

        let territory;
        //calculate territory
        if (village != null) {
            let villageBuildings = gameEngine.buildingManager.getVillageBuildings(village);
            let villageNeighbors = gameEngine.board.getFarNeighboringTiles(villageBuildings, this.territorySize);
            territory = villageBuildings.concat(villageNeighbors);

            //get dangerous threats
            let enemySprites = GameUtilsArmy.filterCoordinatesEnemies(gameEngine.board, territory, this.playerNumber);

            //update threats
            enemySprites.forEach(enemySprite => {
                let enemy = enemySprite.getData("data");
                let row = enemy.row;
                let col = enemy.col;
                let key = row + "," + col;

                this.threats.set(key, this.threatMemory);
            });

            //make armies if we're in danger.
            //produce armies to match the threat
            //TODO: change amountFood
            if (this.threats.size > 0) {
                //TODO: "power up" units. wait for more people. perhaps let them recruit more from territory
                if (village.population > (15 * this.buildingPhase) && village.amountFood > 100) {
                    let armySprite = gameEngine.armyManager.createArmyFromVillage(this.playerNumber, village);
                    if (armySprite != null) {

                        let army = armySprite.getData("data");
                        army.name = "Rat Stompers";

                        //TODO: make getUnits(#)
                        if (this.buildingPhase >= 2)
                            gameEngine.armyManager.getUnits(army);

                        if (this.buildingPhase >= 3) {
                            gameEngine.armyManager.getUnits(army);
                        }
                    }

                }
            }
        }

        //TODO: move this code. copy paste. logic is duplicate as rats
        //move and get rid of the danger
        this.armies.forEach(armySprite => {
            let army = armySprite.getData("data");
            let row = army.row;
            let col = army.col;
            let armyVillage = army.village;

            //TODO: loiter and protect. dearm if threats have been forgotten.
            //TODO: randomly but smartly (A*) move towards the direction

            //our village is dead
            if (territory == null)
                return;

            let possibleMovesArmy = gameEngine.armyManager.getPossibleMoves(row, col, army.moveAmount);

            //move in territory
            let territoryMoves = GameUtils.getIntersectionCoordinates(possibleMovesArmy, territory);

            //check adjacent squares for enemy
            let neighbors = gameEngine.board.getNeighboringTiles(army.row, army.col);
            let enemySprite = null;
            neighbors.forEach(neighbor => {
                let unit = gameEngine.board.getUnit(neighbor.row, neighbor.col);

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
                gameEngine.armyManager.simulateArmiesAttacking(army, enemySprite.getData("data"));
            }
            else {
                let enemySprites = GameUtilsArmy.filterCoordinatesEnemies(gameEngine.board, territoryMoves, this.playerNumber);

                let buildingSprite = gameEngine.board.getBuilding(row, col);

                //if we're standing on a building and it's not ours,
                //attack it and end turn
                if (buildingSprite != null) {
                    let building = buildingSprite.getData("data");
                    if (building.player != this.playerNumber) {
                        gameEngine.armyManager.armyAttackBuilding(armySprite, buildingSprite);
                        return;
                    }
                }

                //if there's an enemy in range, move to it and attack it.
                if (enemySprites.length > 0) {
                    let enemySprite = enemySprites[0];
                    let enemyData = enemySprite.getData("data");
                    let targetTerrain = gameEngine.board.getTerrain(enemyData.row, enemyData.col);
                    gameEngine.armyManager.moveArmyCloser(armySprite, targetTerrain);

                    gameEngine.armyManager.simulateArmiesAttacking(army, enemyData);
                }
                //no enemies around
                else {

                    if (territoryMoves.length > 0) {
                        //TODO: move this code. copy paste
                        //pick a random square to move to
                        let pickedIndex = GameUtils.getRandomInt(territoryMoves.length);
                        let pickedCoordinate = territoryMoves[pickedIndex];

                        let terrainSprite = gameEngine.board.getTerrain(pickedCoordinate.row, pickedCoordinate.col);
                        gameEngine.armyManager.moveArmy(armySprite, terrainSprite, territoryMoves);
                    }

                }
            }

            //TODO: in the future, check move counts. food/attack = 1 move each.

            //check if we're in our territory
            let building = gameEngine.board.getBuildingData(row, col);
            if (building != null) {

                //are we in the army's village territory?
                if (building.village == armyVillage) {

                    //threats gone. go to village and dearm
                    if (this.threats.size == 0) {
                        //TODO: dearm
                    }
                }

                //TODO: fix this
                //make sure you have several days worth of food.
                if (army.amountFood <= this.armyDaysOfFood * army.getCostDay()) {
                    for (let i = 0; i < this.armyDaysOfFood; i++)
                        gameEngine.armyManager.getFood(army);
                }

            }

            //TODO: this task
            //prevent starvation. go back to territory

        });

        //slowly forget the danger
        this.threats.forEach((value, key, map) => {
            map.set(key, value - 1);

            if (value - 1 <= 0)
                map.delete(key);
        });
    }

    stageOneBuilding(buildingCounts, village, terrainSprite) {
        let gameEngine = this.gameEngine;
        let countFarm = buildingCounts.countFarm;
        let countHousing = buildingCounts.countHousing;
        let countLumberMill = buildingCounts.countLumberMill;
        let countQuarry = buildingCounts.countQuarry;

        this.buildingPhase = 1;

        if (countLumberMill < 3) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "LumberMill");
            return;
        }

        if (countFarm < 4) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Farm");
            return;
        }

        if (countQuarry < 1) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Quarry");
            return;
        }

        //if we have enough food
        if (countHousing < 3 && countFarm > countHousing) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Housing");
            return;
        }

        this.buildingPhase = 2;

    }

    stageTwoBuilding(buildingCounts, village, terrainSprite) {
        let gameEngine = this.gameEngine;
        let countFarm = buildingCounts.countFarm;
        let countHousing = buildingCounts.countHousing;
        let countLumberMill = buildingCounts.countLumberMill;
        let countQuarry = buildingCounts.countQuarry;

        this.armyDaysOfFood = 8;
        this.territorySize = 2;
        this.buildingPhase = 2;

        if (countLumberMill < 5) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "LumberMill");
            return;
        }

        if (countFarm < 6) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Farm");
            return;
        }

        if (countQuarry < 2) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Quarry");
            return;
        }

        //if we have enough food
        if (countHousing < 6 && countFarm > countHousing) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Housing");
            return;
        }

        this.buildingPhase = 3;
    }

    stageThreeBuilding(buildingCounts, village, terrainSprite) {
        let gameEngine = this.gameEngine;
        let countFarm = buildingCounts.countFarm;
        let countHousing = buildingCounts.countHousing;

        this.armyDaysOfFood = 15;
        this.territorySize = 4;
        this.buildingPhase = 3;

        //stop building!
        if (countHousing >= 8)
            return;

        //expand population
        if (countFarm > countHousing) {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Housing");
        }
        //build more farms
        else {
            gameEngine.buildingManager.placeBuilding(village, terrainSprite, "Farm");
        }
    }

}