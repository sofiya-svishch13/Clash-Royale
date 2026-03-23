// AI Module - искусственный интеллект противника
window.AI = {
    lastDeployTime: 0,
    deployDelay: 3.5,
    gameStartTime: 0,
    isEnabled: true,
    
    init: function() {
        console.log('🤖 AI system initialized');
    },
    
    update: function(now) {
        if (!GameState.isActive) return;
        if (!this.isEnabled) return;
        
        if (this.gameStartTime === 0) {
            this.gameStartTime = now;
            return;
        }
        
        // Ждем 2.5 секунды перед первым спавном (даем игроку время)
        if (now - this.gameStartTime < 2.5) return;
        
        if (this.lastDeployTime === 0) {
            this.lastDeployTime = now;
            return;
        }
        
        // Спавним юнита с задержкой
        if (now - this.lastDeployTime >= this.deployDelay) {
            this.tryDeployUnit(now);
        }
    },
    
    tryDeployUnit: function(now) {
        // Проверяем, не слишком ли много юнитов на поле
        const enemyUnits = GameState.getUnits().filter(u => !u.isPlayer).length;
        if (enemyUnits >= 5) return;
        
        // Выбираем случайного юнита
        const types = ['knight', 'archer', 'mage'];
        let type = types[Math.floor(Math.random() * types.length)];
        let cost = this.getUnitCost(type);
        
        // Если не хватает эликсира, пробуем более дешевого
        if (GameState.elixir < cost) {
            if (GameState.elixir >= 3) {
                type = 'knight';
                cost = 3;
            } else {
                return; // Не хватает эликсира
            }
        }
        
        if (GameState.spendElixir(cost)) {
            const spawnZone = Config.getCoords('spawnZones.enemy');
            const x = spawnZone.minX + Math.random() * (spawnZone.maxX - spawnZone.minX);
            
            const stats = this.getUnitStats(type);
            const unit = {
                x: x,
                y: spawnZone.y,
                type: type,
                isPlayer: false,
                hp: stats.hp,
                maxHp: stats.hp,
                damage: stats.damage,
                range: stats.range,
                speed: stats.speed,
                attackTimer: 0
            };
            
            GameState.addUnit(unit);
            this.lastDeployTime = now;
            console.log(`🤖 AI deployed ${type} at (${Math.floor(x)},${spawnZone.y})`);
            
            if (window.SoundFX) SoundFX.play('deploy');
            if (window.Effects) Effects.addDeployEffect(x, spawnZone.y);
        }
    },
    
    getUnitCost: function(type) {
        const costs = { knight: 3, archer: 3, mage: 4 };
        return costs[type] || 3;
    },
    
    getUnitStats: function(type) {
        const stats = {
            knight: { hp: 800, damage: 85, range: 45, speed: 85 },
            archer: { hp: 450, damage: 70, range: 120, speed: 90 },
            mage: { hp: 550, damage: 115, range: 110, speed: 80 }
        };
        return stats[type] || stats.knight;
    },
    
    setEnabled: function(enabled) {
        this.isEnabled = enabled;
        console.log(`AI ${enabled ? 'enabled' : 'disabled'}`);
    },
    
    reset: function() {
        this.lastDeployTime = 0;
        this.gameStartTime = 0;
    }
};

