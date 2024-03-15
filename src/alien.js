import Sprite from './sprite';

export default class Alien {
    /** @type {Sprite} */ #spriteA;
    /** @type {Sprite} */ #spriteB;

    /**
     * @param {number} x
     * @param {number} y
     * @param {*} param2
     */
    constructor(x, y, [spriteA, spriteB]) {
        this.x = x;
        this.y = y;
        this.#spriteA = spriteA;
        this.#spriteB = spriteB;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} time
     */
    draw(ctx, time) {
        let sp = (Math.ceil(time / 1000) % 2 === 0) ? this.#spriteA : this.#spriteB;

        ctx.drawImage(
            sp.img,
            sp.x, sp.y, sp.w, sp.h,
            this.x, this.y, sp.w, sp.h
        );
    }
}
