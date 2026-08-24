'use client';

import { useComparison } from '@/hooks/useComparison';
import { Table } from '@/components/ui/Table';
import { TrendingUp, TrendingDown, Calendar, RotateCcw } from 'lucide-react';

export default function ComparisonPage() {
  const { data, loading, error, filter, updateFilter } = useComparison('highest');

  const handleResetFilter = () => {
    updateFilter({
      type: 'highest',
      startDate: '',
      endDate: '',
    });
  };

  const totalQuantitySoldAll = data.reduce((acc, curr) => acc + curr.totalQuantitySold, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px' }}>
              <button
                className="btn-secondary"
                style={{
                  border: 'none',
                  background: filter.type === 'highest' ? 'var(--primary)' : 'transparent',
                  color: filter.type === 'highest' ? '#fff' : 'var(--text-muted)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
                onClick={() => updateFilter({ type: 'highest' })}
              >
                <TrendingUp size={16} /> Terbanyak Terjual
              </button>

              <button
                className="btn-secondary"
                style={{
                  border: 'none',
                  background: filter.type === 'lowest' ? 'var(--accent-rose)' : 'transparent',
                  color: filter.type === 'lowest' ? '#fff' : 'var(--text-muted)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
                onClick={() => updateFilter({ type: 'lowest' })}
              >
                <TrendingDown size={16} /> Terendah Terjual
              </button>
            </div>

            {/* Date Range Filter (Soal 5) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Rentang Waktu:</span>
              </div>

              <input
                type="date"
                className="glass-input"
                style={{ colorScheme: 'dark', fontSize: '13px' }}
                value={filter.startDate || ''}
                onChange={(e) => updateFilter({ startDate: e.target.value })}
                placeholder="Tanggal Mulai"
              />

              <span style={{ color: 'var(--text-subtle)' }}>s/d</span>

              <input
                type="date"
                className="glass-input"
                style={{ colorScheme: 'dark', fontSize: '13px' }}
                value={filter.endDate || ''}
                onChange={(e) => updateFilter({ endDate: e.target.value })}
                placeholder="Tanggal Selesai"
              />

              {(filter.startDate || filter.endDate) && (
                <button
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                  onClick={handleResetFilter}
                  title="Reset Filter"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', borderRadius: '10px' }}>
          {error}
        </div>
      )}

      {/* Graphical Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {data.map((item, idx) => {
          const maxVal = Math.max(...data.map((d) => d.totalQuantitySold), 1);
          const percentage = Math.round((item.totalQuantitySold / maxVal) * 100);
          const isTop = idx === 0;

          return (
            <div
              key={item.categoryId}
              className="glass-panel"
              style={{
                padding: '24px',
                borderColor: isTop ? (filter.type === 'highest' ? 'var(--primary-glow)' : 'rgba(244,63,94,0.3)') : 'var(--border-color)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isTop && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: filter.type === 'highest' ? 'rgba(99,102,241,0.2)' : 'rgba(244,63,94,0.2)',
                    color: filter.type === 'highest' ? '#818cf8' : '#f43f5e',
                    border: `1px solid ${filter.type === 'highest' ? 'rgba(99,102,241,0.4)' : 'rgba(244,63,94,0.4)'}`,
                  }}
                >
                  {filter.type === 'highest' ? '🏆 Tertinggi' : '⚠️ Terendah'}
                </div>
              )}

              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{item.categoryName}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {item.transactionCount} kali transaksi tercatat
              </p>

              <div style={{ fontSize: '36px', fontWeight: '800', color: isTop ? (filter.type === 'highest' ? 'var(--primary)' : 'var(--accent-rose)') : 'var(--text-main)' }}>
                {item.totalQuantitySold} <span style={{ fontSize: '16px', fontWeight: '400', color: 'var(--text-muted)' }}>unit</span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '16px', width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: filter.type === 'highest' ? 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)' : 'linear-gradient(90deg, #f43f5e 0%, #f59e0b 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease-in-out',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Data Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
          Tabel Rincian Komparasi Penjualan
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Memuat data komparasi...</div>
        ) : (
          <Table
            keyExtractor={(item) => item.categoryId}
            data={data}
            columns={[
              { header: 'Peringkat', cell: (_, idx) => `#${(idx || 0) + 1}`, style: { width: '80px' } },
              {
                header: 'Jenis Barang (Kategori)',
                cell: (item) => <span style={{ fontWeight: '600' }}>{item.categoryName}</span>,
              },
              {
                header: 'Total Terjual',
                cell: (item) => (
                  <span style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '15px' }}>
                    {item.totalQuantitySold} unit
                  </span>
                ),
              },
              { header: 'Jumlah Transaksi', cell: (item) => `${item.transactionCount} transaksi` },
              {
                header: 'Kontribusi (%)',
                cell: (item) => {
                  const pct = totalQuantitySoldAll > 0 ? ((item.totalQuantitySold / totalQuantitySoldAll) * 100).toFixed(1) : '0';
                  return <span className="badge badge-emerald">{pct}%</span>;
                },
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
