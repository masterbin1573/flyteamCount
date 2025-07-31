const Router = require('koa-router');
const Site = require('../models/Site');
const Visit = require('../models/Visit');
const { hashIP, hashUserAgent, generateSessionId, getClientIP } = require('../utils/crypto');
const { parseUserAgent, parseGeoLocation, extractDomain, extractPath } = require('../utils/parser');

const router = new Router();

/**
 * 记录访问统计
 * POST /api/stats/record
 */
router.post('/record', async (ctx) => {
  try {
    const { url, title, referrer } = ctx.request.body;
    
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
    
    // 解析用户代理和地理位置
    const { browser, os, device } = parseUserAgent(userAgent);
    const geoLocation = parseGeoLocation(clientIP);
    
    // 生成或获取会话ID
    let sessionId = ctx.cookies.get('flyteam_session');
    if (!sessionId) {
      sessionId = generateSessionId();
      ctx.cookies.set('flyteam_session', sessionId, {
        maxAge: 30 * 60 * 1000, // 30分钟
        httpOnly: true,
        secure: false
      });
    }

    // 查找或创建网站记录
    let site = await Site.findOne({ domain });
    if (!site) {
      site = new Site({
        domain,
        title: title || domain,
        pv: 0,
        uv: 0,
        todayPv: 0,
        todayUv: 0
      });
    }

    // 检查是否为新访客（同一IP在同一天首次访问）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingVisitToday = await Visit.findOne({
      s: site._id,
      i: ipHash,
      t: { $gte: today, $lt: tomorrow }
    });

    const isNewVisitor = !existingVisitToday;

    // 创建访问记录
    const visit = new Visit({
      s: site._id,
      p: path,
      i: ipHash,
      u: uaHash,
      r: referrer || '',
      g: geoLocation,
      b: browser,
      o: os,
      d: device,
      sess: sessionId,
      n: isNewVisitor
    });

    // 更新网站统计
    site.pv += 1;
    site.todayPv += 1;
    
    if (isNewVisitor) {
      site.uv += 1;
      site.todayUv += 1;
    }

    site.lastUpdate = new Date();
    if (title && title !== site.title) {
      site.title = title;
    }

    // 保存数据
    await Promise.all([visit.save(), site.save()]);

    ctx.body = {
      success: true,
      message: '统计记录成功',
      data: {
        pv: site.pv,
        uv: site.uv,
        todayPv: site.todayPv,
        todayUv: site.todayUv
      }
    };

  } catch (error) {
    console.error('记录统计失败:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '统计记录失败' };
  }
});

/**
 * 获取网站统计数据
 * GET /api/stats/:domain
 */
