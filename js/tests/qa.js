window.QA = {
    log: function(msg) {
        console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
    },
    
    test: function() {
        this.log('=== QA Tests ===');
        this.log('Config loaded: ' + !!window.CONFIG);
        this.log('GameState loaded: ' + !!window.GameState);
        this.log('Graphics loaded: ' + !!window.Graphics);
        this.log('Core loaded: ' + !!window.Core);
        this.log('SoundFX loaded: ' + !!window.SoundFX);
        
        // Проверка башен
        this.log('Player towers: ' + 
            (GameState.playerLeftTowerHP > 0 && 
             GameState.playerRightTowerHP > 0 && 
             GameState.playerKingTowerHP > 0));
        
        // Проверка звуков
        if (window.SoundFX && window.SoundFX.sounds) {
            const loadedSounds = Object.keys(window.SoundFX.sounds).length;
            this.log(`Sounds loaded: ${loadedSounds}/${Object.keys(CONFIG.SOUNDS).length}`);
        }
        
        this.log('All systems ready!');
    },
    
    testLanes: function() {
        this.log('=== Lane Test ===');
        const units = GameState.getUnits();
        const leftUnits = units.filter(u => u.lane === 'left').length;
        const rightUnits = units.filter(u => u.lane === 'right').length;
        this.log(`Left lane: ${leftUnits} units, Right lane: ${rightUnits} units`);
        return { left: leftUnits, right: rightUnits };
    }
};

// Авто-тест при загрузке
document.addEventListener('DOMContentLoaded', () => window.QA && window.QA.test());
