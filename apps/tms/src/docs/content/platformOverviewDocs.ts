import { DocArticle } from '../types';

export const platformOverviewArticles: DocArticle[] = [
  {
    slug: 'overview/dashboard',
    title: 'Project Dashboard & Quality Pulse',
    description: 'Understand the primary project dashboard, velocity indicators, automation coverage gauges, and recent activity feeds.',
    category: 'overview',
    categoryTitle: 'Platform Overview',
    order: 1,
    keywords: ['dashboard', 'metrics', 'activity stream', 'pass rate', 'automation coverage', 'pulse'],
    lastUpdated: '2026-08-31',
    overview: 'The Project Dashboard delivers an executive and operational snapshot of the active project, aggregating test counts, automation percentages, active run completion rates, and recent test modification audit logs.',
    sections: [
      {
        id: 'metric-cards',
        title: 'Key Metric Gauges',
        content: 'The dashboard highlights 4 primary quality indicators:\n\n1. **Total Test Cases & Automation Rate**: Shows absolute repository test volume and percentage marked as `@automated`.\n2. **Active Runs & Pass Velocity**: Real-time pass/fail/blocked ratio for runs currently underway.\n3. **Unresolved Defects**: Open defects categorized by critical, high, and medium severity.\n4. **Requirements Coverage**: Ratio of registered user stories covered by at least one valid test case.',
      },
      {
        id: 'activity-timeline',
        title: 'Real-Time Activity Stream',
        content: 'The live activity log streams all test case creations, step modifications, run verdict updates, and AST synchronization events with user avatars and relative timestamps.',
      },
    ],
    relatedSlugs: [
      'overview/navigation',
      'analytics/overview',
      'test-execution/test-runs',
    ],
  },
  {
    slug: 'overview/navigation',
    title: 'Global Navigation & Layout',
    description: 'Learn about sidebar modules, top bar utilities, project switcher, and notification center.',
    category: 'overview',
    categoryTitle: 'Platform Overview',
    order: 2,
    keywords: ['navigation', 'sidebar', 'topbar', 'layout', 'project switcher', 'notifications'],
    lastUpdated: '2026-08-31',
    overview: 'The application layout consists of a collapsible navigation sidebar, persistent top header with project scoping and search, and the main workspace view.',
    sections: [
      {
        id: 'sidebar-structure',
        title: 'Sidebar Modules',
        content: 'The sidebar is grouped into functional areas:\n- **Core QA**: Dashboard, Test Repository, Test Plans, Test Runs, Traceability Matrix, Requirements, Defects.\n- **Automation & CI**: Automation Hub, AST Source Explorer, XML Result Ingestion, GitLab Pipeline Integration.\n- **Insights & Governance**: Analytics, Reports, Audit Logs, Settings & RBAC, Documentation.',
      },
    ],
    relatedSlugs: [
      'overview/dashboard',
      'overview/global-search',
    ],
  },
  {
    slug: 'overview/global-search',
    title: 'Global Search & Command Palette',
    description: 'Search across test cases, test suites, test runs, automated tests, defects, and documentation.',
    category: 'overview',
    categoryTitle: 'Platform Overview',
    order: 3,
    keywords: ['search', 'command palette', 'cmd+k', 'filter', 'quick find'],
    lastUpdated: '2026-08-31',
    overview: 'Press `Cmd + K` or `Ctrl + K` to open the omnibar search. It indexes test case titles, IDs (@T...), suite names, run identifiers, defect summaries, and documentation articles.',
    sections: [
      {
        id: 'search-syntaxes',
        title: 'Search Syntax Examples',
        content: 'Search supports precise token prefixes:',
        table: {
          headers: ['Search Query', 'Target Result'],
          rows: [
            ['@T84920193', 'Exact Test Case by unique AST / System Test ID'],
            ['@S10293847', 'Exact Test Suite by Suite ID'],
            ['RUN-0001', 'Direct Test Run navigation'],
            ['DEF-001', 'Direct Defect inspection'],
            ['tag:smoke', 'Filter test cases tagged with smoke'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'getting-started/workspace',
      'test-management/test-cases',
    ],
  },
];
