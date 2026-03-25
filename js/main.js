<canvas id="gameCanvas" width="800" height="600" style="border:1px solid black;"></canvas>

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Здесь будут вызовы
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
