import { test, expect } from '@playwright/test';

test.describe('Study Hub', () => {
  test('loads and shows onboarding', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to Study Hub');
  });

  test('can navigate through onboarding steps', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Profile
    await page.fill('#onboard-name', 'Test User');
    await page.fill('#onboard-major', 'Computer Science');
    await page.click('#next-btn');
    
    // Step 2: Subjects
    await page.click('[data-subject="Mathematics"]');
    await page.click('[data-subject="Physics"]');
    await page.click('[data-subject="Chemistry"]');
    await page.click('#next-btn');
    
    // Step 3: First Goal
    await page.fill('#goal-title', 'Ace Calculus');
    await page.selectOption('#goal-subject', 'math');
    await page.click('#complete-btn');
    
    // Should redirect to today
    await expect(page.locator('#page-title')).toContainText('Today');
  });

  test('can switch tabs', async ({ page }) => {
    await page.goto('/');
    
    // Complete onboarding first
    await page.fill('#onboard-name', 'Test');
    await page.fill('#onboard-major', 'CS');
    await page.click('#next-btn');
    await page.click('[data-subject="Mathematics"]');
    await page.click('[data-subject="Physics"]');
    await page.click('[data-subject="Chemistry"]');
    await page.click('#next-btn');
    await page.fill('#goal-title', 'Test Goal');
    await page.selectOption('#goal-subject', 'math');
    await page.click('#complete-btn');
    
    // Navigate tabs
    await page.click('[data-tab="plan"]');
    await expect(page.locator('h1')).toContainText('Plan');
    
    await page.click('[data-tab="learn"]');
    await expect(page.locator('h1')).toContainText('Learn');
    
    await page.click('[data-tab="notes"]');
    await expect(page.locator('h1')).toContainText('Notes');
  });
});