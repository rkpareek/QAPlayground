export type RoleType = 'owner' | 'admin' | 'qa_lead' | 'qa' | 'automation_engineer' | 'developer' | 'viewer' | 'project_manager' | 'tester';

export * from './automation';

export interface UserInvitation {
  id: string;
  email: string;
  name?: string;
  role: RoleType;
  teamIds: string[];
  projectIds: string[]; // ['*'] for all or specific project IDs
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: RoleType;
  title: string;
  isOwner?: boolean;
  teams?: string[]; // team IDs
  projectIds?: string[]; // ['*'] for all or specific project IDs
  status?: 'active' | 'invited' | 'suspended' | 'deactivated';
  directGrants?: import('./automation').AccessGrant[];
  isDeactivated?: boolean;
  createdAt?: string;
  lastActiveAt?: string;
}

export type TestCasePriority = 'critical' | 'high' | 'medium' | 'low';
export type TestCaseSeverity = 'blocker' | 'critical' | 'major' | 'minor' | 'trivial';
export type TestCaseStatus = 'draft' | 'ready' | 'in_review' | 'approved' | 'deprecated' | 'archived';
export type ExecutionStatus = 'not_run' | 'passed' | 'failed' | 'blocked' | 'skipped' | 'retest' | 'in_progress';
export type RunStatus = 'not_started' | 'in_progress' | 'paused' | 'completed' | 'archived';
export type PlanStatus = 'draft' | 'planned' | 'in_progress' | 'at_risk' | 'completed' | 'cancelled' | 'active' | 'approved' | 'in_review' | 'archived';
export type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'reopened' | 'closed' | 'rejected';
export type DefectSeverity = 'blocker' | 'critical' | 'major' | 'minor' | 'trivial';
export type AutomationStatus = 'automated' | 'manual_only' | 'automation_planned' | 'automation_failed';
export type AutomationFramework = 'playwright' | 'cypress' | 'selenium' | 'jest' | 'pytest' | 'junit';

export type TestType =
  | 'functional'
  | 'regression'
  | 'smoke'
  | 'sanity'
  | 'integration'
  | 'system'
  | 'ui'
  | 'api'
  | 'security'
  | 'performance'
  | 'usability'
  | 'negative'
  | 'exploratory';

export interface TestCaseStep {
  id: string;
  stepNumber: number;
  action: string;
  testData?: string;
  expectedResult: string;
  isReusable?: boolean;
  reusableStepId?: string;
}

export interface TestCaseVersion {
  version: number;
  title: string;
  description: string;
  preconditions: string;
  steps: TestCaseStep[];
  priority: TestCasePriority;
  status: TestCaseStatus;
  updatedBy: string;
  updatedAt: string;
  changeSummary: string;
}

