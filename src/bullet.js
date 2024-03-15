export default class Bullet {
    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ w;
    /** @type {number} */ h;
    /** @type {string} */ color;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} vy
     * @param {number} w
     * @param {number} h
     * @param {string} color
     */
    constructor(x, y, vy, w, h, color) {
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    /**
     * @param {number} time
     */
    update(time) {
        this.y += this.vy;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
