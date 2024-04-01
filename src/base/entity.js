import Rectangle from './rectangle';

export default class Entity {
    /** @type {Rectangle} Axis-Aligned Bounding Box */ AABB;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    constructor(x, y, w, h) {
        this.AABB = new Rectangle(x, y, w, h);
    }
}
