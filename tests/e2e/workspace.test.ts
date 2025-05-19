import { test, expect } from '@playwright/test';

test.describe('Workspace Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:6601/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('http://localhost:6601/dashboard');
  });

  test('create new workspace', async ({ page }) => {
    // Click create workspace button
    await page.click('button:has-text("New Workspace")');
    
    // Fill in the form
    await page.fill('input[name="name"]', 'Test Workspace');
    await page.fill('input[name="apiKey"]', 'test-api-key');
    
    // Submit form
    await page.click('button:has-text("Create Workspace")');
    
    // Verify workspace appears
    await expect(page.locator('text=Test Workspace')).toBeVisible();
  });

  test('open terminal', async ({ page }) => {
    // Assuming a workspace exists
    await page.click('button:has-text("Open Terminal")');
    
    // Verify terminal page loads
    await expect(page).toHaveURL(/.*\/terminal\/.*/);
    await expect(page.locator('.xterm')).toBeVisible();
  });

  test('delete workspace', async ({ page }) => {
    // Click delete button
    await page.click('button[aria-label="Delete workspace"]');
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")');
    
    // Verify workspace is removed
    await expect(page.locator('text=Test Workspace')).not.toBeVisible();
  });

  test('navigate to billing', async ({ page }) => {
    await page.click('button:has-text("Billing")');
    
    await expect(page).toHaveURL('http://localhost:6601/billing');
    await expect(page.locator('text=Choose Your Plan')).toBeVisible();
  });
});