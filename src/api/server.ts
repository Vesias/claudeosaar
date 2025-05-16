/**
 * ClaudeOSaar API Server
 * Express server for the ClaudeOSaar API
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { Logger } from '../core/utils/logger';
import { initializePluginSystem } from '../plugins';

// Routes
import onboardingRoutes from './routes/onboarding';
import pluginsRoutes from './routes/plugins';
import metricsRoutes from './routes/metrics';
import workspacesRoutes from './routes/workspaces';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';

// Get command line arguments
const args = process.argv.slice(2);
const portArgIndex = args.indexOf('--port');
const portArg = portArgIndex !== -1 ? parseInt(args[portArgIndex + 1], 10) : null;

// Initialize express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (portArg || 5455);
const logger = new Logger('APIServer');

logger.info(`Starting API server with port ${PORT}`);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Basic request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/plugins', pluginsRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/workspaces', workspacesRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize plugin system with explicit path
    try {
      const pluginsDir = path.join(process.cwd(), 'plugins');
      logger.info(`Initializing plugin system with directory: ${pluginsDir}`);
      
      // Initialize plugin system with explicit directory path
      await initializePluginSystem(pluginsDir);
      logger.info('Plugin system initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize plugin system, continuing without plugins', error);
    }
    
    const server = app.listen(PORT, () => {
      logger.info(`ClaudeOSaar API Server running on port ${PORT}`);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();