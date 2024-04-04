export default class Timer {
    /** @type {number} */ #alien_moves;
    /** @type {number} */ #player_shoots;
    /** @type {number} */ #alien_shoots;
    /** @type {number} */ alien_number;

    constructor() {
        this.#alien_moves = 0;
        this.#player_shoots = 0;
        this.#alien_shoots = 0;
        this.alien_number = 64;
    }

    /**
     * @param {number} time
     */
    alienMovesNow(time) {
        const second = Math.round(time / (this.alien_number / 60 * 1000));
        if (second > this.#alien_moves) {
            this.#alien_moves = second + 1;
            return true;
        }
        return false;
    }

    /**
     * @param {number} time
     */
    playerShootsNow(time) {
        const second = Math.round(time / 1000);
        if (second > this.#player_shoots) {
            this.#player_shoots = second;
            return true;
        }
        return false;
    }

    /**
     * @param {number} time
     */
    alienShootsNow(time) {
        const second = Math.round(time / 2000);
        if (second > this.#alien_shoots) {
            this.#alien_shoots = second;
            return true;
        }
        return false;
    }
}
