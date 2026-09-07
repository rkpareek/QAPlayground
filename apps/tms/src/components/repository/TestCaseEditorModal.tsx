import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TestCase,
  TestCaseStep,
  TestCasePriority,
  TestCaseSeverity,
  TestCaseStatus,
  TestType,
  AutomationStatus,
} from '../../types';
import {
  X,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Link,
  Tag,
  Check,
  Clock,
  BookOpen,
  Sliders,
} from 'lucide-react';

interface Props {
  testCase?: TestCase | null;
  isOpen: boolean;
  onClose: () => void;
  defaultSuiteId?: string;
  defaultFolderId?: string;
}

export const TestCaseEditorModal: React.FC<Props> = ({
  testCase,
  isOpen,
  onClose,
  defaultSuiteId,
  defaultFolderId,
}) => {
  const {
    currentProject,
    suites,
    folders,
    users,
    requirements,
    reusableSteps,
    templates,
    createTestCase,
    updateTestCase,
    automatedTests,
    customFields,
    labels,
  } = useApp();

  const isEditing = Boolean(testCase);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [preconditions, setPreconditions] = useState('');
  const [suiteId, setSuiteId] = useState('');
  const [folderId, setFolderId] = useState('');
  const [priority, setPriority] = useState<TestCasePriority>('medium');
  const [severity, setSeverity] = useState<TestCaseSeverity>('major');
  const [status, setStatus] = useState<TestCaseStatus>('ready');
  const [testType, setTestType] = useState<TestType>('functional');
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>('manual_only');
  const [automatedTestId, setAutomatedTestId] = useState('');
  const [testLevel, setTestLevel] = useState<'unit' | 'integration' | 'e2e' | 'acceptance'>('e2e');
  const [component, setComponent] = useState('');
  const [module, setModule] = useState('');
  const [feature, setFeature] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState(3);
  const [tags, setTags] = useState<string[]>(['functional']);
  const [tagInput, setTagInput] = useState('');
  const [linkedReqIds, setLinkedReqIds] = useState<string[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [steps, setSteps] = useState<TestCaseStep[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      action: '',
      testData: '',
      expectedResult: '',
    },
  ]);
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [changeSummary, setChangeSummary] = useState('');

  // Active sub-tab in editor
  const [activeTab, setActiveTab] = useState<'details' | 'steps' | 'parameters' | 'customFields' | 'links'>('steps');

  useEffect(() => {
    if (testCase) {
      setTitle(testCase.title);
      setSummary(testCase.summary || '');
      setDescription(testCase.description || '');
      setPreconditions(testCase.preconditions || '');
      setSuiteId(testCase.suiteId);
      setFolderId(testCase.folderId);
      setPriority(testCase.priority);
      setSeverity(testCase.severity);
      setStatus(testCase.status);
      setTestType(testCase.testType);
      setAutomationStatus(testCase.automationStatus);
      setAutomatedTestId(testCase.automatedTestId || '');
      setTestLevel(testCase.testLevel || 'e2e');
      setComponent(testCase.component || '');
      setModule(testCase.module || '');
      setFeature(testCase.feature || '');
      setAssigneeId(testCase.assigneeId || '');
      setEstimatedDurationMinutes(testCase.estimatedDurationMinutes || 3);
      setTags(testCase.tags || []);
      setLinkedReqIds(testCase.linkedRequirementIds || []);
      setCustomFieldValues(testCase.customFields || {});
      setSteps(
        testCase.steps && testCase.steps.length > 0
          ? testCase.steps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
          : [{ id: 'step-1', stepNumber: 1, action: '', testData: '', expectedResult: '' }]
      );
      setParameters(testCase.parameters || {});
    } else {
      // Defaults for creation
      const projectSuites = suites.filter((s) => s.projectId === currentProject.id);
      const selSuite = defaultSuiteId || projectSuites[0]?.id || 'suite-auth';
      const projectFolders = folders.filter((f) => f.projectId === currentProject.id && f.suiteId === selSuite);
      const selFolder = defaultFolderId || projectFolders[0]?.id || 'fld-login';

      setTitle('');
      setSummary('');
      setDescription('');
      setPreconditions('');
      setSuiteId(selSuite);
      setFolderId(selFolder);
      setPriority('medium');
      setSeverity('major');
      setStatus('ready');
      setTestType('functional');
      setAutomationStatus('manual_only');
      setAutomatedTestId('');
      setTestLevel('e2e');
      setComponent('');
      setModule('');
      setFeature('');
      setAssigneeId(users[0]?.id || '');
      setEstimatedDurationMinutes(3);
      setTags(['functional']);
      setLinkedReqIds([]);
      setCustomFieldValues({});
      setSteps([{ id: 'step-1', stepNumber: 1, action: '', testData: '', expectedResult: '' }]);
      setParameters({});
    }
  }, [testCase, isOpen, defaultSuiteId, defaultFolderId, suites, folders, currentProject.id, users]);

  if (!isOpen) return null;

  // Step Management
  const addStep = (index?: number) => {
    const newStep: TestCaseStep = {
      id: 'step-' + Date.now().toString(36),
      stepNumber: steps.length + 1,
      action: '',
      testData: '',
      expectedResult: '',
    };
    if (index !== undefined) {
      const next = [...steps];
      next.splice(index + 1, 0, newStep);
      setSteps(next.map((s, i) => ({ ...s, stepNumber: i + 1 })));
    } else {
      setSteps([...steps, newStep].map((s, i) => ({ ...s, stepNumber: i + 1 })));
    }
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) return;
    const next = steps.filter((s) => s.id !== id);
    setSteps(next.map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  const duplicateStep = (step: TestCaseStep, index: number) => {
    const duplicated: TestCaseStep = {
      ...step,
      id: 'step-' + Date.now().toString(36),
      stepNumber: index + 2,
    };
    const next = [...steps];
    next.splice(index + 1, 0, duplicated);
    setSteps(next.map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const next = [...steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setSteps(next.map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  const updateStepField = (id: string, field: keyof TestCaseStep, value: any) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Reusable Step Import
  const handleInsertReusableStep = (reusableId: string) => {
    const reusable = reusableSteps.find((r) => r.id === reusableId);
    if (!reusable) return;

    const newStep: TestCaseStep = {
      id: 'step-' + Date.now().toString(36),
      stepNumber: steps.length + 1,
      action: reusable.action,
      testData: reusable.testData || '',
      expectedResult: reusable.expectedResult,
      isReusable: true,
      reusableStepId: reusable.id,
    };
    setSteps([...steps, newStep].map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  // Template Import
  const handleApplyTemplate = (tmplId: string) => {
    const tmpl = templates.find((t) => t.id === tmplId);
    if (!tmpl) return;

    setTestType(tmpl.testType);
    setPriority(tmpl.priority);
    setPreconditions(tmpl.preconditions);
    setTags(Array.from(new Set([...tags, ...tmpl.tags])));
    setSteps(
      tmpl.defaultSteps.map((s, idx) => ({
        ...s,
        id: 'step-' + Date.now().toString(36) + idx,
        stepNumber: idx + 1,
      }))
    );
  };

  // Tag Add / Remove
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      summary,
      description,
      preconditions,
      suiteId,
      folderId,
      priority,
      severity,
      status,
      testType,
      automationStatus,
      automatedTestId: automationStatus === 'automated' ? automatedTestId : undefined,
      testLevel,
      component,
      module,
      feature,
      assigneeId,
      estimatedDurationMinutes: Number(estimatedDurationMinutes) || 3,
      tags,
      linkedRequirementIds: linkedReqIds,
      customFields: customFieldValues,
      steps: steps.filter((s) => s.action.trim() || s.expectedResult.trim()),
      parameters,
    };

    if (isEditing && testCase) {
      updateTestCase(testCase.id, payload, changeSummary || 'Updated test case in editor.');
    } else {
      createTestCase(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {isEditing ? testCase?.id : 'NEW TEST CASE'}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Test Case' : 'Create New Test Case'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Project: {currentProject.name}</p>
          </div>

          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation in Editor */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 bg-white">
          <div className="flex gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('steps')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'steps' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              Test Steps & Flow ({steps.length})
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'details' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              General Metadata
            </button>
            <button
              onClick={() => setActiveTab('customFields')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'customFields' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Custom Fields ({customFields.filter((cf) => !cf.projectId || cf.projectId === currentProject.id || cf.projectId === '*').length})
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'parameters' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Parameters ({Object.keys(parameters).length})
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'links' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Link className="w-4 h-4" />
              Traceability ({linkedReqIds.length})
            </button>
          </div>

          {/* Quick Template Picker */}
          {!isEditing && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Apply Template:</span>
              <select
                onChange={(e) => handleApplyTemplate(e.target.value)}
                defaultValue=""
                className="px-2 py-1 rounded border border-slate-300 text-xs bg-slate-50 text-slate-700"
              >
                <option value="" disabled>Select template...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Main Title - Always on top */}
          <div>
            <label className="block font-bold text-slate-800 text-xs mb-1">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Instant transfer between enrolled accounts with SMS verification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden shadow-2xs"
            />
          </div>

          {/* TAB 1: STEPS */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              {/* Preconditions */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preconditions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. User account is in good standing with $5,000+ checking balance..."
                  value={preconditions}
                  onChange={(e) => setPreconditions(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>

              {/* Reusable step insert bar */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-semibold text-slate-700">Test Execution Steps</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Insert Reusable Step:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleInsertReusableStep(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-700"
                  >
                    <option value="" disabled>Choose reusable step...</option>
                    {reusableSteps.map((r) => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step list */}
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800">Step {idx + 1}</span>
                        {step.isReusable && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-semibold">
                            Reusable
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveStep(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(idx, 'down')}
                          disabled={idx === steps.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateStep(step, idx)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Duplicate Step"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStep(step.id)}
                          disabled={steps.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30"
                          title="Delete Step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Action / Instruction *
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Enter {{username}} in login input..."
                          value={step.action}
                          onChange={(e) => updateStepField(step.id, 'action', e.target.value)}
                          className="w-full p-2 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Test Data (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Routing: 021000021, Amount: $500.00"
                          value={step.testData || ''}
                          onChange={(e) => updateStepField(step.id, 'testData', e.target.value)}
                          className="w-full p-2 rounded border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Expected Result *
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Confirmation modal appears with 200 OK"
                          value={step.expectedResult}
                          onChange={(e) => updateStepField(step.id, 'expectedResult', e.target.value)}
                          className="w-full p-2 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addStep()}
                  className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Next Step
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL METADATA */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suite *</label>
                  <select
                    value={suiteId}
                    onChange={(e) => {
                      setSuiteId(e.target.value);
                      const f = folders.find((fld) => fld.suiteId === e.target.value);
                      if (f) setFolderId(f.id);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    {suites
                      .filter((s) => s.projectId === currentProject.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Folder</label>
                  <select
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    {folders
                      .filter((f) => f.suiteId === suiteId)
                      .map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="critical">Critical (P0)</option>
                    <option value="high">High (P1)</option>
                    <option value="medium">Medium (P2)</option>
                    <option value="low">Low (P3)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="blocker">Blocker</option>
                    <option value="critical">Critical</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="trivial">Trivial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lifecycle Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="ready">Ready</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="draft">Draft</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="functional">Functional</option>
                    <option value="regression">Regression</option>
                    <option value="smoke">Smoke</option>
                    <option value="sanity">Sanity</option>
                    <option value="integration">Integration</option>
                    <option value="security">Security</option>
                    <option value="negative">Negative</option>
                    <option value="performance">Performance</option>
                    <option value="ui">UI</option>
                    <option value="api">API</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Automation Status</label>
                  <select
                    value={automationStatus}
                    onChange={(e) => setAutomationStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="manual_only">Manual Only</option>
                    <option value="automated">Automated</option>
                    <option value="automation_planned">Automation Planned</option>
                    <option value="automation_failed">Automation Broken</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assignee</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Linked Automation Test if automated */}
              {automationStatus === 'automated' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Linked Automated Test Script</label>
                  <select
                    value={automatedTestId}
                    onChange={(e) => setAutomatedTestId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="">Select automated test from registry...</option>
                    {automatedTests
                      .filter((a) => a.projectId === currentProject.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>{a.id} - {a.name} ({a.framework})</option>
                      ))}
                  </select>
                </div>
              )}

              {/* Hierarchy tags: Component, Module, Feature */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Component</label>
                  <input
                    type="text"
                    placeholder="e.g. Auth Gateway"
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Module</label>
                  <input
                    type="text"
                    placeholder="e.g. Security"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est Duration (Min)</label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedDurationMinutes}
                    onChange={(e) => setEstimatedDurationMinutes(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Tags and Labels Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Tags & Labels</label>
                  <span className="text-[11px] text-slate-500">Quickly assign registered organization labels below</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-md">
                  {tags.map((t) => {
                    const matchedLabel = labels.find((l) => l.name.toLowerCase() === t.toLowerCase());
                    return (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
                        style={
                          matchedLabel
                            ? { backgroundColor: `${matchedLabel.color}15`, color: matchedLabel.color, borderColor: `${matchedLabel.color}40` }
                            : { backgroundColor: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }
                        }
                      >
                        {matchedLabel && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: matchedLabel.color }} />
                        )}
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:opacity-75"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Add tag + Enter..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="px-2 py-0.5 text-xs bg-transparent outline-hidden w-28"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Available Labels Quick-Picker */}
                {labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-slate-500 mr-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Quick Add Label:
                    </span>
                    {labels.map((lbl) => {
                      const isSelected = tags.includes(lbl.name.toLowerCase());
                      return (
                        <button
                          key={lbl.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              handleRemoveTag(lbl.name.toLowerCase());
                            } else {
                              setTags([...tags, lbl.name.toLowerCase()]);
                            }
                          }}
                          className={`text-[11px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 transition-all ${
                            isSelected
                              ? 'ring-2 ring-blue-500 ring-offset-1 font-bold'
                              : 'hover:opacity-80'
                          }`}
                          style={{
                            backgroundColor: `${lbl.color}15`,
                            borderColor: `${lbl.color}40`,
                            color: lbl.color,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lbl.color }} />
                          {lbl.name}
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Detailed scenario descriptions, boundary limits, and expected behavior..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden"
                />
              </div>

              {/* Change summary if editing */}
              {isEditing && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Revision Summary (Version {testCase ? testCase.version + 1 : 2})
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Added step 4 for SMS 2FA verification"
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-amber-50/50"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB: CUSTOM FIELDS */}
          {activeTab === 'customFields' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold">Dynamic Custom Fields:</span> Organization and project-scoped fields configured for test cases.
                </div>
                <span className="text-[11px] text-slate-500">
                  {customFields.filter((cf) => !cf.projectId || cf.projectId === currentProject.id || cf.projectId === '*').length} fields available
                </span>
              </div>

              {customFields.filter((cf) => !cf.projectId || cf.projectId === currentProject.id || cf.projectId === '*').length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Sliders className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No Custom Fields Defined</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    Create custom fields in <span className="font-medium text-slate-700">Administration &gt; Custom Fields</span> to capture custom metadata like Jira Epic, Release Tier, Compliance Level, etc.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customFields
                    .filter((cf) => !cf.projectId || cf.projectId === currentProject.id || cf.projectId === '*')
                    .map((cf) => {
                      const val = customFieldValues[cf.key] ?? '';
                      return (
                        <div key={cf.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-slate-800">
                              {cf.name} {cf.required && <span className="text-red-500">*</span>}
                            </label>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                              {cf.type}
                            </span>
                          </div>

                          {cf.description && (
                            <p className="text-[11px] text-slate-500 mb-2">{cf.description}</p>
                          )}

                          {/* Field Input Renderer */}
                          {cf.type === 'text' && (
                            <input
                              type="text"
                              placeholder={cf.placeholder || `Enter ${cf.name}...`}
                              value={val}
                              onChange={(e) =>
                                setCustomFieldValues({ ...customFieldValues, [cf.key]: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                            />
                          )}

                          {cf.type === 'number' && (
                            <input
                              type="number"
                              placeholder={cf.placeholder || '0'}
                              value={val}
                              onChange={(e) =>
                                setCustomFieldValues({ ...customFieldValues, [cf.key]: e.target.value ? Number(e.target.value) : '' })
                              }
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                            />
                          )}

                          {cf.type === 'url' && (
                            <input
                              type="url"
                              placeholder={cf.placeholder || 'https://jira.internal.bank/browse/PROJ-123'}
                              value={val}
                              onChange={(e) =>
                                setCustomFieldValues({ ...customFieldValues, [cf.key]: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                            />
                          )}

                          {cf.type === 'date' && (
                            <input
                              type="date"
                              value={val}
                              onChange={(e) =>
                                setCustomFieldValues({ ...customFieldValues, [cf.key]: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                            />
                          )}

                          {cf.type === 'boolean' && (
                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                              <input
                                type="checkbox"
                                checked={Boolean(val)}
                                onChange={(e) =>
                                  setCustomFieldValues({ ...customFieldValues, [cf.key]: e.target.checked })
                                }
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs text-slate-700 font-medium">
                                {Boolean(val) ? 'Enabled / True' : 'Disabled / False'}
                              </span>
                            </label>
                          )}

                          {cf.type === 'dropdown' && (
                            <select
                              value={val}
                              onChange={(e) =>
                                setCustomFieldValues({ ...customFieldValues, [cf.key]: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                            >
                              <option value="">Select option...</option>
                              {(cf.options || []).map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          )}

                          {cf.type === 'multiselect' && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {(cf.options || []).map((opt) => {
                                const currentList: string[] = Array.isArray(val) ? val : [];
                                const isChecked = currentList.includes(opt);
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      const next = isChecked
                                        ? currentList.filter((item) => item !== opt)
                                        : [...currentList, opt];
                                      setCustomFieldValues({ ...customFieldValues, [cf.key]: next });
                                    }}
                                    className={`px-2 py-1 rounded text-xs border font-medium transition-all ${
                                      isChecked
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PARAMETERS */}
          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs">
                💡 Parameterize dynamic values in steps using <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">{'{{key}}'}</code> syntax. Values specified below will be substituted during execution runs.
              </div>

              <div className="space-y-2">
                {Object.entries(parameters).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="px-2.5 py-1.5 rounded border border-slate-200 bg-slate-100 text-xs font-mono w-40"
                    />
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => setParameters({ ...parameters, [key]: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...parameters };
                        delete next[key];
                        setParameters(next);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const k = prompt('Enter parameter variable name (e.g. username):');
                    if (k && !parameters[k]) {
                      setParameters({ ...parameters, [k]: 'default_value' });
                    }
                  }}
                  className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Parameter Variable
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TRACEABILITY / LINKED REQUIREMENTS */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Select requirements mapped to this test case to build end-to-end requirement traceability.
              </div>

              <div className="space-y-2">
                {requirements
                  .filter((req) => req.projectId === currentProject.id)
                  .map((req) => {
                    const isLinked = linkedReqIds.includes(req.id);
                    return (
                      <label
                        key={req.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isLinked ? 'bg-blue-50/70 border-blue-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isLinked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLinkedReqIds([...linkedReqIds, req.id]);
                            } else {
                              setLinkedReqIds(linkedReqIds.filter((id) => id !== req.id));
                            }
                          }}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">{req.id}</span>
                            <span className="font-semibold text-slate-800">{req.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{req.description}</p>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              {isEditing ? `Current: Version ${testCase?.version}` : 'Version 1 will be generated'}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
              >
                {isEditing ? 'Save Changes' : 'Create Test Case'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
