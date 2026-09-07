import { DocArticle } from '../types';

export const administrationArticles: DocArticle[] = [
  {
    slug: 'administration/projects',
    title: 'Project Administration',
    description: 'Create, edit, archive, and configure project settings, project keys, and default leads.',
    category: 'administration',
    categoryTitle: 'Administration',
    order: 1,
    keywords: ['projects', 'admin', 'project settings', 'archive project', 'project key'],
    lastUpdated: '2026-08-31',
    overview: 'Project administrators can manage project metadata, assign leads, adjust visibility scopes, and archive deprecated microservices.',
    sections: [
      {
        id: 'project-settings-table',
        title: 'Project Settings Reference',
        table: {
          headers: ['Setting', 'Description'],
          rows: [
            ['Project Name', 'Display name visible in switcher.'],
            ['Project Key', 'Unique 2-5 letter prefix used for test IDs and runs (e.g. ECOM).'],
            ['Project Lead', 'Primary user responsible for testing sign-offs.'],
            ['Environments', 'Available environments for this project (Staging, Prod, etc.).'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'getting-started/first-project',
      'administration/custom-fields',
    ],
  },
  {
    slug: 'administration/custom-fields',
    title: 'Custom Fields Administration',
    description: 'Configure organization-wide and project-specific custom fields, validation constraints, and dropdown options.',
    category: 'administration',
    categoryTitle: 'Administration',
    order: 2,
    keywords: ['custom fields admin', 'field builder', 'validation', 'options', 'schema'],
    lastUpdated: '2026-08-31',
    overview: 'The Custom Fields Administrator tab allows creating and maintaining dynamic metadata fields for test cases.',
    sections: [
      {
        id: 'creating-custom-fields',
        title: 'Creating a Custom Field',
        content: '1. Navigate to **Administration** -> **Custom Fields**.\n2. Click **+ New Custom Field**.\n3. Enter Field Label and internal camelCase key.\n4. Select Type (Text, Number, URL, Date, Boolean, Dropdown, Multi-Select).\n5. For Dropdown/Multi-Select, enter comma-separated choices.\n6. Choose Project Scope (`All Projects` or specific project).\n7. Click **Save Custom Field**.',
      },
    ],
    relatedSlugs: [
      'test-management/custom-fields',
      'test-management/test-editor',
    ],
  },
  {
    slug: 'administration/label-registry',
    title: 'Label & Tag Registry Administration',
    description: 'Manage the organization-wide label dictionary, category tags, colors, and merge duplicate tags.',
    category: 'administration',
    categoryTitle: 'Administration',
    order: 3,
    keywords: ['labels admin', 'tag registry', 'color picker', 'categories', 'merge tags'],
    lastUpdated: '2026-08-31',
    overview: 'Centrally manage test tags to prevent naming inconsistencies like `#smoke`, `#SmokeTest`, and `#smoke-test`.',
    sections: [
      {
        id: 'label-actions',
        title: 'Registry Capabilities',
        content: '- **Color Assignment**: Pick vibrant hex colors for visual distinction.\n- **Category Grouping**: Tag labels by type (`Sanity`, `Security`, `Regression`, `Flaky`, `Compliance`).\n- **Usage Counts**: View how many test cases currently reference each label.\n- **Delete & Clean**: Safely remove unused labels.',
      },
    ],
    relatedSlugs: [
      'test-management/tags-labels',
    ],
  },
  {
    slug: 'administration/audit-logs',
    title: 'Audit Logs & Governance',
    description: 'Immutable security log capturing user invitations, permission updates, test deletions, and AST imports.',
    category: 'administration',
    categoryTitle: 'Administration',
    order: 4,
    keywords: ['audit logs', 'compliance', 'security', 'activity history', 'governance'],
    lastUpdated: '2026-08-31',
    overview: 'The Audit Log provides an immutable record of all administrative, security, and repository modifications.',
    sections: [
      {
        id: 'audited-events',
        title: 'Key Audited Events',
        table: {
          headers: ['Event Type', 'Details Logged'],
          rows: [
            ['User Invitation & Role Changes', 'Target user, assigned role, grantor, timestamp'],
            ['Team Membership Changes', 'User added/removed, modified squad lead'],
            ['Test Deletion / Bulk Actions', 'Test IDs deleted, archived, or transferred'],
            ['Automation AST Imports', 'File names parsed, tests synced, duration, user'],
            ['XML Ingestions', 'Total tests parsed, pass/fail counts, pipeline ID'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'users-access/roles-permissions',
      'administration/projects',
    ],
  },
];

export const referenceArticles: DocArticle[] = [
  {
    slug: 'reference/statuses',
    title: 'Status & State Machine Reference',
    description: 'Comprehensive table of all Test Run, Execution Verdict, Defect, and Automation statuses across the platform.',
    category: 'reference',
    categoryTitle: 'Reference & Glossary',
    order: 1,
    keywords: ['statuses', 'state machine', 'run status', 'verdict', 'defect status', 'reference'],
    lastUpdated: '2026-08-31',
    overview: 'A single reference sheet of all state machines and lifecycle badges used in the TMS.',
    sections: [
      {
        id: 'all-status-tables',
        title: 'Execution Verdicts vs. Run Statuses vs. Defect Statuses',
        table: {
          headers: ['Category', 'Available Values', 'State Meaning'],
          rows: [
            ['Execution Verdict', 'passed, failed, blocked, skipped, retest, untested', 'Test case outcome in an active run'],
            ['Test Run Status', 'draft, in_progress, blocked, completed, archived', 'State of the overall test execution run'],
            ['Defect Status', 'open, in_progress, resolved, closed, rejected', 'Bug resolution lifecycle'],
            ['Automation Status', 'manual, automated, planned, not_automatable', 'Test case automation classification in repository'],
            ['Sync Status', 'new, existing, modified, detached', 'Code-to-repository AST match state'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'test-execution/execution-statuses',
      'requirements-defects/defects',
      'reference/glossary',
    ],
  },
  {
    slug: 'reference/permissions-matrix',
    title: 'Permissions Matrix & Scopes',
    description: 'Detailed list of all permission keys, scopes, and default role assignments.',
    category: 'reference',
    categoryTitle: 'Reference & Glossary',
    order: 2,
    keywords: ['permissions matrix', 'permission keys', 'scopes', 'rbac reference'],
    lastUpdated: '2026-08-31',
    overview: 'Granular permissions can be assigned to custom roles or inspected through the Access Inspector.',
    sections: [
      {
        id: 'permission-keys',
        title: 'Permission Key Catalog',
        table: {
          headers: ['Permission Key', 'Category', 'Description'],
          rows: [
            ['testcase.create', 'Test Management', 'Create new test cases via Quick Add or Full Editor'],
            ['testcase.edit', 'Test Management', 'Update steps, preconditions, metadata, and custom fields'],
            ['testcase.delete', 'Test Management', 'Permanently delete or archive test cases'],
            ['testrun.create', 'Execution', 'Initialize new test runs and select scopes'],
            ['testrun.execute', 'Execution', 'Record step verdicts, notes, and timers in active runs'],
            ['automation.import', 'Automation', 'Upload AST source files and sync repository test cases'],
            ['ci.ingest_xml', 'CI/CD', 'Ingest JUnit XML results from GitLab CI pipelines'],
            ['users.manage', 'Administration', 'Invite members, adjust roles, and manage teams'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'users-access/roles-permissions',
      'users-access/access-inspector',
    ],
  },
  {
    slug: 'reference/glossary',
    title: 'Terminology & QA Glossary',
    description: 'Definitions of all testing, automation, CI/CD, and TMS terminology.',
    category: 'reference',
    categoryTitle: 'Reference & Glossary',
    order: 3,
    keywords: ['glossary', 'terminology', 'definitions', 'qa terms', 'concepts', 'dictionary'],
    lastUpdated: '2026-08-31',
    overview: 'A complete dictionary of terms used throughout this platform.',
    sections: [
      {
        id: 'glossary-terms',
        title: 'Glossary of Terms',
        table: {
          headers: ['Term', 'Definition'],
          rows: [
            ['@T########', 'Unique 8-digit test case identifier (e.g. @T10293847) linking code to TMS.'],
            ['@S########', 'Unique 8-digit test suite identifier linking code describe() blocks to TMS suites.'],
            ['AST (Abstract Syntax Tree)', 'Hierarchical syntax tree parsed from TypeScript/JavaScript code without executing the test.'],
            ['Detached Test', 'A test case that exists in the TMS repository with a @T ID but is no longer present in source code.'],
            ['Execution Cockpit', 'Interactive modal/drawer for manual testers to step through tests and record verdicts.'],
            ['External Run ID', 'Unique CI pipeline run identifier (e.g. GitLab Pipeline #1029) used for deduplication.'],
            ['Flaky Test', 'An automated test that exhibits alternating PASS/FAIL results without code changes.'],
            ['Quick Add', 'High-speed test case creation modal activated via keyboard shortcut "C".'],
            ['Traceability Matrix', 'Grid mapping Requirements to Test Cases, Runs, and Defects for compliance.'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'getting-started/introduction',
      'reference/statuses',
    ],
  },
];
