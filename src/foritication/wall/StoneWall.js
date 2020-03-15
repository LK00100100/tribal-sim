import Wall from "Wall";

export default class StoneWall extends Wall {

    constructor(row, col) {
        super(row, col);

        this.name = "StoneWall";
    }

}
