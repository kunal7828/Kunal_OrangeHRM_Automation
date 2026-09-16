import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginCredentials } from '../types';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"], input[placeholder="Username"], input.oxd-input[name="username"]').first();
    this.passwordInput = page.locator('input[name="password"], input[placeholder="Password"], input.oxd-input[name="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button.oxd-button--main, button:has-text("Login")').first();
    this.errorMessage = page.locator('.oxd-alert-content-text, .oxd-text--alert, .oxd-alert--error').first();
    this.dashboardHeader = page.locator('h6.oxd-text, h6:has-text("Dashboard"), .oxd-topbar-header-title').first();
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.navigateToLogin();
    await this.fillInput(this.usernameInput, credentials.username);
    await this.fillInput(this.passwordInput, credentials.password);
    await this.clickElement(this.loginButton);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(2000);
  }

  async verifyLoginSuccess(): Promise<void> {
    await expect(this.dashboardHeader).toContainText('Dashboard', { timeout: 30000 });
  }

  async verifyLoginError(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toContainText(expectedMessage, { timeout: 5000 });
  }

  async isLoginPageLoaded(): Promise<boolean> {
    try {
      await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
      await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}