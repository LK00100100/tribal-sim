import Village from '../buildings/village_buildings/Village';
import GameUtils from '../utils/GameUtils';

export default class RatsAi {

    constructor(scene, playerNumber) {
        this.scene = scene;
        this.playerNumber = playerNumber;

        this.armies = scene.playerArmies[playerNumber];
        this.buildings = scene.playerBuildings[playerNumber];

        this.territorySize = 3;
    }

    calculateTurn() {

        let scene = this.scene;

        this.buildings.forEach(building => {
            let buildingData = building.data.get('data');

            if (buildingData instanceof Village) {
                console.log('rat village:');
                console.log('   rat village food:' + buildingData.amountFood);
                console.log('   rat village pop:' + buildingData.population);
                console.log('   rat village starvation pop:' + buildingData.starvationAmount);

                //constantly produce rat armies when you can
                if (buildingData.population >= 20) {
                    scene.armyManager.createArmy(this.playerNumber, buildingData);
                }

            }

        });

        /**
         * the territory is 3 movement points from the rat cave
         * rats should wander their "territory"
         * rats attack & persue anything within their movement range and within their territory.
         */

        this.armies.forEach(armySprite => {
            let armyData = armySprite.data.get("data");
            let village = armyData.village;

            //TODO: fix this. ignore units on board
            let territory = scene.board.getTerritory(village.row, village.col, this.territorySize);
            let possibleMovesArmy = scene.board.getPossibleMoves(armyData.row, armyData.col, armyData.moveAmount);

            //move in territory
            let territoryMoves = GameUtils.getIntersectionCoordinates(territory, possibleMovesArmy);

            //add itself (no movement)
            let startArmy = { row: armyData.row, col: armyData.col };
            territoryMoves.push(startArmy);

            //TODO: if there's something to attack, then attack

            //otherwise, pick a random square to move to
            let pickedIndex = GameUtils.getRandomInt(territoryMoves.length);
            let pickedCoordinate = territoryMoves[pickedIndex];

            let squareSprite = scene.board.boardTerrainSprites[pickedCoordinate.row][pickedCoordinate.col];

            scene.armyManager.moveArmy(armySprite, squareSprite, territoryMoves);

        });

    }

}