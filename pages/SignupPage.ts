// pages/SignupPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AccountDetails {
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
  country?: string;
}

export class SignupPage extends BasePage {
  readonly titleMrRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountBtn: Locator;
  readonly accountCreatedHeader: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    // 選擇 Title (Mr.)
    this.titleMrRadio = page.locator('#id_gender1');
    this.passwordInput = page.locator('input[data-qa="password"]');
    
    // 生日下拉選單
    this.daysSelect = page.locator('select[data-qa="days"]');
    this.monthsSelect = page.locator('select[data-qa="months"]');
    this.yearsSelect = page.locator('select[data-qa="years"]');

    this.firstNameInput = page.locator('input[data-qa="first_name"]');
    this.lastNameInput = page.locator('input[data-qa="last_name"]');
    this.addressInput = page.locator('input[data-qa="address"]');
    this.countrySelect = page.locator('select[data-qa="country"]');
    this.stateInput = page.locator('input[data-qa="state"]');
    this.cityInput = page.locator('input[data-qa="city"]');
    this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
    this.mobileInput = page.locator('input[data-qa="mobile_number"]');
    
    this.createAccountBtn = page.locator('button[data-qa="create-account"]');
    this.accountCreatedHeader = page.locator('h2[data-qa="account-created"]');
    this.continueBtn = page.locator('a[data-qa="continue-button"]');
  }

  async fillAccountDetails(details: AccountDetails) {
    // 1. 勾選 Title (必填)
    await this.titleMrRadio.check({ force: true });

    // 2. 填寫密碼
    await this.passwordInput.fill(details.password);

    // 3. 選擇生日 (避免部分瀏覽器對 Date 的驗證)
    await this.daysSelect.selectOption('10');
    await this.monthsSelect.selectOption('5');
    await this.yearsSelect.selectOption('1995');

    // 4. 填寫地址與個人資料
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    
    // 國家選單
    if (details.country) {
      await this.countrySelect.selectOption(details.country);
    } else {
      await this.countrySelect.selectOption('United States');
    }

    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileInput.fill(details.mobile);

    // 5. 滾動並送出
    await this.createAccountBtn.scrollIntoViewIfNeeded();
    await this.createAccountBtn.click({ force: true });
  }

  async verifyAccountCreated() {
    // 等待跳轉至 ACCOUNT CREATED! 頁面
    await expect(this.accountCreatedHeader).toBeVisible({ timeout: 20000 });
    
    // 點擊 Continue
    await this.continueBtn.click({ force: true });
  }
}