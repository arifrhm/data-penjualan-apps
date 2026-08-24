'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { CategoryForm } from '@/components/features/CategoryForm';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ProductCategoryDto } from '@sales-app/shared';

export default function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryDto | null>(null);

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: ProductCategoryDto) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
      try {
        await deleteCategory(id);
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus kategori');
      }
    }
  };

  const handleSubmit = async (data: { name: string }) => {
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, data);
    } else {
      await createCategory(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Daftar Jenis Barang (Kategori)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Klasifikasi master untuk barang penjualan</p>
        </div>
        <button className="btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Tambah Kategori
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
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Memuat data...</div>
        ) : (
          <Table
            keyExtractor={(item) => item.id}
            data={categories}
            columns={[
              { header: 'ID', accessor: 'id', style: { width: '80px' } },
              {
                header: 'Nama Jenis Barang (Kategori)',
                cell: (item) => <span style={{ fontWeight: '600' }}>{item.name}</span>,
              },
              {
                header: 'Tanggal Dibuat',
                cell: (item) => new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
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
        title={selectedCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      >
        <CategoryForm
          initialData={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
