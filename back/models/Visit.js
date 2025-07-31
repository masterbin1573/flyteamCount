const mongoose = require('mongoose');

// 访问记录模型 - 详细访问日志（使用简短字段名节省空间）
const visitSchema = new mongoose.Schema({
  // 关联网站ID (简称 s = site)
  s: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true,
    index: true
  },
  // 页面路径 (简称 p = path)
  p: {
    type: String,
    required: true,
    maxlength: 500
  },
  // IP地址哈希 (简称 i = ip，存储哈希值节省空间)
  i: {
    type: String,
    required: true,
    maxlength: 64,
    index: true
  },
  // 用户代理哈希 (简称 u = userAgent)
  u: {
    type: String,
    maxlength: 64
  },
  // 引用页面 (简称 r = referrer)
  r: {
    type: String,
    maxlength: 200,
    default: ''
  },
  // 地理位置 (简称 g = geo) - 省份/国家代码
  g: {
    type: String,
    maxlength: 10,
    default: ''
  },
  // 浏览器 (简称 b = browser)
  b: {
    type: String,
    maxlength: 20,
    default: ''
  },
  // 操作系统 (简称 o = os)
  o: {
    type: String,
    maxlength: 20,
    default: ''
  },
  // 设备类型 (简称 d = device) - 0:桌面 1:移动 2:平板
  d: {
    type: Number,
    default: 0
  },
  // 访问时间 (简称 t = time)
  t: {
    type: Date,
    default: Date.now,
    index: true
  },
  // 会话ID (简称 sess = session)
  sess: {
    type: String,
    maxlength: 32,
    index: true
  },
  // 是否新访客 (简称 n = new)
  n: {
    type: Boolean,
    default: false
  }
}, {
  // 关闭自动时间戳，使用自定义字段
  timestamps: false,
  // 优化：移除版本键
  versionKey: false
});

// 复合索引优化查询性能
visitSchema.index({ s: 1, t: -1 });
visitSchema.index({ s: 1, i: 1, t: -1 });
visitSchema.index({ t: 1 }, { expireAfterSeconds: 2592000 }); // 30天后自动删除

module.exports = mongoose.model('Visit', visitSchema);