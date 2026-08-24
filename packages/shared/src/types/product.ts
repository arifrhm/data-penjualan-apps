import { ProductCategoryDto } from './category.js';

export interface ProductDto {
  id: number;
  name: string;
  stock: number;
  categoryId: number;
  category?: ProductCategoryDto;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  stock: number;
  categoryId: number;
}

export interface UpdateProductPayload {
  name?: string;
  stock?: number;
  categoryId?: number;
}
