import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard stats and recent transactions', async ({ page }) => {
    // Check main title
    await expect(page.locator('h2')).toContainText('Dashboard Ringkasan');

    // Check key stat cards
    await expect(page.getByText('Total Transaksi')).toBeVisible();
    await expect(page.getByText('Total Produk')).toBeVisible();
    await expect(page.getByText('Total Kategori')).toBeVisible();
    await expect(page.getByText('Terjual (Top Kategori)')).toBeVisible();

    // Check recent transactions table headers
    await expect(page.getByText('Transaksi Terbaru')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });
});
