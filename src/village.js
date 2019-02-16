import Building from "./Building.js";

export default class Village extends Building {

    constructor(row, col, x, y, player, name){
        super(row, col, x, y, player);

        this.name = name;

        this.villageId;
    }

    printTest(){
        console.log("test village");
    }

}
