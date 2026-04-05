require('./config/env'); // Validates env vars on startup

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

// CORS configuration - must be before other middleware
const config = require('./config/env');

// Enable CORS for all routes with preflight handling
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Disable CORP for CORS
  crossOriginEmbedderPolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(generalLimiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'finance-dashboard-api'
  });
});

// API routes
app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/users', require('./modules/users/users.routes'));
app.use('/api/v1/records', require('./modules/records/records.routes'));
app.use('/api/v1/dashboard', require('./modules/dashboard/dashboard.routes'));

// 404 handler
app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   Finance Dashboard API                        ║
║   Server running on port ${config.port}                  ║
║                                                ║
║   API:      http://localhost:${config.port}/api/v1          ║
║   Swagger:  http://localhost:${config.port}/api-docs      ║
║   Health:   http://localhost:${config.port}/health        ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
