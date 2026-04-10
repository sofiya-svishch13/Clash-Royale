// СОСТОЯНИЕ - данные игры TEAM-Game state 82v(Вадим)
window.GameState = {
    isActive: false,
    elixir: 5,
    playerTowerHP: 1500,
    enemyTowerHP: 1500,
    selectedUnit: 'knight',
    units: [],
    lastElixirTime: 0,
    elixirAccumulator: 0,
    
    startBattle: function() {
        this.isActive = true;
        this.playerTowerHP = 1500;
        this.enemyTowerHP = 1500;
        this.elixir = 5;
        this.units = [];
        this.elixirAccumulator = 0;
        this.lastElixirTime = performance.now() / 1000;
        console.log('Battle started! You have 5 elixir. Wait a moment before deploying.');
        if (window.UI) window.UI.updateElixirDisplay();
        if (window.AI) window.AI.reset();
    },
    
    endBattle: function(winner) {
        this.isActive = false;
        const message = winner === 'player' ? 'VICTORY! You won!' : 'DEFEAT! Better luck next time!';
        console.log(message);
        alert(message);
    },
    
    updateElixir: function(now) {
        if (!this.isActive) return;
        
        let delta = now - this.lastElixirTime;
        
        if (delta >= 0.1) { // Обновляем каждые 0.1 секунды для плавности
            let gain = CONFIG.GAME.elixirRegen * delta;
            this.elixir = Math.min(CONFIG.GAME.maxElixir, this.elixir + gain);
            this.lastElixirTime = now;
            
            if (window.UI) window.UI.updateElixirDisplay();
        }
    },
    
    canDeploy: function(cost) {
        return this.isActive && this.elixir >= cost;
    },
    
    deployUnit: function(unit) {
        const cost = CONFIG.GAME.units[unit.type].cost;
        if (this.elixir >= cost) {
            this.elixir -= cost;
            this.units.push(unit);
            if (window.UI) window.UI.updateElixirDisplay();
            console.log(`Elixir left: ${Math.floor(this.elixir)}`);
            return true;
        }
        return false;
    },
    
    getUnits: function() {
        return this.units;
    },
    
    removeDeadUnits: function() {
        this.units = this.units.filter(u => u.hp > 0);
    }
};
