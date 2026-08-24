'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Ringkasan', subtitle: 'Overview performa penjualan dan statistik terkini' },
  '/transactions': { title: 'Data Transaksi Penjualan', subtitle: 'Kelola transaksi, pencarian, dan pengurutan data' },
  '/products': { title: 'Katalog Produk', subtitle: 'Manajemen data barang dan stok' },
  '/categories': { title: 'Kategori Barang', subtitle: 'Klasifikasi barang (Konsumsi, Pembersih, dll)' },
  '/comparison': { title: 'Komparasi Jenis Barang', subtitle: 'Perbandingan penjualan terbanyak / terendah dengan filter tanggal' },
};

export function Header() {
  const pathname = usePathname();
  const info = PAGE_TITLES[pathname] || { title: 'Aplikasi Data Penjualan', subtitle: 'Monorepo DDD Monolith' };

  return (
    <header
      style={{
        padding: '24px 32px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(11, 15, 25, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)' }}>{info.title}</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{info.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="badge badge-emerald">PostgreSQL 3NF</span>
        <span className="badge badge-purple">DDD Architecture</span>
      </div>
    </header>
  );
}
