import Cat from "./army/unit/Cat";
import Caveman from "./army/unit/Caveman";
import Gorilla from "./army/unit/Gorilla";
import Meerkat from "./army/unit/Meerkat";
import Rat from "./army/unit/Rat";
import Tiger from "./army/unit/Tiger";
// eslint-disable-next-line no-unused-vars
import Unit from "./army/unit/Unit";

/**
 * A bunch of enums associated with Race
 */

const Race = {
    CAT: 0,
    CAVEMAN: 1,
    RAT: 2,
    MEERKAT: 3,
    TIGER: 4,
    GORILLA: 5
};

//same order as Race
const RaceSpriteName = [
    "armyCat",
    "armyCaveman",
    "armyRat",
    "armyMeerkat",
    "armyTiger",
    "armyGorilla"
];

//the data class. same order as race
const RaceClass = [
    Cat,
    Caveman,
    Rat,
    Meerkat,
    Tiger,
    Gorilla
];

/**
 * 
 * @param {Number} race enum number from race
 */
let getRaceSpriteName = function (race) {
    return RaceSpriteName[race];
};

/**
 * get the Unit class that represents this race
 * @param {Race} race
 * @returns {Unit}
 */
let getRaceClass = function(race){
    return RaceClass[race];
};

export default {
    Race,
    getRaceClass,
    getRaceSpriteName
};
