(function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    Graphics.init(ctx);
    UI.init(canvas);
    SoundFX.init();
    GameState.startBattle();
    Core.startLoop();
    
    function render() {
        Graphics.drawArena();
        Graphics.drawPlayerLeftTower();
        Graphics.drawPlayerRightTower();
        Graphics.drawEnemyLeftTower();
        Graphics.drawEnemyRightTower();
        Graphics.drawKingTower(true);
        Graphics.drawKingTower(false);
        
        const units = GameState.getUnits();
        for (let i = 0; i < units.length; i++) {
            Graphics.drawUnit(units[i]);
        }
        
        Graphics.drawUI();
        requestAnimationFrame(render);
    }
    
    render();
    console.log('Stage 3: Complete Clash Royale with lanes, towers, and sounds!');
})();
