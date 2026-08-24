import { describe, it, expect, vi } from 'vitest';
import { SalesComparisonService } from './SalesComparisonService.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';

describe('SalesComparisonService (DDD Application Layer)', () => {
  it('should call getCategoryComparison with correct parameters', async () => {
    const mockRepo: Partial<ITransactionRepository> = {
      getCategoryComparison: vi.fn().mockResolvedValue([
        { categoryId: 1, categoryName: 'Konsumsi', totalQuantitySold: 49, transactionCount: 4 },
        { categoryId: 2, categoryName: 'Pembersih', totalQuantitySold: 75, transactionCount: 3 },
      ]),
    };

    const service = new SalesComparisonService(mockRepo as ITransactionRepository);
    const result = await service.getComparison('highest', '2021-05-01', '2021-05-31');

    expect(mockRepo.getCategoryComparison).toHaveBeenCalledWith('highest', '2021-05-01', '2021-05-31');
    expect(result).toHaveLength(2);
    expect(result[0].categoryName).toBe('Konsumsi');
  });
});
