import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async waitForElement(locator: Locator, timeout = 15000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickElement(locator: Locator, timeout = 15000): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.click();
  }

  async fillInput(locator: Locator, value: string, timeout = 15000): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.clear();
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent())?.trim() || '';
  }

  async isVisible(locator: Locator, timeout = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async selectDropdownOption(locator: Locator, optionText: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
    await this.page.locator(`//span[text()="${optionText}"]`).click();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}