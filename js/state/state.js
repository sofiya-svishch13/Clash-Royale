// ============================================================
// state.js - Состояние игры (класс)
// ============================================================

class GameState {
    constructor() {
        this.isActive = false; // Флаг: активна ли игра
        this.elixir = 5;       // Текущий эликсир игрока
        this.units = [];       // Список всех юнитов на поле
        this.towers = {        // Все башни (игрока и врага)
            playerLeft: null,
            playerRight: null,
            playerKing: null,
            enemyLeft: null,
            enemyRight: null,
            enemyKing: null
        };
        this.lastElixirTime = 0;   // Время последнего восстановления эликсира
        this.selectedCardIndex = 0; // Индекс выбранной карты
    }
    
    /**
     * Запускает бой и инициализирует состояние игры.
     * 
     * Что делает:
     * - Активирует игру
     * - Устанавливает стартовый эликсир из CONFIG
     * - Очищает список юнитов
     * - Запоминает текущее время (для регенерации эликсира)
     * - Создаёт все башни (игрока и врага)
     * - Выводит сообщение в консоль
     */
    startBattle() {
        this.isActive = true;
        this.elixir = window.CONFIG.GAME.startElixir;
        this.units = [];
        this.lastElixirTime = performance.now() / 1000;
        
        // Инициализация башен
        const towerConfig = window.CONFIG.GAME.towers;
        this.towers.playerLeft = new Tower(towerConfig.playerLeft.x, towerConfig.playerLeft.y, true, 'left');
        this.towers.playerRight = new Tower(towerConfig.playerRight.x, towerConfig.playerRight.y, true, 'right');
        this.towers.playerKing = new Tower(towerConfig.playerKing.x, towerConfig.playerKing.y, true, 'king');
        this.towers.enemyLeft = new Tower(towerConfig.enemyLeft.x, towerConfig.enemyLeft.y, false, 'left');
        this.towers.enemyRight = new Tower(towerConfig.enemyRight.x, towerConfig.enemyRight.y, false, 'right');
        this.towers.enemyKing = new Tower(towerConfig.enemyKing.x, towerConfig.enemyKing.y, false, 'king');
        
        console.log('⚔️ Битва началась!');
    }
    
    /**
     * Обновляет количество эликсира со временем.
     * 
     * @param {number} now - Текущее время (в секундах)
     * 
     * Что делает:
     * - Проверяет, активна ли игра
     * - Если прошло достаточно времени (elixirRegenRate):
     *   увеличивает эликсир на 1
     * - Ограничивает максимумом (maxElixir)
     */
    updateElixir(now) {
        if (!this.isActive) return;
        
        const delta = now - this.lastElixirTime;
        if (delta >= window.CONFIG.GAME.elixirRegenRate) {
            this.elixir = Math.min(this.elixir + 1, window.CONFIG.GAME.maxElixir);
            this.lastElixirTime = now;
        }
    }
    
    /**
     * Проверяет, можно ли задеплоить юнита.
     * 
     * @param {number} cost - Стоимость юнита
     * @returns {boolean} true если хватает эликсира и игра активна
     */
    canDeploy(cost) {
        return this.isActive && this.elixir >= cost;
    }
    
    /**
     * Размещает юнита на поле.
     * 
     * @param {Object} unit - Юнит для размещения
     * @returns {boolean} true если успешно, иначе false
     * 
     * Что делает:
     * - Определяет стоимость юнита
     * - Проверяет возможность размещения
     * - Добавляет юнита в массив
     * - Списывает эликсир
     */
    deployUnit(unit) {
        const cost = unit.card ? unit.card.cost : window.CONFIG.CARDS[unit.type].cost;
        
        if (!this.canDeploy(cost)) {
            return false;
        }
        
        this.units.push(unit);
        this.elixir -= cost;
        return true;
    }
    
