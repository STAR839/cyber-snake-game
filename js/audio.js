/**
 * 音频管理器
 * 负责游戏中的背景音乐和音效播放
 */
class AudioManager {
    constructor() {
        this.bgmEnabled = true;
        this.sfxEnabled = true;
        this.bgmVolume = 0.3;
        this.sfxVolume = 0.5;
        
        // 音频上下文
        this.audioContext = null;
        this.bgmSource = null;
        this.bgmGain = null;
        
        // 音效缓存
        this.sfxCache = new Map();
        
        this.initAudioContext();
        this.loadSettings();
    }
    
    /**
     * 初始化音频上下文
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.bgmGain = this.audioContext.createGain();
            this.bgmGain.connect(this.audioContext.destination);
            this.bgmGain.gain.value = this.bgmVolume;
        } catch (error) {
            console.warn('音频上下文初始化失败:', error);
        }
    }
    
    /**
     * 加载设置
     */
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
        this.bgmEnabled = settings.bgmEnabled !== false;
        this.sfxEnabled = settings.sfxEnabled !== false;
        this.bgmVolume = settings.bgmVolume || 0.3;
        this.sfxVolume = settings.sfxVolume || 0.5;
    }
    
    /**
     * 保存设置
     */
    saveSettings() {
        const settings = {
            bgmEnabled: this.bgmEnabled,
            sfxEnabled: this.sfxEnabled,
            bgmVolume: this.bgmVolume,
            sfxVolume: this.sfxVolume
        };
        localStorage.setItem('gameSettings', JSON.stringify(settings));
    }
    
    /**
     * 创建音频振荡器（用于生成音效）
     * @param {number} frequency - 频率
     * @param {number} duration - 持续时间
     * @param {string} type - 波形类型
     * @param {number} volume - 音量
     */
    createTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('音效播放失败:', error);
        }
    }
    
    /**
     * 播放吃食物音效
     */
    playEatSound() {
        // 清脆的“叮”声
        this.createTone(800, 0.1, 'sine', 0.4);
        setTimeout(() => {
            this.createTone(1200, 0.05, 'sine', 0.3);
        }, 50);
    }
    
    /**
     * 播放特殊食物音效
     */
    playSpecialFoodSound() {
        // 更丰富的音效
        this.createTone(600, 0.1, 'triangle', 0.4);
        setTimeout(() => {
            this.createTone(900, 0.1, 'sine', 0.3);
        }, 50);
        setTimeout(() => {
            this.createTone(1200, 0.1, 'square', 0.2);
        }, 100);
    }
    
    /**
     * 播放碰撞音效
     */
    playCollisionSound() {
        // 低沉的爆炸声
        this.createTone(150, 0.3, 'sawtooth', 0.6);
        setTimeout(() => {
            this.createTone(100, 0.2, 'square', 0.4);
        }, 100);
    }
    
    /**
     * 播放按钮点击音效
     */
    playClickSound() {
        this.createTone(1000, 0.05, 'square', 0.2);
    }
    
    /**
     * 播放得分音效
     */
    playScoreSound(score) {
        // 根据分数播放不同音效
        if (score % 1000 === 0) {
            // 里程碑音效
            this.playMilestoneSound();
        } else if (score % 100 === 0) {
            // 百分音效
            this.createTone(1500, 0.2, 'sine', 0.4);
        } else {
            // 普通得分音效
            this.createTone(1200, 0.1, 'triangle', 0.3);
        }
    }
    
    /**
     * 播放里程碑音效
     */
    playMilestoneSound() {
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, 0.2, 'sine', 0.4);
            }, index * 100);
        });
    }
    
    /**
     * 播放游戏开始音效
     */
    playGameStartSound() {
        const notes = [262, 330, 392, 523]; // C4, E4, G4, C5
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, 0.15, 'triangle', 0.3);
            }, index * 80);
        });
    }
    
    /**
     * 播放游戏结束音效
     */
    playGameOverSound() {
        const notes = [523, 494, 440, 392, 349, 330, 294]; // 下降音阶
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, 0.2, 'sawtooth', 0.4);
            }, index * 100);
        });
    }
    
    /**
     * 播放暂停音效
     */
    playPauseSound() {
        this.createTone(440, 0.1, 'sine', 0.3);
        setTimeout(() => {
            this.createTone(330, 0.1, 'sine', 0.3);
        }, 100);
    }
    
    /**
     * 播放恢复音效
     */
    playResumeSound() {
        this.createTone(330, 0.1, 'sine', 0.3);
        setTimeout(() => {
            this.createTone(440, 0.1, 'sine', 0.3);
        }, 100);
    }
    
    /**
     * 开始背景音乐
     */
    startBGM() {
        if (!this.bgmEnabled || !this.audioContext) return;
        
        this.stopBGM();
        this.playAmbientBGM();
    }
    
    /**
     * 播放环境背景音乐
     */
    playAmbientBGM() {
        if (!this.bgmEnabled || !this.audioContext) return;
        
        try {
            // 创建低频环境音
            const lowOsc = this.audioContext.createOscillator();
            const lowGain = this.audioContext.createGain();
            
            lowOsc.connect(lowGain);
            lowGain.connect(this.bgmGain);
            
            lowOsc.frequency.value = 60;
            lowOsc.type = 'sine';
            lowGain.gain.value = 0.1;
            
            // 创建高频装饰音
            const highOsc = this.audioContext.createOscillator();
            const highGain = this.audioContext.createGain();
            
            highOsc.connect(highGain);
            highGain.connect(this.bgmGain);
            
            highOsc.frequency.value = 1200;
            highOsc.type = 'triangle';
            highGain.gain.value = 0.05;
            
            // 添加LFO调制
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            
            lfo.connect(lfoGain);
            lfoGain.connect(highOsc.frequency);
            
            lfo.frequency.value = 0.5;
            lfo.type = 'sine';
            lfoGain.gain.value = 50;
            
            // 启动振荡器
            lowOsc.start();
            highOsc.start();
            lfo.start();
            
            // 保存引用以便停止
            this.bgmSource = { lowOsc, highOsc, lfo };
            
        } catch (error) {
            console.warn('背景音乐播放失败:', error);
        }
    }
    
    /**
     * 停止背景音乐
     */
    stopBGM() {
        if (this.bgmSource) {
            try {
                this.bgmSource.lowOsc.stop();
                this.bgmSource.highOsc.stop();
                this.bgmSource.lfo.stop();
            } catch (error) {
                // 忽略停止错误
            }
            this.bgmSource = null;
        }
    }
    
    /**
     * 设置背景音乐音量
     * @param {number} volume - 音量 (0-1)
     */
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmGain) {
            this.bgmGain.gain.value = this.bgmVolume;
        }
        this.saveSettings();
    }
    
    /**
     * 设置音效音量
     * @param {number} volume - 音量 (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    /**
     * 切换背景音乐开关
     */
    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        if (this.bgmEnabled) {
            this.startBGM();
        } else {
            this.stopBGM();
        }
        this.saveSettings();
    }
    
    /**
     * 切换音效开关
     */
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        this.saveSettings();
    }
    
    /**
     * 设置背景音乐开关
     * @param {boolean} enabled - 是否开启
     */
    setBGMEnabled(enabled) {
        this.bgmEnabled = enabled;
        if (enabled) {
            this.startBGM();
        } else {
            this.stopBGM();
        }
        this.saveSettings();
    }
    
    /**
     * 设置音效开关
     * @param {boolean} enabled - 是否开启
     */
    setSFXEnabled(enabled) {
        this.sfxEnabled = enabled;
        this.saveSettings();
    }
    
    /**
     * 播放成就解锁音效
     */
    playAchievementSound() {
        // 胜利音效
        const notes = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, 0.3, 'sine', 0.5);
            }, index * 150);
        });
    }
    
    /**
     * 播放皮肤解锁音效
     */
    playSkinUnlockSound() {
        // 神秘的解锁音效
        this.createTone(440, 0.2, 'triangle', 0.4);
        setTimeout(() => {
            this.createTone(554, 0.2, 'sine', 0.4);
        }, 100);
        setTimeout(() => {
            this.createTone(659, 0.3, 'triangle', 0.5);
        }, 200);
    }
    
    /**
     * 播放通用音效
     * @param {string} soundType - 音效类型
     */
    playSound(soundType) {
        switch (soundType) {
            case 'eat':
                this.playEatSound();
                break;
            case 'specialFood':
                this.playSpecialFoodSound();
                break;
            case 'collision':
            case 'gameOver':
                this.playGameOverSound();
                break;
            case 'click':
                this.playClickSound();
                break;
            case 'gameStart':
                this.playGameStartSound();
                break;
            case 'pause':
                this.playPauseSound();
                break;
            case 'resume':
                this.playResumeSound();
                break;
            case 'achievement':
                this.playAchievementSound();
                break;
            case 'skinUnlock':
                this.playSkinUnlockSound();
                break;
            default:
                console.warn('未知的音效类型:', soundType);
        }
    }
    
    /**
     * 获取音频设置
     * @returns {Object} 音频设置
     */
    getSettings() {
        return {
            bgmEnabled: this.bgmEnabled,
            sfxEnabled: this.sfxEnabled,
            bgmVolume: this.bgmVolume,
            sfxVolume: this.sfxVolume
        };
    }
}

// 创建全局音频管理器实例
if (typeof window !== 'undefined') {
    window.audioManager = new AudioManager();
}