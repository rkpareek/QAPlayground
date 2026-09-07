import { DocArticle } from '../types';

export const automationArticles: DocArticle[] = [
  {
    slug: 'automation/overview',
    title: 'Automation Hub & AST Architecture',
    description: 'Architecture of static TypeScript/JavaScript AST parsing, code-to-repository synchronization, and automated test entity models.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 1,
    keywords: ['automation', 'ast', 'parser', 'playwright', 'mocha', 'source files', 'sync', 'architecture'],
    lastUpdated: '2026-08-31',
    overview: 'The Automation Hub bridges automated test code in Git repositories with the TMS. Rather than relying solely on post-execution reporting, the system parses test source files via static AST analysis to identify test titles, nested suites, file paths, line numbers, and assigned `@T` / `@S` identifiers.',
    sections: [
      {
        id: 'automation-architecture',
        title: 'Static AST Parsing Architecture',
        content: 'When automated test files (.ts, .js, .spec.ts, .test.ts) are uploaded or synchronized via GitLab CI, the AST engine performs:\n\n1. **Lexical & Syntax Tokenization**: Traverses the AST for `describe(...)`, `test(...)`, `it(...)`, and annotations.\n2. **ID Extraction**: Identifies `@S########` in suite headers and `@T########` in test definitions.\n3. **Hierarchy Preservation**: Builds a nested tree of parent suites and child tests matching physical code structure.\n4. **Diffing Engine**: Compares incoming AST against existing database records to classify items as `new`, `existing`, `modified`, or `detached`.',
        callout: {
          type: 'important',
          title: 'Zero-Execution Parsing',
          content: 'Test files are statically analyzed without executing browser drivers or runtime code, ensuring fast, safe imports.',
        },
      },
      {
        id: 'supported-frameworks',
        title: 'Supported Test Frameworks',
        table: {
          headers: ['Framework', 'Parser Engine', 'Key Patterns'],
          rows: [
            ['Playwright Test', 'Native AST Parser', 'test("...", async ({ page }) => ...), test.describe(...)'],
            ['Mocha / Jest', 'BDD / TDD AST Parser', 'describe("...", () => ...), it("...", () => ...)'],
            ['Mocha + Playwright', 'Hybrid AST Parser', 'Mocha describe/it test runner combined with Playwright browser calls'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'automation/import',
      'automation/playwright',
      'automation/mocha',
      'automation/test-ids',
      'automation/suite-ids',
    ],
  },
  {
    slug: 'automation/test-ids',
    title: 'Test IDs (@T########) Specification',
    description: 'Rules, generation, and mapping mechanics of unique 8-digit @T test identifiers.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 2,
    keywords: ['test id', '@t', '@T########', 'identifier', 'mapping', 'unique id', 'generator'],
    lastUpdated: '2026-08-31',
    overview: 'Every automated test is mapped to a TMS test case via a unique `@T########` tag (e.g. `@T84920193`). This allows automated test runs in CI/CD to update the exact manual test case in the repository regardless of file renames or code refactoring.',
    sections: [
      {
        id: 'test-id-syntax',
        title: 'Test ID Syntax in Code',
        content: 'Place the `@T########` tag directly inside the test name string:',
        codeSnippet: {
          language: 'typescript',
          code: `// Playwright Spec Example\ntest('User can complete checkout with Credit Card @T84920193', async ({ page }) => {\n  await page.goto('/checkout');\n  // Test implementation...\n});\n\n// Mocha / Jest Example\nit('Returns 401 on expired bearer token @T10928374', async () => {\n  const res = await api.get('/accounts');\n  expect(res.status).to.equal(401);\n});`,
          caption: 'Adding @T IDs to test declarations',
        },
      },
      {
        id: 'id-mapping-rules',
        title: 'ID Mapping & Auto-Generation Rules',
        content: '- **Existing @T Found**: The importer maps the code test to the existing test case with that ID.\n- **No @T Present**: The importer flags the test as "New" and generates a fresh `@T########` ID upon import.\n- **Duplicate @T Detected**: Flagged as a duplicate collision during preview to prevent accidental overwrite.\n- **Detached @T**: If an ID exists in TMS but is removed from source code, it is categorized as "Detached" rather than being deleted.',
      },
    ],
    relatedSlugs: [
      'automation/suite-ids',
      'automation/synchronization',
      'automation/playwright',
    ],
  },
  {
    slug: 'automation/suite-ids',
    title: 'Suite IDs (@S########) Specification',
    description: 'Suite-level identification, hierarchy synchronization, and mapping describe() blocks.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 3,
    keywords: ['suite id', '@s', '@S########', 'describe', 'suite hierarchy', 'sync'],
    lastUpdated: '2026-08-31',
    overview: 'Like Test IDs, Test Suites utilize `@S########` tags to synchronize code-level `describe()` blocks with Test Repository Suites.',
    sections: [
      {
        id: 'suite-id-example',
        title: 'Suite ID Code Example',
        codeSnippet: {
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';\n\ntest.describe('Payment Gateway Integration @S83920194', () => {\n  test('Stripe 3DS Verification Flow @T92830192', async ({ page }) => {\n    // ...\n  });\n\n  test('PayPal Express Checkout Modal @T92830193', async ({ page }) => {\n    // ...\n  });\n});`,
          caption: 'Using @S in describe blocks',
        },
      },
    ],
    relatedSlugs: [
      'automation/test-ids',
      'automation/synchronization',
    ],
  },
  {
    slug: 'automation/import',
    title: 'Automation Import Workflow',
    description: 'Step-by-step guide to uploading automation files, previewing AST diffs, and syncing with the Test Repository.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 4,
    keywords: ['import', 'upload', 'ast diff', 'preview', 'sync repository', 'source upload'],
    lastUpdated: '2026-08-31',
    overview: 'The Import Wizard allows SDETs and developers to drag-and-drop spec files or folders to synchronize test cases into the TMS.',
    sections: [
      {
        id: 'import-steps',
        title: 'The 5-Step Import Pipeline',
        content: '1. **Select Framework**: Choose Playwright, Mocha, or Mocha+Playwright.\n2. **Upload Files**: Drag and drop `.ts`, `.js`, `.spec.ts` files or zip archive.\n3. **AST Parse & Tokenize**: System parses AST nodes and matches `@T` / `@S` IDs.\n4. **Review Import Preview**: Inspect categorized tabs (`New Tests`, `Modified Tests`, `Unchanged`, `Detached`).\n5. **Apply Sync**: Commit changes to update the Test Repository and generate updated source snippets with newly assigned `@T` IDs.',
      },
    ],
    relatedSlugs: [
      'automation/overview',
      'automation/playwright',
      'automation/mocha',
      'automation/synchronization',
    ],
  },
  {
    slug: 'automation/playwright',
    title: 'Playwright Test Integration',
    description: 'Best practices for organizing Playwright test suites, page objects, fixtures, and @T ID annotations.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 5,
    keywords: ['playwright', 'typescript', 'fixtures', 'page object', 'annotations', 'specs'],
    lastUpdated: '2026-08-31',
    overview: 'Playwright is fully supported with native parsing of `test()`, `test.describe()`, `test.step()`, and parameter matrices.',
    sections: [
      {
        id: 'playwright-example',
        title: 'Full Playwright Spec Example',
        codeSnippet: {
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';\n\ntest.describe('Authentication & 2FA @S20394819', () => {\n  test.beforeEach(async ({ page }) => {\n    await page.goto('/login');\n  });\n\n  test('Successful login with valid credentials @T10293847', async ({ page }) => {\n    await page.fill('#email', 'qa@company.com');\n    await page.fill('#password', 'SecretPassword123!');\n    await page.click('#submit-btn');\n    await expect(page).toHaveURL('/dashboard');\n  });\n\n  test('Account lockout after 5 failed attempts @T10293848', async ({ page }) => {\n    for (let i = 0; i < 5; i++) {\n      await page.fill('#email', 'lockout@company.com');\n      await page.fill('#password', 'WrongPass');\n      await page.click('#submit-btn');\n    }\n    await expect(page.locator('.alert-danger')).toContainText('Account locked');\n  });\n});`,
          caption: 'Playwright test suite with @S and @T annotations',
        },
      },
    ],
    relatedSlugs: [
      'automation/import',
      'automation/mocha',
      'automation/mocha-playwright',
    ],
  },
  {
    slug: 'automation/mocha',
    title: 'Mocha / Jest Test Integration',
    description: 'BDD describe/it patterns, nested suites, and TypeScript/JavaScript parsing.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 6,
    keywords: ['mocha', 'jest', 'bdd', 'describe', 'it', 'nested suites'],
    lastUpdated: '2026-08-31',
    overview: 'Mocha and Jest tests following BDD `describe` and `it` conventions are parsed with full support for nested suite trees.',
    sections: [
      {
        id: 'mocha-example',
        title: 'Mocha Spec Example',
        codeSnippet: {
          language: 'javascript',
          code: `const { expect } = require('chai');\n\ndescribe('Orders & Inventory API @S90182736', () => {\n  describe('Stock Reservation @S90182737', () => {\n    it('Decrements available quantity upon order placement @T49201928', async () => {\n      // Test logic...\n    });\n  });\n});`,
          caption: 'Mocha nested suites with @S and @T IDs',
        },
      },
    ],
    relatedSlugs: [
      'automation/playwright',
      'automation/mocha-playwright',
    ],
  },
  {
    slug: 'automation/mocha-playwright',
    title: 'Mocha + Playwright Hybrid Architecture',
    description: 'Understanding and configuring projects using Mocha as the test runner and Playwright for browser drivers.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 7,
    keywords: ['hybrid', 'mocha playwright', 'test runner', 'browser driver', 'architecture'],
    lastUpdated: '2026-08-31',
    overview: 'Many enterprise codebases use Mocha as the orchestration runner (`describe/it`) while driving browser sessions through the Playwright API.',
    sections: [
      {
        id: 'hybrid-breakdown',
        title: 'Runner vs. Browser Driver Separation',
        content: '- **Mocha (Test Runner)**: Manages test discovery, timeout execution, hooks (`before/after`), and reporting.\n- **Playwright (Browser Driver)**: Controls Chromium, WebKit, and Firefox instances and DOM interactions.',
        callout: {
          type: 'note',
          title: 'Parser Intelligence',
          content: 'The hybrid parser recognizes `describe/it` blocks while inspecting internal calls to `chromium.launch()`, `browser.newPage()`, or `page.goto()`.',
        },
      },
    ],
    relatedSlugs: [
      'automation/mocha',
      'automation/playwright',
    ],
  },
  {
    slug: 'automation/synchronization',
    title: 'Code Synchronization & Detached Tests',
    description: 'How the TMS diffs incoming AST trees against repository state, detects modifications, and manages detached tests.',
    category: 'automation',
    categoryTitle: 'Automation',
    order: 8,
    keywords: ['sync', 'detached tests', 'diff', 'ast diff', 'code hash', 're-import'],
    lastUpdated: '2026-08-31',
    overview: 'When automation files change over time, the synchronization engine keeps the TMS up-to-date without overwriting manual metadata.',
    sections: [
      {
        id: 'sync-categories',
        title: 'Synchronization Classifications',
        table: {
          headers: ['Category', 'Condition', 'System Action'],
          rows: [
            ['New Test', 'Test in code without @T ID or with unknown @T ID', 'Assigns new @T ID and creates test case in repository.'],
            ['Unchanged Test', 'Code title and AST hash match repository record exactly', 'No action needed; status confirmed active.'],
            ['Modified Test', 'Test case title or steps changed in code', 'Updates repository test case title while preserving historical runs.'],
            ['Detached Test', 'Test exists in repository with @T ID but missing in incoming code', 'Flags test as "Detached from automation"; repository case kept intact.'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'automation/import',
      'automation/test-ids',
    ],
  },
];
