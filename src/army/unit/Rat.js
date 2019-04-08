import Unit from './Unit.js'

export default class Rat extends Unit {

    constructor(){
        super(20);

        this.attackBase = 1;
        this.attackBonusMin = 0;
        this.attackBonusMax = 4;

        this.defenseBase = 1;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 2;
    }

    //they feast off of the land
    cost(){
        return 0;
    }

    getMovementMax(){
        return 2;
    }
    
}
