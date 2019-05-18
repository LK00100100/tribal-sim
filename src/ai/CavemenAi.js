import Village from '../buildings/village_buildings/Village.js';
import GameUtils from '../utils/GameUtils.js';
import GameUtilsArmy from '../utils/GameUtilsArmy.js';
import GameUtilsBuilding from '../utils/GameUtilsBuilding.js';
import Caveman from '../army/unit/Caveman.js';
import Ai from './Ai.js';

export default class CavemenAi extends Ai {

    constructor(scene, playerNumber) {
        super(scene, playerNumber, scene.playerArmies[playerNumber], scene.playerBuildings[playerNumber])

        this.scene = scene;
    }

    calculateTurn() {
        console.log('cavemen doing cavemen stuff...');

        let scene = this.scene;

        this.buildings.forEach(building => {
            let buildingData = building.data.get('data');

            //do village stuff
            if (buildingData instanceof Village) {
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

        this.armies.forEach(armySprite => {
            let armyData = armySprite.getData("data");
            let row = armyData.row;
            let col = armyData.col;
            let village = armyData.village;

        });

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