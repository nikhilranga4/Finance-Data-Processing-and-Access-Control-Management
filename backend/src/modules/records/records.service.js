const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const parsePagination = require('../../utils/pagination');

class RecordsService {
  async createRecord(data, userId) {
    const record = await prisma.financialRecord.create({
      data: {
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: new Date(data.date),
        notes: data.notes,
        createdById: userId
      }
    });
    return record;
  }

  async getRecords(filters, userId, role) {
    const { page, limit, skip, take } = parsePagination(filters);
    
    const where = {
      deletedAt: null
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = {
        contains: filters.category,
        mode: 'insensitive'
      };
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    if (filters.search) {
      where.OR = [
        {
          notes: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          category: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.financialRecord.count({ where })
    ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getRecordById(id) {
    const record = await prisma.financialRecord.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    return record;
  }

  async updateRecord(id, data, userId, role) {
    // Check permissions
    if (role === 'VIEWER') {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    const existingRecord = await prisma.financialRecord.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingRecord) {
      throw new AppError('Record not found', 404);
    }

    // Analysts can only update their own records
    if (role === 'ANALYST' && existingRecord.createdById !== userId) {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    const updateData = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;

    const record = await prisma.financialRecord.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return record;
  }

  async softDeleteRecord(id, userId, role) {
    // Check permissions
    if (role === 'VIEWER') {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    const existingRecord = await prisma.financialRecord.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingRecord) {
      throw new AppError('Record not found', 404);
    }

    // Analysts can only delete their own records
    if (role === 'ANALYST' && existingRecord.createdById !== userId) {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    await prisma.financialRecord.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}

module.exports = new RecordsService();
