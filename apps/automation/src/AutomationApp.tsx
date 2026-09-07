import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, Sparkles, Layers } from 'lucide-react';

export const AutomationApp: React.FC = () => {
  const [framework, setFramework] = useState<'playwright' | 'selenium' | 'cypress'>('playwright');
  const [pageName, setPageName] = useState('CheckoutPage');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    if (framework === 'playwright') {
      return `import { Page, Locator, expect } from '@playwright/test';

export class ${pageName} {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly discountInput: Locator;
  readonly applyDiscountBtn: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart-item');
    this.discountInput = page.locator('input[placeholder="Promo code"]');
    this.applyDiscountBtn = page.locator('button:has-text("Apply")');
    this.checkoutBtn = page.locator('button:has-text("Proceed to Simulated Checkout")');
  }

  async applyCoupon(coupon: string) {
    await this.discountInput.fill(coupon);
    await this.applyDiscountBtn.click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }
}`;
    }

    if (framework === 'selenium') {
      return `import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class ${pageName} {
    private WebDriver driver;

    private By discountInput = By.xpath("//input[@placeholder='Promo code']");
    private By applyDiscountBtn = By.xpath("//button[contains(text(),'Apply')]");
    private By checkoutBtn = By.xpath("//button[contains(text(),'Proceed')]");

    public ${pageName}(WebDriver driver) {
        this.driver = driver;
    }

    public void applyCoupon(String coupon) {
        driver.findElement(discountInput).sendKeys(coupon);
        driver.findElement(applyDiscountBtn).click();
    }

    public void proceedToCheckout() {
        driver.findElement(checkoutBtn).click();
    }
}`;
    }

    return `export class ${pageName} {
  get discountInput() { return cy.get('input[placeholder="Promo code"]'); }
  get applyDiscountBtn() { return cy.contains('button', 'Apply'); }
  get checkoutBtn() { return cy.contains('button', 'Proceed to Simulated Checkout'); }

  applyCoupon(coupon) {
    this.discountInput.type(coupon);
    this.applyDiscountBtn.click();
  }

  proceedToCheckout() {
    this.checkoutBtn.click();
  }
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Automation Playground & POM Generator
            </h1>
            <p className="text-xs text-slate-500">
              Generate Page Object Model classes and locator patterns for Playwright, Selenium, and Cypress
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFramework('playwright')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  framework === 'playwright'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Playwright (TypeScript)
              </button>
              <button
                onClick={() => setFramework('selenium')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  framework === 'selenium'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Selenium (Java)
              </button>
              <button
                onClick={() => setFramework('cypress')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  framework === 'cypress'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Cypress (JavaScript)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Class Name:</label>
              <input
                type="text"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-purple-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {getCode()}
          </pre>
        </div>
      </div>
    </div>
  );
};
