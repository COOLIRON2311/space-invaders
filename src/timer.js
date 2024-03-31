export default class Timer {
    /** @type {number} */ #alien_moves;
    /** @type {number} */ #player_shoots;

    constructor() {
        this.#alien_moves = 0;
        this.#player_shoots = 0;
    }

    /**
     * @param {number} time
     * @param {number} number_of_aliens
     */
    alienMovesNow(time, number_of_aliens) {
        const second = Math.round(time / ((number_of_aliens + 4) / 60 * 1000));
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
}
