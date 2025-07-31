const mongoose = require('mongoose');

// 点赞模型 - 存储点赞记录
const likeSchema = new mongoose.Schema({
  // 网站域名
  domain: {
    type: String,
    required: true,
    index: true,
    maxlength: 100
  },
  // 页面路径
  path: {
    type: String,
    required: true,
    maxlength: 500,
    default: '/'
  },
  // IP地址哈希（用于防重复点赞）
  ipHash: {
    type: String,
    required: true,
    maxlength: 64,
    index: true
  },
  // 用户代理哈希（额外验证）
  uaHash: {
    type: String,
    maxlength: 64
  },
  // 点赞时间
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  // 是否有效（可用于软删除取消点赞）
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: false,
  versionKey: false
});

// 复合索引确保唯一性和查询性能
likeSchema.index({ domain: 1, path: 1, ipHash: 1 }, { unique: true });
likeSchema.index({ domain: 1, path: 1, active: 1 });
likeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90天后自动删除

module.exports = mongoose.model('Like', likeSchema);