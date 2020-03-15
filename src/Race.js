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

const RaceSpriteName = [
    "armyCat",
    "armyCaveman",
    "armyGorilla",
    "armyMeerkat",
    "armyRat",
    "armyTiger"
];

//the data class
const RaceClass = [
    Cat,
    Caveman,
    Gorilla,
    Meerkat,
    Rat,
    Tiger
];

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
    Race: Race,
    getRaceClass: getRaceClass,
    getRaceSpriteName: getRaceSpriteName
};
