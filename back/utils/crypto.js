const crypto = require('crypto');

/**
 * 生成哈希值
 * @param {string} data - 要哈希的数据
 * @param {string} algorithm - 哈希算法，默认md5
 * @returns {string} 哈希值
 */
function generateHash(data, algorithm = 'md5') {
  return crypto.createHash(algorithm).update(data).digest('hex');
}

/**
 * 生成IP哈希值（用于隐私保护）
 * @param {string} ip - IP地址
 * @returns {string} IP哈希值
 */
function hashIP(ip) {
  // 添加盐值增加安全性
  const salt = 'flyteam_salt_2023';
  return generateHash(ip + salt, 'sha256').substring(0, 16);
}

/**
 * 生成用户代理哈希值
 * @param {string} userAgent - 用户代理字符串
 * @returns {string} UA哈希值
 */
function hashUserAgent(userAgent) {
  if (!userAgent) return '';
  return generateHash(userAgent, 'md5').substring(0, 12);
}

/**
 * 生成会话ID
 * @returns {string} 会话ID
 */
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * 获取客户端真实IP
 * @param {Object} ctx - Koa上下文
 * @returns {string} IP地址
 */
function getClientIP(ctx) {
  return ctx.request.ip || 
         ctx.get('X-Forwarded-For') || 
         ctx.get('X-Real-IP') || 
         ctx.req.connection.remoteAddress || 
         '127.0.0.1';
}

module.exports = {
  generateHash,
  hashIP,
  hashUserAgent,
  generateSessionId,
  getClientIP
};