import { DocArticle } from '../types';

export const testPlanningArticles: DocArticle[] = [
  {
    slug: 'test-planning/test-plans',
    title: 'Test Plans & Milestones',
    description: 'Structure comprehensive testing plans with release milestones, objectives, entry/exit criteria, and risk assessments.',
    category: 'test-planning',
    categoryTitle: 'Test Planning',
    order: 1,
    keywords: ['test plan', 'milestone', 'release', 'scope', 'entry criteria', 'exit criteria', 'risks'],
    lastUpdated: '2026-08-31',
    overview: 'A Test Plan defines the testing blueprint for a specific software release, major milestone, or compliance certification cycle.',
    whenToUse: 'Create a Test Plan prior to starting a release cycle (e.g. "Release 2.4 - Payment Orchestration") to organize test scopes, assign owners, and track overall progress.',
    howItWorks: 'Test Plans link multiple Test Runs and track overall readiness against defined exit criteria.',
    sections: [
      {
        id: 'plan-structure',
        title: 'Anatomy of a Test Plan',
        table: {
          headers: ['Field', 'Purpose', 'Example'],
          rows: [
            ['Name & Key', 'Human-readable title and code', 'Sprint 42 Regression Plan (PLAN-0042)'],
            ['Target Release', 'Target release version or milestone', 'v2.4.0-RC1'],
            ['Status', 'Lifecycle state', 'Draft, Active, In Progress, Completed, Archived'],
            ['Scope Selection', 'Suites and test cases included', 'All Smoke + Auth + Payment Suites'],
            ['Environments', 'Target test environments', 'Staging, Pre-Prod'],
            ['Entry & Exit Criteria', 'Quality gates required to start/finish', '0 Blocker defects, 95% pass rate'],
            ['Risk Assessment', 'Documented project risks', 'Payment API sandbox instability'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'test-planning/scope-selection',
      'test-planning/environments',
      'test-execution/test-runs',
    ],
  },
  {
    slug: 'test-planning/scope-selection',
    title: 'Test Scope & Selection Strategies',
    description: 'Select tests by suite hierarchy, priority filters, automated tags, or custom dynamic queries.',
    category: 'test-planning',
    categoryTitle: 'Test Planning',
    order: 2,
    keywords: ['scope', 'selection', 'filtering', 'suites', 'test picker', 'dynamic query'],
    lastUpdated: '2026-08-31',
    overview: 'Scope selection determines which test cases from the repository are bundled into the plan and instantiated in associated test runs.',
    sections: [
      {
        id: 'selection-modes',
        title: 'Scope Selection Methods',
        content: '1. **Full Repository**: Include all active, non-archived test cases in the project.\n2. **Selective Suite Picking**: Check specific suites and sub-folders (e.g., Only "Authentication" and "Billing").\n3. **Tag-Based Filter**: Select all tests tagged `#smoke` or `#p0-critical`.\n4. **Automation Only**: Filter for tests ready for CI/CD automated pipeline execution.',
      },
    ],
    relatedSlugs: [
      'test-planning/test-plans',
      'test-management/test-suites',
    ],
  },
  {
    slug: 'test-planning/environments',
    title: 'Environments & Configuration Matrices',
    description: 'Configure target deployment tiers and cross-platform matrix combinations for testing.',
    category: 'test-planning',
    categoryTitle: 'Test Planning',
    order: 3,
    keywords: ['environments', 'configurations', 'matrix', 'cross-browser', 'staging', 'production'],
    lastUpdated: '2026-08-31',
    overview: 'Environments represent the deployment servers (Development, Staging, UAT, Production), while Configurations represent the client matrix (Chrome, Firefox, Safari iOS, Android App).',
    sections: [
      {
        id: 'matrix-execution',
        title: 'Matrix Execution Planning',
        content: 'When planning a multi-platform release, you can create linked test runs for each configuration (e.g. Run A for Chrome Desktop on Staging, Run B for Safari Mobile on Staging).',
      },
    ],
    relatedSlugs: [
      'test-planning/test-plans',
      'test-execution/test-runs',
    ],
  },
];

export const testExecutionArticles: DocArticle[] = [
  {
    slug: 'test-execution/test-runs',
    title: 'Test Runs & Execution Cycles',
    description: 'Understand test runs, manual execution, assignee distribution, run statuses, and completion workflows.',
    category: 'test-execution',
    categoryTitle: 'Test Execution',
    order: 1,
    keywords: ['test runs', 'execution', 'run groups', 'assignees', 'verdict', 'completion', 'runs'],
    lastUpdated: '2026-08-31',
    overview: 'A Test Run represents a concrete execution instance of a collection of tests. Testers step through each test, recording verdicts, execution time, and failure notes.',
    sections: [
      {
        id: 'run-statuses',
        title: 'Test Run Lifecycle Statuses',
        table: {
          headers: ['Status', 'Badge Color', 'Meaning'],
          rows: [
            ['Draft', 'Slate / Gray', 'Run created but not yet opened for testers.'],
            ['In Progress', 'Blue', 'Active execution cycle; testers are actively logging verdicts.'],
            ['Blocked', 'Amber / Yellow', 'Execution halted due to environmental outage or blocker defect.'],
            ['Completed', 'Green', 'All tests finished; run is sealed and historical metrics frozen.'],
            ['Archived', 'Gray', 'Past run kept for compliance and audit trail.'],
          ],
        },
      },
      {
        id: 'creating-a-run',
        title: 'Creating a Test Run',
        content: '1. Navigate to **Test Runs** -> Click **+ New Test Run**.\n2. Enter Run Title (e.g. "Sprint 42 Sanity Run").\n3. Select Environment and Configuration.\n4. Assign tests to team members (or distribute evenly across squads).\n5. Click **Launch Run** to begin execution.',
      },
    ],
    relatedSlugs: [
      'test-execution/execution-cockpit',
      'test-execution/run-identifiers',
      'test-execution/execution-statuses',
    ],
  },
  {
    slug: 'test-execution/execution-cockpit',
    title: 'Execution Cockpit & Step Verdicts',
    description: 'Use the step-by-step execution drawer, live timer, evidence attachment, and instant defect filing.',
    category: 'test-execution',
    categoryTitle: 'Test Execution',
    order: 2,
    keywords: ['execution cockpit', 'step verdicts', 'pass', 'fail', 'timer', 'evidence', 'quick defect'],
    lastUpdated: '2026-08-31',
    overview: 'The Execution Cockpit is an interactive modal/drawer where testers step through actions and log verdicts.',
    sections: [
      {
        id: 'cockpit-features',
        title: 'Cockpit Features',
        content: '- **Elapsed Timer**: Auto-tracks execution time in seconds/minutes.\n- **Step-by-Step Passing**: Pass individual steps or click "Pass All Steps" for fast verification.\n- **Verdict Buttons**: Passed, Failed, Blocked, Skipped, Retest.\n- **Evidence & Failure Notes**: Add markdown failure logs and error stack traces.\n- **1-Click Defect Filing**: On failure, clicking "Create Defect" auto-populates the defect title with the test case name, failure step, and execution context.',
      },
    ],
    relatedSlugs: [
      'test-execution/test-runs',
      'requirements-defects/defects',
    ],
  },
  {
    slug: 'test-execution/run-identifiers',
    title: 'Understanding Run Identifiers (The Triad)',
    description: 'Differentiate between Internal Test Run IDs, Automation Run IDs, and External CI Pipeline Run IDs.',
    category: 'test-execution',
    categoryTitle: 'Test Execution',
    order: 3,
    keywords: ['run id', 'external run id', 'automation run id', 'triad', 'pipeline id', 'deduplication'],
    lastUpdated: '2026-08-31',
    overview: 'To ensure seamless tracing between manual testing, local automation runs, and CI/CD pipelines, the system distinguishes between three unique run identifiers.',
    sections: [
      {
        id: 'id-triad-table',
        title: 'Run Identifier Triad Reference',
        table: {
          headers: ['Identifier Type', 'Format Example', 'Source & Purpose'],
          rows: [
            ['Internal Test Run ID', 'ECOM-RUN-000142', 'Generated by TMS for manual and scheduled test run records.'],
            ['Automation Run ID', 'AUTO-RUN-000089', 'Generated by the Automation Hub when ingesting XML or executing automated test batches.'],
            ['External CI Run ID', 'GitLab Pipeline #92839102', 'Dispatched by external CI/CD engines (e.g., GitLab CI commit job ID). Prevents duplicate ingestion.'],
          ],
        },
        callout: {
          type: 'important',
          title: 'Deduplication Guard',
          content: 'When importing JUnit XML results with an External Run ID, the TMS checks if that CI pipeline ID has already been ingested to prevent duplicate runs.',
        },
      },
    ],
    relatedSlugs: [
      'ci-cd/gitlab',
      'ci-cd/xml-results',
      'automation/overview',
    ],
  },
  {
    slug: 'test-execution/retesting',
    title: 'Retesting & Defect Verification Cycles',
    description: 'How to re-execute failed test cases, track retest history, and verify defect resolution.',
    category: 'test-execution',
    categoryTitle: 'Test Execution',
    order: 4,
    keywords: ['retesting', 'defect verification', 'history', 'retest status', 'cycles'],
    lastUpdated: '2026-08-31',
    overview: 'When developers deploy a fix for a linked defect, testers mark the test case for "Retest" and re-execute the verification steps.',
    sections: [
      {
        id: 'retest-workflow',
        title: 'Retest Workflow',
        content: '1. Mark test status as **Retest**.\n2. Execution cockpit resets step indicators while archiving the previous failure log.\n3. Execute steps against the patched build.\n4. Log new verdict. If passed, the linked defect is eligible for resolution.',
      },
    ],
    relatedSlugs: [
      'test-execution/test-runs',
      'requirements-defects/defects',
    ],
  },
  {
    slug: 'test-execution/execution-statuses',
    title: 'Execution Statuses & State Machine',
    description: 'Detailed specification of all test verdicts: Passed, Failed, Blocked, Skipped, Untested, and Retest.',
    category: 'test-execution',
    categoryTitle: 'Test Execution',
    order: 5,
    keywords: ['statuses', 'passed', 'failed', 'blocked', 'skipped', 'untested', 'retest', 'verdicts'],
    lastUpdated: '2026-08-31',
    overview: 'Every test case execution within a run resolves to one of six official execution verdicts.',
    sections: [
      {
        id: 'verdict-definitions',
        title: 'Verdict Definitions',
        table: {
          headers: ['Verdict', 'Color', 'Meaning', 'Counts Towards Pass Rate'],
          rows: [
            ['Passed', 'Emerald Green', 'All steps executed successfully and met expected results.', 'Yes (Positive)'],
            ['Failed', 'Red', 'One or more steps failed, threw an unhandled exception, or diverged from expected results.', 'Yes (Negative)'],
            ['Blocked', 'Amber / Yellow', 'Test could not be executed due to environment outage or third-party dependency block.', 'Excluded / Neutral'],
            ['Skipped', 'Slate Gray', 'Intentionally omitted from this run cycle.', 'Excluded'],
            ['Retest', 'Purple', 'Previously failed; queued for re-verification following a code fix.', 'Pending'],
            ['Untested', 'Light Gray', 'Queued in the run; has not yet been executed by tester or CI.', 'Pending'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'test-execution/test-runs',
      'test-execution/execution-cockpit',
      'reference/statuses',
    ],
  },
];
