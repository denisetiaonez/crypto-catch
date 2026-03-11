const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const finalScore = document.getElementById('final-score');

canvas.width = 400;
canvas.height = 600;

let score = 0;
let lives = 3;
let gameActive = true;
let items = [];
let player = { x: 175, y: 530, width: 50, height: 50, speed: 7 };

// Kontrol
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
    if(e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
    if(e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if(e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
    if(e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
});

function spawnItem() {
    const types = ['bull', 'bull', 'bull', 'bear']; // Lebih banyak bull agar seru
    const type = types[Math.floor(Math.random() * types.length)];
    items.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        type: type,
        speed: 3 + Math.random() * 3
    });
}

function update() {
    if (!gameActive) return;

    if (rightPressed && player.x < canvas.width - player.width) player.x += player.speed;
    if (leftPressed && player.x > 0) player.x -= player.speed;

    items.forEach((item, index) => {
        item.y += item.speed;

        // Cek Tabrakan
        if (item.x < player.x + player.width && item.x + item.width > player.x &&
            item.y < player.y + player.height && item.y + item.height > player.y) {
            
            if (item.type === 'bull') {
                score += 100;
                scoreElement.innerText = `Profit: $${score}`;
            } else {
                lives--;
                updateLivesDisplay();
                if (lives <= 0) gameOver();
            }
            items.splice(index, 1);
        }

        if (item.y > canvas.height) items.splice(index, 1);
    });

    if (Math.random() < 0.02) spawnItem();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar Player (Roket/Kotak Hijau)
    ctx.fillStyle = "#02c076";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Gambar Items
    items.forEach(item => {
        ctx.fillStyle = item.type === 'bull' ? "#02c076" : "#cf304a";
        ctx.beginPath();
        ctx.arc(item.x + 15, item.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(item.type === 'bull' ? "$" : "!", item.x + 10, item.y + 20);
    });

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

function updateLivesDisplay() {
    livesElement.innerText = "HP: " + "❤️".repeat(lives);
}

function gameOver() {
    gameActive = false;
    finalScore.innerText = `Total Profit: $${score}`;
    overlay.classList.remove('hidden');
}

function resetGame() {
    score = 0;
    lives = 3;
    items = [];
    gameActive = true;
    scoreElement.innerText = "Profit: $0";
    updateLivesDisplay();
    overlay.classList.add('hidden');
}

draw();
