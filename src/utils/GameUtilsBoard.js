
export default class GameUtilsBoard {

    static convertRowToPixel(row){
        return 512 + (row * 256);
    }

    static convertColToPixel(col){
        return 512 + (col* 256);
    }
}