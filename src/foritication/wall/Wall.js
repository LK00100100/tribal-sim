import Fortication from "../Fortification";

export default class Wall extends Fortication {

    constructor(row, col) {
        super(row, col);

        this.name = "Wall";
    }

}
