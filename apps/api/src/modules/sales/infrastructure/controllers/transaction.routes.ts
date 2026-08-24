import { Router, Request, Response, NextFunction } from 'express';
import { TypeOrmTransactionRepository } from '../repositories/TypeOrmTransactionRepository.js';
import { TypeOrmProductRepository } from '../../../catalog/infrastructure/repositories/TypeOrmProductRepository.js';
import { TransactionService } from '../../application/services/TransactionService.js';
import { validateBody, validateQuery } from '../../../../core/middleware/validation.js';
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema } from '../../application/dtos/index.js';

const router = Router();
const transactionRepo = new TypeOrmTransactionRepository();
const productRepo = new TypeOrmProductRepository();
const transactionService = new TransactionService(transactionRepo, productRepo);

router.get('/', validateQuery(transactionQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as any;
    const result = await transactionService.getAll({
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page,
      limit: query.limit,
    });
    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.getById(Number(req.params.id));
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateBody(createTransactionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.create(req.body);
    res.status(201).json({ success: true, data: transaction, message: 'Transaction created' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateBody(updateTransactionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.update(Number(req.params.id), req.body);
    res.json({ success: true, data: transaction, message: 'Transaction updated' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await transactionService.delete(Number(req.params.id));
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
});

export const transactionRoutes = router;
