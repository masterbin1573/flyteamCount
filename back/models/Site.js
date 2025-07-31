const mongoose = require('mongoose');

// 网站统计模型 - 主表，存储基础信息
const siteSchema = new mongoose.Schema({
  // 网站域名或URL标识
  domain: {
    type: String,
    required: true,
    index: true,
    maxlength: 100
  },
  // 网站标题
  title: {
    type: String,
    maxlength: 200,
    default: ''
  },
  // 所有者ID
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // 总PV (页面浏览量)
  pv: {
    type: Number,
    default: 0,
    index: true
  },
  // 总UV (独立访客数)
  uv: {
    type: Number,
    default: 0,
    index: true
  },
  // 今日PV
  todayPv: {
    type: Number,
    default: 0
  },
  // 今日UV
  todayUv: {
    type: Number,
    default: 0
  },
  // 最后更新时间
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  // 是否激活
  active: {
    type: Boolean,
    default: true
  }
}, {
  // 自动添加 createdAt 和 updatedAt
  timestamps: true,
  // 优化：移除版本键
  versionKey: false
});

// 复合索引优化查询
siteSchema.index({ domain: 1, active: 1 });
siteSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Site', siteSchema);