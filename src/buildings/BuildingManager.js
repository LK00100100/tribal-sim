

export default class BuildingManager {

    constructor(scene) {
        this.scene = scene;
    }

    //TODO: move to UI manager?
    clickedDestroyBuilding(pointer) {
        let scene = this.scene;

        console.log("destroying building");

        scene.buildingManager.destroyBuilding(scene.selectedBuilding);

        scene.deselectEverything();
        scene.updateUI();
    }

    /**
     * destroy sprite, remove from board and player
     * @param {*} buildingSprite 
     */
    destroyBuilding(buildingSprite) {
        let scene = this.scene;

        let building = buildingSprite.getData("data");
        let row = building.row;
        let col = building.col;
        let playerNumber = building.player;

        let playerBuildings = scene.playerBuildings[playerNumber];
        for (let i = 0; i < playerBuildings.length; i++) {
            if (playerBuildings[i] == buildingSprite) {
                playerBuildings.splice(i, 1);
                break;
            }
        }

        scene.board.boardBuildings[row][col] = null;
        scene.board.destroyText(row, col);

        buildingSprite.destroy();
    }

}