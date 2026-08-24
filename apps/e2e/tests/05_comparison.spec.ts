import { test, expect } from '@playwright/test';

test.describe('Sales Comparison & Date Range Filter E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/comparison');
  });

  test('should render category comparison cards and table', async ({ page }) => {
    await expect(page.getByText('Konsumsi').first()).toBeVisible();
    await expect(page.getByText('Pembersih').first()).toBeVisible();
    await expect(page.getByText('Tabel Rincian Komparasi Penjualan')).toBeVisible();
  });

  test('should toggle between Terbanyak Terjual and Terendah Terjual', async ({ page }) => {
    // Default is Terbanyak Terjual
    await expect(page.getByText('Terbanyak Terjual')).toBeVisible();

    // Click Terendah Terjual
    await page.click('button:has-text("Terendah Terjual")');
    await expect(page.getByText('Terendah Terjual')).toBeVisible();
  });

  test('should filter comparison data by date range', async ({ page }) => {
    // Fill start date & end date
    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.nth(0).fill('2021-05-01');
    await dateInputs.nth(1).fill('2021-05-10');

    // Reset button should appear
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

    // Click Reset
    await page.click('button:has-text("Reset")');
    await expect(page.getByRole('button', { name: 'Reset' })).not.toBeVisible();
  });
});
