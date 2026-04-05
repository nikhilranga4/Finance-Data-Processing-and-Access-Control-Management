/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * RBAC Matrix:
 * | Action              | VIEWER | ANALYST | ADMIN |
 * |---------------------|--------|---------|-------|
 * | View records        |   ✅   |   ✅    |  ✅   |
 * | Create records      |   ❌   |   ✅    |  ✅   |
 * | Update own records  |   ❌   |   ✅    |  ✅   |
 * | Update any record   |   ❌   |   ❌    |  ✅   |
 * | Delete own records  |   ❌   |   ✅    |  ✅   |
 * | Delete any record   |   ❌   |   ❌    |  ✅   |
 * | View dashboard      |   ✅   |   ✅    |  ✅   |
 * | Manage users        |   ❌   |   ❌    |  ✅   |
 * 
 * Note: ANALYST ownership enforcement (updating/deleting only their own records)
 * is intentionally handled inside the records.service.js where the data is accessed,
 * keeping the middleware simple and the business rule close to the data layer.
 */

const AppError = require('../utils/AppError');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};
