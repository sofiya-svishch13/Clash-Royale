const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function helloQA() {
    console.log("Integration & QA ready ✅");
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Здесь будут вызовы
    
    requestAnimationFrame(gameLoop);
}

helloQA()

gameLoop();

