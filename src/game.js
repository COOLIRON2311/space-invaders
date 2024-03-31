import { Howl } from 'howler';
import Sprite from './base/sprite';
import Cannon from './entities/cannon';
import Bullet from './entities/bullet';
import Alien from './entities/alien';
import InputHandler from './input-handler';
import Rectangle from './base/rectangle';
import Timer from './timer';

import assetPath from '../assets/invaders.png';


//#region Globals
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
    win: new Howl({ src: 'assets/sounds/win.mp3' }),
    lose: new Howl({ src: 'assets/sounds/lose.mp3' })
};

const gameState = {
    /** @type {Bullet[]} */ bullets: [],
    /** @type {Alien[]} */  aliens: [],
    /** @type {Cannon} */   cannon: null,
    lives: 3,
    score: 0,
    direction: true,
    started: false,
    won: false,
    lost: false
};

const timer = new Timer();

const inputHandler = new InputHandler();

//#endregion Globals

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
                new Alien(alienX, alienY,
                    25,
                    16,
                    sprites.aliens[alienType]
                )
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
    if (gameState.aliens.length === 0) {
        gameWin();
        stopGame();
    }

    //#region Handle user input
    if (inputHandler.isDown('KeyA') || inputHandler.isDown('ArrowLeft')) {
        if (gameState.cannon.x > screen.left)
            gameState.cannon.left();
    }

    if (inputHandler.isDown('KeyD') || inputHandler.isDown('ArrowRight')) {
        if (gameState.cannon.x < screen.right - gameState.cannon.AABB.w - gameState.cannon.vx)
            gameState.cannon.right();
    }

    if (inputHandler.isPressed('Space')) {
        gameState.started = true;
        if (timer.playerShootsNow(time)) {
            const bulletX = gameState.cannon.x + 10;
            const bulletY = gameState.cannon.y;
            gameState.bullets.push(new Bullet(bulletX, bulletY, -8, 2, 6, '#fff'));
            sounds.shoot.play();
        }
    }
    //#endregion Handle user input

    // Do not start the game until Space is pressed
    if (!gameState.started)
        return;

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
    }
    gameState.bullets = gameState.bullets.filter(b => !b.hit);
    gameState.aliens = gameState.aliens.filter(a => !a.killed);
    //#endregion Handle bullets CD and screen bounds

    gameState.bullets.forEach(b => b.update(time));

    //#region Move aliens
    if (timer.alienMovesNow(time, gameState.aliens.length)) {
        sounds.move.play();

        if (gameState.direction) { // ->
            let last = Number.MIN_VALUE;
            gameState.aliens.forEach(a => {
                a.right();
                if (a.AABB.right > last)
                    last = a.AABB.right + a.AABB.w;
            });

            if (screen.right <= last) {
                gameState.direction = !gameState.direction;
                gameState.aliens.forEach(a => {
                    a.down();
                });
            }
        }
        else { // <-
            let last = Number.MAX_VALUE;
            gameState.aliens.forEach(a => {
                a.left();
                if (a.AABB.left < last)
                    last = a.AABB.left - a.AABB.w;
            });

            if (last <= screen.left) {
                gameState.direction = !gameState.direction;
                gameState.aliens.forEach(a => {
                    a.down();
                });
            }
        }
    }
    //#endregion Move aliens
}

/**
 * Draw game scene
 * @param {HTMLCanvasElement} canvas
 * @param {DOMHighResTimeStamp} time
 */
export function draw(canvas, time) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    screen.draw(ctx);

    gameState.aliens.forEach(a => a.draw(ctx, time));
    gameState.cannon.draw(ctx);
    gameState.bullets.forEach(b => b.draw(ctx));

    if (gameState.won) {
        ctx.font = '36pt serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 35);
        ctx.fillText('You Win', canvas.width / 2, canvas.height / 2 + 35);
    }

    if (gameState.lost) {
        ctx.font = '36pt serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 35);
        ctx.fillText('You Lose', canvas.width / 2, canvas.height / 2 + 35);
    }
}

function updateScore() {
    score_label.innerText = `Score: ${gameState.score}`;
}

function updateLives() {
    lives_label.innerText = `Lives: ${gameState.lives}`;
}

function gameWin() {
    gameState.won = true;
    sounds.win.play();
}

function gameLose() {
    gameState.lost = true;
    sounds.lose.play();
}
