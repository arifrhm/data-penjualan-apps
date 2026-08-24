import React from 'react';

interface Column<T> {
  header: React.ReactNode;
  accessor?: keyof T | ((item: T, index?: number) => React.ReactNode);
  cell?: (item: T, index?: number) => React.ReactNode;
  style?: React.CSSProperties;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'Tidak ada data' }: TableProps<T>) {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: '14px 16px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  ...col.style,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: 'var(--text-subtle)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, itemIdx) => (
              <tr
                key={keyExtractor(item)}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {columns.map((col, colIdx) => {
                  let content: React.ReactNode;
                  if (col.cell) {
                    content = col.cell(item, itemIdx);
                  } else if (typeof col.accessor === 'function') {
                    content = col.accessor(item, itemIdx);
                  } else if (col.accessor) {
                    content = item[col.accessor] as unknown as React.ReactNode;
                  }
                  return (
                    <td key={colIdx} style={{ padding: '14px 16px', color: 'var(--text-main)', ...col.style }}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
