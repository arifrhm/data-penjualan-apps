import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionService } from './TransactionService.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { IProductRepository } from '../../../catalog/domain/repositories/IProductRepository.js';
import { BadRequestError, NotFoundError } from '../../../../core/errors/index.js';

describe('TransactionService (DDD Application Layer)', () => {
  let transactionService: TransactionService;
  let mockTxRepo: Partial<ITransactionRepository>;
  let mockProductRepo: Partial<IProductRepository>;

  beforeEach(() => {
    mockTxRepo = {
      findAndCount: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockProductRepo = {
      findById: vi.fn(),
      updateStock: vi.fn(),
    };

    transactionService = new TransactionService(
      mockTxRepo as ITransactionRepository,
      mockProductRepo as IProductRepository
    );
  });

  it('should successfully create transaction and reduce product stock', async () => {
    const mockProduct = { id: 1, name: 'Kopi', stock: 100, categoryId: 1, createdAt: new Date(), updatedAt: new Date(), transactions: [] };
    mockProductRepo.findById = vi.fn().mockResolvedValue(mockProduct);
    mockTxRepo.create = vi.fn().mockResolvedValue({
      id: 10,
      productId: 1,
      quantitySold: 10,
      transactionDate: '2021-05-01',
      stockAtTransaction: 100,
    });
    mockProductRepo.updateStock = vi.fn().mockResolvedValue(null);

    const result = await transactionService.create({
      productId: 1,
      quantitySold: 10,
      transactionDate: '2021-05-01',
    });

    expect(mockProductRepo.findById).toHaveBeenCalledWith(1);
    expect(mockTxRepo.create).toHaveBeenCalledWith({
      productId: 1,
      quantitySold: 10,
      transactionDate: '2021-05-01',
      stockAtTransaction: 100,
    });
    expect(mockProductRepo.updateStock).toHaveBeenCalledWith(1, -10);
    expect(result.id).toBe(10);
  });

  it('should throw BadRequestError if product stock is insufficient', async () => {
    const mockProduct = { id: 1, name: 'Kopi', stock: 5, categoryId: 1, createdAt: new Date(), updatedAt: new Date(), transactions: [] };
    mockProductRepo.findById = vi.fn().mockResolvedValue(mockProduct);

    await expect(
      transactionService.create({
        productId: 1,
        quantitySold: 10,
        transactionDate: '2021-05-01',
      })
    ).rejects.toThrow(BadRequestError);

    expect(mockTxRepo.create).not.toHaveBeenCalled();
    expect(mockProductRepo.updateStock).not.toHaveBeenCalled();
  });

  it('should revert product stock when transaction is deleted', async () => {
    const mockTx = {
      id: 5,
      productId: 2,
      quantitySold: 15,
      transactionDate: '2021-05-10',
      stockAtTransaction: 90,
      createdAt: new Date(),
      updatedAt: new Date(),
      product: { id: 2, name: 'Teh', stock: 75, categoryId: 1, createdAt: new Date(), updatedAt: new Date(), transactions: [] },
    };

    mockTxRepo.findById = vi.fn().mockResolvedValue(mockTx);
    mockTxRepo.delete = vi.fn().mockResolvedValue(true);
    mockProductRepo.updateStock = vi.fn().mockResolvedValue(null);

    const result = await transactionService.delete(5);

    expect(mockTxRepo.findById).toHaveBeenCalledWith(5);
    expect(mockProductRepo.updateStock).toHaveBeenCalledWith(2, 15); // Revert stock (+15)
    expect(mockTxRepo.delete).toHaveBeenCalledWith(5);
    expect(result).toBe(true);
  });
});
