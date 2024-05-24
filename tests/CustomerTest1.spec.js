import { test, expect, chromium } from '@playwright/test';

test.use({ timeout: 100000 });

test('test', async ({ page }) => {
    const browser = await chromium.launch({ headless: false, slowMo: 450 });
    const context = await browser.newContext();
    page = await context.newPage();


    await page.goto('http://localhost:8190/login');
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').press('Meta+c');
    await page.getByLabel('Name').fill('bob');
    await page.getByLabel('Name').press('Tab');
    await page.getByLabel('Password').fill('123456');
    await page.getByText('Customer').click();
    await page.getByLabel('Customer').press('Meta+c');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Juice' }).click();
    await page.locator('.d-flex > .btn').first().click();
    await page.locator('.d-flex > .btn').first().press('Meta+c');
    await page.locator('div:nth-child(2) > .d-flex > .btn').first().click();
    await page.getByRole('button', { name: 'Refresh' }).click();
    await page.getByRole('button', { name: 'Juice' }).click();
    await page.getByRole('group', { name: 'Ice Level' }).getByLabel('Decrement').click();
    await page.getByRole('group', { name: 'Ice Level' }).getByLabel('Decrement').press('Meta+c');
    await page.getByRole('group', { name: 'Sweetness Level' }).getByLabel('Decrement').click();
    await page.getByRole('group', { name: 'Sweetness Level' }).getByLabel('Decrement').press('Meta+c');
    await page.getByRole('group', { name: 'Sweetness Level' }).getByLabel('Decrement').click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('Close').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByLabel('Submit').getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'History Order' }).click();
    await page.goto('http://localhost:8190');
    
});