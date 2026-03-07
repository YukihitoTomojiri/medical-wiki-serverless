import { test, expect } from '@playwright/test';

test.describe('Organization Management', () => {
    test('Admin user can view 4 facilities on organization page', async ({ page }) => {
        // Navigate to login
        await page.goto('/login');
        // Login as admin001
        await page.getByPlaceholder('例: dev001').fill('admin001');
        await page.getByPlaceholder('パスワードを入力してください').fill('password123');
        await page.getByRole('button', { name: 'ログインする' }).click();

        // Wait for dashboard to load
        await expect(page).toHaveURL(/\/my-dashboard/);

        // Navigate to organization page
        await page.goto('/admin/organization');
        await expect(page).toHaveURL(/\/admin\/organization/);

        // Verify 4 facilities are displayed
        await expect(page.getByText('本部病院', { exact: true })).toBeVisible();
        await expect(page.getByText('本部病院介護医療院', { exact: true })).toBeVisible();
        await expect(page.getByText('後光病院', { exact: true })).toBeVisible();
        await expect(page.getByText('玉診療所', { exact: true })).toBeVisible();
    });

    test('Facilities can be expanded to show departments', async ({ page }) => {
        // Navigate to login
        await page.goto('/login');
        // Login as admin001
        await page.getByPlaceholder('例: dev001').fill('admin001');
        await page.getByPlaceholder('パスワードを入力してください').fill('password123');
        await page.getByRole('button', { name: 'ログインする' }).click();

        await expect(page).toHaveURL(/\/my-dashboard/);
        await page.goto('/admin/organization');

        // Expand 本部病院 and verify target department
        await page.locator('h3').filter({ hasText: /^本部病院$/ }).click();
        await expect(page.getByText('理学療法課', { exact: true })).toBeVisible();

        // Collapse or just expand the next
        await page.locator('h3').filter({ hasText: /^本部病院介護医療院$/ }).click();
        await expect(page.getByText('介護課', { exact: true })).toBeVisible();

        await page.locator('h3').filter({ hasText: /^後光病院$/ }).click();
        await expect(page.getByText('薬剤科', { exact: true })).toBeVisible();

        await page.locator('h3').filter({ hasText: /^玉診療所$/ }).click();
        await expect(page.getByText('外来', { exact: true })).toBeVisible();
    });

    test('Regular user cannot access organization page', async ({ page }) => {
        // Navigate to login
        await page.goto('/login');
        // Login as user001
        await page.getByPlaceholder('例: dev001').fill('user001');
        await page.getByPlaceholder('パスワードを入力してください').fill('password123');
        await page.getByRole('button', { name: 'ログインする' }).click();

        // Wait for dashboard to load
        await expect(page).toHaveURL(/\/my-dashboard/);

        // Sidebar should not have "組織管理"
        await expect(page.getByText('組織管理')).not.toBeVisible();

        // Direct access to /admin/organization should redirect to /my-dashboard
        await page.goto('/admin/organization');
        await expect(page).toHaveURL(/\/my-dashboard/);
    });
});
