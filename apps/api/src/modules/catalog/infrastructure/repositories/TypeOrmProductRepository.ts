import { ILike } from 'typeorm';
import { AppDataSource } from '../../../../core/database/data-source.js';
import { Product } from '../../domain/entities/Product.js';
import { IProductRepository } from '../../domain/repositories/IProductRepository.js';

export class TypeOrmProductRepository implements IProductRepository {
  private repo = AppDataSource.getRepository(Product);

  async findAll(search?: string): Promise<Product[]> {
    const where = search ? { name: ILike(`%${search}%`) } : {};
    return this.repo.find({
      where,
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async create(product: Partial<Product>): Promise<Product> {
    const entity = this.repo.create(product);
    const saved = await this.repo.save(entity);
    return (await this.findById(saved.id))!;
  }

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    await this.repo.update(id, product);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected || 0) > 0;
  }

  async updateStock(id: number, stockDelta: number): Promise<Product | null> {
    await this.repo
      .createQueryBuilder()
      .update(Product)
      .set({ stock: () => `stock + ${stockDelta}` })
      .where('id = :id', { id })
      .execute();
    return this.findById(id);
  }
}
