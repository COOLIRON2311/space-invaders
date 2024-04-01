import Entity from '../base/entity';
import Sprite from '../base/sprite';

export default class Bunker extends Entity {
    /** @type {Sprite} */ #sprite;
    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ hp;


    /**
     * @param {number} x
     * @param {number} y
     * @param {Sprite} sprite
     */
    constructor(x, y, sprite) {
        super(x, y, sprite.w, sprite.h);
        this.x = x;
        this.y = y;
        this.#sprite = sprite;
        this.hp = 10;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(
            this.#sprite.img,
            this.#sprite.x, this.#sprite.y,
            this.#sprite.w, this.#sprite.h,
            this.x, this.y, this.#sprite.w, this.#sprite.h
        );

        ctx.fillText(this.hp.toString(), this.x, this.y);
        // this.AABB.draw(ctx);
    }
}
