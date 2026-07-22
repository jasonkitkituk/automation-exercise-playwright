// pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/') {
    
    await this.page.goto(path, { 
      //Use'commit' strategy: continue immediately as soon as the server responds, avoiding being stuck by slow ads and DOM loading.
      waitUntil: 'commit',
      //waitUntil: 'domcontentloaded',
      timeout: 60000 
    });

    //Manually wait for the `<body>` tag to appear to ensure that the basic page elements exist.
    await this.page.locator('body').waitFor({ state: 'attached', timeout: 30000 });
  }

  private async dismissConsentBanner() {
    try {
      // Try clicking the "Consent" button to agree.
      const consentBtn = this.page.locator('.fc-consent-root button.fc-cta-consent');
      if (await consentBtn.isVisible({ timeout: 3000 })) {
        await consentBtn.click();
      }
    } catch {
      //If there is no button or a timeout occurs, forcibly remove the entire popup DOM node from the DOM.
      await this.page.evaluate(() => {
        const consentRoot = document.querySelector('.fc-consent-root');
        if (consentRoot) consentRoot.remove();
      });
    }
  }

  async handleConsentModal() {
    try {
      //Find the "Agree" button in the GDPR Consent pop-up and click it.
      const consentBtn = this.page.locator('.fc-consent-root .fc-button-label, button:has-text("Consent"), button:has-text("AGREE")');
      if (await consentBtn.first().isVisible({ timeout: 3000 })) {
        await consentBtn.first().click();
      }
    } catch {
      //If no pop-up appears, skip silently.
    }
  }
}