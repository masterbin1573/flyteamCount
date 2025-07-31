const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 用户模型
const userSchema = new mongoose.Schema({
  // 用户名
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    trim: true
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