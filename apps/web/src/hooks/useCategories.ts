'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { ProductCategoryDto, CreateCategoryPayload } from '@sales-app/shared';

export function useCategories() {
  const [categories, setCategories] = useState<ProductCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi<ProductCategoryDto[]>('/categories');
      setCategories(res.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const createCategory = async (payload: CreateCategoryPayload) => {
    await fetchApi('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await loadCategories();
  };

  const updateCategory = async (id: number, payload: Partial<CreateCategoryPayload>) => {
    await fetchApi(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await loadCategories();
  };

  const deleteCategory = async (id: number) => {
    await fetchApi(`/categories/${id}`, {
      method: 'DELETE',
    });
    await loadCategories();
  };

  return {
    categories,
    loading,
    error,
    reload: loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
