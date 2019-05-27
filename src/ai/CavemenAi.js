import Village from '../buildings/village_buildings/Village.js';
import GameUtils from '../utils/GameUtils.js';
import GameUtilsArmy from '../utils/GameUtilsArmy';
import GameUtilsBuilding from '../utils/GameUtilsBuilding.js';
import Ai from './Ai.js';

export default class CavemenAi extends Ai {

    constructor(scene, playerNumber) {
        super(scene, playerNumber, scene.playerArmies[playerNumber], scene.playerBuildings[playerNumber])

        this.scene = scene;

        //stores {row, col, level}. This is the location of threats
        //level is the threat level. Threats will slowly be forgotten with time.
        this.threats = [];

        this.territorySize = 2;
    }

    calculateTurn() {
        console.log('cavemen doing cavemen stuff...');

        let scene = this.scene;

        let villageData = null; //the last village

        this.buildings.forEach(building => {
            let buildingData = building.data.get('data');

            //do village stuff
            if (buildingData instanceof Village) {
                villageData = buildingData;
                console.log('---------------------');
                console.log('caveman village:');
                console.log('   village food:' + buildingData.amountFood);
                console.log('   village pop:' + buildingData.population);
                console.log('   village starvation pop:' + buildingData.starvationAmount);

                //get buildable tiles
                let villageBuildingTiles = scene.buildingManager.getVillageBuildings(buildingData);
                let buildingsData = scene.board.getBuildingsData(villageBuildingTiles);
                let buildableTiles = scene.buildingManager.getBuildableNeighbors(villageBuildingTiles);

                //count buildings
                let buildingCounts = GameUtilsBuilding.countBuildings(buildingsData);

                //if we have a spot to build
                if (buildableTiles.length > 0) {
                    //TODO: pick semi-random? based off of distance?
                    let randomIndex = GameUtils.getRandomInt(buildableTiles.length);
                    let pickedTile = buildableTiles[randomIndex];
                    let terrainSprite = scene.board.getTerrain(pickedTile.row, pickedTile.col);

                    this.stageOneBuilding(buildingCounts, building, terrainSprite);

                    this.stageTwoBuilding(buildingCounts, building, terrainSprite);
                }

            }

        });

        //calculate territory
        if(villageData != null){
            let villageBuildings = scene.buildingManager.getVillageBuildings(villageData);
            let villageNeighbors = scene.board.getFarNeighboringTiles(villageBuildings, this.territorySize);
            let territory = villageBuildings.concat(villageNeighbors);

            //get dangerous threats
            let enemySprites = GameUtilsArmy.filterCoordinatesEnemies(scene.board, territory, this.playerNumber);

            //TODO: make armies (if needed) if we're in danger.
        }   
        
        //move and get rid of the danger
        this.armies.forEach(armySprite => {
            let armyData = armySprite.getData("data");
            let row = armyData.row;
            let col = armyData.col;
            let village = armyData.village;

            //TODO: loiter and protect. dearm if threats have been forgotten.
        });

        //slowly forget the danger
        this.threats.forEach(threat => threat.level = threat.level - 1);
        for (let i = this.threats.length - 1; i >= 0; i--) {
            if (this.threats[i].level <= 0)
                this.threats.splice(i, 1);
        }

    }

    stageOneBuilding(buildingCounts, village, terrainSprite) {
        let scene = this.scene;
        let countFarm = buildingCounts.countFarm;
        let countHousing = buildingCounts.countHousing;
        let countLumberMill = buildingCounts.countLumberMill;
        let countQuarry = buildingCounts.countQuarry;

        if (countLumberMill < 3) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "LumberMill");
        }

        if (countFarm < 4) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "Farm");
        }

        if (countQuarry < 2) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "Quarry");
        }

        //if we have enough food
        if (countHousing < 3 && countFarm > countHousing) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "Housing");
        }
    }

    stageTwoBuilding(buildingCounts, village, terrainSprite) {
        let scene = this.scene;
        let countFarm = buildingCounts.countFarm;
        let countHousing = buildingCounts.countHousing;
        let countLumberMill = buildingCounts.countLumberMill;
        let countQuarry = buildingCounts.countQuarry;

        if (countLumberMill < 6) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "LumberMill");
        }

        if (countFarm < 6) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "Farm");
        }

        if (countQuarry < 4) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "Quarry");
        }

        //if we have enough food
        if (countHousing < 6 && countFarm > countHousing) {
            scene.buildingManager.placeBuilding(village, terrainSprite, "Housing");
        }
    }

}