const useragent = require('useragent');
const geoip = require('geoip-lite');

/**
 * 解析用户代理字符串
 * @param {string} userAgentString - 用户代理字符串
 * @returns {Object} 解析结果
 */
function parseUserAgent(userAgentString) {
  if (!userAgentString) {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      device: 0 // 0: 桌面, 1: 移动, 2: 平板
    };
  }

  const agent = useragent.parse(userAgentString);
  
  // 浏览器名称简化
  const browserMap = {
    'Chrome': 'Chrome',
    'Firefox': 'Firefox',
    'Safari': 'Safari',
    'Edge': 'Edge',
    'IE': 'IE',
    'Opera': 'Opera'
  };
  
  // 操作系统简化
  const osMap = {
    'Windows': 'Windows',
    'Mac OS': 'macOS',
    'Linux': 'Linux',
    'iOS': 'iOS',
    'Android': 'Android'
  };

  // 设备类型判断
  let deviceType = 0; // 默认桌面
  const uaLower = userAgentString.toLowerCase();
  if (uaLower.includes('mobile') || uaLower.includes('phone')) {
    deviceType = 1; // 移动设备
  } else if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
    deviceType = 2; // 平板
  }

  const browserName = agent.family || 'Unknown';
  const osName = agent.os.family || 'Unknown';

  return {
    browser: browserMap[browserName] || browserName.slice(0, 15),
    os: osMap[osName] || osName.slice(0, 15),
    device: deviceType
  };
}

/**
 * 解析IP地理位置
 * @param {string} ip - IP地址
 * @returns {string} 地理位置代码
 */
function parseGeoLocation(ip) {
  if (!ip || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'local';
  }

  const geo = geoip.lookup(ip);
  if (!geo) return 'unknown';

  // 中国地区返回省份简称
  if (geo.country === 'CN') {
    const regionMap = {
      '11': 'BJ', // 北京
      '12': 'TJ', // 天津
      '13': 'HE', // 河北
      '14': 'SX', // 山西
      '15': 'NM', // 内蒙古
      '21': 'LN', // 辽宁
      '22': 'JL', // 吉林
      '23': 'HL', // 黑龙江
      '31': 'SH', // 上海
      '32': 'JS', // 江苏
      '33': 'ZJ', // 浙江
      '34': 'AH', // 安徽
      '35': 'FJ', // 福建
      '36': 'JX', // 江西
      '37': 'SD', // 山东
      '41': 'HA', // 河南
      '42': 'HB', // 湖北
      '43': 'HN', // 湖南
      '44': 'GD', // 广东
      '45': 'GX', // 广西
      '46': 'HI', // 海南
      '50': 'CQ', // 重庆
      '51': 'SC', // 四川
      '52': 'GZ', // 贵州
      '53': 'YN', // 云南
      '54': 'XZ', // 西藏
      '61': 'SN', // 陕西
      '62': 'GS', // 甘肃
      '63': 'QH', // 青海
      '64': 'NX', // 宁夏
      '65': 'XJ'  // 新疆
    };
    return regionMap[geo.region] || 'CN';
  }

  // 其他国家返回国家代码
  return geo.country || 'unknown';
}

/**
 * 提取域名
 * @param {string} url - 完整URL
 * @returns {string} 域名
 */
function extractDomain(url) {
  if (!url) return '';
  
  try {
    // 如果没有协议，添加默认协议
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase();
  } catch (error) {
    // 如果URL解析失败，返回原始输入（可能是纯域名）
    return url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

/**
 * 提取路径
 * @param {string} url - 完整URL
 * @returns {string} 路径
 */
function extractPath(url) {
  if (!url) return '/';
  
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return '/';
    }
    
    const urlObj = new URL(url);
    return urlObj.pathname || '/';
  } catch (error) {
    return '/';
  }
}

module.exports = {
  parseUserAgent,
  parseGeoLocation,
  extractDomain,
  extractPath
};