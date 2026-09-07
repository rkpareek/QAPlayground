import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestCase } from '../../types';
import {
  X,
  Edit,
  Copy,
  Archive,
  RotateCcw,
  Trash2,
  PlayCircle,
  Layers,
  History,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  PriorityBadge,
  SeverityBadge,
  StatusBadge,
  ExecutionBadge,
  AutomationBadge,
} from '../common/Badges';

interface Props {
  testCaseId: string | null;
  onClose: () => void;
  onEdit: (tc: TestCase) => void;
}

export const TestCasePreviewDrawer: React.FC<Props> = ({ testCaseId, onClose, onEdit }) => {
  const {
    testCases,
    testRuns,
    requirements,
    defects,
    users,
    labels,
    customFields,
    duplicateTestCase,
    archiveTestCase,
    restoreTestCase,
    deleteTestCase,
    setNavSection,
    setSelectedTestRunId,
    setSelectedDefectId,
    setSelectedRequirementId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'steps' | 'history' | 'versions' | 'traceability'>('steps');

  if (!testCaseId) return null;

  const testCase = testCases.find((tc) => tc.id === testCaseId);
  if (!testCase) return null;

  const assignee = users.find((u) => u.id === testCase.assigneeId);
  const owner = users.find((u) => u.id === testCase.ownerId);

  // Find execution history across all runs
  const executionHistory = testRuns
    .flatMap((run) =>
      run.items
        .filter((item) => item.testCaseId === testCase.id)
        .map((item) => ({
          runId: run.id,
          runName: run.name,
          build: run.buildVersion,
          status: item.status,
          executedAt: item.executedAt || run.startDate,
          executedBy: users.find((u) => u.id === item.executedById)?.name || 'Automated Pipeline',
          durationSeconds: item.durationSeconds,
          notes: item.notes,
          defectIds: item.defectIds,
        }))
    )
    .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());

  // Linked Requirements
  const linkedReqs = requirements.filter((req) => testCase.linkedRequirementIds?.includes(req.id));

  // Linked Defects across executions
  const linkedDefectIds = Array.from(
    new Set(executionHistory.flatMap((h) => h.defectIds || []))
  );
  const linkedDefects = defects.filter((d) => linkedDefectIds.includes(d.id) || d.linkedTestCaseId === testCase.id);

  return (
    <div className="w-96 lg:w-[460px] bg-white border-l border-slate-200 flex flex-col shrink-0 h-full shadow-lg z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              {testCase.id}
            </span>
            <span className="text-[11px] font-mono text-slate-500">v{testCase.version}</span>
            {testCase.isArchived && (
              <span className="text-[10px] uppercase font-bold bg-zinc-200 text-zinc-700 px-1.5 py-0.2 rounded">
                Archived
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(testCase)}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="Edit Test Case"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => duplicateTestCase(testCase.id)}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            {testCase.isArchived ? (
              <button
                onClick={() => restoreTestCase(testCase.id)}
                className="p-1.5 rounded hover:bg-slate-200 text-emerald-600"
                title="Restore"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => archiveTestCase(testCase.id)}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-amber-600"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 leading-snug">{testCase.title}</h3>

        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <PriorityBadge priority={testCase.priority} />
          <SeverityBadge severity={testCase.severity} />
          <StatusBadge status={testCase.status} />
          <AutomationBadge status={testCase.automationStatus} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/50 px-4 text-xs font-semibold shrink-0">
        <button
          onClick={() => setActiveTab('steps')}
          className={`py-2.5 px-2 border-b-2 transition-colors ${
            activeTab === 'steps' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Steps ({testCase.steps.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 px-2 border-b-2 transition-colors ${
            activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Executions ({executionHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`py-2.5 px-2 border-b-2 transition-colors ${
            activeTab === 'versions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Versions ({testCase.history?.length ? testCase.history.length + 1 : 1})
        </button>
        <button
          onClick={() => setActiveTab('traceability')}
          className={`py-2.5 px-2 border-b-2 transition-colors ${
            activeTab === 'traceability' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Traceability ({linkedReqs.length + linkedDefects.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* TAB 1: STEPS */}
        {activeTab === 'steps' && (
          <div className="space-y-4">
            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Assignee</span>
                <div className="text-slate-800 font-medium">{assignee?.name || 'Unassigned'}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Est. Duration</span>
                <div className="text-slate-800 font-medium">{testCase.estimatedDurationMinutes} mins</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Test Type</span>
                <div className="text-slate-800 font-medium capitalize">{testCase.testType}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Component</span>
                <div className="text-slate-800 font-medium">{testCase.component || 'General'}</div>
              </div>
            </div>

            {/* Preconditions */}
            {testCase.preconditions && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                <div className="font-bold text-amber-900 mb-1">Preconditions</div>
                <div className="text-amber-800 leading-relaxed">{testCase.preconditions}</div>
              </div>
            )}

            {/* Description */}
            {testCase.description && (
              <div>
                <div className="font-bold text-slate-700 mb-1">Description</div>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {testCase.description}
                </p>
              </div>
            )}

            {/* Step List */}
            <div className="space-y-2">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Execution Steps ({testCase.steps.length})</span>
              </div>

              {testCase.steps.map((step, idx) => (
                <div key={step.id || idx} className="p-3 rounded-lg border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">Step {idx + 1}</span>
                    {step.isReusable && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-semibold">
                        Reusable
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pl-6">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Action:</span>
                      <div className="text-slate-800 font-medium leading-relaxed">{step.action}</div>
                    </div>

                    {step.testData && (
                      <div className="p-1.5 bg-slate-50 rounded border border-slate-100 font-mono text-[11px] text-slate-700">
                        <span className="text-[10px] font-semibold text-slate-400 block font-sans">Test Data:</span>
                        {step.testData}
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Expected:</span>
                      <div className="text-slate-700 leading-relaxed">{step.expectedResult}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags and Labels */}
            {testCase.tags && testCase.tags.length > 0 && (
              <div>
                <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" /> Labels & Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {testCase.tags.map((t) => {
                    const matchedLabel = labels.find((l) => l.name.toLowerCase() === t.toLowerCase());
                    return (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
                        style={
                          matchedLabel
                            ? { backgroundColor: `${matchedLabel.color}15`, color: matchedLabel.color, borderColor: `${matchedLabel.color}40` }
                            : { backgroundColor: '#f1f5f9', color: '#334155', borderColor: '#e2e8f0' }
                        }
                      >
                        {matchedLabel && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: matchedLabel.color }} />
                        )}
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Fields section */}
            {testCase.customFields && Object.keys(testCase.customFields).length > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Custom Fields
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(testCase.customFields).map(([key, val]) => {
                    const cfDef = customFields.find((f) => f.key === key);
                    const labelName = cfDef?.name || key;
                    const displayVal = Array.isArray(val)
                      ? val.join(', ')
                      : typeof val === 'boolean'
                      ? val ? 'Yes' : 'No'
                      : String(val);

                    if (!displayVal) return null;

                    return (
                      <div key={key} className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block truncate">
                          {labelName}
                        </span>
                        <div className="text-slate-800 font-medium text-[11px] truncate">
                          {cfDef?.type === 'url' ? (
                            <a
                              href={String(val)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              Open link <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            displayVal
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EXECUTION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {executionHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Clock className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                No execution records found for this test case.
              </div>
            ) : (
              executionHistory.map((exec, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedTestRunId(exec.runId);
                    setNavSection('test-execution');
                  }}
                  className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-colors space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{exec.runName}</span>
                    <ExecutionBadge status={exec.status} />
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>By: {exec.executedBy}</span>
                    <span>{exec.durationSeconds ? `${exec.durationSeconds}s` : '30s'}</span>
                  </div>
                  {exec.notes && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded italic">
                      "{exec.notes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: VERSION HISTORY */}
        {activeTab === 'versions' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900">Version {testCase.version} (Current)</span>
                <span className="text-[10px] text-blue-700">Active</span>
              </div>
              <div className="text-[11px] text-slate-600">Updated by {testCase.updatedBy || 'Alex Chen'}</div>
              <div className="text-[10px] text-slate-400">
                {new Date(testCase.updatedAt).toLocaleDateString()} at{' '}
                {new Date(testCase.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {testCase.history?.map((v) => (
              <div key={v.version} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>Version {v.version}</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {new Date(v.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">Author: {v.updatedBy}</div>
                <p className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded">
                  Change: {v.changeSummary || 'Metadata updated'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: TRACEABILITY */}
        {activeTab === 'traceability' && (
          <div className="space-y-4">
            <div>
              <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span>Linked Requirements ({linkedReqs.length})</span>
              </div>
              {linkedReqs.length === 0 ? (
                <div className="text-slate-400 text-xs italic">No linked requirements.</div>
              ) : (
                <div className="space-y-2">
                  {linkedReqs.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedRequirementId(req.id);
                        setNavSection('requirements');
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900">{req.id}</span>
                        <span className="font-semibold text-slate-800 truncate">{req.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span>Linked Defects ({linkedDefects.length})</span>
              </div>
              {linkedDefects.length === 0 ? (
                <div className="text-slate-400 text-xs italic">No defects recorded for this test case.</div>
              ) : (
                <div className="space-y-2">
                  {linkedDefects.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedDefectId(d.id);
                        setNavSection('defects');
                      }}
                      className="p-2.5 rounded-lg border border-red-200 bg-red-50/40 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-red-800">{d.id}</span>
                        <span className="text-[10px] font-semibold uppercase text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                          {d.severity}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-900 mt-1 line-clamp-1">{d.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
