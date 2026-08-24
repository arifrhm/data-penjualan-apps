import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori tidak boleh kosong').max(100),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nama barang tidak boleh kosong').max(255),
  stock: z.number().int().min(0, 'Stok minimal 0'),
  categoryId: z.number().int().positive('Category ID harus valid'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.number().int().positive().optional(),
});
