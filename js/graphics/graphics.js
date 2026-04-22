drawUI(gameState, deck, selectedCardIndex, ui = null) {
    // Отрисовка эликсир-бара с ячейками
    const barWidth = 250;
    const barHeight = 30;
    const barX = window.CONFIG.GAME.width / 2 - barWidth / 2;
    const barY = window.CONFIG.GAME.height - 50;
    const cellCount = 10;
    const cellWidth = barWidth / cellCount;
    
    // Фон бара
    this.ctx.fillStyle = '#2c1a0e';
    this.ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Ячейки эликсира
    const filledCells = Math.floor(gameState.playerElixir);
    for (let i = 0; i < cellCount; i++) {
        const cellX = barX + i * cellWidth;
        const isFilled = i < filledCells;
        
        this.ctx.fillStyle = isFilled ? '#d13aff' : '#4a2a6e';
        this.ctx.fillRect(cellX + 1, barY + 1, cellWidth - 2, barHeight - 2);
        
        if (isFilled) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.fillRect(cellX + 1, barY + 1, cellWidth - 2, 5);
        }
    }
    
    // ... остальной код UI
}