export interface TestCase {
  id: string; // e.g. OBANK-TC-0001
  projectId: string;
  suiteId: string;
  folderId: string;
  title: string;
  summary?: string;
  description: string;
  preconditions: string;
  testType: TestType;
  priority: TestCasePriority;
  severity: TestCaseSeverity;
  status: TestCaseStatus;
  automationStatus: AutomationStatus;
  automatedTestId?: string;
  testLevel?: 'unit' | 'integration' | 'e2e' | 'acceptance';
  component?: string;
  module?: string;
  feature?: string;
  ownerId: string;
  assigneeId?: string;
  tags: string[];
  environment?: string;
  estimatedDurationMinutes: number;
  steps: TestCaseStep[];
  parameters?: Record<string, string>;
  customFields?: Record<string, any>;
  version: number;
  history: TestCaseVersion[];
  linkedRequirementIds: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface TestSuite {
  id: string;
  projectId: string;
  name: string;
  description: string;
  ownerId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface TestFolder {
  id: string;
  projectId: string;
  suiteId: string;
  parentId: string | null; // null for root folder in suite
  name: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReusableStep {
  id: string;
  projectId: string;
  title: string;
  action: string;
  testData?: string;
  expectedResult: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestCaseTemplate {
  id: string;
  projectId: string;
  name: string;
  description: string;
  testType: TestType;
  priority: TestCasePriority;
  preconditions: string;
  defaultSteps: Omit<TestCaseStep, 'id'>[];
  tags: string[];
}

export interface TestPlan {
  id: string; // e.g. OBANK-PLAN-0001
  projectId: string;
  name: string;
  description: string;
  objective: string;
  scope: string;
  outOfScope: string;
  testStrategy: string;
  entryCriteria: string;
  exitCriteria: string;
  risks: string;
  assumptions: string;
  dependencies: string;
  ownerId: string;
  stakeholders: string[];
  startDate: string;
  endDate: string;
  releaseId?: string;
  milestone?: string;
  environmentId?: string;
  priority: TestCasePriority;
  status: PlanStatus;
  selectedTestCaseIds: string[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface TestStepResult {
  stepId: string;
  status: ExecutionStatus;
  actualResult?: string;
  comment?: string;
}

export interface TestRunItem {
  id: string; // run-item unique id
  runId: string;
  testCaseId: string;
  testCaseVersion: number;
  testCaseSnapshot: TestCase; // Preserves historical definition
  status: ExecutionStatus;
  stepResults: TestStepResult[];
  assignedToId?: string;
  executedById?: string;
  executedAt?: string;
  durationSeconds?: number;
  notes?: string;
  defectIds: string[];
  attachments?: { name: string; url: string; type: string }[];
}

export interface TestRun {
  id: string; // e.g. OBANK-RUN-0001
  projectId: string;
  runGroupId?: string;
  testPlanId?: string;
  name: string;
  description: string;
  releaseId?: string;
  milestone?: string;
  environmentId: string;
  buildVersion: string;
  branchLabel?: string;
  startDate: string;
  endDate?: string;
  ownerId: string;
  assignedUserIds: string[];
  status: RunStatus;
  items: TestRunItem[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface TestRunGroup {
  id: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Environment {
  id: string;
  projectId: string;
  name: string;
  type: 'dev' | 'qa' | 'staging' | 'uat' | 'prod';
  url: string;
  browser?: string;
  os?: string;
  device?: string;
  version?: string;
  description?: string;
  isDefault?: boolean;
}

export interface Release {
  id: string;
  projectId: string;
  name: string;
  version: string;
  description: string;
  startDate: string;
  releaseDate: string;
  status: 'planning' | 'in_progress' | 'code_freeze' | 'released' | 'archived';
}

export interface Requirement {
  id: string; // e.g. OBANK-REQ-0001
  projectId: string;
  title: string;
  description: string;
  priority: TestCasePriority;
  status: 'draft' | 'in_review' | 'approved' | 'implemented' | 'verified' | 'rejected' | 'in_progress';
  ownerId: string;
  releaseId?: string;
  tags: string[];
  linkedTestCaseIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DefectComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Defect {
  id: string; // e.g. OBANK-BUG-0001
  projectId: string;
  title: string;
  description: string;
  severity: DefectSeverity;
  priority: TestCasePriority;
  status: DefectStatus;
  assigneeId?: string;
  reporterId: string;
  reporter?: string;
  environmentId?: string;
  buildVersion?: string;
  linkedTestCaseId?: string;
  linkedRequirementId?: string;
  linkedTestRunId?: string;
  linkedRunId?: string;
  stepsToReproduce?: string;
  actualResult?: string;
  actualBehavior?: string;
  expectedResult?: string;
  expectedBehavior?: string;
  tags: string[];
  comments: DefectComment[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomatedTest {
  id: string; // e.g. OBANK-AUTO-0001
  projectId: string;
  name: string;
  framework: AutomationFramework;
  language: 'typescript' | 'javascript' | 'python' | 'java';
  repository: string;
  filePath: string;
  testPath: string;
  suite: string;
  tags: string[];
  status: 'active' | 'quarantined' | 'deprecated';
  lastResult: ExecutionStatus;
  lastRunAt?: string;
  durationMs: number;
  ownerId: string;
  linkedTestCaseId?: string;
  isFlaky?: boolean;
  failureCountLast10: number;
  flakinessScore?: number;
}

export interface AutomationResult {
  id: string;
  automationTestId: string;
  testIdRef?: string; // e.g. @T12345678
  suiteIdRef?: string; // e.g. @S12345678
  matchedTestCaseId?: string;
  testName: string;
  suiteName?: string;
  className?: string;
  status: ExecutionStatus;
  rawStatus?: string;
  durationMs: number;
  errorMessage?: string;
  stackTrace?: string;
  logs?: string[];
  stdout?: string;
  stderr?: string;
  screenshotUrl?: string;
  traceUrl?: string;
  sourceFile?: string;
  sourceLine?: number;
  comments?: { id: string; authorId: string; text: string; createdAt: string }[];
  linkedDefectId?: string;
}

export interface AutomationRun {
  id: string; // e.g. DEMO-ARUN-0001
  projectId: string;
  runName: string;
  framework: AutomationFramework | 'mocha_playwright_hybrid';
  runner?: string;
  environment: string;
  buildNumber: string;
  branch: string;
  commitHash: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  errors?: number;
  flaky: number;
  status: 'running' | 'completed' | 'aborted' | 'partial';
  isPartial?: boolean;
  internalTestRunId?: string; // e.g. DEMO-RUN-0001
  externalRunId?: string; // e.g. gitlab-1847-99123
  runGroupId?: string;
  rawResultHash?: string;
  pipelineMetadata?: import('./automation').GitLabPipelineMetadata;
  unmatchedCount?: number;
  logs?: string[];
  results: AutomationResult[];
}

export interface ActivityLog {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  entityType: 'test_case' | 'test_run' | 'test_plan' | 'defect' | 'requirement' | 'suite' | 'folder' | 'automation' | 'team' | 'role' | 'project' | 'custom_field' | 'user' | 'label';
  entityId: string;
  entityName: string;
  details?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'run_completed' | 'test_failed' | 'defect_created' | 'mention';
  read: boolean;
  linkView?: string;
  linkEntityId?: string;
  createdAt: string;
}

export interface SavedView {
  id: string;
  projectId: string;
  name: string;
  entityType: 'test_cases' | 'test_runs' | 'defects';
  filters: Record<string, any>;
  isDefault?: boolean;
}

export type CustomFieldType =
  | 'text'
  | 'long_text'
  | 'number'
  | 'dropdown'
  | 'multi_select'
  | 'multiselect'
  | 'checkbox'
  | 'boolean'
  | 'date'
  | 'user'
  | 'url';

export interface CustomFieldOption {
  label: string;
  value: string;
  color?: string;
}

export interface CustomField {
  id: string;
  projectId: string; // 'all' or specific projectId
  name: string;
  key: string;
  type: CustomFieldType;
  options?: string[]; // simple options or values
  customOptions?: CustomFieldOption[];
  defaultValue?: any;
  required: boolean;
  description?: string;
  placeholder?: string;
  appliesTo?: 'test_case' | 'test_run' | 'defect';
  position?: number;
}

export interface Project {
  id: string;
  name: string;
  key: string; // e.g. OBANK
  description: string;
  color: string;
  ownerId: string;
  status: 'active' | 'archived';
  defaultEnvironmentId: string;
  createdAt: string;
  updatedAt: string;
}

export type NavSection =
  | 'dashboard'
  | 'repository'
  | 'test-plans'
  | 'test-runs'
  | 'test-execution'
  | 'requirements'
  | 'traceability'
  | 'defects'
  | 'automation'
  | 'automation-tests'
  | 'automation-runs'
  | 'automation-analytics'
  | 'analytics'
  | 'reports'
  | 'my-work'
  | 'users'
  | 'teams'
  | 'labels'
  | 'custom-fields'
  | 'documentation'
  | 'settings'
  | 'audit-log';

// Helper Aliases
export type RequirementPriority = TestCasePriority;
export type RequirementStatus = 'draft' | 'in_review' | 'approved' | 'implemented' | 'verified' | 'rejected' | 'in_progress';
export type DefectPriority = TestCasePriority;
export type TestPlanStatus = PlanStatus | 'active' | 'in_review';
export type TestCaseExecutionStatus = ExecutionStatus;

