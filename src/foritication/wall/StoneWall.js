import Wall from "Wall";

//TODO: json of hard values -> singleton -> loads to these files
export default class StoneWall extends Wall {

    constructor(row, col) {
        super(row, col);

        this.health = 15000;

        this.costStone = 10000;
    }

}
