import { test, expect } from '@playwright/test';

test('capture screenshots of V4 Phantom Debt scenario', async ({ page }) => {
  await page.goto('http://localhost:3000/v4-phantom-debt');
  await page.waitForLoadState('networkidle');

  // Ensure artifacts directory exists
  // Standard size Light
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: 'artifacts/v4-phantom-debt-web-light.png' });

  // Standard size Dark (emulated via CSS color-scheme)
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: 'artifacts/v4-phantom-debt-web-dark.png' });

  // Reset to Light
  await page.emulateMedia({ colorScheme: 'light' });

  // Large Text 200% via CSS zoom (simulating large accessibility font size)
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  await page.screenshot({ path: 'artifacts/v4-phantom-debt-web-large-text-light.png' });
  
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: 'artifacts/v4-phantom-debt-web-large-text-dark.png' });
});

