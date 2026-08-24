import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { NotFoundError, BadRequestError } from '../../../../core/errors/index.js';

export class CategoryService {
  constructor(private categoryRepo: ICategoryRepository) {}

  async getAll() {
    return this.categoryRepo.findAll();
  }

  async getById(id: number) {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }

  async create(data: { name: string }) {
    const existing = await this.categoryRepo.findByName(data.name);
    if (existing) throw new BadRequestError('Category with this name already exists');
    return this.categoryRepo.create(data);
  }

  async update(id: number, data: { name?: string }) {
    await this.getById(id);
    if (data.name) {
      const existing = await this.categoryRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new BadRequestError('Category name already taken');
      }
    }
    return this.categoryRepo.update(id, data);
  }

  async delete(id: number) {
    await this.getById(id);
    return this.categoryRepo.delete(id);
  }
}
