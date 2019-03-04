
export default class Unit {

    constructor(health) {
        this.health = health;
    }

    cost(){
        return 1;
    }

    getMovementMax(){
        return 1;
    }

}