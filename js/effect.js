// 1)Асадов Маджнун-spawn
// Функция для эффекта появления
window.drawSpawnEffect = function(ctx, x, y) {
    // TODO: Расходящиеся круги
    
    ctx.strokeStyle = '#ffffff';
    
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(x, y, i * 8, 0, Math.PI * 2);
        ctx.stroke();
    }
}
---------------------------------------------------------------------------------------------------------------
    //Тимофеев Семён
    window.drawHitEffect = function(ctx, x, y) {
    
    ctx.fillStyle = '#ff0000';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = '#ffa500';
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sparkX = x + Math.cos(angle) * 15;
        const sparkY = y + Math.sin(angle) * 15;
        
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
