/**
 * 飞天蒜子点赞功能
 * 作者: 飞天团队
 * 版本: 1.0.0
 * 网址: https://countapi.flyteam.cloud
 */

(function() {
    'use strict';
    
    // 配置信息
    const CONFIG = {
        // API_BASE: 'https://countapi.flyteam.cloud', // 生产环境
        API_BASE: 'http://localhost:3001', // 开发环境
        VERSION: '1.0.0',
        DEBUG: false,
        DEBOUNCE_TIME: 1000, // 防抖时间(毫秒)
        ANIMATION_DURATION: 300 // 动画持续时间(毫秒)
    };

    // 日志函数
    function log(...args) {
        if (CONFIG.DEBUG) {
            console.log('[飞天点赞]', ...args);
        }
    }

    // 错误处理
    function error(...args) {
        console.error('[飞天点赞]', ...args);
    }

    // 防抖函数
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

    // 获取当前页面信息
    function getPageInfo() {
        return {
            url: window.location.href,
            path: window.location.pathname + window.location.search,
            title: document.title,
            domain: window.location.hostname
        };
    }

    // 显示消息提示
    function showMessage(message, type = 'info') {
        // 创建消息提示元素
        const messageEl = document.createElement('div');
        messageEl.className = `flyteam-message flyteam-message-${type}`;
        messageEl.textContent = message;
        
        // 添加样式
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#67c23a' : type === 'error' ? '#f56c6c' : '#409eff'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // 显示动画
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 10);
        
        // 3秒后自动移除
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }

    // 点赞动画效果
    function addLikeAnimation(element) {
        element.style.transform = 'scale(1.2)';
        element.style.transition = `transform ${CONFIG.ANIMATION_DURATION}ms ease`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, CONFIG.ANIMATION_DURATION);
    }

    // 获取点赞数量
    async function getLikeCount(path) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/like/status?url=${encodeURIComponent(window.location.href)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            log('获取点赞状态成功', data);
            return data.success ? { count: data.data.likeCount, liked: data.data.liked } : null;
        } catch (err) {
            error('获取点赞数量失败:', err);
            return null;
        }
    }

    // 切换点赞状态
    async function toggleLike(path, title) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/like/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: window.location.href })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    showMessage('需要登录后才能点赞，请先注册登录', 'error');
                    return null;
                }
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            log('点赞操作成功', data);
            
            if (data.success) {
                const { liked, likeCount } = data.data;
                showMessage(liked ? '点赞成功 ❤️' : '取消点赞', liked ? 'success' : 'info');
                return { liked, count: likeCount };
            }
            
            return null;
        } catch (err) {
            error('点赞操作失败:', err);
            showMessage('点赞失败，请稍后重试', 'error');
            return null;
        }
    }

    // 初始化点赞按钮
    function initLikeButton(element) {
        const pageInfo = getPageInfo();
        let isLiked = false;
        let likeCount = 0;
        let isLoading = false;

        // 添加基础样式
        if (!element.style.cursor) {
            element.style.cursor = 'pointer';
        }
        
        // 添加类名用于识别
        element.classList.add('flyteam-like-btn');
        
        // 防抖的点赞函数
        const debouncedToggleLike = debounce(async () => {
            if (isLoading) return;
            
            isLoading = true;
            element.style.opacity = '0.7';
            
            const result = await toggleLike(pageInfo.path, pageInfo.title);
            
            if (result) {
                isLiked = result.liked;
                likeCount = result.count;
                updateButtonDisplay();
                addLikeAnimation(element);
            }
            
            isLoading = false;
            element.style.opacity = '1';
        }, CONFIG.DEBOUNCE_TIME);

        // 更新按钮显示
        function updateButtonDisplay() {
            const originalText = element.dataset.originalText || element.textContent;
            
            // 解析按钮文本，提取模板
            let template = originalText;
            let countPlaceholder = '{{count}}';
            let iconPlaceholder = '{{icon}}';
            
            // 检查是否包含数字，如果有则替换为占位符
            if (/\d+/.test(template)) {
                template = template.replace(/\d+/, countPlaceholder);
            } else if (!template.includes(countPlaceholder)) {
                // 如果没有数字也没有占位符，添加计数
                template = template + ' ' + countPlaceholder;
            }
            
            // 检查是否有图标占位符或添加默认图标
            if (!template.includes(iconPlaceholder)) {
                if (template.includes('❤️') || template.includes('♡') || template.includes('♥')) {
                    template = template.replace(/[❤️♡♥]/, iconPlaceholder);
                } else {
                    template = iconPlaceholder + ' ' + template;
                }
            }
            
            // 替换占位符
            const icon = isLiked ? '❤️' : '♡';
            const displayText = template
                .replace(iconPlaceholder, icon)
                .replace(countPlaceholder, likeCount.toString());
            
            // 使用textContent而不是innerHTML以保持按钮样式
            element.textContent = displayText;
            
            // 更新样式
            if (isLiked) {
                element.classList.add('flyteam-liked');
                element.style.color = '#e74c3c';
            } else {
                element.classList.remove('flyteam-liked');
                element.style.color = '';
            }
        }

        // 绑定点击事件
        element.addEventListener('click', debouncedToggleLike);
        
        // 保存原始文本
        element.dataset.originalText = element.textContent;
        
        // 获取初始点赞数据
        getLikeCount(pageInfo.path).then(data => {
            if (data) {
                likeCount = data.count || 0;
                isLiked = data.liked || false;
                updateButtonDisplay();
            }
        });
        
        log('点赞按钮初始化完成', element);
    }

    // 自动初始化所有点赞按钮
    function autoInit() {
        // 查找所有可能的点赞按钮
        const selectors = [
            '[data-flyteam-like]',
            '.flyteam-like',
            '.like-btn'
            // 移除过于宽泛的选择器，避免误选和多次初始化
            // '[id*="like"]',
            // '[class*="like"]'
        ];

        const buttons = new Set();
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // 排除已经初始化的按钮
                if (!el.classList.contains('flyteam-like-btn')) {
                    buttons.add(el);
                }
            });
        });

        buttons.forEach(button => {
            initLikeButton(button);
        });

        if (buttons.size > 0) {
            log(`自动初始化了 ${buttons.size} 个点赞按钮`);
        }
    }

    // 手动初始化指定元素
    function init(selector) {
        if (typeof selector === 'string') {
            const elements = document.querySelectorAll(selector);
            elements.forEach(initLikeButton);
            log(`手动初始化了 ${elements.length} 个点赞按钮`);
        } else if (selector && typeof selector === 'object') {
            initLikeButton(selector);
            log('手动初始化了 1 个点赞按钮');
        } else {
            autoInit();
        }
    }

    // 等待DOM加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        setTimeout(autoInit, 0);
    }

    // 暴露全局API
    window.flyteamLike = {
        version: CONFIG.VERSION,
        init: init,
        config: CONFIG,
        // 兼容性API
        like: init
    };

    // 添加全局CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .flyteam-like-btn {
            transition: all 0.3s ease;
            user-select: none;
        }
        
        .flyteam-like-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .flyteam-like-btn:active {
            transform: translateY(0);
        }
        
        .flyteam-like-btn.flyteam-liked {
            color: #e74c3c !important;
        }
    `;
    document.head.appendChild(style);

    log('飞天点赞脚本加载完成 v' + CONFIG.VERSION);
})();