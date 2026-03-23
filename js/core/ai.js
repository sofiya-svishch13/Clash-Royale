function helloAI() {
    console.log("AI ready");
}

// Общая функция для войск
window.drawTroop = function(ctx, x, y, type, isPlayer) {
    if (type === 'knight') window.drawKnight(ctx, x, y, isPlayer);
    if (type === 'archer') window.drawArcher(ctx, x, y, isPlayer);
    if (type === 'mage') window.drawMage(ctx, x, y, isPlayer);
}

helloAI();
