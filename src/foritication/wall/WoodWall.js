import Wall from "Wall";

export default class WoodWall extends Wall {

    constructor(row, col) {
        super(row, col);

        this.health = 3000;

        this.costWood = 1000;
    }

}
