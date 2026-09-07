import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  RoleType,
  UserInvitation,
  Project,
  TestSuite,
  TestFolder,
  TestCase,
  TestCaseStep,
  TestCaseVersion,
  TestPlan,
  TestRun,
  TestRunItem,
  TestStepResult,
  Environment,
  Release,
  Requirement,
  Defect,
  AutomatedTest,
  AutomationRun,
  ReusableStep,
  TestCaseTemplate,
  ActivityLog,
  Notification,
  SavedView,
  CustomField,
  NavSection,
  ExecutionStatus,
  RunStatus,
  Team,
  Label,
  CustomRole,
  GitLabIntegrationConfig,
  AutomationSourceFile,
  AutomationImportRecord,
  AutomationResultDocument,
  PermissionKey,
  ScopeType,
  TestCasePriority,
  TestType,
  AutomationStatus,
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_ENVIRONMENTS,
  INITIAL_RELEASES,
  INITIAL_SUITES,
  INITIAL_FOLDERS,
  INITIAL_REUSABLE_STEPS,
  INITIAL_TEMPLATES,
  INITIAL_REQUIREMENTS,
  INITIAL_TEST_CASES,
  INITIAL_TEST_PLANS,
  INITIAL_DEFECTS,
  INITIAL_TEST_RUNS,
  INITIAL_AUTOMATED_TESTS,
  INITIAL_AUTOMATION_RUNS,
  INITIAL_SAVED_VIEWS,
  INITIAL_CUSTOM_FIELDS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TEAMS,
  INITIAL_LABELS,
  INITIAL_INVITATIONS,
  INITIAL_CUSTOM_ROLES,
  INITIAL_GITLAB_CONFIG,
  INITIAL_AUTOMATION_SOURCE_FILES,
} from '../data/initialData';
import { evaluateUserPermission, AccessCheckResult } from '../utils/permissions';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation & Selection
  navSection: NavSection;
  setNavSection: (section: NavSection) => void;
  selectedSuiteId: string | null;
  setSelectedSuiteId: (id: string | null) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  selectedTestCaseId: string | null;
  setSelectedTestCaseId: (id: string | null) => void;
  selectedTestRunId: string | null;
  setSelectedTestRunId: (id: string | null) => void;
  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;
  selectedDefectId: string | null;
  setSelectedDefectId: (id: string | null) => void;
  selectedRequirementId: string | null;
  setSelectedRequirementId: (id: string | null) => void;
  selectedReportType: string;
  setSelectedReportType: (type: string) => void;

  // Active Project & User
  currentProject: Project;
  setCurrentProjectId: (id: string) => void;
  currentUser: User;
  setCurrentUserId: (id: string) => void;

  // Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isAstImportModalOpen: boolean;
  setIsAstImportModalOpen: (open: boolean) => void;
  isXmlImportModalOpen: boolean;
  setIsXmlImportModalOpen: (open: boolean) => void;
  isQuickAddModalOpen: boolean;
  setIsQuickAddModalOpen: (open: boolean) => void;
  isAccessInspectorOpen: boolean;
  setIsAccessInspectorOpen: (open: boolean) => void;
  quickCreateType: 'test_case' | 'test_plan' | 'test_run' | 'defect' | 'requirement' | null;
  setQuickCreateType: (type: 'test_case' | 'test_plan' | 'test_run' | 'defect' | 'requirement' | null) => void;
  activeAutomationTab: 'tests' | 'testcase_sync' | 'npm_reporter' | 'source_explorer' | 'pipeline' | 'analytics';
  setActiveAutomationTab: (tab: 'tests' | 'testcase_sync' | 'npm_reporter' | 'source_explorer' | 'pipeline' | 'analytics') => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Data Stores
  users: User[];
  projects: Project[];
  suites: TestSuite[];
  folders: TestFolder[];
  testCases: TestCase[];
  testPlans: TestPlan[];
  testRuns: TestRun[];
  environments: Environment[];
  releases: Release[];
  requirements: Requirement[];
  defects: Defect[];
  automatedTests: AutomatedTest[];
  automationRuns: AutomationRun[];
  reusableSteps: ReusableStep[];
  templates: TestCaseTemplate[];
  savedViews: SavedView[];
  customFields: CustomField[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  teams: Team[];
  labels: Label[];
  invitations: UserInvitation[];
  customRoles: CustomRole[];
  gitlabConfig: GitLabIntegrationConfig;
  sourceFiles: AutomationSourceFile[];
  importRecords: AutomationImportRecord[];
  resultDocuments: AutomationResultDocument[];

  // Mutations
  // Users & Invitations
  createUser: (userData: Partial<User>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  deactivateUser: (id: string) => void;
  reactivateUser: (id: string) => void;
  inviteUser: (inviteData: { email: string; name?: string; role: RoleType; teamIds?: string[]; projectIds?: string[] }) => UserInvitation;
  createInvitation: (inviteData: { email: string; name?: string; role: RoleType; teamIds?: string[]; projectIds?: string[] }) => UserInvitation;
  resendInvitation: (invitationId: string) => void;
  cancelInvitation: (invitationId: string) => void;
  revokeInvitation: (invitationId: string) => void;

  // Labels
  createLabel: (labelData: Partial<Label>) => Label;
  updateLabel: (id: string, updates: Partial<Label>) => void;
  deleteLabel: (id: string) => void;

  // Custom Fields
  updateCustomField: (id: string, updates: Partial<CustomField>) => void;
  deleteCustomField: (id: string) => void;
  // Quick Test Case Creation
  quickAddTestCase: (params: {
    title: string;
    suiteId: string;
    folderId?: string;
    priority?: TestCasePriority;
    tags?: string[];
    testType?: TestType;
    automationStatus?: AutomationStatus;
    description?: string;
  }) => TestCase;

  // Test Cases
  createTestCase: (testCaseData: Partial<TestCase>) => TestCase;
  updateTestCase: (id: string, updates: Partial<TestCase>, changeSummary?: string) => void;
  duplicateTestCase: (id: string) => TestCase;
  archiveTestCase: (id: string) => void;
  restoreTestCase: (id: string) => void;
  deleteTestCase: (id: string) => void;
  bulkUpdateTestCases: (ids: string[], updates: Partial<TestCase>) => void;
  bulkDeleteTestCases: (ids: string[]) => void;

  // Suites & Folders
  createSuite: (suiteData: Partial<TestSuite> | string) => TestSuite;
  updateSuite: (id: string, updates: Partial<TestSuite>) => void;
  deleteSuite: (id: string) => void;
  createFolder: (folderDataOrSuiteId: Partial<TestFolder> | string, name?: string) => TestFolder;
  updateFolder: (id: string, updates: Partial<TestFolder>) => void;
  deleteFolder: (id: string) => void;

  // Test Plans
  createTestPlan: (planData: Partial<TestPlan>) => TestPlan;
  updateTestPlan: (id: string, updates: Partial<TestPlan>) => void;
  deleteTestPlan: (id: string) => void;
  generateRunFromPlan: (planId: string, runName: string, environmentId: string, assignedUserIds: string[]) => TestRun;

  // Test Runs & Execution
  createTestRun: (runData: Partial<TestRun>, testCaseIds: string[]) => TestRun;
  updateTestRun: (id: string, updates: Partial<TestRun>) => void;
  deleteTestRun: (id: string) => void;
  updateRunStatus: (runId: string, status: RunStatus) => void;
  updateTestRunStatus: (runId: string, status: RunStatus) => void;
  recordTestExecution: (
    runId: string,
    testCaseId: string,
    status: ExecutionStatus,
    stepResults?: TestStepResult[],
    durationSeconds?: number,
    notes?: string,
    defectIds?: string[]
  ) => void;

  // Defects
  createDefect: (defectData: Partial<Defect>) => Defect;
  updateDefect: (id: string, updates: Partial<Defect>) => void;
  deleteDefect: (id: string) => void;
  addDefectComment: (defectId: string, text: string) => void;

  // Requirements
  createRequirement: (reqData: Partial<Requirement>) => Requirement;
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  deleteRequirement: (id: string) => void;

  // Automation & AST Integration
  createAutomatedTest: (autoData: Partial<AutomatedTest>) => AutomatedTest;
  updateAutomatedTest: (id: string, updates: Partial<AutomatedTest>) => void;
  deleteAutomatedTest: (id: string) => void;
  triggerMockAutomationRun: (framework?: string) => AutomationRun;
  saveSourceFiles: (files: AutomationSourceFile[], importRecord?: AutomationImportRecord) => void;
  deleteSourceFile: (fileId: string) => void;
  syncAutomationTags: (fileId: string, modifiedContent: string) => void;
  ingestXmlResults: (params: {
    document: AutomationResultDocument;
    targetRunOption: 'new_run' | 'existing_run' | 'external_ci';
    targetRunId?: string;
    runName?: string;
    environmentName?: string;
    autoCreateMissingCases?: boolean;
    targetSuiteId?: string;
  }) => { run: AutomationRun; createdTestCaseCount: number; matchedCount: number; unmatchedCount: number };
  addAutomationResultComment: (runId: string, resultId: string, text: string) => void;
  createDefectFromAutomationFailure: (runId: string, resultId: string) => Defect;
  syncAutomatedTestCasesIntoTms: (params: {
    targetSuiteId?: string;
    targetFolderId?: string;
    testsToSync: Array<{
      title: string;
      suiteName?: string;
      filePath?: string;
      framework?: string;
      testIdTag?: string;
      steps?: Array<{ action: string; expectedResult?: string }>;
      description?: string;
      priority?: TestCasePriority;
      testType?: TestType;
    }>;
  }) => { createdCount: number; updatedCount: number; testCaseIds: string[] };

  // CI/CD (GitLab)
  updateGitLabConfig: (updates: Partial<GitLabIntegrationConfig>) => void;
  triggerGitLabPipelineMock: () => Promise<AutomationRun>;

  // RBAC & Access Control
  hasPermission: (permission: PermissionKey, scopeType?: ScopeType, scopeTargetId?: string) => boolean;
  checkUserAccess: (userId: string, permission: PermissionKey, scopeType?: ScopeType, scopeTargetId?: string) => AccessCheckResult;
  createTeam: (teamData: Partial<Team>) => Team;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addUserToTeam: (teamId: string, userId: string) => void;
  removeUserFromTeam: (teamId: string, userId: string) => void;
  createCustomRole: (roleData: Partial<CustomRole>) => CustomRole;
  updateCustomRole: (id: string, updates: Partial<CustomRole>) => void;
  deleteCustomRole: (id: string) => void;

  // Reusable Steps & Templates
  createReusableStep: (stepData: Partial<ReusableStep>) => ReusableStep;
  updateReusableStep: (id: string, updates: Partial<ReusableStep>) => void;
  deleteReusableStep: (id: string) => void;
  createTemplate: (tmplData: Partial<TestCaseTemplate>) => TestCaseTemplate;

  // Saved Views
  createSavedView: (name: string, entityType: 'test_cases' | 'test_runs' | 'defects', filters: Record<string, any>) => SavedView;
  deleteSavedView: (id: string) => void;

  // Settings & Config
  createProject: (projectData: { name: string; key: string; description?: string; color?: string; ownerId?: string }) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  createEnvironment: (envData: Partial<Environment>) => Environment;
  updateEnvironment: (id: string, updates: Partial<Environment>) => void;
  deleteEnvironment: (id: string) => void;
  createRelease: (relData: Partial<Release>) => Release;
  updateRelease: (id: string, updates: Partial<Release>) => void;
  deleteRelease: (id: string) => void;
  createCustomField: (cfData: Partial<CustomField>) => CustomField;

  // Activity & Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  logActivity: (action: string, entityType: ActivityLog['entityType'], entityId: string, entityName: string, details?: string) => void;

  // Reset demo data
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'testforge_v1_';

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [navSection, setNavSection] = useState<NavSection>('dashboard');
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null);
  const [selectedTestRunId, setSelectedTestRunId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<string>('run_summary');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAstImportModalOpen, setIsAstImportModalOpen] = useState(false);
  const [isXmlImportModalOpen, setIsXmlImportModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isAccessInspectorOpen, setIsAccessInspectorOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<'test_case' | 'test_plan' | 'test_run' | 'defect' | 'requirement' | null>(null);
  const [activeAutomationTab, setActiveAutomationTab] = useState<'tests' | 'testcase_sync' | 'npm_reporter' | 'source_explorer' | 'pipeline' | 'analytics'>('tests');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Data Stores
  const [users, setUsers] = useState<User[]>(() => getStoredItem('users', INITIAL_USERS));
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = getStoredItem('projects', INITIAL_PROJECTS);
    // If old storage has proj-1, migrate it to proj-demo
    return stored.map((p: Project) => (p.id === 'proj-1' ? { ...p, id: 'proj-demo', name: 'Demo Project', key: 'DEMO' } : p));
  });
  const [currentProjectId, setCurrentProjectIdState] = useState<string>(() => {
    const stored = String(getStoredItem('curr_proj', 'proj-demo'));
    return stored === 'proj-1' ? 'proj-demo' : stored;
  });
  const [currentUserId, setCurrentUserIdState] = useState<string>(() => getStoredItem('curr_user', 'usr-1'));

  const [suites, setSuites] = useState<TestSuite[]>(() => getStoredItem('suites', INITIAL_SUITES));
  const [folders, setFolders] = useState<TestFolder[]>(() => getStoredItem('folders', INITIAL_FOLDERS));
  const [testCases, setTestCases] = useState<TestCase[]>(() => getStoredItem('testCases', INITIAL_TEST_CASES));
  const [testPlans, setTestPlans] = useState<TestPlan[]>(() => getStoredItem('testPlans', INITIAL_TEST_PLANS));
  const [testRuns, setTestRuns] = useState<TestRun[]>(() => getStoredItem('testRuns', INITIAL_TEST_RUNS));
  const [environments, setEnvironments] = useState<Environment[]>(() => getStoredItem('environments', INITIAL_ENVIRONMENTS));
  const [releases, setReleases] = useState<Release[]>(() => getStoredItem('releases', INITIAL_RELEASES));
  const [requirements, setRequirements] = useState<Requirement[]>(() => getStoredItem('requirements', INITIAL_REQUIREMENTS));
  const [defects, setDefects] = useState<Defect[]>(() => getStoredItem('defects', INITIAL_DEFECTS));
  const [automatedTests, setAutomatedTests] = useState<AutomatedTest[]>(() => getStoredItem('automatedTests', INITIAL_AUTOMATED_TESTS));
  const [automationRuns, setAutomationRuns] = useState<AutomationRun[]>(() => getStoredItem('automationRuns', INITIAL_AUTOMATION_RUNS));
  const [reusableSteps, setReusableSteps] = useState<ReusableStep[]>(() => getStoredItem('reusableSteps', INITIAL_REUSABLE_STEPS));
  const [templates, setTemplates] = useState<TestCaseTemplate[]>(() => getStoredItem('templates', INITIAL_TEMPLATES));
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => getStoredItem('savedViews', INITIAL_SAVED_VIEWS));
  const [customFields, setCustomFields] = useState<CustomField[]>(() => getStoredItem('customFields', INITIAL_CUSTOM_FIELDS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getStoredItem('activityLogs', INITIAL_ACTIVITY_LOGS));
  const [notifications, setNotifications] = useState<Notification[]>(() => getStoredItem('notifications', INITIAL_NOTIFICATIONS));
  const [teams, setTeams] = useState<Team[]>(() => getStoredItem('teams', INITIAL_TEAMS));
  const [labels, setLabels] = useState<Label[]>(() => getStoredItem('labels', INITIAL_LABELS));
  const [invitations, setInvitations] = useState<UserInvitation[]>(() => getStoredItem('invitations', INITIAL_INVITATIONS));
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => getStoredItem('customRoles', INITIAL_CUSTOM_ROLES));
  const [gitlabConfig, setGitlabConfig] = useState<GitLabIntegrationConfig>(() => getStoredItem('gitlabConfig', INITIAL_GITLAB_CONFIG));
  const [sourceFiles, setSourceFiles] = useState<AutomationSourceFile[]>(() => getStoredItem('sourceFiles', INITIAL_AUTOMATION_SOURCE_FILES));
  const [importRecords, setImportRecords] = useState<AutomationImportRecord[]>(() => getStoredItem('importRecords', []));
  const [resultDocuments, setResultDocuments] = useState<AutomationResultDocument[]>(() => getStoredItem('resultDocuments', []));

  // Sync to local storage
  useEffect(() => { setStoredItem('users', users); }, [users]);
  useEffect(() => { setStoredItem('projects', projects); }, [projects]);
  useEffect(() => { setStoredItem('curr_proj', currentProjectId); }, [currentProjectId]);
  useEffect(() => { setStoredItem('curr_user', currentUserId); }, [currentUserId]);
  useEffect(() => { setStoredItem('suites', suites); }, [suites]);
  useEffect(() => { setStoredItem('folders', folders); }, [folders]);
  useEffect(() => { setStoredItem('testCases', testCases); }, [testCases]);
  useEffect(() => { setStoredItem('testPlans', testPlans); }, [testPlans]);
  useEffect(() => { setStoredItem('testRuns', testRuns); }, [testRuns]);
  useEffect(() => { setStoredItem('environments', environments); }, [environments]);
  useEffect(() => { setStoredItem('releases', releases); }, [releases]);
  useEffect(() => { setStoredItem('requirements', requirements); }, [requirements]);
  useEffect(() => { setStoredItem('defects', defects); }, [defects]);
  useEffect(() => { setStoredItem('automatedTests', automatedTests); }, [automatedTests]);
  useEffect(() => { setStoredItem('automationRuns', automationRuns); }, [automationRuns]);
  useEffect(() => { setStoredItem('reusableSteps', reusableSteps); }, [reusableSteps]);
  useEffect(() => { setStoredItem('templates', templates); }, [templates]);
  useEffect(() => { setStoredItem('savedViews', savedViews); }, [savedViews]);
  useEffect(() => { setStoredItem('customFields', customFields); }, [customFields]);
  useEffect(() => { setStoredItem('activityLogs', activityLogs); }, [activityLogs]);
  useEffect(() => { setStoredItem('notifications', notifications); }, [notifications]);
  useEffect(() => { setStoredItem('teams', teams); }, [teams]);
  useEffect(() => { setStoredItem('labels', labels); }, [labels]);
  useEffect(() => { setStoredItem('invitations', invitations); }, [invitations]);
  useEffect(() => { setStoredItem('customRoles', customRoles); }, [customRoles]);
  useEffect(() => { setStoredItem('gitlabConfig', gitlabConfig); }, [gitlabConfig]);
  useEffect(() => { setStoredItem('sourceFiles', sourceFiles); }, [sourceFiles]);
  useEffect(() => { setStoredItem('importRecords', importRecords); }, [importRecords]);
  useEffect(() => { setStoredItem('resultDocuments', resultDocuments); }, [resultDocuments]);

  // Derived current project & user
  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0] || INITIAL_PROJECTS[0];
  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  const setCurrentProjectId = (id: string) => {
    setCurrentProjectIdState(id);
    setSelectedSuiteId(null);
    setSelectedFolderId(null);
    setSelectedTestCaseId(null);
    setSelectedTestRunId(null);
    setSelectedPlanId(null);
    setSelectedDefectId(null);
    setSelectedRequirementId(null);
  };

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id);
  };

  // Activity Logger helper
  const logActivity = useCallback((action: string, entityType: ActivityLog['entityType'], entityId: string, entityName: string, details?: string) => {
    const newLog: ActivityLog = {
      id: 'act-' + Date.now(),
      projectId: currentProjectId,
      userId: currentUserId,
      action,
      entityType,
      entityId,
      entityName,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  }, [currentProjectId, currentUserId]);

  // TEST CASES CRUD
  const createTestCase = (testCaseData: Partial<TestCase>): TestCase => {
    const projectCases = testCases.filter((tc) => tc.projectId === currentProject.id);
    const nextNumber = projectCases.length + 1;
    const formattedId = `${currentProject.key}-TC-${String(nextNumber).padStart(4, '0')}`;

    const defaultSuite = suites.find((s) => s.projectId === currentProject.id) || suites[0];
    const defaultFolder = folders.find((f) => f.projectId === currentProject.id && f.suiteId === defaultSuite?.id) || folders[0];

    const newTestCase: TestCase = {
      id: formattedId,
      projectId: currentProject.id,
      suiteId: testCaseData.suiteId || defaultSuite?.id || 'suite-auth',
      folderId: testCaseData.folderId || defaultFolder?.id || 'fld-login',
      title: testCaseData.title || 'Untitled Test Case',
      summary: testCaseData.summary || '',
      description: testCaseData.description || '',
      preconditions: testCaseData.preconditions || '',
      testType: testCaseData.testType || 'functional',
      priority: testCaseData.priority || 'medium',
      severity: testCaseData.severity || 'major',
      status: testCaseData.status || 'ready',
      automationStatus: testCaseData.automationStatus || 'manual_only',
      automatedTestId: testCaseData.automatedTestId,
      testLevel: testCaseData.testLevel || 'e2e',
      component: testCaseData.component || '',
      module: testCaseData.module || '',
      feature: testCaseData.feature || '',
      ownerId: testCaseData.ownerId || currentUser.id,
      assigneeId: testCaseData.assigneeId || currentUser.id,
      tags: testCaseData.tags || ['functional'],
      environment: testCaseData.environment || 'QA Sandbox',
      estimatedDurationMinutes: testCaseData.estimatedDurationMinutes || 3,
      steps: testCaseData.steps && testCaseData.steps.length > 0 ? testCaseData.steps : [
        {
          id: 'step-1',
          stepNumber: 1,
          action: 'Perform test verification action',
          expectedResult: 'Expected outcome is satisfied.',
        },
      ],
      parameters: testCaseData.parameters || {},
      customFields: testCaseData.customFields || {},
      version: 1,
      history: [],
      linkedRequirementIds: testCaseData.linkedRequirementIds || [],
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedBy: currentUser.name,
      updatedAt: new Date().toISOString(),
    };

    setTestCases((prev) => [newTestCase, ...prev]);
    logActivity('created', 'test_case', newTestCase.id, newTestCase.title);
    addToast({
      type: 'success',
      title: `Created ${newTestCase.id}`,
      message: newTestCase.title,
    });
    return newTestCase;
  };

  const quickAddTestCase = ({
    title,
    suiteId,
    folderId,
    priority = 'medium',
    tags = ['regression'],
    testType = 'functional',
    automationStatus = 'manual_only',
    description = '',
  }: {
    title: string;
    suiteId: string;
    folderId?: string;
    priority?: TestCasePriority;
    tags?: string[];
    testType?: TestType;
    automationStatus?: AutomationStatus;
    description?: string;
  }): TestCase => {
    const projectCases = testCases.filter((tc) => tc.projectId === currentProject.id);
    const nextNumber = projectCases.length + 1;
    const formattedId = `${currentProject.key}-TC-${String(nextNumber).padStart(4, '0')}`;

    const newTestCase: TestCase = {
      id: formattedId,
      projectId: currentProject.id,
      suiteId,
      folderId: folderId || '',
      title: title.trim(),
      summary: title.trim(),
      description: description || `Quick-added test case specification for ${title.trim()}`,
      preconditions: '',
      testType,
      priority,
      severity: priority === 'critical' ? 'blocker' : priority === 'high' ? 'critical' : 'major',
      status: 'ready',
      automationStatus,
      testLevel: 'e2e',
      component: 'Core',
      module: 'General',
      ownerId: currentUser.id,
      assigneeId: currentUser.id,
      tags,
      environment: 'QA Sandbox',
      estimatedDurationMinutes: 3,
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          action: `Execute verification steps for: ${title.trim()}`,
          expectedResult: 'System fulfills specification without exceptions.',
        },
      ],
      parameters: {},
      customFields: {},
      version: 1,
      history: [],
      linkedRequirementIds: [],
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedBy: currentUser.name,
      updatedAt: new Date().toISOString(),
    };

    setTestCases((prev) => [newTestCase, ...prev]);
    logActivity('created', 'test_case', newTestCase.id, newTestCase.title, 'Quick-created test case');
    addToast({
      type: 'success',
      title: `Quick-added ${newTestCase.id}`,
      message: newTestCase.title,
    });
    return newTestCase;
  };

  const updateTestCase = (id: string, updates: Partial<TestCase>, changeSummary?: string) => {
    setTestCases((prev) =>
      prev.map((tc) => {
        if (tc.id !== id) return tc;

        const newVersionNumber = tc.version + 1;
        const newHistoryItem: TestCaseVersion = {
          version: tc.version,
          title: tc.title,
          description: tc.description,
          preconditions: tc.preconditions,
          steps: [...tc.steps],
          priority: tc.priority,
          status: tc.status,
          updatedBy: tc.updatedBy,
          updatedAt: tc.updatedAt,
          changeSummary: changeSummary || 'Updated test case metadata or steps.',
        };

        const updated: TestCase = {
          ...tc,
          ...updates,
          version: newVersionNumber,
          history: [newHistoryItem, ...(tc.history || [])],
          updatedBy: currentUser.name,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      })
    );
    logActivity('updated', 'test_case', id, updates.title || id, changeSummary);
    addToast({
      type: 'success',
      title: `Updated ${id}`,
      message: changeSummary || 'Changes saved successfully.',
    });
  };

  const duplicateTestCase = (id: string): TestCase => {
    const existing = testCases.find((tc) => tc.id === id);
    if (!existing) throw new Error('Test case not found');

    const projectCases = testCases.filter((tc) => tc.projectId === currentProject.id);
    const nextNumber = projectCases.length + 1;
    const formattedId = `${currentProject.key}-TC-${String(nextNumber).padStart(4, '0')}`;

    const duplicated: TestCase = {
      ...existing,
      id: formattedId,
      title: `${existing.title} (Copy)`,
      version: 1,
      history: [],
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedBy: currentUser.name,
      updatedAt: new Date().toISOString(),
    };

    setTestCases((prev) => [duplicated, ...prev]);
    logActivity('duplicated', 'test_case', duplicated.id, duplicated.title);
    addToast({
      type: 'info',
      title: `Duplicated to ${duplicated.id}`,
      message: duplicated.title,
    });
    return duplicated;
  };

  const archiveTestCase = (id: string) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, isArchived: true, status: 'archived', updatedAt: new Date().toISOString() } : tc))
    );
    logActivity('archived', 'test_case', id, id);
    addToast({ type: 'warning', title: `Archived ${id}` });
  };

  const restoreTestCase = (id: string) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, isArchived: false, status: 'ready', updatedAt: new Date().toISOString() } : tc))
    );
    logActivity('restored', 'test_case', id, id);
    addToast({ type: 'success', title: `Restored ${id}` });
  };

  const deleteTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
    logActivity('deleted', 'test_case', id, id);
    addToast({ type: 'error', title: `Deleted ${id}` });
  };

  const bulkUpdateTestCases = (ids: string[], updates: Partial<TestCase>) => {
    setTestCases((prev) =>
      prev.map((tc) => {
        if (ids.includes(tc.id)) {
          return {
            ...tc,
            ...updates,
            updatedBy: currentUser.name,
            updatedAt: new Date().toISOString(),
          };
        }
        return tc;
      })
    );
    addToast({
      type: 'success',
      title: `Bulk updated ${ids.length} test cases`,
    });
  };

  const bulkDeleteTestCases = (ids: string[]) => {
    setTestCases((prev) => prev.filter((tc) => !ids.includes(tc.id)));
    addToast({ type: 'warning', title: `Deleted ${ids.length} test cases` });
  };

  // SUITES & FOLDERS
  const createSuite = (suiteData: Partial<TestSuite> | string): TestSuite => {
    const data = typeof suiteData === 'string' ? { name: suiteData } : suiteData;
    const newSuite: TestSuite = {
      id: 'suite-' + Date.now().toString(36),
      projectId: currentProject.id,
      name: data.name || 'New Test Suite',
      description: data.description || '',
      ownerId: data.ownerId || currentUser.id,
      tags: data.tags || ['core'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSuites((prev) => [...prev, newSuite]);
    logActivity('created', 'suite', newSuite.id, newSuite.name);
    addToast({ type: 'success', title: `Created Suite`, message: newSuite.name });
    return newSuite;
  };

  const updateSuite = (id: string, updates: Partial<TestSuite>) => {
    setSuites((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)));
    addToast({ type: 'success', title: `Updated Suite` });
  };

  const deleteSuite = (id: string) => {
    setSuites((prev) => prev.filter((s) => s.id !== id));
    setFolders((prev) => prev.filter((f) => f.suiteId !== id));
    addToast({ type: 'warning', title: `Deleted Suite and Subfolders` });
  };

  const createFolder = (folderDataOrSuiteId: Partial<TestFolder> | string, name?: string): TestFolder => {
    const data: Partial<TestFolder> =
      typeof folderDataOrSuiteId === 'string'
        ? { suiteId: folderDataOrSuiteId, name: name || 'New Folder' }
        : folderDataOrSuiteId;
    const newFolder: TestFolder = {
      id: 'fld-' + Date.now().toString(36),
      projectId: currentProject.id,
      suiteId: data.suiteId || suites[0]?.id || 'suite-auth',
      parentId: data.parentId || null,
      name: data.name || 'New Folder',
      description: data.description || '',
      order: (folders.filter((f) => f.suiteId === data.suiteId).length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newFolder]);
    logActivity('created', 'folder', newFolder.id, newFolder.name);
    addToast({ type: 'success', title: `Created Folder`, message: newFolder.name });
    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<TestFolder>) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)));
    addToast({ type: 'success', title: `Updated Folder` });
  };

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    addToast({ type: 'warning', title: `Deleted Folder` });
  };

  // TEST PLANS
  const createTestPlan = (planData: Partial<TestPlan>): TestPlan => {
    const projectPlans = testPlans.filter((p) => p.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-PLAN-${String(projectPlans.length + 1).padStart(4, '0')}`;

    const newPlan: TestPlan = {
      id: formattedId,
      projectId: currentProject.id,
      name: planData.name || 'New Test Plan',
      description: planData.description || '',
      objective: planData.objective || '',
      scope: planData.scope || '',
      outOfScope: planData.outOfScope || '',
      testStrategy: planData.testStrategy || '',
      entryCriteria: planData.entryCriteria || '',
      exitCriteria: planData.exitCriteria || '',
      risks: planData.risks || '',
      assumptions: planData.assumptions || '',
      dependencies: planData.dependencies || '',
      ownerId: planData.ownerId || currentUser.id,
      stakeholders: planData.stakeholders || [currentUser.id],
      startDate: planData.startDate || new Date().toISOString().split('T')[0],
      endDate: planData.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      releaseId: planData.releaseId || releases[0]?.id,
      milestone: planData.milestone || 'Milestone 1',
      environmentId: planData.environmentId || environments[0]?.id,
      priority: planData.priority || 'high',
      status: planData.status || 'planned',
      selectedTestCaseIds: planData.selectedTestCaseIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTestPlans((prev) => [newPlan, ...prev]);
    logActivity('created', 'test_plan', newPlan.id, newPlan.name);
    addToast({ type: 'success', title: `Created ${newPlan.id}`, message: newPlan.name });
    return newPlan;
  };

  const updateTestPlan = (id: string, updates: Partial<TestPlan>) => {
    setTestPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)));
    addToast({ type: 'success', title: `Updated ${id}` });
  };

  const deleteTestPlan = (id: string) => {
    setTestPlans((prev) => prev.filter((p) => p.id !== id));
    addToast({ type: 'warning', title: `Deleted ${id}` });
  };

  const generateRunFromPlan = (planId: string, runName: string, environmentId: string, assignedUserIds: string[]): TestRun => {
    const plan = testPlans.find((p) => p.id === planId);
    if (!plan) throw new Error('Test Plan not found');

    const projectRuns = testRuns.filter((r) => r.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-RUN-${String(projectRuns.length + 1).padStart(4, '0')}`;

    const items: TestRunItem[] = plan.selectedTestCaseIds.map((tcId, index) => {
      const tc = testCases.find((c) => c.id === tcId);
      const assignedToId = assignedUserIds.length > 0 ? assignedUserIds[index % assignedUserIds.length] : currentUser.id;

      return {
        id: `item-${formattedId}-${index + 1}`,
        runId: formattedId,
        testCaseId: tcId,
        testCaseVersion: tc ? tc.version : 1,
        testCaseSnapshot: tc || ({} as TestCase),
        status: 'not_run',
        stepResults: [],
        assignedToId,
        defectIds: [],
      };
    });

    const newRun: TestRun = {
      id: formattedId,
      projectId: currentProject.id,
      testPlanId: planId,
      name: runName || `${plan.name} - Execution`,
      description: `Execution cycle generated from Plan ${plan.id}`,
      releaseId: plan.releaseId,
      environmentId: environmentId || plan.environmentId || environments[0]?.id || 'env-qa',
      buildVersion: 'v2.5.0-rc3',
      startDate: new Date().toISOString(),
      ownerId: currentUser.id,
      assignedUserIds: assignedUserIds.length > 0 ? assignedUserIds : [currentUser.id],
      status: 'in_progress',
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTestRuns((prev) => [newRun, ...prev]);
    logActivity('generated run', 'test_run', newRun.id, newRun.name);
    addToast({ type: 'success', title: `Generated ${newRun.id}`, message: `${items.length} test cases initialized.` });
    return newRun;
  };

  // TEST RUNS & EXECUTION
  const createTestRun = (runData: Partial<TestRun>, testCaseIds: string[]): TestRun => {
    const projectRuns = testRuns.filter((r) => r.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-RUN-${String(projectRuns.length + 1).padStart(4, '0')}`;

    const assignedUsers = runData.assignedUserIds && runData.assignedUserIds.length > 0 ? runData.assignedUserIds : [currentUser.id];

    const items: TestRunItem[] = testCaseIds.map((tcId, idx) => {
      const tc = testCases.find((c) => c.id === tcId);
      return {
        id: `item-${formattedId}-${idx + 1}`,
        runId: formattedId,
        testCaseId: tcId,
        testCaseVersion: tc ? tc.version : 1,
        testCaseSnapshot: tc || ({} as TestCase),
        status: 'not_run',
        stepResults: [],
        assignedToId: assignedUsers[idx % assignedUsers.length],
        defectIds: [],
      };
    });

    const newRun: TestRun = {
      id: formattedId,
      projectId: currentProject.id,
      name: runData.name || 'New Test Run',
      description: runData.description || '',
      testPlanId: runData.testPlanId,
      releaseId: runData.releaseId || releases[0]?.id,
      milestone: runData.milestone || 'Milestone',
      environmentId: runData.environmentId || environments[0]?.id || 'env-qa',
      buildVersion: runData.buildVersion || '2.5.0-rc3',
      branchLabel: runData.branchLabel || 'main',
      startDate: new Date().toISOString(),
      ownerId: runData.ownerId || currentUser.id,
      assignedUserIds: assignedUsers,
      status: 'in_progress',
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTestRuns((prev) => [newRun, ...prev]);
    logActivity('created', 'test_run', newRun.id, newRun.name);
    addToast({ type: 'success', title: `Created ${newRun.id}`, message: `${items.length} test cases assigned.` });
    return newRun;
  };

  const updateTestRun = (id: string, updates: Partial<TestRun>) => {
    setTestRuns((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)));
    addToast({ type: 'success', title: `Updated ${id}` });
  };

  const deleteTestRun = (id: string) => {
    setTestRuns((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'warning', title: `Deleted ${id}` });
  };

  const updateRunStatus = (runId: string, status: RunStatus) => {
    setTestRuns((prev) =>
      prev.map((r) => {
        if (r.id === runId) {
          return {
            ...r,
            status,
            endDate: status === 'completed' ? new Date().toISOString() : r.endDate,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    addToast({ type: 'info', title: `Run status updated to ${status.replace('_', ' ')}` });
  };

  const recordTestExecution = (
    runId: string,
    testCaseId: string,
    status: ExecutionStatus,
    stepResults?: TestStepResult[],
    durationSeconds?: number,
    notes?: string,
    defectIds?: string[]
  ) => {
    setTestRuns((prevRuns) =>
      prevRuns.map((run) => {
        if (run.id !== runId) return run;

        const updatedItems = run.items.map((item) => {
          if (item.testCaseId === testCaseId) {
            return {
              ...item,
              status,
              stepResults: stepResults || item.stepResults,
              executedById: currentUser.id,
              executedAt: new Date().toISOString(),
              durationSeconds: durationSeconds !== undefined ? durationSeconds : item.durationSeconds || 30,
              notes: notes !== undefined ? notes : item.notes,
              defectIds: defectIds ? Array.from(new Set([...item.defectIds, ...defectIds])) : item.defectIds,
            };
          }
          return item;
        });

        // Check if all executed
        const allExecuted = updatedItems.every((item) => item.status !== 'not_run');

        return {
          ...run,
          status: allExecuted ? 'completed' : run.status === 'not_started' ? 'in_progress' : run.status,
          endDate: allExecuted ? new Date().toISOString() : run.endDate,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    logActivity(`executed (${status})`, 'test_case', testCaseId, testCaseId, notes);

    addToast({
      type: status === 'passed' ? 'success' : status === 'failed' ? 'error' : 'warning',
      title: `${testCaseId}: ${status.toUpperCase()}`,
      message: notes || 'Execution result recorded.',
    });
  };

  // DEFECTS
  const createDefect = (defectData: Partial<Defect>): Defect => {
    const projectDefects = defects.filter((d) => d.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-BUG-${String(projectDefects.length + 1).padStart(4, '0')}`;

    const newDefect: Defect = {
      id: formattedId,
      projectId: currentProject.id,
      title: defectData.title || 'Untitled Defect',
      description: defectData.description || '',
      severity: defectData.severity || 'major',
      priority: defectData.priority || 'high',
      status: defectData.status || 'open',
      assigneeId: defectData.assigneeId || currentUser.id,
      reporterId: defectData.reporterId || currentUser.id,
      environmentId: defectData.environmentId || environments[0]?.id,
      buildVersion: defectData.buildVersion || '2.5.0-rc3',
      linkedTestCaseId: defectData.linkedTestCaseId,
      linkedTestRunId: defectData.linkedTestRunId,
      stepsToReproduce: defectData.stepsToReproduce || '',
      actualResult: defectData.actualResult || '',
      expectedResult: defectData.expectedResult || '',
      tags: defectData.tags || ['bug'],
      comments: defectData.comments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDefects((prev) => [newDefect, ...prev]);

    // Link defect to test run item if applicable
    if (defectData.linkedTestRunId && defectData.linkedTestCaseId) {
      setTestRuns((prev) =>
        prev.map((r) => {
          if (r.id === defectData.linkedTestRunId) {
            return {
              ...r,
              items: r.items.map((it) =>
                it.testCaseId === defectData.linkedTestCaseId
                  ? { ...it, defectIds: Array.from(new Set([...it.defectIds, newDefect.id])) }
                  : it
              ),
            };
          }
          return r;
        })
      );
    }

    logActivity('logged defect', 'defect', newDefect.id, newDefect.title);
    addToast({ type: 'error', title: `Defect Logged ${newDefect.id}`, message: newDefect.title });
    return newDefect;
  };

  const updateDefect = (id: string, updates: Partial<Defect>) => {
    setDefects((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d)));
    addToast({ type: 'info', title: `Updated Defect ${id}` });
  };

  const deleteDefect = (id: string) => {
    setDefects((prev) => prev.filter((d) => d.id !== id));
    addToast({ type: 'warning', title: `Deleted Defect ${id}` });
  };

  const addDefectComment = (defectId: string, text: string) => {
    const comment = {
      id: 'cmt-' + Date.now(),
      authorId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    };
    setDefects((prev) =>
      prev.map((d) => (d.id === defectId ? { ...d, comments: [...(d.comments || []), comment], updatedAt: new Date().toISOString() } : d))
    );
    addToast({ type: 'success', title: 'Comment added' });
  };

  // REQUIREMENTS
  const createRequirement = (reqData: Partial<Requirement>): Requirement => {
    const projectReqs = requirements.filter((r) => r.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-REQ-${String(projectReqs.length + 1).padStart(4, '0')}`;

    const newReq: Requirement = {
      id: formattedId,
      projectId: currentProject.id,
      title: reqData.title || 'New Requirement',
      description: reqData.description || '',
      priority: reqData.priority || 'high',
      status: reqData.status || 'approved',
      ownerId: reqData.ownerId || currentUser.id,
      releaseId: reqData.releaseId || releases[0]?.id,
      tags: reqData.tags || ['spec'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequirements((prev) => [newReq, ...prev]);
    logActivity('created', 'requirement', newReq.id, newReq.title);
    addToast({ type: 'success', title: `Created ${newReq.id}`, message: newReq.title });
    return newReq;
  };

  const updateRequirement = (id: string, updates: Partial<Requirement>) => {
    setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)));
    addToast({ type: 'success', title: `Updated ${id}` });
  };

  const deleteRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'warning', title: `Deleted ${id}` });
  };

  // AUTOMATION
  const createAutomatedTest = (autoData: Partial<AutomatedTest>): AutomatedTest => {
    const projectAutos = automatedTests.filter((a) => a.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-AUTO-${String(projectAutos.length + 1).padStart(4, '0')}`;

    const newAuto: AutomatedTest = {
      id: formattedId,
      projectId: currentProject.id,
      name: autoData.name || 'new.spec.ts',
      framework: autoData.framework || 'playwright',
      language: autoData.language || 'typescript',
      repository: autoData.repository || 'github.com/org/repo',
      filePath: autoData.filePath || 'tests/e2e/test.spec.ts',
      testPath: autoData.testPath || 'Suite > Test',
      suite: autoData.suite || 'Main Suite',
      tags: autoData.tags || ['ci'],
      status: 'active',
      lastResult: 'passed',
      lastRunAt: new Date().toISOString(),
      durationMs: 2500,
      ownerId: currentUser.id,
      linkedTestCaseId: autoData.linkedTestCaseId,
      isFlaky: false,
      failureCountLast10: 0,
    };

    setAutomatedTests((prev) => [newAuto, ...prev]);
    addToast({ type: 'success', title: `Added Automation Test ${newAuto.id}` });
    return newAuto;
  };

  const updateAutomatedTest = (id: string, updates: Partial<AutomatedTest>) => {
    setAutomatedTests((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    addToast({ type: 'info', title: `Updated Automated Test ${id}` });
  };

  const deleteAutomatedTest = (id: string) => {
    setAutomatedTests((prev) => prev.filter((a) => a.id !== id));
    addToast({ type: 'warning', title: `Deleted Automated Test ${id}` });
  };

  const saveSourceFiles = (files: AutomationSourceFile[], importRecord?: AutomationImportRecord) => {
    setSourceFiles((prev) => {
      const existingMap = new Map(prev.map((f) => [f.path, f]));
      for (const file of files) {
        existingMap.set(file.path, file);
      }
      return Array.from(existingMap.values());
    });

    if (importRecord) {
      setImportRecords((prev) => [importRecord, ...prev]);
    }

    logActivity('imported', 'automation', `src-batch-${Date.now()}`, `${files.length} Source Files`, `Imported AST for ${files.length} test files`);
    addToast({
      type: 'success',
      title: 'Source Files Saved',
      message: `Parsed and synchronized ${files.length} test specification files.`,
    });
  };

  const deleteSourceFile = (fileId: string) => {
    setSourceFiles((prev) => prev.filter((f) => f.id !== fileId));
    addToast({ type: 'warning', title: 'Source file removed from explorer' });
  };

  const syncAutomationTags = (fileId: string, modifiedContent: string) => {
    setSourceFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content: modifiedContent, lastModifiedAt: new Date().toISOString() } : f))
    );
    addToast({ type: 'success', title: 'Tags Synchronized', message: 'Injected identifiers updated successfully.' });
  };

  const ingestXmlResults = ({
    document,
    targetRunOption,
    targetRunId,
    runName,
    environmentName,
    autoCreateMissingCases = true,
    targetSuiteId,
  }: {
    document: AutomationResultDocument;
    targetRunOption: 'new_run' | 'existing_run' | 'external_ci';
    targetRunId?: string;
    runName?: string;
    environmentName?: string;
    autoCreateMissingCases?: boolean;
    targetSuiteId?: string;
  }): { run: AutomationRun; createdTestCaseCount: number; matchedCount: number; unmatchedCount: number } => {
    setResultDocuments((prev) => [document, ...prev]);

    const projectAutoRuns = automationRuns.filter((r) => r.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-ARUN-${String(projectAutoRuns.length + 1).padStart(4, '0')}`;

    let createdTestCaseCount = 0;
    const defaultSuite = suites.find((s) => s.projectId === currentProject.id) || suites[0];
    const destinationSuiteId = targetSuiteId || defaultSuite?.id || 'suite-default';

    // Auto-create missing test cases if option is enabled
    if (autoCreateMissingCases) {
      const existingTitles = new Set(testCases.map((tc) => tc.title.toLowerCase().trim()));
      const newCasesToAdd: TestCase[] = [];

      for (const unmatched of document.normalizedResults.filter((r) => r.matchType === 'unmatched')) {
        if (!existingTitles.has(unmatched.cleanTestName.toLowerCase().trim())) {
          const nextIndex = testCases.length + newCasesToAdd.length + 1;
          const newTc: TestCase = {
            id: `${currentProject.key}-TC-${String(nextIndex).padStart(4, '0')}`,
            projectId: currentProject.id,
            suiteId: destinationSuiteId,
            folderId: '',
            title: unmatched.cleanTestName,
            summary: unmatched.cleanTestName,
            description: `Auto-generated from JUnit XML ingestion of test: ${unmatched.testName}`,
            preconditions: '',
            testType: 'functional',
            priority: 'medium',
            severity: 'major',
            status: 'ready',
            automationStatus: 'automated',
            testLevel: 'e2e',
            component: unmatched.className ? unmatched.className.split('/')[0] : 'Automation',
            module: 'CI Ingestion',
            ownerId: currentUser.id,
            assigneeId: currentUser.id,
            tags: ['automated', 'junit-xml'],
            environment: environmentName || 'CI Pipeline',
            estimatedDurationMinutes: 3,
            steps: [
              {
                id: 'step-1',
                stepNumber: 1,
                action: `Execute automated test suite: ${unmatched.suiteName || unmatched.className || 'Test Runner'}`,
                expectedResult: 'Passes with exit status 0',
              },
            ],
            parameters: {},
            customFields: {},
            version: 1,
            history: [],
            linkedRequirementIds: [],
            createdBy: 'JUnit Ingester',
            createdAt: new Date().toISOString(),
            updatedBy: 'JUnit Ingester',
            updatedAt: new Date().toISOString(),
          };
          newCasesToAdd.push(newTc);
          existingTitles.add(unmatched.cleanTestName.toLowerCase().trim());
        }
      }

      if (newCasesToAdd.length > 0) {
        createdTestCaseCount = newCasesToAdd.length;
        setTestCases((prev) => [...newCasesToAdd, ...prev]);
      }
    }

    const createdRun: AutomationRun = {
      id: formattedId,
      projectId: currentProject.id,
      runName: runName || document.fileName || `JUnit XML Import Run #${projectAutoRuns.length + 1}`,
      framework: 'playwright',
      runner: 'JUnit Ingestion Pipeline',
      environment: environmentName || 'CI Staging Cluster',
      buildNumber: `build-${Date.now().toString(36)}`,
      branch: 'main',
      commitHash: Math.random().toString(36).substring(2, 9),
      startTime: new Date(Date.now() - (document.durationMs || 60000)).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: Math.round((document.durationMs || 60000) / 1000),
      totalTests: document.totalTests,
      passed: document.passed,
      failed: document.failed,
      skipped: document.skipped,
      errors: document.errors,
      flaky: 0,
      status: 'completed',
      isPartial: false,
      rawResultHash: document.fileHash,
      results: document.normalizedResults.map((tc, idx) => ({
        id: `xml-res-${idx + 1}`,
        automationTestId: tc.matchedTestCaseId || `${currentProject.key}-AUTO-GEN-${idx + 1}`,
        testIdRef: tc.testIdRef,
        suiteIdRef: tc.suiteIdRef,
        testName: tc.testName,
        suiteName: tc.suiteName,
        className: tc.className,
        status: tc.status,
        rawStatus: tc.rawStatus,
        durationMs: tc.durationMs,
        errorMessage: tc.failureMessage || tc.errorDetails,
        stackTrace: tc.stackTrace,
        sourceFile: tc.sourceFile || tc.className,
        sourceLine: tc.sourceLine,
        screenshotUrl: tc.stdout?.includes('data:image') ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' : undefined,
      })),
    };

    setAutomationRuns((prev) => [createdRun, ...prev]);
    logActivity('imported', 'automation', createdRun.id, createdRun.runName, `Ingested ${document.totalTests} JUnit test results`);

    addToast({
      type: 'success',
      title: 'XML Results Ingested',
      message: `${document.passed} Passed, ${document.failed + document.errors} Failed. ${createdTestCaseCount} test cases auto-created.`,
    });

    return {
      run: createdRun,
      createdTestCaseCount,
      matchedCount: document.normalizedResults.filter((r) => r.matchType !== 'unmatched').length,
      unmatchedCount: document.unmatchedCount,
    };
  };

  const addAutomationResultComment = (runId: string, resultId: string, text: string) => {
    setAutomationRuns((prev) =>
      prev.map((run) => {
        if (run.id !== runId) return run;
        return {
          ...run,
          results: run.results.map((res) => {
            if (res.id !== resultId) return res;
            const newComment = {
              id: 'comm-' + Date.now().toString(36),
              authorId: currentUser.id,
              text: text.trim(),
              createdAt: new Date().toISOString(),
            };
            return {
              ...res,
              comments: [...(res.comments || []), newComment],
            };
          }),
        };
      })
    );
    addToast({ type: 'success', title: 'Triage note added' });
  };

  const createDefectFromAutomationFailure = (runId: string, resultId: string): Defect => {
    const run = automationRuns.find((r) => r.id === runId);
    const result = run?.results.find((res) => res.id === resultId);
    if (!result) throw new Error('Result not found');

    const projectDefects = defects.filter((d) => d.projectId === currentProject.id);
    const nextNumber = projectDefects.length + 1;
    const formattedId = `${currentProject.key}-BUG-${String(nextNumber).padStart(4, '0')}`;

    const newDefect: Defect = {
      id: formattedId,
      projectId: currentProject.id,
      title: `[Automation Failure] ${result.testName.slice(0, 100)}`,
      description: `### Automation Failure Diagnostic\n\n**Run:** ${run?.runName} (${run?.id})\n**Test:** ${result.testName}\n**Error Message:**\n\`\`\`\n${result.errorMessage || 'Unknown failure'}\n\`\`\`\n\n**Stack Trace:**\n\`\`\`\n${result.stackTrace || 'No stack trace captured'}\n\`\`\``,
      severity: 'critical',
      priority: 'high',
      status: 'open',
      reporterId: currentUser.id,
      assigneeId: currentUser.id,
      linkedTestCaseId: result.matchedTestCaseId || undefined,
      linkedTestRunId: runId,
      environmentId: run?.environment || 'CI Pipeline',
      stepsToReproduce: result.logs && result.logs.length > 0 ? result.logs.join('\n') : '1. Run CI automation pipeline\n2. Inspect failure report',
      actualResult: result.errorMessage || 'Execution threw an uncaught error',
      expectedResult: 'Automated test completes with 0 assertion failures',
      tags: ['automation-failure', 'ci-triage', run?.framework || 'playwright'],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDefects((prev) => [newDefect, ...prev]);

    // Link defect back to result
    setAutomationRuns((prev) =>
      prev.map((r) => {
        if (r.id !== runId) return r;
        return {
          ...r,
          results: r.results.map((res) => (res.id === resultId ? { ...res, linkedDefectId: newDefect.id } : res)),
        };
      })
    );

    logActivity('created', 'defect', newDefect.id, newDefect.title, `Generated from test failure in ${run?.runName}`);
    addToast({
      type: 'success',
      title: `Logged ${newDefect.id}`,
      message: 'Defect created and linked to automation failure.',
    });

    return newDefect;
  };

  const updateGitLabConfig = (updates: Partial<GitLabIntegrationConfig>) => {
    setGitlabConfig((prev) => ({ ...prev, ...updates }));
    addToast({ type: 'success', title: 'GitLab Integration updated' });
  };

  const triggerGitLabPipelineMock = async (): Promise<AutomationRun> => {
    const projectAutoRuns = automationRuns.filter((r) => r.projectId === currentProject.id);
    const newPipelineId = Math.floor(Math.random() * 2000 + 1000);
    const formattedId = `${currentProject.key}-ARUN-${String(projectAutoRuns.length + 1).padStart(4, '0')}`;

    const newRun: AutomationRun = {
      id: formattedId,
      projectId: currentProject.id,
      runName: `GitLab CI/CD Pipeline #${newPipelineId} (Branch: ${gitlabConfig.defaultBranch})`,
      framework: 'playwright',
      runner: 'GitLab CI Runner / Docker',
      environment: 'GitLab Runner / Staging Cluster',
      buildNumber: `pipeline-${newPipelineId}.job-4991`,
      branch: gitlabConfig.defaultBranch,
      commitHash: Math.random().toString(36).substring(2, 9),
      startTime: new Date(Date.now() - 42000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: 42,
      totalTests: 126,
      passed: 118,
      failed: 6,
      skipped: 2,
      errors: 0,
      flaky: 3,
      status: 'completed',
      isPartial: false,
      externalRunId: `gl-pipe-${newPipelineId}`,
      pipelineMetadata: {
        pipelineId: newPipelineId,
        jobId: 4991,
        branch: gitlabConfig.defaultBranch,
        commitSha: Math.random().toString(36).substring(2, 10),
        commitMessage: `chore(ci): automated trigger by ${currentUser.name}`,
        pipelineUrl: `${gitlabConfig.gitlabUrl}/${gitlabConfig.projectPath}/-/pipelines/${newPipelineId}`,
        jobUrl: `${gitlabConfig.gitlabUrl}/${gitlabConfig.projectPath}/-/jobs/4991`,
        status: 'passed',
        triggeredBy: currentUser.name,
        startedAt: new Date(Date.now() - 42000).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: 42,
      },
      results: [
        {
          id: 'gl-sim-1',
          automationTestId: 'DEMO-AUTO-0001',
          testIdRef: '@T10010001',
          suiteIdRef: '@S10014522',
          testName: 'auth/login.spec.ts: Valid user authentication with MFA @T10010001',
          suiteName: 'Authentication & Session Management',
          status: 'passed',
          rawStatus: 'passed',
          durationMs: 2410,
        },
        {
          id: 'gl-sim-2',
          automationTestId: 'DEMO-AUTO-0002',
          testIdRef: '@T10010002',
          suiteIdRef: '@S10014522',
          testName: 'auth/login.spec.ts: Account lockout after 5 consecutive failed login attempts @T10010002',
          suiteName: 'Authentication & Session Management',
          status: 'passed',
          rawStatus: 'passed',
          durationMs: 3010,
        },
        {
          id: 'gl-sim-3',
          automationTestId: 'DEMO-AUTO-0005',
          testIdRef: '@T10010005',
          suiteIdRef: '@S10014588',
          testName: 'transfers/fednow.spec.ts: Real-time FedNow sub-second settlement under $10k @T10010005',
          suiteName: 'ACH & FedNow Payment Gateway',
          status: 'failed',
          rawStatus: 'failure',
          durationMs: 4800,
          errorMessage: 'Timed out 5000ms waiting for expect(locator).toBeVisible()\nLocator: getByTestId("stepup-2fa-modal")',
          stackTrace: 'Error: Timed out 5000ms waiting for expect(locator).toBeVisible()',
        },
      ],
    };

    setAutomationRuns((prev) => [newRun, ...prev]);
    setGitlabConfig((prev) => ({
      ...prev,
      lastSyncAt: new Date().toISOString(),
      lastPipelineStatus: 'success',
    }));

    logActivity('executed', 'automation', newRun.id, newRun.runName, `Executed GitLab Pipeline #${newPipelineId}`);
    addToast({
      type: 'success',
      title: `GitLab Pipeline #${newPipelineId} Complete`,
      message: '118 passed, 6 failed, 2 skipped.',
    });

    return newRun;
  };

  // RBAC & PERMISSION EVALUATION
  const hasPermission = (permission: PermissionKey, scopeType: ScopeType = 'project', scopeTargetId: string = currentProject.id): boolean => {
    const result = evaluateUserPermission(currentUser, permission, scopeType, scopeTargetId, teams, customRoles);
    return result.granted;
  };

  const checkUserAccess = (
    userId: string,
    permission: PermissionKey,
    scopeType: ScopeType = 'project',
    scopeTargetId: string = currentProject.id
  ): AccessCheckResult => {
    const targetUser = users.find((u) => u.id === userId) || currentUser;
    return evaluateUserPermission(targetUser, permission, scopeType, scopeTargetId, teams, customRoles);
  };

  const createTeam = (teamData: Partial<Team>): Team => {
    const newTeam: Team = {
      id: 'team-' + Date.now().toString(36),
      name: teamData.name || 'New Team',
      description: teamData.description || '',
      color: teamData.color || '#2563eb',
      memberIds: teamData.memberIds || [currentUser.id],
      grants: teamData.grants || [
        {
          id: 'grant-' + Date.now().toString(36),
          roleId: 'qa',
          scopeType: 'project',
          scopeTargetId: currentProject.id,
          assignedAt: new Date().toISOString(),
          assignedBy: currentUser.id,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTeams((prev) => [...prev, newTeam]);
    logActivity('created', 'team', newTeam.id, newTeam.name);
    addToast({ type: 'success', title: `Team "${newTeam.name}" Created` });
    return newTeam;
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));
    addToast({ type: 'info', title: 'Team updated' });
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    addToast({ type: 'warning', title: 'Team removed' });
  };

  const addUserToTeam = (teamId: string, userId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        if (t.memberIds.includes(userId)) return t;
        return { ...t, memberIds: [...t.memberIds, userId], updatedAt: new Date().toISOString() };
      })
    );
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const existingTeams = u.teams || [];
        if (existingTeams.includes(teamId)) return u;
        return { ...u, teams: [...existingTeams, teamId] };
      })
    );
    addToast({ type: 'success', title: 'Member added to team' });
  };

  const removeUserFromTeam = (teamId: string, userId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        return { ...t, memberIds: t.memberIds.filter((id) => id !== userId), updatedAt: new Date().toISOString() };
      })
    );
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return { ...u, teams: (u.teams || []).filter((id) => id !== teamId) };
      })
    );
    addToast({ type: 'info', title: 'Member removed from team' });
  };

  const createCustomRole = (roleData: Partial<CustomRole>): CustomRole => {
    const newRole: CustomRole = {
      id: 'role-' + Date.now().toString(36),
      name: roleData.name || 'Custom Role',
      description: roleData.description || '',
      isBuiltIn: false,
      permissions: roleData.permissions || ['project.view', 'testcase.view'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomRoles((prev) => [...prev, newRole]);
    logActivity('created', 'role', newRole.id, newRole.name);
    addToast({ type: 'success', title: `Role "${newRole.name}" Created` });
    return newRole;
  };

  const updateCustomRole = (id: string, updates: Partial<CustomRole>) => {
    setCustomRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)));
    addToast({ type: 'info', title: 'Role updated' });
  };

  const deleteCustomRole = (id: string) => {
    const target = customRoles.find((r) => r.id === id);
    if (target?.isBuiltIn) {
      addToast({ type: 'error', title: 'Cannot Delete', message: 'Built-in system roles cannot be removed.' });
      return;
    }
    setCustomRoles((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'warning', title: 'Role deleted' });
  };

  const syncAutomatedTestCasesIntoTms = (params: {
    targetSuiteId?: string;
    targetFolderId?: string;
    testsToSync: Array<{
      title: string;
      suiteName?: string;
      filePath?: string;
      framework?: string;
      testIdTag?: string;
      steps?: Array<{ action: string; expectedResult?: string }>;
      description?: string;
      priority?: TestCasePriority;
      testType?: TestType;
    }>;
  }): { createdCount: number; updatedCount: number; testCaseIds: string[] } => {
    let createdCount = 0;
    let updatedCount = 0;
    const resultIds: string[] = [];

    const targetSuite =
      suites.find((s) => s.id === params.targetSuiteId && s.projectId === currentProject.id) ||
      suites.find((s) => s.projectId === currentProject.id) ||
      suites[0];
    const defaultSuiteId = targetSuite?.id || 'suite-1';
    const defaultFolderId = params.targetFolderId || folders.find((f) => f.suiteId === defaultSuiteId)?.id || undefined;

    let updatedTestCases = [...testCases];
    let updatedAutoTests = [...automatedTests];

    params.testsToSync.forEach((test) => {
      const matchedCaseIndex = updatedTestCases.findIndex((tc) => {
        if (tc.projectId !== currentProject.id) return false;
        if (test.testIdTag && (tc.id === test.testIdTag || tc.tags?.includes(test.testIdTag))) return true;
        return tc.title.trim().toLowerCase() === test.title.trim().toLowerCase();
      });

      if (matchedCaseIndex >= 0) {
        const existingCase = updatedTestCases[matchedCaseIndex];
        const newSteps =
          test.steps && test.steps.length > 0
            ? test.steps.map((st, sIdx) => ({
                id: `step-${sIdx + 1}`,
                stepNumber: sIdx + 1,
                action: st.action,
                expectedResult: st.expectedResult || 'Step passes successfully without error.',
              }))
            : existingCase.steps;

        const updatedCase: TestCase = {
          ...existingCase,
          automationStatus: 'automated',
          steps: newSteps,
          updatedBy: currentUser.name,
          updatedAt: new Date().toISOString(),
        };

        updatedTestCases[matchedCaseIndex] = updatedCase;
        resultIds.push(updatedCase.id);
        updatedCount++;
      } else {
        const projectCases = updatedTestCases.filter((tc) => tc.projectId === currentProject.id);
        const nextNumber = projectCases.length + 1;
        const formattedId = test.testIdTag || `${currentProject.key}-TC-${String(nextNumber).padStart(4, '0')}`;

        const steps: TestCaseStep[] =
          test.steps && test.steps.length > 0
            ? test.steps.map((st, sIdx) => ({
                id: `step-${sIdx + 1}`,
                stepNumber: sIdx + 1,
                action: st.action,
                expectedResult: st.expectedResult || 'Assertion satisfies expected condition.',
              }))
            : [
                {
                  id: 'step-1',
                  stepNumber: 1,
                  action: `Automated test execution: ${test.title}`,
                  expectedResult: 'Spec asserts all test conditions successfully.',
                },
              ];

        const newTestCase: TestCase = {
          id: formattedId,
          projectId: currentProject.id,
          suiteId: defaultSuiteId,
          folderId: defaultFolderId || '',
          title: test.title,
          summary: test.title,
          description: test.description || `Synced automated test case from ${test.filePath || 'code repository'}.`,
          preconditions: 'Automated test suite environment initialized with test fixtures.',
          testType: test.testType || 'functional',
          priority: test.priority || 'high',
          severity: 'major',
          status: 'ready',
          automationStatus: 'automated',
          testLevel: 'e2e',
          component: test.suiteName || 'Automated Suite',
          module: 'Automation Sync',
          ownerId: currentUser.id,
          assigneeId: currentUser.id,
          tags: ['automated', test.framework || 'playwright', test.testIdTag || formattedId].filter(Boolean) as string[],
          environment: 'QA Sandbox',
          estimatedDurationMinutes: 2,
          steps,
          parameters: {},
          customFields: {},
          version: 1,
          history: [],
          linkedRequirementIds: [],
          createdBy: currentUser.name,
          createdAt: new Date().toISOString(),
          updatedBy: currentUser.name,
          updatedAt: new Date().toISOString(),
        };

        updatedTestCases.unshift(newTestCase);
        resultIds.push(newTestCase.id);
        createdCount++;

        const existingAuto = updatedAutoTests.find((at) => at.name === test.title && at.projectId === currentProject.id);
        if (!existingAuto) {
          const newAutoTest: AutomatedTest = {
            id: `aut-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            projectId: currentProject.id,
            name: test.title,
            framework: (test.framework as any) || 'playwright',
            language: 'typescript',
            repository: 'git@gitlab.internal.bank/qa/core-banking-e2e.git',
            filePath: test.filePath || 'tests/e2e/specs/automated.spec.ts',
            testPath: test.filePath || 'tests/e2e/specs/automated.spec.ts',
            suite: test.suiteName || 'Automated Regression',
            tags: ['automated', test.framework || 'playwright', test.testIdTag || formattedId].filter(Boolean) as string[],
            status: 'active',
            lastResult: 'passed',
            lastRunAt: new Date().toISOString(),
            durationMs: 1450,
            ownerId: currentUser.id,
            linkedTestCaseId: newTestCase.id,
            isFlaky: false,
            failureCountLast10: 0,
          };
          updatedAutoTests.unshift(newAutoTest);
        }
      }
    });

    setTestCases(updatedTestCases);
    setAutomatedTests(updatedAutoTests);

    logActivity(
      'created',
      'test_case',
      `sync-${Date.now()}`,
      `Automated Test Sync (${createdCount} created, ${updatedCount} updated)`
    );

    addToast({
      type: 'success',
      title: 'Automated Test Sync Complete',
      message: `Provisioned ${createdCount} new test cases, synchronized ${updatedCount} existing in TestOne.`,
    });

    return { createdCount, updatedCount, testCaseIds: resultIds };
  };

  const triggerMockAutomationRun = (framework: string = 'playwright'): AutomationRun => {
    const projectAutoRuns = automationRuns.filter((r) => r.projectId === currentProject.id);
    const formattedId = `${currentProject.key}-ARUN-${String(projectAutoRuns.length + 1).padStart(4, '0')}`;

    const tests = automatedTests.filter((t) => t.projectId === currentProject.id);
    const total = tests.length || 6;
    const passed = Math.max(1, total - 1);
    const failed = 1;

    const newRun: AutomationRun = {
      id: formattedId,
      projectId: currentProject.id,
      runName: `Manual Trigger: ${framework.toUpperCase()} Regression Suite #${projectAutoRuns.length + 500}`,
      framework: (framework as any) || 'playwright',
      environment: 'QA Sandbox (AWS us-east-1)',
      buildNumber: `v2.5.0-build.${Math.floor(Math.random() * 9000 + 1000)}`,
      branch: 'release/2.5.0',
      commitHash: Math.random().toString(36).substring(2, 9),
      startTime: new Date(Date.now() - 300000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: 300,
      totalTests: total,
      passed,
      failed,
      skipped: 0,
      flaky: 1,
      status: 'completed',
      results: tests.map((t, idx) => ({
        id: `res-${idx + 1}`,
        automationTestId: t.id,
        testName: t.name,
        status: idx === tests.length - 1 ? 'failed' : 'passed',
        durationMs: t.durationMs || 2200,
        logs: [
          `[00:0${idx}:01] [fixture] Initialized browser context in Chromium`,
          `[00:0${idx}:02] [action] Executing assertion steps for ${t.filePath}`,
          idx === tests.length - 1
            ? `[00:0${idx}:05] [error] Assertion failed: expected 200 OK but received 403 StepUpRequired`
            : `[00:0${idx}:03] [success] All 4 assertions passed in ${t.durationMs}ms`,
        ],
        errorMessage: idx === tests.length - 1 ? 'AssertionError: Expected HTTP 200 but received 403' : undefined,
      })),
    };

    setAutomationRuns((prev) => [newRun, ...prev]);
    addToast({ type: 'success', title: `Automation Run Finished`, message: `${passed} passed, ${failed} failed` });
    return newRun;
  };

  // REUSABLE STEPS & TEMPLATES
  const createReusableStep = (stepData: Partial<ReusableStep>): ReusableStep => {
    const newStep: ReusableStep = {
      id: 'step-' + Date.now().toString(36),
      projectId: currentProject.id,
      title: stepData.title || 'Reusable Action',
      action: stepData.action || '',
      testData: stepData.testData || '',
      expectedResult: stepData.expectedResult || '',
      tags: stepData.tags || ['common'],
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReusableSteps((prev) => [...prev, newStep]);
    addToast({ type: 'success', title: 'Reusable Step Created', message: newStep.title });
    return newStep;
  };

  const updateReusableStep = (id: string, updates: Partial<ReusableStep>) => {
    setReusableSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)));
    addToast({ type: 'info', title: 'Reusable Step Updated' });
  };

  const deleteReusableStep = (id: string) => {
    setReusableSteps((prev) => prev.filter((s) => s.id !== id));
    addToast({ type: 'warning', title: 'Reusable Step Deleted' });
  };

  const createTemplate = (tmplData: Partial<TestCaseTemplate>): TestCaseTemplate => {
    const newTmpl: TestCaseTemplate = {
      id: 'tmpl-' + Date.now().toString(36),
      projectId: currentProject.id,
      name: tmplData.name || 'Custom Template',
      description: tmplData.description || '',
      testType: tmplData.testType || 'functional',
      priority: tmplData.priority || 'medium',
      preconditions: tmplData.preconditions || '',
      defaultSteps: tmplData.defaultSteps || [],
      tags: tmplData.tags || ['custom'],
    };
    setTemplates((prev) => [...prev, newTmpl]);
    addToast({ type: 'success', title: 'Template Created', message: newTmpl.name });
    return newTmpl;
  };

  // SAVED VIEWS
  const createSavedView = (name: string, entityType: 'test_cases' | 'test_runs' | 'defects', filters: Record<string, any>): SavedView => {
    const newView: SavedView = {
      id: 'view-' + Date.now().toString(36),
      projectId: currentProject.id,
      name,
      entityType,
      filters,
    };
    setSavedViews((prev) => [...prev, newView]);
    addToast({ type: 'success', title: `Saved View "${name}"` });
    return newView;
  };

  const deleteSavedView = (id: string) => {
    setSavedViews((prev) => prev.filter((v) => v.id !== id));
  };

  // SETTINGS & CONFIG
  const createProject = (projectData: {
    name: string;
    key: string;
    description?: string;
    color?: string;
    ownerId?: string;
  }): Project => {
    const rawKey = projectData.key.trim().toUpperCase() || 'PROJ';
    const cleanKey = rawKey.replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'PROJ';
    const newProjId = 'proj-' + Date.now().toString(36);

    const defaultEnvId = 'env-' + newProjId + '-qa';
    const defaultSuiteId = 'suite-' + newProjId + '-core';
    const defaultFolderId = 'fld-' + newProjId + '-gen';

    const newProject: Project = {
      id: newProjId,
      name: projectData.name.trim() || 'New Project',
      key: cleanKey,
      description: projectData.description || `Quality workspace for ${projectData.name}`,
      color: projectData.color || '#2563eb',
      ownerId: projectData.ownerId || currentUser.id || 'usr-1',
      status: 'active',
      defaultEnvironmentId: defaultEnvId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto-bootstrap starter environments
    const newEnv: Environment = {
      id: defaultEnvId,
      projectId: newProjId,
      name: 'QA Environment',
      type: 'qa',
      url: 'https://qa.local',
      browser: 'Chrome, Firefox, Safari',
      os: 'Linux Ubuntu',
      description: `Default validation environment for ${newProject.name}`,
      isDefault: true,
    };

    const newStagingEnv: Environment = {
      id: 'env-' + newProjId + '-stg',
      projectId: newProjId,
      name: 'Staging Environment',
      type: 'staging',
      url: 'https://staging.local',
      browser: 'Cross-browser & Mobile Emulators',
      os: 'Cloud Replica',
      description: 'Pre-production staging cluster.',
      isDefault: false,
    };

    // Auto-bootstrap initial release
    const newRelease: Release = {
      id: 'rel-' + newProjId + '-1',
      projectId: newProjId,
      name: 'Release 1.0.0',
      version: '1.0.0',
      description: 'Initial project release milestone.',
      startDate: new Date().toISOString().split('T')[0],
      releaseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'in_progress',
    };

    // Auto-bootstrap root test suite & folder
    const newSuite: TestSuite = {
      id: defaultSuiteId,
      projectId: newProjId,
      name: 'Core Functional Suite',
      description: `Primary functional test coverage for ${newProject.name}`,
      ownerId: newProject.ownerId,
      tags: ['core', 'smoke'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newFolder: TestFolder = {
      id: defaultFolderId,
      projectId: newProjId,
      suiteId: defaultSuiteId,
      parentId: null,
      name: 'General & Smoke',
      description: 'Smoke and baseline test cases.',
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [...prev, newProject]);
    setEnvironments((prev) => [...prev, newEnv, newStagingEnv]);
    setReleases((prev) => [...prev, newRelease]);
    setSuites((prev) => [...prev, newSuite]);
    setFolders((prev) => [...prev, newFolder]);

    // Switch to the newly created project
    setCurrentProjectIdState(newProjId);
    setSelectedSuiteId(defaultSuiteId);
    setSelectedFolderId(defaultFolderId);
    setSelectedTestCaseId(null);
    setSelectedTestRunId(null);
    setSelectedPlanId(null);
    setSelectedDefectId(null);
    setSelectedRequirementId(null);

    logActivity('Created Project', 'project', newProjId, newProject.name, `Created project with prefix ${newProject.key}`);
    addToast({ type: 'success', title: 'Project Created', message: `Active project switched to "${newProject.name}" (${newProject.key})` });

    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)));
    addToast({ type: 'success', title: 'Project settings updated' });
  };

  const deleteProject = (id: string) => {
    if (projects.length <= 1) {
      addToast({ type: 'error', title: 'Cannot Delete', message: 'You must maintain at least one project.' });
      return;
    }

    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);

    // Cascade remove project entities
    setSuites((prev) => prev.filter((s) => s.projectId !== id));
    setFolders((prev) => prev.filter((f) => f.projectId !== id));
    setTestCases((prev) => prev.filter((tc) => tc.projectId !== id));
    setTestPlans((prev) => prev.filter((tp) => tp.projectId !== id));
    setTestRuns((prev) => prev.filter((tr) => tr.projectId !== id));
    setEnvironments((prev) => prev.filter((e) => e.projectId !== id));
    setReleases((prev) => prev.filter((r) => r.projectId !== id));
    setRequirements((prev) => prev.filter((req) => req.projectId !== id));
    setDefects((prev) => prev.filter((d) => d.projectId !== id));
    setAutomatedTests((prev) => prev.filter((a) => a.projectId !== id));
    setAutomationRuns((prev) => prev.filter((ar) => ar.projectId !== id));

    if (currentProjectId === id) {
      const fallbackProj = remaining[0];
      setCurrentProjectIdState(fallbackProj.id);
      setSelectedSuiteId(null);
      setSelectedFolderId(null);
      setSelectedTestCaseId(null);
      setSelectedTestRunId(null);
      setSelectedPlanId(null);
      setSelectedDefectId(null);
      setSelectedRequirementId(null);
    }

    addToast({ type: 'warning', title: 'Project Deleted', message: 'Project and all associated test assets were removed.' });
  };

  const createEnvironment = (envData: Partial<Environment>): Environment => {
    const newEnv: Environment = {
      id: 'env-' + Date.now().toString(36),
      projectId: currentProject.id,
      name: envData.name || 'New Environment',
      type: envData.type || 'qa',
      url: envData.url || 'https://qa.example.com',
      browser: envData.browser || 'Chrome, Firefox',
      os: envData.os || 'Linux',
      description: envData.description || '',
      isDefault: false,
    };
    setEnvironments((prev) => [...prev, newEnv]);
    addToast({ type: 'success', title: 'Environment Created', message: newEnv.name });
    return newEnv;
  };

  const updateEnvironment = (id: string, updates: Partial<Environment>) => {
    setEnvironments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    addToast({ type: 'info', title: 'Environment updated' });
  };

  const deleteEnvironment = (id: string) => {
    setEnvironments((prev) => prev.filter((e) => e.id !== id));
    addToast({ type: 'warning', title: 'Environment deleted' });
  };

  const createRelease = (relData: Partial<Release>): Release => {
    const newRel: Release = {
      id: 'rel-' + Date.now().toString(36),
      projectId: currentProject.id,
      name: relData.name || 'New Release',
      version: relData.version || '1.0.0',
      description: relData.description || '',
      startDate: relData.startDate || new Date().toISOString().split('T')[0],
      releaseDate: relData.releaseDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: relData.status || 'planning',
    };
    setReleases((prev) => [...prev, newRel]);
    addToast({ type: 'success', title: 'Release Created', message: newRel.name });
    return newRel;
  };

  const updateRelease = (id: string, updates: Partial<Release>) => {
    setReleases((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    addToast({ type: 'info', title: 'Release updated' });
  };

  const deleteRelease = (id: string) => {
    setReleases((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'warning', title: 'Release deleted' });
  };

  const createCustomField = (cfData: Partial<CustomField>): CustomField => {
    const newCf: CustomField = {
      id: 'cf-' + Date.now().toString(36),
      projectId: cfData.projectId || currentProject.id,
      name: cfData.name || 'Custom Field',
      key: cfData.key || 'customField',
      type: cfData.type || 'text',
      options: cfData.options || [],
      required: cfData.required || false,
      description: cfData.description || '',
      placeholder: cfData.placeholder || '',
      appliesTo: cfData.appliesTo || 'test_case',
    };
    setCustomFields((prev) => [...prev, newCf]);
    logActivity('Created Custom Field', 'custom_field', newCf.id, newCf.name);
    addToast({ type: 'success', title: 'Custom Field Added', message: newCf.name });
    return newCf;
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    logActivity('Updated Custom Field', 'custom_field', id, updates.name || id);
    addToast({ type: 'info', title: 'Custom Field Updated' });
  };

  const deleteCustomField = (id: string) => {
    const target = customFields.find((f) => f.id === id);
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
    logActivity('Deleted Custom Field', 'custom_field', id, target?.name || id);
    addToast({ type: 'warning', title: 'Custom Field Removed' });
  };

  // USERS & INVITATIONS
  const createUser = (userData: Partial<User>): User => {
    const newId = 'usr-' + Date.now().toString(36);
    const newUser: User = {
      id: newId,
      email: userData.email || `user.${Date.now()}@fintech.io`,
      name: userData.name || 'New Team Member',
      role: userData.role || 'qa',
      title: userData.title || 'Quality Engineer',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      status: userData.status || 'active',
      teams: userData.teams || ['team-qa'],
      projectIds: userData.projectIds || ['*'],
      directGrants: userData.directGrants || [
        {
          id: 'grant-' + Date.now().toString(36),
          roleId: userData.role || 'qa',
          scopeType: 'workspace',
          scopeTargetId: 'all',
          assignedAt: new Date().toISOString(),
          assignedBy: currentUser.id,
        },
      ],
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      isOwner: userData.role === 'owner',
    };

    setUsers((prev) => [...prev, newUser]);
    logActivity('Created User', 'user', newUser.id, newUser.name, `Created user with role ${newUser.role}`);
    addToast({ type: 'success', title: 'User Created', message: `${newUser.name} added to workspace.` });
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    logActivity('Updated User', 'user', id, updates.name || id, 'Updated user profile / permissions');
    addToast({ type: 'success', title: 'User Updated', message: 'User role and settings updated.' });
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target?.isOwner) {
      addToast({ type: 'error', title: 'Action Prohibited', message: 'The organization owner account cannot be removed.' });
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    logActivity('Deleted User', 'user', id, target?.name || id);
    addToast({ type: 'warning', title: 'User Removed', message: `${target?.name || 'User'} has been removed.` });
  };

  const deactivateUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target?.isOwner) {
      addToast({ type: 'error', title: 'Action Prohibited', message: 'The organization owner account cannot be suspended.' });
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isDeactivated: true, status: 'suspended' as const } : u))
    );
    logActivity('Suspended User Account', 'user', id, target?.name || id);
    addToast({ type: 'warning', title: 'User Account Suspended', message: `${target?.name || 'User'} has been suspended.` });
  };

  const reactivateUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isDeactivated: false, status: 'active' as const } : u))
    );
    logActivity('Reactivated User Account', 'user', id, target?.name || id);
    addToast({ type: 'success', title: 'User Account Activated', message: `${target?.name || 'User'} access has been restored.` });
  };

  const inviteUser = (inviteData: {
    email: string;
    name?: string;
    role: RoleType;
    teamIds?: string[];
    projectIds?: string[];
  }): UserInvitation => {
    const newInv: UserInvitation = {
      id: 'inv-' + Date.now().toString(36),
      email: inviteData.email.trim().toLowerCase(),
      name: inviteData.name?.trim() || inviteData.email.split('@')[0],
      role: inviteData.role,
      teamIds: inviteData.teamIds || ['team-qa'],
      projectIds: inviteData.projectIds || ['*'],
      invitedBy: currentUser.id,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'pending',
    };

    setInvitations((prev) => [newInv, ...prev]);
    logActivity('Sent User Invitation', 'user', newInv.id, newInv.email, `Invited with role ${newInv.role}`);
    addToast({
      type: 'success',
      title: 'Invitation Sent',
      message: `Invitation email dispatched to ${newInv.email}.`,
    });
    return newInv;
  };

  const resendInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId
          ? {
              ...inv,
              invitedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
              status: 'pending',
            }
          : inv
      )
    );
    addToast({ type: 'info', title: 'Invitation Resent', message: 'Updated access token and email dispatch.' });
  };

  const cancelInvitation = (invitationId: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    addToast({ type: 'warning', title: 'Invitation Cancelled' });
  };

  // LABELS
  const createLabel = (labelData: Partial<Label>): Label => {
    const newLbl: Label = {
      id: 'lbl-' + (labelData.name ? labelData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : Date.now().toString(36)),
      name: labelData.name?.trim() || 'new-label',
      color: labelData.color || '#3b82f6',
      description: labelData.description || '',
      category: labelData.category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLabels((prev) => [...prev, newLbl]);
    logActivity('Created Label', 'label', newLbl.id, newLbl.name);
    addToast({ type: 'success', title: 'Label Created', message: `Tag "${newLbl.name}" registered.` });
    return newLbl;
  };

  const updateLabel = (id: string, updates: Partial<Label>) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)));
    logActivity('Updated Label', 'label', id, updates.name || id);
    addToast({ type: 'info', title: 'Label updated' });
  };

  const deleteLabel = (id: string) => {
    const target = labels.find((l) => l.id === id);
    setLabels((prev) => prev.filter((l) => l.id !== id));
    logActivity('Deleted Label', 'label', id, target?.name || id);
    addToast({ type: 'warning', title: 'Label Deleted', message: `Tag "${target?.name}" removed.` });
  };

  // ACTIVITY & NOTIFICATIONS
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast({ type: 'info', title: 'Notifications cleared' });
  };

  // RESET ALL DEMO DATA
  const resetAllDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setProjects(INITIAL_PROJECTS);
    setCurrentProjectIdState('proj-demo');
    setCurrentUserIdState('usr-1');
    setSuites(INITIAL_SUITES);
    setFolders(INITIAL_FOLDERS);
    setTestCases(INITIAL_TEST_CASES);
    setTestPlans(INITIAL_TEST_PLANS);
    setTestRuns(INITIAL_TEST_RUNS);
    setEnvironments(INITIAL_ENVIRONMENTS);
    setReleases(INITIAL_RELEASES);
    setRequirements(INITIAL_REQUIREMENTS);
    setDefects(INITIAL_DEFECTS);
    setAutomatedTests(INITIAL_AUTOMATED_TESTS);
    setAutomationRuns(INITIAL_AUTOMATION_RUNS);
    setReusableSteps(INITIAL_REUSABLE_STEPS);
    setTemplates(INITIAL_TEMPLATES);
    setSavedViews(INITIAL_SAVED_VIEWS);
    setCustomFields(INITIAL_CUSTOM_FIELDS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTeams(INITIAL_TEAMS);
    setLabels(INITIAL_LABELS);
    setInvitations(INITIAL_INVITATIONS);
    setCustomRoles(INITIAL_CUSTOM_ROLES);
    addToast({ type: 'info', title: 'Reset Demo Data', message: 'All demo fixtures and projects restored.' });
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          setIsSearchOpen((prev) => !prev);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsQuickCreateOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsQuickCreateOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        navSection,
        setNavSection,
        selectedSuiteId,
        setSelectedSuiteId,
        selectedFolderId,
        setSelectedFolderId,
        selectedTestCaseId,
        setSelectedTestCaseId,
        selectedTestRunId,
        setSelectedTestRunId,
        selectedPlanId,
        setSelectedPlanId,
        selectedDefectId,
        setSelectedDefectId,
        selectedRequirementId,
        setSelectedRequirementId,
        selectedReportType,
        setSelectedReportType,

        currentProject,
        setCurrentProjectId,
        currentUser,
        setCurrentUserId,

        isSearchOpen,
        setIsSearchOpen,
        isQuickCreateOpen,
        setIsQuickCreateOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isAstImportModalOpen,
        setIsAstImportModalOpen,
        isXmlImportModalOpen,
        setIsXmlImportModalOpen,
        isQuickAddModalOpen,
        setIsQuickAddModalOpen,
        isAccessInspectorOpen,
        setIsAccessInspectorOpen,
        quickCreateType,
        setQuickCreateType,
        activeAutomationTab,
        setActiveAutomationTab,

        toasts,
        addToast,
        removeToast,

        users,
        projects,
        suites,
        folders,
        testCases,
        testPlans,
        testRuns,
        environments,
        releases,
        requirements,
        defects,
        automatedTests,
        automationRuns,
        reusableSteps,
        templates,
        savedViews,
        customFields,
        activityLogs,
        notifications,
        teams,
        labels,
        invitations,
        customRoles,
        gitlabConfig,
        sourceFiles,
        importRecords,
        resultDocuments,

        createUser,
        updateUser,
        deleteUser,
        deactivateUser,
        reactivateUser,
        inviteUser,
        createInvitation: inviteUser,
        resendInvitation,
        cancelInvitation,
        revokeInvitation: cancelInvitation,

        createLabel,
        updateLabel,
        deleteLabel,

        updateCustomField,
        deleteCustomField,

        quickAddTestCase,
        createTestCase,
        updateTestCase,
        duplicateTestCase,
        archiveTestCase,
        restoreTestCase,
        deleteTestCase,
        bulkUpdateTestCases,
        bulkDeleteTestCases,

        createSuite,
        updateSuite,
        deleteSuite,
        createFolder,
        updateFolder,
        deleteFolder,

        createTestPlan,
        updateTestPlan,
        deleteTestPlan,
        generateRunFromPlan,

        createTestRun,
        updateTestRun,
        deleteTestRun,
        updateRunStatus,
        updateTestRunStatus: updateRunStatus,
        recordTestExecution,

        createDefect,
        updateDefect,
        deleteDefect,
        addDefectComment,

        createRequirement,
        updateRequirement,
        deleteRequirement,

        createAutomatedTest,
        updateAutomatedTest,
        deleteAutomatedTest,
        triggerMockAutomationRun,
        saveSourceFiles,
        deleteSourceFile,
        syncAutomationTags,
        ingestXmlResults,
        addAutomationResultComment,
        createDefectFromAutomationFailure,
        syncAutomatedTestCasesIntoTms,

        updateGitLabConfig,
        triggerGitLabPipelineMock,

        hasPermission,
        checkUserAccess,
        createTeam,
        updateTeam,
        deleteTeam,
        addUserToTeam,
        removeUserFromTeam,
        createCustomRole,
        updateCustomRole,
        deleteCustomRole,

        createReusableStep,
        updateReusableStep,
        deleteReusableStep,
        createTemplate,

        createSavedView,
        deleteSavedView,

        createProject,
        updateProject,
        deleteProject,
        createEnvironment,
        updateEnvironment,
        deleteEnvironment,
        createRelease,
        updateRelease,
        deleteRelease,
        createCustomField,

        markNotificationRead,
        clearAllNotifications,
        logActivity,

        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
