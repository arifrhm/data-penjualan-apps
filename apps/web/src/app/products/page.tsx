'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/features/ProductForm';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { ProductDto } from '@sales-app/shared';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts(search);
  const { categories } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductDto) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus barang "${name}"?`)) {
      try {
        await deleteProduct(id);
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus barang');
      }
    }
  };

  const handleSubmit = async (data: { name: string; stock: number; categoryId: number }) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, data);
    } else {
      await createProduct(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search & Actions Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '36px', width: '100%' }}
              placeholder="Cari produk berdasarkan nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Tambah Barang
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', borderRadius: '10px' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Memuat data produk...</div>
        ) : (
          <Table
            keyExtractor={(item) => item.id}
            data={products}
            columns={[
              { header: 'ID', accessor: 'id', style: { width: '80px' } },
              {
                header: 'Nama Barang',
                cell: (item) => <span style={{ fontWeight: '600' }}>{item.name}</span>,
              },
              {
                header: 'Stok Sisa',
                cell: (item) => (
                  <span style={{ fontWeight: '700', color: item.stock < 10 ? 'var(--accent-rose)' : 'var(--text-main)' }}>
                    {item.stock} unit
                  </span>
                ),
              },
              {
                header: 'Jenis Barang (Kategori)',
                cell: (item) => (
                  <span className="badge badge-purple">{item.category?.name || `Category #${item.categoryId}`}</span>
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
                      onClick={() => handleDelete(item.id, item.name)}
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Barang' : 'Tambah Barang Baru'}
      >
        <ProductForm
          initialData={selectedProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
