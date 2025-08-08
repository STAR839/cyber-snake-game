/**
 * 游戏主入口文件
 * 负责初始化游戏并协调各个模块
 */

/**
 * 游戏应用类
 * 统一管理游戏的各个模块
 */
class GameApp {
    constructor() {
        this.initialized = false;
        this.version = '1.0.0';
        this.debugMode = false;
        
        this.init();
    }
    
    /**
     * 初始化游戏应用
     */
    async init() {
        try {
            console.log('🎮 赛博霓虹贪吃蛇 v' + this.version + ' 正在启动...');
            
            // 显示加载界面
            this.showSplashScreen();
            
            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // 初始化各个模块
            await this.initModules();
            
            // 设置全局错误处理
            this.setupErrorHandling();
            
            // 设置性能监控
            this.setupPerformanceMonitoring();
            
            // 初始化完成
            this.initialized = true;
            console.log('✅ 游戏初始化完成');
            
            // 隐藏加载界面
            this.hideSplashScreen();
            
            // 开始游戏循环
            this.startGameLoop();
            
        } catch (error) {
            console.error('❌ 游戏初始化失败:', error);
            this.showErrorScreen(error);
        }
    }
    
    /**
     * 显示启动画面
     */
    showSplashScreen() {
        const splash = document.createElement('div');
        splash.id = 'splash-screen';
        splash.innerHTML = `
            <div class="splash-content">
                <div class="splash-logo">
                    <h1 class="neon-text">CYBER<span style="color: #FF00C8;">SNAKE</span></h1>
                    <div class="loading-bar">
                        <div class="loading-progress"></div>
                    </div>
                    <p class="loading-text">正在加载游戏资源...</p>
                </div>
            </div>
        `;
        
        splash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0A0E27 0%, #1A0B3E 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Press Start 2P', monospace;
        `;
        
        document.body.appendChild(splash);
        
        // 模拟加载进度
        this.animateLoadingProgress();
    }
    
    /**
     * 动画加载进度
     */
    animateLoadingProgress() {
        const progressBar = document.querySelector('.loading-progress');
        if (!progressBar) return;
        
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #00F0FF, #FF00C8);
            transition: width 0.3s ease;
            box-shadow: 0 0 10px #00F0FF;
        `;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }
    
