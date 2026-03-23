// Config Module - конфигурация игры
window.Config = {
    // Размеры канваса
    canvas: {
        width: 900,
        height: 600
    },
    
    // Координаты объектов
    coordinates: {
        // Башни
        playerTower: { x: 150, y: 520, width: 60, height: 70 },
        enemyTower: { x: 750, y: 30, width: 60, height: 70 },
        kingTower: { x: 450, y: 570, width: 70, height: 80 },
        enemyKingTower: { x: 450, y: -20, width: 70, height: 80 },
        
        // Зоны спавна
        spawnZones: {
            player: { minX: 100, maxX: 800, y: 540 },
            enemy: { minX: 100, maxX: 800, y: 60 }
        },
        
        // Мост
        bridge: { x: 350, y: 285, width: 200, height: 15 },
        
        // Река
        river: { y: 295, height: 20 }
    },
    
    // Получить координаты объекта
    getCoords: function(objectName) {
        const parts = objectName.split('.');
        let obj = this.coordinates;
        for (let part of parts) {
            if (obj[part] === undefined) return null;
            obj = obj[part];
        }
        return obj;
    },
    
    // Проверка, на своей ли стороне клик
    isPlayerSide: function(y) {
        return y > this.canvas.height / 2;
    }
};
