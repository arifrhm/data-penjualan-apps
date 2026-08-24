import React from 'react';

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        padding: '32px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {children}
    </main>
  );
}
