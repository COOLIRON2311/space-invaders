import GameObject from './base/gameobject';

export default class Bullet extends GameObject{
    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ w;
    /** @type {number} */ h;
    /** @type {string} */ color;
    /** @type {boolean} */ hit;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} vy
     * @param {number} w
     * @param {number} h
     * @param {string} color
     */
    constructor(x, y, vy, w, h, color) {
        super(x, y, w, h);
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.color = color;
        this.hit = false;
    }

    /**
     * @param {number} time
     */
    update(time) {
        this.y += this.vy;
        this.AABB.y += this.vy;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
