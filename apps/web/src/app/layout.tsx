import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata = {
  title: 'Data Penjualan App — DDD Monolith',
  description: 'Aplikasi Data Penjualan Monorepo Modular Monolith DDD',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <PageContainer>{children}</PageContainer>
          </div>
        </div>
      </body>
    </html>
  );
}
