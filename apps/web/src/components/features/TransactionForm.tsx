'use client';

import React, { useState, useEffect } from 'react';
import { ProductDto } from '@sales-app/shared';

interface TransactionFormProps {
  initialData?: { id?: number; productId: number; quantitySold: number; transactionDate: string } | null;
  products: ProductDto[];
  onSubmit: (data: { productId: number; quantitySold: number; transactionDate: string }) => Promise<void>;
  onCancel: () => void;
}

export function TransactionForm({ initialData, products, onSubmit, onCancel }: TransactionFormProps) {
  const [productId, setProductId] = useState<number>(products[0]?.id || 0);
  const [quantitySold, setQuantitySold] = useState<number>(1);
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setProductId(initialData.productId);
      setQuantitySold(initialData.quantitySold);
      setTransactionDate(initialData.transactionDate.split('T')[0]);
    } else {
      if (products.length > 0) setProductId(products[0].id);
      setQuantitySold(1);
      setTransactionDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, products]);

  const selectedProduct = products.find((p) => p.id === Number(productId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError('Produk harus dipilih');
      return;
    }
    if (quantitySold <= 0) {
      setError('Jumlah terjual harus lebih dari 0');
      return;
    }
    if (!transactionDate) {
      setError('Tanggal transaksi harus diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        productId: Number(productId),
        quantitySold: Number(quantitySold),
        transactionDate,
      });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan transaksi');
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
          Pilih Barang
        </label>
        <select
          className="glass-input"
          style={{ width: '100%', background: '#0b0f19' }}
          value={productId}
          onChange={(e) => setProductId(Number(e.target.value))}
          disabled={loading}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stok tersedia: {p.stock})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Jumlah Terjual
        </label>
        <input
          type="number"
          className="glass-input"
          style={{ width: '100%' }}
          min={1}
          max={selectedProduct ? selectedProduct.stock : undefined}
          value={quantitySold}
          onChange={(e) => setQuantitySold(Number(e.target.value))}
          disabled={loading}
        />
        {selectedProduct && (
          <span style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '4px', display: 'block' }}>
            Maksimum terjual: {selectedProduct.stock} unit
          </span>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Tanggal Transaksi
        </label>
        <input
          type="date"
          className="glass-input"
          style={{ width: '100%', colorScheme: 'dark' }}
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          disabled={loading}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
          Batal
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : initialData ? 'Perbarui Transaksi' : 'Tambah Transaksi'}
        </button>
      </div>
    </form>
  );
}
