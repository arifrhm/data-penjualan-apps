'use client';

import React, { useState, useEffect } from 'react';
import { ProductCategoryDto } from '@sales-app/shared';

interface ProductFormProps {
  initialData?: { id?: number; name: string; stock: number; categoryId: number } | null;
  categories: ProductCategoryDto[];
  onSubmit: (data: { name: string; stock: number; categoryId: number }) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initialData, categories, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStock(initialData.stock);
      setCategoryId(initialData.categoryId);
    } else {
      setName('');
      setStock(100);
      if (categories.length > 0) setCategoryId(categories[0].id);
    }
  }, [initialData, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama barang harus diisi');
      return;
    }
    if (!categoryId) {
      setError('Kategori harus dipilih');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), stock: Number(stock), categoryId: Number(categoryId) });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan barang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', fontSize: '13px' }}>
          {error}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Nama Barang
        </label>
        <input
          type="text"
          className="glass-input"
          style={{ width: '100%' }}
          placeholder="Contoh: Kopi, Sampo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoFocus
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Stok
        </label>
        <input
          type="number"
          className="glass-input"
          style={{ width: '100%' }}
          min={0}
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          disabled={loading}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Jenis Barang (Kategori)
        </label>
        <select
          className="glass-input"
          style={{ width: '100%', background: '#0b0f19' }}
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          disabled={loading}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
          Batal
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : initialData ? 'Perbarui' : 'Simpan Barang'}
        </button>
      </div>
    </form>
  );
}
