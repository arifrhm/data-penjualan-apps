'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { CategorySalesComparison } from '@sales-app/shared';

interface ComparisonFilter {
  type: 'highest' | 'lowest';
  startDate?: string;
  endDate?: string;
}

export function useComparison(initialType: 'highest' | 'lowest' = 'highest') {
  const [filter, setFilter] = useState<ComparisonFilter>({
    type: initialType,
    startDate: '',
    endDate: '',
  });

  const [data, setData] = useState<CategorySalesComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComparison = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('type', filter.type);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);

      const res = await fetchApi<CategorySalesComparison[]>(`/sales/comparison?${params.toString()}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data komparasi');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadComparison();
  }, [loadComparison]);

  const updateFilter = (newFilter: Partial<ComparisonFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  return {
    data,
    loading,
    error,
    filter,
    updateFilter,
    reload: loadComparison,
  };
}
