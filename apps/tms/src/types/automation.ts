import { ExecutionStatus, TestCasePriority, TestType } from './index';

// Automation Frameworks & Runners
export type SupportedFramework = 'playwright' | 'mocha' | 'mocha_playwright_hybrid' | 'cypress' | 'selenium' | 'jest';
export type AutomationRunner = 'playwright_test' | 'mocha' | 'jest' | 'custom';
export type AutomationLanguage = 'typescript' | 'javascript' | 'python' | 'java';

// AST / Static Parsed Test Information
export interface AutomationTestInfo {
  id: string; // e.g. auto-test-1 or mapped TMS ID
  testIdRef?: string; // e.g. @T12345678
  title: string;
  cleanTitle: string; // Title without @T/@S tags
  suiteIdRef?: string; // e.g. @S12345678
  suiteName: string;
  filePath: string;
  startLine: number;
  endLine: number;
  sourceCode: string;
  tags: string[];
  annotations: { type: string; description?: string }[];
  isAsync: boolean;
  isStepBased: boolean;
  hasId: boolean;
  isDetached?: boolean;
  action?: 'CREATE' | 'UPDATE' | 'UNCHANGED' | 'DETACHED' | 'DUPLICATE' | 'ERROR';
  matchConfidence?: 'exact_id' | 'source_path' | 'suite_title' | 'candidate';
  existingTestCaseId?: string;
}

export interface AutomationSuiteInfo {
  id: string;
  suiteIdRef?: string; // e.g. @S12345678
  name: string;
  cleanName: string;
  filePath: string;
  startLine: number;
  endLine: number;
  parentSuiteId?: string;
  tests: AutomationTestInfo[];
}

export interface AutomationSourceFile {
  id: string;
  projectId: string;
  path: string; // e.g. tests/auth/login.spec.ts
  fileName: string;
  content: string;
  hash: string;
  language: AutomationLanguage;
  framework: SupportedFramework;
  runner: AutomationRunner;
  suites: AutomationSuiteInfo[];
  tests: AutomationTestInfo[];
  lastImportedAt: string;
  lastModifiedAt: string;
}

export interface AutomationImportRecord {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  timestamp: string;
  framework: SupportedFramework;
  runner: AutomationRunner;
  language: AutomationLanguage;
  sourceScope: string;
  filesScanned: number;
  suitesDetected: number;
  testsDetected: number;
  testsCreated: number;
  testsUpdated: number;
  testsUnchanged: number;
  testsDetached: number;
  duplicateCandidates: number;
  errors: number;
  warnings: string[];
}

// Normalized Automation Result Model (Independent of XML format)
export interface NormalizedTestResult {
  id: string;
  testIdRef?: string; // extracted @T12345678
  suiteIdRef?: string; // extracted @S12345678
  testName: string;
  cleanTestName: string;
  suiteName: string;
  className?: string;
  status: ExecutionStatus;
  rawStatus: string;
  durationMs: number;
  failureMessage?: string;
  errorDetails?: string;
  stackTrace?: string;
  stdout?: string;
  stderr?: string;
  sourceFile?: string;
  sourceLine?: number;
  matchedTestCaseId?: string;
  matchedTestCaseTitle?: string;
  matchType?: 'test_id' | 'source_path' | 'suite_title' | 'title_candidate' | 'unmatched';
  isFlakyCandidate?: boolean;
}

export interface AutomationResultDocument {
  importId: string;
  projectId: string;
  fileName: string;
  fileHash: string;
  parser: 'junit_xml' | 'mocha_json' | 'playwright_json';
  parserVersion: string;
  ingestedAt: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  errors: number;
  durationMs: number;
  rawXmlSnippet?: string;
  normalizedResults: NormalizedTestResult[];
  unmatchedCount: number;
}

// GitLab CI Integration Types
export interface GitLabIntegrationConfig {
  id: string;
  projectId: string;
  isConnected: boolean;
  gitlabUrl: string;
  projectPath: string; // e.g. acme-corp/online-store
  defaultBranch: string;
  defaultResultFormat: 'xml';
  maskedApiToken?: string;
  webhookSecret?: string;
  lastSyncAt?: string;
  lastPipelineStatus?: 'success' | 'failed' | 'running' | 'canceled';
}

export interface GitLabPipelineMetadata {
  pipelineId: number;
  jobId: number;
  branch: string;
  commitSha: string;
  commitMessage: string;
  pipelineUrl: string;
  jobUrl: string;
  status: 'passed' | 'failed' | 'running' | 'canceled';
  triggeredBy: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
}

// Scoped RBAC Permissions & Team Types
export type BuiltInRoleType =
  | 'owner'
  | 'admin'
  | 'qa_lead'
  | 'qa'
  | 'automation_engineer'
  | 'developer'
  | 'viewer';

export type PermissionKey =
  // Projects
  | 'project.view'
  | 'project.create'
  | 'project.edit'
  | 'project.delete'
  // Test Cases
  | 'testcase.view'
  | 'testcase.create'
  | 'testcase.edit'
  | 'testcase.delete'
  // Suites & Folders
  | 'suite.view'
  | 'suite.create'
  | 'suite.edit'
  | 'suite.delete'
  // Test Plans
  | 'testplan.view'
  | 'testplan.create'
  | 'testplan.edit'
  | 'testplan.delete'
  // Test Runs
  | 'testrun.view'
  | 'testrun.create'
  | 'testrun.edit'
  | 'testrun.delete'
  // Automation Source & Sync
  | 'automation.view'
  | 'automation.import'
  | 'automation.edit'
  | 'automation.delete'
  | 'automation.sync'
  | 'automation.view_source'
  | 'automation.manage_ids'
  | 'automation.view_analytics'
  | 'automation.execute'
  | 'automation.manage'
  // Automation Results & Ingestion
  | 'automation_result.view'
  | 'automation_result.import'
  // Reports
  | 'report.view'
  | 'report.create'
  // User Management
  | 'user.view'
  | 'user.create'
  | 'user.edit'
  | 'user.deactivate'
  | 'user.delete'
  // Team Management
  | 'team.view'
  | 'team.create'
  | 'team.edit'
  | 'team.delete'
  // Role & Permission Management
  | 'role.view'
  | 'role.create'
  | 'role.edit'
  | 'role.delete'
  | 'permission.manage'
  | 'scope.manage'
  // Label & Custom Field Management
  | 'label.view'
  | 'label.create'
  | 'label.edit'
  | 'label.delete'
  | 'customfield.view'
  | 'customfield.create'
  | 'customfield.edit'
  | 'customfield.delete'
  // Audit Log
  | 'audit.view';

export type ScopeType = 'workspace' | 'project' | 'suite' | 'folder' | 'testplan' | 'testrun';

export interface AccessGrant {
  id: string;
  roleId: string; // BuiltInRoleType or CustomRole id
  scopeType: ScopeType;
  scopeTargetId: string; // 'all' or projectId/suiteId etc.
  directPermissionsOverride?: PermissionKey[];
  assignedAt: string;
  assignedBy: string;
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  permissions: PermissionKey[];
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  handle?: string; // e.g. "core-qa"
  description: string;
  color: string;
  leadUserId?: string;
  memberIds: string[];
  projectIds?: string[];
  grants: AccessGrant[];
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string; // hex e.g. "#3b82f6"
  description?: string;
  category?: 'general' | 'automation' | 'compliance' | 'platform' | 'regression' | 'priority' | 'security';
  projectId?: string; // null / undefined for Global
  createdAt: string;
  updatedAt: string;
}
