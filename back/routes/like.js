const Router = require('koa-router');
const Like = require('../models/Like');
const { hashIP, hashUserAgent, getClientIP } = require('../utils/crypto');
const { extractDomain, extractPath } = require('../utils/parser');

const router = new Router();

/**
 * 切换点赞状态（点赞/取消点赞）
 * POST /api/like/toggle
 */
router.post('/toggle', async (ctx) => {
  try {
    const { url } = ctx.request.body;
    
    if (!url) {
      ctx.status = 400;
      ctx.body = { success: false, message: '缺少URL参数' };
      return;
    }

    const domain = extractDomain(url);
    const path = extractPath(url);
    const clientIP = getClientIP(ctx);
    const userAgent = ctx.get('User-Agent') || '';
    
    // 生成哈希值
    const ipHash = hashIP(clientIP);
    const uaHash = hashUserAgent(userAgent);

    // 防抖检查：同一IP在10秒内只能操作一次
    const recentLike = await Like.findOne({
      domain,
      path,
      ipHash,
      createdAt: { $gte: new Date(Date.now() - 10000) } // 10秒内
    });

    if (recentLike) {
      ctx.status = 429;
      ctx.body = { 
        success: false, 
        message: '操作过于频繁，请稍后再试',
        data: {
          waitTime: 10 - Math.floor((Date.now() - recentLike.createdAt.getTime()) / 1000)
        }
      };
      return;
    }

    // 查找现有点赞记录
    const existingLike = await Like.findOne({
      domain,
      path,
      ipHash,
      active: true
    });

    let liked = false;
    let likeCount = 0;

    if (existingLike) {
      // 取消点赞
      existingLike.active = false;
      await existingLike.save();
      liked = false;
    } else {
      // 添加点赞
      const newLike = new Like({
        domain,
        path,
        ipHash,
        uaHash,
        active: true
      });
      await newLike.save();
      liked = true;
    }

    // 获取当前点赞数
    likeCount = await Like.countDocuments({
      domain,
      path,
      active: true
    });

    ctx.body = {
      success: true,
      message: liked ? '点赞成功' : '取消点赞成功',
      data: {
        liked,
        likeCount,
        domain,
        path
      }
    };

  } catch (error) {
    console.error('点赞操作失败:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '点赞操作失败' };
  }
});

/**
 * 获取点赞数量和状态
 * GET /api/like/status
 */
router.get('/status', async (ctx) => {
  try {
    const { url } = ctx.query;
    
    if (!url) {
      ctx.status = 400;
      ctx.body = { success: false, message: '缺少URL参数' };
      return;
    }

    const domain = extractDomain(url);
    const path = extractPath(url);
    const clientIP = getClientIP(ctx);
    const ipHash = hashIP(clientIP);

    // 获取点赞数量
    const likeCount = await Like.countDocuments({
      domain,
      path,
      active: true
    });

    // 检查当前用户是否已点赞
    const userLike = await Like.findOne({
      domain,
      path,
      ipHash,
      active: true
    });

    ctx.body = {
      success: true,
      message: '获取点赞状态成功',
      data: {
        liked: !!userLike,
        likeCount,
        domain,
        path
      }
    };

  } catch (error) {
    console.error('获取点赞状态失败:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '获取点赞状态失败' };
  }
});

/**
 * 获取网站的点赞排行榜
 * GET /api/like/ranking/:domain
 */
router.get('/ranking/:domain', async (ctx) => {
  try {
    const { domain } = ctx.params;
    const { limit = 10 } = ctx.query;

    // 聚合查询获取页面点赞排行
    const ranking = await Like.aggregate([
      {
        $match: {
          domain,
          active: true
        }
      },
      {
        $group: {
          _id: '$path',
          likeCount: { $sum: 1 },
          latestLike: { $max: '$createdAt' }
        }
      },
      {
        $sort: { likeCount: -1, latestLike: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          path: '$_id',
          likeCount: 1,
          latestLike: 1,
          _id: 0
        }
      }
    ]);

    ctx.body = {
      success: true,
      message: '获取点赞排行榜成功',
      data: {
        domain,
        ranking
      }
    };

  } catch (error) {
    console.error('获取点赞排行榜失败:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '获取点赞排行榜失败' };
  }
});

/**
 * 生成点赞脚本
 * GET /api/like/script.js
 */
router.get('/script.js', async (ctx) => {
  const scriptContent = `
(function() {
  var flyteamLike = {
    // 配置
    config: {
      apiBase: '${ctx.protocol}://${ctx.host}/api/like',
      cooldown: 10000 // 10秒冷却时间
    },
    
    // 最后操作时间
    lastAction: 0,
    
    // 初始化点赞功能
    init: function() {
      this.loadStatus();
      this.bindEvents();
    },
    
    // 加载点赞状态
    loadStatus: function() {
      var url = window.location.href;
      
      fetch(this.config.apiBase + '/status?url=' + encodeURIComponent(url))
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.success) {
            flyteamLike.updateElements(data.data);
          }
        })
        .catch(function(error) {
          console.warn('飞天蒜子点赞状态加载失败:', error);
        });
    },
    
    // 切换点赞状态
    toggle: function() {
      var now = Date.now();
      if (now - this.lastAction < this.config.cooldown) {
        var remaining = Math.ceil((this.config.cooldown - (now - this.lastAction)) / 1000);
        this.showMessage('请等待 ' + remaining + ' 秒后再试');
        return;
      }
      
      var url = window.location.href;
      
      fetch(this.config.apiBase + '/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.success) {
          flyteamLike.updateElements(data.data);
          flyteamLike.showMessage(data.message);
          flyteamLike.lastAction = Date.now();
        } else {
          flyteamLike.showMessage(data.message);
        }
      })
      .catch(function(error) {
        flyteamLike.showMessage('点赞操作失败，请稍后重试');
        console.error('点赞操作失败:', error);
      });
    },
    
    // 更新页面元素
    updateElements: function(data) {
      // 更新点赞数量
      this.updateElement('flyteam_like_count', data.likeCount);
      
      // 更新点赞按钮状态
      var buttons = document.querySelectorAll('.flyteam-like-btn');
      buttons.forEach(function(btn) {
        if (data.liked) {
          btn.classList.add('liked');
          btn.textContent = '❤️ ' + data.likeCount;
        } else {
          btn.classList.remove('liked');
          btn.textContent = '♡ ' + data.likeCount;
        }
      });
    },
    
    // 更新单个元素
    updateElement: function(id, value) {
      var element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    },
    
    // 绑定事件
    bindEvents: function() {
      var self = this;
      
      // 点赞按钮点击事件
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('flyteam-like-btn')) {
          e.preventDefault();
          self.toggle();
        }
      });
    },
    
    // 显示消息
    showMessage: function(message) {
      // 创建临时提示元素
      var toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:white;padding:10px 20px;border-radius:5px;z-index:9999;font-size:14px;';
      
      document.body.appendChild(toast);
      
      setTimeout(function() {
        document.body.removeChild(toast);
      }, 3000);
    }
  };
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      flyteamLike.init();
    });
  } else {
    flyteamLike.init();
  }
  
  // 导出到全局，方便手动调用
  window.flyteamLike = flyteamLike;
})();
  `;

  ctx.type = 'application/javascript';
  ctx.body = scriptContent;
});

module.exports = router;