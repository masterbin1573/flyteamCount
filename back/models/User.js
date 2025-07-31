const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 用户模型
const userSchema = new mongoose.Schema({
  // 用户名
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
    validate: {
      validator: function(v) {
        // 支持中文、字母、数字和下划线
        return /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(v);
      },
      message: '用户名可以包含中文、字母、数字和下划线'
    }
  },
  // 邮箱
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // 密码哈希
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // 头像
  avatar: {
    type: String,
    default: ''
  },
  // 用户角色
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // 是否激活
  active: {
    type: Boolean,
    default: true
  },
  // 网站域名
  domain: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // 简单的域名验证正则
        return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v);
      },
      message: '请输入有效的域名格式'
    }
  },
  // 最后登录时间
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 密码验证方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 转换为JSON时移除敏感信息
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);