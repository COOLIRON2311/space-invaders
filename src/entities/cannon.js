import GameObject from '../base/gameobject';
import Sprite from '../base/sprite';

export default class Cannon extends GameObject {
    /** @type {Sprite} */ #sprite;
    /** @type {number} */ vx;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} vx
     * @param {Sprite} sprite
     */
    constructor(x, y, vx, sprite) {
        super(x, y, sprite.w, sprite.h);
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.#sprite = sprite;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} [time]
     */
    draw(ctx, time) {
        ctx.drawImage(
            this.#sprite.img,
            this.#sprite.x, this.#sprite.y, this.#sprite.w, this.#sprite.h,
            this.x, this.y, this.#sprite.w, this.#sprite.h
        );
        this.AABB.draw(ctx);
    }

    left() {
        this.x -= this.vx;
        this.AABB.x -= this.vx;
    }

    right() {
        this.x += this.vx;
        this.AABB.x += this.vx;
    }
}
