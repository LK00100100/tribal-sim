import Village from "../buildings/village_buildings/Village";

export default class RatsAi {

    constructor(scene, playerNumber) {
        this.scene = scene;
        this.playerNumber = playerNumber;

        this.armies = scene.playerArmies[playerNumber];
        this.buildings = scene.playerBuildings[playerNumber];
    }

    calculateTurn() {

        this.buildings.forEach(building => {
            let buildingData = building.data.get("data");

            if (buildingData instanceof Village) {
                console.log("rat village:");
                console.log("   rat village food:" + buildingData.amountFood);
                console.log("   rat village pop:" + buildingData.population);
                console.log("   rat village starvation pop:" + buildingData.starvationAmount);

                //constantly produce rat armies when you can
                if (buildingData.population >= 20) {
                    //scene.armyManager.createArmy();
                }

            }

        });

        this.armies.forEach(army => {
        });

    }

}