
export default class Village {

    constructor(row, col, x, y, player, name){
        this.row = row;
        this.col = col;

        this.x = x;
        this.y = y;
        
        this.player = player;
        this.name = name;

        this.villageId;
    }

    printTest(){
        console.log("test village");
    }

}
