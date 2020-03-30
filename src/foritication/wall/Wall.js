import Fortication from "../Fortification";

export default class Wall extends Fortication {

    constructor(row, col) {
        super(row, col);

        this.health = 100;

        this.costStone = 0;
        this.costWood = 0;
    }

}
