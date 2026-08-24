import { ProductCategory } from '../entities/ProductCategory.js';

export interface ICategoryRepository {
  findAll(): Promise<ProductCategory[]>;
  findById(id: number): Promise<ProductCategory | null>;
  findByName(name: string): Promise<ProductCategory | null>;
  create(category: Partial<ProductCategory>): Promise<ProductCategory>;
  update(id: number, category: Partial<ProductCategory>): Promise<ProductCategory | null>;
  delete(id: number): Promise<boolean>;
}
