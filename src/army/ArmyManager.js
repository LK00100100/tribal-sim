
/**
 * Manages army data on the board.
 */
export default class ArmyManager{

    constructor(scene){
        this.scene = scene;
    }

    moveArmy(spriteArmy, squareTerrain) {

        let army = spriteArmy.data.get("data");

        let targetRow = squareTerrain.data.get("row");
        let targetCol = squareTerrain.data.get("col");

        console.log("terrain right clicked with army");

        //highlight allowed movement
        console.log("squareTerrain.x: " + squareTerrain.x);
        console.log("squareTerrain.y: " + squareTerrain.y);

        //move visually and internally (row, col);

        let cost = this.getMovementCost(targetRow, targetCol);

        if (cost > army.moveAmount)
            return;

        //remove army
        this.scene.board.removeArmy(army.row, army.col);
        this.scene.board.unhighlightTiles(this.selectedArmyPossibleMoves);

        army.moveAmount -= cost;
        army.row = targetRow;
        army.col = targetCol;

        this.scene.updateTextArmy(army);

        //place army
        //TODO: dont make it a direct move.
        this.scene.tweens.add({
            targets: this.selectedArmy,
            x: squareTerrain.x,
            y: squareTerrain.y,
            ease: 'Linear',
            duration: 500
        });

        this.getPossibleArmyMoves(army);
        this.scene.board.highlightTiles(this.selectedArmyPossibleMoves);
        this.scene.board.addArmy(targetRow, targetCol, spriteArmy);

        this.scene.armyShowReplenishButtons(army);

    }

    //call getPossibleArmyMoves first
    getMovementCost(row, col) {

        let target = null;

        for (let i = 0; i < this.scene.selectedArmyPossibleMoves.length; i++) {
            let move = this.scene.selectedArmyPossibleMoves[i];

            if (move.row == row && move.col == col) {
                target = move;
                break;
            }
        };

        if (target == null) {
            console.log("not a possible move");
            return 9999;
        }

        return target.cost;

    }

    getPossibleArmyMoves(army) {

        let possibleMoves = [];

        let startPoint = {
            row: army.row,
            col: army.col,
            cost: 0
        }

        let coordinate = army.row + "," + army.col;

        let visited = new Set();
        visited.add(coordinate);

        //up, down, left, right
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        let armyMoveAmount = army.moveAmount;

        let tempSquare;

        let queue = [];
        queue.push(startPoint);

        while (queue.length > 0) {

            let queueLength = queue.length;
            queue.sort();

            let smallestMove = queue[0].cost;

            //check around this level
            for (let x = 0; x < queueLength; x++) {
                tempSquare = queue.shift();

                let row = tempSquare.row;
                let col = tempSquare.col;
                let cost = tempSquare.cost;

                //too costly for now.
                if (cost > smallestMove) {
                    queue.push(tempSquare);
                    continue;
                }

                //check up, down, left, right
                for (let d = 0; d < directions.length; d++) {
                    let i = directions[d][0];
                    let j = directions[d][1];

                    coordinate = (row + i) + "," + (col + j);

                    if (visited.has(coordinate))
                        continue;

                    visited.add(coordinate);

                    if (this.scene.board.isWalkable(row + i, col + j)) {
                        let terrainCost = this.scene.board.movementCost(row + i, col + j);

                        if (armyMoveAmount >= cost + terrainCost) {

                            tempSquare = {
                                row: row + i,
                                col: col + j,
                                cost: cost + terrainCost
                            };

                            possibleMoves.push(tempSquare);
                            queue.push(tempSquare);
                        }
                    }

                }

            }

        }

        this.scene.selectedArmyPossibleMoves = possibleMoves;
    }

}