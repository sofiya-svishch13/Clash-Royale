// Функция для рисования мага
window.drawMage = function(ctx, x, y, isPlayer) {
const color = isPlayer ? '#3a6ea5' : '#a53a3a';

// Мантия
ctx.fillStyle = color;
ctx.beginPath();
ctx.arc(x, y - 4, 10, 0, Math.PI * 2);
ctx.fill();

// Шляпа
ctx.fillStyle = '#663399';
ctx.beginPath();
ctx.moveTo(x - 8, y - 20);
ctx.lineTo(x, y - 35);
ctx.lineTo(x + 8, y - 20);
ctx.fill();

// Магический шар
ctx.fillStyle = '#ffd700';
ctx.beginPath();
ctx.arc(x + 15, y - 15, 5, 0, Math.PI * 2);
ctx.fill();
}

