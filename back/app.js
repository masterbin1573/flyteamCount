const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const logger = require('koa-logger');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// 导入路由
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');
const likeRoutes = require('./routes/like');

const app = new Koa();
const router = new Router();

// 中间件
app.use(logger());
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));
app.use(bodyParser());
app.use(json());

// 静态文件服务
app.use(serve(path.join(__dirname, 'public')));

// 数据库连接
mongoose.connect('mongodb+srv://masterbin1573:1573406407mongodb!%40%23@mrbin.cayvcdt.mongodb.net/flyteam_count', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB 连接成功');
}).catch(err => {
  console.error('❌ MongoDB 连接失败:', err);
});

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || '服务器内部错误',
      data: null
    };
    console.error('服务器错误:', err);
  }
});

// 响应时间中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// 根路径处理（index文件夹现在是独立部署的静态站点）

// 挂载路由
router.use('/api/stats', statsRoutes.routes());
router.use('/api/auth', authRoutes.routes());
router.use('/api/like', likeRoutes.routes());

// 静态文件已通过 koa-static 中间件处理
// /stats/flyteam-stats.min.js 会自动路由到 public/stats/flyteam-stats.min.js
// /like/flyteam-like.min.js 会自动路由到 public/like/flyteam-like.min.js
// 注意：只兼容标签用法，JS路径需要使用本项目的路径

app.use(router.routes());
app.use(router.allowedMethods());

// 健康检查
router.get('/health', async (ctx) => {
  ctx.body = {
    success: true,
    message: '服务运行正常',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  };
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 飞天蒜子统计服务器启动成功，端口: ${PORT}`);
  console.log(`📊 API 地址: http://localhost:${PORT}/api`);
  console.log(`🌐 健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;