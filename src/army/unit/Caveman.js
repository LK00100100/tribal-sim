import Unit from "./Unit.js"

export default class Caveman extends Unit {

    constructor(){
        super(100);
    }

    cost(){
        return 1;
    }

    getMovementMax(){
        return 3;
    }
    
}
