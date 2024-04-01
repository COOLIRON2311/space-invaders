import Entity from '../base/entity';
import Sprite from '../base/sprite';

export default class Alien extends Entity {
    /** @type {Sprite} */ #spriteA;
    /** @type {Sprite} */ #spriteB;
    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ vx;
    /** @type {number} */ vy;
    /** @type {boolean} */ killed;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} vx
     * @param {number} vy
     * @param {Sprite[]} sprites
     */
    constructor(x, y, vx, vy, [spriteA, spriteB]) {
        super(x, y, spriteA.w, spriteA.h);
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.killed = false;
        this.#spriteA = spriteA;
        this.#spriteB = spriteB;
    }

    left() {
        this.x -= this.vx;
        this.AABB.x -= this.vx;
    }

    right() {
        this.x += this.vx;
        this.AABB.x += this.vx;
    }

    down() {
        this.y += this.vy;
        this.AABB.y += this.vy;
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
