import TerrainObj from "../board/Terrain";
const { TerrainSpriteName } = TerrainObj;

/**
 * Does Phaser.scene preloading
 */
export default class Preloader {

    /**
     * loads a ton of assets into the Phaser scene
     * @param {Phaser.Scene} scene 
     */
    static preloadAssets(scene) {
        //TODO: make a ton of enums for the keys

        //terrain
        scene.load.image(TerrainSpriteName.GRASS, "assets/tile-grass.png");
        scene.load.image(TerrainSpriteName.OCEAN, "assets/tile-ocean.png");
        scene.load.image(TerrainSpriteName.HILL, "assets/tile-hill.png");
        scene.load.image(TerrainSpriteName.DESERT, "assets/tile-desert.png");
        scene.load.image(TerrainSpriteName.FOREST, "assets/tile-forest.png");
        scene.load.image("tileGrid", "assets/tile-grid.png");

        //buildings
        scene.load.image("buildVillage", "assets/build-village.png");
        scene.load.image("buildRatCave", "assets/build-rat-cave.png");
        scene.load.image("buildFarm", "assets/build-farm.png");
        scene.load.image("buildLumberMill", "assets/build-lumber-mill.png");
        scene.load.image("buildQuarry", "assets/build-quarry.png");
        scene.load.image("buildHousing", "assets/build-housing.png");

        /**
         * ui stuff
         */
        scene.load.image("btnEndTurn", "assets/btn-end-turn.png");

        //ui, village
        scene.load.image("btnCreateArmy", "assets/btn-create-army.png");
        scene.load.image("btnBuildFarm", "assets/btn-build-farm.png");
        scene.load.image("btnBuildQuarry", "assets/btn-build-quarry.png");
        scene.load.image("btnBuildLumberMill", "assets/btn-build-lumber-mill.png");
        scene.load.image("btnBuildHousing", "assets/btn-build-housing.png");

        //ui, buildings
        scene.load.image("btnBuildDestroy", "assets/btn-build-destroy.png");

        //ui, army
        scene.load.image("btnArmyGetUnits", "assets/btn-army-get-units.png");
        scene.load.image("btnArmyDisbandUnits", "assets/btn-army-disband-units.png");
        scene.load.image("btnArmyGetFood", "assets/btn-army-get-food.png");
        scene.load.image("btnArmyGetWood", "assets/btn-army-get-wood.png");
        scene.load.image("btnArmyAttack", "assets/btn-army-attack.png");
        scene.load.image("btnArmyAttackBuilding", "assets/btn-army-attack-building.png");
        scene.load.image("btnArmyBuild", "assets/btn-army-build.png");

        //ui, army build
        scene.load.image("btnArmyCancel", "assets/btn-army-cancel.png");
        scene.load.image("btnArmyBuildEast", "assets/btn-army-build-east.png");
        scene.load.image("btnArmyBuildNorth", "assets/btn-army-build-north.png");
        scene.load.image("btnArmyBuildSouth", "assets/btn-army-build-south.png");
        scene.load.image("btnArmyBuildWest", "assets/btn-army-build-west.png");
        scene.load.image("btnArmyBuildWallWood", "assets/btn-army-build-wall-wood.png");

        //armies
        scene.load.image("armyCat", "assets/army-cat.png");
        scene.load.image("armyCaveman", "assets/army-caveman.png");
        scene.load.image("armyGorilla", "assets/army-gorilla.png");
        scene.load.image("armyMeerkat", "assets/army-meerkat.png");
        scene.load.image("armyRat", "assets/army-rat.png");
        scene.load.image("armyTiger", "assets/army-tiger.png");
    }

}