// pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/') {
    
    await this.page.goto(path, { 
      // 改用 'commit' 策略：伺服器一有回應就立刻繼續，不被慢速的廣告與 DOM 載入卡住
      waitUntil: 'commit',
      //waitUntil: 'domcontentloaded',
      timeout: 60000 
    });

    // 手動等待 <body> 標籤出現，確保頁面基本元素已存在
    await this.page.locator('body').waitFor({ state: 'attached', timeout: 30000 });
  }

  private async dismissConsentBanner() {
    try {
      // 1. 嘗試點擊 "Consent" 同意按鈕
      const consentBtn = this.page.locator('.fc-consent-root button.fc-cta-consent');
      if (await consentBtn.isVisible({ timeout: 3000 })) {
        await consentBtn.click();
      }
    } catch {
      // 2. 如果沒有按鈕或超時，直接強制從 DOM 移除整個彈窗 DOM 節點
      await this.page.evaluate(() => {
        const consentRoot = document.querySelector('.fc-consent-root');
        if (consentRoot) consentRoot.remove();
      });
    }
  }
}