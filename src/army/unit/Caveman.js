import Unit from './Unit.js'

export default class Caveman extends Unit {

    constructor(){
        super(100);

        this.attackBase = 10;
        this.attackBonusMin = 0;
        this.attackBonusMax = 10;

        this.defenseBase = 5;
        this.defenseBonusMin = 0;
        this.defenseBonusMax = 5;
    }

    cost(){
        return 1;
    }

    getMovementMax(){
        return 3;
    }
    
}
