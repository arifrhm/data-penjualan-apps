import { Router, Request, Response, NextFunction } from 'express';
import { TypeOrmCategoryRepository } from '../repositories/TypeOrmCategoryRepository.js';
import { CategoryService } from '../../application/services/CategoryService.js';
import { validateBody } from '../../../../core/middleware/validation.js';
import { createCategorySchema, updateCategorySchema } from '../../application/dtos/index.js';

const router = Router();
const categoryRepo = new TypeOrmCategoryRepository();
const categoryService = new CategoryService(categoryRepo);

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getById(Number(req.params.id));
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateBody(createCategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({ success: true, data: category, message: 'Category created' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateBody(updateCategorySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.update(Number(req.params.id), req.body);
    res.json({ success: true, data: category, message: 'Category updated' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.delete(Number(req.params.id));
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

export const categoryRoutes = router;
