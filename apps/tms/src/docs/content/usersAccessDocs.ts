import { DocArticle } from '../types';

export const usersAccessArticles: DocArticle[] = [
  {
    slug: 'users-access/users',
    title: 'User Management & Invitations',
    description: 'Invite team members, assign primary roles, manage multi-project access scopes, and handle account deactivations.',
    category: 'users-access',
    categoryTitle: 'Users & Access Control',
    order: 1,
    keywords: ['users', 'invitations', 'roles', 'deactivate', 'member management', 'accounts'],
    lastUpdated: '2026-08-31',
    overview: 'User Management provides centralized control over all organization members, their role grants, team assignments, and account statuses.',
    sections: [
      {
        id: 'inviting-users',
        title: 'Inviting New Users',
        content: '1. Navigate to **Administration** -> **Users & Access**.\n2. Click **+ Invite User**.\n3. Enter their email and full name.\n4. Select Primary Role (e.g. QA Engineer, SDET, Developer).\n5. Assign to Teams (e.g. Core Squad, Automation Team).\n6. Select Project Scopes (`*` for all projects, or specific projects).\n7. Click **Send Invitation**.',
      },
      {
        id: 'account-lifecycle',
        title: 'User Statuses & Safeguards',
        content: '- **Active**: Full access according to granted permissions.\n- **Suspended / Inactive**: Login blocked; access revoked immediately.\n- **Owner Protection**: The Workspace Owner account cannot be removed or demoted.',
      },
    ],
    relatedSlugs: [
      'users-access/teams',
      'users-access/roles-permissions',
      'users-access/access-inspector',
    ],
  },
  {
    slug: 'users-access/teams',
    title: 'Teams & Squad Management',
    description: 'Create squads, assign team leads, configure team-level project access, and manage membership.',
    category: 'users-access',
    categoryTitle: 'Users & Access Control',
    order: 2,
    keywords: ['teams', 'squads', 'groups', 'team lead', 'team access', 'membership'],
    lastUpdated: '2026-08-31',
    overview: 'Teams represent functional groups (e.g., "Frontend QA", "Core Automation SDETs", "Backend Dev Squad"). Assigning roles to a team automatically grants permissions to all team members.',
    sections: [
      {
        id: 'team-benefits',
        title: 'Why Use Teams?',
        content: '- **Simplified Onboarding**: Add a new QA engineer to the "QA Squad" to instantly grant them repository edit rights across all assigned projects.\n- **Execution Assignment**: Assign an entire test run or suite to a team rather than individual users.',
      },
    ],
    relatedSlugs: [
      'users-access/users',
      'users-access/direct-vs-inherited',
    ],
  },
  {
    slug: 'users-access/roles-permissions',
    title: 'Roles & Permissions Matrix',
    description: 'Built-in role presets (Owner, Admin, QA Lead, QA Engineer, SDET, Developer, Viewer) and custom role creation.',
    category: 'users-access',
    categoryTitle: 'Users & Access Control',
    order: 3,
    keywords: ['roles', 'permissions', 'rbac', 'owner', 'admin', 'qa lead', 'sdet', 'viewer'],
    lastUpdated: '2026-08-31',
    overview: 'The system enforces granular Role-Based Access Control (RBAC) across all workspace actions.',
    sections: [
      {
        id: 'built-in-roles',
        title: 'Built-in Role Presets',
        table: {
          headers: ['Role', 'Description', 'Key Permissions'],
          rows: [
            ['Workspace Owner', 'Full organization owner', 'All permissions, billing, workspace deletion, transfers'],
            ['Administrator', 'Platform admin', 'User management, custom fields, audit logs, project creation'],
            ['QA Lead', 'Testing lead', 'Test planning, suite creation, approvals, run assignments, defect triage'],
            ['QA Engineer', 'Manual/Functional tester', 'Test authoring, run execution, verdict logging, defect filing'],
            ['Automation SDET', 'Automation engineer', 'AST import, code synchronization, XML ingestion, GitLab config'],
            ['Developer', 'Software engineer', 'Read tests/runs, execute automated runs, resolve linked defects'],
            ['Viewer', 'Read-only stakeholder', 'View repository, dashboards, analytics, and reports'],
          ],
        },
      },
    ],
    relatedSlugs: [
      'users-access/direct-vs-inherited',
      'users-access/access-inspector',
      'reference/permissions-matrix',
    ],
  },
  {
    slug: 'users-access/direct-vs-inherited',
    title: 'Direct vs. Inherited Permissions',
    description: 'How effective permissions are resolved when a user has both direct grants and team memberships.',
    category: 'users-access',
    categoryTitle: 'Users & Access Control',
    order: 4,
    keywords: ['inheritance', 'direct grants', 'team grants', 'effective permissions', 'resolution'],
    lastUpdated: '2026-08-31',
    overview: 'A user’s total capability is the mathematical union of their direct grants plus all grants inherited from squads they belong to.',
    sections: [
      {
        id: 'resolution-logic',
        title: 'Permission Resolution Logic',
        codeSnippet: {
          language: 'typescript',
          code: `// Effective Permissions Formula\nEffectivePermissions(User) =\n  DirectUserGrants(User) ∪\n  TeamGrants(Team_A) ∪\n  TeamGrants(Team_B) ...`,
          caption: 'Union of direct and team permissions',
        },
      },
    ],
    relatedSlugs: [
      'users-access/roles-permissions',
      'users-access/access-inspector',
    ],
  },
  {
    slug: 'users-access/access-inspector',
    title: 'Access Inspector & Diagnostic Tool',
    description: 'Inspect why a specific user has or lacks a permission for a given project or test suite.',
    category: 'users-access',
    categoryTitle: 'Users & Access Control',
    order: 5,
    keywords: ['access inspector', 'diagnostic', 'audit access', 'permission check', 'troubleshoot'],
    lastUpdated: '2026-08-31',
    overview: 'The Access Inspector answers questions like: "Why can Sarah import automation files to the Payments project?" or "Why is Alex unable to delete test runs?"',
    sections: [
      {
        id: 'using-inspector',
        title: 'Using the Access Inspector',
        content: '1. Go to **Administration** -> **Access Inspector**.\n2. Select target **User**.\n3. Select target **Project**.\n4. Select target **Action / Permission**.\n5. Inspector displays the evaluation trace: whether granted, the exact role source, and whether direct or inherited.',
      },
    ],
    relatedSlugs: [
      'users-access/users',
      'users-access/roles-permissions',
      'users-access/direct-vs-inherited',
    ],
  },
];
