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

                let villageBuildings = scene.board.getVillageBuildings(buildingData);
                let buildingCounts = GameUtilsBuilding.countBuildings(villageBuildings);
                
                let countFarm = buildingCounts.countFarm;
                let countHousing = buildingCounts.countHousing;
                let countLumberMill = buildingCounts.countLumberMill;
                let countQuarry = buildingCounts.countQuarry;
                
                if(countLumberMill <= 3){

                }

                if(countFarm <= 3){
                    
                }

                //if we have enough food
                if(buildingData.amountFood > 1 && countHousing <= 3){


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