import { ProductDto } from './product.js';

export interface TransactionDto {
  id: number;
  productId: number;
  product?: ProductDto;
  quantitySold: number;
  transactionDate: string;
  stockAtTransaction: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionPayload {
  productId: number;
  quantitySold: number;
  transactionDate: string;
}

export interface UpdateTransactionPayload {
  productId?: number;
  quantitySold?: number;
  transactionDate?: string;
}

export interface TransactionQueryParams {
  search?: string;
  sortBy?: 'name' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CategorySalesComparison {
  categoryId: number;
  categoryName: string;
  totalQuantitySold: number;
  transactionCount: number;
}

export interface ComparisonQueryParams {
  type?: 'highest' | 'lowest';
  startDate?: string;
  endDate?: string;
}
