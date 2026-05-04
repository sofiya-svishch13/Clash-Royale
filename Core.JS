class Core{
    constructor(canvas, ctx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.lastTime = 0;
        this.gameState = null;
        this.graphics = null
        this.soundFX = null
        this.ui = null
        this.ai = null
        this.animationId = null
    }


    async init() {
        console.log("🎮инициализация игры...0")
        

        this.graphics = new Graphics(this.ctx)
        this.soundFX = new SoundFX();
        this.gameState = new GameState();
        this.ui = new UI(this.canvas, this.gameState);
        this.ai = new AI(this.gameState);

        this.gameState.startBattle();
        this.lastTime = performance.now() / 1000;

        console.log('✅ Игра инициализирована!')
        this.startLoop();
    };
        


    startLoop() {
        const gameloop = () => {
            const now = performance.now() / 1000;
            let delta = Math.min(0.033, now - this.lastTime);
            this.lastTime = now;
            this.update(delta, now);
            this.render();
            this.animationId = requestAnimationFrame(gameloop);

        };
        gameloop(); 
    }
}