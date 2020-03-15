/**
 * Terrain.js
 * Holds Terrain values
 */
//TODO: put this in its own set of classes later

//stored on the board as numbers 
const Terrain = {
    GRASS: 0,
    OCEAN: 1,
    HILL: 2,
    DESERT: 3,
    FOREST: 4,
    getValue: function (terrainKey) {
        return Terrain[terrainKey];
    },
    getKeyByValue: function (value) {
        return Object.keys(Terrain).find(key => Terrain[key] === value);
    }
};

//the name used for Sprites
const TerrainSpriteName = {
    GRASS: "tileGrass",
    OCEAN: "tileOcean",
    HILL: "tileHill",
    DESERT: "tileDesert",
    FOREST: "tileForest",
    getSpriteNameFromNumber: function (terrainNumber) {
        let terrainName = Terrain.getKeyByValue(terrainNumber);

        return TerrainSpriteName[terrainName];
    }
};

//index is terrainVal
const terrainCost = [1, 99999, 2, 3, 1];
const getTerrainMovementCost = function (terrainVal) {
    return terrainCost[terrainVal];
};

export default {
    Terrain: Terrain,
    TerrainSpriteName: TerrainSpriteName,
    getTerrainMovementCost: getTerrainMovementCost
};
