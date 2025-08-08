/**
 * 本地存储管理器
 * 负责游戏数据的保存、读取和管理
 */
class StorageManager {
    constructor() {
        this.storageKey = 'cyberSnakeGame';
        this.defaultData = {
            highScore: 10000,
            totalGames: 0,
            totalScore: 0,
            achievements: {},
            unlockedSkins: ['default'],
            currentSkin: 'default',
            settings: {
                bgmEnabled: true,
                sfxEnabled: true,
                nightMode: false,
                difficulty: 'normal'
            },
            statistics: {
                longestSnake: 0,
                totalFoodEaten: 0,
                totalSpecialFoodEaten: 0,
                totalPlayTime: 0,
                bestSurvivalTime: 0
            }
        };
        
        this.data = this.loadData();
        this.initAchievements();
        
        // 确保最高分至少为10000
        this.ensureMinimumHighScore(10000);
    }
    
    /**
     * 加载游戏数据
     * @returns {Object} 游戏数据
     */
    loadData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // 合并默认数据，确保新字段存在
                return this.mergeData(this.defaultData, parsed);
            }
        } catch (error) {
            console.warn('加载游戏数据失败:', error);
        }
        return { ...this.defaultData };
    }
    
    /**
     * 保存游戏数据
     */
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.error('保存游戏数据失败:', error);
        }
    }
    
    /**
     * 合并数据对象
     * @param {Object} defaultObj - 默认对象
     * @param {Object} savedObj - 保存的对象
     * @returns {Object} 合并后的对象
     */
    mergeData(defaultObj, savedObj) {
        const result = { ...defaultObj };
        
        for (const key in savedObj) {
            if (savedObj.hasOwnProperty(key)) {
                if (typeof defaultObj[key] === 'object' && defaultObj[key] !== null && !Array.isArray(defaultObj[key])) {
                    result[key] = this.mergeData(defaultObj[key], savedObj[key]);
                } else {
                    result[key] = savedObj[key];
                }
            }
        }
        
        return result;
    }
    
    /**
     * 初始化成就系统
     */
    initAchievements() {
        const achievements = {
            firstGame: { name: '初次尝试', desc: '完成第一局游戏', unlocked: false },
            score100: { name: '小试牛刀', desc: '达到100分', unlocked: false },
            score500: { name: '渐入佳境', desc: '达到500分', unlocked: false },
            score1000: { name: '千分达人', desc: '达到1000分', unlocked: false },
            score5000: { name: '霓虹大师', desc: '达到5000分', unlocked: false },
            length10: { name: '成长之路', desc: '蛇身长度达到10节', unlocked: false },
            length20: { name: '霓虹长蛇', desc: '蛇身长度达到20节', unlocked: false },
            survival60: { name: '生存专家', desc: '单局存杠60秒', unlocked: false },
            survival300: { name: '持久战士', desc: '单局存杠5分钟', unlocked: false },
            specialFood10: { name: '特殊收集者', desc: '吃到10个特殊食物', unlocked: false },
            games10: { name: '坚持不懈', desc: '完成10局游戏', unlocked: false },
            games50: { name: '游戏达人', desc: '完成50局游戏', unlocked: false },
            perfectTurn: { name: '完美转向', desc: '连续转吁10次不撞墙', unlocked: false },
            speedDemon: { name: '速度恶魔', desc: '在最高速度下存杠30秒', unlocked: false },
            collector: { name: '收集狂魔', desc: '单局吃到50个食物', unlocked: false }
        };
        
        // 合并现有成就数据
        for (const key in achievements) {
            if (!this.data.achievements.hasOwnProperty(key)) {
                this.data.achievements[key] = achievements[key];
            }
        }
    }
    
    /**
     * 更新最高分
     * @param {number} score - 分数
     * @returns {boolean} 是否创造新纪录
     */
    updateHighScore(score) {
        if (score > this.data.highScore) {
            this.data.highScore = score;
            this.saveData();
            return true;
        }
        return false;
    }
    
    /**
     * 记录游戏结果
     * @param {Object} gameResult - 游戏结果
     */
    recordGameResult(gameResult) {
        const { score, snakeLength, survivalTime, foodEaten, specialFoodEaten } = gameResult;
        
        // 更新统计数据
        this.data.totalGames++;
        this.data.totalScore += score;
        this.data.statistics.longestSnake = Math.max(this.data.statistics.longestSnake, snakeLength);
        this.data.statistics.totalFoodEaten += foodEaten;
        this.data.statistics.totalSpecialFoodEaten += specialFoodEaten;
        this.data.statistics.totalPlayTime += survivalTime;
        this.data.statistics.bestSurvivalTime = Math.max(this.data.statistics.bestSurvivalTime, survivalTime);
        
        // 检查成就
        this.checkAchievements(gameResult);
        
        this.saveData();
    }
    
    /**
     * 检查成就
     * @param {Object} gameResult - 游戏结果
     */
    checkAchievements(gameResult) {
        const { score, snakeLength, survivalTime, foodEaten, specialFoodEaten } = gameResult;
        const newAchievements = [];
        
        // 检查各种成就
        const achievementChecks = [
            { key: 'firstGame', condition: this.data.totalGames >= 1 },
            { key: 'score100', condition: score >= 100 },
            { key: 'score500', condition: score >= 500 },
            { key: 'score1000', condition: score >= 1000 },
            { key: 'score5000', condition: score >= 5000 },
            { key: 'length10', condition: snakeLength >= 10 },
            { key: 'length20', condition: snakeLength >= 20 },
            { key: 'survival60', condition: survivalTime >= 60 },
            { key: 'survival300', condition: survivalTime >= 300 },
            { key: 'specialFood10', condition: this.data.statistics.totalSpecialFoodEaten >= 10 },
            { key: 'games10', condition: this.data.totalGames >= 10 },
            { key: 'games50', condition: this.data.totalGames >= 50 },
            { key: 'collector', condition: foodEaten >= 50 }
        ];
        
        achievementChecks.forEach(check => {
            if (check.condition && !this.data.achievements[check.key].unlocked) {
                this.data.achievements[check.key].unlocked = true;
                newAchievements.push(this.data.achievements[check.key]);
            }
        });
        
        return newAchievements;
    }
    
    /**
     * 解锁皮肤
     * @param {string} skinId - 皮肤ID
     */
    unlockSkin(skinId) {
        if (!this.data.unlockedSkins.includes(skinId)) {
            this.data.unlockedSkins.push(skinId);
            this.saveData();
            return true;
        }
        return false;
    }
    
    /**
     * 设置当前皮肤
     * @param {string} skinId - 皮肤ID
     */
    setCurrentSkin(skinId) {
        if (this.data.unlockedSkins.includes(skinId)) {
            this.data.currentSkin = skinId;
            this.saveData();
            return true;
        }
        return false;
    }
    
    /**
     * 获取皮肤解锁状态
     * @param {string} skinId - 皮肤ID
     * @returns {boolean} 是否已解锁
     */
    isSkinUnlocked(skinId) {
        return this.data.unlockedSkins.includes(skinId);
    }
    
    /**
     * 更新设置
     * @param {Object} settings - 设置对象
     */
    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.saveData();
    }
    
    /**
     * 获取设置
     * @param {string} key - 设置键名
     * @returns {*} 设置值
     */
    getSetting(key) {
        return this.data.settings[key];
    }
    
    /**
     * 获取统计数据
     * @returns {Object} 统计数据
     */
    getStatistics() {
        return { ...this.data.statistics };
    }
    
    /**
     * 获取成就列表
     * @returns {Object} 成就列表
     */
    getAchievements() {
        return { ...this.data.achievements };
    }
    
    /**
     * 获取最高分
     * @returns {number} 最高分
     */
    getHighScore() {
        return this.data.highScore;
    }
    
    /**
     * 获取当前皮肤
     * @returns {string} 当前皮肤ID
     */
    getCurrentSkin() {
        return this.data.currentSkin;
    }
    
    /**
     * 获取已解锁皮肤
     * @returns {Array} 已解锁皮肤列表
     */
    getUnlockedSkins() {
        return [...this.data.unlockedSkins];
    }
    
    /**
     * 获取所有设置
     * @returns {Object} 设置对象
     */
    getSettings() {
        return { ...this.data.settings };
    }
    
    /**
     * 确保最低最高分
     * @param {number} minScore - 最低分数
     */
    ensureMinimumHighScore(minScore) {
        if (this.data.highScore < minScore) {
            this.data.highScore = minScore;
            this.saveData();
        }
    }
    
    /**
     * 重置游戏数据
     */
    resetData() {
        this.data = { ...this.defaultData };
        this.initAchievements();
        this.ensureMinimumHighScore(10000);
        this.saveData();
    }
    
    /**
     * 导出游戏数据
     * @returns {string} JSON格式的游戏数据
     */
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }
    
    /**
     * 导入游戏数据
     * @param {string} jsonData - JSON格式的游戏数据
     * @returns {boolean} 是否导入成功
     */
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            this.data = this.mergeData(this.defaultData, importedData);
            this.saveData();
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
    
    /**
     * 记录错误日志
     * @param {Error} error - 错误对象
     */
    logError(error) {
        const errorLog = {
            timestamp: Date.now(),
            message: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent
        };
        
        // 将错误日志保存到本地存储
        const errorLogs = JSON.parse(localStorage.getItem('gameErrorLogs') || '[]');
        errorLogs.push(errorLog);
        
        // 只保留最近的50条错误日志
        if (errorLogs.length > 50) {
            errorLogs.splice(0, errorLogs.length - 50);
        }
        
        localStorage.setItem('gameErrorLogs', JSON.stringify(errorLogs));
    }
}

// 创建全局存储管理器实例
if (typeof window !== 'undefined') {
    window.storageManager = new StorageManager();
}