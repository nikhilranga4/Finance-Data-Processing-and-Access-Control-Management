const bcrypt = require('bcryptjs');
const prisma = require('../../config/database');
const config = require('../../config/env');
const AppError = require('../../utils/AppError');
const parsePagination = require('../../utils/pagination');

const excludePassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

class UsersService {
  async getAllUsers(query) {
    const { page, limit, skip, take } = parsePagination(query);
    
    const where = {
      deletedAt: null
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.role) {
      where.role = query.role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users: users.map(excludePassword),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserById(id) {
    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return excludePassword(user);
  }

  async createUser(data) {
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

    return excludePassword(user);
  }

  async updateUser(id, data) {
    const existingUser = await prisma.user.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const user = await prisma.user.update({
      where: { id },
      data
    });

    return excludePassword(user);
  }

  async softDeleteUser(id) {
    const existingUser = await prisma.user.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return excludePassword(user);
  }
}

module.exports = new UsersService();
