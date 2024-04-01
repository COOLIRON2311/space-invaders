export default class Rectangle {
    /** @type {number} Top left corner X   */ x;
    /** @type {number} Top left corner Y   */ y;
    /** @type {number} Width (right down)  */ w;
    /** @type {number} Height (right down) */ h;

    /**
     * @param {number} x Top left corner X
     * @param {number} y Top left corner Y
     * @param {number} w Width
     * @param {number} h Height
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.w;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.h;
    }

    get center() {
        return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    }

    get size() {
        return { x: this.w, y: this.h };
    }

    get top_left() {
        return {x: this.x, y: this.y};
    }

    /**
     * @param {Rectangle} rect
     * @returns {boolean}
     */
    contains(rect) {
        return (
            rect.x >= this.x &&
            rect.x < this.x + this.w &&
            rect.y >= this.y &&
            rect.y < this.y + this.h
        );
    }

    /**
     * @param {Rectangle} rect
     * @returns {boolean}
     */
    intersects(rect) {
        return (this.x < rect.x + rect.w)
            && (rect.x < this.x + this.w)
            && (this.y < rect.y + rect.h)
            && (rect.y < this.y + this.w);
    }

    /**
     * Draw `this` rectangle using provided `ctx`
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx, ) {
        const style = ctx.strokeStyle;
        ctx.strokeStyle = '#ff0000';
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.strokeStyle = style;
    }
}
