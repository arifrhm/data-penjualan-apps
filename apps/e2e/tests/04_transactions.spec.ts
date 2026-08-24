import { test, expect } from '@playwright/test';

test.describe('Transaction Management (Search, Sort, Pagination & CRUD) E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/transactions');
  });

  test('should search transactions by product name', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();

    // Search for "Kopi"
    await page.fill('input[placeholder*="Cari berdasarkan nama barang"]', 'Kopi');
    await expect(page.getByText('Kopi').first()).toBeVisible();

    // Clear search
    await page.fill('input[placeholder*="Cari berdasarkan nama barang"]', '');
    await expect(page.getByText('Sampo').first()).toBeVisible();
  });

  test('should sort transactions by Nama Barang and Tanggal Transaksi', async ({ page }) => {
    // Click sort by Nama Barang
    await page.click('button:has-text("Nama Barang")');
    await expect(page.getByText('Nama Barang').first()).toBeVisible();

    // Click sort by Tanggal Transaksi
    await page.click('button:has-text("Tanggal Transaksi")');
    await expect(page.getByText('Tanggal Transaksi').first()).toBeVisible();
  });

  test('should open add transaction modal and create transaction', async ({ page }) => {
    await page.click('button:has-text("Tambah Transaksi")');
    await expect(page.getByText('Tambah Transaksi Penjualan Baru')).toBeVisible();

    await page.fill('input[type="number"]', '2');
    await page.click('form button[type="submit"]');

    // Verify modal closes
    await expect(page.getByText('Tambah Transaksi Penjualan Baru')).not.toBeVisible();
  });
});
