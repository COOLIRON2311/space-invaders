import { Howl } from 'howler';
import Sprite from './sprite';
import Cannon from './cannon';
import Bullet from './bullet';
import Alien from './alien';
import InputHandler from './input-handler';

import assetPath from '../assets/invaders.png';
import Rectangle from './base/rectangle';

const screen = new Rectangle(0, 0, 600, window.innerHeight);
const score_label = document.getElementById('score');
const lives_label = document.getElementById('lives');

/** @type {HTMLImageElement} */
let assets;

const sprites = {
    /** @type {Sprite[][]} */ aliens: [],
    /** @type {Sprite} */     cannon: null,
    /** @type {Sprite} */     bunker: null
};

const sounds = {
    shoot: new Howl({ src: 'assets/sounds/shoot.mp3' }),
    move: new Howl({ src: 'assets/sounds/move.mp3' }),
    explosion: new Howl({ src: 'assets/sounds/explosion.mp3' }),
    win: new Howl({src: 'assets/sounds/win.mp3'}),
    lose: new Howl({src: 'assets/sounds/lose.mp3'})
};

const gameState = {
    /** @type {Bullet[]} */ bullets: [],
    /** @type {Alien[]} */  aliens: [],
    /** @type {Cannon} */   cannon: null,
    /** @type {number} */   lives: 3,
    /** @type {number} */   score: 0
};
const inputHandler = new InputHandler();

/**
 * Load game assets
 * @param {CallableFunction} onPreloadComplete
 */
export function preload(onPreloadComplete) {
    assets = new Image();
    assets.addEventListener('load', () => {
        sprites.cannon = new Sprite(assets, 62, 0, 22, 16);
        sprites.bunker = new Sprite(assets, 84, 8, 36, 24);
        sprites.aliens = [
            [new Sprite(assets, 0, 0, 22, 16), new Sprite(assets, 0, 16, 22, 16)],
            [new Sprite(assets, 22, 0, 16, 16), new Sprite(assets, 22, 16, 16, 16)],
            [new Sprite(assets, 38, 0, 24, 16), new Sprite(assets, 38, 16, 24, 16)]
        ];

        onPreloadComplete();
    });
    assets.src = assetPath;
}

/**
 * Initialize game objects
 * @param {HTMLCanvasElement} canvas
 */
export function init(canvas) {
    const alienTypes = [1, 0, 1, 2, 0, 2];
    for (let i = 0, len = alienTypes.length; i < len; i++) {
        for (let j = 0; j < 10; j++) {
            const alienType = alienTypes[i];

            let alienX = 30 + j * 30;
            let alienY = 30 + i * 30;

            if (alienType === 1) {
                alienX += 3; // (kostyl) aliens of this type is a bit thinner
            }

            gameState.aliens.push(
                new Alien(alienX, alienY, sprites.aliens[alienType])
            );
        }
    }

    gameState.cannon = new Cannon(
        100,
        canvas.height - 100,
        4,
        sprites.cannon
    );
}

/**
 * Handle user input and update game state
 * @param {number} time
 * @param {CallableFunction} stopGame
 */
export function update(time, stopGame) {
    if (inputHandler.isDown('KeyA') || inputHandler.isDown('ArrowLeft')) {
        if (gameState.cannon.x > screen.left)
            gameState.cannon.left();
    }

    if (inputHandler.isDown('KeyD') || inputHandler.isDown('ArrowRight')) {
        if (gameState.cannon.x < screen.right - gameState.cannon.AABB.w - gameState.cannon.vx)
            gameState.cannon.right();
    }

    if (inputHandler.isPressed('Space')) {
        const bulletX = gameState.cannon.x + 10;
        const bulletY = gameState.cannon.y;
        gameState.bullets.push(new Bullet(bulletX, bulletY, -8, 2, 6, '#fff'));
        sounds.shoot.play();
    }

    //#region Handle bullets CD and screen bounds
    for (const bullet of gameState.bullets) {
        // Handle bullets on the screen
        if (!screen.contains(bullet.AABB)) {
            bullet.hit = true;
            continue;
        }
        // Handle bullets CD with aliens
        for (let i = gameState.aliens.length - 1; i >= 0; i--) {
            const alien = gameState.aliens[i];

            if (bullet.AABB.intersects(alien.AABB)) {
                alien.killed = true;
                bullet.hit = true;

                gameState.score++;
                updateScore();

                sounds.explosion.play();
                break; // kill only one alien
            }
        }
        bullet.update(time);

    }
    gameState.bullets = gameState.bullets.filter(b => !b.hit);
    gameState.aliens = gameState.aliens.filter(a => !a.killed);
    //#endregion Handle bullets CD and screen bounds

    if (gameState.aliens.length === 0) {
        // TODO: call gameWin and break game loop
    }
}

/**
 * Draw game scene
 * @param {HTMLCanvasElement} canvas
 * @param {DOMHighResTimeStamp} time
 */
export function draw(canvas, time) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameState.aliens.forEach(a => a.draw(ctx, time));
    gameState.cannon.draw(ctx);
    gameState.bullets.forEach(b => b.draw(ctx));
}

function updateScore() {
    score_label.innerText = `Score: ${gameState.score}`;
}

function updateLives() {
    lives_label.innerText = `Lives: ${gameState.lives}`;
}

function gameWin() {
    if (!sounds.win.playing())
        sounds.win.play();
}
