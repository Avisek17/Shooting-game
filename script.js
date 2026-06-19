const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

let playerX = 275;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

let bullets = [];
let enemies = [];

let spawnInterval;
let gameLoopInterval;

highScoreText.textContent = highScore;


function startGame() {
    const splash = document.getElementById("splash");

    splash.style.opacity = "0";
    splash.style.transition = "0.5s ease";

    setTimeout(() => {
        splash.style.display = "none";
        gameArea.style.display = "block";

        startGameLoop();
    }, 500);
}


function startGameLoop() {

    score = 0;
    scoreText.textContent = score;

    bullets = [];
    enemies = [];

    spawnInterval = setInterval(spawnEnemy, 1000);

    gameLoopInterval = setInterval(() => {

        
        for (let i = bullets.length - 1; i >= 0; i--) {

            bullets[i].y -= 10;
            bullets[i].element.style.top = bullets[i].y + "px";

            if (bullets[i].y < 0) {
                bullets[i].element.remove();
                bullets.splice(i, 1);
            }
        }

        
        for (let i = enemies.length - 1; i >= 0; i--) {

            enemies[i].y += 3;
            enemies[i].element.style.top = enemies[i].y + "px";

            const playerBox = {
                x: player.offsetLeft,
                y: player.offsetTop,
                width: player.offsetWidth,
                height: player.offsetHeight
            };

            const enemyBox = {
                x: enemies[i].x,
                y: enemies[i].y,
                width: 60,
                height: 50
            };

            if (hit(playerBox, enemyBox)) {
                endGame();
            }

            
            for (let j = bullets.length - 1; j >= 0; j--) {

                const bulletBox = {
                    x: bullets[j].element.offsetLeft,
                    y: bullets[j].y,
                    width: 6,
                    height: 18
                };

                if (hit(bulletBox, enemyBox)) {

                    bullets[j].element.remove();
                    bullets.splice(j, 1);

                    enemies[i].element.remove();
                    enemies.splice(i, 1);

                    score += 10;
                    scoreText.textContent = score;

                    break;
                }
            }
        }

    }, 20);
}


document.addEventListener("keydown", e => {

    const maxX = gameArea.clientWidth - player.offsetWidth;

    if (e.key === "ArrowLeft") playerX -= 20;
    if (e.key === "ArrowRight") playerX += 20;
    if (e.code === "Space") shoot();

    playerX = Math.max(0, Math.min(maxX, playerX));
    player.style.left = playerX + "px";
});


function shoot() {
    const bullet = document.createElement("div");
    bullet.className = "bullet";

    bullet.style.left = (playerX + 18) + "px";
    bullet.style.top = player.offsetTop + "px";

    gameArea.appendChild(bullet);

    bullets.push({
        element: bullet,
        y: player.offsetTop
    });
}


function spawnEnemy() {
    const enemy = document.createElement("div");
    enemy.className = "enemy";

    const x = Math.random() * (gameArea.clientWidth - 60);

    enemy.style.left = x + "px";
    enemy.style.top = "-40px";

    gameArea.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: x,
        y: -40
    });
}


function hit(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


function endGame() {

    clearInterval(spawnInterval);
    clearInterval(gameLoopInterval);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        alert("New High Score: " + score);
    } else {
        alert("Game Over! Score: " + score);
    }

    location.reload();
}

//TOUCH CONTROL (MOBILE)
let touchX = 0;

gameArea.addEventListener("touchstart", e => {
    touchX = e.touches[0].clientX;
});

gameArea.addEventListener("touchmove", e => {

    let newX = e.touches[0].clientX;
    let diff = newX - touchX;

    playerX += diff * 0.2;

    const maxX = gameArea.clientWidth - player.offsetWidth;
    playerX = Math.max(0, Math.min(maxX, playerX));

    player.style.left = playerX + "px";

    touchX = newX;
});

//COPYRIGHT MODAL
const copyrightBtn = document.getElementById("copyrightBtn");
const copyrightModal = document.getElementById("copyrightModal");

copyrightBtn.onclick = () => {
    copyrightModal.style.display = "flex";
};

function closeCopyright() {
    copyrightModal.style.display = "none";
}

window.onclick = e => {
    if (e.target === copyrightModal) {
        copyrightModal.style.display = "none";
    }
};