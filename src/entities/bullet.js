import Entity from '../base/entity';
import Alien from './alien';

export default class Bullet extends Entity {
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
     * Special alien collision detection
     * @param {Alien} alien
     */
    alienCD(alien) {
        const b = this.AABB.copy();
        b.h += alien.AABB.h; // accounts for alien height
        return b.intersects(alien.AABB);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // const bb = this.AABB.copy();
        // bb.h += 16;
        // bb.draw(ctx);
    }
}
