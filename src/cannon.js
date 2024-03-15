import Sprite from './sprite';

export default class Cannon {
    /** @type {Sprite} */ #sprite;

    /**
     * @param {number} x
     * @param {number} y
     * @param {Sprite} sprite
     */
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.#sprite = sprite;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} time
     */
    draw(ctx, time) {
        ctx.drawImage(
            this.#sprite.img,
            this.#sprite.x, this.#sprite.y, this.#sprite.w, this.#sprite.h,
            this.x, this.y, this.#sprite.w, this.#sprite.h
        );
    }
}
