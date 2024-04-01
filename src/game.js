import { Howl } from 'howler';
import Sprite from './base/sprite';
import Cannon from './entities/cannon';
import Bullet from './entities/bullet';
import Bunker from './entities/bunker';
import Alien from './entities/alien';
import InputHandler from './input-handler';
import Rectangle from './base/rectangle';
import Timer from './timer';

import assetPath from '../assets/invaders.png';


//#region Globals
const screen = new Rectangle(0, 0, 600, window.innerHeight);
const score_label = document.getElementById('score');
const cannons_label = document.getElementById('cannons');

/** @type {HTMLImageElement} */
let assets;

const sprites = {
    /** @type {Sprite[][]} */ aliens: [],
    /** @type {Sprite} */     cannon: null,
    /** @type {Sprite} */     bunker: null
};

const sounds = {
    shoot: new Howl({ src: 'assets/sounds/shoot.mp3' }),
    move1: new Howl({ src: 'assets/sounds/move1.mp3' }),
    move2: new Howl({ src: 'assets/sounds/move2.mp3' }),
    move3: new Howl({ src: 'assets/sounds/move3.mp3' }),
    move4: new Howl({ src: 'assets/sounds/move4.mp3' }),
    explosion1: new Howl({ src: 'assets/sounds/explosion1.mp3' }),
    explosion2: new Howl({ src: 'assets/sounds/explosion2.mp3' }),
    win: new Howl({ src: 'assets/sounds/win.mp3' }),
    lose: new Howl({ src: 'assets/sounds/lose.mp3' })
};

const gameState = {
    /** @type {Bullet[]} */ player_bullets: [],
    /** @type {Bullet[]} */ alien_bullets: [],
    /** @type {Bunker[]} */ bunkers: [],
    /** @type {Alien[]} */  aliens: [],
    /** @type {Cannon} */   cannon: null,
    cannons: 3,
    score: 0,
    direction: true,
    move: 0,
    started: false,
    won: false,
    lost: false,
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
    //#region Aliens
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
                new Alien(alienX, alienY, 25, 16, sprites.aliens[alienType])
            );
        }
    }
    //#endregion Aliens

    //#region Bunkers
    for (let i = 0; i < 4; i++) {
        const bunkerX = 102 + i * 120;
        const bunkerY = canvas.height - 120;

        gameState.bunkers.push(new Bunker(bunkerX, bunkerY, sprites.bunker));
    }
    //#endregion Bunkers

    gameState.cannon = new Cannon(100, canvas.height - 50, 4, sprites.cannon);
}

/**
 * Handle user input and update game state
 * @param {number} time
 * @param {CallableFunction} stopGame StopGame.ru
 */
