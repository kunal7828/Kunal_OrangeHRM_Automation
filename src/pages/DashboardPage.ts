import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;
  readonly loginPageHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.locator('a:has-text("Logout"), a:has-text("登出"), a:has-text("退出")');
    this.loginPageHeader = page.locator('h5:has-text("Login"), h5:has-text("登录")');
  }

  async logout(): Promise<void> {
    await this.clickElement(this.userDropdown);
    await this.clickElement(this.logoutButton);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(2000);
  }

  async verifyLogoutSuccess(): Promise<void> {
    await expect(this.loginPageHeader).toBeVisible({ timeout: 10000 });
  }

  async isDashboardLoaded(): Promise<boolean> {
    const header = this.page.locator('h6.oxd-text:has-text("Dashboard")');
    return await this.isVisible(header);
  }
}