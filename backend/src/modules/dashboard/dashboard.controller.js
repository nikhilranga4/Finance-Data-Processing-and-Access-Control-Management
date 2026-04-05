const dashboardService = require('./dashboard.service');
const ApiResponse = require('../../utils/ApiResponse');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      ApiResponse.success(res, summary, 'Dashboard summary fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCategoryTotals(req, res, next) {
    try {
      const totals = await dashboardService.getCategoryTotals();
      ApiResponse.success(res, totals, 'Category totals fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      const activity = await dashboardService.getRecentActivity(limit);
      ApiResponse.success(res, activity, 'Recent activity fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyTrend(req, res, next) {
    try {
      const months = req.query.months || 6;
      const trend = await dashboardService.getMonthlyTrend(months);
      ApiResponse.success(res, trend, 'Monthly trend fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyTrend(req, res, next) {
    try {
      const weeks = req.query.weeks || 8;
      const trend = await dashboardService.getWeeklyTrend(weeks);
      ApiResponse.success(res, trend, 'Weekly trend fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
