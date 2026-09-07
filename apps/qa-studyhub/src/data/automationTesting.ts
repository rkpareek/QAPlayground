export const AUTOMATION_FUNDAMENTALS = {
  whatIs: 'Automation testing is the practice of using software testing tools to execute pre-scripted test suites automatically against an application, comparing actual outcomes with expected outcomes without continuous human intervention.',
  whatIsHinglish: 'Automation Testing ek aisi technique hai jisme testing tools aur scripts ka use karke test cases ko automatically run kiya jaata hai, aur bina kisi human intervention ke actual vs expected results compare hote hain.',
  whyAutomate: 'To speed up repetitive regression test cycles, execute tests across multiple browsers/devices concurrently, provide rapid feedback to developers upon code check-ins, and free human testers to focus on exploratory, usability, and complex edge-case testing.',
  whyAutomateHinglish: 'Repetitive regression tests ko fast execute karne, alag-alag browsers par parallel test chalane, developers ko instant CI/CD feedback dene aur human testers ko exploratory testing par focus karne ka time dene ke liye.',
  advantages: [
    'Fast execution speed (thousands of assertions in minutes).',
    'High consistency and zero human fatigue during repetitive checks.',
    'Easy integration with CI/CD build pipelines for continuous quality gates.',
    'Excellent for data-driven testing (running one scenario with 1,000 distinct input rows).'
  ],
  advantagesHinglish: [
    'Fast execution speed (hazaron test checks kuch hi minutes mein).',
    'Har baar consistent result aur repetitive checks mein zero human fatigue.',
    'CI/CD pipelines ke sath easy integration continuous testing ke liye.',
    'Data-driven testing ke liye perfect (1000 alag-alag inputs ke sath single test run karna).'
  ],
  limitations: [
    'High initial framework setup and maintenance cost.',
    'Cannot test human visual aesthetics, user feel, or intuitive UX layout.',
    'Flakiness due to dynamic page rendering or network latency if locators/waits are fragile.',
    'Scripts only test what they are programmed for; they cannot catch unexpected visual defects.'
  ],
  limitationsHinglish: [
    'Shuruat mein framework banane aur maintain karne ki high cost.',
    'Human visual feel, aesthetic layout aur usability judge nahi kar sakta.',
    'Network latency ya dynamic loading ki wajah se flaky tests hona.',
    'Scripts sirf wahi test karti hain jo likha gaya hai; unexpected visual flaws nahi pakad sakti.'
  ]
};

export const WHAT_TO_AUTOMATE_MATRIX = [
  {
    category: 'High Priority for Automation (YES)',
    categoryHinglish: 'Automation ke liye High Priority (YES)',
    items: [
      'Repetitive Regression test suites that run on every release build.',
      'Critical Smoke & Sanity test suites needed for CI build verification.',
      'Data-Driven scenarios requiring hundreds of different input combinations.',
      'REST APIs and backend services with stable contracts.',
      'Complex mathematical calculations and multi-step business transactions.'
    ],
    itemsHinglish: [
      'Repetitive Regression tests jo har release build par chalte hain.',
      'Critical Smoke aur Sanity tests jo CI build pass karne ke liye zaroori hain.',
      'Data-driven scenarios jahan 100+ input combinations test karne hon.',
      'REST APIs aur backend microservices jinke endpoints stable hain.',
      'Complex mathematical calculations aur multi-step transactions.'
    ],
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    category: 'Generally Should NOT Be Automated (NO)',
    categoryHinglish: 'Automation mein avoid karein (NO)',
    items: [
      'Newly introduced features with volatile, frequently changing UI/UX.',
      'Ad-hoc and Exploratory testing sessions relying on human curiosity.',
      'Usability, aesthetic appeal, font pairing, and visual layout testing.',
      'One-time or rarely executed test cases where writing scripts costs more than manual execution.',
      'Features with complex hardware interactions or third-party CAPTCHA.'
    ],
    itemsHinglish: [
      'Naye features jinki UI/UX har roz change ho rahi ho.',
      'Ad-hoc aur Exploratory testing jo tester ki human curiosity par depend kare.',
      'Usability, look-and-feel, typography aur design aesthetic testing.',
      'One-time run hone wale test cases jinko code karne mein manual se zyada time lage.',
      'Third-party CAPTCHA ya dynamic hardware interaction wale features.'
    ],
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  }
];

