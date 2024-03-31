export default class Sprite {
    /** @type {HTMLImageElement} */ img;
    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ w;
    /** @type {number} */ h;


    /**
     * @param {HTMLImageElement} img
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    constructor(img, x, y, w, h) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
