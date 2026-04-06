window.GameState = {
    isActive: false,
    elixir: 5,
-   playerTowerHP: 1500,
-   enemyTowerHP: 1500,
+   playerLeftTowerHP: 1500,
+   playerRightTowerHP: 1500,
+   playerKingTowerHP: 3000,
+   enemyLeftTowerHP: 1500,
+   enemyRightTowerHP: 1500,
+   enemyKingTowerHP: 3000,
    selectedUnit: 'knight',
    units: [],
    lastElixirTime: 0,
    
    startBattle: function() {
        this.isActive = true;
-       this.playerTowerHP = 1500;
-       this.enemyTowerHP = 1500;
+       this.playerLeftTowerHP = 1500;
+       this.playerRightTowerHP = 1500;
+       this.playerKingTowerHP = 3000;
+       this.enemyLeftTowerHP = 1500;
+       this.enemyRightTowerHP = 1500;
+       this.enemyKingTowerHP = 3000;
        this.elixir = 5;
        this.units = [];
        this.lastElixirTime = performance.now() / 1000;
        console.log('Battle started! Destroy enemy towers to win!');
        if (window.UI) window.UI.updateElixirDisplay();
        if (window.AI) window.AI.reset();
    },
    
    // Метод для получения активной цели юнита
    getTargetTower: function(unit, isEnemy) {
        if (isEnemy) {
            // Для вражеских юнитов - атакуют левую, потом правую, потом королевскую
            if (this.playerLeftTowerHP > 0) return { type: 'left', hp: this.playerLeftTowerHP };
            if (this.playerRightTowerHP > 0) return { type: 'right', hp: this.playerRightTowerHP };
            return { type: 'king', hp: this.playerKingTowerHP };
        } else {
            // Для игроков - атакуют левую врага, потом правую, потом королевскую
            if (this.enemyLeftTowerHP > 0) return { type: 'left', hp: this.enemyLeftTowerHP };
            if (this.enemyRightTowerHP > 0) return { type: 'right', hp: this.enemyRightTowerHP };
            return { type: 'king', hp: this.enemyKingTowerHP };
        }
    },
    
    damageTower: function(towerType, isEnemy, damage) {
        if (isEnemy) {
            if (towerType === 'left') this.enemyLeftTowerHP = Math.max(0, this.enemyLeftTowerHP - damage);
            else if (towerType === 'right') this.enemyRightTowerHP = Math.max(0, this.enemyRightTowerHP - damage);
            else this.enemyKingTowerHP = Math.max(0, this.enemyKingTowerHP - damage);
        } else {
            if (towerType === 'left') this.playerLeftTowerHP = Math.max(0, this.playerLeftTowerHP - damage);
            else if (towerType === 'right') this.playerRightTowerHP = Math.max(0, this.playerRightTowerHP - damage);
            else this.playerKingTowerHP = Math.max(0, this.playerKingTowerHP - damage);
        }
        
        // Проверка победы
        if (this.enemyLeftTowerHP <= 0 && this.enemyRightTowerHP <= 0 && this.enemyKingTowerHP <= 0) {
            this.endBattle('player');
        } else if (this.playerLeftTowerHP <= 0 && this.playerRightTowerHP <= 0 && this.playerKingTowerHP <= 0) {
            this.endBattle('enemy');
        }
    }
};
// Определение маршрута для юнита в зависимости от позиции спавна
getUnitPath: function(unit) {
    // Определяем, на какой дорожке появился юнит
    const lane = unit.x < CONFIG.GAME.width / 2 ? 'left' : 'right';
    
    if (unit.isPlayer) {
        // Игроки идут вверх по своей дорожке
        return {
            targetX: lane === 'left' ? CONFIG.GAME.towers.enemyLeft.x : CONFIG.GAME.towers.enemyRight.x,
            targetY: CONFIG.GAME.towers.enemyLeft.y,
            lane: lane
        };
    } else {
        // Враги идут вниз по своей дорожке
        return {
            targetX: lane === 'left' ? CONFIG.GAME.towers.playerLeft.x : CONFIG.GAME.towers.playerRight.x,
            targetY: CONFIG.GAME.towers.playerLeft.y,
            lane: lane
        };
    }
}
