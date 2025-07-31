/**
 * 飞天蒜子统计 - 兼容不蒜子的统计脚本
 * 版本: 2.3.0
 * 网站: https://countapi.flyteam.cloud
 */
(function() {
    'use strict';
    
    const API_BASE = 'https://api.flyteam.cloud';
    
    // 工具函数
    function getCurrentDomain() {
        return window.location.hostname;
    }
    
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
    
    // API 调用函数
    function makeRequest(url, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
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
    
    // 记录访问
    function recordVisit() {
        const data = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer
        };
        
        makeRequest(API_BASE + '/api/stats/record', 'POST', data)
            .catch(function(error) {
                console.warn('记录访问失败:', error);
            });
    }
    
    // 获取统计数据
    function getStats(domain) {
        return makeRequest(API_BASE + '/api/stats/busuanzi/' + domain);
    }
    
    // 更新页面元素
    function updateElement(elementId, value, format = false) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = format ? formatNumber(value) : value;
            // 显示容器元素
            const container = document.getElementById(elementId.replace('_value_', '_container_'));
            if (container) {
                container.style.display = '';
            }
        }
    }
    
    // 主要初始化函数
    function initBusuanzi() {
        const domain = getCurrentDomain();
        
        // 记录访问
        recordVisit();
        
        // 获取并更新统计数据
        getStats(domain)
            .then(function(response) {
                if (response.success && response.data) {
                    const stats = response.data;
                    
                    // 更新站点统计
                    updateElement('busuanzi_value_site_pv', stats.site_pv || 0, true);
                    updateElement('busuanzi_value_site_uv', stats.site_uv || 0, true);
                    
                    // 更新页面统计
                    updateElement('busuanzi_value_page_pv', stats.page_pv || 0, true);
                    
                    // 兼容其他格式
                    updateElement('site-pv', stats.site_pv || 0, true);
                    updateElement('site-uv', stats.site_uv || 0, true);
                    updateElement('page-pv', stats.page_pv || 0, true);
                    
                    // 触发自定义事件
                    if (window.CustomEvent) {
                        document.dispatchEvent(new CustomEvent('busuanzi:ready', {
                            detail: stats
                        }));
                    }
                }
            })
            .catch(function(error) {
                console.warn('获取统计数据失败:', error);
                // 设置默认值
                updateElement('busuanzi_value_site_pv', 1);
                updateElement('busuanzi_value_site_uv', 1);
                updateElement('busuanzi_value_page_pv', 1);
            });
    }
    
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBusuanzi);
    } else {
        // DOM 已经加载完成
        setTimeout(initBusuanzi, 0);
    }
    
    // 导出全局对象（用于调试和扩展）
    window.FLYTEAM_STATS = {
        version: '2.3.0',
        recordVisit: recordVisit,
        getStats: getStats,
        updateElement: updateElement,
        formatNumber: formatNumber
    };
    
})();