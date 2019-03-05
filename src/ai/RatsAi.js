import Village from '../buildings/village_buildings/Village';

export default class RatsAi {

    constructor(scene, playerNumber) {
        this.scene = scene;
        this.playerNumber = playerNumber;

        this.armies = scene.playerArmies[playerNumber];
        this.buildings = scene.playerBuildings[playerNumber];
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
        let territorySize = 3;

        this.armies.forEach(army => {
            army = army.data.get("data");
            let village = army.village;

            let territory = scene.board.getPossibleMoves(village.row, village.col, territorySize);

            
        });

    }

}