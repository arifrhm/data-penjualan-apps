import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';

export class SalesComparisonService {
  constructor(private transactionRepo: ITransactionRepository) {}

  async getComparison(type: 'highest' | 'lowest' = 'highest', startDate?: string, endDate?: string) {
    return this.transactionRepo.getCategoryComparison(type, startDate, endDate);
  }
}
