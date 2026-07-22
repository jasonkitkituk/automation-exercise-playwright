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
}

export class SignupPage extends BasePage {
  readonly mrRadio: Locator;
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
  readonly mobileNumberInput: Locator;
  readonly createAccountBtn: Locator;

  readonly accountCreatedHeader: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.mrRadio = page.locator('#id_gender1');
    this.passwordInput = page.locator('#password');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');

    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.addressInput = page.locator('#address1');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });

    this.accountCreatedHeader = page.locator('h2[data-qa="account-created"]');
    this.continueBtn = page.locator('[data-qa="continue-button"]');
    // 確保使用 data-qa 定位器
    this.createAccountBtn = page.locator('button[data-qa="create-account"]');
    
  }

  async fillAccountDetails(details: Record<string, string>) {
    await this.mrRadio.check();
    await this.passwordInput.fill(details.password);
    await this.daysSelect.selectOption('10');
    await this.monthsSelect.selectOption('May');
    await this.yearsSelect.selectOption('1995');

    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.countrySelect.selectOption('United States');
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobile);

    await this.createAccountBtn.click();

    // 1. 先將視角滾動到按鈕位置，確保按鈕在可視範圍內
    await this.createAccountBtn.scrollIntoViewIfNeeded();

    // 2. 加上 { force: true } 強制穿透覆蓋在按鈕上的透明廣告或 Cookie 彈窗
    await this.createAccountBtn.click({ force: true });

    
  }

  async verifyAccountCreated() {
    await expect(this.accountCreatedHeader).toBeVisible();
    await this.continueBtn.click();
  }
}