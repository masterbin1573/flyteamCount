const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = new Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'flyteam_secret_key_2023';

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (ctx) => {
  try {
    const { username, email, password } = ctx.request.body;

    // 验证必填字段
    if (!username || !email || !password) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '用户名、邮箱和密码不能为空'
      };
      return;
    }

    // 验证密码长度
    if (password.length < 6) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '密码长度至少6位'
      };
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '邮箱格式不正确'
      };
      return;
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: existingUser.username === username ? '用户名已存在' : '邮箱已被注册'
      };
      return;
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    ctx.body = {
      success: true,
      message: '注册成功',
      data: {
        user: user.toJSON(),
        token
      }
    };

  } catch (error) {
    console.error('用户注册失败:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '注册失败，请稍后重试'
    };
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (ctx) => {
  try {
    const { username, password } = ctx.request.body;

    // 验证必填字段
    if (!username || !password) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '用户名和密码不能为空'
      };
      return;
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      active: true
    });

    if (!user) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '用户不存在或已被禁用'
      };
      return;
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '密码错误'
      };
      return;
    }

    // 更新最后登录时间
    user.lastLogin = new Date();
    await user.save();

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    ctx.body = {
      success: true,
      message: '登录成功',
      data: {
        user: user.toJSON(),
        token
      }
    };

  } catch (error) {
    console.error('用户登录失败:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '登录失败，请稍后重试'
    };
  }
});

/**
 * 获取用户信息
 * GET /api/auth/profile
 */
router.get('/profile', async (ctx) => {
  try {
    const token = ctx.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '未提供认证令牌'
      };
      return;
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.active) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '用户不存在或已被禁用'
      };
      return;
    }

    ctx.body = {
      success: true,
      message: '获取用户信息成功',
      data: {
        user: user.toJSON()
      }
    };

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '无效的认证令牌'
      };
    } else if (error.name === 'TokenExpiredError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '认证令牌已过期'
      };
    } else {
      console.error('获取用户信息失败:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '获取用户信息失败'
      };
    }
  }
});

/**
 * 更新用户信息
 * PUT /api/auth/profile
 */
router.put('/profile', async (ctx) => {
  try {
    const token = ctx.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '未提供认证令牌'
      };
      return;
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.active) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '用户不存在或已被禁用'
      };
      return;
    }

    const { username, email, avatar } = ctx.request.body;

    // 检查用户名和邮箱是否被其他用户使用
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '用户名已被使用'
        };
        return;
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '邮箱格式不正确'
        };
        return;
      }

      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: '邮箱已被使用'
        };
        return;
      }
      user.email = email;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    ctx.body = {
      success: true,
      message: '更新用户信息成功',
      data: {
        user: user.toJSON()
      }
    };

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '无效的认证令牌'
      };
    } else if (error.name === 'TokenExpiredError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '认证令牌已过期'
      };
    } else {
      console.error('更新用户信息失败:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '更新用户信息失败'
      };
    }
  }
});

/**
 * 修改密码
 * POST /api/auth/change-password
 */
router.post('/change-password', async (ctx) => {
  try {
    const token = ctx.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '未提供认证令牌'
      };
      return;
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.active) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '用户不存在或已被禁用'
      };
      return;
    }

    const { oldPassword, newPassword } = ctx.request.body;

    if (!oldPassword || !newPassword) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '原密码和新密码不能为空'
      };
      return;
    }

    if (newPassword.length < 6) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '新密码长度至少6位'
      };
      return;
    }

    // 验证原密码
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '原密码错误'
      };
      return;
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    ctx.body = {
      success: true,
      message: '密码修改成功'
    };

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '无效的认证令牌'
      };
    } else if (error.name === 'TokenExpiredError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '认证令牌已过期'
      };
    } else {
      console.error('修改密码失败:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: '修改密码失败'
      };
    }
  }
});

module.exports = router;