export const AUTOMATION_TOOLS_LIST = [
  {
    name: 'Playwright',
    creator: 'Microsoft',
    languages: 'TypeScript, JavaScript, Python, Java, C#',
    whatItIs: 'Modern, ultra-fast end-to-end testing library supporting all modern rendering engines (Chromium, WebKit/Safari, Firefox).',
    whatItIsHinglish: 'Microsoft ka modern, ultra-fast E2E testing framework jo Chromium, WebKit/Safari aur Firefox sabhi ko natively support karta hai.',
    mainUse: 'Modern web app UI testing, API testing, visual comparisons, and cross-browser automation.',
    mainUseHinglish: 'Modern web UI testing, API testing, visual regression aur cross-browser automation.',
    basicIdea: 'Communicates directly with browser devtools protocols; features built-in auto-waiting, network mocking, and powerful trace viewer tools without flaky sleeps.',
    basicIdeaHinglish: 'Browser devtools protocol se direct communicate karta hai; isme auto-waiting, network mocking aur trace viewer inbuilt hain.',
    badge: 'Trending & Modern'
  },
  {
    name: 'Selenium WebDriver',
    creator: 'Open Source / W3C Standard',
    languages: 'Java, Python, C#, JavaScript, Ruby',
    whatItIs: 'The industry-standard, time-tested browser automation tool backed by the W3C WebDriver specification.',
    whatItIsHinglish: 'Industry ka sabse purana aur time-tested browser automation standard jo W3C specification par based hai.',
    mainUse: 'Enterprise-scale cross-browser UI automation across legacy and modern platforms.',
    mainUseHinglish: 'Enterprise-level cross-browser UI automation bade systems ke liye.',
    basicIdea: 'Uses browser-specific drivers to automate browser actions. Highly flexible with huge ecosystem support and Grid parallelization.',
    basicIdeaHinglish: 'Browser drivers ke through browser controls operate karta hai. Bohot bada ecosystem aur Grid support hai.',
    badge: 'Industry Standard'
  },
  {
    name: 'Cypress',
    creator: 'Cypress.io',
    languages: 'JavaScript, TypeScript',
    whatItIs: 'Frontend developer & QA-friendly testing framework executing directly inside the browser run-loop alongside the application.',
    whatItIsHinglish: 'Frontend developers aur QA ke liye banaya gaya framework jo direct browser ke run-loop ke andar chalta hai.',
    mainUse: 'Single Page Application (SPA) component and end-to-end integration testing.',
    mainUseHinglish: 'Single Page Applications (React, Vue) ke component aur E2E testing ke liye.',
    basicIdea: 'Runs inside the browser; provides instant time-travel debugging, DOM snapshots, and automatic reloading.',
    basicIdeaHinglish: 'Direct browser mein run hota hai; time-travel debugging aur instant DOM snapshots provide karta hai.',
    badge: 'Developer Friendly'
  },
  {
    name: 'WebdriverIO',
    creator: 'OpenJS Foundation',
    languages: 'JavaScript, TypeScript',
    whatItIs: 'Customizable test automation framework for both web browser automation and native mobile app testing (via Appium).',
    whatItIsHinglish: 'Customizable test framework jo web browsers aur native mobile apps (Appium ke sath) dono ko test kar sakta hai.',
    mainUse: 'Unified web, hybrid, and native mobile testing under one Node.js stack.',
    mainUseHinglish: 'Node.js stack par Web aur Mobile (Android/iOS) testing ek sath karne ke liye.',
    basicIdea: 'Combines WebDriver and Chrome DevTools protocols with extensive plugin ecosystem.',
    basicIdeaHinglish: 'WebDriver aur Chrome DevTools protocols ko combine karke plugins ke sath powerful automation deta hai.',
    badge: 'Mobile + Web'
  }
];

