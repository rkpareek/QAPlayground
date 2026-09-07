import { User } from '../types';
import { BuiltInRoleType, CustomRole, PermissionKey, ScopeType, Team } from '../types/automation';

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  category: 'Projects' | 'Test Cases' | 'Suites' | 'Plans & Runs' | 'Automation' | 'Results' | 'Reports' | 'Administration' | 'Audit';
  description: string;
  isDangerousDelete?: boolean;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Projects
  { key: 'project.view', label: 'View Projects', category: 'Projects', description: 'Read project metadata and assets' },
  { key: 'project.create', label: 'Create Projects', category: 'Projects', description: 'Initialize new project workspaces' },
  { key: 'project.edit', label: 'Edit Project Settings', category: 'Projects', description: 'Modify project name, keys, and environments' },
  { key: 'project.delete', label: 'Delete Projects', category: 'Projects', description: 'Permanently remove projects and all contained assets', isDangerousDelete: true },

  // Test Cases
  { key: 'testcase.view', label: 'View Test Cases', category: 'Test Cases', description: 'Inspect test case specifications and history' },
  { key: 'testcase.create', label: 'Create Test Cases', category: 'Test Cases', description: 'Author new manual or automated test cases' },
  { key: 'testcase.edit', label: 'Edit Test Cases', category: 'Test Cases', description: 'Update steps, priorities, tags, and status' },
  { key: 'testcase.delete', label: 'Delete Test Cases', category: 'Test Cases', description: 'Remove test cases permanently', isDangerousDelete: true },

  // Suites
  { key: 'suite.view', label: 'View Suites & Folders', category: 'Suites', description: 'Browse repository hierarchy' },
  { key: 'suite.create', label: 'Create Suites & Folders', category: 'Suites', description: 'Organize tests into suites and subfolders' },
  { key: 'suite.edit', label: 'Edit Suites & Folders', category: 'Suites', description: 'Rename or move suites and folders' },
  { key: 'suite.delete', label: 'Delete Suites & Folders', category: 'Suites', description: 'Remove suites and subfolders', isDangerousDelete: true },

  // Plans & Runs
  { key: 'testplan.view', label: 'View Test Plans', category: 'Plans & Runs', description: 'Inspect test strategy and plans' },
  { key: 'testplan.create', label: 'Create Test Plans', category: 'Plans & Runs', description: 'Compose milestones and plans' },
  { key: 'testplan.edit', label: 'Edit Test Plans', category: 'Plans & Runs', description: 'Update test plan scopes' },
  { key: 'testplan.delete', label: 'Delete Test Plans', category: 'Plans & Runs', description: 'Remove test plans', isDangerousDelete: true },
  { key: 'testrun.view', label: 'View Test Runs', category: 'Plans & Runs', description: 'View manual and automated runs' },
  { key: 'testrun.create', label: 'Create Test Runs', category: 'Plans & Runs', description: 'Start and execute test runs' },
  { key: 'testrun.edit', label: 'Edit Test Runs', category: 'Plans & Runs', description: 'Log test executions and assignees' },
  { key: 'testrun.delete', label: 'Delete Test Runs', category: 'Plans & Runs', description: 'Delete execution runs', isDangerousDelete: true },

  // Automation
  { key: 'automation.view', label: 'View Automated Tests', category: 'Automation', description: 'Browse automated repository & metrics' },
  { key: 'automation.import', label: 'Import Automation Code', category: 'Automation', description: 'Import Playwright/Mocha source code' },
  { key: 'automation.edit', label: 'Edit Automation Specs', category: 'Automation', description: 'Modify script parameters and mappings' },
  { key: 'automation.delete', label: 'Delete Automated Tests', category: 'Automation', description: 'Remove automated test records', isDangerousDelete: true },
  { key: 'automation.sync', label: 'Sync Automation Repository', category: 'Automation', description: 'Run ID synchronizer and detach resolver' },
  { key: 'automation.view_source', label: 'View Source Code', category: 'Automation', description: 'Inspect test code in Source Explorer' },
  { key: 'automation.manage_ids', label: 'Manage @T / @S Tags', category: 'Automation', description: 'Generate and inject test IDs in code' },
  { key: 'automation.view_analytics', label: 'View Automation Analytics', category: 'Automation', description: 'Inspect flaky and slow test heuristics' },

  // Results & Ingestion
  { key: 'automation_result.view', label: 'View Automation Results', category: 'Results', description: 'Inspect pipeline execution results' },
  { key: 'automation_result.import', label: 'Ingest XML / CI Results', category: 'Results', description: 'Upload JUnit XML and trigger CI ingestion' },

  // Reports
  { key: 'report.view', label: 'View Reports', category: 'Reports', description: 'Access quality and automation reports' },
  { key: 'report.create', label: 'Create Custom Reports', category: 'Reports', description: 'Export PDF/CSV summaries' },

  // Administration
  { key: 'user.view', label: 'View Users', category: 'Administration', description: 'Browse user directory' },
  { key: 'user.create', label: 'Invite / Add Users', category: 'Administration', description: 'Provision new workspace accounts' },
  { key: 'user.edit', label: 'Edit User Accounts', category: 'Administration', description: 'Update user profiles and titles' },
  { key: 'user.deactivate', label: 'Deactivate Users', category: 'Administration', description: 'Suspend workspace access' },
  { key: 'user.delete', label: 'Delete Users', category: 'Administration', description: 'Permanently remove user accounts', isDangerousDelete: true },
  { key: 'team.view', label: 'View Teams', category: 'Administration', description: 'Browse workspace teams' },
  { key: 'team.create', label: 'Create Teams', category: 'Administration', description: 'Create functional team groupings' },
  { key: 'team.edit', label: 'Edit Teams', category: 'Administration', description: 'Update team membership & scopes' },
  { key: 'team.delete', label: 'Delete Teams', category: 'Administration', description: 'Remove team groupings', isDangerousDelete: true },
  { key: 'role.view', label: 'View Roles', category: 'Administration', description: 'Inspect RBAC role permissions' },
  { key: 'role.create', label: 'Create Custom Roles', category: 'Administration', description: 'Define new role templates' },
  { key: 'role.edit', label: 'Edit Roles', category: 'Administration', description: 'Update permission assignments' },
  { key: 'role.delete', label: 'Delete Roles', category: 'Administration', description: 'Remove custom roles', isDangerousDelete: true },
  { key: 'permission.manage', label: 'Manage Permissions & Grants', category: 'Administration', description: 'Assign scoped permissions' },
  { key: 'scope.manage', label: 'Manage Target Scopes', category: 'Administration', description: 'Configure project/suite scope boundaries' },
  { key: 'label.view', label: 'View Labels & Tags', category: 'Administration', description: 'Browse workspace and project tag registry' },
  { key: 'label.create', label: 'Create Labels & Tags', category: 'Administration', description: 'Define new color-coded tags' },
  { key: 'label.edit', label: 'Edit & Merge Labels', category: 'Administration', description: 'Update labels and merge duplicates' },
  { key: 'label.delete', label: 'Delete Labels', category: 'Administration', description: 'Remove tags from registry', isDangerousDelete: true },
  { key: 'customfield.view', label: 'View Custom Fields', category: 'Administration', description: 'Browse custom field definitions' },
  { key: 'customfield.create', label: 'Create Custom Fields', category: 'Administration', description: 'Define new schema attributes for test cases' },
  { key: 'customfield.edit', label: 'Edit Custom Fields', category: 'Administration', description: 'Configure field options, validation, and requirements' },
  { key: 'customfield.delete', label: 'Delete Custom Fields', category: 'Administration', description: 'Remove custom fields from workspace', isDangerousDelete: true },

  // Audit
  { key: 'audit.view', label: 'View Audit Logs', category: 'Audit', description: 'Read system-wide activity and security logs' },
];

