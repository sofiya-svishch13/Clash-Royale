// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CORE - основная игровая логика   team - core : @lafneroo  ( Остапчук Андрей )
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.Core = {
    lastTime: 0,
    // ~~~~~~~~~~~~~~~~~~~
    // инициализация
    // ~~~~~~~~~~~~~~~~~~~
    init: function(canvas, ctx) {
        Graphics.init(ctx);
        UI.init(canvas);
        SoundFX.init();
        GameState.startBattle();
        this.lastTime = performance.now() / 1000;
        this.gameLoop();
    },
    // ~~~~~~~~~~~~~~~~~~~
    // установка юнита
    // ~~~~~~~~~~~~~~~~~~~
    deployUnit: function(x, y) {
        const type = GameState.selectedUnit;
        const cost = CONFIG.GAME.units[type].cost;
        
        if (!GameState.canDeploy(cost)) {
            QA.log(`Not enough elixir! Need ${cost}, have ${Math.floor(GameState.elixir)}`);
            return false;
        }
        
        const stats = CONFIG.GAME.units[type];
        const unit = {
            x: x,
            y: y,
            type: type,
            isPlayer: true,
            hp: stats.hp,
            maxHp: stats.hp,
            damage: stats.damage,
            range: stats.range,
            speed: stats.speed,
            attackTimer: 0
        };
        
        // Тратим эликсир через GameState
        if (GameState.deployUnit(unit)) {
            SoundFX.playDeploy();
            QA.log(`Deployed ${type} at (${Math.floor(x)},${Math.floor(y)}) - Elixir: ${Math.floor(GameState.elixir)}`);
            return true;
        };
        console.log("start");
        Graphics.drawUnit(unit);
        console.log("end");
        return false;
    },
    // ~~~~~~~~~~~~~~~~~~~
    // логика юнитов 
    // ~~~~~~~~~~~~~~~~~~~
updateUnits: function(delta) {
    const units = GameState.getUnits();
    
    for (let i = 0; i < units.length; i++) {
        const u = units[i];
        
        if (u.attackTimer > 0) u.attackTimer -= delta;
        
        // Определяем цель (сначала ближайшая башня на дорожке, потом юниты)
        let target = null;
        let targetDist = Infinity;
        
        // Получаем целевую башню на дорожке юнита
        const towerTarget = GameState.getTargetTower(u, !u.isPlayer);
        const towerPos = this.getTowerPosition(towerTarget.type, !u.isPlayer);
        
        if (towerPos) {
            const distToTower = Math.hypot(u.x - towerPos.x, u.y - towerPos.y);
            if (distToTower < u.range && towerTarget.hp > 0) {
                target = { type: 'tower', towerType: towerTarget.type, dist: distToTower };
                targetDist = distToTower;
            }
        }
        
        // Поиск вражеских юнитов на той же дорожке
        for (let j = 0; j < units.length; j++) {
            const other = units[j];
            if (other.isPlayer !== u.isPlayer && other.lane === u.lane) {
                const dist = Math.hypot(u.x - other.x, u.y - other.y);
                if (dist < u.range && dist < targetDist) {
                    target = { type: 'unit', unit: other, dist: dist };
                    targetDist = dist;
                }
            }
        }
        
        // Атака
        if (target && u.attackTimer <= 0) {
            u.attackTimer = 1.0;
            
            if (target.type === 'tower') {
                GameState.damageTower(target.towerType, !u.isPlayer, u.damage);
                console.log(`${u.type} hits ${target.towerType} tower for ${u.damage}`);
                if (window.SoundFX) window.SoundFX.play('hit');
            } else if (target.unit) {
                target.unit.hp -= u.damage;
                if (target.unit.hp <= 0) {
                    console.log(`${u.type} killed ${target.unit.type}`);
                } else {
                    console.log(`${u.type} hits ${target.unit.type} for ${u.damage}`);
                }
                if (window.SoundFX) window.SoundFX.play('hit');
            }
        }
        
        // Движение по дорожке
        if (!target || (target.type === 'unit' && target.unit.hp <= 0)) {
            const path = GameState.getUnitPath(u);
            const dx = path.targetX - u.x;
            const dy = path.targetY - u.y;
            const len = Math.hypot(dx, dy);
            
            if (len > 1) {
                const moveX = (dx / len) * u.speed * delta;
                const moveY = (dy / len) * u.speed * delta;
                u.x += moveX;
                u.y += moveY;
            }
        }
    }
    
    GameState.removeDeadUnits();
},

getTowerPosition: function(towerType, isEnemy) {
    if (isEnemy) {
        if (towerType === 'left') return CONFIG.GAME.towers.playerLeft;
        if (towerType === 'right') return CONFIG.GAME.towers.playerRight;
        return CONFIG.GAME.towers.playerKing;
    } else {
        if (towerType === 'left') return CONFIG.GAME.towers.enemyLeft;
        if (towerType === 'right') return CONFIG.GAME.towers.enemyRight;
        return CONFIG.GAME.towers.enemyKing;
    }
},
    // ~~~~~~~~~~~~~~~~~~~
    // игровой цикл
    // ~~~~~~~~~~~~~~~~~~~
    startLoop: function() {
        const now = performance.now() / 1000;
        let delta = Math.min(0.033, now - this.lastTime);
        this.lastTime = now;
        
        if (GameState.isActive) {
            GameState.updateElixir(now);
            this.updateUnits(delta);
            AI.update(now);
        }
        
        // Отрисовка
        const ctx = Graphics.ctx;
        Graphics.drawArena();
        Graphics.drawPlayerTower();
        Graphics.drawEnemyTower();
        Graphics.drawKingTower(true);
        Graphics.drawKingTower(false);
        
        const units = GameState.getUnits();
        for (let i = 0; i < units.length; i++) {
            Graphics.drawUnit(units[i]);
        }
        
        Graphics.drawUI();
        
        requestAnimationFrame(() => this.gameLoop());
    }
};
