'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { ProductDto, CreateProductPayload } from '@sales-app/shared';

export function useProducts(search?: string) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetchApi<ProductDto[]>(`/products${query}`);
      setProducts(res.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const createProduct = async (payload: CreateProductPayload) => {
    await fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await loadProducts();
  };

  const updateProduct = async (id: number, payload: Partial<CreateProductPayload>) => {
    await fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await loadProducts();
  };

  const deleteProduct = async (id: number) => {
    await fetchApi(`/products/${id}`, {
      method: 'DELETE',
    });
    await loadProducts();
  };

  return {
    products,
    loading,
    error,
    reload: loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
