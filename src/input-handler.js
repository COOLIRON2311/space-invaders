export default class InputHandler {
    /** @type {Map<string, boolean>} */ #down;
    /** @type {Map<string, boolean>} */ #pressed;

    constructor() {
        this.#down = new Map();
        this.#pressed = new Map();
        document.addEventListener('keydown', e => {
            this.#down.set(e.code, true);
        });
        document.addEventListener('keyup', e => {
            this.#down.delete(e.code);
            this.#pressed.delete(e.code);
        });
    }

    /**
     * Returns whether a key is pressed down
     * @param  {String} code the keycode to check
     * @return {boolean} the result from check
     */
    isDown(code) {
        return this.#down.has(code);
    }

    /**
     * Return whether a key has been pressed
     * @param  {String} code the keycode to check
     * @return {boolean} the result from check
     */
    isPressed(code) {
        // if key is registered as pressed return false else if
        // key down for first time return true else return false
        if (this.#pressed.has(code)) {
            return false;
        }

        else if (this.#down.has(code)) {
            this.#pressed.set(code, true);
            return true;
        }
        return false;
    }
}