    /**
     * Удаляет всех мёртвых юнитов.
     * 
     * Что делает:
     * - Фильтрует массив units
     * - Оставляет только юнитов с hp > 0
     */
    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.hp > 0);
    }
    
    /**
     * Возвращает список всех юнитов.
     * 
     * @returns {Array} массив юнитов
     */
    getUnits() {
        return this.units;
    }
    
    /**
     * Возвращает башню по её ID.
     * 
     * @param {string} towerId - идентификатор башни (например playerLeft)
     * @returns {Object} объект башни
     */
    getTower(towerId) {
        return this.towers[towerId];
    }
    
    /**
     * Возвращает массив всех башен.
     * 
     * @returns {Array} список башен
     */
    getAllTowers() {
        return Object.values(this.towers);
    }
    
    /**
     * Наносит урон башне.
     * 
     * @param {Object} tower - башня
     * @param {number} damage - урон
     * @returns {boolean} true если башня уничтожена
     * 
     * Что делает:
     * - Уменьшает HP башни
     * - Не даёт HP уйти ниже 0
     * - Логирует разрушение
     */
    damageTower(tower, damage) {
        tower.hp = Math.max(0, tower.hp - damage);
        
        if (tower.hp <= 0) {
            console.log(`🏰 Башня ${tower.side} ${tower.position} разрушена!`);
        }
        
        return tower.hp <= 0;
    }
    
    /**
     * Проверяет условие победы.
     * 
     * @returns {string|null}
     *  'player' — победил игрок
     *  'enemy' — победил враг
     *  null — игра продолжается
     * 
     * Что делает:
     * - Проверяет, уничтожены ли все башни одной из сторон
     * - Завершает бой при необходимости
     */
    checkVictory() {
        const allEnemyTowersDead = 
            this.towers.enemyLeft.hp <= 0 &&
            this.towers.enemyRight.hp <= 0 &&
            this.towers.enemyKing.hp <= 0;
        
        const allPlayerTowersDead = 
            this.towers.playerLeft.hp <= 0 &&
            this.towers.playerRight.hp <= 0 &&
            this.towers.playerKing.hp <= 0;
        
        if (allEnemyTowersDead) {
            this.endBattle('player');
            return 'player';
        }
        if (allPlayerTowersDead) {
            this.endBattle('enemy');
            return 'enemy';
        }
        return null;
    }
    
    /**
     * Завершает бой.
     * 
     * @param {string} winner - победитель ('player' или 'enemy')
     * 
     * Что делает:
     * - Останавливает игру
     * - Выводит победителя в консоль
     * - Проигрывает звук победы или поражения
     */
    endBattle(winner) {
        this.isActive = false;
        console.log(`🏆 Победитель: ${winner === 'player' ? 'ИГРОК' : 'ВРАГ'}!`);
        
        if (winner === 'player' && window.SoundFX) {
            window.SoundFX.playVictory();
        } else if (window.SoundFX) {
            window.SoundFX.playDefeat();
        }
    }
    
    /**
     * Определяет, какую башню должен атаковать юнит.
     * 
     * @param {Object} unit - юнит
     * @returns {Object} ближайшая активная башня
     * 
     * Логика:
     * - Сначала атакуется башня на линии (left/right)
     * - Если она уничтожена — атакуется королевская башня
     * - Учитывается сторона (игрок или враг)
     */
    getActiveTowerForUnit(unit) {
        const lane = unit.lane;
        const isEnemy = !unit.isPlayer;
        
        if (isEnemy) {
            if (this.towers.playerLeft.hp > 0 && lane === 'left') return this.towers.playerLeft;
            if (this.towers.playerRight.hp > 0 && lane === 'right') return this.towers.playerRight;
            return this.towers.playerKing;
        } else {
            if (this.towers.enemyLeft.hp > 0 && lane === 'left') return this.towers.enemyLeft;
            if (this.towers.enemyRight.hp > 0 && lane === 'right') return this.towers.enemyRight;
            return this.towers.enemyKing;
        }
    }
}

window.GameState = null; // Глобальная ссылка на текущий экземпляр GameState
