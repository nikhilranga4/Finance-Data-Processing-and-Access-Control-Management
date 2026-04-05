const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      ApiResponse.created(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.userId);
      ApiResponse.success(res, { user }, 'User fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
