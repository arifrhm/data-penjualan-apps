import { test, expect } from '@playwright/test';

test.describe('Category Management (CRUD) E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/categories');
  });

  test('should render categories page and list default categories', async ({ page }) => {
    await expect(page.locator('h3')).toContainText('Daftar Jenis Barang');
    await expect(page.getByText('Konsumsi')).toBeVisible();
    await expect(page.getByText('Pembersih')).toBeVisible();
  });

  test('should open add category modal and create a new category', async ({ page }) => {
    await page.click('button:has-text("Tambah Kategori")');
    await expect(page.getByText('Tambah Kategori Baru')).toBeVisible();

    const testCategoryName = `Elektronik ${Date.now()}`;
    await page.fill('input[placeholder*="Konsumsi"]', testCategoryName);
    await page.click('button:has-text("Simpan Kategori")');

    // Verify newly created category appears in table
    await expect(page.getByText(testCategoryName)).toBeVisible();
  });
});
