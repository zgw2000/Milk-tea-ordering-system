import { test, expect, chromium } from '@playwright/test';

test.use({ timeout: 100000 });

test('test', async ({ page }) => {
    const browser = await chromium.launch({ headless: false, slowMo: 600 });
    const context = await browser.newContext();
    page = await context.newPage();
    
    await page.goto('http://localhost:8190/login');
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('jim');
    await page.getByLabel('Name').press('Tab');
    await page.getByLabel('Password').fill('123456');
    await page.getByText('Customer').click();
    await page.getByText('Operator').click();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Refresh' }).click();

});