import { Transaction } from '../entities/Transaction.js';

export interface TransactionFindOptions {
  search?: string;
  sortBy?: 'name' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CategoryComparisonResult {
  categoryId: number;
  categoryName: string;
  totalQuantitySold: number;
  transactionCount: number;
}

export interface ITransactionRepository {
  findAndCount(options: TransactionFindOptions): Promise<[Transaction[], number]>;
  findById(id: number): Promise<Transaction | null>;
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null>;
  delete(id: number): Promise<boolean>;
  getCategoryComparison(
    type?: 'highest' | 'lowest',
    startDate?: string,
    endDate?: string
  ): Promise<CategoryComparisonResult[]>;
}
