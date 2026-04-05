const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'Finance Data Processing and Access Control REST API'
    },
    servers: [
      {
        url: config.baseUrl,
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clvx123...' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ANALYST' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clvx456...' },
            amount: { type: 'number', example: 5000.00 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
            category: { type: 'string', example: 'Salary' },
            date: { type: 'string', format: 'date' },
            notes: { type: 'string', example: 'Monthly salary payment' },
            createdBy: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Admin User' },
                email: { type: 'string', example: 'admin@finance.com' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            totalIncome: { type: 'number', example: 15000.00 },
            totalExpenses: { type: 'number', example: 8500.00 },
            netBalance: { type: 'number', example: 6500.00 },
            totalRecords: { type: 'integer', example: 42 },
            lastUpdated: { type: 'string', format: 'date-time' }
          }
        },
        CategoryTotal: {
          type: 'object',
          properties: {
            category: { type: 'string', example: 'Salary' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            total: { type: 'number', example: 5000.00 },
            count: { type: 'integer', example: 5 }
          }
        },
        MonthlyTrend: {
          type: 'object',
          properties: {
            month: { type: 'string', example: '2024-01' },
            income: { type: 'number', example: 8000.00 },
            expenses: { type: 'number', example: 3000.00 },
            net: { type: 'number', example: 5000.00 }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 50 },
            totalPages: { type: 'integer', example: 5 }
          }
        }
      }
    }
  },
  apis: ['./src/modules/**/*.routes.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
