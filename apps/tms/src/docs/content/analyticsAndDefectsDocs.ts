import { DocArticle } from '../types';

export const analyticsArticles: DocArticle[] = [
  {
    slug: 'analytics/overview',
    title: 'Quality Analytics & Metrics',
    description: 'Executive dashboards, test velocity, automation coverage, pass rates, and duration trends.',
    category: 'analytics',
    categoryTitle: 'Reporting & Analytics',
    order: 1,
    keywords: ['analytics', 'charts', 'metrics', 'velocity', 'coverage', 'pass rate', 'trends'],
    lastUpdated: '2026-08-31',
    overview: 'The Analytics module aggregates data across all test repository cases, test runs, automated AST imports, and XML result ingestions.',
    sections: [
      {
        id: 'analytics-charts',
        title: 'Core Analytics Reports',
        content: '- **Automation Coverage by Suite**: Bar and donut breakdowns of manual vs. automated tests.\n- **Test Execution Velocity**: Daily and weekly execution counts across squads.\n- **Pass / Fail / Blocked Distributions**: Trend lines highlighting stability changes over consecutive sprints.\n- **Execution Duration Trends**: Average test run completion times.',
      },
    ],
    relatedSlugs: [
      'analytics/test-case-analytics',
      'analytics/flaky-tests',
      'analytics/traceability',
    ],
  },
  {
    slug: 'analytics/test-case-analytics',
    title: 'Test Case & Repository Analytics',
    description: 'Analyze repository health, obsolete test detection, priority distributions, and type breakdowns.',
    category: 'analytics',
    categoryTitle: 'Reporting & Analytics',
    order: 2,
    keywords: ['test case analytics', 'repository health', 'priority split', 'obsolete tests'],
    lastUpdated: '2026-08-31',
    overview: 'Insights into test suite distribution, tests that have never been executed, and test priority balance.',
    sections: [
      {
        id: 'health-metrics',
        title: 'Repository Health Indicators',
        content: 'Identify gaps in testing coverage:\n- **Never Executed Cases**: Test cases drafted but never included in an active run.\n- **Stale Tests**: Tests not modified or executed in over 90 days.\n- **Priority Pyramid**: Ensure critical/high priority tests are prioritized for automation.',
      },
    ],
    relatedSlugs: [
      'analytics/overview',
      'analytics/flaky-tests',
    ],
  },
  {
    slug: 'analytics/flaky-tests',
    title: 'Flaky Test Detection & Signals',
    description: 'Identify unstable tests with alternating pass/fail flip rates across recent execution cycles.',
    category: 'analytics',
    categoryTitle: 'Reporting & Analytics',
    order: 3,
    keywords: ['flaky', 'flakiness', 'unstable', 'flip rate', 'quality signals'],
    lastUpdated: '2026-08-31',
    overview: 'Flaky tests introduce noise into CI/CD pipelines. The TMS calculates flip-rate heuristics by analyzing test verdict flip sequences (PASS -> FAIL -> PASS) within a rolling 10-run window.',
    sections: [
      {
        id: 'flaky-algorithm',
        title: 'How Flakiness is Calculated',
        content: 'A test case is flagged with a high flakiness score when its execution status alternates frequently between PASS and FAIL on the same commit branch or without code modifications.',
        callout: {
          type: 'warning',
          title: 'Quality Signal, Not Absolute Proof',
          content: 'Flaky flags serve as triage signals for engineering squads to investigate timing issues, race conditions, or unmocked external dependencies.',
        },
      },
    ],
    relatedSlugs: [
      'analytics/overview',
      'test-execution/test-runs',
    ],
  },
  {
    slug: 'analytics/traceability',
    title: 'Traceability Matrix & Compliance',
    description: 'Bidirectional traceability from Requirements to Test Cases, Test Runs, and Linked Defects.',
    category: 'analytics',
    categoryTitle: 'Reporting & Analytics',
    order: 4,
    keywords: ['traceability', 'matrix', 'compliance', 'audit', 'requirements coverage', 'defects'],
    lastUpdated: '2026-08-31',
    overview: 'The Traceability Matrix connects User Requirements to verifying Test Cases, active Test Runs, and outstanding Defects.',
    sections: [
      {
        id: 'traceability-flow',
        title: 'The Traceability Chain',
        content: 'Requirement (User Story) -> Test Case (@T...) -> Test Run Execution -> Verdict -> Defect Record (DEF-...).',
      },
    ],
    relatedSlugs: [
      'requirements-defects/requirements',
      'requirements-defects/defects',
    ],
  },
];

export const requirementsDefectsArticles: DocArticle[] = [
  {
    slug: 'requirements-defects/requirements',
    title: 'Requirements & User Stories',
    description: 'Manage functional requirements, assign test cases, and track coverage status.',
    category: 'requirements-defects',
    categoryTitle: 'Requirements & Defects',
    order: 1,
    keywords: ['requirements', 'user stories', 'coverage', 'jira', 'specifications'],
    lastUpdated: '2026-08-31',
    overview: 'Requirements represent functional specifications or user stories that require QA verification.',
    sections: [
      {
        id: 'requirement-fields',
        title: 'Requirement Properties',
        table: {
          headers: ['Field', 'Description', 'Example'],
          rows: [
            ['Key', 'Identifier', 'REQ-101'],
            ['Title', 'Summary of requirement', 'User can authenticate with OAuth 2.0 Google Sign-In'],
            ['Category', 'Domain classification', 'Authentication & Security'],
            ['Status', 'Implementation state', 'Draft, Active, Implemented, Deprecated'],
            ['Coverage Status', 'Calculated testing coverage', 'Covered (3 tests) / Uncovered (0 tests)'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'requirements-defects/defects',
      'analytics/traceability',
    ],
  },
  {
    slug: 'requirements-defects/defects',
    title: 'Defect Tracking & Failure Context',
    description: 'Log defects directly from execution failures, manage defect lifecycles, and track resolutions.',
    category: 'requirements-defects',
    categoryTitle: 'Requirements & Defects',
    order: 2,
    keywords: ['defects', 'bugs', 'issues', 'failure context', 'repro steps', 'severity'],
    lastUpdated: '2026-08-31',
    overview: 'Defects represent bugs or discrepancies discovered during manual or automated test execution.',
    sections: [
      {
        id: 'defect-creation',
        title: 'Creating Defects from Test Runs',
        content: 'When a test step fails in the Execution Cockpit, click **Create Defect**. The system automatically pulls:\n- Test Case Title and ID\n- Failed Step Number and Expected vs. Actual Result\n- Environment, Browser, and Timestamp\n- Active Tester Name',
      },
      {
        id: 'defect-lifecycle',
        title: 'Defect Lifecycle States',
        content: '`Open` -> `In Progress` -> `Resolved` (Queued for Retest) -> `Closed` (Verified by QA) or `Rejected`.',
      },
    ],
    relatedSlugs: [
      'test-execution/execution-cockpit',
      'test-execution/retesting',
      'requirements-defects/requirements',
    ],
  },
];