router.get('/:domain', async (ctx) => {
  try {
    const { domain } = ctx.params;
    const { format } = ctx.query;
    
    const site = await Site.findOne({ domain });
    if (!site) {
      ctx.body = {
        success: false,
        message: '网站未找到',
        data: {
          pv: 0,
          uv: 0,
          todayPv: 0,
          todayUv: 0
        }
      };
      return;
    }

    const data = {
      pv: site.pv,
      uv: site.uv,
      todayPv: site.todayPv,
      todayUv: site.todayUv,
      title: site.title,
      lastUpdate: site.lastUpdate
    };

    // 格式化数字显示
    if (format === 'card' || format === 'badge') {
      data.pvFormatted = formatNumber(site.pv);
      data.uvFormatted = formatNumber(site.uv);
      data.todayPvFormatted = formatNumber(site.todayPv);
      data.todayUvFormatted = formatNumber(site.todayUv);
    }

    ctx.body = {
      success: true,
      message: '获取统计数据成功',
      data
    };

  } catch (error) {
    console.error('获取统计数据失败:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '获取统计数据失败' };
  }
});

/**
 * 生成统计脚本
 * GET /api/stats/script.js
 */
router.get('/script.js', async (ctx) => {
  const scriptContent = `
(function() {
  var flyteamStats = {
    // 配置
    config: {
      apiBase: '${ctx.protocol}://${ctx.host}/api/stats',
      updateInterval: 5000 // 5秒更新间隔
    },
    
    // 发送统计数据
    sendStats: function() {
      var url = window.location.href;
      var title = document.title;
      var referrer = document.referrer;
      
      fetch(this.config.apiBase + '/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          title: title,
          referrer: referrer
        }),
        credentials: 'include'
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        if (data.success) {
          flyteamStats.updateElements(data.data);
        }
      }).catch(function(error) {
        console.warn('飞天蒜子统计失败:', error);
      });
    },
    
    // 更新页面元素
    updateElements: function(data) {
      // 兼容不蒜子格式
      this.updateElement('busuanzi_value_site_pv', data.pv);
      this.updateElement('busuanzi_value_site_uv', data.uv);
      this.updateElement('busuanzi_value_page_pv', data.todayPv);
      
      // 飞天蒜子格式
      this.updateElement('flyteam_site_pv', data.pv);
      this.updateElement('flyteam_site_uv', data.uv);
      this.updateElement('flyteam_today_pv', data.todayPv);
      this.updateElement('flyteam_today_uv', data.todayUv);
    },
    
    // 更新单个元素
    updateElement: function(id, value) {
      var element = document.getElementById(id);
      if (element) {
        element.textContent = this.formatNumber(value);
      }
    },
    
    // 格式化数字显示
    formatNumber: function(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    },
    
    // 初始化
    init: function() {
      this.sendStats();
      
      // 监听页面可见性变化
      if (typeof document.hidden !== 'undefined') {
        document.addEventListener('visibilitychange', function() {
          if (!document.hidden) {
            flyteamStats.sendStats();
          }
        });
      }
    }
  };
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      flyteamStats.init();
    });
  } else {
    flyteamStats.init();
  }
})();
  `;

  ctx.type = 'application/javascript';
  ctx.body = scriptContent;
});

/**
 * 获取详细统计报告
 * GET /api/stats/:domain/report
 */
router.get('/:domain/report', async (ctx) => {
  try {
    const { domain } = ctx.params;
    const { days = 7 } = ctx.query;
    
    const site = await Site.findOne({ domain });
    if (!site) {
      ctx.status = 404;
      ctx.body = { success: false, message: '网站未找到' };
      return;
    }

    // 计算日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // 聚合访问数据
    const visitStats = await Visit.aggregate([
      {
        $match: {
          s: site._id,
          t: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$t' } },
            browser: '$b',
            os: '$o',
            geo: '$g'
          },
          pv: { $sum: 1 },
          uv: { $addToSet: '$i' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          pv: { $sum: '$pv' },
          uv: { $sum: { $size: '$uv' } },
          browsers: {
            $push: {
              name: '$_id.browser',
              count: '$pv'
            }
          },
          os: {
            $push: {
              name: '$_id.os',
              count: '$pv'
            }
          },
          regions: {
            $push: {
              name: '$_id.geo',
              count: '$pv'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    ctx.body = {
      success: true,
      message: '获取统计报告成功',
      data: {
        site: {
          domain: site.domain,
          title: site.title,
          totalPv: site.pv,
          totalUv: site.uv,
          todayPv: site.todayPv,
          todayUv: site.todayUv
        },
        dailyStats: visitStats
      }
    };

  } catch (error) {
    console.error('获取统计报告失败:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '获取统计报告失败' };
  }
});

/**
 * 获取不蒜子格式的统计数据
 * GET /api/stats/busuanzi/:domain
 */
router.get('/busuanzi/:domain', async (ctx) => {
  try {
    const { domain } = ctx.params;
    
    const site = await Site.findOne({ domain });
    if (!site) {
      ctx.body = {
        success: true,
        data: {
          site_pv: 1,
          site_uv: 1,
          page_pv: 1
        }
      };
      return;
    }

    ctx.body = {
      success: true,
      data: {
        site_pv: site.pv,
        site_uv: site.uv,
        page_pv: site.todayPv
      }
    };

  } catch (error) {
    console.error('获取不蒜子统计失败:', error);
    ctx.status = 500;
    ctx.body = { 
      success: false, 
      message: '获取统计数据失败'
    };
  }
});

/**
 * 获取全局统计数据
 * GET /api/stats/global
 */
router.get('/global', async (ctx) => {
  try {
    const totalSites = await Site.countDocuments();
    const totalViews = await Visit.countDocuments();
    const totalVisitors = await Visit.distinct('ip_hash').then(ips => ips.length);
    
    // 获取今日访问量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayViews = await Visit.countDocuments({
      timestamp: {
        $gte: today,
        $lt: tomorrow
      }
    });

    ctx.body = {
      success: true,
      data: {
        totalSites,
        totalViews,
        totalVisitors,
        todayViews
      }
    };
  } catch (error) {
    console.error('获取全局统计失败:', error);
    ctx.status = 500;
    ctx.body = { 
      success: false, 
      message: '获取统计数据失败',
      error: error.message 
    };
  }
});

// 辅助函数：格式化数字
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

module.exports = router;