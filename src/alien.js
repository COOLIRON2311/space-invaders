import GameObject from './base/gameobject';
import Sprite from './sprite';

export default class Alien extends GameObject {
    /** @type {Sprite} */ #spriteA;
    /** @type {Sprite} */ #spriteB;
    /** @type {boolean} */ killed;

    /**
     * @param {number} x
     * @param {number} y
     * @param {Sprite[]} sprites
     */
    constructor(x, y, [spriteA, spriteB]) {
        super(x, y, spriteA.w, spriteA.h);
        this.x = x;
        this.y = y;
        this.killed = false;
        this.#spriteA = spriteA;
        this.#spriteB = spriteB;
    }

    /**
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
        this.AABB.draw(ctx);
    }
}
