import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TestRun } from '../../types';
import {
  PlayCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  FastForward,
  Server,
  Calendar,
  Layers,
  ChevronRight,
  RotateCcw,
  Trash2,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { ExecutionBadge, StatusBadge } from '../common/Badges';
import { CreateTestRunModal } from './CreateTestRunModal';

export const TestRunsList: React.FC = () => {
  const {
    currentProject,
    testRuns,
    environments,
    releases,
    users,
    updateTestRunStatus,
    deleteTestRun,
    setSelectedTestRunId,
    setNavSection,
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [envFilter, setEnvFilter] = useState<string>('all');

  const projectRuns = useMemo(() => {
    return testRuns.filter((r) => {
      if (r.projectId !== currentProject.id) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (envFilter !== 'all' && r.environmentId !== envFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.buildVersion.toLowerCase().includes(q);
      }
      return true;
    });
  }, [testRuns, currentProject.id, statusFilter, envFilter, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Test Execution Runs</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
              {projectRuns.length} cycles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track manual and automated test execution passes, environments, and quality gates.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Test Run</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search test runs by title, ID, or build version..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-xs outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="aborted">Aborted</option>
          </select>

          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
          >
            <option value="all">All Environments</option>
            {environments.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Runs Grid */}
      <div className="space-y-4">
        {projectRuns.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200 space-y-2">
            <PlayCircle className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700 text-sm">No Test Runs Found</h3>
            <p className="text-xs text-slate-500">Launch a test run to start executing test cases.</p>
          </div>
        ) : (
          projectRuns.map((run) => {
            const env = environments.find((e) => e.id === run.environmentId);
            const total = run.items.length;
            const passed = run.items.filter((i) => i.status === 'passed').length;
            const failed = run.items.filter((i) => i.status === 'failed').length;
            const blocked = run.items.filter((i) => i.status === 'blocked').length;
            const notRun = run.items.filter((i) => i.status === 'not_run').length;
            const executed = passed + failed + blocked;
            const percent = total > 0 ? Math.round((executed / total) * 100) : 0;
            const passPercent = executed > 0 ? Math.round((passed / executed) * 100) : 0;

            return (
              <div
                key={run.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {run.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{run.name}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          run.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : run.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {run.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Server className="w-3.5 h-3.5 text-slate-400" />
                        {env?.name || run.environmentId} (Build: {run.buildVersion})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(run.startDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{total} test cases</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTestRunId(run.id);
                        setNavSection('test-execution');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Execute Cockpit</span>
                    </button>

                    {run.status === 'in_progress' ? (
                      <button
                        onClick={() => updateTestRunStatus(run.id, 'completed')}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => updateTestRunStatus(run.id, 'in_progress')}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Reopen
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Delete test run ${run.id}?`)) {
                          deleteTestRun(run.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete Run"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar and metrics */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${(passed / total) * 100}%` }}
                      title={`Passed: ${passed}`}
                    />
                    <div
                      className="bg-red-500 h-full transition-all"
                      style={{ width: `${(failed / total) * 100}%` }}
                      title={`Failed: ${failed}`}
                    />
                    <div
                      className="bg-amber-500 h-full transition-all"
                      style={{ width: `${(blocked / total) * 100}%` }}
                      title={`Blocked: ${blocked}`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {passed} Passed
                      </span>
                      <span className="text-red-700 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> {failed} Failed
                      </span>
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5" /> {blocked} Blocked
                      </span>
                      <span className="text-slate-500">{notRun} Untested</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span>
                        Progress: <strong className="text-slate-900">{percent}%</strong>
                      </span>
                      <span>
                        Pass Rate: <strong className="text-emerald-700">{passPercent}%</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      <CreateTestRunModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
