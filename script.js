const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");

let playerX = 275;
let score = 0;

const bullets = [];
const enemies = [];

let spawnInterval;
let gameLoopInterval;


// PLAYER MOVEMENT

document.addEventListener("keydown", e => {

    if(e.key === "ArrowLeft")
        playerX -= 20;

    if(e.key === "ArrowRight")
        playerX += 20;

    if(e.code === "Space")
        shoot();

    const maxX = gameArea.clientWidth - player.offsetWidth;

    playerX = Math.max(0, Math.min(maxX, playerX));

    player.style.left = `${playerX}px`;

});


// SHOOT BULLET

function shoot(){

    const bullet = document.createElement("div");

    bullet.className = "bullet";

    bullet.style.left =
        `${playerX + player.offsetWidth/2}px`;

    bullet.style.top =
        `${player.offsetTop}px`;

    gameArea.appendChild(bullet);

    bullets.push({
        element: bullet,
        y: player.offsetTop
    });

}


// SPAWN ENEMY

function spawnEnemy(){

    const enemy = document.createElement("div");

    enemy.className = "enemy";

    const x =
        Math.random() *
        (gameArea.clientWidth - 40);

    enemy.style.left = `${x}px`;
    enemy.style.top = "-40px";

    gameArea.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: x,
        y: -40
    });

}


// COLLISION CHECK

function hit(a,b){

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}


// CREATE ENEMIES

spawnInterval = setInterval(spawnEnemy, 1000);


// GAME LOOP

gameLoopInterval = setInterval(()=>{

    // MOVE BULLETS

    for(let i = bullets.length-1; i >=0; i--){

        bullets[i].y -= 10;

        bullets[i].element.style.top =
            `${bullets[i].y}px`;

        if(bullets[i].y < 0){

            bullets[i].element.remove();
            bullets.splice(i,1);
        }
    }


    // MOVE ENEMIES

    for(let i = enemies.length-1; i >=0; i--){

        enemies[i].y += 3;

        enemies[i].element.style.top =
            `${enemies[i].y}px`;

        // PLAYER COLLISION

        const playerBox = {
            x: player.offsetLeft,
            y: player.offsetTop,
            width: player.offsetWidth,
            height: player.offsetHeight
        };

        const enemyBox = {
            x: enemies[i].x,
            y: enemies[i].y,
            width: 40,
            height: 40
        };

        if(hit(enemyBox,playerBox)){
            
            clearInterval(gameLoopInterval);
            clearInterval(spawnInterval);
            alert("GAME OVER");
            location.reload();
        }


        // BULLET COLLISION

        for(let j = bullets.length-1; j >=0; j--){

            const bulletBox = {
                x: bullets[j].element.offsetLeft,
                y: bullets[j].y,
                width: 6,
                height: 18
            };

            if(hit(bulletBox,enemyBox)){

                bullets[j].element.remove();
                bullets.splice(j,1);

                enemies[i].element.remove();
                enemies.splice(i,1);

                score += 10;
                scoreText.textContent = score;

                break;
            }
        }
    }

},20);