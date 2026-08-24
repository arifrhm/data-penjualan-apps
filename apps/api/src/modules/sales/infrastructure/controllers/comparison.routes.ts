import { Router, Request, Response, NextFunction } from 'express';
import { TypeOrmTransactionRepository } from '../repositories/TypeOrmTransactionRepository.js';
import { SalesComparisonService } from '../../application/services/SalesComparisonService.js';
import { validateQuery } from '../../../../core/middleware/validation.js';
import { comparisonQuerySchema } from '../../application/dtos/index.js';

const router = Router();
const transactionRepo = new TypeOrmTransactionRepository();
const comparisonService = new SalesComparisonService(transactionRepo);

router.get('/comparison', validateQuery(comparisonQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as any;
    const comparison = await comparisonService.getComparison(
      query.type,
      query.startDate,
      query.endDate
    );
    res.json({
      success: true,
      data: comparison,
      meta: {
        filterType: query.type,
        startDate: query.startDate || null,
        endDate: query.endDate || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const comparisonRoutes = router;
