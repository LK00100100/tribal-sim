import CatAi from "../ai/CatAi";
import CavemanAi from "../ai/CavemanAi";
import GorillaAi from "../ai/GorillaAi";
import MeerkatAi from "../ai/MeerkatAi";
import TigerAi from "../ai/TigerAi";
import RatAi from "../ai/RatAi";

import RaceObj from "../Race";
let { Race } = RaceObj;

// eslint-disable-next-line no-unused-vars
import GameEngine from "../engine/GameEngine";

export default class GameUtilsAi {

    /**
     * Init the the correct ai for the correct race.
     * @param {GameEngine} gameEngine
     * @param {Array<Race>} raceArray 
     */
    static initAiForPlayers(gameEngine, raceArray) {
        let playerAi = [];

        for (let playerNum = 2; playerNum < raceArray.length; playerNum++) {
            let race = raceArray[playerNum];

            let selectedAi;
            //note: could use a dict too.
            switch (race) {

            case Race.CAT:
                selectedAi = CatAi;
                break;
            case Race.CAVEMAN:
                selectedAi = CavemanAi;
                break;
            case Race.GORILLA:
                selectedAi = GorillaAi;
                break;
            case Race.MEERKAT:
                selectedAi = MeerkatAi;
                break;
            case Race.RAT:
                selectedAi = RatAi;
                break;
            case Race.TIGER:
                selectedAi = TigerAi;
                break;
            default:
                throw "race not supported for AI";
            }

            playerAi[playerNum] = new selectedAi(gameEngine, playerNum);
        }

        return playerAi;
    }

}