export const BUILT_IN_ROLES: CustomRole[] = [
  {
    id: 'owner',
    name: 'Workspace Owner',
    description: 'Complete unrestricted access across all workspaces, projects, scopes, and administration controls.',
    isBuiltIn: true,
    permissions: ALL_PERMISSIONS.map((p) => p.key),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'High-level administration including user management, team management, and configurations. Note: Deletions require explicit grant.',
    isBuiltIn: true,
    permissions: ALL_PERMISSIONS.filter((p) => !p.isDangerousDelete).map((p) => p.key),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'qa_lead',
    name: 'QA Lead',
    description: 'Full testing management, repository organization, test plan approval, execution tracking, and defect management.',
    isBuiltIn: true,
    permissions: [
      'project.view',
      'testcase.view',
      'testcase.create',
      'testcase.edit',
      'testcase.delete',
      'suite.view',
      'suite.create',
      'suite.edit',
      'suite.delete',
      'testplan.view',
      'testplan.create',
      'testplan.edit',
      'testplan.delete',
      'testrun.view',
      'testrun.create',
      'testrun.edit',
      'testrun.delete',
      'automation.view',
      'automation.import',
      'automation.edit',
      'automation.sync',
      'automation.view_source',
      'automation.manage_ids',
      'automation.view_analytics',
      'automation_result.view',
      'automation_result.import',
      'report.view',
      'report.create',
      'audit.view',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'automation_engineer',
    name: 'Automation Engineer',
    description: 'Specialized access for source code import, @T/@S ID management, XML ingestion, CI integration, and flaky test analysis.',
    isBuiltIn: true,
    permissions: [
      'project.view',
      'testcase.view',
      'testcase.create',
      'testcase.edit',
      'suite.view',
      'testrun.view',
      'testrun.create',
      'testrun.edit',
      'automation.view',
      'automation.import',
      'automation.edit',
      'automation.sync',
      'automation.view_source',
      'automation.manage_ids',
      'automation.view_analytics',
      'automation_result.view',
      'automation_result.import',
      'report.view',
      'report.create',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'qa',
    name: 'QA Engineer / Tester',
    description: 'Authoring test cases, executing manual runs, logging test results, and creating defects.',
    isBuiltIn: true,
    permissions: [
      'project.view',
      'testcase.view',
      'testcase.create',
      'testcase.edit',
      'suite.view',
      'testplan.view',
      'testrun.view',
      'testrun.create',
      'testrun.edit',
      'automation.view',
      'automation.view_source',
      'automation_result.view',
      'report.view',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Inspect test cases, execute automation, view stack traces and failure logs, and manage linked defects.',
    isBuiltIn: true,
    permissions: [
      'project.view',
      'testcase.view',
      'suite.view',
      'testrun.view',
      'automation.view',
      'automation.view_source',
      'automation_result.view',
      'automation_result.import',
      'report.view',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'viewer',
    name: 'Read-Only Viewer',
    description: 'Read-only access to repository test cases, execution dashboards, and high-level reports.',
    isBuiltIn: true,
    permissions: ['project.view', 'testcase.view', 'suite.view', 'testplan.view', 'testrun.view', 'automation.view', 'report.view'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

export interface AccessCheckResult {
  granted: boolean;
  source: 'owner' | 'direct' | 'team' | 'none';
  sourceName?: string;
  scopeMatched: boolean;
  reason: string;
}

/**
 * Evaluates whether a user has a specific permission on a target scope
 */
export function evaluateUserPermission(
  user: User,
  permission: PermissionKey,
  scopeType: ScopeType = 'project',
  scopeTargetId: string = 'all',
  teams: Team[] = [],
  roles: CustomRole[] = BUILT_IN_ROLES
): AccessCheckResult {
  // 1. Workspace Owner Bypass
  if (user.isOwner || user.role === 'owner') {
    return {
      granted: true,
      source: 'owner',
      sourceName: 'Workspace Owner (Root Access)',
      scopeMatched: true,
      reason: 'Owner has unrestricted access to all operations across all scopes.',
    };
  }

  // 2. Helper to get role permissions
  const getRolePermissions = (roleId: string): PermissionKey[] => {
    const found = roles.find((r) => r.id === roleId);
    return found ? found.permissions : [];
  };

  // Helper to check scope match
  const isScopeMatch = (grantScope: ScopeType, grantTarget: string): boolean => {
    if (grantScope === 'workspace' || grantTarget === 'all') return true;
    if (grantScope === scopeType && grantTarget === scopeTargetId) return true;
    return false;
  };

  // 3. Check Direct Grants
  if (user.directGrants && user.directGrants.length > 0) {
    for (const grant of user.directGrants) {
      const perms = grant.directPermissionsOverride || getRolePermissions(grant.roleId);
      if (perms.includes(permission)) {
        if (isScopeMatch(grant.scopeType, grant.scopeTargetId)) {
          const roleObj = roles.find((r) => r.id === grant.roleId);
          return {
            granted: true,
            source: 'direct',
            sourceName: `Direct Grant (${roleObj?.name || grant.roleId})`,
            scopeMatched: true,
            reason: `Directly granted via role "${roleObj?.name || grant.roleId}" scoped to ${grant.scopeType}:${grant.scopeTargetId}.`,
          };
        }
      }
    }
  }

  // 4. Check Base User Role
  const baseRolePermissions = getRolePermissions(user.role);
  if (baseRolePermissions.includes(permission)) {
    return {
      granted: true,
      source: 'direct',
      sourceName: `Base Role (${user.role})`,
      scopeMatched: true,
      reason: `Granted via assigned base user role "${user.role}".`,
    };
  }

  // 5. Check Inherited Team Grants
  const userTeams = teams.filter((t) => (user.teams || []).includes(t.id) || t.memberIds.includes(user.id));
  for (const team of userTeams) {
    for (const grant of team.grants) {
      const perms = grant.directPermissionsOverride || getRolePermissions(grant.roleId);
      if (perms.includes(permission)) {
        if (isScopeMatch(grant.scopeType, grant.scopeTargetId)) {
          const roleObj = roles.find((r) => r.id === grant.roleId);
          return {
            granted: true,
            source: 'team',
            sourceName: `Team: ${team.name} (${roleObj?.name || grant.roleId})`,
            scopeMatched: true,
            reason: `Inherited from membership in "${team.name}" with role "${roleObj?.name || grant.roleId}".`,
          };
        }
      }
    }
  }

  return {
    granted: false,
    source: 'none',
    scopeMatched: false,
    reason: `User does not possess permission "${permission}" in scope ${scopeType}:${scopeTargetId}.`,
  };
}
