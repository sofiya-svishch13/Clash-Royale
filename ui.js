
window.drawTowerScore = function(ctx, playerTowers, enemyTowers) {
    // Свои башни (синие)
    for (let i = 0; i < playerTowers; i++) {
        ctx.fillStyle = '#3a6ea5';
        ctx.fillRect(20 + i * 30, 80, 20, 40);
    }
    
    // Оставшиеся (серые)
    for (let i = playerTowers; i < 3; i++) {
        ctx.fillStyle = '#666666';
        ctx.fillRect(20 + i * 30, 80, 20, 40);
    }
    
    // Башни врага (красные справа)
    for (let i = 0; i < enemyTowers; i++) {
        ctx.fillStyle = '#a53a3a';
        ctx.fillRect(700 - i * 30, 80, 20, 40);
    }
    
    // Разделительная линия
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 50);
    ctx.lineTo(400, 120);
    ctx.stroke();
}

// Функция для рисования полоски эликсира
window.drawElixirBar = function(ctx, current, max) {
    const barWidth = 300;
    const barHeight = 25;
    const x = 250;
    const y = 20;
    const fillPercent = current / max;
    
    // Фон
    ctx.fillStyle = '#4b0082';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Заполнение
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(x, y, barWidth * fillPercent, barHeight);
    
    // Иконки эликсира
    for (let i = 0; i < max; i++) {
        ctx.fillStyle = i < current ? '#ffffff' : '#666666';
        ctx.beginPath();
        ctx.arc(x + 20 + i * 30, y + 12, 8, 0, Math.PI * 2);
        ctx.fill();
    }

}
