
export default class GameUtilsBoard {

    static convertRowToPixel(row) {
        const topY = 512;   //top left corner of the pixel board
        return topY + (row * 256);
    }

    static convertColToPixel(col) {
        const topX = 512;   //top left corner of the pixel board
        return topX + (col * 256);
    }
}