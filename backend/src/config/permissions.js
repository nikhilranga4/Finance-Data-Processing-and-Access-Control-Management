/**
 * Permissions Configuration
 * 
 * Full RBAC Matrix:
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
 */

const PERMISSIONS = {
  records: {
    read: ['VIEWER', 'ANALYST', 'ADMIN'],
    create: ['ANALYST', 'ADMIN'],
    updateOwn: ['ANALYST'],
    updateAny: ['ADMIN'],
    deleteOwn: ['ANALYST'],
    deleteAny: ['ADMIN']
  },
  users: {
    read: ['ADMIN'],
    create: ['ADMIN'],
    update: ['ADMIN'],
    delete: ['ADMIN']
  },
  dashboard: {
    view: ['VIEWER', 'ANALYST', 'ADMIN']
  }
};

module.exports = PERMISSIONS;
