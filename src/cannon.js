import Sprite from './sprite';

export default class Cannon {
    /**
     * @param {number} x
     * @param {number} y
     * @param {Sprite} sprite
     */
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this._sprite = sprite;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} time
     */
    draw(ctx, time) {
        ctx.drawImage(
            this._sprite.img,
            this._sprite.x, this._sprite.y, this._sprite.w, this._sprite.h,
            this.x, this.y, this._sprite.w, this._sprite.h
        );
    }
}
