const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const config = require('../../config/env');
const AppError = require('../../utils/AppError');

const excludePassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

class AuthService {
  async register(data) {
    const hashedPassword = await bcrypt.hash(data.password, config.bcryptRounds);
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'VIEWER',
        status: 'ACTIVE'
      }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      user: excludePassword(user),
      token
    };
  }

  async login(email, password) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null
      }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status === 'INACTIVE') {
      throw new AppError('Account is inactive', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      user: excludePassword(user),
      token
    };
  }

  async getMe(userId) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return excludePassword(user);
  }
}

module.exports = new AuthService();
