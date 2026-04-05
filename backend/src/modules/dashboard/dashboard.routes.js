const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics endpoints
 */

/**
 * @swagger
 * /api/v1/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (income, expenses, net balance)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 */
router.get('/summary', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), dashboardController.getSummary);

/**
 * @swagger
 * /api/v1/dashboard/category-totals:
 *   get:
 *     summary: Get totals grouped by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category totals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryTotal'
 */
router.get('/category-totals', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), dashboardController.getCategoryTotals);

/**
 * @swagger
 * /api/v1/dashboard/recent-activity:
 *   get:
 *     summary: Get recent financial activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent activity
 */
router.get('/recent-activity', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), dashboardController.getRecentActivity);

/**
 * @swagger
 * /api/v1/dashboard/monthly-trend:
 *   get:
 *     summary: Get monthly income vs expenses trend
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Monthly trend data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MonthlyTrend'
 */
router.get('/monthly-trend', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), dashboardController.getMonthlyTrend);

/**
 * @swagger
 * /api/v1/dashboard/weekly-trend:
 *   get:
 *     summary: Get weekly income vs expenses trend
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: weeks
 *         schema:
 *           type: integer
 *           default: 8
 *     responses:
 *       200:
 *         description: Weekly trend data
 */
router.get('/weekly-trend', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), dashboardController.getWeeklyTrend);

module.exports = router;
