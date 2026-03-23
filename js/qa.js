// QA Module - логирование и тестирование
window.QA = {
    logs: [],
    tests: [],
    testResults: {},
    
    init: function() {
        this.createQAPanel();
        console.log('🔍 QA system initialized');
    },
    
    createQAPanel: function() {
        if (document.getElementById('qaPanel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'qaPanel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.85);
            color: #0f0;
            font-family: monospace;
            font-size: 11px;
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 350px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 9999;
            backdrop-filter: blur(4px);
            border: 1px solid #0f0;
            font-weight: bold;
        `;
        
        const title = document.createElement('div');
        title.textContent = '🔍 QA Console';
        title.style.cssText = 'color: #ffd966; margin-bottom: 5px; border-bottom: 1px solid #0f0;';
        panel.appendChild(title);
        
        this.logContainer = document.createElement('div');
        this.logContainer.id = 'qaLogContainer';
        panel.appendChild(this.logContainer);
        
        document.body.appendChild(panel);
    },
    
    log: function(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const icons = { info: '📋', success: '✅', error: '❌', warning: '⚠️' };
        const icon = icons[type] || '📋';
        const logEntry = `[${timestamp}] ${icon} ${message}`;
        
        this.logs.push(logEntry);
        console.log(logEntry);
        
        if (this.logContainer) {
            const entry = document.createElement('div');
            entry.textContent = logEntry;
            entry.style.cssText = `
                margin: 2px 0;
                font-size: 10px;
                color: ${type === 'error' ? '#ff8888' : (type === 'success' ? '#88ff88' : '#aaffaa')};
            `;
            this.logContainer.appendChild(entry);
            
            while (this.logContainer.children.length > 15) {
                this.logContainer.removeChild(this.logContainer.firstChild);
            }
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
        }
    },
    
    test: function(name, testFn) {
        this.log(`Running test: ${name}`, 'info');
        try {
            const result = testFn();
            this.testResults[name] = { passed: result, error: null };
            this.log(`${name}: ${result ? 'PASSED' : 'FAILED'}`, result ? 'success' : 'error');
            return result;
        } catch (e) {
            this.testResults[name] = { passed: false, error: e.message };
            this.log(`${name}: ERROR - ${e.message}`, 'error');
            return false;
        }
    },
    
    runAllTests: function() {
        this.log('═══════════════════════════════', 'info');
        this.log('🚀 RUNNING INTEGRATION TESTS', 'info');
        this.log('═══════════════════════════════', 'info');
        
        // Core тесты
        this.test('Core module exists', () => typeof Core !== 'undefined');
        this.test('Core.init exists', () => Core && typeof Core.init === 'function');
        
        // Config тесты
        this.test('Config module exists', () => typeof Config !== 'undefined');
        this.test('Config coordinates', () => Config && Config.getCoords('playerTower'));
        
        // Graphics тесты
        this.test('Graphics module exists', () => typeof Graphics !== 'undefined');
        this.test('Graphics.init exists', () => Graphics && typeof Graphics.init === 'function');
        
        // State тесты
        this.test('GameState module exists', () => typeof GameState !== 'undefined');
        this.test('GameState.startBattle', () => GameState && typeof GameState.startBattle === 'function');
        
        // UI тесты
        this.test('UI module exists', () => typeof UI !== 'undefined');
        this.test('UI.createUI', () => UI && typeof UI.createUI === 'function');
        
        // Input тесты
        this.test('Input module exists', () => typeof Input !== 'undefined');
        
        // AI тесты
        this.test('AI module exists', () => typeof AI !== 'undefined');
        this.test('AI.update', () => AI && typeof AI.update === 'function');
        
        // Balance тесты
        this.test('Balance module exists', () => typeof Balance !== 'undefined');
        this.test('Balance units', () => Balance && Balance.units && Balance.units.knight);
        
        // Sound тесты
        this.test('SoundFX module exists', () => typeof SoundFX !== 'undefined');
        
        // Effects тесты
        this.test('Effects module exists', () => typeof Effects !== 'undefined');
        
        // Canvas тест
        this.test('Canvas element exists', () => {
            const canvas = document.getElementById('gameCanvas');
            return canvas !== null && canvas.width === 900;
        });
        
        this.log('═══════════════════════════════', 'info');
        
        const passed = Object.values(this.testResults).filter(r => r.passed).length;
        const total = Object.keys(this.testResults).length;
        this.log(`📊 RESULTS: ${passed}/${total} tests passed`, passed === total ? 'success' : 'warning');
        this.log('═══════════════════════════════', 'info');
        
        return { passed, total, results: this.testResults };
    },
    
    getReport: function() {
        return {
            timestamp: new Date().toISOString(),
            logs: this.logs.slice(-50),
            testResults: this.testResults,
            modules: this.checkAllModules()
        };
    },
    
    checkAllModules: function() {
        return {
            Core: !!window.Core,
            Config: !!window.Config,
            Graphics: !!window.Graphics,
            GameState: !!window.GameState,
            UI: !!window.UI,
            Input: !!window.Input,
            AI: !!window.AI,
            Balance: !!window.Balance,
            SoundFX: !!window.SoundFX,
            Effects: !!window.Effects
        };
    }
};
