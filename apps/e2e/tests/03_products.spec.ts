import { test, expect } from '@playwright/test';

test.describe('Product Management (CRUD & Search) E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should render products list and filter by search input', async ({ page }) => {
    await expect(page.getByText('Kopi')).toBeVisible();
    await expect(page.getByText('Teh')).toBeVisible();

    // Type search query "Kopi"
    await page.fill('input[placeholder*="Cari produk"]', 'Kopi');
    await expect(page.getByText('Kopi')).toBeVisible();
    await expect(page.getByText('Teh')).not.toBeVisible();
  });

  test('should create a new product', async ({ page }) => {
    await page.click('button:has-text("Tambah Barang")');
    await expect(page.getByText('Tambah Barang Baru')).toBeVisible();

    const productName = `Snack Bar ${Date.now()}`;
    await page.fill('input[placeholder*="Kopi, Sampo"]', productName);
    await page.fill('input[type="number"]', '50');
    await page.click('button:has-text("Simpan Barang")');

    await expect(page.getByText(productName)).toBeVisible();
  });
});
