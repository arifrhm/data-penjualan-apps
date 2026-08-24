import { Router, Request, Response, NextFunction } from 'express';
import { TypeOrmProductRepository } from '../repositories/TypeOrmProductRepository.js';
import { TypeOrmCategoryRepository } from '../repositories/TypeOrmCategoryRepository.js';
import { ProductService } from '../../application/services/ProductService.js';
import { validateBody } from '../../../../core/middleware/validation.js';
import { createProductSchema, updateProductSchema } from '../../application/dtos/index.js';

const router = Router();
const productRepo = new TypeOrmProductRepository();
const categoryRepo = new TypeOrmCategoryRepository();
const productService = new ProductService(productRepo, categoryRepo);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const products = await productService.getAll(search);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getById(Number(req.params.id));
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateBody(createProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, data: product, message: 'Product created' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateBody(updateProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.update(Number(req.params.id), req.body);
    res.json({ success: true, data: product, message: 'Product updated' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.delete(Number(req.params.id));
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

export const productRoutes = router;
