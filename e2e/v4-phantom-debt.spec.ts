import { test, expect } from '@playwright/test';

test.describe('V4 Phantom Debt Scenario', () => {
  test('displays scenario title and description', async ({ page }) => {
    await page.goto('/v4-phantom-debt');
    await expect(page.locator('h1')).toHaveText('Practice Spotting Fake Bills');
    await expect(page.locator('text=Bad actors sometimes try to confuse you by sending a bill')).toBeVisible();
  });

  test('can identify a fake bill', async ({ page }) => {
    await page.goto('/v4-phantom-debt');
    await expect(page.locator('text=Geek Squad Support')).toBeVisible();
    await page.click('button:has-text("🚨 This is a fake bill")');
    await expect(page.locator('h3')).toHaveText('Brilliantly Done!');
    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=Global Marketplace')).toBeVisible();
  });
});

