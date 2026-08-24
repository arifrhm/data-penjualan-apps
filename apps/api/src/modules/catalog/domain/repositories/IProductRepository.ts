import { Product } from '../entities/Product.js';

export interface IProductRepository {
  findAll(search?: string): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(product: Partial<Product>): Promise<Product>;
  update(id: number, product: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
  updateStock(id: number, stockDelta: number): Promise<Product | null>;
}
