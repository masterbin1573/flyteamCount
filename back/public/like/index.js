/**
 * 飞天蒜子点赞功能 SDK
 * 版本: 1.0.0
 * 网站: https://countapi.flyteam.cloud
 */
(function() {
    'use strict';
    
    const API_BASE = 'https://api.flyteam.cloud';
    let isProcessing = false; // 防抖标志
    
    // 工具函数
    function getCurrentPath() {
        return window.location.pathname;
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function(...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // API 调用函数
    function makeRequest(url, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            // 添加认证头（如果有token）
            const token = localStorage.getItem('flyteam_token');
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            reject(new Error('解析响应失败'));
                        }
                    } else {
                        reject(new Error('请求失败: ' + xhr.status));
                    }
                }
            };
            
            xhr.onerror = function() {
                reject(new Error('网络错误'));
            };
            
            if (data) {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        });
    }
    
    // 显示消息
    function showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = 'flyteam-message flyteam-message-' + type;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        // 设置颜色
        if (type === 'success') {
            messageEl.style.backgroundColor = '#67c23a';
        } else if (type === 'error') {
            messageEl.style.backgroundColor = '#f56c6c';
        } else if (type === 'warning') {
            messageEl.style.backgroundColor = '#e6a23c';
        } else {
            messageEl.style.backgroundColor = '#909399';
        }
        
        document.body.appendChild(messageEl);
        
        // 显示动画
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
    
    // 获取点赞数量
    function getLikeCount(path) {
        return makeRequest(API_BASE + '/api/likes/count?path=' + encodeURIComponent(path || getCurrentPath()));
    }
    
    // 切换点赞状态
    function toggleLike(path, title) {
        if (isProcessing) return Promise.reject(new Error('操作进行中，请稍后'));
        
        isProcessing = true;
        
        const data = {
            path: path || getCurrentPath(),
            title: title || document.title
        };
        
        return makeRequest(API_BASE + '/api/likes/toggle', 'POST', data)
            .then(function(response) {
                if (response.success) {
                    const { liked, count } = response.data;
                    
                    // 触发自定义事件
                    if (window.CustomEvent) {
                        document.dispatchEvent(new CustomEvent('flyteam:like-changed', {
                            detail: { liked, count, path: data.path }
                        }));
                    }
                    
                    showMessage(liked ? '点赞成功' : '取消点赞', 'success');
                    return { liked, count };
                } else {
                    throw new Error(response.message || '操作失败');
                }
            })
            .catch(function(error) {
                if (error.message.includes('401')) {
                    showMessage('需要登录后才能点赞', 'warning');
                } else {
                    showMessage('操作失败: ' + error.message, 'error');
                }
                throw error;
            })
            .finally(function() {
                // 1秒后解除防抖
                setTimeout(() => {
                    isProcessing = false;
                }, 1000);
            });
    }
    
    // 初始化点赞按钮
    function initLikeButton(button, options = {}) {
        const path = options.path || button.dataset.path || getCurrentPath();
        const title = options.title || button.dataset.title || document.title;
        
        // 添加样式类
        button.classList.add('flyteam-like-button');
        
        // 添加默认样式
        if (!button.style.cursor) {
            button.style.cursor = 'pointer';
        }
        
        // 获取初始点赞数
        getLikeCount(path)
            .then(function(response) {
                if (response.success) {
                    const { count, liked } = response.data;
                    updateButtonState(button, liked, count);
                }
            })
            .catch(function(error) {
                console.warn('获取点赞数失败:', error);
            });
        
        // 添加点击事件（使用节流）
        const throttledToggle = throttle(function() {
            toggleLike(path, title)
                .then(function(result) {
                    updateButtonState(button, result.liked, result.count);
                })
                .catch(function(error) {
                    console.warn('点赞操作失败:', error);
                });
        }, 1000);
        
        button.addEventListener('click', throttledToggle);
        
        // 标记已初始化
        button.dataset.flyteamInitialized = 'true';
    }
    
    // 更新按钮状态
    function updateButtonState(button, liked, count) {
        // 更新点赞状态类
        if (liked) {
            button.classList.add('flyteam-liked');
        } else {
            button.classList.remove('flyteam-liked');
        }
        
        // 更新文本内容
        if (button.dataset.template) {
            button.textContent = button.dataset.template.replace('{count}', formatNumber(count));
        } else {
            // 查找内部的计数元素
            const countEl = button.querySelector('.flyteam-like-count, [data-like-count]');
            if (countEl) {
                countEl.textContent = formatNumber(count);
            } else {
                // 如果没有找到计数元素，更新整个按钮文本
                const icon = liked ? '❤️' : '♡';
                button.textContent = icon + ' ' + formatNumber(count);
            }
        }
        
        // 更新图标
        const iconEl = button.querySelector('.flyteam-like-icon, [data-like-icon]');
        if (iconEl) {
            iconEl.textContent = liked ? '❤️' : '♡';
        }
    }
    
    // 自动初始化页面上的点赞按钮
    function autoInit() {
        const buttons = document.querySelectorAll('[data-flyteam-like]:not([data-flyteam-initialized])');
        buttons.forEach(function(button) {
            initLikeButton(button);
        });
    }
    
    // DOM 加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        setTimeout(autoInit, 0);
    }
    
    // 监听DOM变化（新增按钮）
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查新增的节点是否是点赞按钮
                        if (node.dataset && node.dataset.flyteamLike && !node.dataset.flyteamInitialized) {
                            initLikeButton(node);
                        }
                        // 检查子元素
                        const childButtons = node.querySelectorAll && node.querySelectorAll('[data-flyteam-like]:not([data-flyteam-initialized])');
                        if (childButtons) {
                            childButtons.forEach(initLikeButton);
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 导出全局对象
    window.FLYTEAM_LIKE = {
        version: '1.0.0',
        toggleLike: toggleLike,
        getLikeCount: getLikeCount,
        initLikeButton: initLikeButton,
        updateButtonState: updateButtonState,
        formatNumber: formatNumber
    };
    
})();