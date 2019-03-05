import Unit from './Unit.js'

export default class Rat extends Unit {

    constructor(){
        super(20);
    }

    cost(){
        return 0;
    }

    getMovementMax(){
        return 2;
    }
    
}
