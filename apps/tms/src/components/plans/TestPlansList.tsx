import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TestPlan, TestPlanStatus } from '../../types';
import {
  CalendarCheck,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  PlayCircle,
  FileCheck,
  CheckSquare,
  Square,
  Trash2,
  Edit,
  X,
  Target,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badges';

export const TestPlansList: React.FC = () => {
  const {
    currentProject,
    testPlans,
    testCases,
    releases,
    createTestPlan,
    updateTestPlan,
    deleteTestPlan,
    createTestRun,
    setSelectedTestRunId,
    setNavSection,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TestPlan | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');
  const [outOfScope, setOutOfScope] = useState('');
  const [releaseId, setReleaseId] = useState(releases[0]?.id || '');
  const [status, setStatus] = useState<TestPlanStatus>('active');
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);

  const projectCases = useMemo(
    () => testCases.filter((tc) => tc.projectId === currentProject.id && !tc.isArchived),
    [testCases, currentProject.id]
  );

  const projectPlans = useMemo(() => {
    return testPlans.filter((p) => {
      if (p.projectId !== currentProject.id) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.id.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.objective?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [testPlans, currentProject.id, statusFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setName('');
    setObjective('');
    setScope('');
    setOutOfScope('');
    setReleaseId(releases[0]?.id || '');
    setStatus('active');
    setSelectedCaseIds(projectCases.slice(0, 10).map((tc) => tc.id));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: TestPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setObjective(plan.objective || '');
    setScope(plan.scope || '');
    setOutOfScope(plan.outOfScope || '');
    setReleaseId(plan.releaseId || releases[0]?.id || '');
    setStatus(plan.status);
    setSelectedCaseIds(plan.selectedTestCaseIds || []);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      objective,
      scope,
      outOfScope,
      releaseId,
      status,
      selectedTestCaseIds: selectedCaseIds,
    };

    if (editingPlan) {
      updateTestPlan(editingPlan.id, payload);
    } else {
      createTestPlan(payload);
    }

    setIsModalOpen(false);
  };

  const handleLaunchPlanAsRun = (plan: TestPlan) => {
    const run = createTestRun(
      {
        name: `Plan Run: ${plan.name}`,
        description: plan.objective,
        releaseId: plan.releaseId,
        testPlanId: plan.id,
        environmentId: 'env-qa',
        buildVersion: '2.5.0-rc3',
      },
      plan.selectedTestCaseIds && plan.selectedTestCaseIds.length > 0
        ? plan.selectedTestCaseIds
        : projectCases.map((tc) => tc.id)
    );

    setSelectedTestRunId(run.id);
    setNavSection('test-execution');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Test Plans & Strategy</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
              {projectPlans.length} plans
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize milestones, quality criteria, risk assessment, and release test suites.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Test Plan</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search test plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-xs outline-hidden focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
        >
          <option value="all">All Plan Statuses</option>
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Plans List Cards */}
      <div className="space-y-4">
        {projectPlans.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200 space-y-2">
            <CalendarCheck className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700 text-sm">No Test Plans Configured</h3>
            <p className="text-xs text-slate-500">Create a test plan to define quality scope and milestones.</p>
          </div>
        ) : (
          projectPlans.map((plan) => {
            const rel = releases.find((r) => r.id === plan.releaseId);
            const totalCases = plan.selectedTestCaseIds?.length || 0;

            return (
              <div
                key={plan.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {plan.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          plan.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : plan.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {plan.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{plan.objective}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLaunchPlanAsRun(plan)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Execute Plan</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600"
                      title="Edit Plan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete plan ${plan.id}?`)) {
                          deleteTestPlan(plan.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Plan Metadata & Quality Gates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Target Release</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {rel ? `${rel.name} (${rel.version})` : 'Release 2.5.0'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Planned Scope</span>
                    <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      {totalCases} Test Cases
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Quality Criteria</span>
                    <div className="text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pass rate ≥ 95% • 0 Critical Bugs
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create / Edit Test Plan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl p-5 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPlan ? 'Edit Test Plan' : 'Create Test Plan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint 26 Cross-Browser & Security Test Plan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Release</label>
                  <select
                    value={releaseId}
                    onChange={(e) => setReleaseId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
                  >
                    {releases.map((rel) => (
                      <option key={rel.id} value={rel.id}>
                        {rel.name} ({rel.version})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Objective & Mission</label>
                <textarea
                  rows={2}
                  placeholder="Goals, acceptance criteria, and quality metrics..."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs outline-hidden"
                />
              </div>

              {/* Case Picker in Plan */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Selected Test Cases ({selectedCaseIds.length})
                </label>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 divide-y divide-slate-100 bg-slate-50">
                  {projectCases.map((tc) => {
                    const isChecked = selectedCaseIds.includes(tc.id);
                    return (
                      <label key={tc.id} className="flex items-center gap-2 p-1.5 hover:bg-white cursor-pointer rounded">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCaseIds([...selectedCaseIds, tc.id]);
                            else setSelectedCaseIds(selectedCaseIds.filter((id) => id !== tc.id));
                          }}
                          className="rounded text-blue-600"
                        />
                        <span className="font-mono font-bold text-slate-700">{tc.id}</span>
                        <span className="text-slate-800 truncate flex-1">{tc.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  {editingPlan ? 'Update Plan' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
