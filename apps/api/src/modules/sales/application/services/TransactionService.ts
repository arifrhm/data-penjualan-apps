import { ITransactionRepository, TransactionFindOptions } from '../../domain/repositories/ITransactionRepository.js';
import { IProductRepository } from '../../../catalog/domain/repositories/IProductRepository.js';
import { NotFoundError, BadRequestError } from '../../../../core/errors/index.js';

export class TransactionService {
  constructor(
    private transactionRepo: ITransactionRepository,
    private productRepo: IProductRepository
  ) {}

  async getAll(options: TransactionFindOptions) {
    const [data, total] = await this.transactionRepo.findAndCount(options);
    const limit = options.limit || 10;
    const page = options.page || 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getById(id: number) {
    const transaction = await this.transactionRepo.findById(id);
    if (!transaction) throw new NotFoundError('Transaction not found');
    return transaction;
  }

  async create(data: { productId: number; quantitySold: number; transactionDate: string }) {
    const product = await this.productRepo.findById(data.productId);
    if (!product) throw new NotFoundError('Product not found');

    if (product.stock < data.quantitySold) {
      throw new BadRequestError(`Stok produk "${product.name}" tidak mencukupi (Tersedia: ${product.stock})`);
    }

    const currentStock = product.stock;
    // Create transaction recording stock at transaction
    const transaction = await this.transactionRepo.create({
      productId: data.productId,
      quantitySold: data.quantitySold,
      transactionDate: data.transactionDate,
      stockAtTransaction: currentStock,
    });

    // Reduce product stock
    await this.productRepo.updateStock(data.productId, -data.quantitySold);

    return transaction;
  }

  async update(
    id: number,
    data: { productId?: number; quantitySold?: number; transactionDate?: string }
  ) {
    const existing = await this.getById(id);

    // Revert previous stock adjustment
    await this.productRepo.updateStock(existing.productId, existing.quantitySold);

    const targetProductId = data.productId || existing.productId;
    const targetQuantity = data.quantitySold !== undefined ? data.quantitySold : existing.quantitySold;

    const product = await this.productRepo.findById(targetProductId);
    if (!product) throw new NotFoundError('Product not found');

    if (product.stock < targetQuantity) {
      // Re-apply previous stock adjustment if check fails
      await this.productRepo.updateStock(existing.productId, -existing.quantitySold);
      throw new BadRequestError(`Stok produk "${product.name}" tidak mencukupi`);
    }

    // Update product stock with new quantity
    await this.productRepo.updateStock(targetProductId, -targetQuantity);

    const updated = await this.transactionRepo.update(id, {
      productId: targetProductId,
      quantitySold: targetQuantity,
      transactionDate: data.transactionDate || existing.transactionDate,
    });

    return updated;
  }

  async delete(id: number) {
    const existing = await this.getById(id);
    // Revert product stock
    await this.productRepo.updateStock(existing.productId, existing.quantitySold);
    return this.transactionRepo.delete(id);
  }
}
