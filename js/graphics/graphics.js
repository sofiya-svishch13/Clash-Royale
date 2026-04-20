// Обновить метод drawUI:
drawUI(gameState, deck, selectedCardIndex, ui) {
    // Эликсир бар
    const elixirPercent = gameState.elixir / window.CONFIG.GAME.maxElixir;
    this.ctx.fillStyle = '#2c1a0e';
    this.ctx.fillRect(15, 10, 220, 22);
    this.ctx.fillStyle = '#d13aff';
    this.ctx.fillRect(15, 10, 220 * elixirPercent, 22);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 18px monospace';
    this.ctx.fillText(`⚡ ${Math.floor(gameState.elixir)}/${window.CONFIG.GAME.maxElixir}`, 25, 28);
    
    // Отрисовка карт в руке
    if (deck && deck.hand) {
        const cardWidth = 70;
        const cardHeight = 90;
        const startX = window.CONFIG.GAME.width / 2 - (cardWidth * deck.hand.length) / 2;
        const startY = window.CONFIG.GAME.height - 100;
        
        // Сохраняем области карт для обработки кликов
        const cardAreas = [];
        
        for (let i = 0; i < deck.hand.length; i++) {
            const card = deck.hand[i];
            const x = startX + i * (cardWidth + 10);
            const isSelected = (ui && ui.isPlacingMode && ui.selectedCardIndex === i);
            const canAfford = gameState.elixir >= card.cost;
            
            // Рамка карты
            this.ctx.fillStyle = isSelected ? '#ffd700' : '#333';
            this.ctx.fillRect(x - 3, startY - 3, cardWidth + 6, cardHeight + 6);
            
            // Фон карты
            this.ctx.fillStyle = canAfford ? '#1a1a2e' : '#2a2a3e';
            this.ctx.fillRect(x, startY, cardWidth, cardHeight);
            
            // Если не хватает эликсира - затемнение
            if (!canAfford) {
                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fillRect(x, startY, cardWidth, cardHeight);
            }
            
            // Иконка юнита на карте
            this.drawImage(card.unitType, x + cardWidth/2 - 15, startY + 15, 30, 30);
            
            // Стоимость
            this.ctx.fillStyle = canAfford ? '#4eff6e' : '#ff6666';
            this.ctx.font = 'bold 16px monospace';
            this.ctx.fillText(`⚡${card.cost}`, x + 5, startY + 25);
            
            // Название
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(card.name, x + cardWidth/2 - 20, startY + 65);
            
            // Сохраняем область для клика
            cardAreas.push({ x, y: startY, width: cardWidth, height: cardHeight, card, index: i });
        }
        
        // Сохраняем области карт в глобальный объект для обработки кликов
        this.lastCardAreas = cardAreas;
    }
}

// Добавить метод для получения областей карт:
getCardAreas() {
    return this.lastCardAreas || [];
}
