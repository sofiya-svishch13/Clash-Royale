// Функция для рисования лучника
window.drawArcher = function(ctx, x, y, isPlayer) {
    const color = isPlayer ? '#3a6ea5' : '#a53a3a';
    
    // Тело
    ctx.fillStyle = color;
    ctx.fillRect(x - 6, y - 10, 12, 18);
    
    // Лук
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 12, y - 8, 8, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    // Стрела
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x + 18, y - 12);
    ctx.lineTo(x + 28, y - 18);
    ctx.stroke();
}

drawArcher(ctx, 400, 300, true);
