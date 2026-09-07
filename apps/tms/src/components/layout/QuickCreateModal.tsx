import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileCode,
  CalendarCheck,
  PlayCircle,
  Bug,
  ListTodo,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { TestCasePriority, DefectSeverity, TestType } from '../../types';

export const QuickCreateModal: React.FC = () => {
  const {
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    quickCreateType,
    setQuickCreateType,
    createTestCase,
    createTestPlan,
    createTestRun,
    createDefect,
    createRequirement,
    suites,
    folders,
    environments,
    releases,
    testCases,
    currentProject,
    setNavSection,
    setSelectedTestCaseId,
    setSelectedTestRunId,
    setSelectedPlanId,
    setSelectedDefectId,
    setSelectedRequirementId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'test_case' | 'test_plan' | 'test_run' | 'defect' | 'requirement'>(
    quickCreateType || 'test_case'
  );

  // Form states
  const [tcTitle, setTcTitle] = useState('');
  const [tcDescription, setTcDescription] = useState('');
  const [tcPriority, setTcPriority] = useState<TestCasePriority>('medium');
  const [tcType, setTcType] = useState<TestType>('functional');
  const [tcSuiteId, setTcSuiteId] = useState(suites[0]?.id || '');
  const [tcStepAction, setTcStepAction] = useState('');
  const [tcStepExpected, setTcStepExpected] = useState('');

  // Plan state
  const [planName, setPlanName] = useState('');
  const [planObjective, setPlanObjective] = useState('');
  const [planReleaseId, setPlanReleaseId] = useState(releases[0]?.id || '');

  // Run state
  const [runName, setRunName] = useState('');
  const [runEnvId, setRunEnvId] = useState(environments[0]?.id || '');
  const [runBuild, setRunBuild] = useState('2.5.0-rc3');

  // Defect state
  const [defectTitle, setDefectTitle] = useState('');
  const [defectSeverity, setDefectSeverity] = useState<DefectSeverity>('major');
  const [defectSteps, setDefectSteps] = useState('');

  // Requirement state
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');

  if (!isQuickCreateOpen) return null;

  const handleClose = () => {
    setIsQuickCreateOpen(false);
    setQuickCreateType(null);
  };

  const handleCreateTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tcTitle.trim()) return;

    const created = createTestCase({
      title: tcTitle,
      description: tcDescription,
      priority: tcPriority,
      testType: tcType,
      suiteId: tcSuiteId || suites[0]?.id,
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          action: tcStepAction || 'Execute primary verification step',
          expectedResult: tcStepExpected || 'System displays expected confirmation result.',
        },
      ],
    });

    handleClose();
    setSelectedTestCaseId(created.id);
    setNavSection('repository');
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) return;

    const created = createTestPlan({
      name: planName,
      objective: planObjective,
      releaseId: planReleaseId,
      selectedTestCaseIds: testCases.filter((tc) => tc.projectId === currentProject.id).slice(0, 8).map((tc) => tc.id),
    });

    handleClose();
    setSelectedPlanId(created.id);
    setNavSection('test-plans');
  };

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runName.trim()) return;

    const testCaseIds = testCases.filter((tc) => tc.projectId === currentProject.id).slice(0, 10).map((tc) => tc.id);
    const created = createTestRun(
      {
        name: runName,
        environmentId: runEnvId,
        buildVersion: runBuild,
      },
      testCaseIds
    );

    handleClose();
    setSelectedTestRunId(created.id);
    setNavSection('test-runs');
  };

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectTitle.trim()) return;

    const created = createDefect({
      title: defectTitle,
      severity: defectSeverity,
      stepsToReproduce: defectSteps,
      environmentId: runEnvId,
      buildVersion: runBuild,
    });

    handleClose();
    setSelectedDefectId(created.id);
    setNavSection('defects');
  };

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    const created = createRequirement({
      title: reqTitle,
      description: reqDesc,
      releaseId: planReleaseId,
    });

    handleClose();
    setSelectedRequirementId(created.id);
    setNavSection('requirements');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Quick Create Item</h3>
            <p className="text-xs text-slate-500 mt-0.5">Add a new entity directly to {currentProject.name}</p>
          </div>
          <button onClick={handleClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 pt-2 gap-1 text-xs">
          {[
            { id: 'test_case', label: 'Test Case', icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: 'test_run', label: 'Test Run', icon: <PlayCircle className="w-3.5 h-3.5" /> },
            { id: 'test_plan', label: 'Test Plan', icon: <CalendarCheck className="w-3.5 h-3.5" /> },
            { id: 'defect', label: 'Defect / Bug', icon: <Bug className="w-3.5 h-3.5" /> },
            { id: 'requirement', label: 'Requirement', icon: <ListTodo className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-md font-medium border-t border-x transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 border-slate-200 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {activeTab === 'test_case' && (
            <form onSubmit={handleCreateTestCase} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Case Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify biometric passkey login on mobile browser"
                  value={tcTitle}
                  onChange={(e) => setTcTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suite</label>
                  <select
                    value={tcSuiteId}
                    onChange={(e) => setTcSuiteId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    {suites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={tcPriority}
                    onChange={(e) => setTcPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Type</label>
                  <select
                    value={tcType}
                    onChange={(e) => setTcType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="functional">Functional</option>
                    <option value="regression">Regression</option>
                    <option value="smoke">Smoke</option>
                    <option value="security">Security</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  placeholder="Describe testing objectives and scenarios..."
                  value={tcDescription}
                  onChange={(e) => setTcDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-700">Initial Step 1</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Action (e.g. Enter valid username and click Submit)"
                    value={tcStepAction}
                    onChange={(e) => setTcStepAction(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Expected Result (e.g. User dashboard opens)"
                    value={tcStepExpected}
                    onChange={(e) => setTcStepExpected(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Create Test Case
                </button>
              </div>
            </form>
          )}

          {activeTab === 'test_run' && (
            <form onSubmit={handleCreateRun} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Run Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint 25 Smoke - Safari Mac"
                  value={runName}
                  onChange={(e) => setRunName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Environment</label>
                  <select
                    value={runEnvId}
                    onChange={(e) => setRunEnvId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    {environments.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Build / Version Label</label>
                  <input
                    type="text"
                    value={runBuild}
                    onChange={(e) => setRunBuild(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-md border border-blue-200 text-blue-800 text-[11px]">
                💡 This will initialize the run with the first 10 active test cases from your repository for immediate execution.
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Create & Launch Run
                </button>
              </div>
            </form>
          )}

          {activeTab === 'test_plan' && (
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Release 2.6.0 International Payments Plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Release</label>
                <select
                  value={planReleaseId}
                  onChange={(e) => setPlanReleaseId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                >
                  {releases.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.version})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Objective & Scope</label>
                <textarea
                  rows={3}
                  placeholder="Define the primary quality gates and scope..."
                  value={planObjective}
                  onChange={(e) => setPlanObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Create Plan
                </button>
              </div>
            </form>
          )}

          {activeTab === 'defect' && (
            <form onSubmit={handleCreateDefect} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Defect Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session cookies not cleared after browser tab close"
                  value={defectTitle}
                  onChange={(e) => setDefectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={defectSeverity}
                  onChange={(e) => setDefectSeverity(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                >
                  <option value="critical">Critical / Blocker</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                  <option value="trivial">Trivial</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Steps to Reproduce</label>
                <textarea
                  rows={3}
                  placeholder="1. Navigate to ...&#10;2. Click ...&#10;3. Observe crash"
                  value={defectSteps}
                  onChange={(e) => setDefectSteps(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs font-mono outline-hidden"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs"
                >
                  Log Defect
                </button>
              </div>
            </form>
          )}

          {activeTab === 'requirement' && (
            <form onSubmit={handleCreateRequirement} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated PDF Statement Generation Compliance"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specification & Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed functional requirement and acceptance criteria..."
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Create Requirement
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
