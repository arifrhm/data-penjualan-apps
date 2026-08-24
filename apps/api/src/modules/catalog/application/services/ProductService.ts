import { IProductRepository } from '../../domain/repositories/IProductRepository.js';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { NotFoundError } from '../../../../core/errors/index.js';

export class ProductService {
  constructor(
    private productRepo: IProductRepository,
    private categoryRepo: ICategoryRepository
  ) {}

  async getAll(search?: string) {
    return this.productRepo.findAll(search);
  }

  async getById(id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }

  async create(data: { name: string; stock: number; categoryId: number }) {
    const category = await this.categoryRepo.findById(data.categoryId);
    if (!category) throw new NotFoundError('Category not found');
    return this.productRepo.create(data);
  }

  async update(id: number, data: { name?: string; stock?: number; categoryId?: number }) {
    await this.getById(id);
    if (data.categoryId) {
      const category = await this.categoryRepo.findById(data.categoryId);
      if (!category) throw new NotFoundError('Category not found');
    }
    return this.productRepo.update(id, data);
  }

  async delete(id: number) {
    await this.getById(id);
    return this.productRepo.delete(id);
  }
}
