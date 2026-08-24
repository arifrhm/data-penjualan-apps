import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config/index.js';
import { ProductCategory } from '../../modules/catalog/domain/entities/ProductCategory.js';
import { Product } from '../../modules/catalog/domain/entities/Product.js';
import { Transaction } from '../../modules/sales/domain/entities/Transaction.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: true, // auto-create schema for dev
  logging: config.nodeEnv === 'development',
  entities: [ProductCategory, Product, Transaction],
  subscribers: [],
  migrations: [],
});