    /**
     * 隐藏启动画面
     */
    hideSplashScreen() {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                splash.remove();
            }, 500);
        }
    }
    
    /**
     * 初始化各个模块
     */
    async initModules() {
        console.log('📦 正在初始化模块...');
        
        // 检查必要的全局对象是否存在
        this.checkDependencies();
        
        // 初始化存储管理器
        if (window.storageManager) {
            console.log('💾 存储管理器已就绪');
        }
        
        // 初始化音频管理器
        if (window.audioManager) {
            console.log('🔊 音频管理器已就绪');
        }
        
        // 初始化游戏核心
        if (window.game) {
            console.log('🎯 游戏核心已就绪');
        }
        
        // 初始化UI管理器
        if (window.uiManager) {
            console.log('🖥️ UI管理器已就绪');
        }
        
        // 设置模块间的通信
        this.setupModuleCommunication();
        
        // 加载用户设置
        this.loadUserSettings();
        
        console.log('✅ 所有模块初始化完成');
    }
    
    /**
     * 检查依赖项
     */
    checkDependencies() {
        const requiredGlobals = [
            'Utils',
            'storageManager',
            'audioManager',
            'game',
            'uiManager'
        ];
        
        const missing = requiredGlobals.filter(name => !window[name]);
        
        if (missing.length > 0) {
            throw new Error(`缺少必要的模块: ${missing.join(', ')}`);
        }
    }
    
    /**
     * 设置模块间通信
     */
    setupModuleCommunication() {
        // 游戏事件监听
        document.addEventListener('gameStart', () => {
            console.log('🎯 游戏开始');
            if (window.audioManager) {
                window.audioManager.playSound('gameStart');
            }
        });
        
        document.addEventListener('gameOver', (event) => {
            console.log('💀 游戏结束, 分数:', event.detail.score);
            if (window.audioManager) {
                window.audioManager.playSound('gameOver');
            }
            if (window.storageManager) {
                window.storageManager.updateHighScore(event.detail.score);
            }
        });
        
        document.addEventListener('scoreUpdate', (event) => {
            if (window.uiManager) {
                window.uiManager.updateScore(event.detail.score);
            }
        });
        
        document.addEventListener('achievementUnlocked', (event) => {
            console.log('🏆 成就解锁:', event.detail.achievement);
            if (window.uiManager) {
                window.uiManager.showAchievementNotification(event.detail.achievement);
            }
            if (window.audioManager) {
                window.audioManager.playSound('achievement');
            }
        });
    }
    
    /**
     * 加载用户设置
     */
    loadUserSettings() {
        if (!window.storageManager) return;
        
        const settings = window.storageManager.getSettings();
        
        // 应用音效设置
        if (window.audioManager) {
            window.audioManager.setSoundEnabled(settings.soundEnabled);
            window.audioManager.setMusicEnabled(settings.musicEnabled);
        }
        
        // 应用主题设置
        if (settings.nightMode) {
            document.body.classList.add('night-mode');
        }
        
        console.log('⚙️ 用户设置已加载');
    }
    
    /**
     * 设置全局错误处理
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('全局错误:', event.error);
            this.handleError(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise拒绝:', event.reason);
            this.handleError(event.reason);
        });
    }
    
    /**
     * 处理错误
     * @param {Error} error - 错误对象
     */
    handleError(error) {
        // 记录错误
        if (window.storageManager) {
            window.storageManager.logError(error);
        }
        
        // 显示用户友好的错误信息
        if (window.uiManager) {
            window.uiManager.showNotification('游戏遇到错误，请刷新页面重试', 'error');
        }
    }
    
    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        // 监控帧率
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (this.debugMode) {
                    console.log('FPS:', fps);
                }
                
                // 如果帧率过低，显示警告
                if (fps < 30 && window.uiManager) {
                    window.uiManager.showNotification('性能较低，建议降低画质设置', 'warning');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorFPS);
        };
        
        if (this.debugMode) {
            requestAnimationFrame(monitorFPS);
        }
    }
    
    /**
     * 显示错误界面
     * @param {Error} error - 错误对象
     */
    showErrorScreen(error) {
        const errorScreen = document.createElement('div');
        errorScreen.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0A0E27;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #FF0040;
                font-family: 'Press Start 2P', monospace;
                text-align: center;
                z-index: 10001;
            ">
                <div>
                    <h1>游戏启动失败</h1>
                    <p style="margin: 20px 0; font-size: 12px;">${error.message}</p>
                    <button onclick="location.reload()" style="
                        background: #FF0040;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-family: inherit;
                        cursor: pointer;
                    ">重新加载</button>
                </div>
            </div>
        `;
        document.body.appendChild(errorScreen);
    }
    
    /**
     * 开始游戏循环
     */
    startGameLoop() {
        if (window.game && typeof window.game.start === 'function') {
            window.game.start();
        }
    }
    
    /**
     * 切换调试模式
     */
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log('调试模式:', this.debugMode ? '开启' : '关闭');
        
        if (this.debugMode) {
            // 显示调试信息
            document.body.classList.add('debug-mode');
        } else {
            document.body.classList.remove('debug-mode');
        }
    }
    
    /**
     * 获取游戏状态
     * @returns {Object} 游戏状态信息
     */
    getStatus() {
        return {
            initialized: this.initialized,
            version: this.version,
            debugMode: this.debugMode,
            modules: {
                storage: !!window.storageManager,
                audio: !!window.audioManager,
                game: !!window.game,
                ui: !!window.uiManager
            }
        };
    }
}

// 创建全局游戏应用实例
window.gameApp = new GameApp();

// 开发者工具
if (typeof window !== 'undefined') {
    window.CyberSnake = {
        app: window.gameApp,
        game: () => window.game,
        ui: () => window.uiManager,
        storage: () => window.storageManager,
        audio: () => window.audioManager,
        utils: () => window.Utils,
        debug: () => window.gameApp.toggleDebugMode(),
        status: () => window.gameApp.getStatus()
    };
    
    console.log('🛠️ 开发者工具已加载，使用 CyberSnake 对象访问游戏模块');
}