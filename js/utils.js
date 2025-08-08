/**
 * 工具函数集合
 * 提供游戏开发中常用的工具方法
 */

/**
 * 获取随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机整数
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 获取随机颜色
 * @param {Array} colors - 颜色数组
 * @returns {string} 随机颜色
 */
function getRandomColor(colors = ['#00F0FF', '#FF00C8', '#FFDD00', '#39FF14']) {
    return colors[getRandomInt(0, colors.length - 1)];
}

/**
 * 检测移动设备
 * @returns {boolean} 是否为移动设备
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 格式化时间
 * @param {number} seconds - 秒数
 * @returns {string} 格式化的时间字符串
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 计算两点之间的距离
 * @param {Object} point1 - 第一个点 {x, y}
 * @param {Object} point2 - 第二个点 {x, y}
 * @returns {number} 距离
 */
function getDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 检测矩形碰撞
 * @param {Object} rect1 - 第一个矩形 {x, y, width, height}
 * @param {Object} rect2 - 第二个矩形 {x, y, width, height}
 * @returns {boolean} 是否碰撞
 */
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * 创建粒子效果
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} color - 颜色
 * @param {number} count - 粒子数量
 */
function createParticles(ctx, x, y, color = '#00F0FF', count = 10) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1.0,
            decay: 0.02,
            color: color
        });
    }
    return particles;
}

/**
 * 更新粒子
 * @param {Array} particles - 粒子数组
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 */
function updateParticles(particles, ctx) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 更新生命值
        particle.life -= particle.decay;
        
        // 绘制粒子
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fillRect(particle.x, particle.y, 3, 3);
        ctx.restore();
        
        // 移除死亡粒子
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

/**
 * 创建发光效果
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {string} color - 颜色
 * @param {number} blur - 模糊程度
 */
function setGlowEffect(ctx, color, blur = 10) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
}

/**
 * 清除发光效果
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 */
function clearGlowEffect(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}

/**
 * 线性插值
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值参数 (0-1)
 * @returns {number} 插值结果
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * 缓动函数 - 缓入缓出
 * @param {number} t - 时间参数 (0-1)
 * @returns {number} 缓动值
 */
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * 角度转弧度
 * @param {number} degrees - 角度
 * @returns {number} 弧度
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * 弧度转角度
 * @param {number} radians - 弧度
 * @returns {number} 角度
 */
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * 限制数值范围
 * @param {number} value - 值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * 检测全屏支持
 * @returns {boolean} 是否支持全屏
 */
function isFullscreenSupported() {
    return !!(document.fullscreenEnabled || 
              document.webkitFullscreenEnabled || 
              document.mozFullScreenEnabled || 
              document.msFullscreenEnabled);
}

/**
 * 进入全屏
 * @param {HTMLElement} element - 要全屏的元素
 */
function enterFullscreen(element = document.documentElement) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * 退出全屏
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * 检测是否处于全屏状态
 * @returns {boolean} 是否全屏
 */
function isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
}

/**
 * 工具函数命名空间
 */
const Utils = {
    getRandomInt,
    getRandomColor,
    isMobile,
    debounce,
    throttle,
    formatTime,
    getDistance,
    checkCollision,
    deepClone,
    createParticles,
    updateParticles,
    setGlowEffect,
    clearGlowEffect,
    lerp,
    easeInOutQuad,
    degreesToRadians,
    radiansToDegrees,
    clamp,
    isFullscreenSupported,
    enterFullscreen,
    exitFullscreen,
    isFullscreen
};

// 导出到全局
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}