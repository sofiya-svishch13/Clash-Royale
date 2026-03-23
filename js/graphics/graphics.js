function helloGraphics() {
    console.log("Graphics and Assets Mechanics ready");
}

// Функция для рисования арены
window.drawArena = function(ctx) {
    // Трава
    ctx.fillStyle = '#228b22';
    ctx.fillRect(0, 0, 800, 600);
    
    // Разметка
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();
    
    // Круги в центре
    ctx.beginPath();
    ctx.arc(400, 300, 50, 0, Math.PI * 2);
    ctx.stroke();
}

// Функция для рисования моста
window.drawBridge = function(ctx) {
    const canvas = ctx.canvas;
    
    // Деревянный мост посередине
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(350, 250, 100, 100);
    
    // Доски
    ctx.strokeStyle = '#d2691e';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(350, 250 + i * 20);
        ctx.lineTo(450, 250 + i * 20);
        ctx.stroke();
    }
}

// Функция для рисования реки
window.drawRiver = function(ctx) {
    // Голубая полоса через центр
    ctx.fillStyle = '#4169e1';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(300, 0, 200, 600);
    
    // Волны
    ctx.strokeStyle = '#87ceeb';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    
    for (let y = 50; y < 600; y += 50) {
        ctx.beginPath();
        ctx.moveTo(320, y);
        ctx.quadraticCurveTo(400, y + 20, 480, y);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
}


window.Graphics = {
    ctx: null,
    images: {},
    loaded: false,
    
    init: function(ctx) {
        this.ctx = ctx;
        this.loadImages();
        console.log('🎨 Graphics initialized');
    },
    
    loadImages: function() {
        const imageList = {
            grass: 'assets/images/arena/grass.png',
            path: 'assets/images/arena/path.png',
            river: 'assets/images/arena/river.png',
            playerTower: 'assets/images/towers/player_tower.png',
            enemyTower: 'assets/images/towers/enemy_tower.png'
        };
        
        let loadedCount = 0;
        const total = Object.keys(imageList).length;
        
        for (let key in imageList) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === total) {
                    this.loaded = true;
                    console.log('✅ All graphics loaded');
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ Failed to load: ${imageList[key]}`);
                loadedCount++;
                if (loadedCount === total) this.loaded = true;
            };
            img.src = imageList[key];
            this.images[key] = img;
        }
    },
    
    draw: function() {
        if (!this.ctx) return;
        
        this.drawArena();
        this.drawTowers();
    },
    
    drawArena: function() {
        const { width, height } = Config.canvas;
        
        // Рисуем траву (заливка пока нет текстур)
        this.ctx.fillStyle = '#3c9e3c';
        this.ctx.fillRect(0, 0, width, height);
        
        // Рисуем дорожку
        this.ctx.fillStyle = '#b87c4f';
        this.ctx.fillRect(0, 280, width, 50);
        
        // Рисуем реку
        this.ctx.fillStyle = '#4aa3df';
        this.ctx.fillRect(0, 300, width, 20);
        
        // Рисуем мост
        const bridge = Config.getCoords('bridge');
        this.ctx.fillStyle = '#cb9a6b';
        this.ctx.fillRect(bridge.x, bridge.y, bridge.width, bridge.height);
        
        // Если текстуры загружены - используем их
        if (this.loaded) {
            // Тайловая отрисовка травы
            for (let i = 0; i < width; i += 64) {
                for (let j = 0; j < 280; j += 64) {
                    this.ctx.drawImage(this.images.grass, i, j, 64, 64);
                }
            }
        }
    },
    
    drawTowers: function() {
        const playerTower = Config.getCoords('playerTower');
        const enemyTower = Config.getCoords('enemyTower');
        
        if (this.images.playerTower && this.images.playerTower.complete) {
            this.ctx.drawImage(this.images.playerTower, playerTower.x, playerTower.y, playerTower.width, playerTower.height);
        } else {
            // Fallback
            this.ctx.fillStyle = '#2c6fbb';
            this.ctx.fillRect(playerTower.x, playerTower.y, playerTower.width, playerTower.height);
        }
        
        if (this.images.enemyTower && this.images.enemyTower.complete) {
            this.ctx.drawImage(this.images.enemyTower, enemyTower.x, enemyTower.y, enemyTower.width, enemyTower.height);
        } else {
            this.ctx.fillStyle = '#b13e3e';
            this.ctx.fillRect(enemyTower.x, enemyTower.y, enemyTower.width, enemyTower.height);
        }
        
        // HP баров (временные)
        this.drawHPBar(playerTower.x, playerTower.y - 15, 80, 8, GameState ? GameState.playerTowerHP / 1500 : 1);
        this.drawHPBar(enemyTower.x, enemyTower.y - 15, 80, 8, GameState ? GameState.enemyTowerHP / 1500 : 1);
    },
    
    drawHPBar: function(x, y, width, height, percent) {
        this.ctx.fillStyle = '#aa2e2e';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = '#4eff6e';
        this.ctx.fillRect(x, y, width * Math.max(0, Math.min(1, percent)), height);
    }
};
