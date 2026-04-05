const usersService = require('./users.service');
const ApiResponse = require('../../utils/ApiResponse');

class UsersController {
  async getAllUsers(req, res, next) {
    try {
      const result = await usersService.getAllUsers(req.query);
      ApiResponse.paginated(res, result.users, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }, 'Users fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.id);
      ApiResponse.success(res, { user }, 'User fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await usersService.createUser(req.body);
      ApiResponse.created(res, { user }, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await usersService.updateUser(req.params.id, req.body);
      ApiResponse.success(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async softDeleteUser(req, res, next) {
    try {
      await usersService.softDeleteUser(req.params.id);
      ApiResponse.success(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
