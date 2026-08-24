'use client';

import Link from 'next/link';
import { useTransactions } from '@/hooks/useTransactions';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useComparison } from '@/hooks/useComparison';
import { Table } from '@/components/ui/Table';
import { ShoppingBag, Tags, ReceiptText, TrendingUp, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { transactions, meta } = useTransactions({ limit: 5 });
  const { products } = useProducts();
  const { categories } = useCategories();
  const { data: comparisonData } = useComparison('highest');

  const totalQuantitySold = transactions.reduce((acc, curr) => acc + curr.quantitySold, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Transaksi</span>
            <ReceiptText size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '12px', color: '#fff' }}>
            {meta?.total || 0}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginTop: '6px', display: 'inline-block' }}>
            Record transaksi tercatat
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Produk</span>
            <ShoppingBag size={22} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '12px', color: '#fff' }}>
            {products.length}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'inline-block' }}>
            Barang aktif dalam katalog
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Kategori</span>
            <Tags size={22} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '12px', color: '#fff' }}>
            {categories.length}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'inline-block' }}>
            Klasifikasi jenis barang
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Terjual (Top Kategori)</span>
            <TrendingUp size={22} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '12px', color: '#fff' }}>
            {comparisonData[0] ? comparisonData[0].totalQuantitySold : 0} <span style={{ fontSize: '16px', fontWeight: '400' }}>unit</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginTop: '6px', display: 'inline-block' }}>
            Kategori: {comparisonData[0]?.categoryName || '-'}
          </span>
        </div>
      </div>

      {/* Main Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Transactions */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Transaksi Terbaru</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>5 transaksi terakhir dimasukkan ke sistem</p>
            </div>
            <Link href="/transactions" className="btn-secondary" style={{ fontSize: '13px', textDecoration: 'none' }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          <Table
            keyExtractor={(item) => item.id}
            data={transactions}
            columns={[
              { header: 'No', cell: (_, idx) => (idx ? idx + 1 : 1) },
              {
                header: 'Nama Barang',
                cell: (item) => (
                  <span style={{ fontWeight: '600' }}>{item.product?.name || `Product #${item.productId}`}</span>
                ),
              },
              {
                header: 'Jenis Barang',
                cell: (item) => (
                  <span className="badge badge-purple">{item.product?.category?.name || '-'}</span>
                ),
              },
              { header: 'Stok Sisa', cell: (item) => item.product?.stock ?? '-' },
              { header: 'Jumlah Terjual', cell: (item) => <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>{item.quantitySold}</span> },
              {
                header: 'Tanggal Transaksi',
                cell: (item) => new Date(item.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
              },
            ]}
          />
        </div>

        {/* Sales by Category Summary */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Perbandingan Jenis</h3>
            <Link href="/comparison" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>
              Detail →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comparisonData.map((item) => {
              const maxVal = Math.max(...comparisonData.map((d) => d.totalQuantitySold), 1);
              const percentage = Math.round((item.totalQuantitySold / maxVal) * 100);

              return (
                <div key={item.categoryId} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ fontWeight: '600' }}>{item.categoryName}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>{item.totalQuantitySold} unit</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                    {item.transactionCount} kali transaksi
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
