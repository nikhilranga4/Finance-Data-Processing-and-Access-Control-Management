const express = require('express');
const router = express.Router();
const recordsController = require('./records.controller');
const { createRecordSchema, updateRecordSchema } = require('./records.validation');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records management
 */

/**
 * @swagger
 * /api/v1/records:
 *   get:
 *     summary: Get all financial records
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of records
 */
router.get('/', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), recordsController.getRecords);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   get:
 *     summary: Get record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record data
 *       404:
 *         description: Record not found
 */
router.get('/:id', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), recordsController.getRecordById);

/**
 * @swagger
 * /api/v1/records:
 *   post:
 *     summary: Create new financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000.00
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created
 *       403:
 *         description: VIEWER cannot create records
 */
router.post('/', authenticate, authorize('ADMIN', 'ANALYST'), validate(createRecordSchema), recordsController.createRecord);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   patch:
 *     summary: Update financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       403:
 *         description: Cannot update others records as ANALYST
 */
router.patch('/:id', authenticate, authorize('ADMIN', 'ANALYST'), validate(updateRecordSchema), recordsController.updateRecord);

/**
 * @swagger
 * /api/v1/records/{id}:
 *   delete:
 *     summary: Soft delete financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 *       403:
 *         description: Cannot delete others records as ANALYST
 */
router.delete('/:id', authenticate, authorize('ADMIN', 'ANALYST'), recordsController.softDeleteRecord);

module.exports = router;
