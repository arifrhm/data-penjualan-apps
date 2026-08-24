import express from 'express';
import cors from 'cors';
import { categoryRoutes } from './modules/catalog/infrastructure/controllers/category.routes.js';
import { productRoutes } from './modules/catalog/infrastructure/controllers/product.routes.js';
import { transactionRoutes } from './modules/sales/infrastructure/controllers/transaction.routes.js';
import { comparisonRoutes } from './modules/sales/infrastructure/controllers/comparison.routes.js';
import { errorHandler } from './core/middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Healthcheck
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/sales', comparisonRoutes);

  // Global error handler
  app.use(errorHandler);

  return app;
}
