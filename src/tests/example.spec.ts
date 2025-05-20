import { test, expect } from '@playwright/test';

test('story list is visible on homepage', async ({ page }) => {
    await page.goto('/');

    await page.click('.story-skeleton >> nth=0');
    await expect(page.locator('.story-viewer-modal')).toBeVisible();
    await page.waitForTimeout(8000);
    await page.click('.story-close-button');

});
