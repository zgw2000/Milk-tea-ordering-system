import { test, expect, chromium } from '@playwright/test';

test.use({ timeout: 100000 });

test('test', async ({ page }) => {
    const browser = await chromium.launch({ headless: false, slowMo: 450 });
    const context = await browser.newContext();
    page = await context.newPage();
    
    await page.goto('http://localhost:8190/login');
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').press('Meta+c');
    await page.getByLabel('Name').fill('alice');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').press('Meta+c');
    await page.getByLabel('Password').fill('123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Customer').click();
    await page.getByLabel('Customer').press('Meta+c');
    await page.getByText('Customer').click();
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Juice' }).click();
    await page.locator('div:nth-child(9) > .d-flex > .btn').click();
    await page.locator('div:nth-child(10) > .d-flex > .btn').click();
    await page.locator('span').filter({ hasText: 'Honey ×' }).getByRole('button').click();
    await page.getByRole('group', { name: 'Ice Level' }).getByLabel('Increment').click();
    await page.getByRole('group', { name: 'Ice Level' }).getByLabel('Increment').press('Meta+c');
    await page.getByRole('group', { name: 'Sweetness Level' }).getByLabel('Decrement').dblclick();
    await page.getByRole('group', { name: 'Sweetness Level' }).getByLabel('Decrement').press('Meta+c');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByLabel('Submit').getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'History Order' }).click();
    await page.goto('http://localhost:8190');

});