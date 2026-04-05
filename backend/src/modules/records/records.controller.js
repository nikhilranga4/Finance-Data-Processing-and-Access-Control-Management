const recordsService = require('./records.service');
const ApiResponse = require('../../utils/ApiResponse');

class RecordsController {
  async createRecord(req, res, next) {
    try {
      const record = await recordsService.createRecord(req.body, req.user.userId);
      ApiResponse.created(res, { record }, 'Record created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const result = await recordsService.getRecords(
        req.query,
        req.user.userId,
        req.user.role
      );
      ApiResponse.paginated(res, result.records, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }, 'Records fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const record = await recordsService.getRecordById(req.params.id);
      ApiResponse.success(res, { record }, 'Record fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateRecord(req, res, next) {
    try {
      const record = await recordsService.updateRecord(
        req.params.id,
        req.body,
        req.user.userId,
        req.user.role
      );
      ApiResponse.success(res, { record }, 'Record updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async softDeleteRecord(req, res, next) {
    try {
      await recordsService.softDeleteRecord(
        req.params.id,
        req.user.userId,
        req.user.role
      );
      ApiResponse.success(res, null, 'Record deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordsController();