export const FRAMEWORK_COMPONENTS = [
  {
    name: 'Page Object Model (POM)',
    role: 'Separates test logic from UI locators by creating dedicated page classes containing element locators and user action methods (e.g., `LoginPage.ts`, `CheckoutPage.ts`).',
    roleHinglish: 'Test logic ko UI locators se alag rakhne ke liye dedicated Page Classes banata hai (jaise `LoginPage.ts`, `DashboardPage.ts`).'
  },
  {
    name: 'Test Runner & Suite Manager',
    role: 'Orchestrates test execution, parallel workers, test retries, filtering by tags (`@smoke`, `@regression`), and hooks (e.g., Mocha, Jest, Playwright Test, TestNG).',
    roleHinglish: 'Test execution control karta hai (parallel execution, retries, `@smoke` tags aur execution hooks).'
  },
  {
    name: 'Locators & Selectors',
    role: 'Methods to find DOM elements reliably (e.g., `getByRole()`, `getByTestId()`, `data-testid`, CSS selectors, XPath).',
    roleHinglish: 'Web page ke elements ko reliably locate karne ke methods (jaise `getByRole`, `data-testid`, CSS, XPath).'
  },
  {
    name: 'Assertion Library',
    role: 'Validates expected conditions and fails tests with clear diagnostic logs (e.g., `expect(page).toHaveTitle()`, Chai, AssertJ).',
    roleHinglish: 'Expected conditions check karta hai aur fail hone par detailed error logs provide karta hai.'
  },
  {
    name: 'Test Data Management',
    role: 'Stores and supplies external test data from JSON, CSV, Excel, or environment variables to parameterize test executions.',
    roleHinglish: 'External files (JSON, CSV, Excel) ya environment variables se test data feed karta hai.'
  },
  {
    name: 'Utilities & Helpers',
    role: 'Reusable helper functions for date formatting, database queries, random string generation, and token acquisition.',
    roleHinglish: 'Reusable helper functions jaise database queries, token generate karna aur random test string banana.'
  },
  {
    name: 'Reporting & Logs',
    role: 'Generates visual test execution reports with execution timestamps, pass/fail charts, error logs, screenshots on failure, and trace recordings (e.g., Allure, HTML Report).',
    roleHinglish: 'Visual HTML/Allure reports generate karta hai jisme pass/fail charts, logs aur failure screenshots hote hain.'
  }
];

export const CICD_FOR_QA = {
  whatIsCI: 'Continuous Integration (CI) is a DevOps practice where developers frequently merge code commits into a central repository, triggering automated builds and test suites to detect integration errors immediately.',
  whatIsCIHinglish: 'Continuous Integration (CI) ek DevOps practice hai jisme developers code commit karte hain aur turant automated builds aur test suites trigger hokar bugs detect karte hain.',
  whatIsCD: 'Continuous Delivery / Deployment (CD) automatically packages and deploys verified builds to staging or production environments once all pipeline test stages pass.',
  whatIsCDHinglish: 'Continuous Delivery / Deployment (CD) verified builds ko automatically staging ya production par deploy karta hai jab saare pipeline tests pass ho jaate hain.',
  qaPipelineRole: [
    'Automated Smoke Tests execute on every Pull Request (PR) to block broken code from merging.',
    'Full Regression Suites run automatically on nightly or staging deployments.',
    'Test reports and coverage metrics are published directly in the CI dashboard (Jenkins, GitHub Actions, GitLab CI).',
    'Slack or email alerts notify the team immediately if a critical test fails in the pipeline.'
  ],
  qaPipelineRoleHinglish: [
    'Har Pull Request (PR) par automated Smoke Tests run hote hain taaki broken code merge na ho sake.',
    'Nightly aur Staging deployment par Full Regression Suites automatically execute hoti hain.',
    'Test execution reports aur coverage metrics CI dashboard (GitHub Actions, Jenkins) par publish hote hain.',
    'Pipeline mein koi critical test fail hone par turant Slack/Email notification trigger hoti hai.'
  ]
};
