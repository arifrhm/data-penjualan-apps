import { AppDataSource } from '../../../../core/database/data-source.js';
import { ProductCategory } from '../../domain/entities/ProductCategory.js';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';

export class TypeOrmCategoryRepository implements ICategoryRepository {
  private repo = AppDataSource.getRepository(ProductCategory);

  async findAll(): Promise<ProductCategory[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findById(id: number): Promise<ProductCategory | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<ProductCategory | null> {
    return this.repo.findOne({ where: { name } });
  }

  async create(category: Partial<ProductCategory>): Promise<ProductCategory> {
    const entity = this.repo.create(category);
    return this.repo.save(entity);
  }

  async update(id: number, category: Partial<ProductCategory>): Promise<ProductCategory | null> {
    await this.repo.update(id, category);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected || 0) > 0;
  }
}
