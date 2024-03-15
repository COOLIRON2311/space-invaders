import { preload, init, update, draw } from './game';

/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = window.innerHeight;

const tickLength = 15; //ms
/** @type {number} */
let lastTick;
/** @type {number} */
let lastRender;
/** @type {number} */
let stopCycle;

/**
 * @param {DOMHighResTimeStamp} [tFrame]
 */
function run(tFrame) {
    stopCycle = window.requestAnimationFrame(run);

    const nextTick = lastTick + tickLength;
    let numTicks = 0;

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - lastTick;
        numTicks = Math.floor(timeSinceTick / tickLength);
    }

    for (let i = 0; i < numTicks; i++) {
        lastTick = lastTick + tickLength;
        update(lastTick, stopGame);
    }

    draw(canvas, tFrame);
    lastRender = tFrame;
}

function stopGame() {
    window.cancelAnimationFrame(stopCycle);
}

function onPreloadComplete() {
    lastTick = performance.now();
    lastRender = lastTick;
    stopCycle = null;
    init(canvas);
    run();
}

preload(onPreloadComplete);