export function update(time, stopGame) {
    // Won if player killed all aliens
    if (gameState.aliens.length === 0) {
        gameState.won = true;
        sounds.win.play();
        stopGame();
    }

    // Lost if all cannons were destroyed
    if (gameState.cannons === 0) {
        gameState.lost = true;
        sounds.lose.play();
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
            gameState.player_bullets.push(new Bullet(bulletX, bulletY, -8, 2, 6, '#fff'));
            sounds.shoot.play();
        }
    }
    //#endregion Handle user input

    // Do not start the game until Space key is pressed
    if (!gameState.started)
        return;

    handlePlayerBullets();

    if (timer.alienShootsNow(time)) {
        randomAlienShoots();
    }

    handleAlienBullets();

    // Cleanup gameState arrays
    gameState.aliens = gameState.aliens.filter(a => !a.killed);
    gameState.player_bullets = gameState.player_bullets.filter(b => !b.hit);
    gameState.alien_bullets = gameState.alien_bullets.filter(b => !b.hit);
    gameState.bunkers = gameState.bunkers.filter(b => b.hp > 0);

    // Update player and enemy bullets
    gameState.player_bullets.forEach(b => b.update(time));
    gameState.alien_bullets.forEach(b => b.update(time));

    // Move aliens and check whether they have landed
    if (moveAliens(time) > screen.bottom - 124) {
        gameState.lost = true;
        sounds.lose.play();
        stopGame();
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

    // screen.draw(ctx);
    // Draw screen borders
    ctx.strokeStyle = 'aliceblue';
    ctx.beginPath();
    ctx.rect(screen.x, screen.y, screen.w, screen.h);
    ctx.stroke();

    gameState.aliens.forEach(a => a.draw(ctx, time));
    gameState.bunkers.forEach(b => b.draw(ctx));
    gameState.cannon.draw(ctx);
    gameState.player_bullets.forEach(b => b.draw(ctx));
    gameState.alien_bullets.forEach(b => b.draw(ctx));

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

function handlePlayerBullets() {
    bullet_loop:
    for (const bullet of gameState.player_bullets) {
        // Handle bullets on the screen
        if (!screen.contains(bullet.AABB)) {
            bullet.hit = true;
            continue;
        }

        // Handle player bullets CD with aliens
        for (let i = gameState.aliens.length - 1; i >= 0; i--) {
            const alien = gameState.aliens[i];

            if (bullet.AABB.intersects(alien.AABB)) {
                alien.killed = true;
                bullet.hit = true;

                gameState.score++;
                // Update score
                score_label.innerText = `Score: ${gameState.score}`;

                sounds.explosion1.play();
                continue bullet_loop; // kill only one alien
            }
        }

        // Handle player bullets CD with bunkers
        for (const bunker of gameState.bunkers) {
            if (bullet.AABB.intersects(bunker.AABB)) {
                bunker.hp--;
                bullet.hit = true;
                continue bullet_loop;
            }
        }
    }
}

function handleAlienBullets() {
    bullet_loop:
    for (const bullet of gameState.alien_bullets) {
        // Handle bullets on the screen
        if (!screen.contains(bullet.AABB)) {
            bullet.hit = true;
            continue;
        }

        // Handle alien bullets CD player
        if (bullet.AABB.intersects(gameState.cannon.AABB)) {
            bullet.hit = true;
            gameState.cannons--;
            // Update cannons
            cannons_label.innerText = `Cannons: ${gameState.cannons}`;

            sounds.explosion2.play();
            continue bullet_loop;
        }

        // Handle alien bullets CD with bunkers
        for (const bunker of gameState.bunkers) {
            if (bullet.AABB.intersects(bunker.AABB)) {
                bullet.hit = true;
                bunker.hp--;

                continue bullet_loop;
            }
        }

    }
}

/**
 * @param {number} time
 * @returns {number} lowest alien position
 */
function moveAliens(time) {
    let lowest = Number.MIN_VALUE;
    if (timer.alienMovesNow(time, gameState.aliens.length)) {
        switch (gameState.move) {
            case 0:
                sounds.move1.play();
                break;
            case 1:
                sounds.move2.play();
                break;
            case 2:
                sounds.move3.play();
                break;
            case 3:
                sounds.move4.play();
                break;
        }
        gameState.move = (gameState.move + 1) % 4;

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
                    if (a.y > lowest)
                        lowest = a.y;
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
                    if (a.y > lowest)
                        lowest = a.y;
                });
            }
        }
    }
    return lowest;
}

/**
 * IMMA FIRIN MAH' LAZER!
 */
function randomAlienShoots() {
    const maxY = Math.max(...gameState.aliens.map(a => a.y));
    const bottom = gameState.aliens.filter(a => a.y === maxY);
    const shooter = bottom[Math.floor(Math.random() * bottom.length)];

    const bulletX = shooter.x + shooter.AABB.w / 2;
    const bulletY = shooter.AABB.bottom;
    gameState.alien_bullets.push(new Bullet(bulletX, bulletY, 4, 2, 6, '#fff'));
}
