import Village from '../buildings/village_buildings/Village.js';
import GameUtils from '../utils/GameUtils.js';
import GameUtilsArmy from '../utils/GameUtilsArmy.js';
import GameUtilsBuilding from '../utils/GameUtilsBuilding.js';
import Caveman from '../army/unit/Caveman.js';
import Ai from './Ai.js';

export default class CavemenAi extends Ai {

    constructor(scene, playerNumber) {
        super(scene, playerNumber, scene.playerArmies[playerNumber], scene.playerBuildings[playerNumber])
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
                let villageBuildingTiles = scene.board.getVillageBuildings(buildingData);
                let buildingsData = scene.board.getBuildingsData(villageBuildingTiles);
                let buildableTiles = scene.board.getBuildableNeighbors(villageBuildingTiles);

                //count buildings
                let buildingCounts = GameUtilsBuilding.countBuildings(buildingsData);
                let countFarm = buildingCounts.countFarm;
                let countHousing = buildingCounts.countHousing;
                let countLumberMill = buildingCounts.countLumberMill;
                let countQuarry = buildingCounts.countQuarry;

                //if we have a spot to build
                if (buildableTiles.length > 0) {
                    //TODO: pick semi-random? based off of distance?
                    let randomIndex = GameUtils.getRandomInt(buildableTiles.length);
                    let pickedTile = buildableTiles[randomIndex];
                    let terrainSprite = scene.board.getTerrain(pickedTile.row, pickedTile.col);

                    if (countLumberMill < 3) {
                        scene.board.placeBuilding(building, terrainSprite, "LumberMill");
                    }

                    if (countFarm < 4) {
                        scene.board.placeBuilding(building, terrainSprite, "Farm");
                    }

                    if (countQuarry < 2) {
                        scene.board.placeBuilding(building, terrainSprite, "Quarry");
                    }

                    //if we have enough food
                    if (countHousing < 3 && countFarm > countHousing) {
                        scene.board.placeBuilding(building, terrainSprite, "Housing");
                    }
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


}