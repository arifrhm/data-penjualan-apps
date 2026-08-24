import { AppDataSource } from '../../../../core/database/data-source.js';
import { Transaction } from '../../domain/entities/Transaction.js';
import {
  ITransactionRepository,
  TransactionFindOptions,
  CategoryComparisonResult,
} from '../../domain/repositories/ITransactionRepository.js';

export class TypeOrmTransactionRepository implements ITransactionRepository {
  private repo = AppDataSource.getRepository(Transaction);

  async findAndCount(options: TransactionFindOptions): Promise<[Transaction[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.product', 'product')
      .leftJoinAndSelect('product.category', 'category');

    // Search by product name
    if (options.search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${options.search}%` });
    }

    // Sort by name or date
    const sortOrder = options.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    if (options.sortBy === 'name') {
      qb.orderBy('product.name', sortOrder);
    } else {
      // Default sort by transactionDate
      qb.orderBy('tx.transactionDate', sortOrder).addOrderBy('tx.id', 'ASC');
    }

    qb.skip(skip).take(limit);

    return qb.getManyAndCount();
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['product', 'product.category'],
    });
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const entity = this.repo.create(transaction);
    const saved = await this.repo.save(entity);
    return (await this.findById(saved.id))!;
  }

  async update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null> {
    await this.repo.update(id, transaction);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected || 0) > 0;
  }

  async getCategoryComparison(
    type: 'highest' | 'lowest' = 'highest',
    startDate?: string,
    endDate?: string
  ): Promise<CategoryComparisonResult[]> {
    const qb = AppDataSource.createQueryBuilder()
      .select('c.id', 'categoryId')
      .addSelect('c.name', 'categoryName')
      .addSelect('COALESCE(SUM(t.quantity_sold), 0)', 'totalQuantitySold')
      .addSelect('COUNT(t.id)', 'transactionCount')
      .from('product_categories', 'c')
      .leftJoin('products', 'p', 'p.category_id = c.id')
      .leftJoin('transactions', 't', 't.product_id = p.id');

    if (startDate && endDate) {
      qb.andWhere('t.transaction_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      qb.andWhere('t.transaction_date >= :startDate', { startDate });
    } else if (endDate) {
      qb.andWhere('t.transaction_date <= :endDate', { endDate });
    }

    qb.groupBy('c.id').addGroupBy('c.name');

    const sortDir = type === 'lowest' ? 'ASC' : 'DESC';
    qb.orderBy('"totalQuantitySold"', sortDir);

    const rawResults = await qb.getRawMany();

    return rawResults.map((r) => ({
      categoryId: Number(r.categoryId),
      categoryName: r.categoryName,
      totalQuantitySold: Number(r.totalQuantitySold),
      transactionCount: Number(r.transactionCount),
    }));
  }
}
