import { z } from 'zod';

export const createTransactionSchema = z.object({
  productId: z.number().int().positive('Product ID harus valid'),
  quantitySold: z.number().int().positive('Jumlah terjual harus > 0'),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
});

export const updateTransactionSchema = z.object({
  productId: z.number().int().positive().optional(),
  quantitySold: z.number().int().positive().optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const transactionQuerySchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const comparisonQuerySchema = z.object({
  type: z.enum(['highest', 'lowest']).optional().default('highest'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
