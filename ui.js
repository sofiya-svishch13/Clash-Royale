window.drawHandCards = function(ctx, cards) {
    const startX = 100;
    const startY = 500;
    
    cards.forEach((card, index) => {
        const x = startX + index * 90;
        
        // Карта
        ctx.fillStyle = '#f4a460';
        ctx.fillRect(x, startY, 70, 90);
        
        // Рамка
        ctx.strokeStyle = '#8b4513';
        ctx.strokeRect(x, startY, 70, 90);
        
        // Стоимость
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(card.cost, x + 5, startY + 25);
        
        // Иконка
        ctx.fillStyle = card.isPlayer ? '#3a6ea5' : '#a53a3a';
        ctx.beginPath();
        ctx.arc(x + 35, startY + 50, 15, 0, Math.PI * 2);
        ctx.fill();
    });
}
