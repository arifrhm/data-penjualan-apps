import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or apps/api
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'arifrahman',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'data_penjualan_db',
  },
};
