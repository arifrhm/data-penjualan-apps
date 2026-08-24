'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useProducts } from '@/hooks/useProducts';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/components/features/TransactionForm';
import { Plus, Edit2, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionDto } from '@sales-app/shared';

export default function TransactionsPage() {
  const {
    transactions,
    meta,
    loading,
    error,
    filters,
    updateFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const { products } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto | null>(null);

  const handleOpenAdd = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: TransactionDto) => {
    setSelectedTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, productName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus transaksi "${productName}" ini? Stok akan dikembalikan.`)) {
      try {
        await deleteTransaction(id);
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus transaksi');
      }
    }
  };

  const handleSubmit = async (data: { productId: number; quantitySold: number; transactionDate: string }) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.id, data);
    } else {
      await createTransaction(data);
    }
    setIsModalOpen(false);
  };

  const toggleSort = (field: 'name' | 'date') => {
    if (filters.sortBy === field) {
      // Toggle direction
      const nextOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
      updateFilters({ sortOrder: nextOrder });
    } else {
      // Set new field, default asc
      updateFilters({ sortBy: field, sortOrder: 'asc' });
    }
  };

  const renderSortIcon = (field: 'name' | 'date') => {
    if (filters.sortBy !== field) return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    return filters.sortOrder === 'asc' ? (
      <ArrowUp size={14} style={{ color: 'var(--primary)' }} />
    ) : (
      <ArrowDown size={14} style={{ color: 'var(--primary)' }} />
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Controls Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="glass-input"
                style={{ paddingLeft: '36px', width: '100%' }}
                placeholder="Cari berdasarkan nama barang (Kopi, Teh, dll)..."
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>
          </div>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Tambah Transaksi
          </button>
        </div>

        {/* Quick Sort Options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Urutkan Berdasarkan:</span>
          <button
            className={`btn-secondary ${filters.sortBy === 'name' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              borderColor: filters.sortBy === 'name' ? 'var(--primary)' : 'var(--border-color)',
            }}
            onClick={() => toggleSort('name')}
          >
            Nama Barang {renderSortIcon('name')}
          </button>

          <button
            className={`btn-secondary ${filters.sortBy === 'date' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              borderColor: filters.sortBy === 'date' ? 'var(--primary)' : 'var(--border-color)',
            }}
            onClick={() => toggleSort('date')}
          >
            Tanggal Transaksi {renderSortIcon('date')}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', borderRadius: '10px' }}>
          {error}
        </div>
      )}

      {/* Main Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Memuat data transaksi...</div>
        ) : (
          <>
            <Table
              keyExtractor={(item) => item.id}
              data={transactions}
              columns={[
                {
                  header: 'No',
                  cell: (_, idx) => {
                    const page = meta?.page || 1;
                    const limit = meta?.limit || 10;
                    return (page - 1) * limit + (idx ? idx + 1 : 1);
                  },
                  style: { width: '60px' },
                },
                {
                  header: (
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      onClick={() => toggleSort('name')}
                    >
                      Nama Barang {renderSortIcon('name')}
                    </div>
                  ),
                  cell: (item) => (
                    <span style={{ fontWeight: '600' }}>{item.product?.name || `Product #${item.productId}`}</span>
                  ),
                },
                {
                  header: 'Stok Sisa',
                  cell: (item) => (
                    <span>{item.product?.stock ?? item.stockAtTransaction} unit</span>
                  ),
                },
                {
                  header: 'Jumlah Terjual',
                  cell: (item) => (
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>
                      {item.quantitySold} unit
                    </span>
                  ),
                },
                {
                  header: (
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      onClick={() => toggleSort('date')}
                    >
                      Tanggal Transaksi {renderSortIcon('date')}
                    </div>
                  ),
                  cell: (item) =>
                    new Date(item.transactionDate).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    }),
                },
                {
                  header: 'Jenis Barang',
                  cell: (item) => (
                    <span className="badge badge-purple">{item.product?.category?.name || '-'}</span>
                  ),
                },
                {
                  header: 'Aksi',
                  style: { width: '120px', textAlign: 'right' },
                  cell: (item) => (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 10px' }}
                        onClick={() => handleOpenEdit(item)}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(item.id, item.product?.name || '')}
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ),
                },
              ]}
            />

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                <span>
                  Menampilkan Halaman {meta.page} dari {meta.totalPages} ({meta.total} Total Transaksi)
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px' }}
                    disabled={meta.page <= 1}
                    onClick={() => updateFilters({ page: meta.page - 1 })}
                  >
                    <ChevronLeft size={16} /> Sebelumnya
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px' }}
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => updateFilters({ page: meta.page + 1 })}
                  >
                    Berikutnya <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Penjualan Baru'}
      >
        <TransactionForm
          initialData={selectedTransaction}
          products={products}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
