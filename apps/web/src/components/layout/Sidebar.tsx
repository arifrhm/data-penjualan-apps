'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Tags, ReceiptText, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Transaksi', href: '/transactions', icon: ReceiptText },
  { label: 'Produk', href: '/products', icon: ShoppingBag },
  { label: 'Kategori', href: '/categories', icon: Tags },
  { label: 'Komparasi Penjualan', href: '/comparison', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        borderRight: '1px solid var(--border-color)',
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: '#fff',
              fontSize: '18px',
            }}
          >
            S
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
              SalesMetrics
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DDD Modular Monolith</span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, transparent 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-subtle)' }}>
        Data Penjualan Apps v1.0
      </div>
    </aside>
  );
}
