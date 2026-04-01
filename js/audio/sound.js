// ========== SOUND MODULE ==========
// SOUND - звуковые эффекты
window.SoundFX = {
    sounds: {},
    enabled: true,
    
    init: function() {
        // Загружаем все звуки из конфига
        for (let key in CONFIG.SOUNDS) {
            const audio = new Audio();
            audio.src = CONFIG.SOUNDS[key];
            audio.preload = 'auto';
            this.sounds[key] = audio;
            console.log(`Loaded sound: ${key} -> ${CONFIG.SOUNDS[key]}`);
        }
    },
    
    play: function(soundName) {
        if (!this.enabled) return;
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log(`Sound ${soundName} blocked`));
        } else {
            console.log(`Sound ${soundName} not found`);
        }
    },
    
    setEnabled: function(value) {
        this.enabled = value;
    }
};
