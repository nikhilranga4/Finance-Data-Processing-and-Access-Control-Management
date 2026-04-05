const prisma = require('../../config/database');

class DashboardService {
  get baseWhere() {
    return { deletedAt: null };
  }

  async getSummary() {
    const incomeAgg = await prisma.financialRecord.aggregate({
      where: { ...this.baseWhere, type: 'INCOME' },
      _sum: { amount: true }
    });

    const expenseAgg = await prisma.financialRecord.aggregate({
      where: { ...this.baseWhere, type: 'EXPENSE' },
      _sum: { amount: true }
    });

    const count = await prisma.financialRecord.count({
      where: this.baseWhere
    });

    const latest = await prisma.financialRecord.findFirst({
      where: this.baseWhere,
      orderBy: { updatedAt: 'desc' }
    });

    const totalIncome = Number(incomeAgg._sum.amount || 0);
    const totalExpenses = Number(expenseAgg._sum.amount || 0);
    const netBalance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      totalRecords: count,
      lastUpdated: latest?.updatedAt || null
    };
  }

  async getCategoryTotals() {
    const results = await prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      where: this.baseWhere,
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } }
    });

    return results.map(item => ({
      category: item.category,
      type: item.type,
      total: Number(item._sum.amount || 0),
      count: item._count.id
    }));
  }

  async getRecentActivity(limit = 10) {
    return prisma.financialRecord.findMany({
      where: this.baseWhere,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: Number(limit)
    });
  }

  async getMonthlyTrend(months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);

    const records = await prisma.financialRecord.findMany({
      where: {
        ...this.baseWhere,
        date: {
          gte: startDate
        }
      },
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    // Group by month
    const grouped = {};
    
    // Initialize all months with 0
    for (let i = 0; i < months; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toISOString().slice(0, 7);
      grouped[monthKey] = { month: monthKey, income: 0, expenses: 0, net: 0 };
    }

    // Aggregate data
    for (const record of records) {
      const monthKey = record.date.toISOString().slice(0, 7);
      if (grouped[monthKey]) {
        const amount = Number(record.amount);
        if (record.type === 'INCOME') {
          grouped[monthKey].income += amount;
        } else {
          grouped[monthKey].expenses += amount;
        }
      }
    }

    // Calculate net and sort
    return Object.values(grouped)
      .map(item => ({
        ...item,
        income: Math.round(item.income * 100) / 100,
        expenses: Math.round(item.expenses * 100) / 100,
        net: Math.round((item.income - item.expenses) * 100) / 100
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  async getWeeklyTrend(weeks = 8) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    const records = await prisma.financialRecord.findMany({
      where: {
        ...this.baseWhere,
        date: {
          gte: startDate
        }
      },
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    // Helper to get ISO week
    const getISOWeek = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return `${d.getUTCFullYear()}-W${String(Math.ceil((((d - yearStart) / 86400000) + 1) / 7)).padStart(2, '0')}`;
    };

    // Group by week
    const grouped = {};
    
    // Initialize all weeks with 0
    for (let i = 0; i < weeks; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (i * 7));
      const weekKey = getISOWeek(d);
      grouped[weekKey] = { week: weekKey, income: 0, expenses: 0 };
    }

    // Aggregate data
    for (const record of records) {
      const weekKey = getISOWeek(record.date);
      if (grouped[weekKey]) {
        const amount = Number(record.amount);
        if (record.type === 'INCOME') {
          grouped[weekKey].income += amount;
        } else {
          grouped[weekKey].expenses += amount;
        }
      }
    }

    // Sort and format
    return Object.values(grouped)
      .map(item => ({
        ...item,
        income: Math.round(item.income * 100) / 100,
        expenses: Math.round(item.expenses * 100) / 100
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }
}

module.exports = new DashboardService();
