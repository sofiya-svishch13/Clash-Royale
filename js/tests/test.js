// Тесты для Core модуля
function runCoreTests() {
    console.log('🧪 Running Core Module Tests...');
    
    // Тест 1: Core инициализация
    if (typeof Core !== 'undefined' && Core.init) {
        console.log('  ✅ Core module exists');
    } else {
        console.log('  ❌ Core module not found');
    }
    
    // Тест 2: Config загружен
    if (typeof Config !== 'undefined' && Config.coordinates) {
        console.log('  ✅ Config module loaded');
        const towerCoords = Config.getCoords('playerTower');
        if (towerCoords && towerCoords.x === 150) {
            console.log('  ✅ Coordinates system working');
        }
    } else {
        console.log('  ❌ Config module not found');
    }
    
    // Тест 3: Canvas существует
    const canvas = document.getElementById('gameCanvas');
    if (canvas && canvas.width === 900) {
        console.log('  ✅ Canvas correctly sized');
    } else {
        console.log('  ❌ Canvas not found or wrong size');
    }
    
    console.log('🏁 Core Tests Completed');
}

// Запуск после загрузки
setTimeout(runCoreTests, 200);
