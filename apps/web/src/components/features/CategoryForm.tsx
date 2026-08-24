'use client';

import React, { useState, useEffect } from 'react';

interface CategoryFormProps {
  initialData?: { id?: number; name: string } | null;
  onSubmit: (data: { name: string }) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama kategori harus diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim() });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kategori');
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
          Nama Kategori
        </label>
        <input
          type="text"
          className="glass-input"
          style={{ width: '100%' }}
          placeholder="Contoh: Konsumsi, Pembersih"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoFocus
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
          Batal
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : initialData ? 'Perbarui' : 'Simpan Kategori'}
        </button>
      </div>
    </form>
  );
}
