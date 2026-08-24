'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { TransactionDto, CreateTransactionPayload, PaginationMeta } from '@sales-app/shared';

interface TransactionFilters {
  search?: string;
  sortBy?: 'name' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export function useTransactions(initialFilters: TransactionFilters = {}) {
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    sortBy: 'date',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const res = await fetchApi<TransactionDto[]>(`/transactions?${params.toString()}`);
      setTransactions(res.data);
      setMeta(res.meta || null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // reset page to 1 when search/sort changes
      page: newFilters.page !== undefined ? newFilters.page : (newFilters.search !== undefined || newFilters.sortBy !== undefined || newFilters.sortOrder !== undefined ? 1 : prev.page),
    }));
  };

  const createTransaction = async (payload: CreateTransactionPayload) => {
    await fetchApi('/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await loadTransactions();
  };

  const updateTransaction = async (id: number, payload: Partial<CreateTransactionPayload>) => {
    await fetchApi(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await loadTransactions();
  };

  const deleteTransaction = async (id: number) => {
    await fetchApi(`/transactions/${id}`, {
      method: 'DELETE',
    });
    await loadTransactions();
  };

  return {
    transactions,
    meta,
    loading,
    error,
    filters,
    updateFilters,
    reload: loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
